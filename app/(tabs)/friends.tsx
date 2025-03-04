import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import {
  Text,
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/shared/FormField";
import FriendList from "@/components/ui/FriendList";
import { useFriends } from "@/lib/hooks/friendHooks";
import { useEffect, useMemo, useState } from "react";
import AddFriend from "@/components/ui/AddFriend";
import { ToastProvider } from "@/components/contexts/ToastContext";
import Requests from "../../components/ui/Requests";

/**
 * Friends component - Manages the friends list screen
 */
const friends = () => {
  // Hook to fetch friends data and loading state
  const { loading, friends, loadFriends, handleRemoveFriend } = useFriends();
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(<AddFriend />);

  // Load custom fonts for the component
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_300Light,
    Poppins_600SemiBold,
  });

  // Filter friends based on search query
  const filteredFriends = useMemo(() => {
    // If search query is empty, return all friends
    if (!searchQuery.trim()) {
      return friends;
    }

    // Normalize search query and filter friends
    const normalizedQuery = searchQuery.toLowerCase().trim();

    // Filter friends based on normalized query
    return friends.filter((friend) => {
      const matchesName = friend.fullName
        ?.toLowerCase()
        .includes(normalizedQuery);

      return matchesName;
    });
  }, [friends, searchQuery]);

  // Load friends data when component mounts or when modal state changes
  useEffect(() => {
    // Always load friends on first render
    loadFriends();

    // If modal was just closed (previous state was visible) and it was showing Requests
    if (!isModalVisible && modalContent.type === Requests) {
      // Reload friends to reflect any changes made in the Requests modal
      loadFriends();
    }
  }, [isModalVisible, modalContent.type]);

  // Return null until fonts are loaded
  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contiainer}>
        {/* Header with requests and add friend buttons */}
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Text
            style={{ fontFamily: "Poppins_300Light" }}
            onPress={() => {
              setModalContent(<Requests />);
              setIsModalVisible(true);
            }}
          >
            Requests
          </Text>
          <Text
            style={{ fontFamily: "Poppins_300Light" }}
            onPress={() => {
              setModalContent(<AddFriend />);
              setIsModalVisible(true);
            }}
          >
            Add Friend +
          </Text>
        </View>
        {/* Search input field */}
        <FormField
          handleChange={(e) => setSearchQuery(e)}
          value={searchQuery}
          placeholder="🔍 Search a friend"
        />
        {/* List of friends with loading state */}
        <FriendList
          isLoading={loading}
          friends={filteredFriends}
          handleRemoveFriend={handleRemoveFriend}
        />
        <Modal
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <ToastProvider>{modalContent}</ToastProvider>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  contiainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  header: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    marginBottom: 30,
  },
  text: {
    fontFamily: "Poppins_400Regular",
  },
});

export default friends;
