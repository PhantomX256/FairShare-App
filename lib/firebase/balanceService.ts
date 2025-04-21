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

export const getGroupBalances = async (groupId: string) => {
  try {
    const balancesRef = collection(db, "balances");
    const balanceQuery = query(balancesRef, where("groupId", "==", groupId));
    const balancesSnapshot = await getDocs(balanceQuery);

    const balances = new Map<string, { id: string; balance: number }>();
    balancesSnapshot.forEach((doc) => {
      const { userId, balance } = doc.data();
      balances.set(userId, { id: doc.id, balance: balance });
    });

    return balances;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Server error");
    }
  }
};

export const updateBalancesForNewExpense = async (
  expenseData: Expense,
  existingBalances: Map<string, { id: string; balance: number }>,
  transaction: Transaction
) => {
  try {
    const balancesRef = collection(db, "balances");

    // First handle members who owe money
    for (const member of expenseData.members) {
      if (existingBalances.has(member.userId)) {
        const balanceData = existingBalances.get(member.userId)!;
        transaction.update(doc(db, "balances", balanceData.id), {
          balance: balanceData.balance - member.amountOwed,
          updatedAt: Timestamp.now(),
        });
        existingBalances.set(member.userId, {
          id: balanceData.id,
          balance: balanceData.balance - member.amountOwed,
        });
      } else {
        // Create new balance
        const newBalanceRef = doc(balancesRef);
        transaction.set(newBalanceRef, {
          userId: member.userId,
          groupId: expenseData.groupId,
          balance: -member.amountOwed,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        existingBalances.set(member.userId, {
          id: newBalanceRef.id,
          balance: -member.amountOwed,
        });
      }
    }

    // Then handle payers separately (moved outside the members loop)
    for (const payer of expenseData.payers) {
      if (existingBalances.has(payer.userId)) {
        // Update existing balance
        const balanceData = existingBalances.get(payer.userId)!;
        transaction.update(doc(db, "balances", balanceData.id), {
          balance: balanceData.balance + payer.paidAmount,
          updatedAt: Timestamp.now(),
        });
        existingBalances.set(payer.userId, {
          id: balanceData.id,
          balance: balanceData.balance + payer.paidAmount,
        });
      } else {
        // Create new balance
        const newBalanceRef = doc(balancesRef);
        transaction.set(newBalanceRef, {
          userId: payer.userId,
          groupId: expenseData.groupId,
          balance: payer.paidAmount,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        existingBalances.set(payer.userId, {
          id: newBalanceRef.id,
          balance: payer.paidAmount,
        });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Server error");
    }
  }
};

export const updateBalancesForRemoveExpense = async (
  expense: Expense,
  existingBalances: Map<string, { id: string; balance: number }>,
  transaction: Transaction
) => {
  try {
    // For each member, ADD the amount they owed (reverse the subtraction that happened when expense was created)
    for (const member of expense.members) {
      if (existingBalances.has(member.userId)) {
        const balanceData = existingBalances.get(member.userId)!;
        const newBalance = balanceData.balance + member.amountOwed; // CHANGE HERE: + instead of -

        if (Math.abs(newBalance) < 0.01) {
          // If balance is effectively zero, delete the document
          transaction.delete(doc(db, "balances", balanceData.id));
          existingBalances.delete(member.userId);
        } else {
          // Otherwise update the balance
          transaction.update(doc(db, "balances", balanceData.id), {
            balance: newBalance,
            updatedAt: Timestamp.now(),
          });
          existingBalances.set(member.userId, {
            id: balanceData.id,
            balance: newBalance,
          });
        }
      }
    }

    // For each payer, subtract what they paid (reverse the addition that happened when expense was created)
    for (const payer of expense.payers) {
      if (existingBalances.has(payer.userId)) {
        const balanceData = existingBalances.get(payer.userId)!;
        const newBalance = balanceData.balance - payer.paidAmount;

        if (Math.abs(newBalance) < 0.01) {
          // If balance is effectively zero, delete the document
          transaction.delete(doc(db, "balances", balanceData.id));
          existingBalances.delete(payer.userId);
        } else {
          // Otherwise update the balance
          transaction.update(doc(db, "balances", balanceData.id), {
            balance: newBalance,
            updatedAt: Timestamp.now(),
          });
          existingBalances.set(payer.userId, {
            id: balanceData.id,
            balance: newBalance,
          });
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Server error");
    }
  }
};

export const getAllUserBalances = async () => {
  try {
    // Get the current user's ID from auth session
    const currentUserId = auth.currentUser?.uid;

    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    // Query all balances where the current user is involved
    const balancesRef = collection(db, "balances");
    const balanceQuery = query(
      balancesRef,
      where("userId", "==", currentUserId)
    );
    const balancesSnapshot = await getDocs(balanceQuery);

    let owed = 0; // Money others owe to the user (positive balances)
    let owe = 0; // Money the user owes to others (negative balances)

    // Process all balances
    balancesSnapshot.forEach((doc) => {
      const balanceData = doc.data() as Balance;
      const balance = balanceData.balance;

      if (balance > 0) {
        // Positive balance means others owe the user
        owed += balance;
      } else if (balance < 0) {
        // Negative balance means the user owes others
        // We store the absolute value for easier understanding
        owe += Math.abs(balance);
      }
    });

    return {
      owed,
      owe,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to fetch user balances");
    }
  }
};
