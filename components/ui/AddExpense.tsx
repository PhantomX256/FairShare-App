import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import FormField from "../shared/FormField";
import ExpenseMemberList from "./ExpenseMemberList";
import { User } from "@/lib/firebase/groupService";
import Button from "../shared/Button";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../shared/Loader";
import { colors } from "@/styles/global";
import { AntDesign } from "@expo/vector-icons";
import { FlatList } from "react-native";

interface AddExpenseProps {
  groupMembers: User[];
  isMemberLoading: boolean;
}

interface PaidByModalProps {
  groupMembers: User[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  onClose: () => void;
  currentUserId?: string | null;
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

const AddExpense = ({ groupMembers, isMemberLoading }: AddExpenseProps) => {
  const [title, setTitle] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState<User | null>(null);
  const { user } = useAuth();

  if (isMemberLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Loader height={40} color="#42224A" />
        <Text style={styles.heading}>Loading...</Text>
      </View>
    );
  }

  // Set current user as default payer
  useEffect(() => {
    if (user && !paidBy) {
      setPaidBy(user);
    }
  }, [user]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
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
        <View style={{ display: "flex", gap: 5 }}>
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
            placeholder="Enter amount"
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 16 }}>
              Paid by
            </Text>
            <TouchableWithoutFeedback onPress={() => setIsModalVisible(true)}>
              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  backgroundColor: colors.offwhite,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: "rgba(0, 0, 0, 0.7)",
                    fontFamily: "Poppins_300Light",
                  }}
                >
                  {paidBy?.fullName}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <ExpenseMemberList members={groupMembers} />
          <Button text="Add" onPress={() => {}} style={{ width: "100vw" }} />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: "white",
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  heading: {
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 30,
  },
  tab: {
    position: "absolute",
    top: 10,
    height: 5,
    width: 55,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 15,
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
