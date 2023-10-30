import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import CustomBottomTabBar from '../Components/CustomBottomTabBar';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import AccountStack from './AccountStack';
import CalendarStack from './CalendarStack';
import ServiceTaskStack from './ServiceTaskStack';
import TaskStack from './TaskStack';
import navigationStrings from './navigationStrings';

const Tab = createBottomTabNavigator();

export default function BottomStack() {

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
        }}
            tabBar={(props) => <CustomBottomTabBar  {...props} />}
        >
            <Tab.Screen component={TaskStack}
                name={navigationStrings.TASKSTACK} options={({ route }) => ({
                    tabBarLabel: strings.SERVICE_STATUS,
                    tabBarIcon: ({ focused, tintColor }) => (
                        <Image
                            resizeMode="contain"
                            style={{
                                tintColor: focused ? colors.themeColor : colors.black
                            }}
                            source={
                                focused ? imagePath.icHomeActive : imagePath.icHomeInActive
                            }
                        />
                    ),
                })} />
            <Tab.Screen name={navigationStrings.SERVICE_TASK_STACK} component={ServiceTaskStack} options={({ route }) => ({
                tabBarLabel: strings.TRANSACTIONS,
                tabBarIcon: ({ focused, tintColor }) => (
                    <Image
                        resizeMode="contain"
                        style={{
                            tintColor: focused ? colors.themeColor : colors.black
                        }}
                        source={
                            focused ? imagePath.icServiceStatus : imagePath.icServiceInActive

                        }
                    />
                ),
            })} />
            <Tab.Screen name={navigationStrings.CALENDAR_STACK} component={CalendarStack} options={({ route }) => ({
                unmountOnBlur: true,
                tabBarLabel: strings.CALENDAR,
                tabBarIcon: ({ focused, tintColor }) => (
                    <Image
                        resizeMode="contain"
                        style={{
                            tintColor: focused ? colors.themeColor : colors.black
                        }}
                        source={focused ? imagePath.icCalendarTab : imagePath.icCalendarInActive}
                    />
                ),
            })} />
            <Tab.Screen name={navigationStrings.ACCOUNT_STACK} component={AccountStack} options={({ route }) => ({
                tabBarLabel: strings.ACCOUNT,
                tabBarIcon: ({ focused, tintColor }) => (
                    <Image
                        resizeMode="contain"
                        style={{
                            tintColor: focused ? colors.themeColor : colors.black
                        }}
                        source={
                            focused
                                ? imagePath.icProfileActive
                                : imagePath.icProfileInactive
                        }
                    />
                ),
            })} />

        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({})