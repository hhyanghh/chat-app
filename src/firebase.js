import * as firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtrXqTKoghG6ohumq-Gb_5fKuTXZTcDKw",
  authDomain: "react-firebase-chat-app-4f83e.firebaseapp.com",
  projectId: "react-firebase-chat-app-4f83e",
  storageBucket: "react-firebase-chat-app-4f83e.appspot.com",
  messagingSenderId: "805274355862",
  appId: "1:805274355862:web:22918aa0be0b5980209ab7",
  measurementId: "G-76GGTFVQJ7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);
export const storage = getStorage();
firebase.initializeApp(firebaseConfig);

export const authService = getAuth();
export default firebase;
