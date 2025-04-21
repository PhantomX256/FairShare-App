import { db } from "@/FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  doc,
} from "firebase/firestore";
import { Expense } from "../types";
import {
  updateBalancesForNewExpense,
  updateBalancesForRemoveExpense,
} from "./balanceService";

/**
 * Retrieves all expenses from Firestore that belong to a specific group.
 */
export const getAllExpensesByGroupId = async (
  id: string
): Promise<Expense[]> => {
  try {
    // Get a reference to the "expenses" collection in Firestore
    const expensesRef = collection(db, "expenses");

    // Create a query to filter expenses where the groupId field equals the provided id
    const expensesQuery = query(expensesRef, where("groupId", "==", id));

    // Execute the query and wait for the results
    const querySnapshot = await getDocs(expensesQuery);

    // If no documents were found, return an empty array
    if (querySnapshot.empty) {
      return [];
    }

    // Map each document to an Expense object
    // Extract the document ID and spread the rest of the document data
    const expenses: Expense[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Expense, "id">),
    }));

    // Return the array of Expense objects
    return expenses;
  } catch (error) {
    // If the error is an instance of Error, rethrow it
    if (error instanceof Error) {
      throw error;
    } else {
      // Otherwise, throw a new generic error
      throw new Error("Server error");
    }
  }
};

/**
 * Adds a new expense to the Firestore database.
 */
export const addExpense = async (
  // The expense data object to be added to the database
  expenseData: Expense,
  // Current balance map for the group members
  currentGroupBalances: Map<string, { id: string; balance: number }>
) => {
  try {
    // Variable to store the ID of the newly created expense document
    let newExpenseId = "";

    // Use a transaction to ensure both expense creation and balance updates complete atomically
    await runTransaction(db, async (transaction) => {
      // Create a reference to the "expenses" collection in Firestore
      const expensesRef = collection(db, "expenses");

      // Generate a new document reference with an auto-generated ID
      const newExpenseRef = doc(expensesRef);
      // Store the auto-generated ID for later use
      newExpenseId = newExpenseRef.id;

      // Add the expense data to the new document in the transaction
      transaction.set(newExpenseRef, expenseData);

      // Update balances for all affected users to reflect the new expense
      // This function handles the complex logic of calculating splits and updating user balances
      await updateBalancesForNewExpense(
        expenseData,
        currentGroupBalances,
        transaction
      );
    });

    // Return the complete expense object with the newly assigned ID
    return {
      ...expenseData,
      id: newExpenseId,
    };
  } catch (error) {
    // If the caught error is an Error instance, rethrow it with its original stack trace
    if (error instanceof Error) {
      throw error;
    } else {
      // For non-standard errors, wrap in a generic Error with a clear message
      throw new Error("Server error");
    }
  }
};

/**
 * Deletes an expense from Firestore and updates balances accordingly.
 */
export const deleteExpense = async (
  // The expense object to be deleted
  expenseData: Expense,
  // Current balance map for the group members
  currentGroupBalances: Map<string, { id: string; balance: number }>
) => {
  try {
    // Use a transaction to ensure both expense deletion and balance updates complete atomically
    await runTransaction(db, async (transaction) => {
      // Get a reference to the "expenses" collection in Firestore
      const expensesRef = collection(db, "expenses");

      // Delete the specific expense document using its ID
      transaction.delete(doc(expensesRef, expenseData.id));

      // Update the balances for all affected users to reflect the expense removal
      await updateBalancesForRemoveExpense(
        expenseData,
        currentGroupBalances,
        transaction
      );
    });
  } catch (error) {
    // If the caught error is an Error instance, rethrow it with its original stack trace
    if (error instanceof Error) {
      throw error;
    } else {
      // For non-standard errors, wrap in a generic Error with a clear message
      throw new Error("Server error");
    }
  }
};
