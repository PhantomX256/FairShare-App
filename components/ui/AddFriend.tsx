import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Platform,
  Animated,
  Dimensions,
  TouchableOpacity,
  Clipboard,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import FormField from "../shared/FormField";
import Button from "../shared/Button";
import { useFriends } from "@/lib/hooks/friendHooks";
import { auth } from "@/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * AddFriend component for sending friend requests to other users
 * Handles form input, keyboard interactions, and API requests
 */
const AddFriend = () => {
  const [userId, setUserId] = useState(""); // State to store the user ID input
  const { handleSendFriendRequest, loading } = useFriends(); // Hook for friend-related functionality
  const id = auth.currentUser?.uid;
  const [copied, setCopied] = useState(false);

  // Animation values
  const contentPosition = useRef(new Animated.Value(0)).current;
  const copyScale = useRef(new Animated.Value(1)).current;
  const copyOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set up keyboard listeners to adjust the form position when keyboard appears/disappears
    const keyboardWillShowSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        const keyboardHeight = event.endCoordinates.height;
        // Animate the form upward when keyboard appears to keep it visible
        Animated.timing(contentPosition, {
          toValue: -keyboardHeight / 2,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    );

    // Reset form position when keyboard hides
    const keyboardWillHideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        Animated.timing(contentPosition, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    );

    // Clean up keyboard listeners when component unmounts
    return () => {
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, []);

  /**
   * Handle the submission of a friend request
   * Validates input, sends request, and resets form on success
   */
  const handleAddFriend = async () => {
    if (userId.trim()) {
      const result = await handleSendFriendRequest(userId.trim());
      if (result) {
        setUserId(""); // Clear input field on success
        Keyboard.dismiss(); // Hide keyboard after submission
      }
    }
  };

  /**
   * Copy the ID to clipboard and show animation
   */
  const copyToClipboard = () => {
    Clipboard.setString(id);
    setCopied(true);

    // Animate the copy icon
    Animated.sequence([
      // First scale up the ID container
      Animated.timing(copyScale, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      // Then scale back down
      Animated.timing(copyScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Show and fade out the "Copied!" text
    Animated.sequence([
      // Fade in
      Animated.timing(copyOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      // Wait a bit
      Animated.delay(1000),
      // Fade out
      Animated.timing(copyOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset copied state after animation completes
      setTimeout(() => setCopied(false), 500);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.tab} />
        <Animated.View
          style={[
            styles.animatedContainer,
            { transform: [{ translateY: contentPosition }] }, // Apply dynamic position adjustment
          ]}
        >
          <Text style={styles.heading}>Add a Friend</Text>
          <FormField
            placeholder="# Enter ID"
            label="Ask your friend for their ID"
            value={userId}
            handleChange={(e) => setUserId(e)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.idSection}>
            <Text style={styles.idLabel}>Your ID (tap to copy)</Text>
            <TouchableOpacity
              onPress={copyToClipboard}
              style={styles.idTouchable}
              activeOpacity={0.6}
            >
              <Animated.View
                style={[
                  styles.idContainer,
                  { transform: [{ scale: copyScale }] },
                ]}
              >
                <Text style={styles.idText}>{id}</Text>
                <Ionicons
                  name={copied ? "checkmark-circle" : "copy-outline"}
                  size={18}
                  color={copied ? "#4CAF50" : "#666"}
                />
              </Animated.View>
            </TouchableOpacity>

            <Animated.View
              style={[styles.copiedContainer, { opacity: copyOpacity }]}
            >
              <Text style={styles.copiedText}>Copied to clipboard!</Text>
            </Animated.View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              text="Send Request"
              onPress={handleAddFriend}
              isLoading={loading}
              disabled={userId.trim() === ""}
            />
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    position: "relative",
  },
  animatedContainer: {
    width: "100%",
    padding: 30,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    maxWidth: SCREEN_HEIGHT > 700 ? 400 : "90%",
  },
  heading: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    marginBottom: 30,
  },
  idSection: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  idLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  idTouchable: {
    width: "100%",
  },
  idContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
  idText: {
    fontFamily: "Poppins_400Regular",
    flex: 1,
  },
  copiedContainer: {
    marginTop: 8,
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  copiedText: {
    fontFamily: "Poppins_400Regular",
    color: "#4CAF50",
    fontSize: 12,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 30,
    alignItems: "center",
  },
  cancelText: {
    marginTop: 16,
    fontFamily: "Poppins_400Regular",
    color: "#666",
  },
  tab: {
    position: "absolute",
    top: 10,
    height: 5,
    width: 55,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 15,
  },
});

export default AddFriend;
