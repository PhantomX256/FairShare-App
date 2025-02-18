// components/LoginForm.tsx
import React, { useState } from "react";
import { View } from "react-native";
import FormField from "@/components/shared/FormField";
import Button from "@/components/shared/Button";
import { Text } from "react-native";
import { Link } from "expo-router";

interface RegisterFormProps {
  onSubmit: (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => void;
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  // Create a form state containing fullName, email, password, and confirmPassword
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = () => {
    onSubmit(form.fullName, form.email, form.password, form.confirmPassword);
  };

  return (
    <View>
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
      <Button text="Register" onPress={handleSubmit} isLoading={isLoading} />
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
    </View>
  );
};

export default RegisterForm;
