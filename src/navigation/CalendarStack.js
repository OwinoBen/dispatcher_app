import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CalendarView, TaskDetail } from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createNativeStackNavigator();
export default function () {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen
                name={navigationStrings.CALENDAR_VIEW}
                component={CalendarView}
            />
            <Stack.Screen
                name={navigationStrings.TASKDETAIL}
                component={TaskDetail}
            />

        </Stack.Navigator>
    );
}
