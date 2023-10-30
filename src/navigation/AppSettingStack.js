import React from 'react';
import {Settings} from '../Screens';
import navigationStrings from './navigationStrings';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.SETTINGS}
        component={Settings}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
