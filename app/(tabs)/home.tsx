import Button from "@/components/shared/Button";
import { useLogout } from "@/lib/hooks/authHooks";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const home = () => {
  const { loading, handleLogout } = useLogout();

  return (
    <SafeAreaView style={styles.container}>
      <Text>Home</Text>
      <Button text="Logout" isLoading={loading} onPress={handleLogout} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default home;
