// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk7GH5qWonNMjvyqtUkbhnnGm6ZYxGjMY",
  authDomain: "fairshare-339ad.firebaseapp.com",
  projectId: "fairshare-339ad",
  storageBucket: "fairshare-339ad.firebasestorage.app",
  messagingSenderId: "337114458694",
  appId: "1:337114458694:web:704fc4def746a8ae7c3847",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
