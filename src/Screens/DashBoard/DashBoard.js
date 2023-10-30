import { debounce, get, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import SwitchSelectorComponent from '../../Components/SwitchSelector';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import actions from '../../redux/actions';
// import store from '../../redux/store';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { Platform, TouchableOpacity } from 'react-native';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import ListEmptyComponent from '../../Components/ListEmptyComponent';
import TaskListCard from '../../Components/TaskListCard';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {
  getCurrentLocation,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import { requestUserPermission } from '../../utils/notificationServices';

import styles from './styles';
navigator.geolocation = require('react-native-geolocation-service');
// import BackgroundService from 'react-native-background-actions';
import socketServices from '../../utils/scoketService';
// import BackgroundTimer from 'react-native-background-timer';
import BackgroundGeolocation from '@hariks789/react-native-background-geolocation';
import generateBoxShadowStyle from '../../Components/generateBoxShadowStyle';
import GradientButton from '../../Components/GradientButton';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import BidAcceptRejectCard from '../../Components/BidAcceptRejectCard';
import PoolingSuggestionCard from '../../Components/PoolingSuggestionCard';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import { colorArray } from '../../utils/constants/ConstantValues';
import { chekLocationPermission } from '../../utils/permissions';

var finalAllTasks = [];
var finaltodayTasks = [];

export default function DashBoard({ route, navigation }) {
  const { userData } = useSelector(state => state?.auth || {});
  const { attributeFormData } = useSelector(state => state?.initBoot || {});
  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );
  console.log(attributeFormData,userData,"attributeFormDataattributeFormDataattributeFormDataattributeFormData");
  const {
    clientInfo,
    sessionLogoutUser,
    refreshHomeData,
    defaultLanguage,
    fcmToken,
    zendeskKeys,
    notificationData,
  } = useSelector(state => state?.initBoot);
  const { isCabPooling, initialValue } = useSelector(state => state?.auth) || {};

  const ref = useRef(orderCallbackUrl);
  const bottomSheetRef = useRef(null);

  const [state, setState] = useState({
    isLoading: false,
    isEnabled: userData && userData?.is_available ? true : false,
    options: [
      { label: strings.TODAYSTASK, value: 0, testID: '1' },
      { label: strings.ALLTASKS, value: 1, testID: '2' },
    ],
    initial: 0,
    selectedOption: 0,
    todaysTasks: [],
    allTasks: [],
    isRefreshing: false,
    pageNo: 1,
    region: {
      latitude: 20.5937,
      longitude: 78.9629,
      latitudeDelta: 0.025,
      longitudeDelta: 0.0221,
    },
    coordinate: {
      latitude: 20.5937,
      longitude: 78.9629,
      latitudeDelta: 0.025,
      longitudeDelta: 0.0221,
    },
    enableMap: true,
    markers: [],
    isLoadingSwitch: false,
    fcm_token: null,
    statusChanged: false,
    longitude: 77.4753352147053,
    latitude: 27.685284872673407,
    heading: 0,
    isWarningAlert: false,
    warningStatus: false,
    allPoolingingSuggestions: [],
  });
  const {
    longitude,
    latitude,
    heading,
    region,
    coordinate,
    todaysTasks,
    allTasks,
    initial,
    options,
    isEnabled,
    isLoading,
    selectedOption,
    isRefreshing,
    pageNo,
    enableMap,
    markers,
    isLoadingSwitch,
    fcm_token,
    statusChanged,
    isWarningAlert,
    warningStatus,
    allPoolingingSuggestions,
  } = state;

  const [orderCallbackUrl, setOrderCallbackUrl] = useState('')
  const [allCustomerBidsList, setAllCustomerBidsList] = useState([])
  const [driverSelectedPriceForBide, setDriverSelectedPriceForBide] = useState({})
  const [showBiddingView, setShowBiddingView] = useState(false)
  const [bidRidePrice, setBidRidePrice] = useState(0);

  useEffect(() => {
    (async () => {
      currentLocation();
      updateState({
        fcm_token: fcmToken,
      });
    })();
    return () => { };
  }, []);

  useEffect(() => {
    console.log('clientInfoclientInfo', clientInfo);
    if (!!clientInfo?.socket_url) {
      socketServices.initializeSocket(clientInfo?.socket_url);
    }
  }, [clientInfo]);

  useEffect(() => {
    if (refreshHomeData && enableMap) {
      updateState({
        enableMap: false,
      });
    }
  }, [refreshHomeData]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (isEnabled) {
      BackgroundGeolocation.on('location', location => {
        let headingAngle = location?.bearing || 0.0;
        let lat = location?.latitude || 0;
        let long = location.longitude || 0;
        ref.current = orderCallbackUrl;
        fetchgentLogs(lat, long, headingAngle);
        console.log(lat, long, headingAngle, 'at, long, headingAngle=>');
      });

      BackgroundGeolocation.on('error', error => {
        console.log('[ERROR] BackgroundGeolocation error:', error);
      });

      BackgroundGeolocation.on('authorization', status => {
        console.log(
          '[INFO] BackgroundGeolocation authorization status: ' + status,
        );
        if (status !== BackgroundGeolocation.AUTHORIZED) {
          // we need to set delay or otherwise alert may not be shown
          setTimeout(
            () =>
              Alert.alert(
                'App requires location tracking permission',
                'Would you like to open app settings?',
                [
                  {
                    text: 'Yes',
                    onPress: () => BackgroundGeolocation.showAppSettings(),
                  },
                  {
                    text: 'No',
                    onPress: () => console.log('No Pressed'),
                    style: 'cancel',
                  },
                ],
              ),
            1000,
          );
        }
      });

      BackgroundGeolocation.on('background', () => {
        console.log('[INFO] App is in background');
      });

      BackgroundGeolocation.on('foreground', () => {
        console.log('[INFO] App is in foreground');
      });

      BackgroundGeolocation.on('abort_requested', () => {
        console.log('[INFO] Server responded with 285 Updates Not Required');
      });

      BackgroundGeolocation.on('http_authorization', () => {
        console.log('[INFO] App needs to authorize the http requests');
      });

      BackgroundGeolocation.checkStatus(status => {
        console.log(status, 'status.isRunning');
        if (!status.isRunning) {
          BackgroundGeolocation.start(); //triggers start on start event
        }
      });

      BackgroundGeolocation.configure({
        activityType: 'Fitness',
        desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
        stationaryRadius: 10,
        distanceFilter: 10,
        debug: false,
        startOnBoot: false,
        stopOnTerminate: true,
        notificationTitle: 'Location Tracking',
        notificationText: `Tracking driver's location in background.`,
        locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
        interval: 10000,
        fastestInterval: 10000,
        activitiesInterval: 10000,
        stopOnStillActivity: false,
        pauseLocationUpdates: false,
        url: '',
        httpHeaders: {
          'X-FOO': 'bar',
        },
        // customize post properties
        postTemplate: {
          lat: '@latitude',
          lon: '@longitude',
          foo: 'bar', // you can also add your own properties
        },
      });
    } else {
      BackgroundGeolocation.removeAllListeners();
    }

    return () => {
      BackgroundGeolocation.removeAllListeners();
    };
  }, [orderCallbackUrl, setOrderCallbackUrl, ref, isEnabled]);

  useFocusEffect(
    React.useCallback(() => {
      if (isCabPooling) {
        const poolingSuggestionTab = [
          {
            label:
              getBundleId() == appIds.tdc
                ? strings.TODAYTRIP
                : strings.TODAYSTASK,
            value: 0,
            testID: '1',
          },
          {
            label:
              getBundleId() == appIds.tdc ? strings.ALLTRIP : strings.ALLTASKS,
            value: 1,
            testID: '2',
          },
          { label: 'Pooling Suggestion', value: 2, testID: '3' },
        ];
        updateState({
          isLoading: true,
          options: poolingSuggestionTab,
          selectedOption: 0,
        });
      } else {
        updateState({
          isLoading: true,
          selectedOption: 0,
          options: [
            {
              label:
                getBundleId() == appIds.tdc
                  ? strings.TODAYTRIP
                  : strings.TODAYSTASK,
              value: 0,
              testID: '1',
            },
            {
              label:
                getBundleId() == appIds.tdc
                  ? strings.ALLTRIP
                  : strings.ALLTASKS,
              value: 1,
              testID: '2',
            },
          ],
        });
      }
    }, [isCabPooling]),
  );

  const fetchgentLogs = async (lat, lng, heading_) => {
    if (userData?.access_token) {
      let data = {};
      data['device_type'] = Platform.OS;
      data['os_version'] = DeviceInfo.getSystemVersion();
      data['app_version'] = DeviceInfo.getVersion();
      data['on_route'] = 'y';
      data['battery_level'] = (await DeviceInfo.getBatteryLevel()) * 100;
      data['all'] = selectedOption;
      // data['current_speed'] = 'y';
      data['long'] = lng;
      data['lat'] = lat;
      data['device_token'] = !!fcmToken ? fcmToken : '';
      data['heading_angle'] = heading_;

      console.log(data, 'data>data====');
      actions
        .logsApi(data, { client: clientInfo?.database_name })
        .then(res => {
          console.log(res, 'logs data');
          // if (
          //   res?.data?.user?.client_preference
          //     ?.customer_support_application_id != null &&
          //   res?.data?.user?.client_preference?.customer_support_key != null
          // ) {
          //   if (
          //     zendeskKeys?.keys?.account_key !=
          //       res?.data?.user?.client_preference?.customer_support_key &&
          //     zendeskKeys?.keys?.application_id !=
          //       res?.data?.user?.client_preference
          //         ?.customer_support_application_id
          //   )
              actions?.setZendeskKeys({
                keys: {
                  application_id:
                    res?.data?.user?.client_preference
                      ?.customer_support_application_id,
                  account_key:
                    res?.data?.user?.client_preference?.customer_support_key,
                },
              });
            
          // }

          if (res?.data?.user?.is_pooling_available) {
            actions.savePoolingStatusForLifeCycle(
              res?.data?.user?.is_pooling_available,
            );
          }

          if (selectedOption == 1) {
            updateState({ allTasks: res?.data?.tasks });
          } else {
            updateState({ todaysTasks: res?.data?.tasks });
          }
        })
        .catch(errorMethod);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (selectedOption != 2) {
        getTasks();
      } else {
        getAllPoolingSuggestions();
      }
    }, [selectedOption]),
  );

  useEffect(() => {
    if (isLoading || isRefreshing) {
      if (selectedOption != 2) {
        getTasks();
      } else {
        getAllPoolingSuggestions();
      }
    }
  }, [isLoading, isRefreshing]);

  useEffect(() => {
    if (refreshHomeData) {
      if (selectedOption != 2) {
        getTasks();
      } else {
        getAllPoolingSuggestions();
      }
    }
  }, [refreshHomeData]);

  useEffect(() => {
    (async () => {
      currentLocation();
      updateState({
        fcm_token: fcmToken,
      });
    })();
    return () => { };
  }, []);

  const currentLocation = () => {
    chekLocationPermission()
      .then(result => {
        console.log(result,"error while accessing locationerror while accessing locationerror while accessing location");
        if (result !== 'goback') {
          getCurrentPosition();
        }
      })
      .catch(error => console.log('error while accessing location', error));
  };

  const getCurrentPosition = () => {
    return navigator.geolocation.default.getCurrentPosition(
      position => {
        console.log(position, 'position......................');
        updateState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading,
        });

        actions.userCurrentLocation(position);

        // getCurrentLocation(
        //   position.coords.latitude,
        //   position.coords.longitude,
        //   "address"
        // )
        //   .then((res) => alert(res))
        //   .catch((error) => console.log("error rasied", error));
      },
      error => console.log(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
      },
    );
  };

  //get all tasks
  const getTasks = () => {
    actions
      .getListOfTasks(
        `?all=${selectedOption}`,
        {},
        { client: clientInfo?.database_name },
      )
      .then(res => {
        actions.updateHomepage(false);
        // updateState({isRefreshing: false});
        if (selectedOption) {
          let filterMarker = res?.data?.filter((val, i) => {
            if (!!val?.location?.latitude && !!val?.location?.longitude) {
              return val;
            }
          });
          updateState({
            allTasks: res?.data,
            markers: filterMarker,
            isRefreshing: false,
            // isLoading: false,
          });
        } else {
          let filterMarker = res?.data?.filter((val, i) => {
            if (!!val?.location?.latitude && !!val?.location?.longitude) {
              return val;
            }
          });
          updateState({
            todaysTasks: res?.data,
            markers: filterMarker,
            isRefreshing: false,
            // isLoading: false,
          });
        }
      })
      .catch(errorMethod);
  };

  const getAllPoolingSuggestions = () => {
    allPoolingSuggestions();
  };

  const allPoolingSuggestions = () => {
    const header = {
      client: clientInfo?.database_name,
    };
    actions
      .getAllPoolingSuggestions({}, header)
      .then(res => {
        console.log(res, 'pooling');
        const poolingSuggestionAccordingToDistance =
          res?.data?.order_suggession?.sort(function (a, b) {
            return a?.distance_pickup - b?.distance_pickup;
          });

        updateState({
          isLoading: false,
          isRefreshing: false,
          allPoolingingSuggestions: poolingSuggestionAccordingToDistance,
        });
      })
      .catch(error => {
        console.log(error, 'error');
        updateState({
          isLoading: false,
          isRefreshing: false,
        });
      });
  };

  const aceptRejectPoolingSuggestions = status => {
    updateState({
      isLoading: true,
    });

    let data = {};
    data['order_id'] = status?.id;
    data['driver_id'] = userData?.id;
    data['status'] = 1;
    data['type'] = 'O';

    console.log(data, 'datadata');

    actions
      .acceptRejectTask(data, { client: clientInfo?.database_name })
      .then(res => {
        showSuccess(res?.message);
        updateState({ isLoading: false });
        actions.updateHomepage(true);
      })

      .catch(errorMethod);
  };

  //Error handling in api
  const errorMethod = error => {
    showError(error?.message || error?.error);
    updateState({
      isLoading: false,
    });
  };
  useEffect(() => {
    data(allTasks);
    updateState({
      isLoading: false,
    });
  }, [allTasks]);

  useEffect(() => {
    todayTaskData(todaysTasks);
    updateState({
      isLoading: false,
    });
  }, [todaysTasks]);

  const todayTaskData = (data, type) => {
    finaltodayTasks = [];
    let len;
    for (let i = 0; i < data?.length; i = i + len) {
      let arr = [];
      for (let j = i; j < data?.length; j++) {
        if (data[i].order_id === data[j].order_id) {
          arr = [...arr, data[j]];
          len = arr.length;
        }
      }

      finaltodayTasks = [...finaltodayTasks, { title: i, data: arr }];
    }
  };
  const data = (data, type) => {
    finalAllTasks = [];
    let len;
    let datalength = data?.length;
    for (let i = 0; i < datalength; i = i + len) {
      let arr = [];
      for (let j = i; j < datalength; j++) {
        if (data[i].order_id === data[j].order_id) {
          arr = [...arr, data[j]];
          len = arr.length;
        }
      }

      finalAllTasks = [...finalAllTasks, { title: i, data: arr }];
    }
  };

  const updateState = data => setState(state => ({ ...state, ...data }));

  const commonStyles = commonStylesFunc({ fontFamily });

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };

  const onOffDuty = () => {
    actions
      .onOffDuty(
        `?device_token=${fcm_token ? fcm_token : DeviceInfo.getDeviceToken()}`,
        {},
        { client: clientInfo?.database_name },
      )
      .then(res => {
        console.log(res, 'onOffDuty>res>res');
        updateState({ isLoadingSwitch: false });
        if (res?.data) {
          updateState({ statusChanged: false });
          let updatedUserData = { ...userData };
          updatedUserData['is_available'] = res?.data?.is_available;
          actions.updataeUserData(updatedUserData);
        }
      })
      .catch(errorMethod);
  };

  const toggleSwitch = () => {
    fitPadding([
      {
        latitude: Number(latitude),
        longitude: Number(longitude),
        latitudeDelta: 0.035,
        longitudeDelta: 0.0321,
      },
      {
        latitude: Number(latitude) - 0.001,
        longitude: Number(longitude) - 0.01,
        latitudeDelta: 0.035,
        longitudeDelta: 0.0321,
      },
    ]);
    updateState({
      statusChanged: true,
      isEnabled: !isEnabled,
      isLoadingSwitch: true,
    });
    setTimeout(() => {
      onOffDuty();
    }, 500);
  };

  const updateContent = value => {
    if (isCabPooling) {
      updateState({
        selectedOption: value,
        isLoading: true,
        enableMap: value != 2 ? true : false,
      });
    } else {
      updateState({
        selectedOption: value,
        isLoading: true,
      });
    }
  };

  const customCenter = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ paddingHorizontal: 10 }}>
          <Image source={imagePath.locationOff} />
        </View>
        <Switch
          trackColor={{ false: colors.backGround, true: colors.themeColor }}
          thumbColor={colors.white}
          // ios_backgroundColor=#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <View style={{ paddingHorizontal: 10 }}>
          <Image source={imagePath.locationOn} />
        </View>
      </View>
    );
  };

  //pagination of data
  const onEndReached = ({ distanceFromEnd }) => {
    updateState({ pageNo: pageNo + 1 });
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const _onPressTask = item => {
    moveToNewScreen(navigationStrings.TASKDETAIL, { item: item })();
  };
  const getDynamicUpdateOnValues = data => {
    var colorData = colorArray;
    return colorData[finalAllTasks.indexOf(data) % colorData.length];
  };

  const renderTaskList = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => _onPressTask(item?.data[0])}
        activeOpacity={0.8}
        style={{
          marginTop: moderateScale(30),
          borderLeftColor: getDynamicUpdateOnValues(item),
          borderLeftWidth: 3,
          marginHorizontal: moderateScale(10),
          ...generateBoxShadowStyle(-2, 0, '#171717', 0.2, 3, 3, '#171717'),
        }}>
        {item?.data?.map(obj => {
          return (
            <TaskListCard
              data={obj}
              index={index}
              // _onPressTaskDetails={() => _onPressTaskDetails(item)}
            />
          );
        })}
      </TouchableOpacity>
    );
  };

  const renderPoolingSuggestions = ({ item, index }) => {
    return (
      <TouchableOpacity
        // onPress={() => _onPressTask(item?.data[0])}
        activeOpacity={1}
        style={{
          borderLeftColor: getDynamicUpdateOnValues(item),
          borderLeftWidth: 3,
          marginHorizontal: moderateScale(10),
          ...generateBoxShadowStyle(-2, 0, '#171717', 0.2, 3, 3, '#171717'),
          paddingBottom: moderateScaleVertical(10),
          marginBottom: moderateScaleVertical(20),
        }}>
        <PoolingSuggestionCard
          // data={obj}
          index={index}
          mainOrderSuggestionData={item}
        />

        <GradientButton
          btnText={'Accept'}
          btnStyle={{
            borderRadius: moderateScale(2),
          }}
          colorsArray={[colors.green, colors.green]}
          containerStyle={{ marginHorizontal: moderateScale(10) }}
          onPress={() => aceptRejectPoolingSuggestions(item)}
        />
      </TouchableOpacity>
    );
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ pageNo: 1, isRefreshing: true });
  };

  const homeMainView = () => {
    return (
      <>
        <View style={{ flex: 1 }}>
          {(
            selectedOption == 2
              ? allPoolingingSuggestions?.length
              : selectedOption
                ? allTasks?.length
                : todaysTasks?.length
          ) ? (
            <FlatList
              data={
                selectedOption == 2
                  ? allPoolingingSuggestions
                  : selectedOption
                    ? finalAllTasks
                    : finaltodayTasks
              }
              renderItem={
                selectedOption != 2 ? renderTaskList : renderPoolingSuggestions
              }
              //allPoolingingSuggestions
              keyExtractor={(item, index) => String(index)}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              style={{
                flex: 1,
                backgroundColor: !!(selectedOption == 1 && !allTasks.length)
                  ? colors.backGround
                  : !!(selectedOption == 0 && !todaysTasks.length)
                    ? colors.backGround
                    : colors.white,
              }}
              contentContainerStyle={{
                flexGrow: 1,
                // marginVertical: moderateScaleVertical(20),
              }}
              refreshing={isRefreshing}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                />
              }
              onEndReached={onEndReachedDelayed}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={() => (
                <ListEmptyComponent
                  isLoading={isLoading}
                  message={
                    selectedOption == 2
                      ? 'No Pooling Suggestions Yet'
                      : getBundleId() == appIds.tdc
                        ? strings.NOTRIP
                        : strings.NOTASK
                  }
                  subMessage={
                    selectedOption == 2
                      ? 'You have no pooling suggestions . We’ll notify you when new pooling suggestion arrive.'
                      : strings.NOTASKASSIGNED
                  }
                  containerStyle={{ backgroundColor: colors.backGround }}
                />
              )}
            />
          ) : (
            <ListEmptyComponent
              isLoading={isLoading}
              message={
                selectedOption == 2
                  ? 'No Pooling Suggestions Yet'
                  : getBundleId() == appIds.tdc
                    ? strings.NOTRIP
                    : strings.NOTASK
              }
              subMessage={
                selectedOption == 2
                  ? 'You have no pooling suggestions . We’ll notify you when new pooling suggestion arrive.'
                  : strings.NOTASKASSIGNED
              }
              containerStyle={{ backgroundColor: colors.backGround }}
            />
          )}
        </View>
      </>
    );
  };

  const _onRegionChange = region => {
    updateState({ region: region });
    // _getAddressBasedOnCoordinates(region);
  };

  const fitToMap = () => {
    if (markers && markers.length && enableMap) {
      let arr = [];
      markers.map((i, inx) => {
        if (
          i &&
          i?.location &&
          i?.location?.latitude != NaN &&
          i?.location?.longitude != NaN
        ) {
          arr = [
            ...arr,
            {
              latitude: Number(i?.location?.latitude),
              longitude: Number(i?.location?.longitude),
            },
          ];
        }
      });
      console.log(arr, 'newArray');
      // animate(region);
      setTimeout(() => {
        // animate(region);
        fitPadding(arr);
      }, 5000);
    }
  };

  useEffect(() => {
    fitToMap();
  }, [markers]);

  useEffect(() => {
    if (latitude && longitude) {
      fitPadding([
        {
          latitude: Number(latitude),
          longitude: Number(longitude),
          latitudeDelta: 0.035,
          longitudeDelta: 0.0321,
        },
        {
          latitude: Number(latitude) - 0.001,
          longitude: Number(longitude) - 0.01,
          latitudeDelta: 0.035,
          longitudeDelta: 0.0321,
        },
      ]);
    }
  }, [latitude, longitude]);

  //show warrning

  const _onOpenSettings = () => {
    Linking.openSettings();
  };

  const toggleWarning = state => updateState({ isWarningAlert: state });
  useEffect(() => {
    const interval = setInterval(() => {
      requestUserPermission(toggleWarning);
    }, 1000);
    if (!isWarningAlert && interval && (fcmToken || warningStatus))
      clearInterval(interval);
    updateState({ warningStatus: 1 });
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWarningAlert]);

  const offDutyView = () => {
    return (
      <View style={{ flex: 1 }}>
        <ListEmptyComponent
          isLoading={isLoadingSwitch}
          message={strings.OFFDUTY}
          subMessage={strings.OFFDUTYMESSAGE}
          containerStyle={{ backgroundColor: colors.backGround }}
          image={imagePath?.offDuty}
        />
      </View>
    );
  };

  const mapRef = useRef();

  const fitPadding = newArray => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([{ latitude, longitude }, ...newArray], {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  };

  const mapView = () => {
    return (
      <MapView
        ref={mapRef}
        provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT} // remove if not using Google Maps
        style={styles.map}
        // region={region}

        zoomEnabled={true}
        initialRegion={{
          latitude: Number(latitude),
          longitude: Number(longitude),
          latitudeDelta: 0.035,
          longitudeDelta: 0.0321,
        }}
        // showsUserLocation={true}
        // showsMyLocationButton={true}
        onLayout={() => fitToMap()}
        //   customMapStyle={mapStyle}
        onRegionChangeComplete={_onRegionChange}>
        {markers?.map(
          (coordinate, index) =>
            coordinate &&
            coordinate?.location &&
            coordinate?.location?.latitude != NaN &&
            coordinate?.location?.longitude != NaN && (
              <Marker
                tracksViewChanges={false}
                zIndex={index}
                key={`coordinate_${index}`}
                image={imagePath.pinRed}
                onPress={() => {
                  _onPressTask(coordinate);
                }}
                coordinate={{
                  latitude: Number(coordinate?.location?.latitude),
                  longitude: Number(coordinate?.location?.longitude),
                }}></Marker>
            ),
        )}
        <Marker
          image={imagePath.pinBlue}
          coordinate={{
            latitude: Number(latitude),
            longitude: Number(longitude),
          }}></Marker>
      </MapView>
    );
  };

  const renderComponents = () => {
    switch (isEnabled) {
      case true:
        if (enableMap) {
          return mapView();
        } else {
          return homeMainView();
        }
        break;

      default:
        return offDutyView();
        break;
    }
  };

  const _onSwitchMapView = () => {
    updateState({ enableMap: !enableMap });
  };

  /*********************************Bid and Ride View *************************/

  // recive bids with notification

  useEffect(() => {
    const bideNotificationType =
      notificationData?.notificationData?.data?.notificationType ||
      notificationData?.notificationData?.data?.type;
    console.log(bideNotificationType, 'bideNotificationType>> in home');
    if (bideNotificationType == 'bid_ride_request') {
      _onReciveBide();
    }
  }, [notificationData]);

  const _onReciveBide = (hideBidView = true) => {
    const apiHeader = {
      client: clientInfo?.database_name,
    };
    actions
      .reciveBideRequests({}, apiHeader)
      .then(res => {
        if (res?.data?.requestdata) {
          setAllCustomerBidsList(res?.data?.requestdata);
          setShowBiddingView(hideBidView);
        }
      })
      .catch(error => {
        showError(error?.message);
        setShowBiddingView(false);
      });
  };

  const _onAcceptRideBid = data => {
    const apiUrl = data?.call_back_url;
    const apiData = {
      bid_price: data?.selectedPriceForBid || data?.requested_price,
      task_type: 'bid_ride_request',
      driver_id: userData?.id,
      driver_name: userData?.name,
      driver_image: userData?.image_url,
    };

    const apiHeader = {};
    actions
      .acceptBideRequest(apiUrl, apiData, apiHeader)
      .then(res => {
        _onAcceptdeclineBideRequest(data?.id, 1);
        showSuccess(res?.message);
      })
      .catch(error => {
        showError(error?.message);
      });
  };
  const _onDeclineBid = data => {
    _onAcceptdeclineBideRequest(data, 0);
  };

  const _onAcceptdeclineBideRequest = (data, type) => {
    const apiData = {
      id: data,
      status: type,
    };
    const apiHeader = {
      client: clientInfo?.database_name,
    };
    actions
      .acceptdeclineBideRequest(apiData, apiHeader)
      .then(res => {
        const hideBidView = type == 1 ? false : true;
        _onReciveBide(hideBidView);
        setDriverSelectedPriceForBide({});
      })
      .catch(error => {
        showError(error?.message);
      });
  };

  //Biding Rice Funcationality>>>>>>>>>>>>>>>>>>

  const _onRidePriceIncerimentDecrimentPrice = (type, bidData) => {
    if (type == 'minus') {
      return Number(bidData?.selectedPriceForBid) - 10;
    } else {
      return Number(bidData?.selectedPriceForBid) + 10;
    }
  };
  const _onSetBidPrice = (type, bidData) => {
    const selectedBidPrice = _onRidePriceIncerimentDecrimentPrice(
      type,
      bidData,
    );
    const finalRequestData = allCustomerBidsList.map((element, index) => {
      if (element.bid_id == bidData?.bid_id) {
        if (selectedBidPrice < bidData?.minimum_requested_price) {
          alert(
            `you can't select price below ${bidData?.minimum_requested_price}`,
          );
          setBidRidePrice(Number(bidData?.minimum_requested_price));
          element['selectedPriceForBid'] = String(
            bidData?.minimum_requested_price,
          );
        } else {
          element['selectedPriceForBid'] = String(
            selectedBidPrice || bidData?.requested_price,
          );
        }
      }

      return element;
    });
    setAllCustomerBidsList(finalRequestData);
  };

  const renderCustomerListCard = useCallback(
    ({ item, index }) => {
      return (
        <BidAcceptRejectCard
          data={item}
          bidExpiryDuration={20}
          _onDeclineBid={_onDeclineBid}
          _onAcceptRideBid={_onAcceptRideBid}
          _onSetBidPrice={_onSetBidPrice}
          bidRidePrice={bidRidePrice}
        />
      );
    },
    [allCustomerBidsList],
  );
  const renderBidingView = () => {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        // key={isOpen}
        // snapPoints={['1%', true ? '100%' : '30%']}
        snapPoints={['100%', '100%']}
        activeOffsetY={[-1, 1]}
        failOffsetX={[-5, 5]}
        animateOnMount={true}
        enablePanDownToClose={false}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
      // onChange={_connectRajorPayBottomSheet}
      // handleComponent={_handleComponent}
      >
        <FlatList
          showsVerticalScrollIndicator={false}
          data={allCustomerBidsList}
          renderItem={renderCustomerListCard}
          //keyExtractor={awesomeChildListKeyExtractor}
          ListFooterComponent={() => (
            <View
              style={{
                marginLeft: moderateScale(16),
                marginBottom: moderateScaleVertical(20),
              }}
            />
          )}
          ListHeaderComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
        />
      </BottomSheet>
    );
  };

  return !isEmpty(allCustomerBidsList) && showBiddingView ? (
    renderBidingView()
  ) : (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.backGround}
      isLoading={isLoading || isLoadingSwitch}
      source={loaderOne}>
      <Header
        reverse={false}
        headerStyle={{ backgroundColor: colors.white }}
        leftIcon={imagePath.menu}
        onPressLeft={() => navigation.toggleDrawer()}
        noLeftIcon={!!clientInfo?.is_freelancer}
        // hideRight={true}
        customCenter={() => customCenter()}
        rightIcon={!enableMap ? imagePath.map : imagePath.listMenu}
        onPressRight={_onSwitchMapView}
      />
      <View style={{ ...commonStyles.headerTopLine }} />
      {isWarningAlert && (
        <View
          style={{
            backgroundColor: colors.lightRed,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: moderateScale(10),
          }}>
          <View style={{ width: width / 2.2, justifyContent: 'center' }}>
            <Text style={{ color: colors.white, fontFamily: fontFamily.regular }}>
              {strings.notificationAlert}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              width: width / 2.5,
              alignItems: 'center',
              flexDirection: 'row',
              marginVertical: moderateScaleVertical(5),
              paddingVertical: moderateScaleVertical(10),
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.themeColor,
                alignItems: 'center',
                marginVertical: moderateScaleVertical(10),
                paddingVertical: moderateScaleVertical(5),
                paddingHorizontal: moderateScale(10),
                borderRadius: 8,
              }}
              onPress={() => toggleWarning(false)}>
              <Text style={{ color: colors.white }}>{strings.CANCEL}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: colors.themeColor,
                alignItems: 'center',
                marginVertical: moderateScaleVertical(10),
                paddingVertical: moderateScaleVertical(5),
                paddingHorizontal: moderateScale(10),
                borderRadius: 8,
              }}
              onPress={() => _onOpenSettings()}>
              <Text style={{ color: colors.white }}>{strings.ENABLE}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: moderateScaleVertical(20),
          paddingBottom: moderateScaleVertical(20),
          borderBottomWidth: moderateScaleVertical(1),
          borderBottomColor: colors.lightGreyBg,
        }}>
        {isEnabled ? (
          <SwitchSelectorComponent
            key={selectedOption}
            options={options}
            initial={selectedOption}
            onPress={value => updateContent(value)}
          // textInputStyle={{ width: moderateScale(width - 40) }}
          />
        ) : (
          <View style={{ height: 35 }} />
        )}
      </View>

      <View style={{ flex: 1 }}>{renderComponents()}</View>
    </WrapperContainer>
  );
}
