import { db } from "@/FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

interface Payer {
  userId: string;
  paidAmount: number;
}

interface Member {
  userId: string;
  amountOwed: number;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  payers: Payer[];
  members: Member[];
  amount: number;
  date: Date;
}

/**
 * Retrieves all expenses from Firestore that belong to a specific group.
 *
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
