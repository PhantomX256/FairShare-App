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

  return <View style={styles.popupContainer}>{children}</View>;
};

const styles = StyleSheet.create({
  popupContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
});

export default Popup;
