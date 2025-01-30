// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBnX5oKBld3yRk15iVykNcWWIcWr7gSq1Y",
  authDomain: "employee-app-760d2.firebaseapp.com",
  projectId: "employee-app-760d2",
  storageBucket: "employee-app-760d2.appspot.com",
  messagingSenderId: "252149486489",
  appId: "1:252149486489:web:c4c6144953da81413b7908"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the Firestore and authentication objects
export { db, auth, collection, addDoc };