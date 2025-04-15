import { useState } from "react";
import { Split } from "../types";
import { useToast } from "@/components/contexts/ToastContext";
import { calculateSplits } from "../firebase/splitService";

export const useSplitService = () => {
  // Declare a state variable for loading status with initial value of false
  const [isLoading, setIsLoading] = useState(false);
  // Declare a state variable for splits with initial value of empty array
  const [splits, setSplts] = useState<Split[]>([]);

  // Destructure showToast function from the useToast hook
  const { showToast } = useToast();

  // Define an async function to calculate splits based on balances
  const getSplits = async (
    balances: Map<string, { id: string; balance: number }>
  ) => {
    try {
      // Set loading state to true before starting the calculation
      setIsLoading(true);
      // Call the calculateSplits service function and await its response
      const res = await calculateSplits(balances);
      // Update the splits state with the returned result
      setSplts(res);
    } catch (error: any) {
      // Show an error toast with the error message if an exception occurs
      showToast(error.message, "error");
    } finally {
      // Set loading state back to false when operation completes (success or error)
      setIsLoading(false);
    }
  };

  // Return an object containing the state and function to be used by components
  return {
    splits,
    isLoading,
    getSplits,
  };
};
