import { useState } from "react";
import {
  addExpense,
  deleteExpense,
  getAllExpensesByGroupId,
} from "../firebase/expenseService";
import { useToast } from "@/components/contexts/ToastContext";
import { useBalanceService } from "./balanceHooks";
import { Expense } from "../types";

export const useExpenseService = () => {
  // State to hold fetched expenses
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // State to track loading status
  const [isLoading, setIsLoading] = useState(false);

  // Dereference the showToast function to show toast messages
  const { showToast } = useToast();

  const {
    allBalances,
    isLoading: isBalancesLoading,
    loadAllUserBalances,
  } = useBalanceService();

  /**
   * Asynchronously loads all expenses for a specific group.
   */
  const loadExpenses = async (id: string) => {
    try {
      // Set Loading state to true
      setIsLoading(true);

      // Get all expenses by id
      const result = await getAllExpensesByGroupId(id);

      // Set the expenses state to the result
      setExpenses(result);
    } catch (error: any) {
      // If any error is found show the toast
      showToast(error.message, "error");
    } finally {
      // Finally set loading state to false
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (
    expenseData: any,
    currentGroupBalances: any
  ) => {
    setIsLoading(true);
    try {
      await addExpense(expenseData, currentGroupBalances);
      showToast("Expense added successfully", "success");
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (
    expenseData: Expense,
    currentGroupBalances: any
  ) => {
    setIsLoading(true);
    try {
      await deleteExpense(expenseData, currentGroupBalances);
      showToast("Expense deleted successfully", "success");
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    expenses,
    isLoading,
    loadExpenses,
    handleAddExpense,
    isBalancesLoading,
    allBalances,
    loadAllUserBalances,
    handleDeleteExpense,
  };
};
