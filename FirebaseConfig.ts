// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk7GH5qWonNMjvyqtUkbhnnGm6ZYxGjMY",
  authDomain: "fairshare-339ad.firebaseapp.com",
  projectId: "fairshare-339ad",
  storageBucket: "fairshare-339ad.appspot.com",
  messagingSenderId: "337114458694",
  appId: "1:337114458694:web:704fc4def746a8ae7c3847",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(app);
