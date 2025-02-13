import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { useFonts } from "expo-font";
import { Link } from "expo-router";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import FormField from "../../components/shared/FormField";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/shared/Button";
import { useToast } from "@/components/contexts/ToastContext";

const register = () => {
  const { showToast } = useToast();

  // Load the Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  // Create a form state containing fullName, email, password, and confirmPassword
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // If the fonts are not loaded, return null
  if (!fontsLoaded) {
    return null;
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
        <View style={{ marginBottom: 20 }}>
          <FormField
            label="Full Name"
            value={form.fullName}
            handleChange={(e) => setForm({ ...form, fullName: e })}
            placeholder="Enter your Full Name"
          />
          <FormField
            label="Email"
            value={form.email}
            handleChange={(e) => setForm({ ...form, email: e })}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          <FormField
            label="Password"
            value={form.password}
            handleChange={(e) => setForm({ ...form, password: e })}
            placeholder="Enter your password"
          />
          <FormField
            label="Confirm Password"
            value={form.confirmPassword}
            handleChange={(e) => setForm({ ...form, confirmPassword: e })}
            placeholder="Re-enter your password"
          />
        </View>
        <Button
          text="Register"
          onPress={() => {
            // Alert.alert(
            //     "Register",
            //     `Name: ${form.fullName}, Email: ${form.email}, Password: ${form.password}, Confirm Password: ${form.confirmPassword}`
            // );
            showToast("Button Clicked", "info");
          }}
        />
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Poppins_400Regular",
            marginTop: 10,
          }}
        >
          Already have an account?{" "}
          <Link
            style={{
              color: "#42224A",
              fontFamily: "Poppins_500Medium",
            }}
            href="/login"
          >
            Login
          </Link>
        </Text>
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
