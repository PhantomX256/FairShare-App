import { useToast } from "@/components/contexts/ToastContext";
import { useState } from "react";
import {
  cancelFriendRequest,
  getFriends,
  getReceivedFriendRequests,
  getSentFriendRequests,
  removeFriend,
  respondToFriendRequest,
  sendFriendRequest,
} from "../firebase/friendService";

/**
 * Custom hook for managing friend operations and requests
 */
export const useFriends = () => {
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  /**
   * Loads all friends
   */
  const loadFriends = async () => {
    try {
      setLoading(true);
      const friendsList = await getFriends();
      setFriends(friendsList);
      return friendsList;
    } catch (error: any) {
      showToast(error.message, "error");
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loads all received friend requests
   */
  const loadReceivedRequests = async () => {
    try {
      setLoading(true);
      const requests = await getReceivedFriendRequests();
      setReceivedRequests(requests);
      return requests;
    } catch (error: any) {
      showToast(error.message, "error");
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loads all sent friend requests
   */
  const loadSentRequests = async () => {
    try {
      setLoading(true);
      const requests = await getSentFriendRequests();
      setSentRequests(requests);
      return requests;
    } catch (error: any) {
      showToast(error.message, "error");
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles sending a friend request
   */
  const handleSendFriendRequest = async (receiverId: string) => {
    try {
      setLoading(true);
      const request = await sendFriendRequest(receiverId);
      // Refresh sent requests
      await loadSentRequests();
      return request;
    } catch (error: any) {
      showToast(error.message, "error");
      return null;
    } finally {
      setLoading(false);
      showToast(`Friend request sent!`, "success");
    }
  };

  /**
   * Handles accepting a friend request
   */
  const handleAcceptFriendRequest = async (requestId: string) => {
    try {
      setLoading(true);
      await respondToFriendRequest(requestId, true);
      // Refresh friends and requests lists
      await Promise.all([loadReceivedRequests()]);
    } catch (error: any) {
      showToast(error.message, "error");
      return false;
    } finally {
      setLoading(false);
      showToast("Friend request accepted!", "success");
    }
  };

  /**
   * Handles declining a friend request
   */
  const handleDeclineFriendRequest = async (requestId: string) => {
    try {
      setLoading(true);
      await respondToFriendRequest(requestId, false);
      // Refresh received requests
      await loadReceivedRequests();
      return true;
    } catch (error: any) {
      showToast(error.message, "error");
      return false;
    } finally {
      setLoading(false);
      showToast("Friend request declined.", "info");
    }
  };

  /**
   * Handles canceling a sent friend request
   */
  const handleCancelFriendRequest = async (requestId: string) => {
    try {
      setLoading(true);
      await cancelFriendRequest(requestId);

      // Refresh sent requests
      await loadSentRequests();
    } catch (error: any) {
      showToast(error.message, "error");
      return false;
    } finally {
      setLoading(false);
      showToast("Friend request canceled.", "info");
    }
  };

  /**
   * Handles removing a friend
   */
  const handleRemoveFriend = async (friendId: string, friendName: string) => {
    try {
      setLoading(true);
      await removeFriend(friendId);

      // Refresh the friends list
      await loadFriends();
    } catch (error: any) {
      showToast(error.message, "error");
      return false;
    } finally {
      showToast(`${friendName || "Friend"} removed from your friends.`, "info");
      setLoading(false);
    }
  };

  /**
   * Loads all friend data (friends, received requests, sent requests)
   */
  const loadAllFriendData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadFriends(),
        loadReceivedRequests(),
        loadSentRequests(),
      ]);
    } catch (error: any) {
      showToast("Failed to load some friend data.", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    loading,
    friends,
    receivedRequests,
    sentRequests,
    error,

    // Data loading methods
    loadFriends,
    loadReceivedRequests,
    loadSentRequests,
    loadAllFriendData,

    // Action handlers
    handleSendFriendRequest,
    handleAcceptFriendRequest,
    handleDeclineFriendRequest,
    handleCancelFriendRequest,
    handleRemoveFriend,
  };
};
