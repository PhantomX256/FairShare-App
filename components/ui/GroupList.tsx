import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Loader from "../shared/Loader";
import { Group } from "@/lib/firebase/groupService";

interface GroupListProps {
  groups: Group[];
  isLoading: boolean;
  onGroupPress?: (group: Group) => void;
}

const GroupList = ({ groups, isLoading, onGroupPress }: GroupListProps) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loader height={40} color="#42224A" />
        <Text style={styles.loadingText}>Loading your groups...</Text>
      </View>
    );
  }

  if (groups.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You don't have any groups yet.</Text>
        <Text style={styles.emptySubtext}>Create a group to get started!</Text>
      </View>
    );
  }

  // Render each individual group item
  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => onGroupPress && onGroupPress(item)}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Feather name="users" size={20} color="white" />
        </View>
        <View style={styles.groupTextContainer}>
          <Text style={styles.groupName}>{item.groupName}</Text>
          {item.description && (
            <Text style={styles.groupDescription} numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>
      </View>
      <Text style={styles.memberCount}>
        {(item.users?.length || 0) + (item.guests?.length || 0)} members
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={groups}
      renderItem={renderGroupItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: "50%",
  },
  loadingText: {
    fontFamily: "Poppins_300Light",
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: "50%",
  },
  emptyText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#42224A",
    textAlign: "center",
  },
  emptySubtext: {
    fontFamily: "Poppins_300Light",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  list: {
    width: "100%",
  },
  listContent: {
    paddingVertical: 10,
  },
  groupItem: {
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
  iconContainer: {
    height: 40,
    width: 40,
    backgroundColor: "#42224A",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  groupTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  groupName: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#333",
  },
  groupDescription: {
    fontFamily: "Poppins_300Light",
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  memberCount: {
    fontFamily: "Poppins_300Light",
    fontSize: 12,
    color: "#888",
  },
});

export default GroupList;
