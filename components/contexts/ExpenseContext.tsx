import { Expense } from "@/lib/firebase/expenseService";
import { useExpenseService } from "@/lib/hooks/expenseHooks";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGroupContext } from "./GroupContext";

interface ExpenseContextType {
  expenses: Expense[];
  currentExpense: Expense | null;
  isLoading: boolean;
  setCurrentExpense: (expense: Expense) => void;
  fetchExpenses: () => Promise<void>;
  addExpense: (expenseData: any) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType>({
  expenses: [],
  currentExpense: null,
  isLoading: false,
  setCurrentExpense: () => {},
  fetchExpenses: async () => {},
  addExpense: async () => {},
});

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  // Use the custom hook to access expense data and related functions
  const { expenses, isLoading, loadExpenses, handleAddExpense } =
    useExpenseService();

  // Get the currently selected group from the GroupContext
  const { currentGroup, loadBalances } = useGroupContext();

  // State for tracking the currently selected expense
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);

  // Function to load expenses for the current group
  const fetchExpenses = async () => {
    // Only proceed if there is a current group selected
    if (currentGroup) {
      // Load expenses for the current group using its ID
      await loadExpenses(currentGroup.id);
      await loadBalances(currentGroup.id);
    }
  };

  const addExpense = async (expenseData: any) => {
    await handleAddExpense(expenseData);
    await fetchExpenses();
  };

  // Provide expense context values to all child components
  return (
    <ExpenseContext.Provider
      value={{
        expenses, // List of all expenses for the current group
        currentExpense, // Currently selected expense
        setCurrentExpense, // Function to update the currently selected expense
        isLoading, // Loading state indicator
        fetchExpenses, // Function to manually trigger expense loading
        addExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenseContext must be used within a ExpenseProvider");
  }
  return context;
};
