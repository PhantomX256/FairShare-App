import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Loader from "../shared/Loader";
import Entypo from "@expo/vector-icons/Entypo";
import { usePopup } from "../contexts/PopupContext";

interface Friend {
  fullName: string;
  id: string;
}

interface FriendListProps {
  context: string;
  friends: Friend[];
  isLoading: boolean;
  handleRemoveFriend?: (id: string, name?: string) => void;
  handleAddMember?: (id: string, fullName: string) => void;
}

interface RemoveFriendPopupProps {
  friendName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const RemoveFriendPopup = ({
  friendName,
  onConfirm,
  onCancel,
}: RemoveFriendPopupProps) => {
  return (
    <View style={styles.popupContainer}>
      <Text style={styles.popupTitle}>Remove Friend</Text>
      <Text style={styles.popupMessage}>
        Are you sure you want to remove {friendName} from your friends list?
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={onConfirm}
        >
          <Text style={styles.confirmButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FriendList = ({
  context,
  friends,
  isLoading,
  handleRemoveFriend,
  handleAddMember,
}: FriendListProps) => {
  const { showPopup, setPopupContent, hidePopup } = usePopup();

  const showRemoveConfirmation = (friend: Friend) => {
    setPopupContent(
      <RemoveFriendPopup
        friendName={friend.fullName}
        onConfirm={() => {
          if (handleRemoveFriend) {
            handleRemoveFriend(friend.id, friend.fullName);
          }
          hidePopup();
        }}
        onCancel={() => {
          hidePopup();
        }}
      />
    );

    showPopup();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loader height={40} color="#42224A" />
      </View>
    );
  }

  if (friends.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.text, { color: "rgba(0, 0, 0, 0.2)" }]}>
          No friends found
        </Text>
      </View>
    );
  }

  const renderFriendItem = ({ item: friend }: { item: Friend }) => (
    <View style={styles.friendItem}>
      <View style={styles.leftSection}>
        <View style={styles.photoContainer}>
          <Text style={styles.photoPlaceholder}>
            {friend.fullName?.charAt(0).toUpperCase() || "?"}
          </Text>
        </View>
        <Text style={styles.friendName}>{friend.fullName}</Text>
      </View>
      {context === "addMember"
        ? handleAddMember && (
            <TouchableOpacity
              onPress={() => handleAddMember(friend.id, friend.fullName)}
              style={styles.removeButton}
            >
              <Entypo name="plus" size={26} color="rgba(0, 128, 0, 0.7)" />
            </TouchableOpacity>
          )
        : handleRemoveFriend && (
            <TouchableOpacity
              onPress={() => showRemoveConfirmation(friend)}
              style={styles.removeButton}
            >
              <Entypo name="cross" size={26} color="rgba(255, 0, 0, 0.5)" />
            </TouchableOpacity>
          )}
    </View>
  );

  return (
    <FlatList
      data={friends}
      renderItem={renderFriendItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    width: "90%",
  },
  popupTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    color: "#42224A",
    marginBottom: 12,
    textAlign: "center",
  },
  popupMessage: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  confirmButton: {
    backgroundColor: "#42224A",
  },
  cancelButtonText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#42224A",
  },
  confirmButtonText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "white",
  },
  loadingContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    width: "100%",
  },
  listContent: {
    paddingVertical: 10,
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  photoContainer: {
    height: 40,
    width: 40,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholder: {
    fontSize: 20,
    fontFamily: "Poppins_500Medium",
    color: "white",
  },
  friendName: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  removeButton: {
    padding: 8,
  },
  text: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
});

export default FriendList;
