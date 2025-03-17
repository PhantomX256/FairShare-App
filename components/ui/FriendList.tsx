import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Loader from "../shared/Loader";
import Entypo from "@expo/vector-icons/Entypo";

interface Friend {
  fullName: string;
  id: string;
  // Add other properties that a friend might have
}

interface FriendListProps {
  friends: Friend[];
  isLoading: boolean;
  handleRemoveFriend: (id: string, name?: string) => void;
}

const FriendList = ({
  friends,
  isLoading,
  handleRemoveFriend,
}: FriendListProps) => {
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
      <TouchableOpacity
        onPress={() => handleRemoveFriend(friend.id, friend.fullName)}
        style={styles.removeButton}
      >
        <Entypo name="cross" size={26} color="rgba(255, 0, 0, 0.5)" />
      </TouchableOpacity>
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
