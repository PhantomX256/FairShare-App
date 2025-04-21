import {
  Poppins_300Light,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GroupList from "@/components/ui/GroupList";
import { router } from "expo-router";
import { useGroupContext } from "@/components/contexts/GroupContext";
import { Group } from "@/lib/types";

const home = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_300Light,
  });
  const {
    groups,
    isLoading,
    setCurrentGroup,
    fetchGroups,
    allBalances,
    loadAllBalances,
    isBalancesLoading,
  } = useGroupContext();

  const handleGroupPress = (group: Group) => {
    setCurrentGroup(group);
    router.push("/group");
  };

  useEffect(() => {
    fetchGroups();
    loadAllBalances();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.expenseContainer}>
        {isBalancesLoading ? (
          <Text style={styles.text}>Loading balances...</Text>
        ) : (
          <View style={styles.balanceRow}>
            <View style={styles.balanceColumn}>
              <Text style={styles.balanceLabel}>You are owed</Text>
              <Text style={[styles.balanceAmount, styles.owedAmount]}>
                ${allBalances?.owed.toFixed(2) || "0.00"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.balanceColumn}>
              <Text style={styles.balanceLabel}>You owe</Text>
              <Text style={[styles.balanceAmount, styles.oweAmount]}>
                ${allBalances?.owe.toFixed(2) || "0.00"}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.groupHeaderContainer}>
        <Text style={styles.groupHeaderText}>Your Groups</Text>
        <Text
          onPress={() => router.push("../creategroup")}
          style={styles.createGroupText}
        >
          Create a group +
        </Text>
      </View>

      {/* Groups List Section */}
      <View style={styles.groupsContainer}>
        <GroupList
          groups={groups}
          isLoading={isLoading}
          onGroupPress={handleGroupPress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 30,
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    fontFamily: "Poppins_400Regular",
    color: "white",
    textAlign: "center",
  },
  expenseContainer: {
    backgroundColor: "#42224A",
    width: "100%",
    height: "20%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  balanceColumn: {
    flex: 1,
    alignItems: "center",
  },
  balanceLabel: {
    fontFamily: "Poppins_300Light",
    fontSize: 16,
    color: "white",
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    fontFamily: "Poppins_400Regular",
    fontSize: 28,
    textAlign: "center",
  },
  owedAmount: {
    color: "#65DC98", // Green color for money coming in
  },
  oweAmount: {
    color: "#FF9A8B", // Light red/pink for money going out
  },
  divider: {
    height: "70%",
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 10,
  },
  groupHeaderContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },
  groupHeaderText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    color: "#42224A",
  },
  createGroupText: {
    color: "#42224A",
    fontFamily: "Poppins_300Light",
    fontSize: 15,
  },
  groupsContainer: {
    flex: 1,
    width: "100%",
  },
});

export default home;
