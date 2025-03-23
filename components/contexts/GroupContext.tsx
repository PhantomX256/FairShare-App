import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Group } from "@/lib/firebase/groupService";
import { useGroupService } from "@/lib/hooks/groupHooks";

interface GroupContextType {
  groups: Group[];
  currentGroup: Group | null;
  isLoading: boolean;
  setCurrentGroup: (group: Group) => void;
  fetchGroups: () => Promise<void>;
}

const GroupContext = createContext<GroupContextType>({
  groups: [],
  currentGroup: null,
  isLoading: false,
  setCurrentGroup: () => {},
  fetchGroups: async () => {},
});

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state to track the currently selected group, initially set to null
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  // Get groups data, loading function, and loading state from the custom hook
  const { groups, loadGroups, isLoading } = useGroupService();

  // Function to fetch/reload groups data from the database
  const fetchGroups = async () => {
    // Call the loadGroups function from the hook to retrieve the latest groups
    await loadGroups();
  };

  // Provide the group context values to all child components
  return (
    <GroupContext.Provider
      value={{
        groups, // List of all groups
        currentGroup, // Currently selected group
        isLoading, // Loading state indicator
        setCurrentGroup, // Function to update the current group
        fetchGroups, // Function to reload groups data
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
