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

interface ExpenseMemberListProps {
  members: User[];
  totalAmount: number;
  memberShares: MemberShare[];
  setMemberShares: React.Dispatch<React.SetStateAction<MemberShare[]>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  totalShares: number;
  setTotalShares: React.Dispatch<React.SetStateAction<number>>;
}

interface MemberShare {
  id: string;
  name: string;
  equalAmount?: number;
  shares?: number;
  unequalAmount?: number;
  edited?: boolean;
  included?: boolean;
}

const ExpenseMemberList = ({
  members,
  totalAmount,
  memberShares,
  setMemberShares,
  activeTab,
  setActiveTab,
  totalShares,
  setTotalShares,
}: ExpenseMemberListProps) => {
  const [editingInput, setEditingInput] = useState<{
    memberId: string | null;
    value: string | null;
  }>({
    memberId: null,
    value: null,
  });

  useEffect(() => {
    const initializeMemberShares = () => {
      const equalShare =
        !isNaN(totalAmount) && totalAmount > 0
          ? totalAmount / members.length
          : 0;

      const newMemberShares = members.map((member) => ({
        id: member.id,
        name: member.fullName,
        equalAmount: equalShare,
        shares: 1,
        unequalAmount: equalShare,
        edited: false,
        included: true, // Initialize all members as included by default
      }));

      setMemberShares(newMemberShares);
    };

    // Call the initialization when relevant props change
    initializeMemberShares();
  }, []);

  useEffect(() => {
    if (activeTab === "equally") {
      // Count included members
      const includedMembersCount = memberShares.filter(
        (member) => member.included
      ).length;
      // Check if there are any included members to avoid division by zero
      const equalShare =
        totalAmount && includedMembersCount > 0
          ? totalAmount / includedMembersCount
          : 0;

      // Only update if the new calculated share is different
      const needsUpdate = memberShares.some(
        (member) => member.included && member.equalAmount !== equalShare
      );

      if (needsUpdate) {
        setMemberShares((prevShares) =>
          prevShares.map((member) => ({
            ...member,
            equalAmount: member.included ? equalShare : 0,
          }))
        );
      }
    }
  }, [activeTab, totalAmount, memberShares.map((m) => m.included).join(",")]);

  useEffect(() => {
    if (activeTab === "unequally") {
      updateOtherMemberAmounts();
    } else {
      setMemberShares((prev) =>
        prev.map((member) => ({
          ...member,
          edited: false,
        }))
      );
    }
  }, [activeTab, totalAmount]);

  // Add a function to toggle member inclusion
  const toggleMemberInclusion = (id: string) => {
    if (activeTab !== "equally") return;

    setMemberShares((prevShares) =>
      prevShares.map((member) => {
        if (member.id === id) {
          return { ...member, included: !member.included };
        }
        return member;
      })
    );
  };

  const updateMemberShare = (id: string, value: number) => {
    const updatedShares = memberShares.map((member) => {
      if (member.id === id) {
        return { ...member, shares: value };
      }
      return member;
    });
    setMemberShares(updatedShares);
  };

  const updateMemberAmount = (id: string, value: number) => {
    setMemberShares((prevShares) =>
      prevShares.map((member) => {
        if (member.id === id) {
          return { ...member, unequalAmount: value, edited: true };
        }
        return member;
      })
    );
    updateOtherMemberAmounts();
  };

  const updateOtherMemberAmounts = () => {
    setMemberShares((currentShares) => {
      // Calculate how many members have been manually edited
      const editedCount = currentShares.filter(
        (member) => member.edited
      ).length;

      // Calculate the sum of amounts from edited members
      const editedTotal = currentShares.reduce((sum, member) => {
        return member.edited ? sum + (member.unequalAmount || 0) : sum;
      }, 0);

      // Calculate remaining amount to distribute
      const remainingAmount = totalAmount - editedTotal;

      // Calculate how many members are left for auto-distribution
      const remainingMembers = members.length - editedCount;

      // Calculate amount per remaining member
      const amountPerRemainingMember =
        remainingMembers > 0 && remainingAmount >= 0
          ? remainingAmount / remainingMembers
          : 0;

      // Return updated shares
      return currentShares.map((member) => {
        if (!member.edited) {
          return { ...member, unequalAmount: amountPerRemainingMember };
        }
        return member;
      });
    });
  };

  const renderMemberItem = ({ item }: { item: MemberShare }) => (
    <TouchableOpacity
      style={[
        styles.memberItem,
        activeTab === "equally" && !item.included && styles.excludedMember,
      ]}
      onPress={() => activeTab === "equally" && toggleMemberInclusion(item.id)}
      activeOpacity={activeTab === "equally" ? 0.7 : 1}
    >
      <View style={styles.memberInfo}>
        <View
          style={[
            styles.avatarContainer,
            activeTab === "equally" && !item.included && styles.excludedAvatar,
          ]}
        >
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <Text
          style={[
            styles.memberName,
            activeTab === "equally" && !item.included && styles.excludedText,
          ]}
        >
          {item.name}
          {activeTab === "equally" && !item.included && " (excluded)"}
        </Text>
      </View>

      {activeTab === "equally" && (
        <Text
          style={[styles.amountText, !item.included && styles.excludedText]}
        >
          {item.included ? `$${item.equalAmount?.toFixed(2)}` : "—"}
        </Text>
      )}

      {activeTab === "shares" && (
        <View style={styles.sharesContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => {
              if ((item.shares || 0) - 1 >= 0) {
                updateMemberShare(item.id, (item.shares || 0) - 1);
                setTotalShares((prev) => --prev);
              }
            }}
          >
            <Text style={styles.shareButtonText}>-</Text>
          </TouchableOpacity>
          <View style={styles.shareValueContainer}>
            <Text style={styles.shareValue}>{item.shares}</Text>
            <Text style={styles.amountText}>
              $
              {totalAmount
                ? ((totalAmount * (item.shares || 0)) / totalShares).toFixed(2)
                : 0}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => {
              updateMemberShare(item.id, (item.shares || 0) + 1);
              setTotalShares((prev) => ++prev);
            }}
          >
            <Text style={styles.shareButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === "unequally" && (
        <View style={styles.customAmountContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.customAmountInput}
            keyboardType="numeric"
            value={
              editingInput.memberId === item.id
                ? editingInput.value
                : item.unequalAmount?.toFixed(2).toString()
            }
            onChangeText={(value) => {
              // Only update the temporary input state while editing
              setEditingInput({
                memberId: item.id,
                value: value,
              });
            }}
            onBlur={() => {
              // When focus is lost, apply the actual update with number parsing
              if (
                editingInput.memberId === item.id &&
                editingInput.value !== null
              ) {
                const numValue = parseFloat(editingInput.value) || 0;
                updateMemberAmount(item.id, numValue);
                setEditingInput({ memberId: null, value: null });
              }
            }}
            onFocus={() => {
              // When focused, initialize the editing state
              setEditingInput({
                memberId: item.id,
                value: item.unequalAmount?.toFixed(2).toString(),
              });
            }}
            selectTextOnFocus={true}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, maxHeight: 375 }}>
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
    </View>
  );
};

const styles = StyleSheet.create({
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
  excludedMember: {
    opacity: 0.7,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  excludedText: {
    color: "rgba(0,0,0,0.5)",
    fontStyle: "italic",
  },
  excludedAvatar: {
    backgroundColor: "rgba(100,70,115,0.5)", // Faded version of colors.bossanova
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
