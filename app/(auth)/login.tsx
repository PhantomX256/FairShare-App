import { useToast } from "@/components/contexts/ToastContext";
import Button from "@/components/shared/Button";
import FormField from "@/components/shared/FormField";
import { signIn } from "@/lib/firebase";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const login = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [fontsloaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const { showToast } = useToast();

  if (!fontsloaded) {
    return null;
  }

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    try {
      setLoading(true);
      const user = await signIn(form.email, form.password);
      if (user) router.replace("/home");
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <Text style={styles.heading}>Login</Text>
        <View>
          <FormField
            label="Email"
            value={form.email}
            handleChange={(e) => setForm({ ...form, email: e })}
            placeholder="Enter your email"
          />
          <FormField
            label="Password"
            value={form.password}
            handleChange={(e) => setForm({ ...form, password: e })}
            placeholder="Enter your password"
          />
        </View>
        <Button text="Login" onPress={submit} isLoading={loading} />
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  scrollview: {
    width: "100%",
    flex: 1,
    padding: 20,
  },
  heading: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    marginTop: "30%",
    marginBottom: 30,
    textAlign: "center",
  },
});
