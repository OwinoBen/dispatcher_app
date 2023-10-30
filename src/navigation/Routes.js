import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
// import { AppearanceProvider } from 'react-native-appearance';
import { useSelector } from 'react-redux';
import ShortCode from '../Screens/ShortCode/ShortCode';
import { navigationRef } from './NavigationService';
import navigationStrings from './navigationStrings';
import AuthStack from './AuthStack';
import DrawerRoutes from './DrawerStack';
import ProfileStack from './ProfileStack';
import BottomStack from './BottomStack';

const Stack = createNativeStackNavigator();

export function shortCode(Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.SHORT_CODE}
        component={ShortCode}
        options={{ headerShown: false }}
      />
    </>
  );
}

export function drawer(Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.DRAWER_ROUTES}
        component={DrawerRoutes}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </>
  );
}

export default function Routes() {
  const { userData } = useSelector(state => state?.auth || {});
  const { clientInfo } = useSelector(state => state?.initBoot);

  return (
    <NavigationContainer
      // theme={scheme == 'dark' ? DarkTheme : DefaultTheme}
      ref={navigationRef}>

      <Stack.Navigator>
        {userData && userData?.access_token ?
          <React.Fragment>
            {
              !clientInfo?.is_freelancer ? <Stack.Screen
                name={navigationStrings.DRAWER_ROUTES}
                component={DrawerRoutes}
                options={{
                  headerShown: false
                }}
              /> : <Stack.Screen
                name={navigationStrings.BOTTOM_STACK}
                component={BottomStack}
                options={{
                  headerShown: false
                }}
              />
            }
          </React.Fragment>
          : (
            AuthStack(Stack)
          )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}
