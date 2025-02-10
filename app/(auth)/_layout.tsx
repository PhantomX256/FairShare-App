import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="register" options={{ title: "Register" }} />
            <Stack.Screen name="login" options={{ title: "Login" }} />
            <StatusBar />
        </Stack>
    );
}
