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
import { db } from "@/FirebaseConfig";

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
  transaction: Transaction
) => {
  try {
    const existingBalances = await getGroupBalances(expenseData.groupId);
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
