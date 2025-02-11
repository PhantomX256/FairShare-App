import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

interface LoaderProps {
    height?: number;
    color?: string;
}

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
                style={[
                    styles.bar,
                    { height: height1, backgroundColor: color },
                ]}
            />
            <Animated.View
                style={[
                    styles.bar,
                    { height: height2, backgroundColor: color },
                ]}
            />
            <Animated.View
                style={[
                    styles.bar,
                    { height: height3, backgroundColor: color },
                ]}
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
