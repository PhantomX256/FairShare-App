import { useGroupService } from "@/lib/hooks/groupHooks";
import {
  Poppins_300Light,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GroupList from "@/components/ui/GroupList";
import { router } from "expo-router";
import { Group } from "@/lib/firebase/groupService";

const home = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_300Light,
  });
  const { loadGroups, isLoading, groups } = useGroupService();

  useEffect(() => {
    const fetchGroups = async () => {
      await loadGroups();
    };

    fetchGroups();
  }, []);

  const handleGroupPress = (group: Group) => {
    // Handle group selection - navigate to group details or perform any action
    console.log("Group selected:", group.id);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.expenseContainer}>
        <Text style={styles.text}>Feature coming soon!</Text>
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
  },
  groupHeaderContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
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
    marginTop: 5,
  },
});

export default home;
