import Button from "@/components/shared/Button";
import { auth } from "@/FirebaseConfig";
import { signOut } from "firebase/auth";
import { View, Text, Alert } from "react-native";

const home = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View>
      <Text>Home</Text>
      <Button text="Logout" onPress={handleLogout} />
    </View>
  );
};

export default home;
