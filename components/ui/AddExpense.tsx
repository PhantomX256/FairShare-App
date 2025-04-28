import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import FormField from "../shared/FormField";
import ExpenseMemberList from "./ExpenseMemberList";
import Button from "../shared/Button";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../shared/Loader";
import { AntDesign } from "@expo/vector-icons";
import { FlatList } from "react-native";
import { useExpenseContext } from "../contexts/ExpenseContext";
import { useToast } from "../contexts/ToastContext";
import { useGroupContext } from "../contexts/GroupContext";
import { Timestamp } from "firebase/firestore";
import { User } from "@/lib/types";

interface AddExpenseProps {
  groupMembers: User[];
  isMemberLoading: boolean;
  close: () => void;
}

interface PaidByModalProps {
  groupMembers: User[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  onClose: () => void;
  currentUserId?: string | null;
}

interface MemberShare {
  id: string;
  name: string;
  equalAmount?: number;
  shares?: number;
  unequalAmount?: number;
  edited?: boolean;
}

const PaidByModal = ({
  groupMembers,
  selectedUser,
  onSelectUser,
  onClose,
  currentUserId,
}: PaidByModalProps) => {
  const renderMemberItem = ({ item }: { item: User }) => {
    const isCurrentUser = item.id === currentUserId;
    const isSelected = item.id === selectedUser?.id;

    return (
      <TouchableOpacity
        style={[styles.memberItem, isSelected && styles.selectedMemberItem]}
        onPress={() => {
          onSelectUser(item);
          onClose();
        }}
      >
        <View style={styles.memberItemLeft}>
          <View style={styles.memberAvatar}>
            <Text style={styles.memberInitial}>
              {item.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.memberName}>
            {item.fullName} {isCurrentUser ? "(me)" : ""}
          </Text>
        </View>
        {isSelected && <AntDesign name="check" size={20} color="#42224A" />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.heading}>Choose Payer</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={groupMembers}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id}
        style={styles.membersList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.membersListContent}
      />

      <Button text="Confirm" onPress={onClose} style={styles.confirmButton} />
    </View>
  );
};

const AddExpense = ({
  groupMembers,
  isMemberLoading,
  close,
}: AddExpenseProps) => {
  const [title, setTitle] = useState("");
  const [activeTab, setActiveTab] = useState("equally");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState<User | null>(null);
  const [totalShares, setTotalShares] = useState(groupMembers.length);
  const [memberShares, setMemberShares] = useState<MemberShare[]>([]);
  const { user } = useAuth();
  const { isLoading, addExpense } = useExpenseContext();
  const { currentGroup } = useGroupContext();
  const { showToast } = useToast();

  if (isMemberLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Loader height={40} color="#42224A" />
        <Text style={styles.heading}>Loading...</Text>
      </View>
    );
  }

  const handleAddExpense = async () => {
    if (!title || !amount || !paidBy || memberShares.length === 0) {
      showToast("All fields are required", "error");
      return;
    }

    // Convert string amount to number
    const numAmount = parseFloat(amount);

    // Create payers array with single payer for now
    const payers = [
      {
        userId: paidBy.id,
        paidAmount: numAmount,
      },
    ];

    // Transform memberShares into the required Member format
    const members = memberShares.map((member) => {
      // Determine the amount owed based on active tab
      let amountOwed = 0;

      if (activeTab === "equally") {
        amountOwed = member.equalAmount || 0;
      } else if (activeTab === "shares") {
        amountOwed =
          totalShares > 0
            ? (numAmount * (member.shares || 0)) / totalShares
            : 0;
      } else if (activeTab === "unequally") {
        amountOwed = member.unequalAmount || 0;
      }

      return {
        userId: member.id,
        amountOwed: amountOwed,
      };
    });

    const expenseData = {
      title,
      amount: numAmount,
      payers,
      members,
      groupId: currentGroup?.id, // You'll need to have this available
      date: Timestamp.now(),
      type: activeTab,
    };

    // Call the addExpense function from your context
    await addExpense(expenseData);

    showToast("Expense added successfully", "success");

    close();
  };

  // Set current user as default payer
  useEffect(() => {
    if (user && !paidBy) {
      setPaidBy(user);
    }
  }, [user]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 30}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Modal
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
            animationType="slide"
            presentationStyle="pageSheet"
          >
            <PaidByModal
              groupMembers={groupMembers}
              selectedUser={paidBy}
              onSelectUser={setPaidBy}
              onClose={() => setIsModalVisible(false)}
              currentUserId={user?.id}
            />
          </Modal>
          <View style={styles.tab} />
          <Text style={styles.heading}>Add Expense</Text>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <FormField
                label="Expense Title"
                value={title}
                handleChange={(e) => setTitle(e)}
                placeholder="Enter a title for the expense"
                keyboardType="default"
              />
              <FormField
                label="Expense Amount"
                value={amount}
                handleChange={(e) => setAmount(e)}
                keyboardType="numeric"
                placeholder="0.00"
              />
              <View style={styles.paidByContainer}>
                <Text style={styles.paidByLabel}>Paid by</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                  <View style={styles.paidBySelector}>
                    <Text style={styles.paidByText}>
                      {paidBy?.fullName || "Select person"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <ExpenseMemberList
                members={groupMembers}
                totalAmount={parseFloat(amount)}
                memberShares={memberShares}
                setMemberShares={setMemberShares}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                totalShares={totalShares}
                setTotalShares={setTotalShares}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              text="Add"
              onPress={handleAddExpense}
              isLoading={isLoading}
              style={styles.addButton}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  scrollView: {
    width: "100%",
    flex: 1,
  },
  scrollViewContent: {
    padding: 30,
    paddingBottom: 80, // Extra padding at the bottom for button space
  },
  formContainer: {
    width: "100%",
    gap: 5,
  },
  heading: {
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
    textAlign: "center",
    marginVertical: 30,
    paddingHorizontal: 30,
  },
  tab: {
    position: "absolute",
    top: 10,
    height: 5,
    width: 55,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 15,
  },
  paidByContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginVertical: 10,
  },
  paidByLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  paidBySelector: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  paidByText: {
    color: "rgba(0, 0, 0, 0.7)",
    fontFamily: "Poppins_300Light",
  },
  buttonContainer: {
    width: "100%",
    padding: 20,
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  addButton: {
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    padding: 30,
    backgroundColor: "white",
    position: "relative",
    alignItems: "center",
  },
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 5,
  },
  membersList: {
    width: "100%",
    marginBottom: 20,
  },
  membersListContent: {
    paddingBottom: 20,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedMemberItem: {
    backgroundColor: "rgba(66, 34, 74, 0.05)",
  },
  memberItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#42224A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  memberInitial: {
    color: "white",
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
  },
  memberName: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#333",
  },
  confirmButton: {
    width: "100%",
    marginTop: 10,
  },
});

export default AddExpense;
