import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
import { getBundleId } from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Text, View } from 'react-native';
import codePush from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';
import { Provider } from 'react-redux';
import NoInternetModal from './src/Components/NoInternetModal';
import NotificationModal from './src/Components/NotificationModal';
import Container from './src/library/toastify-react-native';
import Routes from './src/navigation/Routes';
import {
  setDefaultLanguage,
  updateInternetConnection,
} from './src/redux/actions/init';
import store from './src/redux/store';
import colors from './src/styles/colors';
import fontFamily from './src/styles/fontFamily';
import { moderateScaleVertical, width } from './src/styles/responsiveSize';
import { appIds } from './src/utils/constants/DynamicAppKeys';
import {
  notificationListener,
  requestUserPermission,
} from './src/utils/notificationServices';
import ShowNotificationForeground from './src/utils/ShowNotificationForeground';
import types from './src/redux/types';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { MenuProvider } from 'react-native-popup-menu';


let CodePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

const { dispatch } = store

const App = () => {
  const [internetConnection, setInternet] = useState(true);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
        updateDialog: true,
      },
      codePushStatusDidChange,
      codePushDownloadDidProgress
    );
  }, []);

  function codePushStatusDidChange(syncStatus) {
    console.log(syncStatus, codePush.SyncStatus, "syncStatus>>>>>>");
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log("status Checking for update");
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log(" status Downloading package");
        break;
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        console.log("codepush status Awaiting user action");
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        console.log("codepush status Installing update");
        setProgress(false);
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log("codepush status App up to date");
        setProgress(false);
        break;
      case codePush.SyncStatus.UPDATE_IGNORED:
        console.log("codepush status Update cancelled by user");
        setProgress(false);
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        console.log(
          "codepush status Update installed and will be applied on restart"
        );
        setProgress(false);
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
        console.log("codepush status An unknown error occurred.");
        setProgress(false);
        break;
    }
  }

  function codePushDownloadDidProgress(progress) {
    console.log("codepush status progress status", progress);
    setProgress(progress);
  }

  const setInitialLanguage = () => {
    if (appIds.bluebolt == DeviceInfo.getBundleId()) {
      setDefaultLanguage({
        id: 9,
        label: "Vietnamese",
        value: "vi",
      });
    }
  };

  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem("alreadyLaunched").then((value) => {
        console.log(value, "valuevaluevaluevalue");
        // const data = true;
        if (value == null) {
          data = JSON.stringify({ data: true });
          AsyncStorage.setItem('alreadyLaunched', data); // No need to wait for `setItem` to finish, although you might want to handle errors
          setInitialLanguage();
        } else {
        }
      }); // Add some error handling, also you can simply do this.setState({fistLaunch: value == null})
      await AsyncStorage.getItem('cabPoolingStatus').then(value => {
        const poolingStatus = JSON.parse(value)
        dispatch({
          type: types.POOLING,
          payload: poolingStatus,
        });
      }).catch((error) => {
        console.log(error, 'error in getting poolstatus');
      })// Add some error handling, also you can simply do this.setState({fistLaunch: value == null})
    })().catch(err => {
      console.error(err);
    });
  }, []);

  const notificationConfig = () => {
    requestUserPermission();
    notificationListener();
  };

  useEffect(() => {
    notificationConfig();
    if (
      getBundleId() == appIds?.flank
    ) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 100);
    }
    else {
      setTimeout(() => {
        SplashScreen.hide();
      }, 1500);
    }

  }, []);

  //rest of code will be performing for iOS on background too

  // // BackgroundTimer.stopBackgroundTimer();


  // //Check internet connection
  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const netStatus = state.isConnected;
      setInternet(netStatus);
      updateInternetConnection(netStatus);
    });

    return () => removeNetInfoSubscription();
  }, []);

  const progressView = () => {
    return (
      <View>
        <Modal isVisible={true}>
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: moderateScale(8),
              padding: moderateScale(16),
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontFamily: fontFamily.medium,
                color: colors.textGreyOpcaity7,
                fontSize: textScale(14),
              }}
            >
              In Progress...
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: moderateScaleVertical(12),
                marginBottom: moderateScaleVertical(4),
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamily.medium,
                  color: colors.textGreyOpcaity7,
                  fontSize: textScale(12),
                }}>{`${(Number(progress?.receivedBytes) / 1048576).toFixed(
                  2,
                )}MB/${(Number(progress.totalBytes) / 1048576).toFixed(
                  2,
                )}MB`}</Text>

              <Text
                style={{
                  color: colors.black,
                  fontFamily: fontFamily.medium,
                  fontSize: textScale(12),
                }}
              >
                {(
                  (Number(progress?.receivedBytes) /
                    Number(progress.totalBytes)) *
                  100
                ).toFixed(0)}
                %
              </Text>
            </View>

            <Progress.Bar
              progress={
                (
                  (Number(progress?.receivedBytes) /
                    Number(progress.totalBytes)) *
                  100
                ).toFixed(0) / 100
              }
              width={width / 1.2}
              color={colors.black}
            />
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <MenuProvider>
        <Provider store={store}>
          <ShowNotificationForeground />
          {progress ? progressView() : null}
          <Routes />
          <NotificationModal />
        </Provider>
        <Container
          width={width - 20}
          position="top"
          duration={2000}
          positionValue={moderateScaleVertical(20)}
        />
        <FlashMessage position="top" />
        <NoInternetModal show={!internetConnection} />
      </MenuProvider>
    </SafeAreaProvider>
  );
};

export default codePush(CodePushOptions)(App);