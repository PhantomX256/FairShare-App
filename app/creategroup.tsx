import {
  Text,
  SafeAreaView,
  StyleSheet,
  Modal,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { useFonts } from "expo-font";
import { Poppins_500Medium } from "@expo-google-fonts/poppins";
import FormField from "@/components/shared/FormField";
import MemberList from "@/components/ui/MemberList";
import AddMember from "@/components/ui/AddMember";
import { ToastProvider, useToast } from "@/components/contexts/ToastContext";
import Button from "@/components/shared/Button";
import { useGroupService } from "@/lib/hooks/groupHooks";

// Define User interface to type the users array
interface User {
  id: string;
  fullName: string;
}

// Define Guest interface to type the guests array
interface Guest {
  id: string;
  fullName: string;
}

// Main component for creating a group
const CreateGroup = () => {
  // Load custom font using Expo's useFonts hook
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
  });

  // Initialize state for group data (name, users, and guests)
  const [groupData, setGroupData] = useState({
    groupName: "",
    users: [] as User[],
    guests: [] as Guest[],
  });
  // State to control visibility of add member modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Get toast notification function from context
  const { showToast } = useToast();
  // Get group creation function and loading state from custom hook
  const { handleCreateGroup, isLoading } = useGroupService();

  // Function to handle group creation
  const createGroup = async () => {
    // Call API function to create group
    await handleCreateGroup(groupData);
  };

  // Function to add a friend to the group
  const handleAddFriend = (id: string, name: string) => {
    // Check if user already exists in the group
    const userExists = groupData.users.some((user) => user.id === id);
    if (userExists) throw Error("Friend already added to group.");

    // Add new user to the group
    setGroupData({
      ...groupData,
      users: [...groupData.users, { id, fullName: name }],
    });
  };

  // Function to add a guest to the group
  const handleAddGuest = (name: string) => {
    // Generate a unique ID (using timestamp for simplicity)
    const newId = Date.now().toString();

    // Add new guest to the group
    setGroupData({
      ...groupData,
      guests: [...groupData.guests, { id: newId, fullName: name }],
    });
  };

  // Function to remove a friend from the group
  const handleRemoveFriend = (id: string) => {
    // Filter out the user with the matching ID
    setGroupData({
      ...groupData,
      users: groupData.users.filter((user) => user.id !== id),
    });
    // Show success message
    showToast("Member removed successfully", "success");
  };

  // Function to remove a guest from the group
  const handleRemoveGuest = (id: string) => {
    // Filter out the guest with the matching ID
    setGroupData({
      ...groupData,
      guests: groupData.guests.filter((guest) => guest.id !== id),
    });
    // Show success message
    showToast("Member removed successfully", "success");
  };

  // Return null if fonts haven't loaded yet
  if (!fontsLoaded) return null;

  return (
    // Wrap content in TouchableWithoutFeedback to dismiss keyboard when tapping outside inputs
    <TouchableWithoutFeedback
      style={{ height: "100%", width: "100%" }}
      onPress={() => Keyboard.dismiss}
    >
      <View style={styles.container}>
        <View>
          {/* Heading for the screen */}
          <Text style={styles.heading}>Create Group</Text>
          {/* Input field for group name */}
          <FormField
            label="Group Name"
            value={groupData.groupName}
            handleChange={(e) => setGroupData({ ...groupData, groupName: e })}
            placeholder="Enter a name for your group"
          />
          {/* Members section header with add member button */}
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              flexDirection: "row",
              marginTop: 30,
            }}
          >
            <Text
              style={[
                styles.text,
                { fontFamily: "Poppins_500Medium", fontSize: 16 },
              ]}
            >
              Members
            </Text>
            {/* Text button to open add member modal */}
            <Text style={styles.text} onPress={() => setIsModalVisible(true)}>
              Add a Member +
            </Text>
          </View>
          {/* List of members (both users and guests) */}
          <MemberList
            onRemoveGuest={handleRemoveGuest}
            onRemoveUser={handleRemoveFriend}
            users={groupData.users}
            guests={groupData.guests}
          />
        </View>
        {/* Create button at the bottom of the screen */}
        <Button
          text="Create"
          isLoading={isLoading}
          disabled={isLoading}
          onPress={createGroup}
        />
        {/* Modal for adding members */}
        <Modal
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          {/* Wrap modal content in ToastProvider for notifications */}
          <ToastProvider>
            <AddMember
              onAddFriend={handleAddFriend}
              onAddGuest={handleAddGuest}
            />
          </ToastProvider>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    flex: 1,
    justifyContent: "space-between",
  },
  heading: {
    fontFamily: "Poppins_500Medium",
    fontSize: 25,
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontFamily: "Poppins_300Light",
    fontSize: 15,
  },
});

export default CreateGroup;
