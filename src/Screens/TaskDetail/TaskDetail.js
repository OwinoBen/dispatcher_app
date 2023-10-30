import { cloneDeep } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Communications from 'react-native-communications';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps'; // import {createOpenLink} from '../../utils/CreateMapLinks';
import { createMapLink, createOpenLink } from 'react-native-open-maps';
import { useSelector } from 'react-redux';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
// import store from '../../redux/store';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
navigator.geolocation = require('react-native-geolocation-service');

import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import moment from 'moment';
import {
  getColorCodeWithOpactiyNumber,
  getCurrentLocation,
  getHostName,
  showError,
  showInfo,
  showSuccess,
} from '../../utils/helperFunctions';
import stylesFunc from './styles';
import ButtonComponent from '../../Components/ButtonComponent';
import { mapStyle } from '../../utils/constants/MapStyle';
import { getAllTravelDetails } from '../../utils/googlePlaceApi';
import { getBundleId } from 'react-native-device-info';
import { appIds } from '../../utils/constants/DynamicAppKeys';

var ACTION_TIMER = 1500;
var COLORS = ['#8FEE90', '#27A468'];
var _value = 0;
export default function TaskDetail({ route, navigation }) {
  let taskDetail = route?.params?.data?.item;
  let paramData = route?.params?.data
  let fromHistory = route?.params?.data?.fromHistory;
  const mapRef = useRef();
  const { userData } = useSelector(state => state?.auth);
  const { clientInfo, defaultLanguage } = useSelector(state => state?.initBoot);
  const styles = stylesFunc({ defaultLanguage });
  const commonStyles = commonStylesFunc({ fontFamily });

  const [state, setState] = useState({
    vendors: {},
    isLoading: false,
    region: {
      latitude: Number(taskDetail?.location?.latitude),
      longitude: Number(taskDetail?.location?.longitude),
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    coordinate: {
      latitude: Number(taskDetail?.location?.latitude),
      longitude: Number(taskDetail?.location?.longitude),
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    textComplete: '',
    pressAction: new Animated.Value(0),
    buttonWidth: 0,
    buttonHeight: 0,
    taskStatus: taskDetail?.task_status ? Number(taskDetail?.task_status) : '',
    buttonPressComplete: 0,
    buttonText: '',
    taskProofArray: [
      {
        id: 1,
        title: strings.SIGNATURE,
        imagePath: imagePath.signature,
        imagePathActive: imagePath.signatureBlue,
        type: 'signature',
      },
      {
        id: 2,
        title: strings.PHOTO,
        imagePath: imagePath.photoInactive,
        imagePathActive: imagePath.photoBlue,
        type: 'photo',
      },
      {
        id: 3,
        title: strings.NOTES,
        imagePath: imagePath.notes,
        imagePathActive: imagePath.notesBlue,
        type: 'notes',
      },
      {
        id: 4,
        title: strings.QRCODE,
        imagePath: imagePath.codeInactive,
        imagePathActive: imagePath.codeActive,
        type: 'QR',
      },
      {
        id: 5,
        title: strings.FACEDETECTION,
        imagePath: imagePath.faceInactive,
        imagePathActive: imagePath.faceActive,
        type: 'face',
      },
      {
        id: 6,
        title: 'QR Code',
        imagePath: imagePath.codeInactive,
        imagePathActive: imagePath.codeActive,
        type: 'qrCode',
      },
    ],
    updatedProofArray: [],
    findDataToCheck: null,
    productAllInsrucations: [],
    apiData: null,
    cancelRequestExit: null,
    totalTravelData: null,
  });

  const {
    cancelRequestExit,
    vendors,
    findDataToCheck,
    updatedProofArray,
    taskProofArray,
    taskStatus,
    isLoading,
    region,
    coordinate,
    textComplete,
    pressAction,
    buttonWidth,
    buttonHeight,
    buttonPressComplete,
    buttonText,
    productAllInsrucations,
    apiData,
    totalTravelData,
  } = state;
  const updateState = data => setState(state => ({ ...state, ...data }));

  useEffect(() => {
    if (userData?.task_proof) {
      const findDataToCheck = userData?.task_proof.find(
        x => x?.id == taskDetail?.task_type_id,
      );
      updateState({
        findDataToCheck: findDataToCheck,
      });
      let newArray = cloneDeep(taskProofArray);
      if (findDataToCheck) {
        updateState({
          updatedProofArray: newArray
            .map(i => {
              if (
                (i?.type == 'signature' && findDataToCheck?.signature) ||
                (i?.type == 'photo' && findDataToCheck?.image) ||
                (i?.type == 'notes' && findDataToCheck?.note) ||
                (i?.type == 'QR' && findDataToCheck?.barcode) ||
                (i?.type == 'face' && findDataToCheck?.face) ||
                (i?.type == 'qrCode' && findDataToCheck?.qrcode)
              ) {
                return i;
              }
            })
            .filter(x => x != null || x != undefined),
        });
      }
    }
  }, [taskDetail, userData]);

  useEffect(() => {
    updateState({ taskStatus: Number(taskDetail?.task_status) });
  }, [taskDetail?.tasktype.name]);

  useEffect(() => {
    getStatusName(taskStatus);
  }, [taskStatus]);

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };
  const moveToSameScreen = (screenName, data) => () => {
    navigation.push(screenName, { data });
  };
  //Error handling in api
  const errorMethod = error => {
    updateState({ isLoading: false, isRefreshing: false, isLoading: false });
    showError(error?.message || error?.error);
  };

  const _onRegionChange = region => {
    updateState({ region: region });
  };

  useEffect(() => {
    pressAction.addListener(v => (_value = v.value));
  });

  const handlePressIn = () => {
    ACTION_TIMER = 1500;
    Animated.timing(pressAction, {
      duration: ACTION_TIMER,
      toValue: 1,
      useNativeDriver: false,
    }).start(animationActionComplete);
  };

  const handlePressOut = () => {
    if (buttonPressComplete == 1) {
      Animated.timing(pressAction, {
        duration: _value * ACTION_TIMER,
        toValue: 0,
        useNativeDriver: false,
      }).stop();
    } else {
      Animated.timing(pressAction, {
        duration: _value * ACTION_TIMER,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  };
  const animationActionComplete = () => {
    // alert('1234');
    var message = '';
    if (_value === 1) {
      updateState({ buttonPressComplete: 1 });
      message = 'You held it long enough to fire the action!';
    } else {
      updateState({ buttonPressComplete: 0 });
    }
  };

  const getButtonWidthLayout = e => {
    updateState({
      buttonWidth: e.nativeEvent.layout.width,
      buttonHeight: e.nativeEvent.layout.height,
    });
  };

  useEffect(() => {
    if (buttonPressComplete) {
      updateTaskStatus();
    }
  }, [buttonPressComplete]);

  const new_dispatch_traking_url = () => {
    if (
      taskDetail?.order?.call_back_url?.includes(
        '/dispatch-order-status-update/',
      )
    ) {
      return (taskDetail?.order?.call_back_url).replace(
        '/dispatch-order-status-update/',
        '/dispatch-order-status-update-details/',
      );
    } else if (
      taskDetail?.order?.call_back_url?.includes('/dispatch-pickup-delivery/')
    ) {
      return (taskDetail?.order?.call_back_url).replace(
        '/dispatch-pickup-delivery/',
        '/dispatch-order-status-update-details/',
      );
    }
  };

  const checkCallBackUrlForShowOrderDeatils = () => {
    return taskDetail?.order?.call_back_url?.includes(
      '/dispatch-order-status-update/',
    );
  };

  useEffect(() => {
    if (new_dispatch_traking_url()) {
      updateState({
        isLoading: true,
      });
      _getproductUpdateDetails();
    }
    if (fromHistory) {
      if (
        taskDetail?.tasktype?.name == 'Drop' &&
        taskDetail?.order?.task?.length >= 1 &&
        taskDetail?.order?.task[0]?.location?.address &&
        taskDetail?.order?.task[1]?.location?.address
      ) {
        getAllMovingDetails([
          { pickupAddress: taskDetail?.order?.task[0]?.location?.address },
          { dropAddress: taskDetail?.order?.task[1]?.location?.address },
        ]);
      }
    }
  }, []);

  const getAllMovingDetails = data => {
    getAllTravelDetails(data)
      .then(res => {
        console.log(res, 'response +++++++++++');
        updateState({
          totalTravelData: res?.rows[0]?.elements[0],
        });
      })
      .catch(error => {
        console.log(error, 'error error error');
      });
  };
  console.log(taskDetail, 'taskDetail>>>>>>>>>>>>>>>>>>')
  const _getproductUpdateDetails = () => {
    actions
      .getProductUpdateDetails(new_dispatch_traking_url(), {})
      .then(res => {
        console.log(res, 'all response after hit order api');
        updateState({
          vendors: res?.data?.vendors[0]?.vendor,
          apiData: res.data,
          cancelRequestExit: res?.data?.vendors[0]?.cancel_request,
        });

        const productAllInsrucations = res?.data?.vendors.map((item, index) => {
          return item?.products?.map((item, index) => {
            return item?.user_product_order_form;
          });
        });

        updateState({
          isLoading: false,
          productAllInsrucations: JSON.parse(productAllInsrucations),
        });
      })
      .catch(error =>
        updateState({
          isLoading: false,
        }),
      );
  };

  const _onPressTaskDetails = item => {
    moveToNewScreen(navigationStrings.ORDERDETAIL, {
      item: taskDetail?.order?.call_back_url,
      taskDetail: taskDetail,
      apiData: apiData,
    })();
  };

  const mapView = () => {
    return (
      <MapView
        ref={mapRef}
        // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={region}
        initialRegion={region}
        customMapStyle={mapStyle}
        onRegionChangeComplete={_onRegionChange}>
        <MapView.Marker
          tracksViewChanges={false}
          key={`coordinate_${taskDetail?.id}`}
          image={imagePath.pinRed}
          coordinate={{
            latitude: Number(taskDetail?.location?.latitude),
            longitude: Number(taskDetail?.location?.longitude),
          }}></MapView.Marker>
      </MapView>
    );
  };

  //get BackGroundColor
  const getBackGroudColor = name => {
    switch (name) {
      case 'Pickup':
        return getColorCodeWithOpactiyNumber(colors.circularBlue.substr(1), 50);
        break;
      case 'Drop':
        return getColorCodeWithOpactiyNumber(
          colors.circularOrnage.substr(1),
          50,
        );
        break;
      default:
        return getColorCodeWithOpactiyNumber(colors.circularRed.substr(1), 50);
        break;
    }
  };

  //get Text color
  const getTextColor = name => {
    switch (name) {
      case 'Pickup':
        return colors.circularBlue;
        break;
      case 'Drop':
        return colors.circularOrnage;
        break;
      default:
        return colors.circularRed;
        break;
    }
  };

  const getProgressStyles = () => {
    var width = pressAction.interpolate({
      inputRange: [0, 1],
      outputRange: [0, buttonWidth],
    });
    var bgColor = pressAction.interpolate({
      inputRange: [0, 1],
      outputRange: COLORS,
    });

    return {
      width: width,
      height: buttonHeight,
      backgroundColor: bgColor,
    };
  };

  const getUpdatedStatus = () => {
    switch (taskStatus) {
      case 1:
        return 2;

      case 2:
        return 3;

      case 3:
        return 4;
        break;
      case 4:
        return 2;
        break;
      default:
        break;
    }
  };

  const updateTaskStatus = () => {
    let data = {};
    data['task_status'] = getUpdatedStatus();
    data['task_id'] = taskDetail?.id;

    console.log(data, '<==sending data updateTask');

    updateState({ isLoading: true });
    actions
      .updateTask(data, {
        client: clientInfo?.database_name,
        language: defaultLanguage?.value ? defaultLanguage?.value : 'en',
      })
      .then(res => {
        console.log(res, '<==res updateTask');
        updateState({ isLoading: false });
        if (res?.data) {
          ACTION_TIMER = 100;
          updateState({
            buttonPressComplete: 0,
            taskStatus: Number(res?.data?.task_status),
          });
          // getStatusName(taskStatus)
          setTimeout(async () => {
            updateState({
              isLoading: false,
            });
          }, 2000);
        }
      })
      .catch(errorMethod);
  };

  useEffect(() => {
    handlePressOut();
  }, [buttonPressComplete]);

  const openMaps = () => {
    showActionSheet();
  };

  const getStatusName = taskStatus => {
    console.log(taskStatus, 'getStatusName');
    switch (taskStatus) {
      case 1:
        updateState({ buttonText: (getBundleId() == appIds.mrVeloz && defaultLanguage?.value == 'es') ? strings.HOLDTOSTART_MRVELOZ : strings.HOLDTOSTART });
        break;
      case 2:
        updateState({ buttonText: (getBundleId() == appIds.mrVeloz && defaultLanguage?.value == 'es') ? strings.HOLDTOARRIVE_MRVELOZ : strings.HOLDTOARRIVE });
        break;
      case 3:
        updateState({
          buttonText:
            taskDetail?.tasktype?.name == "Drop"
              ? (getBundleId() == appIds.mrVeloz && defaultLanguage?.value == 'es') ? strings.HOLDTOCOMPLETE_MRVELOZ : strings.HOLDTOCOMPLETE
              : (getBundleId() == appIds.mrVeloz && defaultLanguage?.value == 'es') ? strings.HOLDTOPICK_MRVELOZ : strings.HOLDTOPICK,
        });
        break;
      case 4:
        updateState({
          buttonText:
            taskDetail?.tasktype?.name == "Drop"
              ? (getBundleId() == appIds.mrVeloz && defaultLanguage?.value == 'es') ? strings.HOLDTOCOMPLETE_MRVELOZ : strings.HOLDTOCOMPLETE
              : (getBundleId() == appIds.mrVeloz && defaultLanguage?.value == 'es') ? strings.HOLDTOPICK_MRVELOZ : strings.HOLDTOPICK,
        });
        break;
      default:
        break;
    }
  };

  const redirectNextScreen = res => {
    updateState({ isLoading: false });
    moveToNewScreen(navigationStrings.TASKCOMPLETEDOCUMENT, {
      taskDetail: taskDetail,
      updatedProofArray: updatedProofArray,
      findDataToCheck: findDataToCheck,
      otpEnabled: res?.data?.otpEnabled,
      otpRequired: res?.data?.otpRequired,
      otp: res?.data?.otp,
    })();
  };

  const redirectToDoneScreen = () => {
    ACTION_TIMER = 1500;
    Animated.timing(pressAction, {
      duration: ACTION_TIMER,
      toValue: 1,
      useNativeDriver: false,
    }).start(() => {
      var message = '';
      if (_value === 1) {
        updateState({ buttonPressComplete: 1 });
        message = 'You held it long enough to fire the action!';
        updateState({ isLoading: true });
        let data = {};
        data['task_id'] = taskDetail?.id;
        console.log(data, 'data');
        actions
          .sendOtpToDriver(data, {
            client: clientInfo?.database_name,
          })
          .then(res => {
            console.log(res, '<===res sendOtpToDriver ');
            if (res?.status == 200) {
              if (updatedProofArray.length) {
                redirectNextScreen(res);
              } else {
                if (res?.data?.otpEnabled) {
                  redirectNextScreen(res);
                } else {
                  let formdata = new FormData();
                  formdata.append('task_status', 4);
                  formdata.append('task_id', taskDetail?.id);
                  completeTask(formdata);
                }
              }
            }
          })
          .catch(errorMethod);
      } else {
        updateState({ buttonPressComplete: 0 });
      }
    });
  };

  const completeTask = formdata => {
    updateState({ isLoading: true });
    actions
      .updateTask(formdata, {
        client: clientInfo?.database_name,
        ContentType: 'multipart/form-data',
      })
      .then(res => {
        console.log(res, '<===res updateTask');
        updateState({ isLoading: false });
        if (res?.data?.nextTask?.length == 0 || res?.data?.nextTask == null) {
          if (res?.data) {
            updateState({
              isLoading: false,
            });

            navigation.navigate(navigationStrings.DASHBOARD);
          }
        } else {
          updateState({
            isLoading: false,
          });
          moveToSameScreen(navigationStrings.TASKDETAIL, {
            item: res?.data?.nextTask[0],
          })();
        }
      })
      .catch(errorMethod);
  };

  const buttonView = () => {
    if (fromHistory) {
      return (
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.button,
                {
                  backgroundColor:
                    taskDetail?.task_status == '4' ? '#27A468' : colors.redB,
                },
              ]}>
              <Text style={styles.text}>
                {taskDetail?.task_status == '4'
                  ? strings.TASKCOMPLTED
                  : strings.TASKCANCEL}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }
    return (cancelRequestExit || paramData?.is_from_calendar) ? null : (
      // return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPressIn={taskStatus == 3 ? redirectToDoneScreen : handlePressIn}
          onPressOut={handlePressOut}>
          <View style={styles.button} onLayout={getButtonWidthLayout}>
            <Animated.View style={[styles.bgFill, getProgressStyles()]} />
            <Text style={styles.text}>{buttonText}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const getDate = date => {
    const local = moment.utc(date).local().format('DD MMM YYYY hh:mm:a');
    return local;
  };

  const _onPressEditOrder = () => {
    moveToNewScreen(navigationStrings.CART, {
      // cartData: res?.data,
      taskDetail: taskDetail,
      apiData: apiData,
    })();
  };

  const onWhatsapp = async () => {
    let url = `whatsapp://send?phone= ${taskDetail?.order?.customer?.dial_code}${taskDetail?.order?.customer?.phone_number}`;
    console.log(url, 'caddaibsdu');
    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened successfully ' + data); //<---Success
      })
      .catch(() => {
        alert('Make sure WhatsApp installed on your device'); //<---Error
      });
    if (link) {
      Linking.canOpenURL(link)
        .then(supported => {
          if (!supported) {
            Alert.alert('Please install Whatsapp to send direct message.');
          } else {
            return Linking.openURL(link);
          }
        })
        .catch(err => console.error('An error occurred', err));
    } else {
      console.log('sendWhatsAppMessage -----> ', 'message link is undefined');
    }
  };

  const createRoom = async item => {
    try {
      const apiData = {
        sub_domain: '192.168.101.88',
        client_id: String(clientInfo?.client_db_id),
        db_name: taskDetail?.order?.dbname,
        user_id: String(userData?.id),
        type: 'agent_to_user',
        vendor_order_id: String(item?.order?.order_vendor_id),
        vendor_id: String(item?.order?.vendor_id),
        order_id: String(item?.order?.sync_order_id),
        order_number: String(item?.order?.order_number),
        order_user_id: String(item?.order?.customer?.sync_customer_id),
        agent_id: String(item?.order?.driver_id),
        agent_db: clientInfo?.database_name,
      };
      console.log('sending api data', apiData);

      updateState({ isLoading: true });
      const res = await actions.onStartChat(apiData, {
        client: clientInfo?.database_name,
        language: defaultLanguage?.value ? defaultLanguage?.value : 'en',
      });
      console.log('start chat res', res);
      updateState({ isLoading: false });
      if (!!res?.roomData) {
        onChat(res.roomData);
      }
    } catch (error) {
      console.log('error raised in start chat api', error);
      showError(error?.message);
      updateState({ isLoading: false });
    }
  };
  const onChat = item => {
    console.log('item+++', item);
    navigation.navigate(navigationStrings.CHAT_SCREEN, { data: item });
  };
  const _onDriverTracking = () => {
    navigation.navigate(navigationStrings.DRIVER_TRACING, {
      taskDetail: taskDetail,
    });
  };

  const taskDetailView = () => {
    return (
      <ScrollView
        style={{ marginTop: moderateScale(10) }}
        showsVerticalScrollIndicator={false}>
        {/* User Detail  */}
        <View style={{}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: moderateScaleVertical(12),
            }}>
            <View
              style={{
                ...styles.statusView,
                backgroundColor: colors.greyLight3,
              }}>
              <Text
                style={{
                  ...styles.taskNameTextstyle,
                  color: colors.black,
                }}>
                {`${(taskDetail?.tasktype?.name).toLowerCase() == 'drop'
                    ? strings.DROP
                    : strings.PICKUP
                  }`}
              </Text>
            </View>

            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {!!(
                  !fromHistory &&
                  userData &&
                  userData?.client_preference?.is_cancel_order_driver &&
                  checkCallBackUrlForShowOrderDeatils()
                ) && (
                    <TouchableOpacity
                      onPress={cancelOrder}
                      style={{
                        ...styles.statusView,
                        backgroundColor: colors.themeColor,
                        borderRadius: moderateScale(5),
                        // backgroundColor: getBackGroudColor(taskDetail?.tasktype?.name),
                      }}>
                      <Text
                        style={{
                          ...styles.taskNameTextstyle,
                          color: colors.white,
                          opacity: 1,
                        }}>
                        {strings.CANCELORDER}
                      </Text>
                    </TouchableOpacity>
                  )}

                {/* {taskDetail?.barcode && (
                  <View style={{justifyContent: 'center'}}>
                    <Image source={imagePath?.barcode2} />
                  </View>
                )} */}
              </View>

              {!!(
                !fromHistory &&
                userData &&
                userData?.client_preference?.is_cancel_order_driver &&
                checkCallBackUrlForShowOrderDeatils()
              ) && (
                  <View>
                    <Text
                      style={{
                        color: colors.black,
                        fontFamily: fontFamily?.bold,
                      }}>
                      {cancelRequestExit && cancelRequestExit != ''
                        ? `Status: ${cancelRequestExit.status}`
                        : ''}
                    </Text>
                  </View>
                )}
            </View>
          </View>
          <Text style={styles.taskLable}>
            {strings.TASKDESCRIPTION.toUpperCase()}
          </Text>
          {/* Phone and email view */}
          {(taskDetail?.tasktype?.name).toLowerCase() == 'drop' ? (
            <View
              style={{
                backgroundColor: colors.transactionHistoryBg,
                padding: moderateScale(8),
              }}>
              {!!(
                taskDetail?.order?.Recipient_email ||
                taskDetail?.order?.recipient_phone
              ) && (
                  <View
                    style={{
                      opacity: 0.5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {!!taskDetail?.order?.Recipient_email && (
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            `mailto:${taskDetail?.order?.Recipient_email}`,
                          )
                        }
                        style={{
                          flexDirection: 'row',
                          marginTop: moderateScale(10),
                          alignItems: 'center',
                          flex: 0.65,
                        }}>
                        <Image
                          source={imagePath.mail2}
                          style={{ marginRight: moderateScale(5) }}
                        />
                        <Text style={styles.emailAndPhone}>
                          {taskDetail?.order?.Recipient_email}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {!!taskDetail?.location?.phone_number && (
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            `tel:${taskDetail?.order?.recipient_phone}`,
                          )
                        }
                        style={{
                          flexDirection: 'row',
                          marginTop: moderateScale(10),
                          alignItems: 'center',
                          flex: 0.35,
                        }}>
                        <Image
                          source={imagePath.phone2}
                          style={{ marginRight: moderateScale(5) }}
                        />
                        <Text style={styles.emailAndPhone}>
                          {taskDetail?.location?.phone_number}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

              {/* location and address */}
              {!!taskDetail?.location?.address && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: moderateScale(10),
                    alignItems: 'center',
                  }}>
                  <Image
                    source={imagePath?.location2}
                    style={{ marginRight: moderateScale(5) }}
                  />
                  <Text numberOfLines={2} style={styles.emailAndPhone}>
                    {taskDetail?.location?.address}
                  </Text>
                </View>
              )}
              {/* Quantity and post code */}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: moderateScale(10),
                  justifyContent: 'space-between',
                }}>
                {!!taskDetail?.quantity && (
                  <View
                    style={{
                      opacity: 0.5,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={imagePath?.quantity}
                      style={{ marginRight: moderateScale(5) }}
                    />
                    <Text style={styles.emailAndPhone} numberOfLines={1}>
                      {taskDetail?.quantity}
                    </Text>
                  </View>
                )}

                {!!taskDetail?.location?.post_code && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      opacity: 0.5,
                    }}>
                    <Image
                      source={imagePath?.postal}
                      style={{ marginRight: moderateScale(5) }}
                    />
                    <Text style={styles.emailAndPhone} numberOfLines={1}>
                      {taskDetail?.location?.post_code}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: colors.transactionHistoryBg,
                padding: moderateScale(8),
              }}>
              {!!taskDetail?.order?.task_description && (
                <View
                  style={{ flexDirection: 'row', marginTop: moderateScale(2) }}>
                  <View>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.emailAndPhone,
                        { marginTop: moderateScale(5) },
                      ]}>
                      {!!taskDetail?.order?.task_description && (
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: moderateScale(2),
                          }}>
                          <View>
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.emailAndPhone,
                                { marginTop: moderateScale(5) },
                              ]}>
                              {taskDetail?.order?.task_description}
                            </Text>
                          </View>
                        </View>
                      )}
                    </Text>
                  </View>
                </View>
              )}
              {!!(
                (
                  taskDetail?.order?.Recipient_email ||
                  taskDetail?.order?.recipient_phone
                )
                // vendors?.email || vendors?.phone_no
              ) && (
                  <View
                    style={{
                      // opacity: 0.5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {!!taskDetail?.order?.Recipient_email && (
                      //  !! vendors?.email
                      <TouchableOpacity
                        onPress={
                          () =>
                            Linking.openURL(
                              `mailto:${taskDetail?.order?.Recipient_email}`,
                            )
                          // Linking.openURL(`mailto:${vendors?.email}`)
                        }
                        style={{
                          flexDirection: 'row',
                          marginTop: moderateScale(10),
                          alignItems: 'center',
                          flex: 0.7,
                        }}>
                        <Image
                          source={imagePath.mail2}
                          style={{ marginRight: moderateScale(5) }}
                        />
                        {!!taskDetail?.order?.task_description ? (
                          <Text style={styles.emailAndPhone}>
                            {vendors?.email}
                          </Text>
                        ) : (
                          <Text style={styles.emailAndPhone}>
                            {taskDetail?.order?.Recipient_email}
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                    {!!taskDetail?.order?.recipient_phone && (
                      // !!vendors?.phone_no

                      <TouchableOpacity
                        onPress={
                          () =>
                            Linking.openURL(
                              `tel:${taskDetail?.order?.recipient_phone}`,
                            )
                        }
                        style={{
                          flexDirection: 'row',
                          marginTop: moderateScale(10),
                          alignItems: 'center',
                          flex: 0.3,
                        }}>
                        <Image
                          source={imagePath.phone2}
                          style={{ marginRight: moderateScale(5) }}
                        />
                        {!!taskDetail?.order?.task_description ? (
                          <Text style={styles.emailAndPhone}>
                            {vendors?.phone_no}
                          </Text>
                        ) : (
                          <Text style={styles.emailAndPhone}>
                            {taskDetail?.order?.recipient_phone}
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                )}

              {/* location and address */}
              {!!taskDetail?.location?.address && (
                // !!vendors?.address
                <View
                  style={{
                    // opacity: 0.5,
                    flexDirection: 'row',
                    marginTop: moderateScale(10),
                    alignItems: 'center',
                  }}>
                  <Image
                    source={imagePath?.location2}
                    style={{ marginRight: moderateScale(5) }}
                  />
                  {!!taskDetail?.order?.task_description ? (
                    <Text style={styles.emailAndPhone}>{vendors?.address}</Text>
                  ) : (
                    <Text style={styles.emailAndPhone}>
                      {taskDetail?.location?.address}
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}
          {/* Quantity and post code */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: moderateScale(10),
              justifyContent: 'space-between',
            }}>
            {!!taskDetail?.quantity && (
              <View
                style={{
                  opacity: 0.5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={imagePath?.quantity}
                  style={{ marginRight: moderateScale(5) }}
                />
                <Text style={styles.emailAndPhone} numberOfLines={1}>
                  {taskDetail?.quantity}
                </Text>
              </View>
            )}

            {!!taskDetail?.location?.post_code && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  opacity: 0.5,
                }}>
                <Image
                  source={imagePath?.postal}
                  style={{ marginRight: moderateScale(5) }}
                />
                <Text style={styles.emailAndPhone} numberOfLines={1}>
                  {taskDetail?.location?.post_code}
                </Text>
              </View>
            )}
          </View>

          {/* Button  component */}
          <View style={{ marginVertical: moderateScale(10) }}>
            <ButtonComponent
              buttonStyle={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: moderateScale(10),
                borderRadius: moderateScale(5),
                marginTop: moderateScale(10),
              }}
              onPress={Platform?.OS == 'android' ? openGoogleMap : openMaps}
              buttonTitle={strings.NAVIGATE}
              imagevalue={imagePath?.navigate}
              imageStyle={{ marginHorizontal: moderateScale(2) }}
            />
            {false && (
              <ButtonComponent
                buttonStyle={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: moderateScale(10),
                  borderRadius: moderateScale(5),
                  marginTop: moderateScale(20),
                  backgroundColor: colors.green,
                }}
                onPress={_onDriverTracking}
                buttonTitle={' IN APP MAP'}
                imagevalue={imagePath?.navigate}
                imageStyle={{ marginHorizontal: moderateScale(2) }}
              />
            )}
          </View>
          {checkCallBackUrlForShowOrderDeatils() && (
            <View style={{ marginVertical: moderateScale(10) }}>
              <ButtonComponent
                buttonStyle={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: moderateScale(10),
                  borderRadius: moderateScale(5),
                  marginTop: moderateScale(10),
                  backgroundColor: colors.green,
                }}
                onPress={_onPressTaskDetails}
                buttonTitle={strings.ORDERDETAILS}
                // imagevalue={imagePath?.navigate}
                imageStyle={{ marginHorizontal: moderateScale(2) }}
              />
            </View>
          )}
        </View>

        {/* Task Detail Text */}
        <View
          style={{
            ...styles.taskDetailView,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.taskText}>
            {strings.TASKDETAIL.toUpperCase()}
          </Text>
        </View>

        {/* Task Detail View */}

        <View
          style={{
            padding: moderateScale(10),
            backgroundColor: colors.lightSkyE,
          }}>
          {taskDetail?.order?.customer?.name && (
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: fontFamily.bold }}>
                {strings.TRACKINGID}:-{taskDetail?.order?.unique_id}
              </Text>
            </View>
          )}

          {/* Phone and email view customer*/}
          {!!(
            taskDetail?.order?.customer?.email ||
            taskDetail?.order?.customer?.phone_number
          ) && (
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {!!taskDetail?.order?.customer?.email && (
                  <TouchableOpacity
                    onPress={() =>
                      // Communications.email(
                      //   [
                      //     taskDetail?.order?.customer?.email,
                      //     taskDetail?.order?.customer?.email,
                      //   ],
                      //   null,
                      //   null,
                      //   '',
                      //   '',
                      // )

                      Linking.openURL(
                        `mailto:${taskDetail?.order?.customer?.email
                        }?subject=${''}&body=${''}`,
                      )
                    }
                    style={{
                      flex: 0.5,
                      flexDirection: 'row',
                      marginTop: moderateScale(10),
                      alignItems: 'center',
                    }}>
                    <Image
                      source={imagePath.mail2}
                      style={{ marginRight: moderateScale(5) }}
                    />
                    <Text numberOfLines={2} style={styles.emailAndPhone}>
                      {taskDetail?.order?.customer?.email}
                    </Text>
                  </TouchableOpacity>
                )}

                {!!taskDetail?.order?.customer?.phone_number && (
                  <View
                    style={{
                      flex: 0.4,
                      flexDirection: 'row',
                      marginTop: moderateScale(10),
                      alignItems: 'center',
                      justifyContent: 'space-around',
                    }}>
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: moderateScale(10),
                      }}
                      onPress={onWhatsapp}>
                      <Image source={imagePath.whatsapp} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() =>
                        Communications.phonecall(
                          taskDetail?.order?.customer?.phone_number,
                          true,
                        )
                      }>
                      <Image source={imagePath.phone2} />
                    </TouchableOpacity>

                    {!!clientInfo?.socket_url ? (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: moderateScale(5),
                        }}
                        onPress={() => createRoom(taskDetail)}>
                        <Image source={imagePath.icStartChat} />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                )}
              </View>
            )}

          {/* seperator */}
          <View
            style={{
              ...commonStyles.headerTopLine,
              marginVertical: moderateScale(10),
            }}
          />

          {/* Time and cash to be collected */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 0.6 }}>
              <Text style={styles.taskLable}>
                {strings.TIMINGS.toUpperCase()}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.emailAndPhone, { marginTop: moderateScale(5) }]}>
                {getDate(taskDetail?.order?.order_time)}
              </Text>
            </View>
            <Text style={styles.taskLable}>{strings.NAME}</Text>

            {!!Number(taskDetail?.order?.cash_to_be_collected) > 0 && (
              <View style={{ flex: 0.4 }}>
                <Text style={styles.taskLable}>
                  {strings.CASHTOBECOLLECTED.toUpperCase()}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.emailAndPhone, { marginTop: moderateScale(5) }]}>
                  {Number(taskDetail?.order?.cash_to_be_collected).toFixed(2)}
                </Text>
              </View>
            )}
          </View>

          {/* Images */}
          {!!taskDetail?.order?.task_images &&
            taskDetail?.order?.task_images.length >= 1 && (
              <View
                style={{ flexDirection: 'row', marginTop: moderateScale(15) }}>
                <View>
                  {taskDetail?.order?.task_images.length >= 1 && (
                    <Text style={styles.taskLable}>
                      {strings.IMAGES.toUpperCase()}
                    </Text>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: moderateScale(5),
                    }}>
                    {taskDetail?.order?.task_images.map((i, inx) => {
                      return (
                        <>
                          <Image
                            source={{
                              uri: i,
                            }}
                            style={{
                              marginRight: moderateScale(15),
                              zIndex: 100,
                              width: width / 5,
                              height: width / 5, //362 is actual height of image
                            }}
                          />
                        </>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}
          {productAllInsrucations?.length > 0 &&
            productAllInsrucations?.map((item, index) => {
              return (
                <View style={{ marginTop: moderateScaleVertical(10) }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.emailAndPhone,
                        {
                          marginTop: moderateScale(5),
                          fontFamily: fontFamily.bold,
                        },
                      ]}>
                      {`${strings.QUESTION} :`}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.emailAndPhone,
                        { marginTop: moderateScale(5) },
                      ]}>
                      {item?.question}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.emailAndPhone,
                        {
                          marginTop: moderateScale(5),
                          fontFamily: fontFamily.bold,
                        },
                      ]}>
                      {`${strings.ANSWER} :`}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.emailAndPhone,
                        { marginTop: moderateScale(5) },
                      ]}>
                      {item?.answer}
                    </Text>
                  </View>
                </View>
              );
            })}

          {!!apiData && apiData?.comment_for_vendor ? (
            <View style={{ flexDirection: 'row', marginTop: moderateScale(15) }}>
              <View>
                <Text style={styles.taskLable}>
                  {strings.SPECIAL_INSTRUCTIONS.toUpperCase()}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.emailAndPhone, { marginTop: moderateScale(5) }]}>
                  {apiData?.comment_for_vendor}
                </Text>
              </View>
            </View>
          ) : null}
          {fromHistory && totalTravelData && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: moderateScaleVertical(5),
              }}>
              <View>
                <Text style={styles.distanceTimeTitleTextStyle}>
                  {strings.TOTALDISTANCE}
                </Text>
                <Text style={styles.distanceTimeTextStyle}>
                  {Number(
                    totalTravelData?.distance?.text.substring(
                      0,
                      totalTravelData?.distance?.text.length - 2,
                    ) * 1.609344,
                  ).toFixed(2)}{' '}
                  KM
                </Text>
              </View>
              <View>
                <Text style={styles.distanceTimeTitleTextStyle}>
                  {strings.TOTALTIME}
                </Text>
                <Text style={styles.distanceTimeTextStyle}>
                  {totalTravelData?.duration?.text}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };
  const cancelTask = () => {
    Alert.alert('', strings.CANCELMESSAGE, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: strings.OK,
        onPress: () =>
          moveToNewScreen(navigationStrings.TASKCANCEL, taskDetail)(),
      },
    ]);
  };

  const cancelOrder = () => {
    if (cancelRequestExit) {
      showSuccess('Your cancle request already submitted.');
      return;
    }
    Alert.alert('', strings.CANCELORDERMESSAGE, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: strings.OK,
        onPress: () =>
          moveToNewScreen(navigationStrings.ORDERCANCEL, taskDetail)(),
      },
    ]);
  };

  //this function use for open actionsheet
  let actionSheet = useRef();
  const showActionSheet = () => {
    actionSheet.current.show();
  };

  /*****Apple cordinate and call apple map */
  const appleCoordinate = {
    latitude: Number(taskDetail?.location?.latitude),
    longitude: Number(taskDetail?.location?.longitude),
    end: `${taskDetail?.location?.address}`,
    start: 'My Location',
    provider: 'apple',
    //travelType: 'drive',
  };
  // const openAppleMap = createOpenLink(appleCoordinate);

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.default.getCurrentPosition(
        position => {
          console.log(position, 'position');
          resolve(position);
        },
        error => reject(error.message),
        { enableHighAccuracy: true, timeout: 20000 },
      );
    });
  };

  // const openAppleMap = async () => {
  //   console.log('checking location my location saddi location >>>');
  //   getCurrentPosition()
  //     .then(res => {
  //       console.log(
  //         'checking location my location saddi location >>>',
  //         res.coords,
  //       );

  //       const link = createMapLink({
  //         provider: 'apple',
  //         start: 'My Location',
  //         end: `${taskDetail?.location?.address}`,
  //       });
  //       createOpenLink({query: link});
  //     })
  //     .catch(err => {
  //       console.log('checking location my location saddi location >>>', err);
  //     });
  // };

  /**** */

  /*****Google cordinate and call apple map */
  const googleCoordinate = () => {
    // latitude: Number(taskDetail?.location?.latitude),
    // longitude: Number(taskDetail?.location?.longitude),
    // provider: 'google',
    // zoom: 10,
    // end: `${taskDetail?.location?.address}`,
    // start: 'My Location',
    // travelType: 'drive',
  };

  const openGoogleMap = () => {
    var url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${taskDetail?.location?.latitude},${taskDetail?.location?.longitude}`;

    Linking.canOpenURL(url)
      .then(supported => {
        console.log(supported, 'supportedsupported');
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };



  /**** */

  // this funtion use for camera handle
  const onPressMapChoice = index => {
    if (index == 0) {
      const url = 'maps:' + '?q=' + taskDetail?.location?.address;
      Linking.openURL(url);
    }
    if (index == 1) {
      openGoogleMap();
    }
  };

  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoading={isLoading}
      source={loaderOne}>
      <Header
        headerStyle={{ backgroundColor: colors.white }}
        leftIconStyle={{ tintColor: colors.themeColor }}
        onPressLeft={paramData?.is_from_calendar ? () => navigation?.goBack() : moveToNewScreen(navigationStrings?.DASHBOARD)}

        // hideRight={true}
        // onPressLeft={()=>navigation.goBack()}
        centerTitle={`${strings.TASK} #${taskDetail?.id}`}
        customRight={() =>
          !!(
            taskStatus == 1 &&
            !fromHistory &&
            taskDetail?.tasktype?.id != 2
          ) && (
            <TouchableOpacity onPress={cancelTask}>
              <Text
                style={{
                  color: colors.textGrey,
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(10),
                }}>
                {strings.CANCEL}
              </Text>
            </TouchableOpacity>
          )
        }
      />
      {/* <View style={{...commonStyles.headerTopLine}} /> */}

      <ScrollView showsVerticalScrollIndicator={false}>
        {mapView()}
        <View style={styles.mainContainer}>{taskDetailView()}</View>
        <View style={{ height: moderateScale(45) }} />
      </ScrollView>
      {buttonView()}
      <ActionSheet
        ref={actionSheet}
        // title={'Choose one option'}
        options={[
          strings.OPENINAPPLEMAPS,
          strings.OPENINGOOGLEMAPS,
          strings.CANCEL,
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={index => onPressMapChoice(index)}
      />
    </WrapperContainer>
  );
}
