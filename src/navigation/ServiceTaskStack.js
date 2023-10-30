import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AddSignature, ChatScreen, ContactUs, OrderDetail, Payout, ProductDetail, Scanner, SearchProductVendorItem2, TaskCancel, TaskCompleteDocument, TaskDetail, TaskHistory, WebConnection } from '../Screens';
import Cart from '../Screens/CustomerCart/Cart3';
import OrderCancel from '../Screens/OrderCancel/OrderCancel';
import navigationStrings from './navigationStrings';
import WalletStack from './WalletStack';

const Stack = createNativeStackNavigator();
export default function () {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen
                name={navigationStrings.PAYOUT}
                component={Payout}
            />

            <Stack.Screen
                name={navigationStrings.TASKHISTORY}
                component={TaskHistory}

            />
            <Stack.Screen
                name={navigationStrings.TASKDETAIL}
                component={TaskDetail}
            />

            <Stack.Screen
                name={navigationStrings.TASKCANCEL}
                component={TaskCancel}
            />

            <Stack.Screen
                name={navigationStrings.TASKCOMPLETEDOCUMENT}
                component={TaskCompleteDocument}

            />
            <Stack.Screen
                name={navigationStrings.ADDSIGNATURE}
                component={AddSignature}

            />
            <Stack.Screen
                name={navigationStrings.SCANNER}
                component={Scanner}

            />
            <Stack.Screen
                name={navigationStrings.SEARCHPRODUCTOVENDOR}
                component={SearchProductVendorItem2}

            />
            <Stack.Screen
                name={navigationStrings.WALLETSTACK}
                component={WalletStack}

            />
            <Stack.Screen
                name={navigationStrings.CONTACTUS}
                component={ContactUs}

            />
            <Stack.Screen
                name={navigationStrings.ORDERDETAIL}
                component={OrderDetail}

            />
            <Stack.Screen
                name={navigationStrings.CART}
                component={Cart}

            />
            <Stack.Screen
                name={navigationStrings.PRODUCTDETAIL}
                component={ProductDetail}

            />
            <Stack.Screen
                name={navigationStrings.ORDERCANCEL}
                component={OrderCancel}

            />
            <Stack.Screen
                name={navigationStrings.WEBCONNECTIONS}
                component={WebConnection}

            />
            <Stack.Screen
                name={navigationStrings.CHAT_SCREEN}
                component={ChatScreen}

            />
        </Stack.Navigator>
    );
}
