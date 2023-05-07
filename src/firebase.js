import "firebase/auth";
import "firebase/database";
import "firebase/storage";

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
