import React, { useEffect, useState } from 'react';
import {
  I18nManager,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Geocoder from 'react-native-geocoding';
import RNGooglePlaces from 'react-native-google-places';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical, textScale,
  width
} from '../styles/responsiveSize';
import { getPlaceDetails } from '../utils/googlePlaceApi';
import { getAddressComponent } from '../utils/helperFunctions';
import { chekLocationPermission } from '../utils/permissions';
import validations from '../utils/validations';
import BorderTextInput from './BorderTextInput';
import BorderTextInputWithLable from './BorderTextInputWithLable';
import BottomSheetModal from './BottomSheetModal';
import GradientButton from './GradientButton';
import SearchPlaces from './SearchPlaces';
import SelctFromMap from './SelctFromMap';



navigator.geolocation = require('react-native-geolocation-service');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const AddressBottomSheet = ({
  updateData,
  onClose = () => { },
  type,
  passLocation,
  toggleModal,
  onPress,
  indicator,
  navigation,
  selectViaMap = false,
  openCloseMapAddress = () => { },
  constCurrLoc,
  onCloseSheet = () => { },
  currentAgentLocation = {}
}) => {

  const { userData } = useSelector((state) => state?.auth || {});





  const [state, setState] = useState({
    dropDownData: [],
    address: updateData?.address ? updateData?.address : '',
    showDialogBox: false,
    isLoading: false,
    street: '',
    city: '',
    pincode: '',
    states: '',
    country: '',
    latitude: '',
    longitude: '',
    phonecode: '',
    is_primary: '',
    country_key: '',
    extra_instruction: '',
    addressTypeArray: [
      {
        id: 1,
        lable: "Home",
        icon: imagePath.icHomeBlack,
      },
      { id: 2, lable: "Work", icon: imagePath.workInActive },
      { id: 3, lable: "Others", icon: imagePath.workInActive },
    ],
    address_type: 1,
    country_code: '',
    viewHeight: 0,
    region: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    customAddress: '',
    houseNo: '',
    searchResult: [],
    isStreet: false,
    isCity: false,
    isState: false,
    isCountry: false,
    isPincode: false,
    isAddress: false,
  });


  //To update the states
  // useEffect(() => {


  //   updateState({
  //     address: updateData?.address ? updateData?.address : '',
  //     showDialogBox: false,
  //     isLoading: false,
  //     street: updateData?.street ? updateData?.street : '',
  //     city: updateData?.city ? updateData?.city : '',
  //     pincode: updateData?.pincode ? updateData?.pincode : '',
  //     states: updateData?.state ? updateData?.state : '',
  //     country: updateData?.country ? updateData?.country : '',
  //     latitude: updateData?.latitude ? updateData?.latitude : '',
  //     longitude: updateData?.longitude ? updateData?.longitude : '',
  //     phonecode: updateData?.phonecode ? updateData?.phonecode : '',
  //     country_code: updateData?.country_code ? updateData?.country_code : '',
  //     is_primary: updateData?.is_primary ? updateData?.is_primary : '',
  //     address_type: updateData?.type,
  //     houseNo: updateData?.house_number ? updateData?.house_number : '',
  //     extra_instruction: updateData?.extra_instruction
  //       ? updateData?.extra_instruction
  //       : '',
  //   });
  // }, [updateData]);

  const {
    address,
    dropDownData,
    showDialogBox,
    street,
    city,
    pincode,
    states,
    country,
    latitude,
    longitude,
    addressTypeArray,
    address_type,
    phonecode,
    country_code,
    is_primary,
    viewHeight,
    region,
    customAddress,
    houseNo,
    searchResult,
    extra_instruction,
    isStreet,
    isCity,
    isState,
    isCountry,
    isPincode,
    isAddress,
  } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {

    Geocoder.init(userData?.client_preference?.map_key_1, { language: 'en' }); // set the language
  }, []);

  const _onChangeText = (key) => (val) => {
    if (key == 'address') {
      getPlacesPrediction(val);
    }
    updateState({ [key]: val });
  };

  //Cleaer all state
  const clearState = () => {
    setTimeout(() => {
      setState({
        dropDownData: [],
        address: '',
        showDialogBox: false,
        isLoading: false,
        street: '',
        city: '',
        pincode: '',
        states: '',
        country: '',
        latitude: '',
        longitude: '',
        phonecode: '',
        country_code: '',
        is_primary: 1,
        addressTypeArray: [
          {
            id: 1,
            lable: "Home",
            icon: imagePath.icHomeBlack,
          },
          { id: 2, lable: "Work", icon: imagePath.workInActive },
          { id: 3, lable: "Others", icon: imagePath.workInActive },
        ],
        address_type: updateData?.type ? updateData?.type : 1,
        houseNo: '',
      });
    }, 1000);
  };

  /*************************** On Text Change
   */
  const getPlacesPrediction = (data) => {
    // console.log(data, 'data>>>>');
    RNGooglePlaces.getAutocompletePredictions(data)
      .then((results) => {
        updateState({ dropDownData: results });
      })
      .catch((error) => { });
  };

  /*************************** On Text Change
   */ const addressHelper = (results) => {
    let clonedArrayData = { ...state };
    clonedArrayData = { ...clonedArrayData, ...results, showDialogBox: false };
    updateState(clonedArrayData);
  };

  const handleAddressOnKeyUp = (text) => {
    updateState({ address: text });
  };

  /*************************** Place Id look Up
   */ const placeIdLookUp = (data) => {
    if (data?.placeID) {
      RNGooglePlaces.lookUpPlaceByID(data.placeID)
        .then((results) =>
          addressHelper({ ...results, address: data.fullText || data.address }),
        )
        .catch((error) => { });
    } else {
    }
  };

  //this function use for save user info
  const isValidDataOfAddressSave = () => {
    const error = validations({
      address: address || '',
    });
    if (error) {
      checkAddressError(error);
      return;
    }
    return true;
  };

  const checkAddressError = (error) => {
    if (
      error ==
      strings.PLEASE_ENTER +
      ' ' +
      strings.YOUR +
      ' ' +
      strings.ENTER_NEW_ADDRESS
    ) {
      updateState({
        isAddress: true,
        isStreet: false,
        isCity: false,
        isState: false,
        isCountry: false,
        isPincode: false,
      });
    }
    else {
      return;
    }
  };

  //Save your current address
  const saveAddress = () => {
    const checkValid = isValidDataOfAddressSave();
    if (!checkValid) {
      return;
    }
    let data = {
      address: address,
      street: street,
      city: city,
      pincode: pincode,
      state: states,
      country: country,
      latitude: latitude,
      longitude: longitude,
      phonecode: phonecode,
      country_code: country_code,
      is_primary: type == 'addAddress' ? 1 : is_primary,
      address_type: address_type,
      type_name: address_type === 3 && customAddress,
      house_number: houseNo,
      extra_instruction: extra_instruction,
    };

    onCloseSheet()
    clearState();

    passLocation(data);


  };
  const currentLocation = () => {
    chekLocationPermission()
      .then((result) => {
        if (result !== 'goback') {
          getCurrentPosition();
        }
      })
      .catch((error) => console.log('error while accessing location ', error));
  };

  const getCurrentPosition = () => {
    return navigator.geolocation.default.getCurrentPosition(
      (position) => {
        // const location = JSON.stringify(position);
        Geocoder.from({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
          .then((json) => {
            console.log(json, 'json?>>>>>>>');
            let addressData = getAddressComponent(json?.results[0]);
            console.log(addressData, 'addressData?>>>>>>>');
            addressHelper(addressData);
          })
          .catch((error) => console.log(error, 'errro geocode'));
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000 },
    );
  };

  //Get Dyamic textinput style
  const getTextInputStyle = (input, type) => {
    return input != '' && input != undefined
      ? {
        ...styles.textInput,
        color: colors.textGrey,
      }
      : { fontSize: textScale(12) };
  };

  const updateAddress_ = async (data_) => {
    let res = await getPlaceDetails(
      data_.place_id,
      userData?.client_preference?.map_key_1,
    );
    const { result } = res;

    let addressData = getAddressComponent(result);

    let data = {};
    if (addressData.address) {
      data['address'] = addressData.address;
    }
    if (addressData.street) {
      data['street'] = addressData.street;
    }
    if (addressData.city) {
      data['city'] = addressData.city;
    }
    if (addressData.pincode) {
      data['pincode'] = addressData.pincode;
    }
    if (addressData.state) {
      data['state'] = addressData.state;
    }
    if (addressData.country) {
      data['country'] = addressData.country;
    }
    if (addressData.latitude) {
      data['latitude'] = addressData.latitude;
    }
    if (addressData.longitude) {
      data['longitude'] = addressData.longitude;
    }
    if (addressData.phonecode) {
      data['phonecode'] = addressData.phonecode;
    }
    if (addressData.country_code) {
      data['country_code'] = addressData.country_code;
    }

    data['is_primary'] = type == 'addAddress' ? 1 : is_primary;
    console.log('passLocationpassLocation>>>', data);
    passLocation(data);
  };

  const onPressAddress = async (place) => {
    Keyboard.dismiss();
    console.log('selected item', place?.name);
    // return;
    if (!!place.place_id && !!place?.name) {
      try {
        let res = await getPlaceDetails(
          place.place_id,
          userData?.client_preference?.map_key_1,
        );
        const { result } = res;

        let addressData = getAddressComponent(result);

        let data = {};
        if (addressData.address) {
          data['address'] = addressData.address;
        }
        if (addressData.street) {
          data['street'] = addressData.street;
        }
        if (addressData.city) {
          data['city'] = addressData.city;
        }
        if (addressData.pincode) {
          data['pincode'] = addressData.pincode;
        }
        if (addressData.states) {
          data['state'] = addressData.states;
        }
        if (addressData.country) {
          data['country'] = addressData.country;
        }
        if (addressData.latitude) {
          data['latitude'] = addressData.latitude;
        }
        if (addressData.longitude) {
          data['longitude'] = addressData.longitude;
        }
        if (addressData.phonecode) {
          data['phonecode'] = addressData.phonecode;
        }
        if (addressData.country_code) {
          data['country_code'] = addressData.country_code;
        }
        updateState({
          ...state,
          ...data,
          searchResult: [],
        });
      } catch (error) {
        console.log("something wen't wrong");
      }
    } else {
      alert(strings.PLACE_ID_NOT_FOUND);
    }
  };

  const addressDone = (data) => {
    onCloseSheet()
    updateAddress_(data);
  };

  const renderSearchItem = (item, index) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.addressViewStyle,
          borderBottomWidth: searchResult.length - 1 !== index ? 0.5 : 0,
          borderBottomColor: colors.lightGreyBg,
        }}
        onPress={() => onPressAddress(item)}>
        <View style={{ flex: 0.15 }}>
          <Image source={imagePath.icSearchedLoc} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Text
            style={{
              fontSize: textScale(12),
              color: colors.black,
              fontFamily: fontFamily.regular,
            }}>
            {item?.name}
          </Text>
          <Text numberOfLines={2} style={styles.formatedAddress}>
            {item?.formatted_address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheetModal snapPoints={[height]}>
      <TouchableOpacity style={styles.closeBtn} onPress={onCloseSheet}>
        <Image style={{ tintColor: colors.white }} source={imagePath.icCloseButton} />
      </TouchableOpacity>



      {selectViaMap ? (
        <View style={{ flex: 1 }}>
          <SelctFromMap
            doneBtnStyle={{
              bottom: 80,
            }}
            addressDone={addressDone}
            mapClose={() => openCloseMapAddress(2)} //address map close
            constCurrLoc={currentAgentLocation}
          />
        </View>
      ) : (
        <KeyboardAwareScrollView
          style={{
            ...styles.scrollViewAddressModal,
            backgroundColor: colors.white,
          }}>
          <View style={styles.mainViewAddressModal}>
            <View style={styles.addAddessView}>
              <Text
                numberOfLines={1}
                style={{
                  ...styles.addNewAddeessText,
                  color: colors.textGreyD,
                }}>
                {strings.ADD_ADDRESS1}
              </Text>
            </View>
            <Text
              style={{
                ...styles.yourLocTxt,
                color: colors.textGreyD,
              }}>
              {strings.YOUR_LOCATION}
            </Text>
            <View>
              <View style={styles.searchPlaceContainer}>
                <View style={{ flex: 1 }}>
                  <SearchPlaces
                    containerStyle={{ backgroundColor: 'transparent' }}
                    showRightImg={false}
                    curLatLng={`${constCurrLoc?.latitude}-${constCurrLoc?.longitude}`}
                    placeHolder={strings.SEARCH_LOCATION}
                    value={address} // instant update search value
                    mapKey={userData?.client_preference?.map_key_1} //send here google Key
                    fetchArrayResult={(data) =>
                      updateState({ searchResult: data })
                    }
                    setValue={(text) => updateState({ address: text })} //return & update on change text value
                    _moveToNextScreen={() => { }}
                    placeHolderColor={colors.textGreyB}
                    onClear={() => updateState({ address: '', searchResult: [] })}
                    textStyle={{
                      color: colors.textGreyOpcaity7,
                      fontFamily: fontFamily.medium,
                      fontSize: textScale(14),
                    }}
                  />
                </View>

                <View style={{ marginHorizontal: moderateScale(6) }} />
                <TouchableOpacity
                  style={styles.mapCloseBtn}
                  onPress={() => openCloseMapAddress(1)} //address map open
                >
                  <Image source={imagePath.ic_pinIcon} style={styles.pinIcon} />
                  <Text
                    style={{
                      ...styles.selectViaMapTxt,
                      color: colors.black,
                    }}>
                    {strings.SELECT_VIA_MAP}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ width: '100%' }}>
                {searchResult?.map((item, i) => {
                  return renderSearchItem(item, i);
                })}
              </View>
            </View>
            <View
              style={{
                ...styles.emptyView,
                borderColor: colors.borderLight,
              }}
            />
            {isAddress && (
              <Text style={{ color: colors.redB }}>
                {strings.PLEASE_ENTER +
                  ' ' +
                  strings.YOUR +
                  ' ' +
                  strings.ENTER_NEW_ADDRESS}
              </Text>
            )}
            <TouchableOpacity
              onPress={currentLocation}
              style={{
                flexDirection: 'row',
                marginTop: moderateScaleVertical(8),
                zIndex: -2000,
              }}>
              <FastImage
                source={imagePath.currentLocation}
                resizeMode="contain"
                style={{
                  width: moderateScale(16),
                  height: moderateScale(16),
                }}
              />
              <View style={{}}>
                <Text style={styles.useCurrentLoc}>
                  {strings.USECURRENTLOACTION}
                </Text>
                <Text style={styles.currentAdrsTxt}>
                  {constCurrLoc?.address}
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                zIndex: -1000,
              }}>
              <BorderTextInputWithLable
                onChangeText={_onChangeText('houseNo')}
                placeholder={strings.HOUSE_NO}
                label={strings.COMPLETE_ADDRESS}
                textInputStyle={getTextInputStyle(houseNo)}
                value={houseNo}
                multiline={false}
                borderWidth={0}
                marginBottomTxt={0}
                containerStyle={{ borderBottomWidth: 1 }}
                mainStyle={{ marginTop: 10 }}
                labelStyle={styles.labelStyle}
                returnKeyType={'next'}
              />

              <BorderTextInputWithLable
                onChangeText={_onChangeText('street')}
                placeholder={strings.ENTER_STREET}
                textInputStyle={getTextInputStyle(city)}
                value={street}
                borderWidth={0}
                marginBottomTxt={0}
                containerStyle={{ borderBottomWidth: 1 }}
                returnKeyType={'next'}
              />
              {isStreet && (
                <Text
                  style={{
                    marginTop: moderateScale(-20),
                    marginLeft: moderateScale(6),
                    color: colors.redB,
                  }}>
                  {strings.PLEASE_ENTER +
                    ' ' +
                    strings.YOUR +
                    ' ' +
                    strings.ENTER_STREET}
                </Text>
              )}

              <BorderTextInputWithLable
                onChangeText={_onChangeText('city')}
                placeholder={strings.CITY}
                textInputStyle={getTextInputStyle(city)}
                value={city}
                borderWidth={0}
                marginBottomTxt={0}
                containerStyle={{ borderBottomWidth: 1 }}
                returnKeyType={'next'}
              />
              {isCity && (
                <Text
                  style={{
                    marginTop: moderateScale(-20),
                    marginLeft: moderateScale(6),
                    color: colors.redB,
                  }}>
                  {strings.PLEASE_ENTER +
                    ' ' +
                    strings.YOUR +
                    ' ' +
                    strings.CITY}
                </Text>
              )}

              <BorderTextInputWithLable
                onChangeText={_onChangeText('states')}
                placeholder={strings.STATE}
                textInputStyle={getTextInputStyle(states)}
                value={states}
                borderWidth={0}
                marginBottomTxt={0}
                containerStyle={{ borderBottomWidth: 1 }}
                returnKeyType={'next'}
              />
              {isState && (
                <Text
                  style={{
                    marginTop: moderateScale(-20),
                    marginLeft: moderateScale(6),
                    color: colors.redB,
                  }}>
                  {strings.PLEASE_ENTER +
                    ' ' +
                    strings.YOUR +
                    ' ' +
                    strings.STATE}
                </Text>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flex: 0.48 }}>
                  <View
                    style={{
                      ...styles.countryContainer,
                      borderColor: colors.borderLight,
                    }}>
                    <TextInput
                      selectionColor={colors.black
                      }
                      placeholderTextColor={colors.textGreyOpcaity7
                      }
                      onChangeText={_onChangeText('country')}
                      returnKeyType={'next'}
                      placeholder={strings.COUNTRY}
                      value={country}
                      style={{
                        ...styles.textInput3,
                        opacity: 0.7,
                        color: colors.textGrey,
                      }}
                    />
                  </View>
                  {isCountry && (
                    <Text
                      style={{
                        marginTop: moderateScale(-20),
                        marginLeft: moderateScale(6),
                        color: colors.redB,
                      }}>
                      {strings.PLEASE_ENTER +
                        ' ' +
                        strings.YOUR +
                        ' ' +
                        strings.COUNTRY}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flex: 0.48,
                  }}>
                  <BorderTextInput
                    containerStyle={styles.pincodeComp}
                    onChangeText={_onChangeText('pincode')}
                    placeholder={strings.PINCODE}
                    textInputStyle={getTextInputStyle(pincode)}
                    value={pincode}
                    keyboardType={'numeric'}
                    borderWidth={0}
                    borderRadius={0}
                    returnKeyType={'next'}
                  />
                  {isPincode && (
                    <Text
                      style={{
                        marginTop: moderateScale(-20),
                        marginLeft: moderateScale(6),
                        color: colors.redB,
                      }}>
                      {strings.PLEASE_ENTER +
                        ' ' +
                        strings.YOUR +
                        ' ' +
                        strings.PINCODE}
                    </Text>
                  )}
                </View>
              </View>


              <Text
                style={{
                  color: colors.textGrey,
                  fontFamily: fontFamily.medium,
                  fontSize: textScale(14),
                }}>
                {strings.SAVE_AS}
              </Text>

              <View style={styles.addressTypeView}>
                {addressTypeArray.map((item, index) => {
                  return (
                    <View key={index}>
                      <TouchableOpacity
                        onPress={() => updateState({ address_type: item.id })}
                        style={{
                          ...styles.addressHomeOrOfficeView,
                          backgroundColor: colors.white,
                        }}>
                        <Text
                          style={[
                            {
                              color: colors.textGreyB,
                              fontFamily: fontFamily.bold,
                            },
                          ]}>
                          {item.lable}
                        </Text>
                        {address_type == item.id && (
                          <Image
                            source={imagePath.icRedChecked}
                            style={{
                              position: 'absolute',
                              right: -8,
                              top: -8,
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
              {address_type === 3 && (
                <BorderTextInputWithLable
                  onChangeText={_onChangeText('customAddress')}
                  placeholder={strings.ENETER_YOUR_ADDRESS}
                  textInputStyle={getTextInputStyle(city)}
                  borderWidth={0}
                  marginBottomTxt={0}
                  returnKeyType={'next'}
                  containerStyle={{
                    borderBottomWidth: 1,
                    marginTop: moderateScale(5),
                  }}
                />
              )}
            </View>
            <GradientButton
              colorsArray={[
                colors.themeColor,
                colors.themeColor,
              ]}
              textStyle={{
                color: colors.white,
              }}
              onPress={saveAddress}
              marginTop={moderateScaleVertical(10)}
              btnText={strings.SAVE_ADDRESS}
              indicator={indicator}
              containerStyle={{ marginTop: moderateScale(20) }}
            />
          </View>
        </KeyboardAwareScrollView>
      )}
    </BottomSheetModal>
  );
};
export default React.memo(AddressBottomSheet);

const styles = StyleSheet.create({
  addressTypeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScaleVertical(10),
    paddingHorizontal: moderateScale(3),
  },
  addNewAddeessText: {
    fontFamily: fontFamily.medium,
    fontSize: textScale(14),
    color: colors.textGreyD,
  },
  addAddessView: {
    justifyContent: 'space-between',
    marginBottom: moderateScaleVertical(24),
    alignItems: 'center',
  },
  textInput: {
    color: colors.textGrey,
    fontFamily: fontFamily.bold,
    fontSize: textScale(12),
    opacity: 1,
    minWidth: width / 2,
    maxWidth: width * 2,
  },
  textInput3: {
    color: colors.textGrey,
    fontFamily: fontFamily.bold,
    fontSize: textScale(12),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  addressHomeOrOfficeView: {
    flexDirection: 'row',
    marginRight: moderateScale(25),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    backgroundColor: colors.white,
    shadowOpacity: 0.2,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0.1 },
  },
  labelStyle: {
    fontFamily: fontFamily.medium,
    fontSize: textScale(14),
    color: colors.textGreyD,
  },
  addressViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: moderateScale(10),
    borderBottomWidth: 0.5,
    marginBottom: moderateScaleVertical(4),
  },
  closeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScaleVertical(10),
    marginTop: moderateScaleVertical(90),
  },
  scrollViewAddressModal: {
    borderTopLeftRadius: moderateScale(15),
    borderTopRightRadius: moderateScale(15),
    flex: 1,
  },
  mainViewAddressModal: {
    paddingTop: moderateScaleVertical(20),
    paddingBottom: moderateScaleVertical(75),
    marginHorizontal: moderateScale(16),
  },
  yourLocTxt: {
    fontFamily: fontFamily.medium,
    fontSize: textScale(14),
    textAlign: 'left',
  },
  searchPlaceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(7),
    flex: 1,
  },
  mapCloseBtn: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(6),
    borderRadius: moderateScale(8),
  },
  pinIcon: {
    width: moderateScale(15),
    height: moderateScaleVertical(15),
    resizeMode: 'contain',
    tintColor: colors.themeColor,
  },
  selectViaMapTxt: {
    fontSize: textScale(11),
    fontFamily: fontFamily.regular,
    marginLeft: moderateScale(4),
  },
  emptyView: {
    marginBottom: 5,
    borderBottomWidth: 1,
    marginTop: 4,
  },
  countryContainer: {
    height: moderateScaleVertical(49),
    borderBottomWidth: 1,
    borderRadius: 13,
    marginBottom: 20,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pincodeComp: {
    flex: 0.48,
    color: colors.textGrey,
    fontFamily: fontFamily.bold,
    fontSize: textScale(12),
    opacity: 1,
    borderBottomWidth: 1,
  },
  formatedAddress: {
    fontSize: textScale(10),
    color: colors.textGreyJ,
    fontFamily: fontFamily.regular,
    lineHeight: moderateScaleVertical(20),
  },
  useCurrentLoc: {
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
    marginLeft: moderateScale(8),
    color: colors.redB,
  },
  currentAdrsTxt: {
    fontSize: textScale(12),
    fontFamily: fontFamily.regular,
    marginLeft: moderateScale(8),
    color: colors.blackOpacity66,
    marginTop: moderateScaleVertical(4),
  },
});
