import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { act, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useFriends } from "@/lib/hooks/friendHooks";
import Loader from "../shared/Loader";
import Entypo from "@expo/vector-icons/Entypo";

const Requests = () => {
  const [activeTab, setActiveTab] = useState("received");
  const {
    receivedRequests,
    sentRequests,
    loading,
    loadReceivedRequests,
    loadSentRequests,
    handleAcceptFriendRequest,
    handleDeclineFriendRequest,
    handleCancelFriendRequest,
  } = useFriends();

  useEffect(() => {
    if (activeTab === "received") {
      loadReceivedRequests();
    } else {
      loadSentRequests();
    }
  }, [activeTab]);

  interface FriendRequest {
    id: string;
    receiver?: {
      fullName: string;
    };
    sender?: {
      fullName: string;
    };
  }

  const ReceivedRequests = ({ item }: { item: FriendRequest }) => {
    return (
      <View style={styles.requestContainer}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View style={styles.profilePhoto} />
          <Text style={{ fontFamily: "Poppins_400Regular" }}>
            {item.sender?.fullName || "Unknown User"}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <TouchableOpacity onPress={() => handleAcceptFriendRequest(item.id)}>
            <Entypo name="check" size={30} color="rgba(0, 255, 0, 1)" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeclineFriendRequest(item.id)}>
            <Entypo name="cross" size={30} color="rgba(255, 0, 0, 0.5)" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const SentRequests = ({ item }: { item: FriendRequest }) => {
    return (
      <View style={styles.requestContainer}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View style={styles.profilePhoto} />
          <Text style={{ fontFamily: "Poppins_400Regular" }}>
            {item.receiver?.fullName || "Unknown User"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleCancelFriendRequest(item.id)}>
          <Entypo name="cross" size={30} color="rgba(255, 0, 0, 0.5)" />
        </TouchableOpacity>
      </View>
    );
  };

  const EmptyList = () => {
    return (
      <>
        <Text style={styles.emptyText}>
          {activeTab === "received"
            ? "No friend requests received"
            : "You haven't sent any friend requests"}
        </Text>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tab} />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "received" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("received")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "received" && styles.activeTabText,
            ]}
          >
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "sent" && styles.activeTab]}
          onPress={() => setActiveTab("sent")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "sent" && styles.activeTabText,
            ]}
          >
            Sent
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {loading ? (
          <Loader height={40} color="#42224A" />
        ) : (
          <FlatList
            data={activeTab === "received" ? receivedRequests : sentRequests}
            renderItem={
              activeTab === "received" ? ReceivedRequests : SentRequests
            }
            keyExtractor={(item) => item.id}
            ListEmptyComponent={EmptyList}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    position: "relative",
    padding: 20,
    paddingVertical: 50,
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
  contentContainer: {
    width: "100%",
    paddingVertical: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    flexGrow: 1,
  },
  emptyText: {
    fontFamily: "Poppins_300Light",
    color: "rgba(0, 0, 0, 0.5)",
  },
  tab: {
    position: "absolute",
    top: 10,
    height: 5,
    width: 55,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 15,
  },
  requestContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});

export default Requests;
