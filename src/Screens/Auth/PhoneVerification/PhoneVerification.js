import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, Text, View } from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { useSelector } from 'react-redux';
import Header from '../../../Components/Header';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScaleVertical,
  width
} from '../../../styles/responsiveSize';
import {
  otpTimerCounter,
  saveUserData,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import stylesFunction from './styles';
import { loaderOne } from '../../../Components/Loaders/AnimatedLoaderFiles';
import { getItem } from '../../../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function PhoneVerification({navigation, route}) {
  const paramData = route?.params?.data;
  console.log(paramData, 'paramData');

  const [state, setState] = useState({
    isLoading: false,
    callingCode: paramData?.callingCode ? paramData?.callingCode : '91',
    cca2: paramData?.cca2 ? paramData?.cca2 : 'IN',
    phoneNumber: paramData?.phoneNumber,
    otp: '',
    otpToShow: '',
    otpPrefilled: false,
    otpTimer: 15,
  });

  const {
    isLoading,
    otp,
    otpToShow,
    otpTimer,
  } = state;

  const clientInfo = useSelector(state => state?.initBoot?.clientInfo);
  

  //Update states
  const updateState = data => setState(state => ({...state, ...data}));
  //Styles in app
  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );

  const styles = stylesFunction({defaultLanguagae});
  //all states used in this screen
 
  useEffect(() => {
    let timerId;
    if (otpTimer > 0) {
      timerId = setTimeout(() => {
        updateState({otpTimer: otpTimer - 1});
      }, 1000);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [otpTimer]);

  const otpHandler = message => {
    if (!!message) {
      let msgOTP = message.replace(/[^0-9]/g, '');
      let OTP = msgOTP.substring(0, 6);

      updateState({
        otpToShow: OTP,
        otp: OTP,
      });

      if (otp.length === 6) {
        verfifyAccount();
      }
    }
    RNOtpVerify.removeListener();
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNOtpVerify.getOtp()
        .then(res => {
          RNOtpVerify.addListener(otpHandler);
        })
        .catch(error => console.log(error, 'error>>>>'));
      return () => {
        RNOtpVerify.removeListener();
      };
    }
  }, []);

  //Opt input function
  const onOtpInput = code => {
    updateState({
      isLoading: true,
      otp: code,
      otpPrefilled: true,
    });
  };

  // //Code input
  useEffect(() => {
    console.log("otp.length",otp.length)
    if (otp.length === 6) {
      verfifyAccount();
    }
  }, [otp]);
  // console.log(otp,'otpotp')
  //VerifyAccount
  const verfifyAccount = async () => {

    const fcmToken = await AsyncStorage.getItem("fcmToken")

    let data = {};
    data['phone_number'] = `${paramData?.phone_number}`;
    data['otp'] = otp;
    data['device_token'] = !!fcmToken ? fcmToken : 'FCM_Token_not_generated';
    data['device_type'] = Platform.OS;
    console.log(data, 'data>>>data>data>data');
    updateState({isLoading: true});
    actions
      .verifyAccount(data, {client: clientInfo?.database_name})
      .then(res => {
        console.log(res, 'verifyAccountverifyAccount');
        updateState({isLoading: false});
        if(!!res?.data){
          saveUserData(res.data);
        }
      })
      .catch(errorMethod);
  };

  const _resendCode = () => {
    let data = {};
    data['phone_number'] = `${paramData?.phone_number}`;
    updateState({isLoading: true});
    actions
      .login(data, {client: clientInfo?.database_name})
      .then(res => {
        updateState({isLoading: false});
        if (res?.data) {
          showSuccess('Otp send successfuly');
          updateState({
            otpTimer: 15,
          });
        }
      })
      .catch(errorMethod);
  };

  //Error handling in api
  const errorMethod = error => {
    updateState({
      isLoading: false, 
      otpToShow: '',
      otp:''
    });
    console.log(error, 'errorerror');

    showError(error?.message || error?.error);
  };

  return (
    <WrapperContainer
    isLoadingB={isLoading}
      source={loaderOne}
      statusBarColor={colors.white}
      bgColor={colors.white}>
      <Header
        leftIcon={imagePath.backArrow}
        // centerTitle={title}
        headerStyle={{backgroundColor: colors.white}}
      />
      {/* <View style={{height: moderateScaleVertical(28)}} /> */}
      <View
        style={{
          flex: 1,
          marginHorizontal: 20,
          marginTop: moderateScaleVertical(30),
        }}>
        <Text style={styles.verification}>{strings.VERIFICATION}</Text>
        <Text
          style={
            styles.codesendto
          }>{`${strings.CODESENTTO} ${paramData?.phone_number}`}</Text>

        <SmoothPinCodeInput
          containerStyle={{alignSelf: 'center'}}
          password
          autoFocus={true}
          mask={<View style={styles.maskStyle} />}
          cellSize={width / 8}
          codeLength={6}
          cellSpacing={10}
          editable={true}
          cellStyle={styles.cellStyle}
          cellStyleFocused={styles.cellStyleFocused}
          textStyle={styles.textStyleCodeInput}
          textStyleFocused={styles.textStyleFocused}
          inputProps={{
            autoCapitalize: 'none',
            autoFocus: true,
          }}
          value={otpToShow}
          keyboardType={'numeric'}
          onTextChange={otpToShow => updateState({otpToShow})}
          onFulfill={code => onOtpInput(code)}
        />
        <Text style={styles.didntgetOtp}>
          {`${strings.DIDNTRECIEVEANYCODE}`}
          <Text
            onPress={otpTimer > 0 ? () => {} : _resendCode}
            style={{
              color: colors.themeColor,
              fontFamily: fontFamily.bold,
            }}>
            {otpTimer > 0
              ? otpTimerCounter(otpTimer)
              : `${strings?.RESENTCODE}`}
          </Text>
        </Text>
      </View>
    </WrapperContainer>
  );
}