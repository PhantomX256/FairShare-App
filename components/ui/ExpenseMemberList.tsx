import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { User } from "@/lib/firebase/groupService";
import { expenseMemberListTabs } from "@/lib/constants";
import { colors } from "@/styles/global";
import Button from "../shared/Button";

interface ExpenseMemberListProps {
  members: User[];
  totalAmount: number;
}

interface MemberShare {
  id: string;
  name: string;
  amount: number;
  shares: number;
}

const ExpenseMemberList = ({
  members,
  totalAmount,
}: ExpenseMemberListProps) => {
  const [activeTab, setActiveTab] = useState("equally");
  const [memberShares, setMemberShares] = useState<MemberShare[]>([]);

  useEffect(() => {
    const initialShares = members.map((member) => ({
      id: member.id,
      name: member.fullName,
      amount: totalAmount / members.length, // Equal split by default
      shares: 1, // Default equal share
    }));
    setMemberShares(initialShares);
  }, [members, totalAmount]);

  const updateMemberShare = (
    id: string,
    value: number,
    field: "shares" | "amount"
  ) => {
    const updatedShares = memberShares.map((member) => {
      if (member.id === id) {
        return { ...member, [field]: value };
      }
      return member;
    });
    setMemberShares(updatedShares);
  };

  const renderMemberItem = ({ item }: { item: MemberShare }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <Text style={styles.memberName}>{item.name}</Text>
      </View>

      {activeTab === "equally" && (
        <Text style={styles.amountText}>${item.amount.toFixed(2)}</Text>
      )}

      {activeTab === "shares" && (
        <View style={styles.sharesContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() =>
              updateMemberShare(item.id, Math.max(1, item.shares - 1), "shares")
            }
          >
            <Text style={styles.shareButtonText}>-</Text>
          </TouchableOpacity>
          <View style={styles.shareValueContainer}>
            <Text style={styles.shareValue}>{item.shares}</Text>
            <Text style={styles.amountText}>${item.amount.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() =>
              updateMemberShare(item.id, item.shares + 1, "shares")
            }
          >
            <Text style={styles.shareButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === "custom" && (
        <View style={styles.customAmountContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.customAmountInput}
            keyboardType="numeric"
            value={item.amount.toString()}
            onChangeText={(value) => {
              const numValue = parseFloat(value) || 0;
              updateMemberShare(item.id, numValue, "amount");
            }}
          />
        </View>
      )}
    </View>
  );

  return (
    <View>
      <View style={styles.tabContainer}>
        {expenseMemberListTabs.map((tab, index) => (
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === tab.toLowerCase() && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.toLowerCase())}
            key={index}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.toLowerCase() && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={memberShares}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <Button text="Add" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    backgroundColor: colors.offwhite,
    borderRadius: 10,
  },
  tabButton: {
    width: "33%",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 14,
    marginLeft: 5,
  },
  activeTabButton: {
    backgroundColor: colors.bossanova,
    borderRadius: 10,
  },
  activeTabText: {
    color: "white",
    fontFamily: "Poppins_500Medium",
  },
  infoContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  infoText: {
    fontFamily: "Poppins_300Light",
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  list: {
    marginTop: 15,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: colors.bossanova,
    borderRadius: 10,
  },
  avatarText: {
    color: "white",
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  memberName: {
    marginLeft: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
  },
  amountText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
    color: "#333",
  },
  sharesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  shareButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.offwhite,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  shareValueContainer: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  shareValue: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    marginBottom: 2,
  },
  customAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    marginRight: 2,
  },
  customAmountInput: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    width: 70,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    textAlign: "right",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    marginTop: 10,
  },
  totalLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  totalAmount: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: colors.bossanova,
  },
});

export default ExpenseMemberList;
