import { useState } from "react";
import { createGroup, getGroups, Group } from "../firebase/groupService";
import { useToast } from "@/components/contexts/ToastContext";
import { router } from "expo-router";

/**
 * Represents the data structure for a group in the application.
 *
 */
interface GroupData {
  groupName: string;
  users?: { id: string; fullName: string }[];
  guests?: {
    id: string;
    fullName: string;
  }[];
  description?: string;
}

/**
 * Custom hook that provides group management services with loading and error states.
 *
 */
export const useGroupService = () => {
  // State for tracking loading status during async operations
  const [isLoading, setIsLoading] = useState(false);
  // State for holding all the groups the user is involved in
  const [groups, setGroups] = useState<Group[]>([]);
  // get show toast funciton from toast context
  const { showToast } = useToast();

  // Function to create a new group with the provided data
  const handleCreateGroup = async (groupData: GroupData) => {
    try {
      // Set loading state to true before starting the operation
      setIsLoading(true);

      // Process the group data to convert users to array of IDs
      const processedGroupData = {
        ...groupData,
        users: groupData.users
          ? groupData.users.map((user) => user.id)
          : undefined,
      };

      // Call the createGroup function from groupService to create the group in Firebase
      await createGroup(processedGroupData);

      // Show the success toast message
      showToast("Group created successfully", "success");

      // Redirect the user to "/"
      router.replace("/");

      // Call the loadGroups function to update the groups
      await loadGroups();
    } catch (error: any) {
      // Show toast message with error
      showToast(error.message, "error");
    } finally {
      // Reset loading state when operation completes (whether successful or not)
      setIsLoading(false);
    }
  };

  // Function to fetch all groups from the database
  const loadGroups = async () => {
    try {
      // Set loading state to true before starting the operation
      setIsLoading(true);

      // Call the getGroups function from groupService to fetch groups from Firebase
      const result = await getGroups();

      // Update the groups state
      setGroups(result);
    } catch (error: any) {
      // Show toast message with error
      showToast(error.message, "error");

      // Return empty result in case of error
      return [];
    } finally {
      // Reset loading state when operation completes (whether successful or not)
      setIsLoading(false);
    }
  };

  // Return the hook's state and handler functions
  return {
    groups,
    isLoading,
    handleCreateGroup,
    loadGroups,
  };
};
