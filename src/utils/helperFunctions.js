import { callingCountries } from 'country-data';
import { Alert, Animated, Image, BackHandler } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Geocoder from 'react-native-geocoder';
import Geolocation from 'react-native-geolocation-service';
import imagePath from '../constants/imagePath';
import { Toast } from '../library/toastify-react-native';
import * as NavigationService from '../navigation/NavigationService';
import navigationStrings from '../navigation/navigationStrings';
import store from '../redux/store';
import types from '../redux/types';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import { textScale } from '../styles/responsiveSize';
import actions from '../redux/actions';
import strings from './../constants/lang/index';
import { setUserData } from './utils';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { API_BASE_URL } from '../config/urls';

const getCurrentLocation = type =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const cords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        getLocation(
          position.coords.latitude,
          position.coords.longitude,
          type,
        ).then(res => {
          if (type == 'home') {
            const data = {
              ...cords,
              address: res,
            };
            resolve(data);
          } else if (type == 'address') {
            resolve(res);
          }
        });
      },
      error => {
        reject(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });

const getLocation = async (lat, lng, type) => {
  if (type == 'home') {
    try {
      let res = await Geocoder.geocodePosition({ lat, lng });
      let addr = res[0].formattedAddress;
      return addr;
    } catch (err) { }
  } else if (type == 'address') {
    try {
      let res = await Geocoder.geocodePosition({ lat, lng });

      let addr = res[0].formattedAddress;

      let country_id =
        callingCountries[`${res[0].countryCode}`]?.countryCallingCodes[0];
      let street = res[0].streetName;
      let city = res[0].locality;
      let states = res[0].adminArea;
      let pincode = res[0].postalCode;
      let latitude = res[0].position.lat;
      let longitude = res[0].position.lng;

      let data = {
        address: addr,
        street: street,
        city: city,
        states: states,
        latitude: latitude,
        longitude: longitude,
        country_id: country_id,
        pincode: pincode,
        address_type: '1',
      };

      return data;
    } catch (err) { }
  }
};

const showErrorOnModal = (modalRef = null, message = '', duration = 2000) => {
  modalRef.current.showMessage({
    message: message,
    type: 'default',
    backgroundColor: colors.themeColor, // background color

    textStyle: {
      color: colors.white, // text color
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
    },
    style: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
    },
    duration: duration,
  });
};

const showError = (message, duration = 1850) => {
  console.log(message, 'THIS IS MESSAGE');

  showMessage({
    message: 'Error',
    description: message,
    type: 'default',
    backgroundColor: colors.themeColor, // background color
    textStyle: {
      color: colors.white, // text color
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
    },
    // autoHide: true,
    duration: duration,
  });
  // Toast.error(message);
};

const showSuccess = (message, duration = 1500) => {
  showMessage({
    message: strings.SUCCESS,
    description: message,
    type: 'default',
    backgroundColor: colors.themeColor, // background color

    textStyle: {
      color: colors.white, // text color
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
    },
    duration: duration,
  });

  // Toast.success(message);
};
const showInfo = message => {
  // showMessage({
  //   type: 'info',
  //   icon: 'info',
  //   message,
  // });
  Toast.info(message);
};

export function otpTimerCounter(seconds) {
  // alert(seconds)
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  return `${m}:${s}`;
}

export function getRandomColor() {
  const w = Math.floor(Math.random() * 256);
  const x = Math.floor(Math.random() * 256);
  const y = Math.floor(Math.random() * 256);
  const z = 0.3;
  const rgbaColor = 'rgba(' + w + ',' + x + ',' + y + ',' + z + ')';
  return rgbaColor;
}

export function getColorCodeWithOpactiyNumber(color, transparency) {
  /*
HEXA VALUE CHANGE IS DIFFRENT IN JS, HERE THE TRANSPERANCY YOU WANT TO ADD IS ADDED AT THE END
Using an alpha value to update a color’s transparency will change the hex code format from #RRGGBB to #RRGGBBAA (red, green, blue, alpha). 
The first six values (the red, green, and blue ones) stay the exact same. The only difference is the last two values (the AA).
  */
  switch (String(transparency)) {
    case '10':
      return `#${color}1A`;
    case '15':
      return `#${color}26`;
    case '20':
      return `#${color}33`;
    case '25':
      return `#${color}40`;
    case '30':
      return `#${color}4D`;
    case '35':
      return `#${color}59`;
    case '40':
      return `#${color}66`;
    case '50':
      return `#${color}80`;
    case '60':
      return `#${color}99`;
    case '70':
      return `#${color}B3`;
  }
}

export function getImageUrl(url1, url2, dimentions) {
  //
  return `${url1}${dimentions}${url2}`;
}

const androidBackButtonHandler = () => {
  Alert.alert(strings.HOLD_ON, strings.EXIT_WARNING, [
    {
      text: strings.CANCEL,
      onPress: () => null,
      style: 'cancel',
    },
    { text: strings.YES, onPress: () => BackHandler.exitApp() },
  ]);
  return true;
};

//Renaming the object key
const renameKey = (object, key, newKey) => {
  const clonedObj = clone(object);
  const targetKey = clonedObj[key];
  delete clonedObj[key];
  clonedObj[newKey] = targetKey;
  return clonedObj;
};
//cloning object
const clone = obj => Object.assign({}, obj);

export function getAddressComponent(details, update) {
  console.log(details, 'details');
  let pincode = '';
  let city = '';
  let states = '';
  let country = '';
  let country_id = '';
  let address = '';
  let latitude = '';
  let longitude = '';
  let street = '';
  pincode = details?.address_components?.find(addressComponent =>
    addressComponent?.types.includes('postal_code'),
  )?.short_name;

  city = details?.address_components?.find(addressComponent =>
    addressComponent?.types.includes('locality'),
  )?.short_name;

  states = details?.address_components?.find(addressComponent =>
    addressComponent?.types.includes('administrative_area_level_1'),
  )?.short_name;

  street = details?.address_components?.find(addressComponent =>
    addressComponent?.types.includes('administrative_area_level_2'),
  )?.short_name;

  country = details?.address_components?.find(addressComponent =>
    addressComponent?.types?.includes('country'),
  )?.long_name;

  let country_sort = details?.address_components?.find(addressComponent =>
    addressComponent?.types?.includes('country'),
  )?.short_name;
  country_id = callingCountries[`${country_sort}`]?.countryCallingCodes[0];
  address = details?.formatted_address;
  latitude = details?.geometry?.location?.lat;
  longitude = details?.geometry?.location?.lng;
  let data = {
    country_code: country_sort,
    city: city,
    states: states,
    street: street,
    country: country,
    latitude: latitude,
    longitude: longitude,
    pincode: pincode,
    phonecode: country_id,
    address: address,
    // address_type: '1',
  };
  if (update == 'update') {
    let data = {
      code: country_sort,
      city: city,
      states: states,
      street: street,
      country: country,
      latitude: latitude,
      longitude: longitude,
      pincode: pincode,
      country_id: country_id,
      address: address,
      // address_type: '1',
    };
    return data;
  }
  return data;
}

// const {dispatch} = store;

export const saveUserData = data => {
  store.dispatch({
    type: types.LOGIN,
    payload: data,
  });
};

export const sessionHandler = error => {
  // actions.sessionLogoutUser(true);
  console.log(error, 'error>error>');
  setUserData(null).then(suc => {
    saveUserData({});
  });
  showError(error);
  // NavigationService.navigate(navigationStrings.LOGIN);
};

export const getScaleTransformationStyle = (
  animated: Animated.Value,
  startSize: number = 1,
  endSize: number = 0.95,
) => {
  const interpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [startSize, endSize],
  });
  return {
    transform: [{ scale: interpolation }],
  };
};

export const pressInAnimation = (
  animated: Animated.Value,
  duration: number = 150,
) => {
  animated.setValue(0);
  Animated.timing(animated, {
    toValue: 1,
    duration,
    useNativeDriver: true,
  }).start();
};

export const pressOutAnimation = (
  animated: Animated.Value,
  duration: number = 150,
) => {
  animated.setValue(1);
  Animated.timing(animated, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  }).start();
};

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const getUrlRoutes = (url, indexOfRoute) => {
  const route = url.replace(/.*?:\/\//g, '');
  const routeName = route.split('/')[0 + indexOfRoute];

  return routeName;
};

const getHostName = url => {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (
    match != null &&
    match.length > 2 &&
    typeof match[2] === 'string' &&
    match[2].length > 0
  ) {
    return match[2];
  } else {
    return null;
  }
};

const getDomain = url => {
  var hostName = getHostName(url);
  var domain = hostName;

  if (hostName != null) {
    var parts = hostName.split('.').reverse();

    if (parts != null && parts.length > 1) {
      domain = parts[1] + '.' + parts[0];

      if (hostName.toLowerCase().indexOf('.co.uk') != -1 && parts.length > 2) {
        domain = parts[2] + '.' + domain;
      }
    }
  }

  return domain;
};

const playHapticEffect = (effect = 'clockTick') => {
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: true,
  };

  ReactNativeHapticFeedback.trigger(effect, options);
};

const hapticEffects = {
  effectClick: 'effectClick',
  effectDoubleClick: 'effectDoubleClick',
  effectHeavyClick: 'effectHeavyClick',
  effectTick: 'effectTick',
  impactHeavy: 'impactHeavy',
  impactMedium: 'impactMedium',
  impactLight: 'impactLight',
  notificationError: 'notificationError',
  notificationSuccess: 'notificationSuccess',
  notificationWarning: 'notificationWarning',
  rigid: 'rigid',
  selection: 'selection',
  soft: 'soft',

  // (Android only)
  clockTick: 'clockTick',
  contextClick: 'contextClick',
  keyboardPress: 'keyboardPress',
  keyboardRelease: 'keyboardRelease',
  keyboardTap: 'keyboardTap',
  longPress: 'longPress',
  textHandleMove: 'textHandleMove',
  virtualKey: 'virtualKey',
  virtualKeyRelease: 'virtualKeyRelease',
};

export const getSubDomain = url => {
  return url.split('/')[3];
};
export const showhideNotificationModal = (notificationType) => {

  switch (notificationType) {
    case 'bid_ride_request':
      return false
    case 'delay_time':
      return false
    default:
      return true
  }
}

export {
  hapticEffects,
  showError,
  showSuccess,
  showInfo,
  getCurrentLocation,
  androidBackButtonHandler,
  renameKey,
  getParameterByName,
  getUrlRoutes,
  getHostName,
  getDomain,
  playHapticEffect,
  showErrorOnModal,
};
