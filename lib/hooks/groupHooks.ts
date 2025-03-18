import { useState } from "react";
import { createGroup, getGroups } from "../firebase/groupService";
import { useToast } from "@/components/contexts/ToastContext";

/**
 * Represents the data structure for a group in the application.
 *
 */
interface GroupData {
  groupName: string;
  users?: string[];
  guests?: {
    name: string;
  }[];
  description?: string;
}

/**
 * Custom hook that provides group management services with loading and error states.
 *
 */
export const useGroupService = () => {
  // State for storing any error that occurs during operations
  const [error, setError] = useState(null);
  // State for tracking loading status during async operations
  const [isLoading, setIsLoading] = useState(false);
  // get show toast funciton from toast context
  const { showToast } = useToast();

  // Function to create a new group with the provided data
  const handleCreateGroup = async (groupData: GroupData) => {
    try {
      // Set loading state to true before starting the operation
      setIsLoading(true);
      // Clear any previous errors
      setError(null);
      // Call the createGroup function from groupService to create the group in Firebase
      await createGroup(groupData);
    } catch (error: any) {
      // Store the error message if an exception occurs
      setError(error.message);
      // Show toast message with error
      showToast(error.message, "error");
    } finally {
      // Reset loading state when operation completes (whether successful or not)
      setIsLoading(false);
    }
  };

  // Function to fetch all groups from the database
  const handleGetGroups = async () => {
    try {
      // Set loading state to true before starting the operation
      setIsLoading(true);
      // Clear any previous errors
      setError(null);
      // Call the getGroups function from groupService to fetch groups from Firebase
      return await getGroups();
    } catch (error: any) {
      // Store the error message if an exception occurs
      setError(error.message);
      // Return empty result in case of error
      return [];
    } finally {
      // Reset loading state when operation completes (whether successful or not)
      setIsLoading(false);
    }
  };

  // Return the hook's state and handler functions
  return {
    error,
    isLoading,
    handleCreateGroup, // Expose the create group function
    handleGetGroups, // Expose the get groups function
  };
};
