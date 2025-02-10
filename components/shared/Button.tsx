import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";

export default function Button({
    text,
    onPress,
    style,
}: {
    text: string;
    onPress: () => void;
    style?: any;
}) {
    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={styles.text}>{text}</Text>
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
