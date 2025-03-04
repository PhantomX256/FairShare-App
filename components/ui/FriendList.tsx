import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Loader from "../shared/Loader";
import Entypo from "@expo/vector-icons/Entypo";

interface Friend {
  fullName: string;
  id: string;
  // Add other properties that a friend might have
}

interface FriendListProps {
  friends: Friend[];
  isLoading: boolean;
  handleRemoveFriend: any;
}

const FriendList = ({
  friends,
  isLoading,
  handleRemoveFriend,
}: FriendListProps) => {
  if (isLoading) {
    return (
      <View
        style={{ flex: 0.3, justifyContent: "center", alignItems: "center" }}
      >
        <Loader height={40} color="#42224A" />
      </View>
    );
  }

  if (friends.length === 0) {
    return (
      <View
        style={{ flex: 0.3, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={[styles.text, { color: "rgba(0, 0, 0, 0.2)" }]}>
          No friends found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ width: "100%" }}>
      {friends.map((friend, index) => (
        <View style={styles.container} key={index}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <View style={styles.photo} />
            <Text style={styles.text}>{friend.fullName}</Text>
          </View>
          <TouchableOpacity onPress={() => handleRemoveFriend(friend.id)}>
            <Entypo name="cross" size={30} color="rgba(255, 0, 0, 0.5)" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  photo: {
    height: 40,
    width: 40,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
});

export default FriendList;
