import { StyleSheet, View } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";

function BottomBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  const icons: { [key: string]: (props: any) => JSX.Element } = {
    home: (props: any) => (
      <FontAwesome name="home" size={30} color={colors.text} {...props} />
    ),
    friends: (props: any) => (
      <FontAwesome name="group" size={26} color={colors.text} {...props} />
    ),
    balances: (props: any) => (
      <FontAwesome
        name="balance-scale"
        size={26}
        color={colors.text}
        {...props}
      />
    ),
    profile: (props: any) => (
      <FontAwesome name="user" size={26} color={colors.text} {...props} />
    ),
  };

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
            key={index}
          >
            {icons[route.name as keyof typeof icons]
              ? icons[route.name as keyof typeof icons]({
                  color: isFocused ? "#42224A" : "#a2a4a5",
                })
              : null}
            <Text
              style={[
                { color: isFocused ? "#42224A" : "#a2a4a5" },
                styles.tabbarText,
              ]}
            >
              {typeof label === "function"
                ? label({
                    focused: isFocused,
                    color: isFocused ? "#42224A" : "#a2a4a5",
                    position: "below-icon",
                    children: "",
                  })
                : label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F7F4F7",
    marginHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabbarItem: {
    flex: 1,
    alignItems: "center",
  },
  tabbarText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
  },
});

export default BottomBar;
