import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { moderateScale, moderateScaleVertical, width } from '../styles/responsiveSize'
import colors from '../styles/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';

export default function CustomBottomTabBar({
    state,
    descriptors,
    navigation,
    bottomTabNotify,
    ...props
}) {
    const insets = useSafeAreaInsets();
    return (
        <Shadow
            style={{
                height: Platform.OS === 'ios' ? 60 + insets.bottom : 70 + insets.bottom,
                flexDirection: 'row',
                width: width,
                justifyContent: "space-around",
                borderTopLeftRadius: moderateScale(15),
                borderTopRightRadius: moderateScale(15),
                alignItems: "center",
            }}>

            {state?.routes?.map((route, index) => {
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };
                const { options } = descriptors[route.key];
                const isFocused = state?.index === index;
                const label =
                    options.tabBarLabel !== undefined
                        ? options?.tabBarLabel
                        : options?.title !== undefined
                            ? options?.title
                            : route?.name;

                return <TouchableOpacity onPress={onPress} key={route.name} style={{
                    alignItems: "center"
                }}>
                    {options.tabBarIcon({ focused: isFocused })}
                    <Text
                        style={{
                            ...props.labelStyle,
                            color: isFocused
                                ? colors.themeColor
                                : colors.black,
                            opacity: isFocused ? 1 : 0.6,
                        }}>
                        {label}
                    </Text>
                </TouchableOpacity>

            })}
            {/* </View> */}
        </Shadow>
    )
}

const styles = StyleSheet.create({})