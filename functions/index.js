const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { validatePatient, validateUser } = require("./validations");

admin.initializeApp();

const collectionName = "patient";

const convertDateToTimestamp = (dateString) => {
  const date = new Date(dateString);
  return admin.firestore.Timestamp.fromDate(date);
};

exports.getPatientsByProvider = functions.https.onCall(
  async (_data, context) => {
    const providerId = validateUser(context);

    try {
      const patientsSnapshot = await admin
        .firestore()
        .collection(collectionName)
        .where("providerId", "==", providerId)
        .get();

      if (patientsSnapshot.empty) {
        return { patients: [] };
      }

      let patients = [];
      patientsSnapshot.forEach((doc) => {
        patients.push({ id: doc.id, ...doc.data() });
      });

      return { patients };
    } catch (error) {
      console.error("Error getting patients: ", error);
      throw new functions.https.HttpsError(
        "internal",
        "Unable to fetch patients"
      );
    }
  }
);

exports.addPatient = functions.https.onCall(async (data, context) => {
  validateUser(context);

  const validation = validatePatient(data);
  if (!validation.valid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      validation.message
    );
  }

  try {
    data.dateOfBirth = convertDateToTimestamp(data.dateOfBirth);

    // Add patient to Firestore
    const patientRef = await admin
      .firestore()
      .collection(collectionName)
      .add({
        ...data,
        providerId: context.auth.uid, // Add the provider's UID to the patient data
        createdAt: admin.firestore.FieldValue.serverTimestamp(), // Optionally add a timestamp
      });

    return { id: patientRef.id };
  } catch (error) {
    console.error("Error adding patient: ", error);
    throw new functions.https.HttpsError("internal", "Unable to add patient");
  }
});

exports.saveAdditionalInfo = functions.https.onCall(async (data, context) => {
  const providerId = validateUser(context);
  const { patientId, additionalInfo } = data;

  try {
    const patientRef = admin.firestore().collection("patient").doc(patientId);
    const patientDoc = await patientRef.get();

    // a double check, this should never hit
    if (!patientDoc.exists || patientDoc.data().providerId !== providerId) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Provider does not have permission to update this patient."
      );
    }

    // Update the additionalInfo subcollection
    await patientRef
      .collection("additionalInfo")
      .doc("info")
      .set(additionalInfo);

    return { success: true };
  } catch (error) {
    console.error("Error saving additional info:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Unable to save additional info."
    );
  }
});

exports.fetchAdditionalInfo = functions.https.onCall(async (data, context) => {
  const { patientId } = data;
  const providerId = validateUser(context);

  try {
    const patientRef = admin.firestore().collection("patient").doc(patientId);
    const patientDoc = await patientRef.get();

    // Check if the patient exists and belongs to the provider
    if (!patientDoc.exists || patientDoc.data().providerId !== providerId) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Provider does not have permission to access this patient."
      );
    }

    // Fetch the additionalInfo subcollection or field
    const additionalInfoRef = patientRef
      .collection("additionalInfo")
      .doc("info");
    const additionalInfoDoc = await additionalInfoRef.get();

    if (!additionalInfoDoc.exists) {
      return { additionalInfo: {} };
    }

    return { additionalInfo: additionalInfoDoc.data() };
  } catch (error) {
    console.error("Error fetching additional info:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Unable to fetch additional info."
    );
  }
});
