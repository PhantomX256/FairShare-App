import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import { useGroupContext } from "../contexts/GroupContext";

interface BalanceListProps {
  balances: Map<string, { id: string; balance: number }>;
  isLoading: boolean;
}

const BalanceList = ({ balances, isLoading }: BalanceListProps) => {
  const { currentGroupMembers } = useGroupContext();

  // Convert Map to array for FlatList
  const balanceArray = Array.from(balances, ([userId, data]) => ({
    userId,
    ...data,
  }));

  const renderItem = ({ item }: any) => {
    // Find the user in currentGroupMembers
    const user = currentGroupMembers.find(
      (member) => member.id === item.userId
    );

    if (!user) return null;

    // Get first letter for avatar
    const firstLetter = user.fullName.charAt(0).toUpperCase();

    return (
      <View style={styles.itemContainer}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{firstLetter}</Text>
        </View>
        <Text style={styles.userName}>{user.fullName}</Text>
        <Text
          style={[
            styles.balance,
            item.balance > 0
              ? styles.positiveBalance
              : item.balance < 0
              ? styles.negativeBalance
              : styles.zeroBalance,
          ]}
        >
          {item.balance > 0 ? "+" : ""}
          {item.balance.toFixed(2)}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading balances...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={balanceArray}
        renderItem={renderItem}
        keyExtractor={(item) => item.userId}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No balances to display</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins_500Medium",
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  balance: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  positiveBalance: {
    color: "green",
  },
  negativeBalance: {
    color: "red",
  },
  zeroBalance: {
    color: "gray",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
    fontFamily: "Poppins_400Regular",
  },
});

export default BalanceList;
