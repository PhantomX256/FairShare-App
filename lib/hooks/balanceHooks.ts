import { useToast } from "@/components/contexts/ToastContext";
import { useState } from "react";
import {
  getAllUserBalances,
  getGroupBalances,
} from "../firebase/balanceService";

export const useBalanceService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [balances, setBalances] =
    useState<Map<string, { id: string; balance: number }>>();
  const [allBalances, setAllBalances] = useState<{ owed: number; owe: number }>(
    { owed: 0, owe: 0 }
  );
  const { showToast } = useToast();

  const loadBalances = async (groupId: string) => {
    try {
      setIsLoading(true);
      const res = await getGroupBalances(groupId);
      setBalances(res);
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllUserBalances = async () => {
    try {
      setIsLoading(true);
      const res = await getAllUserBalances();
      setAllBalances(res);
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    loadBalances,
    balances,
    loadAllUserBalances,
    allBalances,
  };
};
