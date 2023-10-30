import { useFocusEffect } from '@react-navigation/native';
import codes from 'country-calling-code';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import DeviceCountry from 'react-native-device-country';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNOtpVerify from 'react-native-otp-verify';
import ScaledImage from 'react-native-scalable-image';
import { useSelector } from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import Header from '../../../Components/Header';
import { loaderOne } from '../../../Components/Loaders/AnimatedLoaderFiles';
import PhoneNumberInput from '../../../Components/PhoneNumberInput';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import { showError, showSuccess } from '../../../utils/helperFunctions';
import {
  chekLocationPermission,
  locationPermission,
} from "../../../utils/permissions";
import { openAppSetting } from "../../../utils/openNativeApp";


import validator from '../../../utils/validations';
import stylesFunc from './styles';
import SvgUri from 'react-native-svg-uri';

var getPhonesCallingCodeAndCountryData = null;
DeviceCountry.getCountryCode()
  .then(result => {
    getPhonesCallingCodeAndCountryData = codes.filter(
      x => x.isoCode2 == result.code.toUpperCase(),
    );
  })
  .catch(e => {
    console.log(e);
  });

const logoRegex = /.(svg)$/i
export default function Login({ navigation, route }) {
  const { themeColor, themeToggle, clientInfo, defaultLanguage } = useSelector(
    state => state?.initBoot,
  );
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const [state, setState] = useState({
    isLoading: false,
    callingCode:
      !isEmpty(getPhonesCallingCodeAndCountryData) &&
        getBundleId() !== appIds.SXM2GO
        ? getPhonesCallingCodeAndCountryData[0].countryCodes[0]
        : !!clientInfo?.get_country_set?.phonecode
          ? clientInfo?.get_country_set?.phonecode
          : '91',
    cca2:
      !isEmpty(getPhonesCallingCodeAndCountryData) &&
        getBundleId() !== appIds.SXM2GO
        ? getPhonesCallingCodeAndCountryData[0].isoCode2
        : !!clientInfo?.get_country_set?.code
          ? clientInfo?.get_country_set?.code
          : 'IN',
    phoneNumber: '',
    appHashKey: '',
    locationPermissionStatus: false,

  });
  //all states used in this screen
  const {
    phoneNumber,
    cca2,
    callingCode,
    isLoading,
    appHashKey,
    locationPermissionStatus,

  } = state;

  const checkLocationPermission = () => {
    locationPermission()
      .then(res => {
        updateState({
          locationPermissionStatus: true,
        });
        console.log(res, 'resresres');
      })
      .catch(error => {
        console.log("errorerrorerror",error)
        updateState({
          locationPermissionStatus: false,
        });
        Alert.alert(
          'Permission Required',
          `${DeviceInfo.getApplicationName()} collects location data in background and foreground mode to track the order delivery location and estimate delivery time for the end customer`,
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                if (error != 'blocked' || error == 'denied') {
                  if (Number(Platform.constants.Release) > Number(10)) {
                    openAppSetting('LOCATION_SERVICES');
                  } else {
                    chekLocationPermission()
                      .then(res => {
                        console.log(res, 'resresresresresres');
                        if (res == 'granted') {
                          updateState({
                            locationPermissionStatus: true,
                          });
                        } else {
                          openAppSetting('LOCATION_SERVICES');
                          console.log(error, 'errororor for location>>>>');
                        }
                      })
                      .catch(error => {
                        updateState({
                          locationPermissionStatus: false,
                        });
                        console.log(error, 'errororor for location');
                      });
                  }

                } else {
                  openAppSetting('LOCATION_SERVICES');
                  console.log(error, 'errororor for location++++');
                }
              },
            },
          ],
        );
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS != 'ios') {
        checkLocationPermission();
      }
    }, []),
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  const getColors = () => {
    switch (getBundleId()) {
      case appIds.lOPHT:
        return colors.white;
      default:
        return colors.black;
    }
  };

  //Update states
  const updateState = data => setState(state => ({ ...state, ...data }));

  //Styles in app
  const styles = stylesFunc({ defaultLanguage });

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };

  useEffect(() => {
    if (Platform.OS == 'android') {
      RNOtpVerify.getHash()
        .then(res => {
          updateState({
            appHashKey: res[0],
          });
        })
        .catch();
    }
    // actions.sessionLogoutUser(false);
    updateState({
      callingCode:
        !isEmpty(getPhonesCallingCodeAndCountryData) &&
          (getBundleId() !== appIds.SXM2GO && getBundleId() !== appIds.speedyDelivery)
          ? getPhonesCallingCodeAndCountryData[0].countryCodes[0]
          : !isEmpty(getPhonesCallingCodeAndCountryData) &&
            (getBundleId() == appIds.speedyDelivery) ? '1' : !!clientInfo?.get_country_set?.phonecode
            ? clientInfo?.get_country_set?.phonecode
            : '91',
      cca2:
        !isEmpty(getPhonesCallingCodeAndCountryData) &&
          (getBundleId() !== appIds.SXM2GO && getBundleId() !== appIds.speedyDelivery)
          ? getPhonesCallingCodeAndCountryData[0].isoCode2
          : !isEmpty(getPhonesCallingCodeAndCountryData) &&
            (getBundleId() == appIds.speedyDelivery) ? 'DO' : !!clientInfo?.get_country_set?.code
            ? clientInfo?.get_country_set?.code
            : 'IN',
    });
  }, [clientInfo]);

  //Validate form
  const isValidData = () => {
    const error = validator({ phoneNumber });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const _onLogin = () => {
    if (!locationPermissionStatus && Platform.OS != 'ios') {
      checkLocationPermission();
      return;
    }

    const checkValid = isValidData();
    if (checkValid) {
      let data = {};
      data['phone_number'] = `+${callingCode}${phoneNumber}`;
      if (Platform.OS === 'android' && !!appHashKey) {
        data['app_hash_key'] = appHashKey;
      }
      console.log(data, 'sending data ', data);
      // actions.sessionLogoutUser(false);
      updateState({ isLoading: true });
      actions
        .login(data, { client: clientInfo?.database_name })
        .then(res => {
          console.log(res, 'login data');
          updateState({ isLoading: false });
          if (res?.data) {
            showSuccess(strings.OTPSENDSUCCESS);
            moveToNewScreen(navigationStrings.SEND_OTP, res?.data)();
          }
        })
        .catch(errorMethod);
    }
  };

  //Error handling in api
  const errorMethod = error => {
    console.log(error, 'error');
    updateState({ isLoading: false });
    showError(error?.message || error?.error, 10000);
  };

  //On country change
  const _onCountryChange = data => {
    updateState({ cca2: data.cca2, callingCode: data.callingCode[0] });
    return;


  };


  const _signUp = () => {
    navigation.navigate(navigationStrings.SIGN_UP);
  };





  return (
    <WrapperContainer
      isLoadingB={isLoading}
      source={loaderOne}
      statusBarColor={colors.white}
      bgColor={colors.white}>
      {!!(getBundleId() == appIds.royoorder) && (
        <Header
          leftIcon={imagePath.backArrow}
          // centerTitle={title}
          onPressLeft={
            () =>
              navigation.push(navigationStrings.SHORT_CODE, {
                shortCodeParam: true,
              })
            // navigation.goBack()
          }
          headerStyle={{ backgroundColor: colors.white }}
        />
      )}
     


      <View
        style={{
          flex: 1,
          marginHorizontal: 20,
          marginTop: getBundleId() == appIds.lOPHT ? 50 : 0,
        }}>
        <View style={styles.imageStyle}>
          {(logoRegex.test(clientInfo?.logo) || logoRegex.test(clientInfo?.dark_logo)) ? <SvgUri
            width={getBundleId() == appIds.lOPHT ? moderateScale(width) : moderateScale(width / 2)}
            height={moderateScale(width / 2)}
            source={{ uri: clientInfo?.logo || clientInfo?.dark_logo }}
          /> :
            <ScaledImage
              width={getBundleId() == appIds.lOPHT ? moderateScale(width) : moderateScale(width / 2)}
              height={moderateScale(width / 2)}
              source={
                clientInfo && (clientInfo?.logo || clientInfo?.dark_logo)
                  ? { uri: isDarkMode ? clientInfo?.dark_logo : clientInfo?.logo }
                  : imagePath.logo
              }
            />

          }

        </View>
        {console.log(clientInfo, 'clientInfo')}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ height: height / 2 }}>
          <View style={styles.bottomSectionStyle}>
            <Text style={styles.loginUsing}>{strings.LOGINUSING}</Text>
            <Text style={styles.loginUsing}>{strings.PHONENUMBER}</Text>
            <Text style={styles.weneedCompany}>
              {strings.WENEDDPHONENUMBER}
            </Text>
            <View style={{ marginTop: moderateScale(20) }} />
            <View>
              <PhoneNumberInput
                onCountryChange={_onCountryChange}
                onChangePhone={phoneNumber =>
                  updateState({
                    phoneNumber: phoneNumber.replace(/[^0-9]/g, ''),
                  })
                }
                cca2={cca2}
                phoneNumber={phoneNumber}
                callingCode={callingCode}
                placeholder={strings.YOUR_PHONE_NUMBER}
                keyboardType={'phone-pad'}
                returnKeyType={'done'}
                color={colors.black}
                borderColor={colors.themeColor}
                callingCodeTextStyle={styles.callingCodeTextStyle}
              // color={isDarkMode ? MyDarkTheme.colors.text : null}
              />
            </View>
            <GradientButton
              containerStyle={{ marginTop: moderateScaleVertical(40) }}
              onPress={_onLogin}
              textStyle={{ color: getColors() }}
              btnText={strings.LOGIN}
              colorsArray={
                getBundleId() == appIds.lOPHT
                  ? [colors.lophtBlue, colors.lophtBlue]
                  : [colors.themeColor, colors.themeColor]
              }
            />
            <View style={[styles.signUpView, { flexDirection: 'row' }]}>
              <Text style={styles.byContinue}>
                {strings.DONT_HAVE_ACCOUNT}{' '}
              </Text>
              <TouchableOpacity onPress={_signUp}>
                <Text style={styles.signUpText}>{strings.SIGNUP}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.byContinueTextContainer}>
              <Text style={styles.byContinue}>{`${strings.BYCONTINUE}`}</Text>
            </View>

            <View style={styles.webLinkContainer}>
              <Text
                onPress={() =>
                  navigation.navigate(navigationStrings.WEBLINKS, { id: 1 })
                }
                style={styles.bylogging}>
                {`${strings.TERMSANDCONDITIONS}`}
              </Text>
              <Text style={styles.byContinue}>{`${strings.AND} `}</Text>
              <Text
                onPress={() =>
                  navigation.navigate(navigationStrings.WEBLINKS, { id: 2 })
                }
                style={[styles.bylogging]}>
                {strings.PRIVACYPOLICY}
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>


    </WrapperContainer>
  );
}


