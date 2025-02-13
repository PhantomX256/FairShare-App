import React, { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// Define the type for the toast
type ToastType = "success" | "error" | "info";

// Define the props for the Toast component
type ToastProps = {
  toast: {
    visible: boolean;
    message: string;
    type: ToastType;
  };
};

/**
 * Toast component that displays a message with an icon, sliding in and out based on visibility.
 *
 * @param {ToastProps} toast - The toast object containing visibility, type, and message.
 *
 * @returns {JSX.Element} The animated toast component.
 *
 */
const Toast: React.FC<ToastProps> = ({ toast }) => {
  // Create a shared value for translateY and start off-screen (above)
  const translateY = useSharedValue(-100);

  // Create an animated style for the translateY value
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Run the animation when the toast visibility changes
  useEffect(() => {
    // If the toast is visible, slide down, otherwise slide back up
    if (toast.visible) {
      // Slide down
      translateY.value = withTiming(50, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
    } else {
      // Slide back up
      translateY.value = withTiming(-100, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [toast.visible]);

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        toast.type === "success"
          ? styles.successToast
          : toast.type === "error"
          ? styles.errorToast
          : styles.infoToast,
        animatedStyle,
      ]}
    >
      <FontAwesome
        name={
          toast.type === "success"
            ? "check-circle"
            : toast.type === "error"
            ? "warning"
            : "info-circle"
        }
        size={34}
        color={
          toast.type === "success"
            ? "#4aa22c"
            : toast.type === "error"
            ? "#df2900"
            : "#2045f6"
        }
      />
      <Text
        style={[
          styles.message,
          toast.type === "success"
            ? styles.successMessage
            : toast.type === "error"
            ? styles.errorMessage
            : styles.infoMessage,
        ]}
      >
        {toast.message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 10,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 9999, // Ensure it's on top
  },
  successToast: {
    backgroundColor: "#edf6ea",
    borderColor: "#4aa22c",
    shadowColor: "#4aa22c",
  },
  errorToast: {
    backgroundColor: "#fde9e7",
    borderColor: "#df2900",
    shadowColor: "#df2900",
  },
  infoToast: {
    backgroundColor: "#f4f7ff",
    borderColor: "#2045f6",
    shadowColor: "#2045f6",
  },
  message: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "Poppins_500Medium",
  },
  successMessage: {
    color: "#4aa22c",
  },
  errorMessage: {
    color: "#df2900",
  },
  infoMessage: {
    color: "#2045f6",
  },
});

export default Toast;
