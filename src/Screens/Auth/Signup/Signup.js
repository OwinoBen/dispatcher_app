import { cloneDeep, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  I18nManager,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import DocumentPicker from 'react-native-document-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import Header from '../../../Components/Header';
import { loaderOne } from '../../../Components/Loaders/AnimatedLoaderFiles';
import PhoneNumberInput from '../../../Components/PhoneNumberInput';
import TextInputWithlabel from '../../../Components/TextInputWithlabel';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';
// import store from '../../../redux/store';
import colors from '../../../styles/colors';
import commonStylesFunc from '../../../styles/commonStyles';
import fontFamily from '../../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { cameraHandler } from '../../../utils/commonFunction';
import {
  employeetypeArray,
  transportationArray,
} from '../../../utils/constants/ConstantValues';
import { appIds, shortCodes } from '../../../utils/constants/DynamicAppKeys';
import {
  showError,
  showErrorOnModal,
  showSuccess,
} from '../../../utils/helperFunctions';
import { androidCameraPermission } from '../../../utils/permissions';
import { getItem } from '../../../utils/utils';
import {
  default as validations,
  default as validator,
} from '../../../utils/validations';
import stylesFunction from './styles';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import DatePickerModal from '../../../Components/DatePickerModal';
import moment from 'moment';
import { getBundleId } from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';
import codes from 'country-calling-code';

import DeviceCountry, {
  TYPE_ANY,
  TYPE_TELEPHONY,
  TYPE_CONFIGURATION,
} from 'react-native-device-country';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import ModalComponent from '../../../Components/ModalComponent';
import RNOtpVerify from 'react-native-otp-verify';
import BottomSheetForm from '../../../Components/BottomSheetForm';

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

export default function Signup({ route, navigation }) {
  const modalRef = useRef(null);

  const {appData,  clientInfo, defaultLanguage } = useSelector(state => state?.initBoot);
  var dummyTags = '';
  const [state, setState] = useState({
    isLoading: false,
    fullName: '',
    phoneNumber: '',
    callingCode:
      !isEmpty(getPhonesCallingCodeAndCountryData) &&
        (getBundleId() !== appIds.SXM2GO && getBundleId() !== appIds.speedyDelivery)
        ? getPhonesCallingCodeAndCountryData[0]?.countryCodes[0]?.replace(
          '-',
          '',
        )
        : getBundleId() == appIds.speedyDelivery ? "1"
          : '91',
    cca2:
      !isEmpty(getPhonesCallingCodeAndCountryData) &&
        (getBundleId() !== appIds.SXM2GO && getBundleId() !== appIds.speedyDelivery)
        ? getPhonesCallingCodeAndCountryData[0]?.isoCode2
        : getBundleId() == appIds.speedyDelivery ? "DO" : 'IN',
    allTransportation: transportationArray,
    allEmployeeTypes: employeetypeArray,
    selectedVehicleType: null,
    modelMake: '',
    vehicleColor: '',
    vehiclePlateNumber: '',
    userImage: null,
    selectedEpmloyeetype: null,
    documentData: [],
    addtionalTextInputs: [],
    addtionalImages: [],
    addtionalPdfs: [],
    dataToSet: [],
    profilePic: true,
    addtionSelectedImage: null,
    addtionSelectedImageIndex: null,
    savedShortCode: null,
    driverTags: [],
    driverTeams: [],
    selectedTags: [],
    isTagsShow: false,
    tagsViewHeight: moderateScale(44),
    selectedTeam: '',
    isTeams: false,
    driverTagsAry: [],
    isWaitingModal: false,
    additionalDateFields: [],
    isDatePicker: false,
    selectedDateField: {},
    selectedDate: new Date(),
    customerType: [
      { id: 1, name: 'Individual' },
      { id: 2, name: 'Retail Store' },
      { id: 3, name: 'Distribution center' },
    ],
    selectedCustomerType: null,
    isCustomer: false,
    vehicleTypes: [],
    isVisible: false
  });

  const {
    isCustomer,
    selectedCustomerType,
    customerType,
    userImage,
    vehiclePlateNumber,
    isLoading,
    fullName,
    phoneNumber,
    callingCode,
    cca2,
    allTransportation,
    selectedVehicleType,
    modelMake,
    vehicleColor,
    allEmployeeTypes,
    selectedEpmloyeetype,
    documentData,
    addtionalTextInputs,
    addtionalImages,
    addtionalPdfs,
    dataToSet,
    profilePic,
    addtionSelectedImage,
    addtionSelectedImageIndex,
    savedShortCode,
    driverTags,
    driverTeams,
    selectedTags,
    isTagsShow,
    tagsViewHeight,
    selectedTeam,
    isTeams,
    driverTagsAry,
    isWaitingModal,
    additionalDateFields,
    isDatePicker,
    selectedDateField,
    selectedDate,
    vehicleTypes,
    isVisible,
  } = state;
  const [isOtpModal, setOtpModal] = useState(false);
  const [otpToShow, setOtpToShow] = useState('');
  const [isSendOtpLoading, setSendOtpLoading] = useState(false);
  const [isSignupLoading, setSignupLoading] = useState(false);
  const [appHashKey, setAppHashKey] = useState('');
  const [userData, setUserData] = useState({})
  console.log(callingCode, 'mobilNomobilNo')
  const commonStyles = commonStylesFunc({ fontFamily });

  const updateState = data => setState(state => ({ ...state, ...data }));

  const styles = stylesFunction({ defaultLanguage });

  //On country change
  const _onCountryChange = data => {
    updateState({ cca2: data.cca2, callingCode: data.callingCode[0] });
    return;
  };
  let actionSheet = useRef();
  const showActionSheet = value => {
    console.log(value, 'value>value');
    updateState({ profilePic: value });
    setTimeout(() => {
      actionSheet.current.show();
    }, 500);
  };

  useEffect(() => {
    (async () => {
      const savedCode = await getItem('saveShortCode');
      if (savedCode == shortCodes?.loopWhole) {
        updateState({ selectedEpmloyeetype: allEmployeeTypes[0] });
      }
      updateState({ savedShortCode: savedCode });
    })();
  }, [selectedEpmloyeetype]);

  useEffect(() => {
    getRequiredDatas();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNOtpVerify.getHash()
        .then(res => {
          setAppHashKey(res[0]);
        })
        .catch();
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

  const otpHandler = message => {
    console.log(message, 'complete msg>>>');
    if (!!message) {
      let msgOTP = message.replace(/[^0-9]/g, '');
      let OTP = msgOTP.substring(0, 6);
      setOtpToShow(OTP);
    }
    RNOtpVerify.removeListener();
    Keyboard.dismiss();
  };

  const getRequiredDatas = () => {
    (async () => {
      actions
        .signupDoc(
          {},
          {
            client: clientInfo?.database_name,
          },
        )
        .then(res => {
          console.log(res?.data?.documents, 'getRequiredDatas data');

          updateState({
            driverTags: res?.data?.agent_tags,
            driverTagsAry: res?.data?.agent_tags,
            driverTeams: res?.data?.all_teams,
            vehicleTypes: res?.data?.vehicle_types,
          });
          if (res?.data) {
            updateState({
              addtionalTextInputs: res?.data?.documents.filter(
                x => x?.file_type == 'Text',
              ),
              addtionalImages: res?.data?.documents.filter(
                x => x?.file_type == 'Image',
              ),
              addtionalPdfs: res?.data?.documents.filter(
                x => x?.file_type == 'Pdf',
              ),
              additionalDateFields: res?.data?.documents.filter(
                x => x?.file_type == 'Date',
              ),
              dataToSet: res?.data?.documents.map((i, inx) => {
                return {
                  type: i?.file_type,
                  value: '',
                };
              }),
            });
          }
          updateState({ isLoading: false, documentData: res?.data });
        })
        .catch(errorMethod);
    })();
  };

  // this funtion use for camera handle
  const cameraHandle = async index => {
    // alert(addtionSelectedImageIndex);
    const permissionStatus = await androidCameraPermission();
    if (permissionStatus) {
      if (index == 0 || index == 1) {
        cameraHandler(index, {
          width: 300,
          height: 400,
          cropping: true,
          cropperCircleOverlay: true,
          mediaType: 'photo',
        })
          .then(res => {
            console.log(res, 'resasfasdfsdf');
            if (res.path) {
              if (profilePic) {
                updateState({ userImage: res?.sourceURL || res?.path });
              } else {
                let data = cloneDeep(addtionalImages);
                data[addtionSelectedImageIndex].value =
                  res?.sourceURL || res?.path;
                data[addtionSelectedImageIndex].filename1 =
                  addtionSelectedImage?.name;
                data[addtionSelectedImageIndex].file_type =
                  addtionSelectedImage?.file_type;
                data[addtionSelectedImageIndex].id = addtionSelectedImage?.id;
                data[addtionSelectedImageIndex].mime = res?.mime;
                console.log(data, 'data>>>>');

                updateState({ addtionalImages: data });
              }
            } else {
              showError(strings.PICKERCANCLLED);
            }
          })
          .catch(err => {
            console.log(err, 'error');
          });
      }
    }
  };

  console.log(clientInfo?.is_freelancer, "fasdkjhfgkasdhlkfjhasdf")

  const isValidData = () => {
    const error = validator({ phoneNumber });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const _onSignup = () => {
    if (otpToShow?.length !== 6) {
      // showErrorOnModal(modalRef, strings.OTPNOTVALID);
      alert(strings.OTPNOTVALID);
      return;
    }
    setSignupLoading(true);
    dummyTags = selectedTags.map(item => {
      return item.name;
    });
    dummyTags = dummyTags.join(',');
    let formdata = new FormData();
    formdata.append('name', fullName);
    formdata.append('phone_number', `+${callingCode}${phoneNumber}`);
    formdata.append('type', selectedEpmloyeetype?.typeName);
    formdata.append('vehicle_type_id', selectedVehicleType?.id);
    formdata.append('team_id', !!selectedTeam ? selectedTeam?.id : '');
    formdata.append('tags', dummyTags ? dummyTags : '');
    formdata.append('otp', otpToShow);

    if (getBundleId() == appIds?.trucxi && selectedCustomerType) {
      formdata.append('customer_type_id', selectedCustomerType?.id);
    }
    formdata.append('profile_picture', {
      type: 'image/jpeg',
      name: `${Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5)}.jpg`,
      uri: userImage,
    });

    if (!isEmpty(addtionalTextInputs)) {
      addtionalTextInputs.map((i, inx) => {
        console.log(i, 'addtionalTextInputsaddtionalTextInputs');
        if (i?.contents != '' && !!i?.contents) {
          formdata.append(`${i?.name}`, i?.contents);
        }
      });
    }
    if (!isEmpty(additionalDateFields)) {
      additionalDateFields.map((i, inx) => {
        if (i?.contents != '' && !!i?.contents) {
          formdata.append(`files_text[${inx}][file_type]`, i?.file_type);
          formdata.append(`files_text[${inx}][id]`, i?.id);
          formdata.append(
            `files_text[${inx}][contents]`,
            moment(i?.contents).format('YYYY-MM-DD'),
          );
          formdata.append(`files_text[${inx}][label_name]`, i?.name);
        }
      });
    }

    if (!isEmpty(addtionalTextInputs)) {
      addtionalTextInputs.map((i, inx) => {
        console.log(i, inx, 'inxxxx')
        if (i?.contents != '' && !!i?.contents) {
          formdata.append(`files_text[${inx}][file_type]`, i?.file_type);
          formdata.append(`files_text[${inx}][id]`, i?.id);
          formdata.append(
            `files_text[${inx}][contents]`, i?.contents,
          );
          formdata.append(`files_text[${inx}][label_name]`, i?.name);
        }
      });
    }

    let concatinatedArray = addtionalImages.concat(addtionalPdfs);

    if (!isEmpty(concatinatedArray)) {
      concatinatedArray.map((i, inx) => {
        if (i?.value) {
          formdata.append(`other[${inx}][file_type]`, i?.file_type);
          formdata.append(`other[${inx}][id]`, i?.id);
          formdata.append(`other[${inx}][filename1]`, i?.filename1);
        }
      });
    }

    if (!isEmpty(concatinatedArray)) {
      concatinatedArray.map((i, inx) => {
        if (i?.value) {
          formdata.append(`uploaded_file[${inx}]`, {
            name: i?.filename1,
            type: i?.mime,
            uri: i?.value,
          });
        }
      });
    }
    console.log(formdata, 'formdaataaaaaa');
    actions
      .signUp(formdata, {
        client: clientInfo?.database_name,
        language: 1,
        'Content-Type': 'multipart/form-data',
      })
      .then(res => {
        setOtpModal(false);
        setSignupLoading(false);
        setUserData(res?.data);
        if (clientInfo?.is_freelancer) {
          setTimeout(() => {
            updateState({ isVisible: true });
          }, 500);
        } else {
          onSignupDone();
        }
        setOtpToShow('');
      })
      .catch(errorMethod);
  };

  const onSendOtp = () => {
    var isRequired = true;

    if (!userImage) {
      return showError(strings.SETIMAGE);
    }
    const nameError = validations({
      name: fullName,
    });
    if (nameError) {
      return showError(nameError);
    }
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }

    if (selectedTeam == '' && !selectedTeam) {
      showError(`${strings.PLEASE_SELECT} ${strings.A_TEAM}`);
      return;
    }
    if (getBundleId() == appIds?.trucxi && !selectedCustomerType) {
      alert(getBundleId() == appIds?.trucxi);
      showError(strings.PLEASESELECTCUSTOMERTYPE);
      return;
    }

    if (addtionalTextInputs?.length) {
      addtionalTextInputs.map((i, inx) => {
        if (!i?.contents && i?.is_required) {
          if (isRequired) {
            showError(`${strings.PLEASE_ENTER} ${i.name.toLowerCase()}`);
            isRequired = false;
            return;
          }
        }
      });
    }

    if (additionalDateFields?.length) {
      additionalDateFields.map((i, inx) => {
        if (!i?.contents && i?.is_required) {
          if (isRequired) {
            showError(`${strings.PLEASE_SELECT} ${i.name.toLowerCase()}`);
            isRequired = false;
            return;
          }
        }
      });
    }

    let concatinatedArray = addtionalImages.concat(addtionalPdfs);

    if (concatinatedArray?.length) {
      concatinatedArray.map((i, inx) => {
        if (!i?.value && i?.is_required) {
          if (isRequired) {
            showError(`${strings.PLEASE_UPLOAD} ${i.name.toLowerCase()}`);
            isRequired = false;
            return;
          }
        }
      });
    }

    if (concatinatedArray?.length) {
      concatinatedArray.map((i, inx) => {
        if (!i?.value && i?.is_required) {
          if (isRequired) {
            showError(`${strings.PLEASE_UPLOAD} ${i.name.toLowerCase()}`);
            isRequired = false;
            return;
          }
        }
      });
    }
    if (!isRequired) {
      return;
    }
    updateState({ isLoading: true });
    onSendOtpApi();
  };

  const onSendOtpApi = () => {
    setOtpToShow('');
    let data = {
      dial_code: callingCode,
      phone_number: phoneNumber,
    };
    if (Platform.OS === 'android' && !!appHashKey) {
      data['app_hash_key'] = appHashKey;
    }
    actions
      .sendOtpOnSignup(data, { client: clientInfo?.database_name })
      .then(res => {
        console.log(res, 'login data');
        if (res?.data) {
          updateState({ isLoading: false });
          setOtpModal(true);
          setSendOtpLoading(false);
          showErrorOnModal(modalRef, strings.OTPSENDSUCCESS);
        }
      })
      .catch(errorMethod);
  };

  const errorMethod = error => {
    console.log(error, 'erorororororo');
    updateState({ isLoading: false });
    setSendOtpLoading(false);
    setSignupLoading(false);
    isOtpModal
      ? alert(error?.message || error?.error)
      : showError(error?.message || error?.error);

    setOtpToShow('');
  };

  const _selectedTransportation = i => {
    updateState({
      selectedVehicleType: i,
    });
  };
  const _selectedEpmloyeetype = i => {
    updateState({
      selectedEpmloyeetype: i,
    });
  };

  //Get TextInput
  const getTextInputField = (type, index) => {
    return (
      <TextInputWithlabel
        onTouchStart={() => updateState({ isTagsShow: false })}
        labelStyle={styles.textInputlabel}
        editable={true}
        label={`${type?.name}${type.is_required ? '*' : ''}`}
        value={addtionalTextInputs[index]?.contents}
        onChangeText={text => updateArray(text, index, type)}
        mainStyle={{
          marginTop: 10,
        }}
      />
    );
  };

  //Get Date Fields

  const getDateFields = (type, index) => {
    return (
      <View
        style={{ marginVertical: moderateScaleVertical(10) }}
        key={String(index)}
        onTouchStart={() => updateState({ isTagsShow: false })}>
        <Text
          style={{
            fontSize: textScale(12),
            fontFamily: fontFamily.medium,
            color: colors.lightGreyBg2,
            marginBottom: moderateScale(10),
          }}>
          {type?.name}
          {type?.is_required ? '*' : ''}
        </Text>
        <TouchableOpacity
          onPress={() =>
            updateState({ isDatePicker: !isDatePicker, selectedDateField: type })
          }
          activeOpacity={0.7}
          style={{
            height: moderateScale(45),
            borderWidth: 1,
            borderRadius: moderateScaleVertical(4),
            borderColor: colors.borderLight,
            justifyContent: 'center',
            paddingHorizontal: moderateScale(10),
          }}>
          <Text
            style={{ fontFamily: fontFamily.regular, fontSize: textScale(12) }}>
            {!!type.contents
              ? moment(type.contents).format('DD-MMMM-YYYY')
              : ''}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  //Update Images
  const updateImages = (type, index) => {
    updateState({ addtionSelectedImage: type, addtionSelectedImageIndex: index });
    showActionSheet(false);
  };

  //Get Upload image view

  const getImageFieldView = (type, index) => {
    return (
      <View
        style={{
          marginRight: moderateScale(10),
          marginTop: moderateScale(10),
          width: moderateScale(110),
        }}>
        <TouchableOpacity
          onPress={() => updateImages(type, index)}
          style={styles.imageUpload}>
          {addtionalImages[index].value != undefined &&
            addtionalImages[index].value != null &&
            addtionalImages[index].value != '' ? (
            <Image
              source={{ uri: addtionalImages[index].value }}
              style={styles.imageStyle2}
            />
          ) : (
            <Image source={imagePath?.photoInactive} />
          )}
        </TouchableOpacity>
        <Text
          numberOfLines={2}
          style={{ ...styles.label3, minHeight: moderateScale(25) }}>
          {type?.name}
          {type.is_required ? '*' : ''}
        </Text>
      </View>
    );
  };

  const getDoc = async (value, index) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log(res, 'res>res');
      let data = cloneDeep(addtionalPdfs);
      if (res) {
        data[index].value = res[0].uri;
        data[index].filename = res[0].name;
        data[index].filename1 = value?.name;
        data[index].file_type = value?.file_type;
        data[index].id = value?.id;
        data[index].mime = res[0].type;

        console.log(data, 'addtionalPdfs>>>data');
        updateState({ addtionalPdfs: data });
      }

      // console.log(
      //   res.uri,
      //   res.type, // mime type
      //   res.name,
      //   res.size,
      // );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  //Get Pdf view

  const getPdfView = (type, index) => {
    return (
      <View
        onTouchStart={() => updateState({ isTagsShow: false })}
        style={{ marginRight: moderateScale(20), marginTop: moderateScale(20) }}>
        <TouchableOpacity
          onPress={() => getDoc(type, index)}
          style={{
            ...styles.imageUpload,
            height: 100,
            width: 100,
            borderRadius: moderateScale(4),
            borderWidth: 1,
            borderColor: colors.blue,
          }}>
          <Text style={styles.uploadStyle}>
            {addtionalPdfs[index].value != undefined &&
              addtionalPdfs[index].value != null &&
              addtionalPdfs[index].value != ''
              ? `${addtionalPdfs[index].filename}`
              : `+ ${strings.UPLOAD}`}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.label3]}>
          {type?.name}
          {type.is_required ? '*' : ''}
        </Text>
      </View>
    );
  };

  //Update Array for PDF

  //Update Array for image
  const updateArray = (text, index, type) => {
    let data = cloneDeep(addtionalTextInputs);
    data[index].contents = text;
    data[index].id = type?.id;
    data[index].file_type = type?.file_type;
    data[index].label_name = type?.name;
    console.log(data, 'data>>>data');
    updateState({ addtionalTextInputs: data });
  };

  const getEmployeeViewBasedOnClient = code => {
    switch (code) {
      case shortCodes.loopWhole:
        return null;
        break;
      default:
        return (
          <View
            onTouchStart={() => {
              updateState({ isTagsShow: false });
            }}
            style={{ marginTop: moderateScaleVertical(10) }}>
            <Text style={styles.employeetypeHeadingtext}>
              {strings.EMPLOYEETYPE}
            </Text>
            <ScrollView
          
              horizontal
              alwaysBounceHorizontal={false}
              style={styles.mainallEmployeeTypeStyle}
              containerStyle={styles.employeeInnerContainer}>
              {allEmployeeTypes.map((i, inx) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      _selectedEpmloyeetype(i);
                    }}
                    style={styles.employeeImageContainer}>
                    <Image
                      source={
                        selectedEpmloyeetype == i
                          ? imagePath.redioSelectedButton
                          : imagePath.redioUnSelectedButton
                      }
                    />
                    <Text
                      style={{
                        marginHorizontal: moderateScale(10),
                        fontSize: textScale(12),
                        fontFamily: fontFamily.medium,
                        color:
                          selectedEpmloyeetype == i
                            ? colors.themeColor
                            : colors.lightGreyBg2,
                      }}>
                      {i?.typeName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        );
        break;
    }
  };

  const _onTagSelect = (itm, indx) => {
    if (!selectedTags.includes(itm)) {
      updateState({
        selectedTags: [...selectedTags, itm],
      });
    } else {
      const selectedTagsAry = [...selectedTags];
      const ind = selectedTagsAry.findIndex(item => item.id === itm.id);
      var result = selectedTagsAry.filter((item, idx) => idx !== ind);
      updateState({
        selectedTags: result,
      });
    }
  };

  const removeTag = (itm, indx) => {
    const selectedTagsAry = [...selectedTags];
    const ind = selectedTagsAry.findIndex(item => item.id == itm.id);
    var result = selectedTagsAry.filter((item, idx) => idx !== ind);

    updateState({
      selectedTags: result,
    });
  };

  const onSearchTags = text => {
    const driverTagsNewAry = [...driverTags];
    let searchedAry;
    if (text) {
      searchedAry = driverTagsNewAry.filter(item => {
        return item?.name.toLowerCase().includes(text.toLowerCase());
      });
      updateState({ driverTagsAry: searchedAry });
    } else {
      updateState({ driverTagsAry: driverTagsNewAry });
    }
  };

  const onDateChange = value => {
    const data = cloneDeep(additionalDateFields);
    const ind = data.findIndex(item => item.id === selectedDateField?.id);
    selectedDateField.contents = value;
    data[ind] = selectedDateField;

    updateState({
      selectedDate: value,
      additionalDateFields: [...data],
    });
  };

  const _onCloseModal = () => {
    updateState({ isDatePicker: false, selectedDate: new Date() });
  };



  const onSignupDone = () => {
    updateState({ isWaitingModal: true });
    setTimeout(() => {
      updateState({ isWaitingModal: false });
      navigation.goBack();
    }, 5000);
  };

  const modalMainContent = useCallback(() => {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        nestedScrollEnabled
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View style={styles.modalMainViewOTP}>
          <Text
            style={{
              fontFamily: fontFamily.bold,
              fontSize: textScale(16),
              color: colors.themeColor,
            }}>
            OTP Verification
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.bold,
              fontSize: textScale(13),
              color: colors.blackOpacity43,
              marginVertical: moderateScaleVertical(6),
            }}>
            Please enter 6-digit code sent to {`+${callingCode}${phoneNumber}`}
          </Text>
          <SmoothPinCodeInput
            containerStyle={{ alignSelf: 'center' }}
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
            keyboardType="number-pad"
            onTextChange={otpToShow => setOtpToShow(otpToShow)}
          />

          <ButtonWithLoader
            onPress={() => {
              setSendOtpLoading(true);
              onSendOtpApi();
            }}
            btnText="RESEND OTP"
            isLoading={isSendOtpLoading}
            btnStyle={{
              backgroundColor: colors.transparent,
              borderWidth: 0,
              width: moderateScale(100),
              alignSelf: 'center',
            }}
            btnTextStyle={{
              color: colors.themeColor,
            }}
            color={colors.themeColor}
          />
          <ButtonWithLoader
            isLoading={isSignupLoading}
            btnStyle={{
              borderRadius: moderateScale(25),
              marginBottom: moderateScaleVertical(20),
            }}
            onPress={_onSignup}
            btnText={strings.SIGNUP}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }, [otpToShow, phoneNumber, callingCode, isSendOtpLoading, isSignupLoading]);

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
        centerTitle={strings.SIGNUP}
      />
      <View style={{ ...commonStyles.headerTopLine }} />
      <View
        style={{
          marginHorizontal: moderateScale(15),
          marginVertical: moderateScale(20),
        }}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          enableOnAndroid={true}
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <View style={styles.imageViewStyle}>
            {userImage ? (
              <TouchableOpacity onPress={() => showActionSheet(true)}>
                <Image source={{ uri: userImage }} style={styles.imageStyle} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => showActionSheet(true)}>
                <Image
                  source={imagePath?.photoInactive}
                  style={styles.imageStyle}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ marginTop: moderateScale(20) }}>
            <Text style={styles.label}>{strings.PERSONAL}</Text>
            <View style={{ marginTop: moderateScaleVertical(20) }}>
              <TextInputWithlabel
                editable={true}
                label={strings.FULLNAME}
                value={fullName}
                // autoFocus={true}
                onChangeText={text => updateState({ fullName: text })}
                labelStyle={styles.textInputlabel}

              />


              <View>
                <Text style={styles.label2}>{strings.PHONENUMBER}</Text>
              </View>
              <PhoneNumberInput
                onCountryChange={_onCountryChange}
                onChangePhone={phoneNumber =>
                  updateState({ phoneNumber: phoneNumber.replace(/[^0-9]/g, '') })
                }
                cca2={cca2}
                phoneNumber={phoneNumber}
                callingCode={callingCode}
                placeholder={strings.YOUR_PHONE_NUMBER}
                keyboardType={'phone-pad'}
                returnKeyType={'done'}
                color={colors.black}
                borderColor={colors.themeColor}
                containerStyle={{
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: colors.borderLight,
                }}
                borderLeftColor={colors.borderLight}
              />
            </View>

            <Text
              style={{
                ...styles.labelTxt,
                marginVertical: moderateScaleVertical(10),
              }}>
              {strings.TEAMS}
            </Text>

            <View style={{ zIndex: 10 }}>
              <TouchableOpacity
                style={{
                  borderRadius: 8,
                  height: moderateScaleVertical(44),
                  paddingHorizontal: moderateScale(5),
                  borderWidth: 1,
                  borderColor: colors.borderLight,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                activeOpacity={0.7}
                onPress={() =>
                  updateState({
                    isTeams: !isTeams,
                    isDriverType: false,
                    isTagsShow: false,
                  })
                }>
                <Text
                  style={{
                    ...styles.labelTxt,
                    marginBottom: 0,
                  }}>
                  {!!selectedTeam ? selectedTeam?.name : strings.SELECT_TEAM}
                </Text>
                <Image source={imagePath.dropDownNew} />
              </TouchableOpacity>

              {isTeams && (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.borderColorB,
                    backgroundColor: colors.white,
                    width: '100%',
                    paddingHorizontal: moderateScale(10),
                    paddingVertical: moderateScale(5),
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    minHeight: moderateScale(50),
                    borderRadius: moderateScale(5),
                   
                  }}>
                  <ScrollView 
                  nestedScrollEnabled
                  overScrollMode='always'
                style={{
                  maxHeight: 200
                }}
                  >
                    {driverTeams?.length > 0 ? (
                      <View>
                        {driverTeams.map((itm, indx) => {
                          return (
                            <TouchableOpacity
                              key={indx}
                              onPress={() =>
                                updateState({
                                  selectedTeam: itm,
                                  isTeams: false,
                                })
                              }
                              style={{
                                marginVertical: moderateScale(5),
                              }}>
                              <Text>{itm.name}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ) : (
                      <View
                        style={{
                          ...styles.noDataFound,
                          backgroundColor: colors.white,
                        }}>
                        <Text
                          style={{
                            fontFamily: fontFamily.medium,
                            fontSize: moderateScale(13),
                          }}>
                          {strings.NODATAFOUND}
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Select Customer type */}

            {getBundleId() == appIds.trucxi && (
              <View>
                <Text
                  style={{
                    ...styles.labelTxt,
                    marginVertical: moderateScaleVertical(10),
                  }}>
                  {strings.CUSTOMERTYPE}
                </Text>

                <View style={{ zIndex: 5 }}>
                  <TouchableOpacity
                    style={{
                      borderRadius: 8,
                      height: moderateScaleVertical(44),
                      paddingHorizontal: moderateScale(5),
                      borderWidth: 1,
                      borderColor: colors.borderLight,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    activeOpacity={0.7}
                    onPress={() =>
                      updateState({
                        isCustomer: !isCustomer,
                        isDriverType: false,
                        isTagsShow: false,
                      })
                    }>
                    <Text
                      style={{
                        ...styles.labelTxt,
                        marginBottom: 0,
                      }}>
                      {!!selectedCustomerType
                        ? selectedCustomerType?.name
                        : strings.SELECT_TEAM}
                    </Text>
                    <Image source={imagePath.dropDownNew} />
                  </TouchableOpacity>

                  {isCustomer && (
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: colors.borderColorB,
                        backgroundColor: colors.white,
                        width: '100%',
                        paddingHorizontal: moderateScale(10),
                        paddingVertical: moderateScale(5),
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        minHeight: moderateScale(50),
                        borderRadius: moderateScale(5),
                        maxHeight: moderateScale(150),
                      }}>
                      <ScrollView>
                        {customerType?.length > 0 ? (
                          <View>
                            {customerType.map((itm, indx) => {
                              return (
                                <TouchableOpacity
                                  key={indx}
                                  onPress={() =>
                                    updateState({
                                      selectedCustomerType: itm,
                                      isCustomer: false,
                                    })
                                  }
                                  style={{
                                    marginVertical: moderateScale(5),
                                  }}>
                                  <Text>{itm.name}</Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        ) : (
                          <View
                            style={{
                              ...styles.noDataFound,
                              backgroundColor: colors.white,
                            }}>
                            <Text
                              style={{
                                fontFamily: fontFamily.medium,
                                fontSize: moderateScale(13),
                              }}>
                              {strings.NODATAFOUND}
                            </Text>
                          </View>
                        )}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
            )}
            <Text
              style={{
                marginVertical: moderateScaleVertical(10),
                fontSize: textScale(12),
                fontFamily: fontFamily.medium,
                color: colors.lightGreyBg2,
              }}>
              {strings.TAGS}
            </Text>

            <View style={{ zIndex: 2, marginBottom: moderateScale(10) }}>
              <View
                onLayout={event => {
                  updateState({
                    tagsViewHeight: event.nativeEvent.layout.height,
                  });
                }}
                style={{
                  minHeight: moderateScaleVertical(44),
                  color: colors.white,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingVertical: 3,
                  paddingHorizontal: 3,
                  justifyContent: 'center',
                  borderColor: colors.borderLight,
                }}>
                <View>
                  {selectedTags?.length > 0 && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {selectedTags.map((item, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => removeTag(item, index)}
                            activeOpacity={0.7}
                            style={{
                              borderWidth: 1,
                              borderColor: colors.borderColorB,
                              alignItems: 'center',
                              backgroundColor: colors.borderColorB,
                              marginHorizontal: moderateScale(2),
                              flexDirection: 'row',
                              marginVertical: 3,
                              width: (width - moderateScale(52)) / 3,
                              justifyContent: 'space-around',
                              borderRadius: moderateScale(5),
                              paddingVertical: moderateScale(3),
                            }}>
                            <Image
                              source={imagePath.ic_cross}
                              style={{
                                height: 15,
                                width: 15,
                                tintColor: colors.black,
                              }}
                            />
                            <Text
                              numberOfLines={1}
                              style={{
                                fontFamily: fontFamily.regular,
                                marginLeft: 3,
                              }}>
                              {item?.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                  <TextInput
                    placeholder={strings.SELCTED_TAG}
                    onFocus={() => updateState({ isTagsShow: true })}
                    onBlur={() => updateState({ isTagsShow: false })}
                    onChangeText={onSearchTags}
                    style={{
                      opacity: 0.7,
                      color: colors.textGreyOpcaity7,
                      fontFamily: fontFamily.medium,
                      fontSize: textScale(14),
                      paddingHorizontal: 8,
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                    }}
                  />
                </View>
              </View>
              {isTagsShow && (
                <View
                  style={{
                    backgroundColor: colors.white,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    width: '100%',
                  }}>
                  {driverTagsAry?.length > 0 ? (
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                      {driverTagsAry.map((item, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => _onTagSelect(item, index)}
                            activeOpacity={0.7}
                            style={{
                              ...styles.driverTagsView,
                              borderColor: selectedTags.includes(item)
                                ? colors.themeColor
                                : colors.borderColorB,
                              backgroundColor: selectedTags.includes(item)
                                ? colors.themeColor
                                : colors.borderColorB,
                            }}>
                            <Text
                              numberOfLines={2}
                              style={{
                                textAlign: 'center',
                                color: selectedTags.includes(item)
                                  ? colors.white
                                  : colors.black,
                              }}>
                              {item?.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <View style={styles.noDataFound}>
                      <Text
                        style={{
                          fontFamily: fontFamily.medium,
                          fontSize: moderateScale(13),
                        }}>
                        {strings.NODATAFOUND}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
            {vehicleTypes !== '' && vehicleTypes ? (
              <>
                <View
                  onTouchStart={() => updateState({ isTagsShow: false })}
                  style={{ marginVertical: moderateScaleVertical(5) }}>
                  <Text style={styles.label}>{strings.TRASNPORTATION}</Text>
                </View>

                <View onTouchStart={() => updateState({ isTagsShow: false })}>
                  <ScrollView
                    horizontal
                    alwaysBounceHorizontal={false}
                    style={styles.transporationOuterContainer}>
                    {allTransportation?.map((i, inx) => {
                      if (savedShortCode === shortCodes.drus && inx == 0)
                        return;
                      if (vehicleTypes?.includes(i?.id)) {
                        return (
                          <TouchableOpacity
                            style={[
                              styles.transportationContainer,
                              { ...styles.shadowStyle },
                            ]}
                            onPress={() => {
                              _selectedTransportation(i);
                            }}>
                            {selectedVehicleType == i ? (
                              <Image
                                style={{ position: 'absolute', end: 5, top: 10 }}
                                source={imagePath.blue_tik}
                              />
                            ) : null}

                            <Image
                              source={
                                selectedVehicleType == i
                                  ? i.activeIcon
                                  : i.inactiveIcon
                              }
                            />
                          </TouchableOpacity>
                        );
                      }
                    })}
                  </ScrollView>
                </View>
              </>
            ) : null}
            {/* { getEmployeeViewBasedOnClient(savedShortCode)} */}

            {!!(addtionalTextInputs && addtionalTextInputs?.length) &&
              addtionalTextInputs.map((item, index) => {
                return getTextInputField(item, index);
              })}

            {!isEmpty(additionalDateFields) &&
              additionalDateFields.map((item, index) => {
                return getDateFields(item, index);
              })}

            {!!(addtionalImages && addtionalImages?.length) && (
              <View style={styles.viewStyleForUploadImage}>
                {addtionalImages.map((item, index) => {
                  return getImageFieldView(item, index);
                })}
              </View>
            )}

            {!!(addtionalPdfs && addtionalPdfs?.length) && (
              <View style={styles.viewStyleForUploadImage}>
                {addtionalPdfs.map((item, index) => {
                  return getPdfView(item, index);
                })}
              </View>
            )}
          </View>
          <GradientButton
            onPress={onSendOtp}
            containerStyle={{ marginVertical: moderateScaleVertical(40) }}
            // onPress={_onLogin}
            marginTop={moderateScaleVertical(20)}
            marginBottom={moderateScaleVertical(40)}
            textStyle={{ color: colors.black }}
            btnText={strings.SEND_OTP}
            colorsArray={[colors.themeColor, colors.themeColor]}
          />
        </KeyboardAwareScrollView>

        <ActionSheet
          ref={actionSheet}
          // title={'Choose one option'}
          options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={index => cameraHandle(index)}
        />
      </View>

      <DatePickerModal
        isVisible={isDatePicker}
        onclose={_onCloseModal}
        onSelectDate={_onCloseModal}
        onDateChange={onDateChange}
        date={selectedDate}
        mode="date"
      />
      <Modal
        isVisible={isWaitingModal}
        style={{ margin: 0, justifyContent: 'flex-end' }}>
        <View style={styles.modalMainView}>
          <Text style={styles.thanksMsgTxt}>{strings.THANKS_MSG}</Text>
          <Text style={styles.signupDoneTxt}>
            {strings.SINGNUP_COMPLETED_NOTIFIED_SOON}
          </Text>
        </View>
      </Modal>
      <ModalComponent
        onClose={() => setOtpModal(false)}
        isVisible={isOtpModal}
        modalRef={modalRef}
        modalStyle={{
          margin: 0,
          justifyContent: 'flex-end',
          marginHorizontal: 0,
        }}
        modalMainContent={modalMainContent}
        mainViewStyle={{
          borderTopLeftRadius: moderateScale(10),
          borderTopRightRadius: moderateScale(10),
        }}
      />

      {
        isVisible && (
          <BottomSheetForm
            onCloseSheet={() => updateState({ isVisible: false })}
            onSignupDone={onSignupDone}
            userDataSignup={userData}
          />
        )
      }
    </WrapperContainer>
  );
}
