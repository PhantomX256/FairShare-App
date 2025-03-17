import { auth, db } from "@/FirebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

/**
 * Represents the data structure for a group in the application.
 *
 */
interface GroupData {
  groupName: string;
  users?: string[];
  guests?: {
    name: string;
  }[];
  description?: string;
}

/**
 * Creates a new group in Firestore.
 *
 */
export const createGroup = async (groupData: GroupData) => {
  try {
    // Dereference users, guests and groupName from the parameter
    const { users = [], guests = [], groupName } = groupData;

    // If the groupName is an empty string throw an error
    if (groupName.trim() === "") throw new Error("Group name is required");

    // If both the users array and guests array are empty throw an error
    if (users?.length === 0 && guests?.length === 0)
      throw new Error("At least one person must be added.");

    // Get the current user's id from auth session
    const currentUserId = auth.currentUser?.uid;

    // If there is no user id it means the user isn't logged in
    if (!currentUserId) throw new Error("You must be logged in.");

    // Push the current user onto the group members
    users?.push(currentUserId);

    // Create a reference to the groups collection
    const groupsRef = collection(db, "groups");

    // Create a new timestamp for the current time
    const now = Timestamp.now();

    // Add a doc to the groups collection
    const docRef = await addDoc(groupsRef, {
      ...groupData,
      createdAt: now,
      updatedAt: now,
    });

    // return the result of the addition.
    return {
      id: docRef.id,
      ...groupData,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    // If any error occurs throw a general error
    throw new Error("Server error.");
  }
};

/**
 * Retrieves all groups that the currently authenticated user is a member of.
 *
 */
export const getGroups = async () => {
  try {
    // Get the current user's ID from auth session
    const currentUserId = auth.currentUser?.uid;

    // If no user ID is found that means the user isn't logged in
    if (!currentUserId) throw new Error("You must be logged in.");

    // Create a reference to the groups collection
    const groupsRef = collection(db, "groups");

    // Create a query to get all groups containing the user's ID in the users array
    const q = query(groupsRef, where("users", "array-contains", currentUserId));

    // Get the result of the query
    const querySnapshot = await getDocs(q);

    // Map it into an array
    const groups = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // return the groups
    return groups;
  } catch (error) {
    // If any error occurs throw generic error.
    throw new Error("Server error please try again later.");
  }
};
