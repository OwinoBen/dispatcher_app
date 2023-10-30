import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Image,
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import TextInputWithlabel from '../../Components/TextInputWithlabel';
import WrapperContainer from '../../Components/WrapperContainer';
import PhoneNumberInput from '../../Components/PhoneNumberInput';

import strings from '../../constants/lang';
// import store from '../../redux/store';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import imagePath from '../../constants/imagePath';
import { transportationArray } from '../../utils/constants/ConstantValues';
import stylesFunction from './styles';
import actions from '../../redux/actions';
import navigationStrings from '../../navigation/navigationStrings';
import { showError, showSuccess } from '../../utils/helperFunctions';
import { removeItem } from '../../utils/utils';
import { removerUserData } from '../../redux/actions/auth';
import { getBundleId } from 'react-native-device-info';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import Share from 'react-native-share';
import Clipboard from '@react-native-community/clipboard';

export default function MyProfile({ route, navigation }) {
  const userData = useSelector(state => state?.auth?.userData);
  const clientInfo = useSelector(state => state?.initBoot?.clientInfo);
  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );
  const [state, setState] = useState({
    isLoading: false,
    fullName: userData?.name ? userData?.name : '',
    phoneNumber: userData?.phone_number ? userData?.phone_number : '',
    callingCode: '91',
    cca2: 'IN',
    allTransportation: transportationArray,
    selectedVehicleType: userData?.vehicle_type_id
      ? userData?.vehicle_type_id
      : null,
    modelMake: userData?.make_model ? userData?.make_model : '',
    vehicleColor: userData?.color ? userData?.color : '',
    plateNumber: userData?.plate_number ? userData?.plate_number : '',

    type: userData?.type ? userData?.type : null,
    team: userData?.team ? userData?.team : null,
    referCode: userData?.refferal_code ? userData?.refferal_code : '',
    DriverUniqueId: userData?.unique_id,
  });

  const {
    team,
    type,
    isLoading,
    fullName,
    phoneNumber,
    callingCode,
    cca2,
    allTransportation,
    selectedVehicleType,
    modelMake,
    vehicleColor,
    plateNumber,
    DriverUniqueId,
    referCode,
  } = state;
  const commonStyles = commonStylesFunc({ fontFamily });

  const updateState = data => setState(state => ({ ...state, ...data }));
  const onShare = () => {
    let options = {
      title: 'Driver id',
      message: DriverUniqueId,
    }
    Share.open(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });

  };

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      updateState({
        isLoading: false,
        fullName: userData?.name ? userData?.name : '',
        phoneNumber: userData?.phone_number ? userData?.phone_number : '',
        callingCode: '91',
        cca2: 'IN',
        allTransportation: transportationArray,
        selectedVehicleType: userData?.vehicle_type_id
          ? userData?.vehicle_type_id
          : null,
        modelMake: userData?.make_model ? userData?.make_model : '',
        vehicleColor: userData?.color ? userData?.color : '',
        plateNumber: userData?.plate_number ? userData?.plate_number : '',

        type: userData?.type ? userData?.type : null,
        team: userData?.team ? userData?.team : null,
        referCode: userData?.refferal_code ? userData?.refferal_code : '',
        DriverUniqueId: userData?.unique_id,
      });
    }
  }, [
    userData?.vehicle_type_id,
    userData?.team,
    userData?.plate_number,
    userData?.phone_number,
    userData?.name,
  ]);

  const styles = stylesFunction({ defaultLanguagae });

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };

  const onDeleteAccount = () => {
    Alert.alert('', strings.ARE_YOU_SURE_YOU_WANT_TO_DELETE, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        // style: 'destructive',
      },
      {
        text: strings.CONFIRM,
        onPress: deleleUserAccount,
      },
    ]);
  };
  const deleleUserAccount = async () => {
    try {
      const res = await actions.deleteAccount(
        {},
        {
          client: clientInfo?.database_name,
          language: defaultLanguagae?.value ? defaultLanguagae?.value : 'en',
        },
      );
      console.log('delete user account res++++', res);
      await removeItem('userData');
      removerUserData(null);
      showSuccess(res?.massage);
      // logout()
    } catch (error) {
      console.log('erro raised', error);
      showError(error?.message);
    }
  };
  const copyToClipboard = () => {
    Clipboard.setString(referCode);
  };

  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      <Header
        headerStyle={{ backgroundColor: colors.white }}
        // hideRight={true}
        // onPressLeft={()=>navigation.goBack()}
        centerTitle={strings.PROFILE}
      />
      <View style={{ ...commonStyles.headerTopLine }} />
      <View style={styles.rootContainer}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceHorizontal={false}>
          <View style={styles.imageViewStyle}>
            {userData && userData?.image_url && (
              <Image
                source={{ uri: userData?.image_url }}
                style={styles.imageStyle}
              />
            )}
          </View>
          <View style={styles.personalInfoContainer}>
            <View
              style={{
                borderBottomColor: colors.greySearchBackground,
                borderBottomWidth: 1,
                paddingBottom: 10,
              }}>
              <Text style={styles.label}>{strings.PERSONAL}</Text>
            </View>
            <View style={styles.personalInfoContainer}>
              {/* <TextInputWithlabel
                labelStyle={styles.textInputStyle}
                label={strings.FULLNAME}
                value={fullName}
                textInputStyle={styles.textInputStyle}
              /> */}
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 0.5, marginBottom: moderateScale(20) }}>
                  <View>
                    <Text style={[styles.label2, styles.textInputStyle]}>
                      {strings.FULLNAME}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: fontFamily.semiBold,
                      fontSize: textScale(12),
                    }}>
                    {fullName}
                  </Text>
                </View>

                <View style={{ flex: 0.5, marginBottom: moderateScale(20) }}>
                  <View>
                    <Text style={[styles.label2, styles.textInputStyle]}>
                      {strings.PHONENUMBER}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: fontFamily.semiBold,
                      fontSize: textScale(12),
                    }}>
                    {phoneNumber}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {!!type && (
                  <View style={{ flex: 0.5, marginBottom: moderateScale(20) }}>
                    <View>
                      <Text style={[styles.label2, styles.textInputStyle]}>
                        {strings.JOBTYPE}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: colors.black,
                        fontFamily: fontFamily.semiBold,
                        fontSize: textScale(12),
                      }}>
                      {type}
                    </Text>
                  </View>
                )}
                {!!referCode && (
                  <TouchableOpacity onPress={copyToClipboard} style={{ flex: 0.5, marginBottom: moderateScale(20) }}>
                    <View>
                      <Text style={[styles.label2, styles.textInputStyle]}>
                        {strings.REFERRAL_CODE}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                      <Text
                        style={{
                          color: colors.black,
                          fontFamily: fontFamily.semiBold,
                          fontSize: textScale(12),
                        }}>
                        {referCode}
                      </Text>
                      <Image style={{ marginLeft: moderateScale(20) }} source={imagePath.details} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              {!!team && (
                <View style={{ marginBottom: moderateScale(20) }}>
                  <View>
                    <Text style={[styles.label2, styles.textInputStyle]}>
                      {strings.ASSIGNEDTEAM}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: fontFamily.semiBold,
                      fontSize: textScale(12),
                    }}>
                    {team?.name}
                  </Text>
                </View>
              )}

              {!!DriverUniqueId && (
                <View style={{ marginBottom: moderateScale(20) }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Text style={[styles.label2, styles.textInputStyle]}>
                      Driver id
                    </Text>
                    <TouchableOpacity
                      onPress={onShare}
                    >
                      <Image
                        source={imagePath.share}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: fontFamily.semiBold,
                      fontSize: textScale(12),
                    }}>
                    {DriverUniqueId}
                  </Text>
                </View>
              )}

              {/* <TextInputWithlabel
                labelStyle={styles.textInputStyle}
                label={strings.PHONENUMBER}
                value={phoneNumber}
                textInputStyle={styles.textInputStyle}
              /> */}
            </View>

            {!!selectedVehicleType && (
              <View>
                <View style={styles.personalInfoContainer}>
                  <Text style={styles.label}>{strings.TRASNPORTATION}</Text>
                </View>
                <View>
                  <ScrollView
                    horizontal
                    alwaysBounceHorizontal={false}
                    style={styles.transportationViewStyle}>
                    {allTransportation.map((i, inx) => {
                      return (
                        <View style={styles.transportationImageStyle}>
                          <Image
                            source={
                              selectedVehicleType == i.id
                                ? i.activeIcon
                                : i.inactiveIcon
                            }
                          />
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            )}
            <View style={styles.carInfoStyle}>
              {!!modelMake && (
                <View style={{ marginBottom: moderateScale(20) }}>
                  <View>
                    <Text style={[styles.label2, styles.textInputStyle]}>
                      {strings.MODELMAKE}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: fontFamily.semiBold,
                      fontSize: textScale(14),
                    }}>
                    {modelMake}
                  </Text>
                </View>
              )}

              {!!vehicleColor && (
                <View style={{ marginBottom: moderateScale(20) }}>
                  <View>
                    <Text style={[styles.label2, styles.textInputStyle]}>
                      {strings.COLOR}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: fontFamily.semiBold,
                      fontSize: textScale(14),
                    }}>
                    {vehicleColor}
                  </Text>
                </View>
              )}

              {!!plateNumber && (
                <View style={{ marginBottom: moderateScale(20) }}>
                  <View>
                    <Text style={[styles.label2, styles.textInputStyle]}>
                      {(getBundleId() == appIds.mrVeloz && defaultLanguagae?.value == 'es') ? strings.PLATEORDER_MRVELOZ : strings.PLATEORDER}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: fontFamily.semiBold,
                      fontSize: textScale(14),
                    }}>
                    {plateNumber}
                  </Text>
                </View>
              )}

              {/* <TextInputWithlabel
                labelStyle={styles.textInputStyle}
                label={strings.MODELMAKE}
                value={modelMake}
                textInputStyle={styles.textInputStyle}
              />
              <TextInputWithlabel
                labelStyle={styles.textInputStyle}
                label={strings.COLOR}
                value={vehicleColor}
                textInputStyle={styles.textInputStyle}
              />
              <TextInputWithlabel
                labelStyle={styles.textInputStyle}
                label={strings.PLATEORDER}
                value={plateNumber}
                textInputStyle={styles.textInputStyle}
              /> */}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <TouchableOpacity
        onPress={onDeleteAccount}
        style={{
          marginTop: 'auto',
          alignSelf: 'center',
          marginBottom: moderateScaleVertical(12),
          // backgroundColor: colors.blueBackGroudC,
          // padding: 7,
        }}>
        <Text
          style={{
            color: colors.redB,
            fontFamily: fontFamily.bold,
            fontSize: textScale(20),
          }}>
          Delete Account
        </Text>
      </TouchableOpacity>
    </WrapperContainer>
  );
}
