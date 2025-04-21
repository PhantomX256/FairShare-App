import {
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  Transaction,
  where,
} from "firebase/firestore";
import { Balance, Expense } from "../types";
import { auth, db } from "@/FirebaseConfig";

/**
 * Fetches all balance records for users in a specific group from Firestore.
 */
export const getGroupBalances = async (groupId: string) => {
  try {
    // Get reference to the 'balances' collection in Firestore
    const balancesRef = collection(db, "balances");
    // Create a query to filter balances by the specified groupId
    const balanceQuery = query(balancesRef, where("groupId", "==", groupId));
    // Execute the query and retrieve the matching documents
    const balancesSnapshot = await getDocs(balanceQuery);

    // Create a Map to store user balances with userId as key and balance details as value
    const balances = new Map<string, { id: string; balance: number }>();
    // Iterate through each document in the query result
    balancesSnapshot.forEach((doc) => {
      // Extract userId and balance from the document data
      const { userId, balance } = doc.data();
      // Store the balance information in the Map with document ID for reference
      balances.set(userId, { id: doc.id, balance: balance });
    });

    // Return the Map containing all user balances for the specified group
    return balances;
  } catch (error) {
    // If the error is an instance of Error, rethrow it
    if (error instanceof Error) {
      throw error;
    } else {
      // Otherwise, throw a generic server error
      throw new Error("Server error");
    }
  }
};

/**
 * Updates the balances of all users involved in a new expense within a Firestore transaction.
 */
export const updateBalancesForNewExpense = async (
  expenseData: Expense, // The expense data containing members and payers information
  existingBalances: Map<string, { id: string; balance: number }>, // Map of existing user balances
  transaction: Transaction // Firestore transaction object to batch operations
) => {
  try {
    // Get reference to the 'balances' collection in Firestore
    const balancesRef = collection(db, "balances");

    // Process each member who owes money for this expense
    for (const member of expenseData.members) {
      if (existingBalances.has(member.userId)) {
        // If member already has a balance in this group
        const balanceData = existingBalances.get(member.userId)!; // Get current balance info
        // Update the balance by subtracting what they owe (negative adjustment)
        transaction.update(doc(db, "balances", balanceData.id), {
          balance: balanceData.balance - member.amountOwed, // Decrease balance by owed amount
          updatedAt: Timestamp.now(), // Update the timestamp
        });
        // Update the local Map with the new balance
        existingBalances.set(member.userId, {
          id: balanceData.id,
          balance: balanceData.balance - member.amountOwed,
        });
      } else {
        // If member doesn't have an existing balance record
        const newBalanceRef = doc(balancesRef); // Create a new document reference
        // Set the initial balance as negative (they owe money)
        transaction.set(newBalanceRef, {
          userId: member.userId, // User who owes money
          groupId: expenseData.groupId, // Group the expense belongs to
          balance: -member.amountOwed, // Negative value indicates money owed
          createdAt: Timestamp.now(), // Set creation timestamp
          updatedAt: Timestamp.now(), // Set update timestamp
        });
        // Add the new balance to our tracking Map
        existingBalances.set(member.userId, {
          id: newBalanceRef.id,
          balance: -member.amountOwed,
        });
      }
    }

    // Process each payer who contributed money to the expense
    for (const payer of expenseData.payers) {
      if (existingBalances.has(payer.userId)) {
        // If payer already has a balance in this group
        const balanceData = existingBalances.get(payer.userId)!; // Get current balance info
        // Update the balance by adding what they paid (positive adjustment)
        transaction.update(doc(db, "balances", balanceData.id), {
          balance: balanceData.balance + payer.paidAmount, // Increase balance by paid amount
          updatedAt: Timestamp.now(), // Update the timestamp
        });
        // Update the local Map with the new balance
        existingBalances.set(payer.userId, {
          id: balanceData.id,
          balance: balanceData.balance + payer.paidAmount,
        });
      } else {
        // If payer doesn't have an existing balance record
        const newBalanceRef = doc(balancesRef); // Create a new document reference
        // Set the initial balance as positive (they are owed money)
        transaction.set(newBalanceRef, {
          userId: payer.userId, // User who paid
          groupId: expenseData.groupId, // Group the expense belongs to
          balance: payer.paidAmount, // Positive value indicates money is owed to them
          createdAt: Timestamp.now(), // Set creation timestamp
          updatedAt: Timestamp.now(), // Set update timestamp
        });
        // Add the new balance to our tracking Map
        existingBalances.set(payer.userId, {
          id: newBalanceRef.id,
          balance: payer.paidAmount,
        });
      }
    }
  } catch (error) {
    // Error handling: If the error is an instance of Error, rethrow it
    if (error instanceof Error) {
      throw error;
    } else {
      // Otherwise, throw a generic server error
      throw new Error("Server error");
    }
  }
};

/**
 * Reverses balance updates when an expense is removed from the system
 */
export const updateBalancesForRemoveExpense = async (
  expense: Expense, // The expense data being removed from the system
  existingBalances: Map<string, { id: string; balance: number }>, // Map of existing balances with user IDs as keys
  transaction: Transaction // Firestore transaction object for atomic operations
) => {
  try {
    // Process all members who previously owed money for this expense
    for (const member of expense.members) {
      if (existingBalances.has(member.userId)) {
        // Check if this member has a balance record
        const balanceData = existingBalances.get(member.userId)!; // Get their current balance info using non-null assertion
        const newBalance = balanceData.balance + member.amountOwed; // Add back what they owed (reversing the previous subtraction)

        if (Math.abs(newBalance) < 0.01) {
          // Check if resulting balance is effectively zero (accounting for floating point errors)
          // If balance is close enough to zero, remove the balance document entirely
          transaction.delete(doc(db, "balances", balanceData.id)); // Delete the balance document from Firestore
          existingBalances.delete(member.userId); // Remove the user from our local tracking Map
        } else {
          // Balance is non-zero, so update the record
          transaction.update(doc(db, "balances", balanceData.id), {
            // Update the balance document
            balance: newBalance, // Set new balance amount
            updatedAt: Timestamp.now(), // Update the timestamp to current time
          });
          // Update our local tracking Map with new balance
          existingBalances.set(member.userId, {
            id: balanceData.id,
            balance: newBalance,
          });
        }
      }
    }

    // Process all payers who previously contributed money to this expense
    for (const payer of expense.payers) {
      if (existingBalances.has(payer.userId)) {
        // Check if this payer has a balance record
        const balanceData = existingBalances.get(payer.userId)!; // Get their current balance info
        const newBalance = balanceData.balance - payer.paidAmount; // Subtract what they paid (reversing previous addition)

        if (Math.abs(newBalance) < 0.01) {
          // Check if resulting balance is effectively zero
          // If balance is close enough to zero, remove the balance document entirely
          transaction.delete(doc(db, "balances", balanceData.id)); // Delete the balance document from Firestore
          existingBalances.delete(payer.userId); // Remove the user from our local tracking Map
        } else {
          // Balance is non-zero, so update the record
          transaction.update(doc(db, "balances", balanceData.id), {
            // Update the balance document
            balance: newBalance, // Set new balance amount
            updatedAt: Timestamp.now(), // Update the timestamp to current time
          });
          // Update our local tracking Map with new balance
          existingBalances.set(payer.userId, {
            id: balanceData.id,
            balance: newBalance,
          });
        }
      }
    }
  } catch (error) {
    // Error handling logic
    if (error instanceof Error) {
      throw error; // Re-throw if it's a standard Error object
    } else {
      throw new Error("Server error"); // Create generic error for non-standard errors
    }
  }
};

/**
 * Retrieves all balance records for the currently authenticated user and calculates total amounts owed/owing.
 */
export const getAllUserBalances = async () => {
  try {
    // Retrieve the current user's unique identifier from the authentication state
    const currentUserId = auth.currentUser?.uid;

    // If no user is logged in, abort the operation with an authentication error
    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    // Get reference to the 'balances' collection in Firestore database
    const balancesRef = collection(db, "balances");
    // Create a query to find all balance documents where the userId matches the current user
    const balanceQuery = query(
      balancesRef,
      where("userId", "==", currentUserId)
    );
    // Execute the query and retrieve the matching documents
    const balancesSnapshot = await getDocs(balanceQuery);

    // Initialize counter for money that other users owe to the current user
    let owed = 0;
    // Initialize counter for money that the current user owes to others
    let owe = 0;

    // Iterate through each balance document retrieved from the database
    balancesSnapshot.forEach((doc) => {
      // Extract the balance data from the document and cast it to Balance type
      const balanceData = doc.data() as Balance;
      // Get the numerical balance value from the document
      const balance = balanceData.balance;

      // If balance is positive, it represents money owed TO the current user
      if (balance > 0) {
        // Add this amount to the total owed to the user
        owed += balance;
        // If balance is negative, it represents money the current user owes to others
      } else if (balance < 0) {
        // Add the absolute value of this negative balance to the total owed by the user
        owe += Math.abs(balance);
      }
    });

    // Return an object containing the summary of the user's financial position
    return {
      owed, // Total amount other users owe to the current user
      owe, // Total amount the current user owes to others
    };
  } catch (error) {
    // If the error is a standard Error object, preserve it
    if (error instanceof Error) {
      throw error;
      // For any other error type, wrap it in a standardized error message
    } else {
      throw new Error("Failed to fetch user balances");
    }
  }
};
