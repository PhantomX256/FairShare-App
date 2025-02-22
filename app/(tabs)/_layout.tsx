import BottomBar from "@/components/ui/BottomBar";
import { Tabs } from "expo-router/tabs";
import { StatusBar } from "react-native";

export default function AuthLayout() {
  return (
    <>
      <StatusBar />
      <Tabs tabBar={(props) => <BottomBar {...props} />}>
        <Tabs.Screen
          name="home"
          options={{ title: "Home", headerShown: false }}
        />
        <Tabs.Screen
          name="friends"
          options={{ title: "Friends", headerShown: false }}
        />
        <Tabs.Screen
          name="balances"
          options={{ title: "Balances", headerShown: false }}
        />
        <Tabs.Screen
          name="profile"
          options={{ title: "Profile", headerShown: false }}
        />
      </Tabs>
    </>
  );
}
