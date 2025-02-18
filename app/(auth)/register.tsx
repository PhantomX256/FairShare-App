import { Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import RegisterForm from "@/components/ui/RegisterForm";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignUp } from "@/lib/hooks/authHooks";
import Loader from "@/components/shared/Loader";

const register = () => {
  const { loading, handleSignUp } = useSignUp();
  // Load the Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  // If the fonts are not loaded, return null
  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Loader height={30} color="#8F659A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{
          width: "100%",
          flex: 1,
          padding: 20,
        }}
      >
        <Text style={styles.heading}>Register</Text>
        <RegisterForm onSubmit={handleSignUp} isLoading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  heading: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    marginTop: "30%",
    marginBottom: 30,
    textAlign: "center",
  },
});
