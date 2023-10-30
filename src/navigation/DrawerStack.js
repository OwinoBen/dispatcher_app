import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';
import CustomDrawerContent from '../Components/CustomDrawerContent';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import { ChatRoom, ContactUs, GoToHome, ProductsPrice, ServiceSlots, Settings } from '../Screens';
import DamageReport from '../Screens/DamageReport/DamageReport';
import Reimbursement from '../Screens/Reimbursement/Reimbursement';
import colors from '../styles/colors';
import { moderateScaleVertical, width } from '../styles/responsiveSize';
import navigationStrings from './navigationStrings';
import PayoutStack from './PayoutStack';
import ProfileStack from './ProfileStack';
import SubscriptionStack from './SubscriptionStack';
import TaskStack from './TaskStack';
import WalletStack from './WalletStack';
import CalendarStack from './CalendarStack';

const Drawer = createDrawerNavigator();
export default function DrawerRoutes(props) {
  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );


  return (
    <Drawer.Navigator
      backBehavior={'initialRoute'}
      overlayColor={'rgba(0,0,0,0.6)'}
      screenOptions={{
        headerShown: false,
        swipeEnabled: true,
        gestureEnabled: true,

        // drawerPosition: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
        drawerPosition: 'left',
        drawerStyle: {
          paddingTop: moderateScaleVertical(width / 6),

        },
      }}
      // hideStatusBar={true}

      drawerStyle={{ width: '75%', backgroundColor: colors.blueHeaderColor }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        component={TaskStack}
        name={navigationStrings.TASKSTACK}
        options={{
          drawerLabel: strings.TASKHISTORY,
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.taskHistory}
            />
          ),
        }}
      />

      <Drawer.Screen
        component={ProfileStack}
        name={navigationStrings.PROFILESTACK}
        options={{
          drawerLabel: strings.PROFILE,
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.profileImage}
            />
          ),
        }}
      />

      <Drawer.Screen
        component={WalletStack}
        name={navigationStrings.WALLETSTACK}
        options={{
          drawerLabel: strings.WALLET,
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.profileImage}
            />
          ),
        }}
      />

      <Drawer.Screen
        component={PayoutStack}
        name={navigationStrings.PAYOUT_STACK}
        options={{
          drawerLabel: strings.PAYOUT,
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.profileImage}
            />
          ),
        }}
      />

      <Drawer.Screen
        component={Settings}
        name={navigationStrings.SETTINGS}
        options={{
          drawerLabel: strings.SETTING,
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.settingsIcon}
            />
          ),
        }}
      />
      <Drawer.Screen
        component={ChatRoom}
        name={navigationStrings.CHAT_ROOM}
        options={{
          drawerLabel: 'Chat Room',
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.settingsIcon}
            />
          ),
        }}
      />
      <Drawer.Screen
        component={DamageReport}
        name={navigationStrings.DAMAGEREPORT}
        options={{
          drawerLabel: strings.DAMAGEREPORT,
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.settingsIcon}
            />
          ),
        }}
      />
      <Drawer.Screen
        component={Reimbursement}
        name={navigationStrings.REIMBURSEMENT}
        options={{
          drawerLabel: strings.REIMBURSEMENT,
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.settingsIcon}
            />
          ),
        }}
      />
      <Drawer.Screen
        component={ContactUs}
        name={navigationStrings.CONTACTUS}
        options={{

          drawerLabel: strings.SETTING,
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.settingsIcon}
            />
          ),
        }}
      />
      <Drawer.Screen
        component={SubscriptionStack}
        name={navigationStrings.SUBSCRIPTION_STACK}
        options={{
          drawerLabel: strings.SUBSCRIPTIONS,
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.icSubscription}
            />
          ),
        }}
      />

      <Drawer.Screen
        component={GoToHome}
        name={navigationStrings.GO_TO_HOME}
        options={{
          drawerLabel: strings.GO_TO_HOME,
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.settingsIcon}
            />
          ),
        }}
      />

      <Drawer.Screen
        component={ServiceSlots}
        name={navigationStrings.SERVICE_SLOTS}
        options={{
          drawerLabel: strings.DATE_TIME,
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.time}
            />
          ),
        }}
      />

      <Drawer.Screen
        component={ProductsPrice}
        name={navigationStrings.PRODUCTS_PRICE}
        options={{
          drawerLabel: strings.SERVICE_DETAILS,
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.icPayout}
            />
          ),
        }}
      />
      <Drawer.Screen
        component={CalendarStack}
        name={navigationStrings.CALENDAR_STACK}
        options={{
          drawerLabel: strings.CALENDAR,
          drawerIcon: ({ focused }) => (
            <Image
              style={{ tintColor: focused ? colors.blackShade2 : colors.grey2 }}
              source={imagePath.icCalendarInActive}
            />
          ),
        }}
      />



    </Drawer.Navigator>
  );
}
