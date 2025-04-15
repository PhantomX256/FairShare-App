import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import { Split } from "@/lib/types";
import { useGroupContext } from "../contexts/GroupContext";
import Loader from "../shared/Loader";
import { MaterialIcons } from "@expo/vector-icons";

const SplitModal = () => {
  const { splits, isSplitLoading, currentGroupMembers } = useGroupContext();

  if (isSplitLoading) {
    return (
      <View style={styles.container}>
        <Loader height={24} color="#42224A" />
      </View>
    );
  }

  const renderAvatar = (userId: string) => {
    const member = currentGroupMembers.find((member) => member.id === userId);
    const initial = member?.fullName?.charAt(0).toUpperCase() || "?";

    return (
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Split }) => {
    const fromMember = currentGroupMembers.find(
      (member) => member.id === item.from
    );
    const toMember = currentGroupMembers.find(
      (member) => member.id === item.to
    );

    return (
      <View style={styles.splitItem}>
        <View style={styles.personContainer}>
          {renderAvatar(item.from)}
          <Text style={styles.personName}>
            {fromMember?.fullName?.split(" ")[0] || "Unknown"}
          </Text>
        </View>

        <View style={styles.arrowContainer}>
          <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#42224A" />
        </View>

        <View style={styles.personContainer}>
          {renderAvatar(item.to)}
          <Text style={styles.personName}>
            {toMember?.fullName?.split(" ")[0] || "Unknown"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Split Summary</Text>
      {splits.length > 0 ? (
        <FlatList
          data={splits}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            `split-${item.from}-${item.to}-${index}`
          }
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No splits to display</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#42224A",
  },
  listContent: {
    paddingBottom: 16,
  },
  splitItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  personContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#42224A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  personName: {
    fontSize: 16,
  },
  arrowContainer: {
    alignItems: "center",
    flex: 1,
  },
  amount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#42224A",
    marginBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#757575",
    fontSize: 16,
  },
});

export default SplitModal;
