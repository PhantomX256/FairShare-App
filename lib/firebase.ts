import { auth } from "@/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  validateSignInCredentials,
  validateSignUpCredentials,
} from "./formValidation";
import { Alert } from "react-native";

/**
 * Signs in a user with the provided email and password.
 *
 * @throws An error if the sign-in process fails.
 */
export const signIn = async (email: string, password: string) => {
  try {
    // Validate the sign-in credentials
    validateSignInCredentials(email, password);

    // Sign in the user with the provided email and password
    const user = await signInWithEmailAndPassword(auth, email, password);

    // Return the user object
    return user;
  } catch (error: any) {
    // If the email or password is empty
    if (
      error.code === "ERR_EMPTY_EMAIL" ||
      error.code === "ERR_EMPTY_PASSWORD"
    ) {
      throw new Error(error.message);

      // If the email is invalid
    } else if (
      error.code === "ERR_INVALID_EMAIL" ||
      error.code === "auth/invalid-email"
    ) {
      throw new Error("Invalid email.");

      // If the user is not found
    } else if (error.code === "auth/user-not-found") {
      throw new Error("User not found.");

      // If the password is incorrect
    } else if (error.code === "auth/wrong-password") {
      throw new Error("Invalid password.");

      // General errors
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};

/**
 * Signs up a new user with the provided full name, email, password, and confirm password.
 *
 * @throws Will throw an error if any of the fields are empty, the password is too short, the passwords do not match, the email is invalid, or the email is already in use.
 */
export const signUp = async (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  try {
    // Validate the sign-up credentials
    validateSignUpCredentials(fullName, email, password, confirmPassword);

    // Sign up the user with the provided email and password
    const user = await createUserWithEmailAndPassword(auth, email, password);

    // Return the user object
    return user;
  } catch (error: any) {
    // If any of the fields are empty or the password is too short or the passwords do not match
    if (
      error.code === "ERR_EMPTY_FIELDS" ||
      error.code === "ERR_SHORT_PASSWORD" ||
      error.code === "ERR_PASSWORDS_MISMATCH"
    ) {
      throw new Error(error.message);

      // If the email is invalid
    } else if (
      error.code === "ERR_INVALID_EMAIL" ||
      error.code === "auth/invalid-email"
    ) {
      throw new Error("Invalid Email Address");

      // If the email is already in use
    } else if (error.code === "auth/email-already-in-use") {
      throw new Error("Email already in use.");

      // General errors
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};
