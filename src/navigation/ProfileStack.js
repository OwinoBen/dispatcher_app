import React from 'react';
import {MyProfile} from '../Screens';
import navigationStrings from './navigationStrings';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.MYPROFILE}
        component={MyProfile}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
