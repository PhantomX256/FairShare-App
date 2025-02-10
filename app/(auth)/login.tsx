import Button from "@/components/shared/Button";
import FormField from "@/components/shared/FormField";
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const login = () => {
    const [fontsloaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
    });

    if (!fontsloaded) {
        return null;
    }

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollview}>
                <Text style={styles.heading}>Login</Text>
                <View>
                    <FormField
                        label="Email"
                        value={form.email}
                        handleChange={(e) => setForm({ ...form, email: e })}
                        placeholder="Enter your email"
                    />
                    <FormField
                        label="Password"
                        value={form.password}
                        handleChange={(e) => setForm({ ...form, password: e })}
                        placeholder="Enter your password"
                    />
                </View>
                <Button
                    text="Login"
                    onPress={() => {
                        Alert.alert("Login", form.email + " " + form.password);
                    }}
                />
                <Text
                    style={{
                        textAlign: "center",
                        fontFamily: "Poppins_400Regular",
                        marginTop: 10,
                    }}
                >
                    Don't have an account?{" "}
                    <Link
                        style={{
                            color: "#42224A",
                            fontFamily: "Poppins_500Medium",
                        }}
                        href="/register"
                    >
                        Register
                    </Link>
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default login;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    scrollview: {
        width: "100%",
        flex: 1,
        padding: 20,
    },
    heading: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 24,
        marginTop: "30%",
        marginBottom: 30,
        textAlign: "center",
    },
});
