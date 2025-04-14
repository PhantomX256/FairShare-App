import { db } from "@/FirebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { Expense } from "../types";

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
export const addExpense = async (expenseData: Expense) => {
  try {
    // Create a reference to the "expenses" collection in Firestore
    const expensesRef = collection(db, "expenses");

    // Add the new expense document to the collection
    const docRef = await addDoc(expensesRef, {
      ...expenseData,
    });

    // Return the newly created expense with its Firestore ID
    return {
      ...expenseData,
      id: docRef.id,
    };
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
