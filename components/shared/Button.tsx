import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";
import Loader from "./Loader";

export default function Button({
  text,
  onPress,
  style,
  isLoading,
}: {
  text: string;
  onPress: () => void;
  style?: any;
  isLoading?: boolean;
}) {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      disabled={isLoading}
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
  text: {
    color: "white",
    fontFamily: "Poppins_700Bold",
    fontWeight: "bold",
    fontSize: 16,
  },
});
