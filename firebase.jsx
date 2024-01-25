// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAL4eaxbo76sVEFFnCuYZ40WYvoidKNrA8",
    authDomain: "wholeworld-28c53.firebaseapp.com",
    projectId: "wholeworld-28c53",
    storageBucket: "wholeworld-28c53.appspot.com",
    messagingSenderId: "974597569669",
    appId: "1:974597569669:web:51520251ee1dc90f8bfdec",
    measurementId: "G-CSX2JEK17S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
export const analytics = getAnalytics(app);