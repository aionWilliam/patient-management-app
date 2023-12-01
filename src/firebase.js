import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnPk3f7KCwRO417FJZffB6jp6nBLnaOHI",
  authDomain: "patient-management-app-406321.firebaseapp.com",
  projectId: "patient-management-app-406321",
  storageBucket: "patient-management-app-406321.appspot.com",
  messagingSenderId: "468037423444",
  appId: "1:468037423444:web:d13be7b047698efe65b8c1",
  measurementId: "G-RBPX6K97E5",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// Export different firebase services
export const auth = getAuth(firebase);
export const firestore = getFirestore(firebase);

export default firebase;
