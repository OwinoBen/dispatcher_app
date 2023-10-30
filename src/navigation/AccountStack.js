import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Account, CalendarView, ContactUs, ProductsPrice, ServiceSlots, Settings, TaskHistory } from '../Screens';
import navigationStrings from './navigationStrings';
import PayoutStack from './PayoutStack';
import ProfileStack from './ProfileStack';
import SubscriptionStack from './SubscriptionStack';
import WalletStack from './WalletStack';

const Stack = createNativeStackNavigator();
export default function () {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen
                name={navigationStrings.ACCOUNT}
                component={Account}
            />
            <Stack.Screen
                name={navigationStrings.PROFILESTACK}
                component={ProfileStack}
            />
            <Stack.Screen
                name={navigationStrings.TASKHISTORY}
                component={TaskHistory}
            />
            <Stack.Screen
                name={navigationStrings.SUBSCRIPTION_STACK}
                component={SubscriptionStack}
            />
            <Stack.Screen
                name={navigationStrings.WALLETSTACK}
                component={WalletStack}
            />
            <Stack.Screen
                name={navigationStrings.PAYOUT_STACK}
                component={PayoutStack}
            />
            <Stack.Screen
                name={navigationStrings.SETTINGS}
                component={Settings}
            />
            <Stack.Screen
                name={navigationStrings.CONTACTUS}
                component={ContactUs}
            />
            <Stack.Screen
                name={navigationStrings.SERVICE_SLOTS}
                component={ServiceSlots}
            />
            <Stack.Screen
                name={navigationStrings.PRODUCTS_PRICE}
                component={ProductsPrice}
            />

        </Stack.Navigator>
    );
}
