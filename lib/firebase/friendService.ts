import { auth, db } from "@/FirebaseConfig";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";

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

type UserDataType = {
  id: string;
  fullName: string;
  email: string;
  friendIds: string[];
  createdAt: Date;
};

type FriendRequestType = {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: any;
  updatedAt: any;
  sender?: any;
  receiver?: any;
};

/**
 * Sends a friend request from a user to another user.
 *
 * This function validates that:
 * - The sender is not sending a request to themselves
 * - The receiver exists
 * - The users are not already friends
 * - There isn't already a pending request in either direction
 *
 * After validation, it creates a new friend request document in Firestore.
 *
 * @param receiverId - The ID of the user receiving the friend request
 * @throws {CustomError} With specific error codes and messages:
 *   - "SELF_REQUEST" if trying to send request to self
 *   - "USER_NOT_FOUND" if receiver doesn't exist
 *   - "ALREADY_FRIENDS" if users are already friends
 *   - "REQUEST_EXISTS" if there's already a request between the users
 *   - "SERVER_ERROR" for other errors
 * @returns A Promise that resolves with the created friend request data
 */
export const sendFriendRequest = async (
  receiverId: string
): Promise<FriendRequestType> => {
  try {
    const senderId = auth.currentUser?.uid;
    if (!senderId) {
      throw new CustomError(
        "AUTH_REQUIRED",
        "You must be logged in to send a friend request."
      );
    }

    // Validate that user is not sending a request to themselves
    if (senderId === receiverId) {
      throw new CustomError(
        "SELF_REQUEST",
        "You cannot send a friend request to yourself."
      );
    }

    // Get reference to receiver's document and check if they exist
    const usersRef = collection(db, "users");
    const receiverDocRef = doc(usersRef, receiverId);
    const receiverDoc = await getDoc(receiverDocRef);

    if (!receiverDoc.exists()) {
      throw new CustomError("USER_NOT_FOUND", "User not found.");
    }

    const senderDocRef = doc(usersRef, senderId);
    const senderDoc = await getDoc(senderDocRef);

    // Check if users are already friends
    const senderData = senderDoc.data();
    if (senderData?.friendIds && senderData.friendIds.includes(receiverId)) {
      throw new CustomError(
        "ALREADY_FRIENDS",
        "You are already friends with the user."
      );
    }

    // Create references to check for existing friend requests
    const friendRequestsRef = collection(db, "friendRequests");

    // Query to check if sender has already sent a request to receiver
    const existingRequestQuery1 = query(
      friendRequestsRef,
      where("senderId", "==", senderId),
      where("receiverId", "==", receiverId)
    );

    // Query to check if receiver has already sent a request to sender
    const existingRequestQuery2 = query(
      friendRequestsRef,
      where("senderId", "==", receiverId),
      where("receiverId", "==", senderId)
    );

    // Run both queries concurrently for efficiency
    const [existingRequests1, existingRequests2] = await Promise.all([
      getDocs(existingRequestQuery1),
      getDocs(existingRequestQuery2),
    ]);

    // Check if sender already sent a request
    if (!existingRequests1.empty) {
      throw new CustomError(
        "REQUEST_EXISTS",
        "You have already sent a friend request to this user."
      );
    }

    // Check if receiver already sent a request
    if (!existingRequests2.empty) {
      throw new CustomError(
        "REQUEST_EXISTS",
        "This user has already sent you a friend request."
      );
    }

    // Create timestamp for the request
    const now = Timestamp.now();

    // Prepare friend request data
    const friendRequestData = {
      senderId,
      receiverId,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    // Add the friend request to Firestore
    const docRef = await addDoc(
      collection(db, "friendRequests"),
      friendRequestData
    );

    // Return the request data with the document ID
    return {
      id: docRef.id,
      ...friendRequestData,
    };
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw error;
    }

    // Convert any other errors to CustomError with SERVER_ERROR code
    throw new CustomError(
      "SERVER_ERROR",
      "Failed to send friend request. Please try again later."
    );
  }
};

/**
 * Fetches all pending friend requests received by the current authenticated user.
 *
 * This function queries the Firestore database for friend requests where:
 * 1. The current user is the receiver
 * 2. The request status is "pending"
 *
 * For each request, it also retrieves the sender's profile information and
 * includes it in the returned data.
 *
 * @async
 * @returns {Promise<Array<FriendRequestType>>} An array of friend request objects, each containing:
 *   - id: The document ID of the friend request
 *   - Other request data from the Firestore document
 *   - sender: The sender's profile information, or null if not found
 *
 * @throws {CustomError} With code "SERVER_ERROR" if the operation fails
 */
export const getReceivedFriendRequests = async (): Promise<
  Array<FriendRequestType>
> => {
  try {
    // Get the current authenticated user's ID from Firebase Auth
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new CustomError(
        "AUTH_REQUIRED",
        "You must be logged in to view friend requests."
      );
    }

    // Create a reference to the friendRequests collection
    const friendRequestsRef = collection(db, "friendRequests");

    // Create a query to filter for pending requests where current user is the receiver
    const q = query(
      friendRequestsRef,
      where("receiverId", "==", userId),
      where("status", "==", "pending")
    );

    // Execute the query and get all matching documents
    const querySnapshot = await getDocs(q);

    // Process each friend request document with Promise.all for parallel execution
    const requests = await Promise.all(
      querySnapshot.docs.map(async (requestDoc) => {
        // Extract data from the request document
        const requestData = requestDoc.data();

        // Create a reference to the sender's user document
        const senderDocRef = doc(db, "users", requestData.senderId);

        // Fetch the sender's profile information
        const senderDoc = await getDoc(senderDocRef);

        // Return a combined object with request data and sender details
        return {
          id: requestDoc.id,
          ...requestData,
          sender: senderDoc.exists()
            ? {
                id: senderDoc.id,
                ...senderDoc.data(),
              }
            : null,
        } as FriendRequestType;
      })
    );

    return requests;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }

    // Handle any errors by throwing a custom error with a descriptive message
    throw new CustomError(
      "SERVER_ERROR",
      "Failed to get friend requests. Please try again later."
    );
  }
};

/**
 * Retrieves all pending friend requests sent by the current user.
 *
 * This function queries the "friendRequests" collection in Firestore for documents where:
 * - The senderId matches the current user's ID
 * - The status is "pending"
 *
 * For each request found, it fetches the receiver's user data and combines it with the request data.
 *
 * @returns {Promise<Array<FriendRequestType>>} A promise that resolves to an array of friend request objects.
 *          Each object contains the request data merged with the receiver's user data.
 * @throws {CustomError} With code "SERVER_ERROR" if the operation fails.
 */
export const getSentFriendRequests = async (): Promise<
  Array<FriendRequestType>
> => {
  try {
    // Get the current authenticated user's ID
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new CustomError(
        "AUTH_REQUIRED",
        "You must be logged in to view sent requests."
      );
    }

    // Create a reference to the friendRequests collection
    const friendRequestsRef = collection(db, "friendRequests");

    // Query for pending requests sent by the current user
    const q = query(
      friendRequestsRef,
      where("senderId", "==", userId),
      where("status", "==", "pending")
    );

    // Execute the query to get all matching documents
    const querySnapshot = await getDocs(q);

    // Process each request document with Promise.all for parallel execution
    const requests = await Promise.all(
      querySnapshot.docs.map(async (requestDoc) => {
        // Extract data from the request document
        const requestData = requestDoc.data();

        // Get reference to the receiver's user document
        const receiverDocRef = doc(db, "users", requestData.receiverId);

        // Fetch the receiver's profile information
        const receiverDoc = await getDoc(receiverDocRef);

        // Return combined object with request data and receiver details
        return {
          id: requestDoc.id,
          ...requestData,
          receiver: receiverDoc.exists()
            ? {
                id: receiverDoc.id,
                ...receiverDoc.data(),
              }
            : null,
        } as FriendRequestType;
      })
    );

    return requests;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }

    // Handle errors by throwing a custom error with descriptive message
    throw new CustomError(
      "SERVER_ERROR",
      "Failed to get sent friend requests. Please try again later."
    );
  }
};

/**
 * Handles a response to a friend request, either accepting or rejecting it.
 * If accepted, adds both users to each other's friend lists using a batch write
 * for atomicity. Regardless of the response, the friend request document is deleted.
 *
 * @param requestId - The ID of the friend request document to respond to
 * @param accept - Boolean indicating whether to accept (true) or reject (false) the request
 * @throws {CustomError} With code "REQ_NOT_FOUND" if the request doesn't exist
 * @throws {CustomError} With code "UNAUTHORIZED" if the current user isn't the request receiver
 * @throws {CustomError} With code "SERVER_ERROR" if an unexpected error occurs
 * @returns {Promise<{success: boolean; message: string}>} Object indicating success/failure with message
 */
export const respondToFriendRequest = async (
  requestId: string,
  accept: boolean
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get the current authenticated user's ID
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new CustomError(
        "AUTH_REQUIRED",
        "You must be logged in to respond to a friend request."
      );
    }

    // Create a reference to the specific friend request document
    const requestDocRef = doc(db, "friendRequests", requestId);

    // Fetch the friend request data
    const requestDoc = await getDoc(requestDocRef);

    // Check if the request exists
    if (!requestDoc.exists()) {
      throw new CustomError("REQ_NOT_FOUND", "Friend request not found.");
    }

    // Extract the request data from the document
    const requestData = requestDoc.data();

    // Verify that the current user is the intended receiver of the request
    if (requestData.receiverId !== userId) {
      throw new CustomError(
        "UNAUTHORIZED",
        "You are not authorized to respond to this friend request."
      );
    }

    const senderId = requestData.senderId;
    const receiverId = requestData.receiverId;

    // Create a batch for atomic operations
    const batch = writeBatch(db);

    if (accept) {
      // Add the sender to the receiver's friends list
      const receiverDocRef = doc(db, "users", receiverId);
      batch.update(receiverDocRef, {
        friendIds: arrayUnion(senderId),
      });

      // Add the receiver to the sender's friends list
      const senderDocRef = doc(db, "users", senderId);
      batch.update(senderDocRef, {
        friendIds: arrayUnion(receiverId),
      });
    }

    // Delete the request document instead of updating its status
    batch.delete(requestDocRef);

    // Commit all the batch operations atomically
    await batch.commit();

    return {
      success: true,
      message: accept
        ? "Friend request accepted successfully."
        : "Friend request declined.",
    };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }

    // Handle errors by throwing a custom error with a descriptive message
    throw new CustomError(
      "SERVER_ERROR",
      "Failed to respond to friend request. Please try again later."
    );
  }
};

/**
 * Cancels a friend request sent by the current user.
 *
 * This function retrieves the specified friend request, verifies that the current
 * user is the sender of the request, and then deletes it from the database.
 *
 * @param requestId - The unique identifier of the friend request to cancel
 * @throws {CustomError} With code "REQ_NOT_FOUND" if the friend request does not exist
 * @throws {CustomError} With code "UNAUTHORIZSED" if the current user is not the sender of the request
 * @throws {CustomError} With code "SERVER_ERROR" if there's an issue with the server operation
 * @returns {Promise<{success: boolean; message: string}>} A Promise that resolves when the friend request is successfully cancelled
 */
export const cancelFriendRequest = async (
  requestId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get the current user's ID
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new CustomError(
        "AUTH_REQUIRED",
        "You must be logged in to cancel a friend request."
      );
    }

    // Get the friend request
    const requestDocRef = doc(db, "friendRequests", requestId);
    const requestDoc = await getDoc(requestDocRef);

    if (!requestDoc.exists()) {
      throw new CustomError("REQ_NOT_FOUND", "Friend request not found.");
    }

    const requestData = requestDoc.data();

    // Verify that the current user is the sender of the request
    if (requestData.senderId !== userId) {
      throw new CustomError(
        "UNAUTHORIZED",
        "You are not authorized to cancel this friend request."
      );
    }

    // Delete the request
    await deleteDoc(requestDocRef);

    return {
      success: true,
      message: "Friend request cancelled successfully.",
    };
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError(
      "SERVER_ERROR",
      "Failed to cancel friend request. Please try again later."
    );
  }
};

/**
 * Removes a friend connection between the current user and the specified user.
 * This function updates the friendIds arrays for both users to remove each other
 * using a batch write operation for atomicity.
 *
 * @param friendId - The ID of the friend to be removed
 * @throws {CustomError} With code "AUTH_REQUIRED" if user is not logged in
 * @throws {CustomError} With code "SERVER_ERROR" if the operation fails
 * @returns {Promise<{success: boolean; message: string}>} Returns object with success status and message
 */
export const removeFriend = async (
  friendId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if the current user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new CustomError(
        "AUTH_REQUIRED",
        "You must be logged in to remove a friend."
      );
    }

    // Get the current user's ID
    const userId = currentUser.uid;

    // Create a batch for atomic operations
    const batch = writeBatch(db);

    // Remove the friend from the current user's friendIds array
    const userDocRef = doc(db, "users", userId);
    batch.update(userDocRef, {
      friendIds: arrayRemove(friendId),
    });

    // Remove the current user from the friend's friendIds array
    const friendDocRef = doc(db, "users", friendId);
    batch.update(friendDocRef, {
      friendIds: arrayRemove(userId),
    });

    // Commit the batch operations atomically
    await batch.commit();

    return {
      success: true,
      message: "Friend removed successfully.",
    };
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError(
      "SERVER_ERROR",
      "Failed to remove friend. Please try again later."
    );
  }
};

/**
 * Retrieves all friends of the currently authenticated user.
 *
 * This function gets the current user's document, extracts the friendIds array,
 * and fetches the user documents for each friend ID.
 *
 * @returns {Promise<Array<UserDataType>>} A promise that resolves to an array of friend user objects
 * @throws {CustomError} With code "AUTH_REQUIRED" if user is not logged in
 * @throws {CustomError} With code "USER_NOT_FOUND" if the current user document doesn't exist
 * @throws {CustomError} With code "SERVER_ERROR" if the operation fails
 */
export const getFriends = async (): Promise<Array<UserDataType>> => {
  try {
    // Check if the current user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new CustomError(
        "AUTH_REQUIRED",
        "You must be logged in to get friends."
      );
    }

    // Get the current user's ID
    const userId = currentUser.uid;

    // Get the current user's document
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new CustomError("USER_NOT_FOUND", "User document not found.");
    }

    const userData = userDoc.data();

    // If the user has no friends, return an empty array
    if (!userData.friendIds || userData.friendIds.length === 0) {
      return [];
    }

    // Get all the friend documents
    const friends = await Promise.all(
      userData.friendIds.map(async (friendId: string) => {
        const friendDocRef = doc(db, "users", friendId);
        const friendDoc = await getDoc(friendDocRef);

        if (friendDoc.exists()) {
          return {
            id: friendId,
            ...friendDoc.data(),
          } as UserDataType;
        }

        return null;
      })
    );

    // Filter out any null values (in case a friend document doesn't exist)
    return friends.filter((friend): friend is UserDataType => friend !== null);
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError(
      "SERVER_ERROR",
      "Failed to get friends. Please try again later."
    );
  }
};
