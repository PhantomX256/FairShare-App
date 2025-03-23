import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

interface LoaderProps {
  height?: number | string;
  color?: string;
}

/**
 * Loader component that displays an animated loading indicator.
 *
 * @param {LoaderProps} props - The properties for the Loader component.
 * @param {number} [props.height=45] - The height of the loader container.
 * @param {string} [props.color="#000"] - The color of the loader bars.
 *
 * @returns {JSX.Element} The rendered Loader component.
 *
 * @example
 * <Loader height={50} color="#ff0000" />
 *
 * This component uses the `Animated` API from React Native to create a looping
 * animation for three bars. Each bar's height is animated in a sequence to create
 * a loading effect.
 */
const Loader: React.FC<LoaderProps> = ({ height = 45, color = "#000" }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Loop the animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 333,
          useNativeDriver: false,
        }),
        Animated.timing(animation, {
          toValue: 2,
          duration: 333,
          useNativeDriver: false,
        }),
        Animated.timing(animation, {
          toValue: 3,
          duration: 333,
          useNativeDriver: false,
        }),
        Animated.timing(animation, {
          toValue: 4,
          duration: 333,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [animation]);

  const height1 = animation.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: ["100%", "10%", "100%", "100%", "100%"],
  });

  const height2 = animation.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: ["100%", "100%", "10%", "100%", "100%"],
  });

  const height3 = animation.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: ["100%", "100%", "100%", "10%", "100%"],
  });

  return (
    <View style={[styles.loader, { height }]}>
      <Animated.View
        style={[styles.bar, { height: height1, backgroundColor: color }]}
      />
      <Animated.View
        style={[styles.bar, { height: height2, backgroundColor: color }]}
      />
      <Animated.View
        style={[styles.bar, { height: height3, backgroundColor: color }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    width: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bar: {
    width: "20%",
  },
});

export default Loader;
