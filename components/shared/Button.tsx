import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";

export default function Button({
    text,
    onPress,
}: {
    text: string;
    onPress: () => void;
}) {
    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
    });

    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
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
        width: "80%",
    },
    text: {
        color: "white",
        fontFamily: "Poppins_700Bold",
        fontWeight: "bold",
        fontSize: 16,
    },
});
