import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import FormField from "../shared/FormField";
import Button from "../shared/Button";
import { useToast } from "../contexts/ToastContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface GuestFormProps {
  onAddGuest: (fullName: string) => void;
}

const GuestForm = ({ onAddGuest }: GuestFormProps) => {
  const [guestName, setGuestName] = useState("");
  const { showToast } = useToast();

  // Animation values for keyboard handling
  const contentPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set up keyboard listeners to adjust the form position when keyboard appears/disappears
    const keyboardWillShowSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        const keyboardHeight = event.endCoordinates.height;
        // Animate the form upward when keyboard appears to keep it visible
        Animated.timing(contentPosition, {
          toValue: -keyboardHeight / 3,
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

  const handleSubmitGuest = () => {
    if (!guestName.trim()) {
      showToast("Please enter a guest name", "error");
      return;
    }

    try {
      onAddGuest(guestName.trim());
      showToast("Guest added successfully", "success");
      setGuestName(""); // Reset input after adding
      Keyboard.dismiss(); // Hide keyboard
    } catch (error: any) {
      showToast(error.message || "Failed to add guest", "error");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: contentPosition }] },
        ]}
      >
        <Text style={styles.heading}>Add a Guest</Text>
        <Text style={styles.subheading}>
          Enter the name of someone who doesn't have an account
        </Text>

        <FormField
          label="Guest Name"
          placeholder="Enter guest's name"
          value={guestName}
          handleChange={setGuestName}
          autoCapitalize="words"
        />

        <View style={styles.buttonContainer}>
          <Button
            text="Add Guest"
            onPress={handleSubmitGuest}
            isLoading={false}
            disabled={!guestName.trim()}
          />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    maxWidth: SCREEN_HEIGHT > 700 ? 400 : "100%",
    alignSelf: "center",
  },
  heading: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    marginBottom: 10,
    color: "#42224A",
    textAlign: "center",
  },
  subheading: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
});

export default GuestForm;
