import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useGroupContext } from "@/components/contexts/GroupContext";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useExpenseContext } from "@/components/contexts/ExpenseContext";
import ExpenseList from "@/components/ui/ExpenseList";
import { Expense } from "@/lib/firebase/expenseService";
import AddExpense from "@/components/ui/AddExpense";
import { ToastProvider } from "@/components/contexts/ToastContext";
import { router } from "expo-router";
import BalanceList from "@/components/ui/BalanceList";
import SplitModal from "@/components/ui/SplitModal";

const group = () => {
  // Destructure from GroupContext to get the current group, its members, and loading state
  const {
    currentGroup,
    currentGroupMembers,
    isMemberLoading,
    currentGroupBalances,
    isBalanceLoading,
    splits,
    isSplitLoading,
  } = useGroupContext();
  // State hook to track which tab is active - 'expenses' or 'balances'
  const [activeTab, setActiveTab] = useState("expenses");
  // State hook to control the visibility of the expense creation modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Destructure from ExpenseContext to get expenses data and related functions
  const { expenses, setCurrentExpense, isLoading, fetchExpenses } =
    useExpenseContext();

  // Effect hook that runs whenever the currentGroup changes
  useEffect(() => {
    // Fetch expenses for the current group
    fetchExpenses();
  }, [currentGroup]);

  // Handler function for when an expense is selected
  const onPressExpense = (expense: Expense) => {
    // Update the current expense in the expense context
    setCurrentExpense(expense);
    router.push("/expense");
  };

  return (
    <View style={styles.container}>
      {/* Group settings icon */}
      <Ionicons
        style={styles.settingsIcon}
        name="settings-sharp"
        size={24}
        color="black"
      />

      {/* Group Icon */}
      <View style={styles.iconContainer}>
        <Feather name="users" size={20} color="white" />
      </View>

      {/* Group Name */}
      <Text style={styles.heading}>{currentGroup?.groupName}</Text>

      {/* Expenses and Balances Tab */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "expenses" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("expenses")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "expenses" && styles.activeTabText,
            ]}
          >
            Expenses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "balances" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("balances")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "balances" && styles.activeTabText,
            ]}
          >
            Balances
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "expenses" ? (
        <ExpenseList
          expenses={expenses}
          isLoading={isLoading}
          onPressExpense={onPressExpense}
        />
      ) : (
        <BalanceList
          balances={currentGroupBalances}
          isLoading={isBalanceLoading}
        />
      )}

      {/* Add expenses icon at the end */}
      {activeTab === "expenses" && (
        <View style={styles.addIconContainer}>
          <AntDesign
            name="pluscircle"
            onPress={() => setIsModalVisible(true)}
            size={50}
            color="#EF8767"
          />
          <Text
            style={{
              fontFamily: "Poppins_300Light",
              fontSize: 15,
              textAlign: "center",
            }}
          >
            Add Expense
          </Text>
        </View>
      )}

      {activeTab === "balances" && (
        <View style={styles.addIconContainer}>
          <AntDesign
            name="pluscircle"
            onPress={() => setIsModalVisible(true)}
            size={50}
            color="#EF8767"
          />
          <Text
            style={{
              fontFamily: "Poppins_300Light",
              fontSize: 15,
              textAlign: "center",
            }}
          >
            View Splits
          </Text>
        </View>
      )}

      {currentGroup && (
        <Modal
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <ToastProvider>
            {activeTab === "expenses" && (
              <AddExpense
                isMemberLoading={isMemberLoading}
                groupMembers={currentGroupMembers}
                close={() => setIsModalVisible(false)}
              />
            )}
            {activeTab === "balances" && <SplitModal />}
          </ToastProvider>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    padding: 30,
    paddingVertical: 50,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  settingsIcon: {
    position: "absolute",
    right: 30,
    top: 50,
    opacity: 0.4,
  },
  heading: {
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
  },
  iconContainer: {
    height: 40,
    width: 40,
    backgroundColor: "#42224A",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  addIconContainer: {
    position: "absolute",
    bottom: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "25%",
    gap: 10,
  },
  tabContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  tabButton: {
    width: "50%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.3)",
  },
  tabText: {
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    color: "rgba(0, 0, 0, 0.3)",
    fontSize: 15,
  },
  activeTab: {
    borderBottomColor: "#42224A",
    borderBottomWidth: 2,
  },
  activeTabText: {
    fontFamily: "Poppins_500Medium",
    color: "#42224A",
  },
});

export default group;
