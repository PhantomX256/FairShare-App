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
import { Expense } from "@/lib/firebase/expenseService";

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  onPressExpense: (expense: Expense) => void;
}

function formatDate(timestamp: any): string {
  if (!timestamp || !timestamp.seconds) {
    return "No date";
  }

  // Create date from seconds
  const date = new Date(timestamp.seconds * 1000);

  // Format the date
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ExpenseList = ({
  expenses,
  isLoading,
  onPressExpense,
}: ExpenseListProps) => {
  // Show loading indicator when data is being fetched
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loader height={40} color="#42224A" />
        <Text style={styles.loadingText}>Loading expenses...</Text>
      </View>
    );
  }

  // Display empty state when no expenses exist
  if (expenses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No expenses found</Text>
        <Text style={styles.emptySubtext}>Add an expense to get started!</Text>
      </View>
    );
  }

  // Render function for each expense item in the list
  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity
      style={styles.expenseItem}
      onPress={() => onPressExpense(item)}
    >
      {/* Left section contains icon and expense details */}
      <View style={styles.leftSection}>
        {/* Circular container for the expense icon */}
        <View style={styles.iconContainer}>
          <Feather name="credit-card" size={20} color="white" />
        </View>
        {/* Container for expense title and date */}
        <View style={styles.expenseTextContainer}>
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.expenseDate}>{formatDate(item.date)}</Text>
        </View>
      </View>
      {/* Right section shows the expense amount */}
      <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  // Return the FlatList that renders all expenses
  return (
    <FlatList
      data={expenses}
      renderItem={renderExpenseItem}
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
  expenseItem: {
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
  expenseTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  expenseTitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#333",
  },
  expenseDate: {
    fontFamily: "Poppins_300Light",
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  amount: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: "#42224A",
  },
});

export default ExpenseList;
