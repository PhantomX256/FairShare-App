import { Text, SafeAreaView, StyleSheet, Alert, Image } from "react-native";
import React from "react";
import { useAuth } from "@/components/contexts/AuthContext";
import UserPhoto from "../../assets/images/User M1.png";
import { useFonts } from "expo-font";
import { Poppins_500Medium } from "@expo-google-fonts/poppins";
import Button from "@/components/shared/Button";
import { useLogout } from "@/lib/hooks/authHooks";

const profile = () => {
  const { user } = useAuth();
  const { loading, handleLogout } = useLogout();

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <Image resizeMode="contain" style={styles.photo} source={UserPhoto} />
      <Text style={{ fontFamily: "Poppins_500Medium", marginTop: 10 }}>
        {user.fullName}
      </Text>
      <Text style={{ fontFamily: "Poppins_400Regular", color: "#a2a4a5" }}>
        {user.email}
      </Text>
      <Button
        style={{ width: "85%", marginTop: 100 }}
        isLoading={loading}
        onPress={handleLogout}
        text="Logout"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  heading: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
  },
  photo: {
    width: 100,
    height: 100,
    marginTop: 50,
  },
});

export default profile;
