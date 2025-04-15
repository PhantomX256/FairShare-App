import { MaxHeap } from "../constants";
import { Split } from "../types";

/**
 * Calculate the optimal splits to settle debts within a group
 */
export const calculateSplits = async (
  balances: Map<string, { id: string; balance: number }>
) => {
  try {
    // Create two max heaps - one for creditors (people owed money) and one for debtors
    const creditorsHeap = new MaxHeap(); // People who are owed money (positive balance)
    const debtorsHeap = new MaxHeap(); // People who owe money (negative balance)

    // List to store our final payment plan
    const paymentPlan: Split[] = [];

    // Sort users into appropriate heaps based on their balance
    for (let [userId, value] of balances) {
      if (value.balance > 0) {
        // Positive balance - this person is owed money
        creditorsHeap.insert({ userId, amount: value.balance });
      } else if (value.balance < 0) {
        // Negative balance - this person owes money
        // Store as positive amount since heap is organized by max values
        debtorsHeap.insert({ userId, amount: -value.balance });
      }
      // Users with zero balance are ignored (no payments needed)
    }

    // Process payments while there are still people who owe or are owed money
    while (creditorsHeap.peek() && debtorsHeap.peek()) {
      // Extract users with highest debt and highest credit
      const biggestDebtor = debtorsHeap.extractMax();
      const biggestCreditor = creditorsHeap.extractMax();

      // Safety check (both should exist due to while loop condition)
      if (!biggestDebtor || !biggestCreditor) break;

      // Case 1: Debtor owes less than creditor is owed
      if (biggestDebtor.amount < biggestCreditor.amount) {
        // Debtor pays their entire debt to creditor
        // Creditor still has remaining balance to be paid by others
        const remainingCredit = biggestCreditor.amount - biggestDebtor.amount;

        // Put creditor back in heap with reduced amount
        creditorsHeap.insert({
          userId: biggestCreditor.userId,
          amount: remainingCredit,
        });

        // Record the payment
        paymentPlan.push({
          from: biggestDebtor.userId, // Person paying
          to: biggestCreditor.userId, // Person receiving
          amount: biggestDebtor.amount, // Full debt amount
        });
      }
      // Case 2: Debtor owes more than creditor is owed
      else if (biggestDebtor.amount > biggestCreditor.amount) {
        // Debtor pays part of their debt to fully satisfy creditor
        // Debtor still has remaining debt to pay to others
        const remainingDebt = biggestDebtor.amount - biggestCreditor.amount;

        // Put debtor back in heap with reduced amount
        debtorsHeap.insert({
          userId: biggestDebtor.userId,
          amount: remainingDebt,
        });

        // Record the payment
        paymentPlan.push({
          from: biggestDebtor.userId, // Person paying
          to: biggestCreditor.userId, // Person receiving
          amount: biggestCreditor.amount, // Full credit amount
        });
      }
      // Case 3 (implicit): Debt and credit exactly equal
      // Both are removed from heaps and no reinsertion is needed
      else {
        // Record the payment
        paymentPlan.push({
          from: biggestDebtor.userId,
          to: biggestCreditor.userId,
          amount: biggestDebtor.amount, // Same as biggestCreditor.amount
        });
      }
    }

    return paymentPlan;
  } catch (error: any) {
    throw new Error(`Failed to calculate splits: ${error.message}`);
  }
};
