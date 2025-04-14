import { auth, db } from "@/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  validateSignInCredentials,
  validateSignUpCredentials,
} from "../formValidation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "../types";

/**
 * CustomError is a specialized error class that extends the built-in Error class.
 * It includes an additional `code` property to provide more context about the error.
 *
 * @extends {Error}
 */
class CustomError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "CustomError";
  }
}

/**
 * Signs in a user with the provided email and password and returns their data.
 *
 * @throws An error if the sign-in process fails.
 */
export const signIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    // Validate the sign-in credentials
    validateSignInCredentials(email, password);

    // Sign in the user with the provided email and password
    await signInWithEmailAndPassword(auth, email, password);

    // Fetch the user data using the userID
    const userData = await getCurrentUser();

    // Return the user object
    return userData;
  } catch (error: any) {
    // If the email or password is empty
    if (
      error.code === "ERR_EMPTY_EMAIL" ||
      error.code === "ERR_EMPTY_PASSWORD" ||
      error.code === "ERR_INVALID_EMAIL"
    ) {
      throw new Error(error.message);

      // If the email is invalid
    } else if (error.code === "auth/invalid-credential") {
      throw new Error("Invalid email or password.");

      // General errors
    } else {
      throw new Error("An unexpected error occurred.");
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
): Promise<User> => {
  try {
    // Validate the sign-up credentials
    validateSignUpCredentials(fullName, email, password, confirmPassword);

    // Sign up the user with the provided email and password
    const user = await createUserWithEmailAndPassword(auth, email, password);

    // Get the user ID
    const userId = user.user.uid;

    // Create a user data object
    const userData = {
      id: userId,
      fullName,
      email,
      friendIds: [],
      createdAt: new Date(),
    };

    // Create a user document in Firestore
    await setDoc(doc(db, "users", userId), userData);

    // Return the user object
    return userData;
  } catch (error: any) {
    // If any of the fields are empty or the password is too short or the passwords do not match
    if (
      error.code === "ERR_EMPTY_FIELDS" ||
      error.code === "ERR_SHORT_PASSWORD" ||
      error.code === "ERR_PASSWORD_MISMATCH" ||
      error.code === "ERR_INVALID_EMAIL"
    ) {
      throw new Error(error.message);
    } else if (error.code === "auth/email-already-in-use") {
      throw new Error("Email already in use.");

      // General errors
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};

/**
 * Logs out the currently authenticated user from Firebase.
 *
 * This function attempts to sign out the user from the Firebase authentication system.
 * If the operation fails, it throws an error with a generic message.
 *
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error("Failed to log out.");
  }
};

/**
 * Fetches the current user data from Firestore based on the provided user ID.
 *
 * @throws An error if the user document does not exist or if there is a failure in fetching the user data.
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Get the current user from firebase persistence
    const currentUser = auth.currentUser;

    // If there is no current user return null
    if (!currentUser) return null;

    // Get the current user's ID
    const userId = currentUser.uid;

    // Reference to the user document in Firestore
    const userDocRef = doc(db, "users", userId);

    // Fetch the user document
    const userDoc = await getDoc(userDocRef);

    // Check if the user document exists
    if (userDoc.exists()) {
      // Return the user data with the id
      const userData = userDoc.data() as Omit<User, "id">;
      return { ...userData, id: userId };
    } else {
      // If the user document does not exist throw an error
      throw new Error("User not found.");
    }
  } catch (error: any) {
    throw new Error("Failed to fetch user data: " + error.message);
  }
};
