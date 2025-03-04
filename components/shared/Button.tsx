import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";
import Loader from "./Loader";

/**
 * Button component that displays a text button with optional loading state.
 *
 */
export default function Button({
  text,
  onPress,
  style,
  isLoading,
  disabled,
}: {
  text: string;
  onPress: () => void;
  style?: any;
  isLoading?: boolean;
  disabled?: boolean;
}) {
  // Load the required fonts
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  // If the fonts are not loaded, return null
  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style, (disabled || isLoading) && styles.disabled]}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <Loader height={30} color="white" />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#8F659A",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    borderRadius: 15,
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "white",
    fontFamily: "Poppins_700Bold",
    fontWeight: "bold",
    fontSize: 16,
  },
});
