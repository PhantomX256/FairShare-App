import { useToast } from "@/components/contexts/ToastContext";
import { useState } from "react";
import { getGroupBalances } from "../firebase/balanceService";

export const useBalanceService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [balances, setBalances] =
    useState<Map<string, { id: string; balance: number }>>();
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

  return {
    isLoading,
    loadBalances,
    balances,
  };
};
