// screens/login.tsx
import { useFonts } from "expo-font";
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import LoginForm from "@/components/ui/LoginForm";
import { useLogin } from "@/lib/hooks/authHooks";

const Login = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const { loading, handleLogin } = useLogin();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollview}>
          <Text style={styles.heading}>Login</Text>
          <LoginForm onSubmit={handleLogin} isLoading={loading} />
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

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
