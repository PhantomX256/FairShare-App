import { ToastProvider } from "@/components/contexts/ToastContext";
import AuthManager from "@/components/ui/AuthManager";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ToastProvider>
      <AuthManager />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="(auth)" options={{ title: "Auth" }} />
        <Stack.Screen name="(tabs)" options={{ title: "Tabs" }} />
      </Stack>
    </ToastProvider>
  );
}
