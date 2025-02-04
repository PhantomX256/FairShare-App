import { Dimensions, FlatList, Image, Text, View } from "react-native";
import { welcomeScreenSlides } from "../lib/constants";

const { width, height } = Dimensions.get("window");

interface SlideItem {
    image: any;
    title: string;
    subtitle: string;
}

function Slide({ item }: { item: SlideItem }) {
    return (
        <View style={{ backgroundColor: "black" }}>
            <Image source={item.image} style={{ height: "100%", width }} />
            <Text>{item.title}</Text>
            <Text>{item.subtitle}</Text>
        </View>
    );
}

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <FlatList
                data={welcomeScreenSlides}
                contentContainerStyle={{
                    maxHeight: height * 0.75,
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <Slide item={item} />}
            />
        </View>
    );
}
