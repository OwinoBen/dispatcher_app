import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep, isEmpty} from 'lodash';
import moment from 'moment';
import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  FlatList,
  I18nManager,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Calendar} from 'react-native-calendars';
import {useDarkMode} from 'react-native-dynamic';
import DatePicker from 'react-native-date-picker';
import DeviceInfo from 'react-native-device-info';
import DropDownPicker from 'react-native-dropdown-picker';
import FastImage from 'react-native-fast-image';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {UIActivityIndicator} from 'react-native-indicators';
import * as RNLocalize from 'react-native-localize';
import Modal from 'react-native-modal';
import RazorpayCheckout from 'react-native-razorpay';
import {useSelector} from 'react-redux';
import ButtonComponent from '../../Components/ButtonComponent';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import HorizontalLine from '../../Components/HorizontalLine';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import ProductListLoader from '../../Components/Loaders/ProductListLoader';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {hitSlopProp} from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {currencyNumberFormatter} from '../../utils/commonFunction';
import {
  getHostName,
  getImageUrl,
  getParameterByName,
  hapticEffects,
  showError,
  showInfo,
  showSuccess,
  timeInLocalLangauge,
  playHapticEffect,
} from '../../utils/helperFunctions';
import {getItem, removeItem, setItem} from '../../utils/utils';
import stylesFun from './styles';
// import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import VariantAddons from '../../Components/VariantAddons';

export default function Cart({navigation, route}) {
  const theme = useSelector(state => state?.initBoot?.themeColor);
  const checkCartItem = useSelector(state => state?.cart?.cartItemCount);
  const toggleTheme = useSelector(state => state?.initBoot?.themeToggle);
  const location = useSelector(state => state?.home?.location);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  let paramsData = route?.params?.data?.cartData;
  let taskDetail = route?.params?.data?.taskDetail;
  let apiData = route?.params?.data?.apiData;

  console.log(paramsData, 'Cart>>>paramsData');
  console.log(taskDetail, 'taskDetail>>>paramsData');

  const appMainData = useSelector(state => state?.home?.appMainData);
  const recommendedVendorsdata = appMainData?.vendors;
  const bottomSheetRef = useRef(null);

  const [state, setState] = useState({
    isVisibleTimeModal: false,
    isVisible: false,
    cartItems: [],
    cartData: {},
    isLoadingB: true,
    isModalVisibleForClearCart: false,
    isVisibleAddressModal: false,
    type: '',
    vendorAddress: '',
    selectedAddress: null,
    selectedPayment: {},
    isRefreshing: false,
    selectedTipvalue: null,
    selectedTipAmount: null,
    viewHeight: 0,
    tableData: [],
    isTableDropDown: false,
    defaultSelectedTable: '',
    deepLinkUrl: null,
    selectedTimeOptions: [
      {id: 1, title: strings.NOW, type: 'now'},
      {id: 2, title: strings.SCHEDULE_ORDER, type: 'schedule'},
    ],
    selectedTimeOption: null,
    sheduledorderdate: null,
    sheduledpickupdate: null,
    sheduleddropoffdate: null,
    scheduleType: null,
    swipeKey: 'randomStrings',
    wishlistArray: [],
    btnLoader: false,
    placeLoader: false,
    localeSheduledOrderDate: null,
    btnLoadrId: null,
    instruction: '',
    pickupDriverComment: null,
    dropOffDriverComment: null,
    vendorComment: null,
    localePickupDate: null,
    localeDropOffDate: null,
    modalType: null,
    showTaxFeeArea: false,
    isGiftBoxSelected: false,
    selectedDateFromCalendar: '',
    availableTimeSlots: [],
    selectedTimeSlots: '',
    isLoading: false,
    isVisibleModal: false,
    showShimmer: true,
    selectedCartItem: null,
    selectedSection: null,
    typeId: null,
  });
  const {
    typeId,
    selectedSection,
    selectedCartItem,
    showShimmer,
    isVisibleModal,
    viewHeight,
    isVisibleTimeModal,
    cartItems,
    cartData,
    isLoadingB,
    isLoading,
    isModalVisibleForClearCart,
    isVisibleAddressModal,
    isVisible,
    type,
    selectedAddress,
    selectedPayment,
    isRefreshing,
    vendorAddress,
    selectedTipvalue,
    selectedTipAmount,
    tableData,
    isTableDropDown,
    defaultSelectedTable,
    deepLinkUrl,
    selectedTimeOptions,
    selectedTimeOption,
    sheduledorderdate,
    scheduleType,
    swipeKey,
    wishlistArray,
    btnLoader,
    placeLoader,
    localeSheduledOrderDate,
    btnLoadrId,
    instruction,
    pickupDriverComment,
    dropOffDriverComment,
    vendorComment,
    localePickupDate,
    localeDropOffDate,
    modalType,
    sheduledpickupdate,
    sheduleddropoffdate,
    showTaxFeeArea,
    isGiftBoxSelected,
    selectedDateFromCalendar,
    selectedTimeSlots,
    availableTimeSlots,
  } = state;

  //Redux store data
  const userData = useSelector(state => state?.auth?.userData);
  const {appData, allAddresss, themeColors, currencies, languages, appStyle} =
    useSelector(state => state?.initBoot);
  const selectedLanguage = languages?.primary_language?.sort_code;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors, isDarkMode, MyDarkTheme});
  const clientInfo = useSelector(state => state?.initBoot?.clientInfo);

  const selectedAddressData = useSelector(
    state => state?.cart?.selectedAddress,
  );

  const dineInType = useSelector(state => state?.home?.dineInType);

  //Update states on screens
  const updateState = data => setState(state => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  let businessType = appData?.profile?.preferences?.business_type || null;

  useFocusEffect(
    React.useCallback(() => {
      updateState({isLoading: true});
      getCartDetail();
      return () => {};
    }, [isRefreshing]),
  );

  //get the entire cart detail
  const getCartDetail = () => {
    // alert("cart detail hit")
    // updateState({isLoadingB: false});
    let checkDate = !!paramsData?.scheduled_date_time;

    if (!!checkDate && paramsData.schedule_type == 'schedule') {
      let formatDate = new Date(paramsData?.scheduled_date_time);
      updateState({
        localeSheduledOrderDate: timeInLocalLangauge(
          formatDate,
          selectedLanguage,
        ),
      });
    } else {
      updateState({
        scheduleType: 'now',
        localeSheduledOrderDate: null,
      });
    }

    //schedule date for pickup and  dropoff
    let checkDateDropOFf = !!paramsData?.schedule_dropoff;
    let checkDatePickUp = !!paramsData?.schedule_pickup;

    if (!!checkDatePickUp) {
      let formatDate2 = new Date(paramsData?.schedule_pickup);
      updateState({
        localePickupDate: timeInLocalLangauge(formatDate2, selectedLanguage),
      });
    }

    if (!!checkDateDropOFf) {
      let formatDate3 = new Date(paramsData?.schedule_dropoff);
      updateState({
        localeDropOffDate: timeInLocalLangauge(formatDate3, selectedLanguage),
      });
    }

    if (apiData) {
      // updateState({isLoading: true});
      let data = {};
      data['order_vendor_id'] = apiData?.vendors[0]?.id;
      data['user_id'] = apiData?.user_id;
      data['address_id'] = apiData?.address_id;

      console.log(data, '_onPressEditOrder');

      let url = `https://${getHostName(
        taskDetail?.order?.call_back_url,
      )}/edit-order/vendor/products/getProductsInCart`;

      // let url = `http://192.168.96.152:8005/edit-order/vendor/products/getProductsInCart`;
      actions
        .getCustomerOrderDetail(url, data, {client: clientInfo?.database_name})
        .then(res => {
          console.log(res, 'all response after hit order api++++++++');

          updateState({
            isRefreshing: false,
            isLoadingB: false,
            isLoading: false,
            pickupDriverComment: res?.data?.comment_for_pickup_driver
              ? res?.data?.comment_for_pickup_driver
              : pickupDriverComment,
            dropOffDriverComment: res?.data?.comment_for_dropoff_driver
              ? res?.data?.comment_for_dropoff_driver
              : dropOffDriverComment,
            vendorComment: res?.data?.comment_for_vendor
              ? res?.data?.comment_for_vendor
              : vendorComment,
            sheduledorderdate: res?.data?.scheduled_date_time,
            sheduleddropoffdate: res?.data?.schedule_dropoff,
            sheduledpickupdate: res?.data?.schedule_pickup,
            scheduleType: res?.data?.schedule_type,
            selectedTimeOption:
              res?.data?.schedule_type == 'now'
                ? {id: 1, title: strings.NOW, type: 'now'}
                : res?.data?.schedule_type == 'schedule'
                ? {id: 2, title: strings.SCHEDULE_ORDER, type: 'schedule'}
                : {id: 1, title: strings.NOW, type: 'now'},
          });
          if (res?.data) {
            if (
              !!res?.data.vendor_details.vendor_tables &&
              res?.data.vendor_details.vendor_tables.length > 0
            ) {
              res?.data.vendor_details.vendor_tables.forEach(
                (item, indx) =>
                  (tableData[indx] = {
                    id: item.id,
                    label: `${strings.CATEGORY}: ${
                      item.category.title ? item.category.title : ''
                    } | ${strings.TABLE}: ${
                      item.table_number ? item.table_number : 0
                    } | ${strings.SEAT_CAPACITY}: ${
                      item.seating_number ? item.seating_number : 0
                    }`,
                    value: `${strings.CATEGORY}: ${
                      item.category.title ? item.category.title : ''
                    } | ${strings.TABLE}: ${
                      item.table_number ? item.table_number : 0
                    } | ${strings.SEAT_CAPACITY}: ${
                      item.seating_number ? item.seating_number : 0
                    }`,
                    title: item.category.title,
                    table_number: item.table_number,
                    seating_number: item.seating_number,
                    vendor_id: res?.data.vendor_details.vendor_address.id,
                  }),
                updateState({
                  tableData: tableData,
                }),
              );
              const data = {
                vendor_id: tableData[0].vendor_id,
                table: tableData[0].id,
              };
              _vendorTableCart(data, tableData[0]);
            }
            updateState({
              cartItems: res?.data.products,
              vendorAddress: res?.data.address,
              cartData: res?.data,
              availableTimeSlots: res?.data.slots,
              isLoadingB: false,
              isRefreshing: false,
              selectedTipvalue:
                res?.data?.total_payable_amount == 0 ? 'custom' : null,
            });
            if (!res?.data?.schedule_type && res?.data.products.length > 0) {
              //if schedule type is null then hit the api again with now option
              setDateAndTimeSchedule();
            }
          } else {
            updateState({
              cartData: {},
              cartItems: [],
              vendorAddress: '',
              isLoadingB: false,
              isLoading: false,
              isRefreshing: false,
            });
          }
        })
        .catch(error => {
          console.log(error, 'error>>error');
          updateState({
            isLoading: false,
          });
        });
    }
  };

  //add /delete products from cart
  const addDeleteCartItems = (item, index, type) => {
    console.log(item, 'itemitemitemitem');
    console.log(cartData, 'cartDatacartDatacartDatacartData');
    let quanitity = null;
    let itemToUpdate = cloneDeep(item);
    let quantityToIncrease = !!itemToUpdate?.product?.batch_count
      ? Number(itemToUpdate?.product?.batch_count)
      : 1;
    if (type == 1) {
      quanitity = Number(itemToUpdate.quantity) + quantityToIncrease;
    } else {
      if (
        Number(itemToUpdate.quantity - itemToUpdate?.product?.batch_count) <=
        itemToUpdate?.product?.minimum_order_count
      ) {
        quanitity = 0;
      } else {
        quanitity = Number(itemToUpdate.quantity) - quantityToIncrease;
      }
    }
    if (quanitity) {
      let data = {};
      // data['cart_id'] = itemToUpdate?.cart_id;
      data['quantity'] = quanitity;
      data['cart_product_id'] = itemToUpdate?.id;
      data['cart_id'] = itemToUpdate?.cart_id;
      data['user_id'] = cartData?.user_id;
      // data['type'] = dineInType;
      console.log(data, 'datadatadata');

      updateState({btnLoader: true, btnLoadrId: item?.id});
      let url = `https://${getHostName(
        taskDetail?.order?.call_back_url,
      )}/edit-order/temp-cart/product/updateQuantity`;
      actions
        .increaseDecreaseItemQty(url, data, {client: clientInfo?.database_name})
        .then(res => {
          console.log('cart detail', res);
          // actions.cartItemQty(res);
          updateState({
            cartItems: res.data.products,
            cartData: res.data,
            btnLoader: false,
          });
        })
        .catch(errorMethod);
    } else {
      updateState({btnLoader: true, btnLoadrId: item?.id});
      removeItem('selectedTable');
      removeProductFromCart(itemToUpdate);
    }
  };

  //decrementing/removeing products from cart
  const removeProductFromCart = item => {
    let data = {};
    data['cart_product_id'] = item?.id;
    data['cart_id'] = item?.cart_id;
    data['user_id'] = cartData?.user_id;

    let url = `https://${getHostName(
      taskDetail?.order?.call_back_url,
    )}/edit-order/temp-cart/product/remove`;
    actions
      .removeProductFromCart(url, data, {client: clientInfo?.database_name})

      .then(res => {
        // actions.cartItemQty(res);
        updateState({
          cartItems: res.data.products,
          cartData: res.data,
          isLoadingB: false,
          btnLoader: false,
        });
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //Close modal for Clear cart
  const closeOptionModal = () => {
    updateState({isModalVisibleForClearCart: false});
  };

  const bottomButtonClick = () => {
    updateState({isLoadingB: true, isModalVisibleForClearCart: false});
    removeItem('selectedTable');
    setTimeout(() => {
      clearEntireCart();
    }, 1000);
  };

  //Clear cart
  const clearEntireCart = () => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(res => {
        actions.cartItemQty(res);
        updateState({
          cartItems: [],
          cartData: {},
          isLoadingB: false,
        });
        getAllWishListData();
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = error => {
    console.log(error, '<==errorOccured');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
      btnLoader: false,
      placeLoader: false,
    });
    showError(error?.description || error?.message || error?.error || error);
  };

  //Get list of all offers
  const _getAllOffers = (vendor, cartData) => {
    moveToNewScreen(navigationStrings.OFFERS, {
      vendor: vendor,
      cartId: cartData.id,
    })();
  };

  useEffect(() => {
    if (paramsData?.transactionId && !!checkCartItem?.data) {
      _directOrderPlace();
      console.log('useEffect 2');
    }
  }, [paramsData?.transactionId]);

  //Verify your promo code
  const _removeCoupon = (item, cartData) => {
    // updateState({ isLoadingB: true });
    let data = {};
    data['vendor_id'] = item?.vendor_id;
    data['cart_id'] = cartData?.id;
    data['coupon_id'] = item?.couponData?.coupon_id;

    actions
      .removePromoCode(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then(res => {
        if (res) {
          showSuccess(res?.message || res?.error);
          getCartDetail();
        } else {
          updateState({isLoadingB: false});
        }
      })
      .catch(errorMethod);
  };

  const checkPaymentOptions = res => {
    updateState({placeLoader: false});
    let paymentId = res?.data?.payment_option_id;
    let paymentData = {
      selectedPayment: selectedPayment,
      total_payable_amount: (
        Number(cartData?.total_payable_amount) +
        (selectedTipAmount != null && selectedTipAmount != ''
          ? Number(selectedTipAmount)
          : 0)
      ).toFixed(2),
      payment_option_id: selectedPayment?.id,
      orderDetail: res.data,
      redirectFrom: 'cart',
    };

    if (
      !!paymentId &&
      !!(
        Number(cartData?.total_payable_amount) + Number(selectedTipAmount) ===
        0
      )
    ) {
      moveToNewScreen(navigationStrings.ORDERSUCESS, {
        orderDetail: res.data,
      })();
      return;
    }

    switch (paymentId) {
      case 5: //Paystack Payment Getway
        navigation.navigate(navigationStrings.PAYSTACK, paymentData);
        break;
      case 6: //Payfast Payment Getway
        navigation.navigate(navigationStrings.PAYFAST, paymentData);
        break;
      case 7: //Mobbex Payment Getway
        navigation.navigate(navigationStrings.MOBBEX, paymentData);
        break;
      case 8: //Yoco Payment Getway
        navigation.navigate(navigationStrings.YOCO, paymentData);
        break;
      case 9: //Pyalink Payment Getway
        navigation.navigate(navigationStrings.PAYLINK, paymentData);
        break;
      case 12: //Simplify Payment Getway
        navigation.navigate(navigationStrings.SIMPLIFY, paymentData);
        break;
      case 13: //Square Payment Getway
        navigation.navigate(navigationStrings.SQUARE, paymentData);
        break;
      case 15: //Pagarme Payment Getway
        navigation.navigate(navigationStrings.PAGARME, paymentData);
        break;
      case 17: //Checkout Payment Getway
        checkoutPayment(paymentData);
        break;
      default:
        if (
          !!businessType &&
          businessType == 'home_service' &&
          res?.data?.vendors.length == 1
        ) {
          setTimeout(() => {
            _getOrderDetail(res.data.vendors[0]);
          }, 1500);
        } else {
          moveToNewScreen(navigationStrings.ORDERSUCESS, {
            orderDetail: res.data,
          })();
        }
        break;
    }
  };

  const checkoutPayment = paymentData => {
    let queryData = `/${paymentData?.selectedPayment?.code?.toLowerCase()}?amount=${
      paymentData?.total_payable_amount
    }&payment_option_id=${paymentData?.payment_option_id}&order_number=${
      paymentData?.orderDetail?.order_number
    }&token=${paramsData?.cardInfo}&action=cart`;
    actions
      .openPaymentWebUrl(
        queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then(res => {
        updateState({
          cartItems: [],
          cartData: {},
        });
        moveToNewScreen(navigationStrings.ORDERSUCESS, {
          orderDetail: {
            order_number: paymentData?.orderDetail?.order_number,
            id: paymentData?.orderDetail?.id,
          },
        })();
      })
      .catch(errorMethod);
  };

  const _getOrderDetail = ({order_id, vendor_id}) => {
    // return;
    let data = {};
    data['order_id'] = order_id;
    data['vendor_id'] = vendor_id;
    // updateState({ isLoading: true });
    actions
      .getOrderDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        timezone: RNLocalize.getTimeZone(),
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then(res => {
        console.log(res, 'res===> order detail');
        actions.cartItemQty({});
        updateState({
          cartItems: [],
          cartData: {},
          isLoadingB: false,
          placeLoader: false,
        });
        if (res?.data) {
          if (
            !!businessType &&
            businessType == 'home_service' &&
            res?.data?.vendors.length == 1 &&
            res?.data?.vendors[0]?.dispatch_traking_url
          ) {
            navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
              orderId: order_id,
              fromVendorApp: true,
              selectedVendor: {id: vendor_id},
              orderDetail: res.data.vendors[0],
              showRating:
                res.data.vendors[0]?.order_status?.current_status?.id != 6
                  ? false
                  : true,
            });
          } else {
            moveToNewScreen(navigationStrings.ORDERSUCESS, {
              orderDetail: res.data,
            })();
          }
        }
      })
      .catch(errorMethod);
  };

  const setDateAndTimeSchedule = toHitApiForPlaceOrder => {
    if (!userData?.auth_token) {
      return;
    }

    let data = {};

    if (businessType == 'laundry' && toHitApiForPlaceOrder) {
      data['comment_for_pickup_driver'] = pickupDriverComment;
      data['comment_for_dropoff_driver'] = dropOffDriverComment;
      data['comment_for_vendor'] = vendorComment;
      data['schedule_pickup'] = sheduledpickupdate
        ? new Date(sheduledpickupdate).toISOString()
        : null;
      data['schedule_dropoff'] = sheduleddropoffdate
        ? new Date(sheduleddropoffdate).toISOString()
        : null;
    } else {
      data['task_type'] = !!selectedTimeSlots ? 'schedule' : scheduleType;
      data['schedule_dt'] = !!selectedTimeSlots
        ? selectedDateFromCalendar
        : scheduleType != 'now' && sheduledorderdate
        ? new Date(sheduledorderdate).toISOString()
        : null;
      data['comment_for_vendor'] = instruction;
      data['slot'] = selectedTimeSlots;
    }

    console.log(data, 'setDateAndTimeSchedule>>>DATA');
    // updateState({isLoading: false});
    actions
      .scheduledOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then(res => {
        console.log(res, 'schedulte api res res>>>');
        if (res && res?.status == 'Success') {
          if (toHitApiForPlaceOrder && businessType == 'laundry') {
            _finalPayment();
          }
          updateState({
            // isLoadingB: toHitApiForPlaceOrder ? true : false,
          });
        } else {
          updateState({
            isLoadingB: false,
          });
        }
        // getCartDetail();
      });
    //   .catch(errorMethod);
  };

  console.log('cartDatacartData', cartItems);

  const swipeRef = useRef(null);

  const openDeleteView = async item => {
    let itemToUpdate = cloneDeep(item);
    removeItem('selectedTable');
    removeProductFromCart(itemToUpdate);
    // updateState({ isLoadingB: true });
    // if (!!swipeRef && swipeRef?.current) {
    //     swipeRef?.current.openRight()
    // }
  };

  const swipeBtns = (progress, dragX) => {
    return (
      <Animated.View
        key={String(cartItems.length)}
        style={{
          ...styles.swipeView,
        }}>
        <FastImage
          source={imagePath.deleteRed}
          resizeMode="contain"
          style={{
            width: moderateScale(16),
            height: moderateScale(16),
          }}
        />
      </Animated.View>
    );
  };

  const _webPayment = () => {
    let selectedMethod = selectedPayment.code.toLowerCase();
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;

    console.log(returnUrl, 'returnUrl');
    console.log(cancelUrl, 'cancelUrl');
    let queryData = `/${selectedMethod}?tip=${
      selectedTipAmount && selectedTipAmount != ''
        ? Number(selectedTipAmount)
        : 0
    }&amount=${(
      Number(cartData?.total_payable_amount) +
      (selectedTipAmount != null && selectedTipAmount != ''
        ? Number(selectedTipAmount)
        : 0)
    ).toFixed(2)}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&address_id=${
      selectedAddressData?.id
    }&payment_option_id=${selectedPayment?.id}&action=cart`;

    console.log(queryData, 'queryData');
    actions
      .openPaymentWebUrl(
        queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then(res => {
        console.log(res, 'response===>');
        updateState({
          isLoadingB: false,
          isRefreshing: false,
          placeLoader: false,
          pickupDriverComment: null,
          dropOffDriverComment: null,
          vendorComment: null,
          localePickupDate: null,
          localeDropOffDate: null,
          modalType: null,
          sheduledpickupdate: null,
          sheduleddropoffdate: null,
        });
        if (res && res?.status == 'Success' && res?.data) {
          // updateState({allAvailAblePaymentMethods: res?.data});
          navigation.navigate(navigationStrings.WEBPAYMENTS, {
            paymentUrl: res?.data,
            paymentTitle: selectedPayment?.title,
            redirectFrom: 'cart',
            selectedAddressData: selectedAddressData,
            selectedPayment: selectedPayment,
          });
        }
      })
      .catch(errorMethod);
  };

  //Offline payments
  const _offineLinePayment = async () => {
    if (paramsData?.tokenInfo) {
      let selectedMethod = selectedPayment.code.toLowerCase();
      actions
        .openPaymentWebUrl(
          `/${selectedMethod}?tip=${
            selectedTipAmount && selectedTipAmount != ''
              ? Number(selectedTipAmount)
              : 0
          }&amount=${
            cartData?.total_payable_amount == 0
              ? selectedTipAmount
              : cartData?.total_payable_amount
          }&auth_token=${userData?.auth_token}&address_id=${
            selectedAddressData?.id
          }&payment_option_id=${selectedPayment?.id}&action=cart&stripe_token=${
            paramsData?.tokenInfo
          }`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then(res => {
          updateState({isRefreshing: false});
          if (res && res?.status == 'Success' && res?.data) {
            // updateState({allAvailAblePaymentMethods: res?.data});
            actions.cartItemQty({});
            updateState({
              cartItems: [],
              cartData: {},
              isLoadingB: false,
              placeLoader: false,
              pickupDriverComment: null,
              dropOffDriverComment: null,
              vendorComment: null,
              localePickupDate: null,
              localeDropOffDate: null,
              modalType: null,
              sheduledpickupdate: null,
              sheduleddropoffdate: null,
              selectedPayment: {
                id: 1,
                off_site: 0,
                title: 'Cash On Delivery',
                title_lng: strings.CASH_ON_DELIVERY,
              },
            });
            moveToNewScreen(navigationStrings.ORDERSUCESS, {
              orderDetail: res.data,
            })();
            showSuccess(res?.message);
          } else {
            updateState({
              isLoadingB: false,
              placeLoader: false,
              selectedPayment: {
                id: 1,
                off_site: 0,
                title: 'Cash On Delivery',
                title_lng: strings.CASH_ON_DELIVERY,
              },
            });
          }
        })
        .catch(err => {
          showError(err.message);
          updateState({
            isLoadingB: false,
            placeLoader: false,
          });
          console.log(err, 'errorInPlaceOrder');
        });
    } else {
      errorMethod(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
    }
  };

  console.log(paramsData, 'paramsDataparamsDataparamsDataparamsData>>>');

  const _renderRazor = () => {
    updateState({isLoadingB: true});
    let options = {
      description: 'Credits towards consultation',
      image: getImageUrl(
        appData?.profile?.logo?.image_fit,
        appData?.profile?.logo?.image_path,
        '1000/1000',
      ),
      currency: currencies?.primary_currency?.iso_code,
      key: appData?.profile?.preferences?.razorpay_api_key, // Your api key
      amount:
        (Number(cartData?.total_payable_amount) +
          (selectedTipAmount != null && selectedTipAmount != ''
            ? Number(selectedTipAmount)
            : 0)) *
        100,
      name: appData?.profile?.company_name,
      prefill: {
        email: userData?.email,
        contact: userData?.phone_number || '',
        name: userData?.name,
      },
      theme: {color: themeColors.primary_color},
    };

    RazorpayCheckout.open(options)
      .then(res => {
        console.log(`Success for razor: `, res);
        if (res?.razorpay_payment_id) {
          let data = {};
          data['address_id'] = selectedAddressData?.id;
          data['payment_option_id'] = selectedPayment?.id;
          data['type'] = dineInType || '';
          data['transaction_id'] = res?.razorpay_payment_id;
          placeOrderData(data); // placeOrder
        }
      })
      .catch(errorMethod);
  };

  const clearSceduleDate = async () => {
    updateState({
      scheduleType: 'now',
      localeSheduledOrderDate: null,
      sheduledorderdate: null,
    });
  };

  useEffect(() => {
    if (
      scheduleType != null &&
      scheduleType == 'now' &&
      !!checkCartItem?.data &&
      !!checkCartItem?.data.products.length
    ) {
      setDateAndTimeSchedule();
      console.log('useEffect 4');
    }
  }, [scheduleType]);

  const _selectTime = item => {
    updateState({
      modalType: 'schedule',
      isVisibleTimeModal: true,
    });
  };
  //Select Time Laundry
  const _selectTimeLaundry = item => {
    if (item == 'dropoff') {
      updateState({
        modalType: 'dropoff',
        // scheduleType: 'dropoff',
        isVisibleTimeModal: true,
      });
    } else {
      updateState({
        modalType: 'pickup',
        // scheduleType: 'pickup',
        isVisibleTimeModal: true,
      });
    }
  };

  const selectOrderDate = () => {
    if (availableTimeSlots.length > 0 || cartData.slots.length > 0) {
      if (selectedDateFromCalendar == '' || selectedTimeSlots == '') {
        alert('Please select date and time slots');
        return;
      } else {
        // let formatDate = new Date(selectedDateFromCalendar);
        const date = selectedDateFromCalendar;
        const time = selectedTimeSlots.split(':')[0];
        const formatDate = moment(
          `${date} ${time}`,
          'YYYY-MM-DD HH:mm:ss',
        ).format();
        console.log('formate date', moment(new Date(formatDate)).format('lll'));
        updateState({
          localeSheduledOrderDate: moment(new Date(formatDate)).format('lll'),
        });
      }
    }

    onClose();
    if (modalType != 'schedule' && businessType != 'laundry') {
      updateState({
        scheduleType: 'schedule',
      });
    }
    setDateAndTimeSchedule();
  };

  function makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const deleteItem = async (i, index) => {
    updateState({swipeKey: makeid(5)});
    openDeleteView(i);
    swipeRef.current.close();
    // return;

    // Animated.timing(height, {
    //   toValue: 0,
    //   duration: 350,
    //   useNativeDriver: false,
    // }).start(() => openDeleteView(i));
  };

  const getAllWishListData = () => {
    if (!!userData?.auth_token) {
      getAllWishlistItems();
      return;
    }
    updateState({isRefreshing: false, wishlistArray: []});
    return;
  };
  /*  GET ALL WISHLISTED ITEMS API FUNCTION  */
  const getAllWishlistItems = () => {
    // updateState({ isLoadingB: true });
    actions
      .getWishlistProducts(
        `?limit=${10}&page=${1}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then(res => {
        updateState({
          isLoadingB: false,
          wishlistArray: res.data.data,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  const renderMinAmountMsg = item => {
    if (
      Number(item?.vendor?.order_min_amount) >
      Number(item?.payable_amount ? item?.payable_amount : 0).toFixed(2)
    ) {
      return (
        <Text
          numberOfLines={1}
          style={{
            ...styles.priceItemLabel2,
            color: colors.redB,
            fontSize: textScale(13),
            fontFamily: fontFamily.medium,
            marginTop: moderateScaleVertical(10),
            paddingHorizontal: moderateScale(5),
          }}>
          {`${strings.ACCEPTING_ORDER_MSG} ${item?.vendor?.order_min_amount}`}
        </Text>
      );
    }
  };

  const _selectItemToUpdate = item => {
    console.log(item, 'item>item');
    updateState({selectedCartItem: item, isVisibleModal: true});
  };
  const _renderItem = ({item, index}) => {
    return (
      <View>
        {index === 0 && (
          <View style={Platform.OS === 'ios' ? {zIndex: 5000} : {}}>
            {dineInType === 'dine_in' &&
              userData?.auth_token &&
              !!cartData?.vendor_details?.vendor_tables &&
              cartData?.vendor_details?.vendor_tables.length > 0 && (
                <DropDownPicker
                  items={tableData}
                  onOpen={() => updateState({isTableDropDown: true})}
                  onClose={() => updateState({isTableDropDown: false})}
                  defaultValue={
                    deepLinkUrl
                      ? deepLinkUrl == 1
                        ? tableData[0]?.label
                        : tableData[1]?.label
                      : tableData[0]?.label || ''
                  }
                  containerStyle={styles.dropDownContainerStyle}
                  style={{
                    marginHorizontal: moderateScale(20),
                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.greyColor1,
                  }}
                  labelStyle={
                    isDarkMode
                      ? {color: MyDarkTheme.colors.text}
                      : {color: colors.textGrey}
                  }
                  itemStyle={{
                    justifyContent: 'flex-start',
                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                  }}
                  dropDownStyle={{
                    ...styles.dropDownStyle,
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.greyColor1,
                  }}
                  onChangeItem={item => _onTableSelection(item)}
                />
              )}
          </View>
        )}
        <View
          key={swipeKey + Math.random()}
          style={{
            ...styles.mainViewRednderItem,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          {renderMinAmountMsg(item)}
          <View
            style={{
              ...styles.vendorView,
              paddingHorizontal: moderateScale(8),
              flexDirection: 'column',
            }}>
            <Text
              numberOfLines={1}
              style={{
                ...styles.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {console.log('jbbbkhbk', item?.vendor)}
              {item?.vendor?.name}
            </Text>
            {item?.is_vendor_closed && (
              <Text
                numberOfLines={1}
                style={{
                  ...styles.priceItemLabel2,
                  color: colors.redB,
                  fontSize: textScale(9),
                }}>
                {strings.VENDOR_NOT_ACCEPTING_ORDERS}
              </Text>
            )}
          </View>
          {/************ start  render cart items *************/}
          {item?.vendor_products.length > 0
            ? item?.vendor_products.map((i, inx) => {
                return (
                  // <Swipeable
                  //   ref={swipeRef}
                  //   key={swipeKey + Math.random()}
                  //   renderRightActions={swipeBtns}
                  //   onSwipeableOpen={() => deleteItem(i, index)}
                  //   rightThreshold={width / 1.4}
                  //   // overshootFriction={8}
                  // >
                  <Animated.View
                    style={{
                      backgroundColor: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.transactionHistoryBg,
                      marginBottom: moderateScaleVertical(12),
                      marginRight: moderateScale(8),
                      borderRadius: moderateScale(10),
                      transform: [],
                      minHeight: height * 0.125,
                    }}
                    key={inx}>
                    <View style={[styles.cartItemMainContainer]}>
                      <View
                        style={[
                          styles.cartItemImage,
                          {
                            backgroundColor: isDarkMode
                              ? MyDarkTheme.colors.lightDark
                              : colors.white,
                          },
                        ]}>
                        <FastImage
                          source={
                            i?.cartImg != '' && i?.cartImg != null
                              ? {
                                  uri: getImageUrl(
                                    i?.cartImg?.path?.proxy_url,
                                    i?.cartImg?.path?.image_path,
                                    '300/300',
                                  ),
                                  priority: FastImage.priority.high,
                                }
                              : imagePath.patternOne
                          }
                          style={styles.imageStyle}
                        />
                      </View>

                      <View style={styles.cartItemDetailsCon}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View style={{flex: 1}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                flex: 1,
                              }}>
                              <Text
                                numberOfLines={1}
                                style={{
                                  ...styles.priceItemLabel2,
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.blackOpacity86,
                                  fontSize: textScale(12),
                                  fontFamily: fontFamily.medium,
                                  flex: 0.7,
                                }}>
                                {i?.product?.translation[0]?.title},
                              </Text>

                              <View
                                pointerEvents={btnLoader ? 'none' : 'auto'}
                                style={{flex: 0.3}}>
                                <View style={styles.incDecBtnContainer}>
                                  <TouchableOpacity
                                    style={{alignItems: 'center'}}
                                    onPress={() =>
                                      addDeleteCartItems(i, inx, 2)
                                    }>
                                    <Text style={styles.cartItemValueBtn}>
                                      -
                                    </Text>
                                  </TouchableOpacity>
                                  <View
                                    style={{
                                      alignItems: 'center',
                                      width: moderateScale(20),
                                      height: moderateScale(20),
                                      justifyContent: 'center',
                                    }}>
                                    {btnLoadrId === i.id && btnLoader ? (
                                      <UIActivityIndicator
                                        size={moderateScale(16)}
                                        color={colors.white}
                                      />
                                    ) : (
                                      <Text style={styles.cartItemValue}>
                                        {i?.quantity}
                                      </Text>
                                    )}
                                  </View>
                                  <TouchableOpacity
                                    style={{alignItems: 'center'}}
                                    onPress={() =>
                                      addDeleteCartItems(i, inx, 1)
                                    }>
                                    <Text style={styles.cartItemValueBtn}>
                                      +
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                            <Text
                              style={{
                                ...styles.priceItemLabel2,
                                fontSize: textScale(12),
                                color: isDarkMode
                                  ? MyDarkTheme.colors.text
                                  : '#B3B3B3',
                                marginTop: moderateScaleVertical(4),
                                fontFamily: fontFamily.regular,
                              }}>
                              <Text style={{}}>
                                {`${cartData?.currency?.symbol}${
                                  // Number(i?.pvariant?.multiplier) *
                                  currencyNumberFormatter(
                                    Number(i?.variants?.price).toFixed(2),
                                  )
                                }`}
                              </Text>{' '}
                              X {i?.quantity} ={' '}
                              <Text
                                style={{
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.black,
                                }}>
                                {`${cartData?.currency?.symbol}${
                                  // Number(i?.pvariant?.multiplier) *
                                  currencyNumberFormatter(
                                    Number(i?.variants?.quantity_price).toFixed(
                                      2,
                                    ),
                                  )
                                }`}
                              </Text>
                            </Text>

                            {i?.variant_options.length > 0
                              ? i?.variant_options.map((j, jnx) => {
                                  return (
                                    <View style={{flexDirection: 'row'}}>
                                      <Text
                                        style={
                                          isDarkMode
                                            ? [
                                                styles.cartItemWeight2,
                                                {
                                                  color:
                                                    MyDarkTheme.colors.text,
                                                },
                                              ]
                                            : styles.cartItemWeight2
                                        }
                                        numberOfLines={1}>
                                        {j.title}{' '}
                                      </Text>
                                      <Text
                                        style={
                                          isDarkMode
                                            ? [
                                                styles.cartItemWeight2,
                                                {
                                                  color:
                                                    MyDarkTheme.colors.text,
                                                },
                                              ]
                                            : styles.cartItemWeight2
                                        }
                                        numberOfLines={
                                          1
                                        }>{`(${j.option})`}</Text>
                                    </View>
                                  );
                                })
                              : null}
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                            }}>
                            {!!i?.product_addons.length > 0 && (
                              <View>
                                <Text
                                  style={{
                                    ...styles.cartItemWeight2,
                                    color: isDarkMode
                                      ? MyDarkTheme.colors.text
                                      : colors.textGreyB,
                                    marginVertical: moderateScale(2),
                                  }}>
                                  {strings.EXTRA}
                                </Text>
                              </View>
                            )}
                            <View>
                              {i?.product_addons.length > 0
                                ? i?.product_addons.map((j, jnx) => {
                                    return (
                                      <View
                                        style={{
                                          marginBottom:
                                            moderateScaleVertical(4),
                                        }}>
                                        <View
                                          style={{
                                            marginRight: moderateScale(10),
                                          }}>
                                          <Text
                                            style={
                                              isDarkMode
                                                ? [
                                                    styles.cartItemWeight2,
                                                    {
                                                      color:
                                                        MyDarkTheme.colors.text,
                                                    },
                                                  ]
                                                : styles.cartItemWeight2
                                            }
                                            numberOfLines={1}>
                                            {j.addon_title}:
                                          </Text>
                                          <View style={{flexDirection: 'row'}}>
                                            <Text
                                              style={
                                                isDarkMode
                                                  ? [
                                                      styles.cartItemWeight2,
                                                      {
                                                        color:
                                                          MyDarkTheme.colors
                                                            .text,
                                                      },
                                                    ]
                                                  : styles.cartItemWeight2
                                              }
                                              numberOfLines={
                                                1
                                              }>{`(${j.option_title})`}</Text>
                                            <Text
                                              style={
                                                isDarkMode
                                                  ? [
                                                      styles.cartItemWeight3,
                                                      {
                                                        color:
                                                          MyDarkTheme.colors
                                                            .text,
                                                      },
                                                    ]
                                                  : [
                                                      styles.cartItemWeight3,
                                                      {fontWeight: 'bold'},
                                                    ]
                                              }
                                              numberOfLines={1}>{`: ${
                                              cartData?.currency?.symbol
                                            }${Number(
                                              j.quantity_price,
                                            )}`}</Text>
                                          </View>
                                        </View>
                                      </View>
                                      // <View
                                      //   style={{
                                      //     flexDirection: 'row',
                                      //   }}>
                                      //   <View
                                      //     style={{
                                      //       flexDirection: 'row',
                                      //       width: '52%',
                                      //       justifyContent: 'space-between',
                                      //     }}>
                                      //     <View
                                      //       style={{
                                      //         flexDirection: 'row',
                                      //         flex: 0.8,
                                      //       }}>
                                      //       <Text
                                      //   style={
                                      //     isDarkMode
                                      //       ? [
                                      //           styles.cartItemWeight2,
                                      //           {
                                      //             color:
                                      //               MyDarkTheme.colors
                                      //                 .text,
                                      //           },
                                      //         ]
                                      //       : styles.cartItemWeight2
                                      //   }
                                      //   numberOfLines={1}>
                                      //   {j.addon_title}
                                      // </Text>
                                      //       <Text
                                      //         style={
                                      //           {
                                      //             ...styles.cartItemWeight2,
                                      //             color: isDarkMode
                                      //               ? MyDarkTheme.colors.text
                                      //               : colors.textGreyB,
                                      //           }

                                      //           // colors.textGreyB
                                      //         }
                                      //         numberOfLines={1}>
                                      //         {` (${j.option_title})`}
                                      //       </Text>
                                      //     </View>
                                      //     <Text>:</Text>
                                      //   </View>

                                      // <Text
                                      //   style={
                                      //     isDarkMode
                                      //       ? [
                                      //           styles.cartItemWeight2,
                                      //           {
                                      //             color:
                                      //               MyDarkTheme.colors.text,
                                      //           },
                                      //         ]
                                      //       : [
                                      //           styles.cartItemWeight2,
                                      //           {color: colors.textGrey},
                                      //         ]
                                      //   }
                                      //   numberOfLines={1}>{` ${
                                      //   currencies?.primary_currency?.symbol
                                      // }${currencyNumberFormatter(
                                      //   (
                                      //     Number(j.price) *
                                      //     Number(j.multiplier)
                                      //   ).toFixed(2),
                                      // )} x ${Number(j.quantity)} =  ${
                                      //   currencies?.primary_currency?.symbol
                                      // }${currencyNumberFormatter(
                                      //   (
                                      //     Number(j.price) *
                                      //     Number(j.quantity)
                                      //   ).toFixed(2),
                                      // )}`}</Text>
                                      // </View>
                                    );
                                  })
                                : null}
                            </View>
                          </View>
                        </View>
                        {/* <TouchableOpacity
                          onPress={() => _selectItemToUpdate(item)}
                          style={{marginTop: moderateScale(5)}}>
                          <Text
                            style={{
                              color: colors?.blue,
                              fontFamily: fontFamily?.bold,
                              fontSize: moderateScale(12),
                            }}>
                            {strings.EDIT}
                          </Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                          style={{
                            alignSelf: 'flex-end',
                            marginRight: moderateScale(14),
                            marginTop: moderateScale(6),
                          }}
                          onPress={() => openDeleteView(i)}>
                          <FastImage
                            source={imagePath.deleteRed}
                            resizeMode="contain"
                            style={{
                              width: moderateScale(16),
                              height: moderateScale(16),
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    {!!cartData?.delay_date && (
                      <Text
                        style={{
                          fontSize: moderateScale(12),
                          fontFamily: fontFamily.medium,
                          color: colors.redFireBrick,
                          marginBottom: moderateScale(3),
                        }}>{`${
                        i?.product.delay_order_hrs > 0 ||
                        i?.product.delay_order_min > 0
                          ? strings.PREPARATION_TIME_IS
                          : ''
                      }${
                        i?.product.delay_order_hrs > 0
                          ? ` ${i?.product.delay_order_hrs} hrs`
                          : ''
                      }${
                        i?.product.delay_order_min > 0
                          ? ` ${i?.product.delay_order_min} mins`
                          : ''
                      }`}</Text>
                    )}

                    {/* <View style={styles.dashedLine} /> */}
                  </Animated.View>
                  // </Swipeable>
                );
              })
            : null}
          {/************ end render cart items *************/}
          {item?.isDeliverable ? null : (
            <View style={{marginHorizontal: moderateScale(10)}}>
              <Text
                style={{
                  fontSize: moderateScale(12),
                  fontFamily: fontFamily.medium,
                  color: colors.redFireBrick,
                }}>
                {strings.ITEM_NOT_DELIVERABLE}
              </Text>
            </View>
          )}
          {/* offerview */}
          {!!item?.is_promo_code_available && (
            <TouchableOpacity
              disabled={item?.couponData ? true : false}
              onPress={() => _getAllOffers(item.vendor, cartData)}
              style={styles.offersViewB}>
              {item?.couponData ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flex: 0.7,
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: moderateScale(16),
                      height: moderateScale(16),
                    }}>
                    <FastImage
                      style={{tintColor: themeColors.primary_color}}
                      source={imagePath.percent}
                      resizeMode="contain"
                      // style={{
                      //   width: moderateScale(16),
                      //   height: moderateScale(16),
                      // }}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.viewOffers,
                        {marginLeft: moderateScale(10)},
                      ]}>
                      {`${strings.CODE} ${item?.couponData?.name} ${strings.APPLYED}`}
                    </Text>
                  </View>
                  <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                    {/* <Image source={imagePath.crossBlueB}  /> */}
                    <Text
                      onPress={() => _removeCoupon(item, cartData)}
                      style={[
                        styles.removeCoupon,
                        {color: colors.cartItemPrice},
                      ]}>
                      {strings.REMOVE}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={{tintColor: themeColors.primary_color}}
                    source={imagePath.percent}
                  />
                  <Text
                    style={[
                      styles.viewOffers,
                      {marginLeft: moderateScale(10)},
                    ]}>
                    {strings.APPLY_PROMO_CODE}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {/* start amount view       */}
          <View
            style={{
              marginHorizontal: moderateScale(4),
              marginTop: moderateScaleVertical(8),
            }}>
            {!!item?.discount_amount && (
              <View style={styles.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.priceItemLabel
                  }>
                  {strings.COUPON_DISCOUNT}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.priceItemLabel
                  }>{`- ${cartData?.currency?.symbol}${currencyNumberFormatter(
                  Number(
                    item?.discount_amount ? item?.discount_amount : 0,
                  ).toFixed(2),
                )}`}</Text>
              </View>
            )}
            {!!item?.deliver_charge && (
              <View style={styles.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.priceItemLabel
                  }>
                  {strings.DELIVERY_CHARGES}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.priceItemLabel
                  }>{`${cartData?.currency?.symbol}${currencyNumberFormatter(
                  Number(
                    item?.deliver_charge ? item?.deliver_charge : 0,
                  ).toFixed(2),
                )}`}</Text>
              </View>
            )}
            <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>
                {strings.AMOUNT}
              </Text>

              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel2,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                    : styles.priceItemLabel2
                }>
                {/* {currencies?.primary_currency?.symbol} */}
                {cartData?.currency?.symbol}
                {currencyNumberFormatter(
                  Number(
                    item?.payable_amount ? item?.payable_amount : 0,
                  ).toFixed(2),
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const setModalVisible = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible: visible,
        type: type,
        selectedId: id,
      });
    } else {
      // showError(strings.UNAUTHORIZED_MESSAGE);
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    }
  };
  const setModalVisibleForAddessModal = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({isVisible: false});
      setTimeout(() => {
        updateState({
          updateData: data,
          isVisibleAddressModal: visible,
          type: type,
          selectedId: id,
        });
      }, 1000);
    } else {
      // showError(strings.UNAUTHORIZED_MESSAGE);
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    }
  };

  const selectedTip = tip => {
    if (selectedTipvalue == 'custom') {
      updateState({selectedTipvalue: tip, selectedTipAmount: null});
    } else {
      if (selectedTipvalue && selectedTipvalue?.value == tip?.value) {
        updateState({selectedTipvalue: null, selectedTipAmount: null});
      } else {
        updateState({selectedTipvalue: tip, selectedTipAmount: tip?.value});
      }
    }
  };

  const _onGiftBoxSelection = () => {
    updateState({isGiftBoxSelected: !isGiftBoxSelected});
  };

  //get footer start
  const getFooter = () => {
    return (
      <View style={{}}>
        <TextInput
          value={instruction}
          editable={false}
          onChangeText={instruction => updateState({instruction})}
          multiline={true}
          numberOfLines={4}
          style={{
            ...styles.instructionView,
            backgroundColor: isDarkMode
              ? colors.whiteOpacity15
              : colors.greyNew,
          }}
          placeholderTextColor={
            isDarkMode ? colors.textGreyB : colors.textGreyB
          }
          placeholder={strings.SPECIAL_INSTRUCTION}
        />

        {/* Laundry Section only */}
        {!!(businessType == 'laundry') && (
          <View style={styles.laundrySection}>
            <View>
              <View style={{flex: 0.5, flexWrap: 'wrap'}}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.LaundryApppriceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.LaundryApppriceItemLabel
                  }>
                  {strings.COMMENTFORPICKUPDRIVER}
                </Text>
              </View>
              <View style={{flex: 0.5, marginTop: moderateScale(5)}}>
                <TextInput
                  value={pickupDriverComment}
                  onChangeText={text =>
                    updateState({pickupDriverComment: text})
                  }
                  placeholder={strings.PLACEHOLDERCOMMENTFORPICKUPDRIVER}
                  // placeholderTextColor={colors.textGreyOpcaity6}
                  style={{
                    height: 40,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                    backgroundColor: colors.white,
                  }}
                  returnKeyType={'done'}
                  placeholderTextColor={
                    isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7
                  }
                />
              </View>
            </View>
            <View style={{marginTop: moderateScale(15)}}>
              <View style={{flex: 0.5, flexWrap: 'wrap'}}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.LaundryApppriceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.LaundryApppriceItemLabel
                  }>
                  {strings.COMMENTFORDROPUPDRIVER}
                </Text>
              </View>
              <View style={{flex: 0.5, marginTop: moderateScale(5)}}>
                <TextInput
                  value={dropOffDriverComment}
                  onChangeText={text =>
                    updateState({dropOffDriverComment: text})
                  }
                  // placeholderTextColor={colors.textGreyOpcaity6}
                  placeholder={strings.PLACEHOLDERCOMMENTFORDROPUPDRIVER}
                  style={{
                    height: 40,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                    backgroundColor: colors.white,
                  }}
                  returnKeyType={'done'}
                  placeholderTextColor={
                    isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7
                  }
                />
              </View>
            </View>
            <View style={{marginTop: moderateScale(15)}}>
              <View style={{flex: 0.5, flexWrap: 'wrap'}}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.LaundryApppriceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.LaundryApppriceItemLabel
                  }>
                  {strings.COMMENTFORVENDOR}
                </Text>
              </View>
              <View style={{flex: 0.5, marginTop: moderateScale(5)}}>
                <TextInput
                  // placeholderTextColor={colors.textGreyOpcaity6}
                  placeholder={strings.PLACEHOLDERCOMMENTFORVENDOR}
                  value={vendorComment}
                  onChangeText={text => updateState({vendorComment: text})}
                  style={{
                    height: 40,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                    backgroundColor: colors.white,
                  }}
                  returnKeyType={'done'}
                  placeholderTextColor={
                    isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7
                  }
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: moderateScale(20),
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => _selectTimeLaundry('pickup')}
                style={{flex: 0.5, flexDirection: 'row'}}>
                <Image source={imagePath.pickUpSchedule} />
                <View>
                  <Text
                    style={
                      isDarkMode
                        ? [
                            styles.LaundryApppriceItemLabel2,
                            {color: MyDarkTheme.colors.text},
                          ]
                        : styles.LaundryApppriceItemLabel2
                    }>
                    {strings.SCEDULEPICKUP}
                  </Text>
                  {localePickupDate && (
                    <Text
                      numberOfLines={2}
                      style={
                        isDarkMode
                          ? [
                              styles.LaundryApppriceItemLabel3,
                              {color: MyDarkTheme.colors.text},
                            ]
                          : styles.LaundryApppriceItemLabel3
                      }>
                      {localePickupDate ? localePickupDate : ''}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => _selectTimeLaundry('dropoff')}
                style={{flex: 0.5, flexDirection: 'row'}}>
                <Image source={imagePath.dropOffSchedule} />
                <View>
                  <Text
                    style={
                      isDarkMode
                        ? [
                            styles.LaundryApppriceItemLabel2,
                            {color: MyDarkTheme.colors.text},
                          ]
                        : styles.LaundryApppriceItemLabel2
                    }>
                    {strings.SCEDULEDROP}
                  </Text>

                  {localeDropOffDate && (
                    <Text
                      numberOfLines={2}
                      style={
                        isDarkMode
                          ? [
                              styles.LaundryApppriceItemLabel3,
                              {color: MyDarkTheme.colors.text},
                            ]
                          : styles.LaundryApppriceItemLabel3
                      }>
                      {localeDropOffDate
                        ? localeDropOffDate
                        : strings.SCEDULEDROP}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* tip_before_order view start */}

        {/* {!!appData?.profile?.preferences?.tip_before_order &&
          !!cartData?.tip &&
          cartData?.tip.length > 0 && (
            <View
              style={[
                styles.bottomTabLableValue,
                {
                  flexDirection: 'column',
                },
              ]}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceTipLabel, {color: MyDarkTheme.colors.text}]
                    : [styles.priceTipLabel]
                }>
                {strings.DOYOUWANTTOGIVEATIP}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{flexGrow: 1}}>
                {cartData?.total_payable_amount !== 0 &&
                  cartData?.tip.map((j, jnx) => {
                    return (
                      <TouchableOpacity
                        key={String(jnx)}
                        style={[
                          styles.tipArrayStyle,
                          {
                            backgroundColor:
                              selectedTipvalue?.value == j?.value
                                ? themeColors.primary_color
                                : 'transparent',
                            flex: 0.18,
                          },
                        ]}
                        onPress={() => selectedTip(j)}>
                        <Text
                          style={
                            isDarkMode
                              ? {
                                  color:
                                    selectedTipvalue?.value == j?.value
                                      ? colors.white
                                      : MyDarkTheme.colors.text,
                                }
                              : {
                                  color:
                                    selectedTipvalue?.value == j?.value
                                      ? colors.white
                                      : colors.black,
                                }
                          }>
                          {` ${j.value}`}
                        </Text>
                        <Text
                          style={{
                            color:
                              selectedTipvalue?.value == j?.value
                                ? colors.white
                                : colors.textGreyB,
                          }}>
                          {j.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                {cartData?.total_payable_amount !== 0 && (
                  <TouchableOpacity
                    style={[
                      styles.tipArrayStyle2,
                      {
                        backgroundColor:
                          selectedTipvalue == 'custom'
                            ? themeColors.primary_color
                            : 'transparent',
                        flex: cartData?.total_payable_amount !== 0 ? 0.45 : 0.2,
                      },
                    ]}
                    onPress={() => selectedTip('custom')}>
                    <Text
                      style={
                        isDarkMode
                          ? {
                              color:
                                selectedTipvalue == 'custom'
                                  ? colors.white
                                  : MyDarkTheme.colors.text,
                            }
                          : {
                              color:
                                selectedTipvalue == 'custom'
                                  ? colors.white
                                  : colors.black,
                            }
                      }>
                      {strings.CUSTOM}
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>

              {!!selectedTipvalue && selectedTipvalue == 'custom' && (
                <View
                  style={{
                    borderRadius: 5,
                    borderWidth: 0.5,
                    borderColor: colors.textGreyB,
                    height: 40,
                    marginTop: moderateScaleVertical(8),
                  }}>
                  <TextInput
                    value={selectedTipAmount}
                    onChangeText={text =>
                      updateState({selectedTipAmount: text})
                    }
                    style={{
                      height: 40,
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7,
                    }}
                    maxLength={5}
                    returnKeyType={'done'}
                    keyboardType={'number-pad'}
                    placeholder={strings.ENTER_CUSTOM_AMOUNT}
                    placeholderTextColor={
                      isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7
                    }
                  />
                </View>
              )}
            </View>
          )} */}
        {/* tip_before_order view end */}

        {/* {appData?.profile?.preferences?.gifting == 1 && (
          <View
            style={{
              borderTopWidth: 0.8,
              borderBottomWidth: 0.8,
              paddingVertical: moderateScaleVertical(8),
              borderColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.lightGreyBg,
            }}>
            <TouchableOpacity
              onPress={_onGiftBoxSelection}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 16,
              }}
              activeOpacity={1}>
              <Image
                style={{tintColor: themeColors.primary_color}}
                source={
                  isGiftBoxSelected
                    ? imagePath.checkBox2Active
                    : imagePath.checkBox2InActive
                }
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: moderateScale(12),
                }}>
                <Image
                  source={imagePath.icGiftIcon}
                  style={{
                    marginTop: moderateScale(-3),
                    tintColor: colors.blackOpacity43,
                  }}
                />
                <Text
                  style={{
                    ...styles.priceTipLabel,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                    marginLeft: moderateScale(6),
                  }}>
                  {strings.DOES_THIS_INCLUDE_GIFT}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )} */}

        <View style={styles.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                : styles.priceItemLabel
            }>
            {strings.SUBTOTAL}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                : styles.priceItemLabel
            }>{`${cartData?.currency?.symbol}${currencyNumberFormatter(
            Number(cartData?.gross_paybale_amount).toFixed(2),
          )}`}</Text>
        </View>
        {!!cartData?.wallet_amount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>{`${cartData?.currency?.symbol}${currencyNumberFormatter(
              Number(
                cartData?.wallet_amount ? cartData?.wallet_amount : 0,
              ).toFixed(2),
            )}`}</Text>
          </View>
        )}
        {!!cartData?.loyalty_amount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>
              {strings.LOYALTY}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>{`-${cartData?.currency?.symbol}${currencyNumberFormatter(
              Number(
                cartData?.loyalty_amount ? cartData?.loyalty_amount : 0,
              ).toFixed(2),
            )}`}</Text>
          </View>
        )}

        {!!cartData?.wallet_amount_used && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>{`-${cartData?.currency?.symbol}${currencyNumberFormatter(
              Number(
                cartData?.wallet_amount_used ? cartData?.wallet_amount_used : 0,
              ).toFixed(2),
            )}`}</Text>
          </View>
        )}
        {!!cartData?.total_subscription_discount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>
              {strings.TOTALSUBSCRIPTION}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>{`-${cartData?.currency?.symbol}${currencyNumberFormatter(
              Number(cartData?.total_subscription_discount).toFixed(2),
            )}`}</Text>
          </View>
        )}
        {(cartData?.total_tax > 0 || cartData?.total_service_fee > 0) && (
          <Animatable.View
            style={{
              ...styles.bottomTabLableValue,
              marginTop: moderateScale(8),
              marginBottom: moderateScale(2),
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              hitSlop={hitSlopProp}
              onPress={() => updateState({showTaxFeeArea: !showTaxFeeArea})}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    ...styles.priceItemLabel,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyB,
                  }}>
                  {strings.TAXES_FEES}
                </Text>

                <Image
                  source={imagePath.dropDownNew}
                  style={{
                    transform: [{scaleY: showTaxFeeArea ? -1 : 1}],
                    marginHorizontal: moderateScale(2),
                  }}
                />
              </View>
            </TouchableOpacity>

            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>{`${cartData?.currency?.symbol}${currencyNumberFormatter(
              (
                Number(cartData?.total_tax ? cartData?.total_tax : 0) +
                Number(
                  cartData?.total_service_fee ? cartData?.total_service_fee : 0,
                )
              ).toFixed(2),
            )}`}</Text>
          </Animatable.View>
        )}
        {showTaxFeeArea && (
          <View>
            <Animatable.View
              animation="fadeIn"
              style={{marginLeft: moderateScale(15)}}>
              {cartData?.total_service_fee > 0 && (
                <View
                  style={{...styles.bottomTabLableValue, marginVertical: 1}}>
                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}>
                    {strings.TOTAL_SERVICE_FEE}
                  </Text>

                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}>{`${cartData?.currency?.symbol}${currencyNumberFormatter(
                    Number(
                      cartData?.total_service_fee
                        ? cartData?.total_service_fee
                        : 0,
                    ).toFixed(2),
                  )}`}</Text>
                </View>
              )}
              {cartData?.total_tax > 0 && (
                <View
                  style={{...styles.bottomTabLableValue, marginVertical: 1}}>
                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}>
                    {strings.TAX_AMOUNT}
                  </Text>

                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}>{`${cartData?.currency?.symbol}${currencyNumberFormatter(
                    Number(
                      cartData?.total_tax ? cartData?.total_tax : 0,
                    ).toFixed(2),
                  )}`}</Text>
                </View>
              )}
            </Animatable.View>
          </View>
        )}

        <View style={styles.amountPayable}>
          <Text
            style={{
              ...styles.priceItemLabel2,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {strings.AMOUNT_PAYABLE}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel2, {color: MyDarkTheme.colors.text}]
                : styles.priceItemLabel2
            }>{`${cartData?.currency?.symbol}${currencyNumberFormatter(
            Number(cartData?.total_payable_amount).toFixed(2),
          )}`}</Text>
        </View>

        {/* <TouchableOpacity
          onPress={() =>
            !!userData?.auth_token
              ? moveToNewScreen(navigationStrings.ALL_PAYMENT_METHODS)()
              : navigation.navigate(navigationStrings.OUTER_SCREEN, {})
          }
          style={styles.paymentMainView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FastImage
              source={imagePath.paymentMethod}
              resizeMode="contain"
              style={{
                width: moderateScale(32),
                height: moderateScale(32),
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
            />

            <Text
              style={{
                ...styles.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                marginLeft: moderateScale(4),
              }}>
              {selectedPayment.title_lng
                ? selectedPayment.title_lng
                : selectedPayment.title
                ? selectedPayment.title
                : strings.SELECT_PAYMENT_METHOD}
            </Text>
          </View>
          <View>
            <FastImage
              source={imagePath.goRight}
              resizeMode="contain"
              style={{
                width: moderateScale(14),
                height: moderateScale(14),
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
              }}
            />
          </View>
        </TouchableOpacity>
     

        */}

        <View
          style={{
            height: moderateScaleVertical(80),
            backgroundColor: colors.transparent,
          }}></View>
      </View>
    );
  };

  //end footer

  //Header section of cart screen
  const getHeader = () => {
    console.log(vendorAddress, 'vendorAddress');
    return (
      <TouchableOpacity
        disabled={!!vendorAddress}
        // onPress={() => setModalVisible(true)}
        style={{
          ...styles.topLable,
          marginVertical: moderateScale(7),
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', flex: 0.85}}>
          <FastImage
            source={imagePath.map1}
            resizeMode="contain"
            style={{
              width: moderateScale(50),
              height: moderateScale(50),
            }}
          />
          <View style={styles.addressView}>
            <Text
              style={{
                ...styles.homeTxt,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {vendorAddress
                ? strings.HOME_1
                : vendorAddress?.address
                ? strings.HOME
                : strings.ADD_ADDRESS}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                ...styles.addAddressTxt,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                marginTop: moderateScaleVertical(4),
              }}>
              {vendorAddress
                ? vendorAddress?.address
                : strings.TAP_HERE_ADD_ADDRESS}
            </Text>
          </View>
        </View>
        {/* {!vendorAddress && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}>
            <FastImage
              source={imagePath.icEdit1}
              resizeMode="contain"
              style={styles.editIcon}
            />
          </TouchableOpacity>
        )} */}
      </TouchableOpacity>
    );
  };

  //Native modal for Modal
  const openClearCartModal = () => {
    Alert.alert('', strings.AREYOUSURE, [
      {
        text: strings.CANCEL,
        onPress: () => {},
        // style: 'destructive',
      },
      {text: strings.CONFIRM, onPress: () => bottomButtonClick()},
    ]);
  };
  //SelectAddress
  const selectAddress = address => {
    if (!!userData?.auth_token) {
      // updateState({ isLoadingB: true });
      let data = {};
      let query = `/${address?.id}`;
      actions
        .setPrimaryAddress(query, data, {
          code: appData?.profile?.code,
        })
        .then(res => {
          actions.saveAddress(address);
          updateState({
            isVisible: false,
            isLoadingB: false,
            selectedAddress: address,
            placeLoader: false,
          });
        })
        .catch(errorMethod);
    }
  };

  //Add and update the addreess
  const addUpdateLocation = childData => {
    // setModalVisible(false);
    updateState({isLoading: true});
    actions
      .addAddress(childData, {
        code: appData?.profile?.code,
      })
      .then(res => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isVisible: false,
          isVisibleAddressModal: false,
          placeLoader: false,
        });
        getAllAddress();
        setTimeout(() => {
          let address = res.data;
          address['is_primary'] = 1;

          updateState({
            selectedAddress: address,
          });
          actions.saveAddress(address);
        });

        showSuccess(res.message);
      })
      .catch(error => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isVisible: false,
          isVisibleAddressModal: false,
        });
        showError(error?.message || error?.error);
      });
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  const onClose = () => {
    updateState({
      isVisibleTimeModal: false,
      selectedDateFromCalendar: '',
      selectedTimeSlots: '',
    });
  };

  const onDateChangeSecond = value => {
    if (modalType == 'pickup') {
      updateState({
        sheduledpickupdate: value,
        localePickupDate: `${value.toLocaleDateString(selectedLanguage, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}, ${value.toLocaleTimeString(selectedLanguage, {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
      });
    } else {
      updateState({
        sheduleddropoffdate: value,
        localeDropOffDate: `${value.toLocaleDateString(selectedLanguage, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}, ${value.toLocaleTimeString(selectedLanguage, {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
      });
    }
  };

  const onDateChange = value => {
    alert('dfdf');
    updateState({
      scheduleType: 'schedule',
      sheduledorderdate: value,
      localeSheduledOrderDate: `${value.toLocaleDateString(selectedLanguage, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}, ${value.toLocaleTimeString(selectedLanguage, {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
    });
  };

  useEffect(() => {
    if (!!checkCartItem?.data) {
      console.log('useEffect 5');
      getItem('deepLinkUrl')
        .then(res => {
          if (res) {
            let table_number = getParameterByName('table', res);
            updateState({deepLinkUrl: table_number});
          }
        })
        .catch(errorMethod);
    }
  }, [deepLinkUrl]);

  const _onTableSelection = item => {
    const data = {
      vendor_id: item.vendor_id,
      table: item?.id,
    };
    _vendorTableCart(data, item);
  };

  const _vendorTableCart = (data, item) => {
    if (!!userData?.auth_token) {
      actions
        .vendorTableCart(data, {
          code: appData?.profile?.code,
        })
        .then(res => {
          removeItem('deepLinkUrl');
          setItem('selectedTable', item?.label);
        })
        .catch(errorMethod);
      return;
    }
    return;
  };

  const onPressRecommendedVendors = item => {
    if (!item.is_show_category || item.is_show_category) {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            // categoryData: data,
          })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: item?.id,
            vendor: true,
            name: item?.name,
          })();

      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  const ListEmptyComp = () => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#fff',
          }}>
          <FastImage
            source={{
              uri: Image.resolveAssetSource(imagePath.placeholderbee).uri,
            }}
            style={{
              marginVertical: moderateScaleVertical(20),
              height: moderateScale(120),
              width: moderateScale(120),
            }}

            // resizeMode="contain"s
          />
          <Text style={{...styles.textStyle}}>
            {strings.YOUR_CART_EMPTY_ADD_ITEMS}
          </Text>
        </View>
        <HorizontalLine
          lineStyle={{
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode
              ? colors.whiteOpacity77
              : colors.greyA,
            marginVertical: moderateScaleVertical(16),
          }}
        />

        <View style={{marginVertical: moderateScaleVertical(8)}} />


        <View style={{marginBottom: moderateScale(100)}} />
      </View>
    );
  };
  const renderCardItemLoader = () => {
    return (
      <View>
        <HeaderLoader
          widthLeft={moderateScale(140)}
          rectWidthLeft={moderateScale(140)}
          heightLeft={15}
          rectHeightLeft={15}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(30),
          }}
          isRight={false}
        />
        <ProductListLoader
          widthLeft={moderateScale(100)}
          mainView={{
            marginHorizontal: moderateScale(15),
            marginTop: moderateScale(5),
            alignItems: 'flex-start',
          }}
        />
        <HeaderLoader
          widthLeft={width - moderateScale(30)}
          rectWidthLeft={width - moderateScale(30)}
          heightLeft={moderateScale(35)}
          rectHeightLeft={moderateScale(35)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(15),
          }}
          isRight={false}
        />
        <HeaderLoader
          widthLeft={moderateScale(90)}
          rectWidthLeft={moderateScale(90)}
          heightLeft={moderateScale(15)}
          rectHeightLeft={moderateScale(15)}
          rectHeightRight={moderateScale(15)}
          heightRight={moderateScale(15)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(15),
          }}
        />
        <HeaderLoader
          widthLeft={moderateScale(90)}
          rectWidthLeft={moderateScale(90)}
          heightLeft={moderateScale(15)}
          rectHeightLeft={moderateScale(15)}
          rectHeightRight={moderateScale(15)}
          heightRight={moderateScale(15)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(8),
          }}
        />
      </View>
    );
  };

  const checkVendorSlots = async date => {
    console.log('vendro slot date', date);
    try {
      let vendorId = cartItems[0].vendor.id;
      // vendor_id,date,delivery
      const res = await actions.checkVendorSlots(
        `?vendor_id=${vendorId}&date=${date}&delivery=${dineInType}`,
        {
          code: appData?.profile?.code,
          // currency: currencies?.primary_currency?.id,
          // language: languages?.primary_language?.id,
          // systemuser: DeviceInfo.getUniqueId(),
          timezone: RNLocalize.getTimeZone(),
          // device_token: DeviceInfo.getUniqueId(),
        },
      );
      console.log('avail slots++', res);
      updateState({
        availableTimeSlots: res,
      });
      if (res.length == 0) {
        updateState({selectedTimeSlots: ''});
      }
    } catch (error) {
      console.log('error riased', error);
    }
  };
  const onSelectTime = item => {
    console.log('sleecte time slots', item);
    updateState({selectedTimeSlots: item.value});
  };

  //Submit the temp cart information to customer
  const _submitTempCartFinal = () => {
    updateState({
      isLoading: true,
    });
    let data = {};
    data['cart_id'] = cartData?.id;
    let url = `https://${getHostName(
      taskDetail?.order?.call_back_url,
    )}/edit-order/temp-cart/submit`;
    actions
      .submitTempCartInformation(url, data, {client: clientInfo?.database_name})
      .then(res => {
        console.log('submitTempCartInformation detail', res);
        // actions.cartItemQty(res);
        updateState({
          cartItems: res.data.products,
          cartData: res.data,
          isLoading: false,
        });
      })
      .catch(errorMethod);
  };

  //Permission popup for temp cart
  const _submitTempCart = () => {
    Alert.alert('', strings.AREYOUSURETEMPCART, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: strings.OK,
        onPress: () => {
          console.log('progress');
          // logout();
          _submitTempCartFinal();
          // navigation.toggleDrawer();
        },
      },
    ]);
  };
  const buttonView = () => {
    if (cartData?.is_submitted) {
      return (
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <View style={[styles.button, {backgroundColor: 'transparent'}]}>
              <Text style={[styles.text2, {color: colors.green}]}>
                {strings.CARTSUBMITEED}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={_submitTempCart}>
          <View style={[styles.button]}>
            <Text style={styles.text}>{strings.SUBMIT}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const renderTimeSlots = ({item, index}) => {
    return (
      <TouchableOpacity
        key={String(index)}
        activeOpacity={0.8}
        onPress={() => onSelectTime(item)}
        style={{
          backgroundColor:
            selectedTimeSlots == item.value
              ? themeColors.primary_color
              : colors.white,
          padding: 8,
          borderRadius: 8,
          borderWidth: selectedTimeSlots == item.value ? 0 : 1,
        }}>
        <Text
          style={{
            color:
              selectedTimeSlots == item.value ? colors.white : colors.black,
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
          }}>
          {item?.value}
        </Text>
      </TouchableOpacity>
    );
  };

  const onSelectDateFromCalendar = day => {
    updateState({
      selectedDateFromCalendar: day.dateString,
      modalType: 'schedule',
    });
    console.log('selected day', day);
    checkVendorSlots(day.dateString);
  };

  const _onPressSearchButton = () => {
    console.log(cartData, 'cartData?.vendor_details');
    moveToNewScreen(navigationStrings.SEARCHPRODUCTOVENDOR, {
      type: staticStrings.VENDOR,
      id: cartData?.vendor_details?.vendor_address?.id,
      taskDetail: taskDetail,
      cartDetail: cartData,
      apiData: apiData,
    })();
  };

  const areyouSureYouwantToClearCart = () => {
    Alert.alert('', strings.AREYOUSURETEMPCARTCLAER, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: strings.OK,
        onPress: () => {
          console.log('progress');
          updateState({
            isLoading: true,
          });
          let data = {};
          data['cart_id'] = cartData?.id;
          let url = `https://${getHostName(
            taskDetail?.order?.call_back_url,
          )}/edit-order/temp-cart/remove`;
          actions
            .removeTempCartInformation(url, data, {
              client: clientInfo?.database_name,
            })
            .then(res => {
              console.log('cart detail', res);
              // actions.cartItemQty(res);
              updateState({
                isLoading: false,
              });
              navigation.goBack();
            })
            .catch(errorMethod);
        },
      },
    ]);
  };

  const customRightView = () => {
    if (cartData?.is_submitted) {
      return null;
    }
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={{marginRight: 20}}
          onPress={() => areyouSureYouwantToClearCart()}>
          <Image
            source={imagePath?.delete}
            style={{tintColor: colors.blackB}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => _onPressSearchButton()}>
          <Image source={imagePath?.searchIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const updateCartItems = (item, quanitity, productId, cartID) => {
    playHapticEffect(hapticEffects.impactLight);
    console.log('selcted section', selectedSection);

    if (!!selectedSection) {
      let updatedSection = selectedSection.data.map((x, xnx) => {
        if (x?.id == item?.id) {
          return {
            ...x,
            qty: quanitity,
            cart_product_id: productId,
            isRemove: false,
          };
        }
        return x;
      });
      selectedSection['data'] = updatedSection;
      updateState({
        sectionListData: sectionListData.map((f, fnx) => {
          if (f?.id == selectedSection?.id) {
            return selectedSection;
          }
          return f;
        }),
        cloneSectionList: cloneSectionList.map((f, fnx) => {
          if (f?.id == selectedSection?.id) {
            return selectedSection;
          }
          return f;
        }),
        cartId: cartID,
        storeLocalQty: quanitity,
        isVisibleModal: false,
      });
    } else {
      let updateArray = productListData.map((val, i) => {
        if (val.id == item.id) {
          return {
            ...val,
            qty: quanitity,
            cart_product_id: productId,
            isRemove: false,
          };
        }
        updateState({storeLocalQty: quanitity});
        return val;
      });
      updateState({
        cartId: cartID,
        productListData: updateArray,
        isVisibleModal: false,
      });
    }
  };

  if (isLoadingB) {
    return (
      <WrapperContainer
        bgColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }
        statusBarColor={colors.backgroundGrey}
        source={loaderOne}
        // isLoadingB={isLoadingB}
      >
        <Header centerTitle={strings.CART} leftIcon={imagePath.icBackb} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderLoader
            widthLeft={width - moderateScale(30)}
            rectWidthLeft={width - moderateScale(30)}
            heightLeft={15}
            rectHeightLeft={15}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(10),
            }}
            isRight={false}
          />
          <HeaderLoader
            widthLeft={moderateScale(100)}
            rectWidthLeft={moderateScale(100)}
            heightLeft={15}
            rectHeightLeft={15}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(10),
              alignSelf: 'center',
            }}
            isRight={false}
          />
          {renderCardItemLoader()}
          {renderCardItemLoader()}
          <HeaderLoader
            widthLeft={moderateScale(60)}
            rectWidthLeft={moderateScale(60)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(30),
            }}
          />
          <HeaderLoader
            widthLeft={moderateScale(60)}
            rectWidthLeft={moderateScale(60)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(8),
            }}
          />
          <HeaderLoader
            widthLeft={width - moderateScale(90)}
            rectWidthLeft={width - moderateScale(90)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(20),
            }}
            isRight={false}
          />
          <View style={{flexDirection: 'row'}}>
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(15),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
          </View>
          <HeaderLoader
            widthLeft={moderateScale(90)}
            rectWidthLeft={moderateScale(90)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(15),
            }}
          />
          <HeaderLoader
            widthLeft={width - moderateScale(30)}
            rectWidthLeft={width - moderateScale(30)}
            heightLeft={moderateScale(40)}
            rectHeightLeft={moderateScale(40)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(15),
            }}
            isRight={false}
          />
        </ScrollView>
      </WrapperContainer>
    );
  }
  return (
    <>
      <WrapperContainer
        bgColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }
        statusBarColor={colors.backgroundGrey}
        source={loaderOne}
        isLoadingB={isLoading}>
        <Header
          centerTitle={strings.CART}
          // noLeftIcon
          // rightIcon={imagePath?.searchIcon}
          leftIconStyle={{tintColor: colors.themeColor}}
          customRight={customRightView}
          // onPressRight={() => _onPressSearchButton()}
        />

        <View
          style={
            isDarkMode
              ? [
                  styles.mainComponent,
                  {backgroundColor: MyDarkTheme.colors.background},
                ]
              : styles.mainComponent
          }>
          {/* <SwipeListView
          disableRightSwipe
          data={cartItems}
          renderItem={_renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={width}
          // onSwipeValueChange={onSwipeValueChange}
          useNativeDriver={false}
        /> */}

          {console.log(cartItems, 'cartItems>>cartItems')}
          <FlatList
            key={swipeKey + Math.random()}
            data={cartItems}
            extraData={cartItems}
            ListHeaderComponent={cartItems?.length ? getHeader() : null}
            ListFooterComponent={cartItems?.length ? getFooter() : null}
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: colors.backgroundGrey,flex: 1}}
            keyExtractor={(item, index) => String(index)}
            renderItem={_renderItem}
            
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={themeColors.primary_color}
              />
            }
            contentContainerStyle={{
              flexGrow: 1,
            }}
            ListEmptyComponent={() => (!isLoadingB ? <ListEmptyComp /> : <></>)}
          />
        </View>

        {/* Date time modal */}
        <Modal
          transparent={true}
          isVisible={isVisibleTimeModal}
          animationType={'none'}
          style={{margin: 0, justifyContent: 'flex-end'}}
          onLayout={event => {
            updateState({viewHeight: event.nativeEvent.layout.height});
          }}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Image
              style={isDarkMode && {tintColor: MyDarkTheme.colors.white}}
              source={imagePath.crossB}
            />
          </TouchableOpacity>
          <View
            style={
              isDarkMode
                ? [
                    styles.modalMainViewContainer,
                    {backgroundColor: MyDarkTheme.colors.lightDark},
                  ]
                : styles.modalMainViewContainer
            }>
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              style={
                isDarkMode
                  ? [
                      styles.modalMainViewContainer,
                      {backgroundColor: MyDarkTheme.colors.lightDark},
                    ]
                  : styles.modalMainViewContainer
              }>
              <View
                style={{
                  // flex: 0.6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.carType, {color: MyDarkTheme.colors.text}]
                      : styles.carType
                  }>
                  {strings.SELECTDATEANDTIME}
                </Text>
              </View>

              {businessType == 'laundry' && modalType != 'schedule' ? (
                <View
                  style={{
                    alignItems: 'center',
                    // height: height / 3.5,
                  }}>
                  {modalType == 'pickup' ? (
                    <DatePicker
                      locale={selectedLanguage}
                      date={
                        sheduledpickupdate
                          ? new Date(sheduledpickupdate)
                          : new Date()
                      }
                      textColor={isDarkMode ? colors.white : colors.blackB}
                      mode="datetime"
                      minimumDate={
                        !!cartData?.pickup_delay_date
                          ? new Date(cartData?.pickup_delay_date)
                          : new Date()
                      }
                      maximumDate={undefined}
                      // style={styles.datetimePickerText}
                      // onDateChange={setDate}
                      onDateChange={value => onDateChangeSecond(value)}
                    />
                  ) : (
                    <DatePicker
                      locale={selectedLanguage}
                      date={
                        sheduleddropoffdate
                          ? new Date(sheduleddropoffdate)
                          : new Date()
                      }
                      textColor={isDarkMode ? colors.white : colors.blackB}
                      mode="datetime"
                      minimumDate={
                        !!cartData?.dropoff_delay_date
                          ? new Date(cartData?.dropoff_delay_date)
                          : new Date()
                      }
                      maximumDate={undefined}
                      // style={styles.datetimePickerText}
                      // onDateChange={setDate}
                      onDateChange={value => onDateChangeSecond(value)}
                    />
                  )}
                </View>
              ) : (
                <View
                  style={
                    {
                      // alignItems: 'center',
                      // height: height / 4,
                    }
                  }>
                  {(!!availableTimeSlots && availableTimeSlots.length > 0) ||
                  (!!cartData &&
                    !!cartData?.slots &&
                    !!cartData?.slots.length > 0) ? (
                    <Fragment>
                      <ScrollView>
                        <Calendar
                          current={new Date()}
                          minDate={new Date()}
                          onDayPress={onSelectDateFromCalendar}
                          markedDates={{
                            [selectedDateFromCalendar]: {
                              selected: true,
                              disableTouchEvent: true,
                              selectedColor: themeColors.primary_color,
                              selectedTextColor: colors.white,
                            },
                          }}
                          theme={{
                            arrowColor: themeColors.primary_color,
                            textDayFontFamily: fontFamily.medium,
                            textMonthFontFamily: fontFamily.medium,
                            textDayHeaderFontFamily: fontFamily.bold,
                            // textDayFontSize: textScale(12),
                            // textMonthFontSize: textScale(10),
                            // textDayHeaderFontSize: textScale(10),
                          }}
                        />

                        <View>
                          <Text
                            style={{
                              marginHorizontal: moderateScale(24),
                              fontFamily: fontFamily.medium,
                              fontSize: textScale(12),
                              marginBottom: moderateScaleVertical(8),
                              // height:moderateScale(20)
                            }}>
                            Time Slots
                          </Text>
                          <FlatList
                            horizontal
                            data={availableTimeSlots || []}
                            renderItem={renderTimeSlots}
                            keyExtractor={item => item.value || ''}
                            ItemSeparatorComponent={() => (
                              <View style={{marginRight: moderateScale(12)}} />
                            )}
                            ListHeaderComponent={() => (
                              <View style={{marginLeft: moderateScale(24)}} />
                            )}
                            ListFooterComponent={() => (
                              <View style={{marginRight: moderateScale(24)}} />
                            )}
                            ListEmptyComponent={() => (
                              <View>
                                <Text
                                  style={{
                                    fontFamily: fontFamily.medium,
                                    color: colors.redB,
                                  }}>
                                  Slot not available please select another date
                                </Text>
                              </View>
                            )}
                          />
                        </View>
                      </ScrollView>
                    </Fragment>
                  ) : (
                    <DatePicker
                      locale={selectedLanguage}
                      date={
                        sheduledorderdate
                          ? new Date(sheduledorderdate)
                          : new Date()
                      }
                      textColor={isDarkMode ? colors.white : colors.blackB}
                      mode="datetime"
                      minimumDate={
                        !!cartData?.delay_date
                          ? new Date(cartData?.delay_date)
                          : new Date()
                      }
                      maximumDate={undefined}
                      // style={styles.datetimePickerText}
                      // onDateChange={setDate}
                      onDateChange={value => onDateChange(value)}
                    />
                  )}
                </View>
              )}
            </ScrollView>
            <View
              style={[
                styles.bottomAddToCartView,
                {top: viewHeight - height / 6},
              ]}>
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                // textStyle={styles.textStyle}
                onPress={selectOrderDate}
                marginTop={moderateScaleVertical(10)}
                marginBottom={moderateScaleVertical(30)}
                btnText={strings.SELECT}
              />
            </View>
          </View>
        </Modal>
        {buttonView()}
      </WrapperContainer>

      {/* {!!false && (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={[height / 1.5, height / 3]}
          enablePanDownToClose={true}
          activeOffsetY={[-1, 1]}
          failOffsetX={[-5, 5]}
          animateOnMount={true}
          handleComponent={() => (
            <View
              style={{
                height: 0,
                borderTopLeftRadius: 20,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          )}
          onChange={index => {
            if (index === 1) {
              updateState({showShimmer: true});
            }
            playHapticEffect(hapticEffects.impactMedium);
          }}>
          <BottomSheetScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{
              borderTopLeftRadius: moderateScale(15),
              borderTopRightRadius: moderateScale(15),
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.white,
            }}>
            <VariantAddons
              addonSet={selectedCartItem?.add_on}
              variantData={selectedCartItem?.variantSet}
              isVisible={true}
              productdetail={selectedCartItem}
              onClose={() =>
                updateState({isVisibleModal: false, showShimmer: true})
              }
              taskDetail={taskDetail}
              typeId={typeId}
              showShimmer={showShimmer}
              shimmerClose={val => updateState({showShimmer: val})}
              updateCartItems={updateCartItems}
            />
          </BottomSheetScrollView>
        </BottomSheet>
      )} */}
    </>
  );
}
