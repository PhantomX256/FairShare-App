import { View, StyleSheet } from "react-native";
import React, { ReactNode } from "react";

interface PopupProps {
  visible: boolean;
  children: ReactNode;
}

const Popup = ({ visible, children }: PopupProps) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.popupContainer}>
      <View style={styles.popup}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default Popup;
