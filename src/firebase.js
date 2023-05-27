import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

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

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 다른 Firebase 서비스 가져오기
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { app, auth, storage, database };
