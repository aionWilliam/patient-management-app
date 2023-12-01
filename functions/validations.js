const _validateDateOfBirth = (dateOfBirth) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex to match YYYY-MM-DD format

  if (!regex.test(dateOfBirth)) {
    return false;
  }

  const date = new Date(dateOfBirth);
  const timestamp = date.getTime();

  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
    return false;
  }

  return true;
};

const validatePatient = (patient) => {
  const { firstName, lastName, address, dateOfBirth, status } = patient;
  const validStatuses = ["Inquiry", "Onboarding", "Active", "Churned"];

  if (!firstName || typeof firstName !== "string")
    return { valid: false, message: "Invalid or missing first name" };
  if (!lastName || typeof lastName !== "string")
    return { valid: false, message: "Invalid or missing last name" };
  if (!address || typeof address !== "string")
    return { valid: false, message: "Invalid or missing address" };
  if (!_validateDateOfBirth(dateOfBirth)) {
    return { valid: false, message: "Invalid or missing date of birth" };
  }
  if (!validStatuses.includes(status)) {
    return {
      valid: false,
      message: `Status must be one of the following: ${validStatuses.join(
        ", "
      )}`,
    };
  }

  return { valid: true, message: "Patient data is valid" };
};

const validateUser = (context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }
  return context.auth.uid;
};

module.exports = { validatePatient, validateUser };
