import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import FriendList from "./FriendList";
import { useFriends } from "@/lib/hooks/friendHooks";
import { useToast } from "../contexts/ToastContext";
import FormField from "../shared/FormField";
import GuestForm from "./GuestForm";

interface AddMemberProps {
  onAddFriend: (id: string, fullName: string) => void;
  onAddGuest: (fullName: string) => void;
}

const AddMember = ({ onAddFriend, onAddGuest }: AddMemberProps) => {
  const [activeTab, setActiveTab] = useState("friends");
  const { friends, loading, loadFriends } = useFriends();
  const [guestName, setGuestName] = useState("");
  const { showToast } = useToast();

  const handleAddFriend = (id: string, fullName: string) => {
    try {
      onAddFriend(id, fullName);
      showToast("Friend added successfully", "success");
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  useEffect(() => {
    if (activeTab === "friends") loadFriends();
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <View style={styles.tab} />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "friends" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("friends")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "friends" && styles.activeTabText,
            ]}
          >
            Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "guest" && styles.activeTab]}
          onPress={() => setActiveTab("guest")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "guest" && styles.activeTabText,
            ]}
          >
            Guest
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ width: "100%", height: "100%" }}>
        {activeTab === "friends" ? (
          <View style={{ height: "100%" }}>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 17,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Add your friends to the group
            </Text>
            <FriendList
              context="addMember"
              friends={friends}
              isLoading={loading}
              handleAddMember={handleAddFriend}
            />
          </View>
        ) : (
          <GuestForm onAddGuest={onAddGuest} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tab: {
    position: "absolute",
    top: 10,
    height: 5,
    width: 55,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 15,
  },
  tabContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
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

export default AddMember;
