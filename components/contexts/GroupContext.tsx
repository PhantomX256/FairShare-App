import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGroupService } from "@/lib/hooks/groupHooks";
import { useBalanceService } from "@/lib/hooks/balanceHooks";
import { Group, Split, User } from "@/lib/types";
import { useSplitService } from "@/lib/hooks/splitHooks";

interface GroupContextType {
  groups: Group[];
  currentGroup: Group | null;
  isLoading: boolean;
  setCurrentGroup: (group: Group) => void;
  fetchGroups: () => Promise<void>;
  currentGroupMembers: User[];
  isMemberLoading: boolean;
  currentGroupBalances: Map<string, { id: string; balance: number }>;
  isBalanceLoading: boolean;
  splits: Split[];
  isSplitLoading: boolean;
}

const GroupContext = createContext<GroupContextType>({
  groups: [],
  currentGroup: null,
  isLoading: false,
  setCurrentGroup: () => {},
  fetchGroups: async () => {},
  currentGroupMembers: [],
  isMemberLoading: false,
  currentGroupBalances: new Map<string, { id: string; balance: number }>(),
  isBalanceLoading: false,
  splits: [],
  isSplitLoading: false,
});

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state to track the currently selected group, initially set to null
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  // Initialize state to track the members of currently selected group
  const [currentGroupMembers, setCurrentGroupMembers] = useState<User[]>([]);

  // Get groups data, loading function, and loading state from the custom hook
  const { groups, loadGroups, isLoading, loadGroupMembers, isMemberLoading } =
    useGroupService();

  const {
    balances,
    isLoading: isBalanceLoading,
    loadBalances,
  } = useBalanceService();

  const { splits, getSplits, isLoading: isSplitLoading } = useSplitService();

  // Function to fetch/reload groups data from the database
  const fetchGroups = async () => {
    // Call the loadGroups function from the hook to retrieve the latest groups
    await loadGroups();
  };

  // Anytime currentGroup changes, the members of that group are fetched
  useEffect(() => {
    // create an async function to get the member details
    const fetchGroupMembers = async () => {
      // If currentGroup is null then return
      if (!currentGroup) return;

      // get the userIds from currentGroup
      const userIds = currentGroup.users || [];

      // Get the members from db
      const members = await loadGroupMembers(userIds);

      // update the state - include guests if they exist
      const guests = currentGroup.guests || [];
      setCurrentGroupMembers([...members, ...guests]);
    };

    loadBalances(currentGroup?.id);

    fetchGroupMembers();
  }, [currentGroup, setCurrentGroupMembers]);

  useEffect(() => {
    if (balances) {
      getSplits(balances);
    }
  }, [balances]);

  // Provide the group context values to all child components
  return (
    <GroupContext.Provider
      value={{
        groups, // List of all groups
        currentGroup, // Currently selected group
        isLoading, // Loading state indicator
        setCurrentGroup, // Function to update the current group
        fetchGroups, // Function to reload groups data
        currentGroupMembers, // current group members
        isMemberLoading, // Loading state from members
        currentGroupBalances:
          balances || new Map<string, { id: string; balance: number }>(),
        isBalanceLoading,
        splits,
        isSplitLoading,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroupContext must be used within a GroupProvider");
  }
  return context;
};
