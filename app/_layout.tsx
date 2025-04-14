import { AuthProvider } from "@/components/contexts/AuthContext";
import { ExpenseProvider } from "@/components/contexts/ExpenseContext";
import { GroupProvider } from "@/components/contexts/GroupContext";
import { PopupProvider } from "@/components/contexts/PopupContext";
import { ToastProvider } from "@/components/contexts/ToastContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ToastProvider>
      <PopupProvider>
        <AuthProvider>
          <GroupProvider>
            <ExpenseProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen
                  name="creategroup"
                  options={{ title: "Create Group" }}
                />
                <Stack.Screen name="index" options={{ title: "Home" }} />
                <Stack.Screen name="expense" options={{ title: "Expense" }} />
                <Stack.Screen name="group" options={{ title: "Group" }} />
                <Stack.Screen name="(auth)" options={{ title: "Auth" }} />
                <Stack.Screen name="(tabs)" options={{ title: "Tabs" }} />
              </Stack>
            </ExpenseProvider>
          </GroupProvider>
        </AuthProvider>
      </PopupProvider>
    </ToastProvider>
  );
}
