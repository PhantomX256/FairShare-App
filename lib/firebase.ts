import { auth } from "@/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Alert } from "react-native";

/**
 * Signs in a user with the provided email and password.
 *
 * @throws An error if the sign-in process fails.
 */
export const signIn = async (email: string, password: string) => {
  try {
    // Sign in the user with the provided email and password
    const user = await signInWithEmailAndPassword(auth, email, password);

    // Return the user object
    return user;
  } catch (error: any) {
    // If the email or password is invalid
    if (
      error.code === "auth/invalid-email" ||
      error.code === "auth/wrong-password"
    ) {
      throw new Error("Invalid email or password.");

      // If the user is not found
    } else if (error.code === "auth/user-not-found") {
      throw new Error("User not found.");

      // General errors
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error: any) {
    Alert.alert("Error", error.message);
  }
};
