import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardTypeOptions,
} from "react-native";
import React from "react";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_300Light,
} from "@expo-google-fonts/poppins";
import { colors } from "@/styles/global";
import AntDesign from "@expo/vector-icons/AntDesign";

interface FormFieldProps {
  label?: string;
  value: string;
  handleChange: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  handleChange,
  placeholder,
  keyboardType,
  autoCapitalize = "sentences",
  autoCorrect = true,
}) => {
  const [showPass, setShowPass] = React.useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ width: "100%" }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContianer}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          onChangeText={handleChange}
          secureTextEntry={
            (label === "Password" || label === "Confirm Password") && !showPass
          }
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />
        {(label === "Password" || label === "Confirm Password") && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <AntDesign
              name={showPass ? "eye" : "eyeo"}
              size={20}
              color={colors.jaguar}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  inputContianer: {
    backgroundColor: colors.offwhite,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 15,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: colors.jaguar,
    fontFamily: "Poppins_300Light",
  },
});

export default FormField;
