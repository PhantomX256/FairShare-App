// components/LoginForm.tsx
import React, { useState } from "react";
import { View } from "react-native";
import FormField from "@/components/shared/FormField";
import Button from "@/components/shared/Button";
import { Text } from "react-native";
import { Link } from "expo-router";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = () => {
    onSubmit(form.email, form.password);
  };

  return (
    <View>
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
      <Button text="Login" onPress={handleSubmit} isLoading={isLoading} />
      <Text
        style={{
          textAlign: "center",
          fontFamily: "Poppins_400Regular",
          marginTop: 10,
        }}
      >
        Don't have an account?{" "}
        <Link
          style={{
            color: "#42224A",
            fontFamily: "Poppins_500Medium",
          }}
          href="/register"
        >
          Register
        </Link>
      </Text>
    </View>
  );
};

export default LoginForm;
