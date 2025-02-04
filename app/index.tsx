import {
    Dimensions,
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { welcomeScreenSlides } from "../lib/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import Button from "@/components/shared/Button";
import { useFonts } from "expo-font";
import {
    Poppins_400Regular,
    Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { useNavigation } from "expo-router";

// Get the width and height of the screen
const { width, height } = Dimensions.get("window");

// Define the SlideItem interface
interface SlideItem {
    image: any;
    title: string;
    subtitle: string;
}

// Slide component that displays the image, title, and subtitle
function Slide({ item }: { item: SlideItem }) {
    return (
        <View
            style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width,
            }}
        >
            <Text style={styles.heading}>{item.title}</Text>
            <Image
                source={item.image}
                resizeMode="contain"
                style={{ height: "60%", width }}
            />
            <Text style={styles.subheading}>{item.subtitle}</Text>
        </View>
    );
}

export default function Index() {
    // Get the navigation object
    const navigation = useNavigation();

    // currentSlideIndex state to keep track of the current slide
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    // ref to the FlatList component
    const ref = React.useRef<FlatList<any>>(null);

    // Load the Poppins_400Regular and Poppins_600SemiBold fonts
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold,
    });

    // Function that updates the indicator based on the current slide
    const updateCurrentSlideIndex = (
        e: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        // Get the content offset x
        const contentOffsetX = e.nativeEvent.contentOffset.x;

        // Calculate the current index based on the content offset x
        const currentIndex = Math.floor(contentOffsetX / width);

        // Update the current slide index
        setCurrentSlideIndex(currentIndex);
    };

    // Function to go to the next slide on button press
    const goNextSlide = () => {
        // Get the next slide index
        const nextSlideIndex = currentSlideIndex + 1;

        // If the next slide index is not the last slide, scroll to the next slide
        if (nextSlideIndex != welcomeScreenSlides.length) {
            // Calculate the next slide offset
            const nextSlideOffset = nextSlideIndex * width;

            // Scroll to the next slide
            ref?.current?.scrollToOffset({ offset: nextSlideOffset });

            // Update the current slide index
            setCurrentSlideIndex(nextSlideIndex);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Display the StatusBar */}
            <StatusBar />

            {/* Display the FlatList component */}
            <FlatList
                ref={ref}
                onMomentumScrollEnd={updateCurrentSlideIndex}
                pagingEnabled
                data={welcomeScreenSlides}
                contentContainerStyle={{
                    maxHeight: height * 0.75,
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <Slide item={item} />}
            />

            {/* Display the indicator */}
            <View style={styles.indicatorContainer}>
                {welcomeScreenSlides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            // If the current slide index is equal to the index, change the background color and width
                            currentSlideIndex === index && {
                                backgroundColor: "#42224A",
                                width: 20,
                            },
                        ]}
                    />
                ))}
            </View>

            {/* If the current slide is the last slide then display Get Started else display Next */}
            {currentSlideIndex === welcomeScreenSlides.length - 1 ? (
                <Button
                    text="Get Started"
                    onPress={() => {
                        navigation.navigate("register" as never);
                    }}
                />
            ) : (
                <Button text="Next" onPress={goNextSlide} />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontFamily: "Poppins_600SemiBold",
        color: "#8F659A",
        textAlign: "center",
        fontSize: 20,
        width: "100%",
    },
    subheading: {
        color: "#120216",
        fontFamily: "Poppins_400Regular",
        maxWidth: "75%",
        fontSize: 15,
        textAlign: "center",
    },
    indicatorContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 3,
    },
    indicator: {
        height: 2.5,
        width: 15,
        backgroundColor: "#F7F4F7",
        marginBottom: 30,
        borderRadius: 2,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
});
