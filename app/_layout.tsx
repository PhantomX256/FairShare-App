import { AuthProvider } from "@/components/contexts/AuthContext";
import { ToastProvider } from "@/components/contexts/ToastContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="(auth)" options={{ title: "Auth" }} />
          <Stack.Screen name="(tabs)" options={{ title: "Tabs" }} />
        </Stack>
      </AuthProvider>
    </ToastProvider>
  );
}
