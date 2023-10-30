import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Payout, Subscriptions, WebConnection} from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createNativeStackNavigator();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.SUBSCRIPTIONS}
        component={Subscriptions}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
