//import liraries
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  I18nManager,
  TextInput,
  Keyboard,
  Linking,
} from 'react-native';
import MapView from 'react-native-maps';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {showError, showSuccess} from '../utils/helperFunctions';
import ModalView from './ShortCodeConfirmModal';
import moment from 'moment';
import {shortCodes} from '../utils/constants/DynamicAppKeys';
import {navigate} from '../navigation/NavigationService';
import navigationStrings from '../navigation/navigationStrings';
import {isEmpty} from 'lodash';
import {googlePlacesApi} from '../utils/googlePlaceApi';
import * as RNLocalize from 'react-native-localize';

const NotificationModal = () => {
  const [state, setState] = useState({
    pageActive: 1,
    acceptLoader: false,
    rejectLoader: false,
    selectedOrder: null,
    isRefreshing: false,
    region: null,
    notificationDropLocationsData: [],
    orderCost: null,
    totalDistance: null,
    taskId: null,
    orderData: {},
    customerData: {},
  });
  const {notificationData, currentLocation} = useSelector(state => state?.initBoot);
  const userData = useSelector(state => state?.auth?.userData);
  const clientInfo = useSelector(state => state?.initBoot?.clientInfo);
  const shortCode = useSelector(state => state?.initBoot?.shortCode);

  const {
    pageActive,
    region,
    acceptLoader,
    rejectLoader,
    selectedOrder,
    isRefreshing,
    notificationDropLocationsData,
    orderCost,
    totalDistance,
    taskId,
    orderData,
    customerData,
  } = state;

  const [dropLocation, setDropLocation] = useState('');
  const [searchLocationData, setSearchLocationData] = useState([]);
  const [userFocus, setUserFocus] = useState('');
  const [baseFare, setBaseFare] = useState(null);




  useEffect(() => {
    const data = notificationData?.notificationData?.data;
    if (data && data?.order_id) {
      getCustomNotificationData();
      if (data?.lat && data?.long) {
        if (data) {
          updateState({
            region: {
              latitude: Number(data?.lat),
              longitude: Number(data?.long),
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            },
          });
        }
      }
    }
  }, [notificationData?.notificationData?.data]);

  //update state
  const updateState = data => setState(state => ({...state, ...data}));

  const _onRegionChange = region => {
    updateState({region: region});
  };
  const getCustomNotificationData = () => {
    console.log(notificationData, 'notificationData');
    actions
      .getCustomNotificationPayload(`/${notificationData?.notificationData?.data?.order_id}`, {}, {shortCode: shortCode})
      .then(res => {
        updateState({
          notificationDropLocationsData: res?.tasks,
          orderCost: res?.order?.order_cost,
          totalDistance: res?.order?.actual_distance,
          taskId: res?.order?.unique_id,
          orderData: res?.order,
          customerData: res?.customer,
        });
      })
      .catch(error => console.log('error in notification Data', error));
  };

  const mapView = () => {
    let data = notificationData?.notificationData?.data;
    if (data && (data?.notificationType != 'UPDATED' && data?.notificationType != 'CANCELLED')) {
      return (
        <MapView
          //   provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{
            ...styles.map,
            height:
              data?.notificationType == 'Instant_Booking'
                ? width / 3
                : width / 2,
          }}
          region={region}
          initialRegion={region}
          //   customMapStyle={mapStyle}
          onRegionChangeComplete={_onRegionChange}>
          <MapView.Marker
            tracksViewChanges={false}
            key={data?.id}
            image={imagePath.pinRed}
            coordinate={{
              latitude: Number(data?.lat),
              longitude: Number(data?.long),
            }}></MapView.Marker>
        </MapView>
      );
    }
  };

  const getDate = date => {
    const local = moment.utc(date).local().format('DD MMM YYYY hh:mm:a');
    return local;
  };

  const onListAllAddress = ({item, index}) => {
    console.log(item, 'itemitem');
    if (item?.task_type_id == 2) {
      return (
        <View style={{flexDirection: 'row'}}>
          <View style={{marginHorizontal: moderateScale(10)}}>
            {renderDotContainer()}
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text
              numberOfLines={1}
              style={[
                styles.address,
                {
                  marginTop: moderateScaleVertical(28),
                },
              ]}>
              {item?.address}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{paddingHorizontal: moderateScale(30)}}>
          <Text numberOfLines={1} style={[styles.address]}>
            {item?.address}
          </Text>
        </View>
      );
    }
  };

  const renderDotContainer = () => {
    return (
      <>
        <View style={{height: 40, overflow: 'hidden', alignItems: 'center'}}>
          <View style={styles.dotContainerStyle} />
        </View>

        <Image
          style={{
            tintColor: colors.redB,
          }}
          source={imagePath.blackSquare}
        />
      </>
    );
  };

  const _onselectUserLocation = item => {
    setDropLocation(item);
    setSearchLocationData([]);
    Keyboard.dismiss();
  };

  const searchLocation = async (
    data,
    mapKey = userData?.client_preference?.map_key_1,
    curLatLng = `${currentLocation?.coords?.latitude}-${currentLocation?.coords?.longitude}`,
  ) => {
    var res = await googlePlacesApi(
      data,
      mapKey,
      curLatLng,
      RNLocalize.getCountry(),
    );

    console.log(res, 'resresresresres');

    if (res && !!res.results) {
      let arry = res.results.map((val, i) => {
        return {
          ...val,
          formatted_address: val?.formatted_address,
          name: val?.name,
        };
      });

      console.log(arry, 'arryarryarryarryarryarry');
      setSearchLocationData(arry);
    }
  };

  const onWhatsapp = async () => {
    let url = `whatsapp://send?phone= ${customerData?.dial_code}${customerData?.phone_number}`;
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

  const new_dispatch_push_request_rider_url = () => {
    if (orderData?.call_back_url?.includes('/dispatch-order-status-update/')) {
      return (orderData?.call_back_url).replace(
        '/dispatch-order-status-update/',
        '/dispatch/driver/bids/update/',
      );
    } else if (
      orderData?.call_back_url?.includes('/dispatch-pickup-delivery/')
    ) {
      return (orderData?.call_back_url).replace(
        '/dispatch-pickup-delivery/',
        '/dispatch/driver/bids/update/',
      );
    }
  };

  console.log(userData, 'userDatauserData');

  const _sendRequestToUser = () => {
    console.log(baseFare.length, !dropLocation?.formatted_address, 'baseFare');
    if (baseFare.length == 0 || !dropLocation?.formatted_address) {
      alert('Please enter all Details for submit request');
      return;
    }

    const taskArray = [
      {
        task_type_id: 1,
        address: notificationDropLocationsData[0]?.address,
        preAddress: notificationDropLocationsData[0]?.address,
        latitude: Number(notificationDropLocationsData[0]?.latitude),
        longitude: Number(notificationDropLocationsData[0]?.longitude),
      },
      {
        task_type_id: 2,
        address: dropLocation?.formatted_address,
        preAddress: dropLocation?.formatted_address,
        latitude: Number(dropLocation?.geometry?.location?.lat),
        longitude: Number(dropLocation?.geometry?.location?.lng),
      },
    ];
    const data = {
      tasks: taskArray,
      task_type: 'Instant_Booking',
      bid_price: baseFare,
      driver_id: userData?.id,
      driver_name: userData?.name,
      driver_image: userData?.image_url,
    };

    actions
      .submitDriverRequestForPush(new_dispatch_push_request_rider_url(), data)
      .then(res => {
        actions.isModalVisibleForAcceptReject({
          isModalVisibleForAcceptReject: false,
          notificationData: null,
        });
        setDropLocation('');
        alert(res?.message);
      })
      .catch(error => {
        showError(error?.message);
      });
  };

  const hideModal = () => {
    actions.isModalVisibleForAcceptReject({
      isModalVisibleForAcceptReject: false,
      notificationData: null,
    });
    setDropLocation('');
  };

  const showButtonComponent = type => {
    switch (type) {
      case 'AR':
        return (
          <View
            style={{
              borderRadius: 10,
              height: 40,
              flexDirection: 'row',
              alignSelf: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => aceptRejectTask(2)}
              style={styles.taskRejectButtonTextStyle}>
              <Text style={styles.text}>{strings.REJECT}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => aceptRejectTask(1)}
              style={styles.taskAcceptButtonTextStyle}>
              <Text style={styles.text}>{strings.ACCEPT}</Text>
            </TouchableOpacity>
          </View>
        );
        break;
      case 'CANCELLED':
        return (
          <View style={styles.taskCancelledByCustomerContainer}>
            <TouchableOpacity
              onPress={() => {
                navigate(navigationStrings.TASKHISTORY);
                actions.isModalVisibleForAcceptReject({
                  isModalVisibleForAcceptReject: false,
                  notificationData: null,
                });
                actions.updateHomepage(true);
              }}
              style={{
                flex: 1,
                borderBottomLeftRadius: moderateScale(15),
                borderBottomRightRadius: moderateScale(15),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.redB,
              }}>
              <Text style={styles.text}>{strings.OK}</Text>
            </TouchableOpacity>
          </View>
        );
        break;
      case 'ACK':
        return (
          <View style={styles.taskCancelledByCustomerContainer}>
            <TouchableOpacity
              onPress={() => {
                actions.isModalVisibleForAcceptReject({
                  isModalVisibleForAcceptReject: false,
                  notificationData: null,
                });
                actions.updateHomepage(true);
              }}
              style={{
                flex: 1,
                borderBottomLeftRadius: moderateScale(15),
                borderBottomRightRadius: moderateScale(15),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.green,
              }}>
              <Text style={styles.text}>{strings.DONE}</Text>
            </TouchableOpacity>
          </View>
        );
        break;

      case 'Instant_Booking':
        return (
          <View style={styles.taskCancelledByCustomerContainer}>
            <TouchableOpacity
              onPress={hideModal}
              style={styles.taskRejectButtonTextStyle}>
              <Text style={styles.text}>{strings.CANCEL}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={_sendRequestToUser}
              style={styles.taskAcceptButtonTextStyle}>
              <Text style={styles.text}>{strings.SUBMIT}</Text>
            </TouchableOpacity>
          </View>
        );
        break;

      default:
        return (
          <View
            style={{
              borderRadius: 10,
              height: 40,
              flexDirection: 'row',
              alignSelf: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => aceptRejectTask(2)}
              style={styles.taskRejectButtonTextStyle}>
              <Text style={styles.text}>{strings.REJECT}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => aceptRejectTask(1)}
              style={styles.taskAcceptButtonTextStyle}>
              <Text style={styles.text}>{strings.ACCEPT}</Text>
            </TouchableOpacity>
          </View>
        );

        break;
    }
  };

  const onRenderLocations = useCallback(
    ({item, index}) => {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginVertical: moderateScaleVertical(10),
            alignItems: 'center',
            marginHorizontal: moderateScale(10),
          }}
          onPress={() => _onselectUserLocation(item)}>
          <Image source={imagePath.location} />
          <Text
            style={{
              marginHorizontal: moderateScale(10),
              fontFamily: fontFamily?.bold,
            }}>
            {item?.formatted_address}
          </Text>
        </TouchableOpacity>
      );
    },
    [searchLocationData, userFocus, dropLocation],
  );

  const modalMainContent = () => {
    let data = notificationData?.notificationData?.data;
    let notificationType = data?.type ? data?.type : data?.notificationType;
    return (
      <View style={{overflow: 'hidden', borderRadius: moderateScale(10)}}>
        <View>{!!region && mapView()}</View>
        <View>
          <Text
            style={{
              alignSelf: 'center',
              marginTop: moderateScaleVertical(5),
              fontFamily: fontFamily.bold,
              color: colors.themeColor,
            }}>
            {orderData?.task_description}
          </Text>
        </View>
        <View style={{padding: 8}}>
          {!!orderData?.usertask?.name ? (
            <Text
              numberOfLines={1}
              style={{
                color: colors.black,
                textTransform: 'capitalize',
                fontWeight: '500',
              }}>
              {orderData?.usertask?.name}
            </Text>
          ) : null}

          <View style={styles.notificationModalMainHeaderStyle}>
            {notificationType == 'CANCELLED' ? (
              <View style={styles.taskCanceledContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text numberOfLines={1} style={styles.taskIdStyle}>
                    {strings.TASKID}
                  </Text>
                  <Text numberOfLines={1} style={styles.taskIdStyle}>
                    {` ${taskId}`}
                  </Text>
                </View>
                <View>
                  <Text numberOfLines={1} style={styles.taskCanceledTextStyle}>
                    {strings.ORDER_CANCELLED_BY_CUSTOMER}
                  </Text>
                </View>
              </View>
            ) : (
              <>
                {taskId ? (
                  <View style={styles.taskacceptrRejectContainer}>
                    <Text numberOfLines={1} style={styles.taskIdTitleText}>
                      {strings.TASKID}
                    </Text>
                    <Text numberOfLines={1} style={styles.taskIdTextStyle}>
                      {` ${taskId} `}
                      {`${!!orderData?.is_cab_pooling ? `(Pooling)` : ''}`}
                    </Text>
                  </View>
                ) : null}
              </>
            )}

            {orderData?.cash_to_be_collected > 0 && (
              <View style={{alignItems: 'center'}}>
                <Text numberOfLines={1} style={styles.priceTitleTextStyle}>
                  {strings.PRICE}
                </Text>
                <Text numberOfLines={1} style={styles.priceTextStyle}>
                  {orderData?.cash_to_be_collected}
                </Text>
                <Text style={styles.address}></Text>
              </View>
            )}
          </View>
          {!!orderData?.no_seats_for_pooling && (
            <Text
              numberOfLines={1}
              style={{
                marginVertical: moderateScaleVertical(10),
                marginTop: moderateScaleVertical(-10),
                fontSize: textScale(10),
                color: colors.black,
                fontFamily: fontFamily.regular,
              }}>
              {`Booked Seats :-`} {orderData?.no_seats_for_pooling}
            </Text>
          )}
          <View style={{flexDirection: 'row'}}>
            <View>
              <Image
                style={styles.grayDotImageStyle}
                source={imagePath.grayDot}
              />
            </View>
            <View>
              <FlatList
                data={
                  !isEmpty(notificationDropLocationsData)
                    ? notificationDropLocationsData
                    : []
                }
                renderItem={onListAllAddress}
                keyExtractor={(item, index) => String(index)}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
          {notificationType == 'Instant_Booking' && (
            <View style={{paddingHorizontal: moderateScale(20)}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: moderateScaleVertical(10),
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    //  backgroundColor:colors.themeColor,

                    paddingVertical: moderateScaleVertical(10),
                    paddingHorizontal: moderateScale(10),
                    borderRadius: moderateScale(8),
                  }}
                  onPress={onWhatsapp}>
                  <Image source={imagePath.whatsapp} />
                  <Text
                    style={{
                      marginHorizontal: moderateScale(10),
                      color: colors.black,
                    }}>
                    Whatsapp
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    //  backgroundColor:colors.themeColor,
                    marginHorizontal: moderateScale(10),
                    paddingHorizontal: moderateScale(10),
                    borderRadius: moderateScale(8),
                  }}
                  onPress={() =>
                    Linking.openURL(`tel:${customerData?.phone_number}`)
                  }>
                  <Image source={imagePath.phone2} />
                  <Text
                    style={{
                      marginHorizontal: moderateScale(10),
                      color: colors.black,
                    }}>
                    Voice Call
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder={'Enter Base Fare'}
                onChangeText={text => setBaseFare(text)}
                style={{
                  opacity: 0.7,
                  color: colors.textGreyOpcaity7,
                  fontFamily: fontFamily.medium,
                  fontSize: textScale(14),
                  paddingHorizontal: 8,
                  textAlign: I18nManager.isRTL ? 'right' : 'left',
                  borderBottomWidth: moderateScaleVertical(1),
                  borderColor: colors.black,
                }}
                keyboardType={'phone-pad'}
              />
              <Text
                style={{
                  marginTop: moderateScaleVertical(10),
                  fontFamily: fontFamily?.bold,
                }}>
                Drop Location
              </Text>
              <View
                style={{
                  ...styles.locationTextInputView,
                  marginTop: moderateScaleVertical(10),
                  justifyContent: 'center',
                  marginHorizontal: moderateScale(10),
                  marginLeft: moderateScale(0),
                }}>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder={'Enter Drop Location'}
                  onChangeText={text => searchLocation(text)}
                  onFocus={() => setUserFocus('location')}
                  value={dropLocation?.formatted_address}
                  keyboardType={
                    Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  onKeyPress={({nativeEvent: {key: keyValue}}) =>
                    (keyValue = 'Backspace' && setDropLocation(''))
                  }
                />
                <TouchableOpacity onPress={() => setDropLocation('')}>
                  <Image
                    style={{
                      marginLeft: moderateScale(5),
                      tintColor: colors.black,
                    }}
                    source={imagePath.crossRed}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  height: searchLocationData?.length > 1 ? width / 3 : 0,
                }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={searchLocationData}
                  renderItem={onRenderLocations}
                  keyExtractor={item => item.reference.toString()}
                  keyboardShouldPersistTaps
                />
              </View>
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text
                style={[styles.dateTimeStyle, {marginTop: moderateScale(10)}]}>
                {strings.TASKDATE}
              </Text>
              <Text style={styles.address}>{getDate(data?.created_at)}</Text>
            </View>
            {totalDistance && notificationType != 'Instant_Booking' && (
              <View style={{alignItems: 'center'}}>
                <Text
                  style={[
                    styles.dateTimeStyle,
                    {marginTop: moderateScale(10)},
                  ]}>
                  {strings.TASKDISTANCE}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: textScale(14),
                    color: colors.redB,
                    fontFamily: fontFamily.bold,
                  }}>
                  {`${totalDistance}`}
                </Text>
              </View>
            )}
          </View>
        </View>

        {showButtonComponent(notificationType)}
      </View>
    );
  };
  {
    console.log(clientInfo?.database_name, 'clientInfo?.database_name');
  }
  const aceptRejectTask = status => {
    let notifData = notificationData?.notificationData?.data;

    let data = {};
    data['order_id'] = !!notifData?.batch_no
      ? notifData?.batch_no
      : notifData?.order_id;
    data['driver_id'] = notifData?.driver_id;
    data['status'] = status;
    data['type'] = !!notifData?.batch_no ? 'B' : 'O';

    console.log(data, clientInfo?.database_name, 'data accept reject');
    actions
      .acceptRejectTask(data, {client: clientInfo?.database_name})
      .then(res => {
        console.log(res, 'submitReason>res>res');
        updateState({isLoading: false});
        actions.isModalVisibleForAcceptReject({
          isModalVisibleForAcceptReject: false,
          notificationData: null,
        });
        actions.updateHomepage(true);
      })

      .catch(errorMethod);
  };

  //Error handling in api
  const errorMethod = error => {
    //To close Notification modal in case of task already accepted
    actions.isModalVisibleForAcceptReject({
      isModalVisibleForAcceptReject: false,
      notificationData: null,
    });
    console.log(error, 'error');
    updateState({
      isLoading: false,
      isRefreshing: false,
      isLoading: false,
      isModalVisibleForAcceptReject: false,
    });
    showError(error?.message || error?.error, 4000);
  };

  return (
    <ModalView
      data={''}
      isVisible={notificationData?.isModalVisibleForAcceptReject}
      onClose={() =>
        !!orderData?.is_cab_pooling
          ? actions.isModalVisibleForAcceptReject({
              isModalVisibleForAcceptReject: false,
              notificationData: null,
            })
          : {}
      }
      mainViewStyle={{
        maxHeight: height,
      }}
      modalMainContent={modalMainContent}
    />
  );
};

const styles = StyleSheet.create({
  toolTipStyle: {
    height: moderateScale(8),
    alignItems: 'center',
    width: moderateScale(30),
    borderRadius: moderateScale(10),
    alignSelf: 'center',
    marginVertical: moderateScale(10),
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    borderRadius: moderateScale(10),
    height: moderateScale(width / 2),
  },
  address: {
    fontFamily: fontFamily.semiBold,
    fontSize: textScale(14),
  },
  dateTimeStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: textScale(10),
    opacity: 0.5,
    // paddingLeft: 5,
  },
  text: {
    textAlign: 'center',
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: textScale(14),
  },
  dotContainerStyle: {
    height: 40,
    width: 0.5,
    backgroundColor: colors.textGreyLight,
  },
  notificationModalMainHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskCanceledContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIdStyle: {
    textAlign: 'right',
    fontSize: textScale(10),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  taskCanceledTextStyle: {
    marginVertical: moderateScaleVertical(5),
    textAlign: 'right',
    fontSize: textScale(12),
    color: colors.redB,
    fontFamily: fontFamily.bold,
  },
  taskacceptrRejectContainer: {
    flexDirection: 'row',
    width: width / 2.4,
    alignItems: 'center',
  },
  taskIdTitleText: {
    marginVertical: moderateScaleVertical(10),
    textAlign: 'right',
    fontSize: textScale(10),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  taskIdTextStyle: {
    marginVertical: moderateScaleVertical(10),
    textAlign: 'right',
    fontSize: textScale(12),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  priceTitleTextStyle: {
    marginVertical: moderateScaleVertical(10),
    textAlign: 'right',
    fontSize: textScale(10),
    color: colors.green,
    fontFamily: fontFamily.bold,
  },
  priceTextStyle: {
    marginVertical: moderateScaleVertical(-5),
    textAlign: 'right',
    fontSize: textScale(12),
    color: colors.green,
    fontFamily: fontFamily.bold,
  },
  grayDotImageStyle: {
    position: 'absolute',
    marginHorizontal: moderateScale(11),
    top: 8,
  },
  taskRejectButtonTextStyle: {
    flex: 0.5,
    borderBottomLeftRadius: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  taskAcceptButtonTextStyle: {
    flex: 0.5,
    borderBottomRightRadius: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  taskCancelledByCustomerContainer: {
    borderRadius: 10,
    height: 40,
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },

  locationTextInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(20),
    marginBottom: moderateScaleVertical(20),
  },
  textInputStyle: {
    borderWidth: 1,
    flex: 0.95,
    borderRadius: moderateScale(5),
    height: moderateScaleVertical(45),
    justifyContent: 'center',
    paddingHorizontal: moderateScale(20),
    borderColor: colors.borderColorB,
  },
});

export default NotificationModal;
