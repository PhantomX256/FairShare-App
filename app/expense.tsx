import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useExpenseContext } from "@/components/contexts/ExpenseContext";
import { formatDate } from "@/lib/constants";
import { Feather } from "@expo/vector-icons";
import { useGroupContext } from "@/components/contexts/GroupContext";
import { Member, User } from "@/lib/types";
import { usePopup } from "@/components/contexts/PopupContext";
import { router } from "expo-router";

// Define the RemoveExpensePopup component
const RemoveExpensePopup = ({
  expenseTitle,
  onConfirm,
  onCancel,
}: {
  expenseTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <View style={popupStyles.container}>
      <Text style={popupStyles.title}>Remove Expense</Text>
      <Text style={popupStyles.message}>
        Are you sure you want to remove "{expenseTitle}"?
      </Text>
      <View style={popupStyles.buttonsContainer}>
        <TouchableOpacity
          style={[popupStyles.button, popupStyles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={popupStyles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[popupStyles.button, popupStyles.confirmButton]}
          onPress={onConfirm}
        >
          <Text style={[popupStyles.buttonText, popupStyles.confirmText]}>
            Remove
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const expense = () => {
  // Get the details of the currently selected expense
  const { currentExpense, deleteExpense } = useExpenseContext();

  // Get the list of group members of the currently selected group
  const { currentGroupMembers } = useGroupContext();

  // Create a state to store the details of involved members in the expese
  const [expenseMembers, setExpenseMembers] = useState<User[]>([]);

  // Create a state to store the details of the payer
  const [payerDetails, setPayerDetails] = useState<User | null>(null);

  const { showPopup, setPopupContent, hidePopup } = usePopup();

  // Handle delete expense
  const handleDeletePress = () => {
    setPopupContent(
      <RemoveExpensePopup
        expenseTitle={currentExpense?.title || "this expense"}
        onConfirm={async () => {
          await deleteExpense();
          hidePopup();
          router.replace("/group");
        }}
        onCancel={hidePopup}
      />
    );
    showPopup();
  };

  // When the component renders get the payer and expense member details
  useEffect(() => {
    // get the user id of the payer
    const payerId = currentExpense?.payers[0].userId;

    // get the details of the payer from current group member list
    setPayerDetails(
      currentGroupMembers.find((member) => member.id === payerId) || null
    );

    // Get the list of member IDs from the expense
    const memberIds =
      currentExpense?.members.map((member: Member) => member.userId) || [];

    // Get the details of each member from the currentGroupMembers
    const memberDetails = memberIds
      .map((memberId: string) =>
        currentGroupMembers.find((member) => member.id === memberId)
      )
      .filter((member: Member) => member !== undefined);

    // Set the expense members state
    setExpenseMembers(memberDetails);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Edit Icon */}
      <View style={styles.iconsContainer}>
        <Feather
          name="edit"
          size={24}
          color={"rgba(0, 0, 0, 0.2)"}
          style={styles.actionIcon}
        />
        <TouchableOpacity onPress={handleDeletePress}>
          <Feather
            name="trash-2"
            size={24}
            color={"rgba(0, 0, 0, 0.2)"}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Expense Icon */}
      <View style={styles.iconContainer}>
        <Feather name="credit-card" size={20} color="white" />
      </View>

      {/* Expense Title */}
      <Text style={styles.heading}>
        {currentExpense?.title || "Expense Title"}
      </Text>

      {/* Expense Date */}
      <Text style={styles.expenseDate}>{formatDate(currentExpense?.date)}</Text>

      {/* Payer Details */}
      <View style={styles.paidByContainer}>
        <Text style={styles.paidByText}>Paid By</Text>
        <View style={styles.userIconAndTextContainer}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <View style={styles.userIcon}>
              <Text style={styles.userIconText}>
                {payerDetails?.fullName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userText}>{payerDetails?.fullName}</Text>
          </View>
          <Text style={[styles.amount, { color: "green" }]}>
            ${currentExpense?.amount.toString()}
          </Text>
        </View>
      </View>

      {/* Member Details */}
      <View style={styles.membersContainer}>
        <Text style={styles.membersText}>Split Between</Text>
        <FlatList
          data={expenseMembers}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => {
            // Find the member's share amount in the currentExpense
            const memberShare =
              currentExpense?.members.find(
                (member: Member) => member.userId === item.id
              )?.amountOwed || 0;

            return (
              <View style={styles.userItemContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <View style={styles.userIcon}>
                    <Text style={styles.userIconText}>
                      {item.fullName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.userText}>{item.fullName}</Text>
                </View>
                <Text style={[styles.amount, { color: "red" }]}>
                  ${memberShare.toString()}
                </Text>
              </View>
            );
          }}
          style={styles.membersList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 30,
    alignItems: "center",
  },
  heading: {
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
    textAlign: "center",
  },
  expenseDate: {
    fontFamily: "Poppins_300Light",
    textAlign: "center",
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
  paidByContainer: {
    width: "100%",
    marginTop: 50,
  },
  paidByText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
  userIconAndTextContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  iconsContainer: {
    position: "absolute",
    right: 30,
    top: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    marginLeft: 20,
  },
  userIcon: {
    height: 40,
    width: 40,
    backgroundColor: "#42224A",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  userIconText: {
    color: "white",
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
  },
  userText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
  amount: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
  membersContainer: {
    width: "100%",
    marginTop: 30,
  },
  membersText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    marginBottom: 10,
  },
  membersList: {
    width: "100%",
  },
  userItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  editIcon: {
    position: "absolute",
    right: 30,
    top: 30,
  },
});

const popupStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    marginBottom: 15,
    color: "#42224A",
  },
  message: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 12,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
  },
  confirmButton: {
    backgroundColor: "#FFEBEB",
  },
  confirmText: {
    color: "#FF5252",
  },
});

export default expense;
