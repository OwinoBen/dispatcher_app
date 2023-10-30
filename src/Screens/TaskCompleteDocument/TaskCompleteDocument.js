import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert, Dimensions, FlatList, Image, Keyboard, Platform, Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import RNFS from 'react-native-fs';
import { useSelector } from 'react-redux';
import ButtonComponent from '../../Components/ButtonComponent';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
// import store from '../../redux/store';
import FaceSDK, {
  Enum,
  FaceCaptureResponse, Image as FaceImage, MatchFacesRequest, MatchFacesResponse
} from '@regulaforensics/react-native-face-api-beta';
import { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import { getBundleId } from 'react-native-device-info';
import { Dropdown } from 'react-native-element-dropdown';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNFetchBlob from 'rn-fetch-blob';
import DatePickerModal from '../../Components/DatePickerModal';
import ModalView from '../../Components/Modal';
import colors from '../../styles/colors';
import commonStylesFunc, { hitSlopProp } from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../../styles/responsiveSize';
import { cameraHandler, checkValueExistInAry } from '../../utils/commonFunction';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import { getAllTravelDetails } from '../../utils/googlePlaceApi';
import { showError, showSuccess } from '../../utils/helperFunctions';
import { openCamera } from '../../utils/imagePicker';
import {
  checkCameraPermission,
  chekLocationPermission
} from '../../utils/permissions';
import stylesFunc from './styles';
navigator.geolocation = require('react-native-geolocation-service');

var image1 = new FaceImage();
var image2 = new FaceImage();
var request = new MatchFacesRequest();

const window = Dimensions.get('window');
let pressedItem = {};
export default function TaskCompleteDocument({ route, navigation }) {
  const userData = useSelector(state => state?.auth?.userData);
  const { clientInfo, attributeFormData } = useSelector(state => state?.initBoot);

  const taskDetail = route?.params?.data?.taskDetail;
  const updatedProofArray = route?.params?.data?.updatedProofArray;
  const findDataToCheck = route?.params?.data?.findDataToCheck;
  const params = route?.params;
  const [state, setState] = useState({
    isLoading: false,
    taskProofArray: updatedProofArray,
    updatedProofArray: [],
    showInputBox: false,
    note: '',
    signatureImage: null,
    signatureImageName: null,
    image: null,
    imageName: null,
    faceImage: null,
    faceImageName: null,
    barcode: null,
    otpField: '',
    img1: null,
    img2: null,
    similarity: null,
    liveness: null,
    currrentlatitude: null,
    currrentlongitude: null,
    speed: null,
    isModalVisible: false,
    totalTravelData: null,
    qrCode: null,
    isShowQrCodeVendor: false,
    qrCodeVendorDetail: {},
  });

  const {
    faceImage,
    faceImageName,
    img1,
    img2,
    signatureImageName,
    imageName,
    isLoading,
    image,
    taskProofArray,
    showInputBox,
    note,
    barcode,
    signatureImage,
    otpField,
    similarity,
    liveness,
    currrentlatitude,
    currrentlongitude,
    speed,
    isModalVisible,
    totalTravelData,
    qrCode,
    isShowQrCodeVendor,
    qrCodeVendorDetail,
  } = state;
  const [isLoadingSubmitAttributes, setLoadingSubmitAttributes] = useState(false)
  const [attributeInfo, setAttributeInfo] = useState([])
  const [isDatePicker, setIsDatePicker] = useState(false)
  const [selectedDateItem, setSelectedDateItem] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date())


  useEffect(() => {
    const attributeFormDataNew = cloneDeep(attributeFormData)
    setAttributeInfo(attributeFormDataNew)
  }, [taskDetail?.tasktype?.name])


  const commonStyles = commonStylesFunc({ fontFamily });
  const updateState = data => setState(state => ({ ...state, ...data }));

  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );

  const styles = stylesFunc({ defaultLanguagae });

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };

  useEffect(() => {
    (async () => {
      currentLocation();
      getAllMovingDetails([
        { pickupAddress: taskDetail?.order?.task[0]?.location?.address },
        { dropAddress: taskDetail?.order?.task[1]?.location?.address },
      ]);
    })();
    return () => { };
  }, []);

  const getAllMovingDetails = data => {
    getAllTravelDetails(data)
      .then(res => {
        updateState({
          totalTravelData: res?.rows[0]?.elements[0],
        });
      })
      .catch(error => {
        console.log(error, 'error error error');
      });
  };

  const currentLocation = () => {
    chekLocationPermission()
      .then(result => {
        if (result !== 'goback') {
          getCurrentPosition();
        }
      })
      .catch(error => console.log('error while accessing location ', error));
  };

  const getCurrentPosition = () => {
    return navigator.geolocation.default.getCurrentPosition(
      position => {
        console.log(position, 'position');
        updateState({
          currrentlatitude: position.coords.latitude,
          currrentlongitude: position.coords.longitude,
          speed: position.coords.speed,
        });
      },
      error => console.log(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
      },
    );
  };

  useEffect(() => {
    // RNFS.readFile(userData?.image_url, 'base64').then(res => {
    //   console.log(res, 'readFile>readFile');
    // });

    const fs = RNFetchBlob.fs;
    let imagePath = null;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', userData?.image_url)
      // the image is now dowloaded to device's storage
      .then(resp => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then(base64Data => {
        // here's base64 encoded image
        // image1.bitmap = base64Data;
        // image1.imageType = Enum.ImageType.IMAGE_TYPE_PRINTED;
        setImage(true, base64Data, Enum.ImageType.IMAGE_TYPE_PRINTED);
        // remove the file from storage
        return fs.unlink(imagePath);
      });
  }, []);

  //Error handling in api
  const errorMethod = error => {
    updateState({ isLoading: false, isRefreshing: false, isLoading: false });
    showError(error?.message || error?.error);
  };

  const onImageLayout = e => {
    // console.log(e.event, 'e.event');
  };

  /*****Update Signatur****** */
  const updateSignature = data => {
    console.log(data, 'saved signature result');
    if (data && data?.encoded) {
      const imageData = data?.encoded;

      const imagePath = `${RNFS.DocumentDirectoryPath}/${Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5)}.jpg`;
      console.log(imagePath, 'imagePath');

      RNFS.writeFile(imagePath, imageData, 'base64')
        .then(res => {
          console.log(res, 'res>>>>res');
          console.log(
            'Image converted to jpg and saved at ' + `file://${imagePath}`,
          ),
            updateState({
              signatureImage:
                Platform.OS == 'ios' ? imagePath : `file://${imagePath}`,
            });
          setTimeout(() => {
            unlinkDirectory(data?.pathName);
          }, 3000);
        })
        .catch(err => {
          console.log(err, 'error>>>>');
        });
    }
  };
  /***** */

  /****Unlink Directory*** */
  const unlinkDirectory = imagePath => {
    RNFS.unlink(imagePath)
      .then(() => {
        console.log('FILE DELETED');
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch(err => {
        console.log(err.message);
      });
  };
  /***** */
  const updateBarcodeScan = data => {
    if (data?.data == taskDetail?.barcode) {
      updateState({
        barcode: taskDetail?.barcode,
      });
    } else {
      updateState({ barcode: null });
      showError(strings.QRCODENOTMATCHED);
    }
  };

  const updateQRcodeScan = data => {
    console.log(data, 'data>>>>>data');
    updateState({
      qrCode: data?.data,
    });
  };

  /******On Press doc options**** */
  const onPressCategory = i => {
    pressedItem == i;

    //Signature upload
    if (i?.id == 1) {
      updateState({ showInputBox: false });
      // pickImage(false);
      moveToNewScreen(navigationStrings.ADDSIGNATURE, {
        updateSignature: data => {
          updateSignature(data);
        },
      })();
    }

    //Photo upload
    if (i?.id == 2) {
      Alert.alert(
        'Select option',
        '',
        [
          {
            text: 'Use camera',
            onPress: () => {
              openCamera()
                .then(res =>
                  updateState({
                    isLoading: false,
                    image: res?.path || res?.path,
                  }),
                )
                .catch(error => updateState({ isLoading: false }));
            },
          },
          getBundleId() !== appIds.exprexpro && {
            text: 'Use gallery',
            onPress: () => {
              // options['includeBase64'] = true;
              updateState({ showInputBox: false });
              cameraHandler(1, {
                cropping: false,
                compressImageQuality: 0.1,
                cropperCircleOverlay: false,
                mediaType: 'photo',
              })
                .then(res => {
                  if (res?.data) {
                    console.log(res, 'Photo repsonse');
                    updateState({
                      isLoading: false,
                      image: res?.path || res?.path,
                    });
                  } else {
                    updateState({ isLoading: false });
                  }
                })
                .catch(err => {
                  updateState({ isLoading: false });
                });
            },
          },
          {
            text: 'Use camera',
            onPress: () => {
              openCamera()
                .then(res =>
                  updateState({
                    isLoading: false,
                    image: res?.path || res?.path,
                  }),
                )
                .catch(error => updateState({ isLoading: false }));
            },
          },
        ],
        { cancelable: true },
      );
    }

    //Add note
    if (i?.id == 3) {
      updateState({ showInputBox: true });
    }

    if (i?.id == 4) {
      updateState({ showInputBox: false });
      checkCameraPermission()
        .then(result => {
          console.log(result, 'result');
          if (result == 'granted') {
            moveToNewScreen(navigationStrings.SCANNER, {
              updateBarcodeScan: data => {
                updateBarcodeScan(data);
              },
              selected_id: i?.id,
            })();
          }
        })
        .catch(error => console.log('error while accessing location ', error));
    }

    if (i?.id == 5) {
      updateState({ showInputBox: false });
      pickImage(false);
    }

    if (i?.id == 6) {
      updateState({ showInputBox: false });
      checkCameraPermission()
        .then(result => {
          console.log(result, 'result');
          if (result == 'granted') {
            moveToNewScreen(navigationStrings.SCANNER, {
              updateQRcodeScan: data => {
                updateQRcodeScan(data);
              },
              selected_id: i?.id,
            })();
          }
        })
        .catch(error => console.log('error while accessing location ', error));
    }
  };
  /****** */

  const getImage = i => {
    switch (i?.id) {
      case 1:
        return signatureImage ? imagePath?.signatureBlue : imagePath?.signature;
        break;
      case 2:
        return image ? imagePath?.photoBlue : imagePath?.photoInactive;
        break;
      case 3:
        return note != '' ? imagePath?.notesBlue : imagePath?.notes;
        break;
      case 4:
        return barcode ? imagePath?.codeActive : imagePath?.codeInactive;
        break;
      case 5:
        return faceImage ? imagePath?.faceActive : imagePath?.faceInactive;
        break;
      case 6:
        return qrCode ? imagePath?.icQr2 : imagePath?.icQr;
        break;
      default:
        break;
    }
  };

  const _onPressDone = () => {
    if (
      findDataToCheck?.signature &&
      findDataToCheck?.signature_requried &&
      isEmpty(signatureImage)
    ) {
      showError(strings.SIGNATUREIMAGE);
    }
    else if (
      findDataToCheck?.image &&
      findDataToCheck?.image_requried &&
      isEmpty(image)
    ) {
      showError(strings.PHOTOIMAGE);
    }
    else if (
      findDataToCheck?.note &&
      findDataToCheck?.note_requried &&
      note == ''
    ) {
      showError(strings.NOTEREQUIRED);
    } else if (
      findDataToCheck?.barcode &&
      findDataToCheck?.barcode_requried &&
      isEmpty(barcode)
    ) {
      showError(strings.QRSCAN);
    } else if (
      findDataToCheck?.face &&
      findDataToCheck?.face_requried &&
      isEmpty(faceImage)
    ) {
      showError(strings.FACEIMAGEREQUIRED);
    }
    else if (
      !!findDataToCheck?.qrcode &&
      !!findDataToCheck?.qrcode_requried &&
      !!isEmpty(qrCode)
    ) {
      showError('QR code scan is required!');
    }
    else if (
      params?.data?.otpEnabled &&
      params?.data?.otpRequired &&
      otpField.trim() == ''
    ) {
      updateState({ otpField: '' });
      showError(strings.OTPREQUIRED);
    } else if (
      params?.data?.otpEnabled &&
      params?.data?.otpRequired &&
      otpField != '' &&
      JSON.parse(otpField) != params?.data?.otp
    ) {
      showError(strings.OTPNOTVALID);
    } else {
      updateState({ isLoading: true, isModalVisible: false });
      updateTaskStatus();
    }
  };

  const updateTaskStatus = (isClear = false) => {
    let formdata = new FormData();
    if (userData?.client_preference?.is_show_attribute_form_toggle) {
      let apiObj = {};
      attributeInfo.map((item, index) => {
        let optionData = [];
        item?.option?.map((item, inx) => {
          optionData[inx] = {
            option_id: item?.id,
            option_title: item?.title,
          };
        });
        if (item?.values) {
          apiObj[item?.id] = {
            type: item?.type,
            id: item?.id,
            attribute_title: item?.title,
            option: optionData,
            value: item?.values,
          };
          if (item?.type == 6) {
            formdata.append(`attribute_data_images_${item?.id}[]`, item?.values[0]);
          }
        }

      });
      formdata.append('attribute_data', JSON.stringify(apiObj));
    }
    formdata.append('task_status', 4);
    formdata.append('clear_bag', isClear ? 1 : 0);
    formdata.append('task_id', taskDetail?.id);
    if (note != '') {
      formdata.append('note', note);
    }
    if (signatureImage) {
      formdata.append('signature', {
        name: 'image.png',
        fileName: 'image',
        type: 'image/png',
        uri: signatureImage,
      });
    }
    if (image) {
      formdata.append('image', {
        uri: image,
        name: 'image.png',
        fileName: 'image',
        type: 'image/png',
      });
    }
    if (faceImage) {
      formdata.append('proof_face', {
        name: 'image.png',
        fileName: 'image',
        type: 'image/png',
        uri: faceImage?.uri,
      });
    }

    if (qrCode) {
      formdata.append('qr_code', qrCode);
    }

    if (params?.data?.otpEnabled) {
      formdata.append('otp', otpField);
    }
    formdata.append('multimedia', 1);
    updateState({ isLoading: true, isModalVisible: false });
    actions
      .updateTask(formdata, {
        client: clientInfo?.database_name,
        ContentType: 'multipart/form-data',
      })
      .then(res => {
        // actions.setAttributeFormInfo([])
        if (isClear) {
          showSuccess(res?.message);
          navigation.navigate(navigationStrings.DASHBOARD);
        }
        updateState({ isLoading: false, isModalVisible: false });
        if (res?.data) {
          updateState({
            isLoading: false,
          });
          if (signatureImage) {
            unlinkDirectory(signatureImage);
          }
          if (taskDetail?.tasktype?.name == 'Drop' && getBundleId() == appIds.washvalley) {
            updateState({
              isShowQrCodeVendor: true,
              qrCodeVendorDetail: res?.data?.qrCodeVendor,
            });
            return;
          }
          if (res?.data?.nextTask?.length == 0 || res?.data?.nextTask == null) {
            navigation.navigate(navigationStrings.DASHBOARD);
          }
          else {

            moveToNewScreen(navigationStrings.TASKDETAIL, { item: res?.data?.nextTask[0] })()

          }

        }
      })
      .catch(errorMethod);
  };



  const pickImage = first => {
    Alert.alert(
      'Select option',
      '',
      [
        {
          text: 'Use gallery',
          onPress: () => {
            // options['includeBase64'] = true;
            ImagePicker.openPicker({ includeBase64: true })
              .then(image => {
                console.log(image, 'image');
                console.log(
                  Enum.ImageType.IMAGE_TYPE_PRINTED,
                  'Enum.ImageType.IMAGE_TYPE_PRINTED',
                );
                setImage(first, image.data, Enum.ImageType.IMAGE_TYPE_PRINTED);
                // return image;
              })
              .catch(err => {
                return err;
              });
          },
        },
        {
          text: 'Use camera',
          onPress: () =>
            FaceSDK.presentFaceCaptureActivity(
              result => {
                console.log(result, 'FaceSDK Result');
                setImage(
                  first,
                  FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap,
                  Enum.ImageType.IMAGE_TYPE_LIVE,
                );
              },
              e => { },
            ),
        },
      ],
      { cancelable: true },
    );
  };

  const setImage = (first, base64, type) => {
    if (base64 == null) return;
    updateState({ similarity: null });
    if (first) {
      image1.bitmap = base64;
      image1.imageType = type;
      updateState({ img1: { uri: 'data:image/png;base64,' + base64 } });
    } else {
      image2.bitmap = base64;
      image2.imageType = type;
      matchFaces();
      updateState({ img2: { uri: 'data:image/png;base64,' + base64 } });
    }
  };

  // Match the faces
  const matchFaces = () => {
    if (
      image1 == null ||
      image1.bitmap == null ||
      image1.bitmap == '' ||
      image2 == null ||
      image2.bitmap == null ||
      image2.bitmap == ''
    )
      return;
    request.images = [image1, image2];
    updateState({ isLoading: true });
    FaceSDK.matchFaces(
      JSON.stringify(request),
      response => {
        response = MatchFacesResponse.fromJson(JSON.parse(response));
        console.log(response, 'response>response');
        if (response?.unmatchedFaces && response?.unmatchedFaces.length) {
          showError(
            response?.unmatchedFaces[0]?.exception?.message ||
            strings.FACESNOTMATCHED,
          );
          updateState({ isLoading: false });
        } else if (response?.matchedFaces && response?.matchedFaces.length) {
          let matchedFaces = response.matchedFaces;
          console.log(matchedFaces, 'matchedFaces');
          updateState({
            isLoading: false,
          });
          let similarValue =
            matchedFaces.length > 0
              ? (matchedFaces[0].similarity * 100).toFixed(2)
              : 0;

          console.log(similarValue, 'similarValue>>>UPDATED');
          if (similarValue && similarValue >= 90) {
            updateState({
              faceImage: { uri: 'data:image/png;base64,' + image2.bitmap },
            });
            showSuccess(strings.IMAGEMATCHED);
          } else if (similarValue && similarValue != null) {
            updateState({
              faceImage: null,
            });
            showSuccess(strings.FACEIMAGENOTFOUND);
          } else {
          }
        }
      },
      e => {
        console.log(e, 'error');
        updateState({ isLoading: false });
        // this.setState({similarity: e});
      },
    );
  };


  const completeAllTask = () => {
    if (
      taskDetail?.tasktype?.name == 'Drop' &&
      taskDetail?.order?.task?.length >= 1 &&
      taskDetail?.order?.task[0]?.location?.address &&
      taskDetail?.order?.task[1]?.location?.address
    ) {
      updateState({
        isModalVisible: true,
      });
    } else {
      _onPressDone();
    }
  };

  const closeModal = () => {
    updateState({
      isModalVisible: false,
    });
  };


  const onChangeText = (text, item) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = [text];
    setAttributeInfo(attributeInfoData);
  };

  const onChangeDropDownOption = (value, item) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = value;
    setAttributeInfo(attributeInfoData);
  };


  const onPressRadioButton = (item) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.attribute_id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = [item?.id];
    setAttributeInfo(attributeInfoData);
  };
  const onPressCheckBoxes = (value, data) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == value?.attribute_id,
    );
    if (!isEmpty(data?.values)) {
      let existingItmIndx = data?.values.findIndex((itm) => itm == value.id);
      if (existingItmIndx == -1) {
        attributeInfoData[indexOfAttributeToUpdate].values = [
          ...data?.values,
          value?.id,
        ];
      } else {
        let index = attributeInfoData[indexOfAttributeToUpdate].values.indexOf(
          value?.id,
        );
        if (index >= 0) {
          attributeInfoData[indexOfAttributeToUpdate].values.splice(index, 1);
        }
      }
    } else {
      attributeInfoData[indexOfAttributeToUpdate].values = [value?.id];
    }
    setAttributeInfo(attributeInfoData);
  };


  const onImagePicker =
    (item) => {
      Alert.alert(
        (getBundleId() == appIds.mrVeloz && defaultLanguagae?.value == 'es') ? strings.SELCET_OPTION : 'Select option',
        '',
        [
          {
            text:(getBundleId() == appIds.mrVeloz && defaultLanguagae?.value == 'es') ? strings.USE_GALLERY : 'Use gallery',
            onPress: () => {
              cameraHandler(1, {
                cropping: false,
                compressImageQuality: 0.1,
                cropperCircleOverlay: false,
                mediaType: 'photo',
              })
                .then((res) => setImageData(res, item))
                .catch(err => {

                });
            },
          },
          {
            text:(getBundleId() == appIds.mrVeloz && defaultLanguagae?.value == 'es') ? strings.USE_CAMERA : 'Use camera',
            onPress: () => {
              openCamera()
                .then((res) => setImageData(res, item))
                .catch(error => {
                });
            },
          },
        ],
        { cancelable: true },
      )

    }

  const setImageData = (res, item) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.id,
    );

    attributeInfoData[indexOfAttributeToUpdate].values = [{
      type: res?.mime,
      uri: res?.path,
      image_id: Math.random(),
      name: res?.filename ? res?.filename : 'unknown',
    }];
    setAttributeInfo(attributeInfoData);
  }


  const ImageForm = ({ data, index }) => {
    return <TouchableOpacity onPress={() => onImagePicker(data, index)} style={{
      paddingHorizontal: moderateScale(6)
    }} >
      <FastImage source={!isEmpty(data?.values) ? { uri: data?.values[0]?.uri, priority: FastImage.priority.high, } : imagePath.icImgPlaceholder} style={{
        height: moderateScaleVertical(100),
        width: "100%",
      }} resizeMode={!isEmpty(data?.values) ? "cover" : "contain"} />
      {
        !isEmpty(data?.values) && <TouchableOpacity onPress={() => {
          const attributeInfoData = [...attributeInfo];
          attributeInfoData[index].values = []
          setAttributeInfo(attributeInfoData)
        }} hitSlop={hitSlopProp} style={{
          position: "absolute",
          zIndex: 1,
          right: -5,
          top: -10
        }}>
          <Image source={imagePath.ic_cross} style={{
            tintColor: colors.redB
          }} />
        </TouchableOpacity>
      }
    </TouchableOpacity>
  }

  const DateView = ({ data, index }) => {
    return <TouchableOpacity onPress={() => {
      setIsDatePicker(true)
      setSelectedDateItem(data)
    }} style={{
      height: moderateScaleVertical(40),
      backgroundColor: colors.blackOpacity10,
      borderRadius: moderateScale(6),
      justifyContent: "center",
      paddingHorizontal: moderateScale(10)
    }}><Text style={{
      fontFamily: fontFamily.regular,
      fontSize: textScale(12)
    }}>{!isEmpty(data?.values) ? moment(data?.values[0]).format("YYYY-MM-DD") : "Select Date"}</Text></TouchableOpacity>
  }

  const renderAttributeOptions = useCallback(
    ({ item, index }) => {
      return (
        <View>
          <Text
            style={{
              ...styles.attributeTitle,
              marginBottom: moderateScaleVertical(6),
            }}>
            {item?.title}
          </Text>
          {item?.type == 1 ? (
            <Dropdown
              style={styles.multiSelect}
              labelField="title"
              valueField="id"
              value={!isEmpty(item?.values) ? item?.values : []}
              data={item?.option}
              onChange={(value) => onChangeDropDownOption(value, item)}
              placeholder={strings.SELECT_VALUE}
              fontFamily={fontFamily.regular}
              placeholderStyle={styles.multiSelectPlaceholder}
            />
          ) : item?.type == 3 ? (
            <View style={styles.radioBtn}>
              {item?.option?.map((itm, indx) =>
                renderRadioBtns(itm, item, indx),
              )}
            </View>
          ) : item?.type == 4 ? (
            <TextInput
              placeholder={strings.TYPE_HERE}
              onChangeText={(text) => onChangeText(text, item)}
              style={styles.textInput}
            />
          ) : item?.type == 6 ? <ImageForm data={item} index={index} /> : item?.type == 7 ? <DateView data={item} index={index} /> : (
            <View style={styles.checkBox}>
              {item?.option?.map((itm, index) =>
                renderDatePicker(itm, item, index),
              )}
            </View>
          )}
        </View>
      );
    },
    [attributeInfo],
  );
  const renderCheckBoxes = useCallback(
    (item, data, index) => {
      return (
        <TouchableOpacity
          key={String(index)}
          onPress={() => onPressCheckBoxes(item, data)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: moderateScale(20),
            marginBottom: moderateScaleVertical(10),
          }}>
          <Image
            source={
              checkValueExistInAry(item, data?.values)
                ? imagePath.checkBox2Active
                : imagePath.checkBox2InActive
            }
            style={{
              tintColor: checkValueExistInAry(item, data?.values)
                ? colors.themeColor
                : colors.blackOpacity43,
            }}
          />
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(12),
              marginLeft: moderateScale(6),
            }}>
            {item?.title}
          </Text>
        </TouchableOpacity>
      );
    },
    [attributeInfo],
  );

  const renderRadioBtns = useCallback(
    (item, data, index) => {
      return (
        <TouchableOpacity
          key={String(index)}
          onPress={() => onPressRadioButton(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: moderateScale(20),
          }}>
          <Image
            source={
              !isEmpty(data?.values) && data?.values[0] == item?.id
                ? imagePath.icActiveRadio
                : imagePath.icInActiveRadio
            }
            style={{
              tintColor:
                !isEmpty(data?.values) && data?.values[0] == item?.id
                  ? colors.themeColor
                  : colors.blackOpacity43,
            }}
          />
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(14),
              marginLeft: moderateScale(6),
            }}>
            {item?.title}
          </Text>
        </TouchableOpacity>
      );
    },
    [attributeInfo],
  );

  const renderDatePicker = (item, mainItem, index) => {

  }

  const qrVendorModalView = () => {
    return (
      <View>
        <Text
          style={{
            fontFamily: fontFamily.bold,
            textAlign: 'center',
            fontSize: textScale(16),
            marginVertical: moderateScaleVertical(15),
          }}>
          Vendor Detail
        </Text>
        <View
          style={{
            height: 1,
            backgroundColor: colors.borderColorB,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            paddingVertical: moderateScaleVertical(15),
          }}>
          <Image
            source={{ uri: qrCodeVendorDetail?.logo?.image_s3_url }}
            style={{
              height: moderateScale(80),
              width: moderateScale(80),
              borderRadius: moderateScale(40),
            }}
          />
          <Text
            style={{
              marginTop: moderateScaleVertical(15),
              fontFamily: fontFamily.bold,
              fontSize: textScale(15),
            }}>
            {qrCodeVendorDetail?.name}
          </Text>
          <Text
            style={{
              marginTop: moderateScaleVertical(5),
              fontFamily: fontFamily.medium,
              fontSize: textScale(13),
            }}>
            {qrCodeVendorDetail?.email}
          </Text>
          <Text
            style={{
              marginTop: moderateScaleVertical(5),
              fontFamily: fontFamily.medium,
              fontSize: textScale(13),
            }}>
            {qrCodeVendorDetail?.phone_no}
          </Text>
          <Text
            style={{
              marginTop: moderateScaleVertical(5),
              fontFamily: fontFamily.medium,
              fontSize: textScale(13),
            }}>
            {qrCodeVendorDetail?.address}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => updateTaskStatus(true)}
          style={{
            paddingVertical: moderateScaleVertical(12),
            marginHorizontal: moderateScale(20),
            backgroundColor: colors.themeColor,
            alignItems: 'center',
            borderRadius: moderateScale(5),
          }}>
          <Text
            style={{
              fontFamily: fontFamily.medium,
              color: colors.white,
            }}>
            Clear Bag
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const modalMainView = () => {
    return (
      <View style={styles.modalMainContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View>
            <Text style={styles.distanceTimeTitleTextStyle}>
              {strings.TOTALDISTANCE}
            </Text>
            <Text style={styles.distanceTimeTextStyle}>
              {taskDetail?.order?.actual_distance
                ? taskDetail?.order?.actual_distance
                : Number(
                  totalTravelData?.distance?.text.substring(
                    0,
                    totalTravelData?.distance?.text.length - 2,
                  ) * 1.609344,
                ).toFixed(2)}{' '}
              {appIds.weTogether == getBundleId() ? 'Miles' : ' KM'}
            </Text>
          </View>
          <View>
            <Text style={styles.distanceTimeTitleTextStyle}>
              {strings.TOTALTIME}
            </Text>
            <Text style={styles.distanceTimeTextStyle}>
              {taskDetail?.order?.actual_time
                ? taskDetail?.order?.actual_time
                : totalTravelData?.duration?.text}
            </Text>
          </View>
        </View>
        <View style={styles.modealBottomContainer} />
        <View style={styles.modalBottomButtonContainer}>
          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.modalText}>{strings.CANCEL}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            hitSlop={hitSlopProp}
            onPress={() => {
              updateState({
                isModalVisible: false,
              });
              _onPressDone();
            }}>
            <Text style={styles.modalText}>{strings.OK}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  const _onCloseModal = () => {
    setIsDatePicker(false)
  }

  const onDateChange = (value) => {
    setSelectedDate(value)
  }

  const onDateSelectDone = () => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == selectedDateItem?.id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = [selectedDate];
    setAttributeInfo(attributeInfoData);
    _onCloseModal()
  }

  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoading={isLoading}
      source={loaderOne}>
      <Header
        headerStyle={{ backgroundColor: colors.white }}
        leftIconStyle={{ tintColor: colors.themeColor }}
        customLeft={() => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerCustomleftView}>
            <Image style={styles.arrowstyle} source={imagePath.backArrow} />
            <Text style={styles.textStyle}>{strings.TASK}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={{ ...commonStyles.headerTopLine }} />
      <KeyboardAwareScrollView keyboardShouldPersistTaps={"handled"}>
        <View style={{ flex: 0.8 }}>
          {!!params?.data?.otpEnabled && (
            <View style={styles.otpContainer}>
              <Text style={styles.attachment}>{strings.OTP}</Text>
              <TextInput
                multiline={true}
                value={otpField}
                textAlignVertical={'top'}
                returnKeyType={'done'}
                maxLength={6}
                keyboardType={'numeric'}
                style={[
                  styles.textInputStyle,
                  {
                    width: width / 3.5,
                    marginHorizontal: moderateScale(10),
                    alignItems: 'center',
                    paddingVertical: moderateScale(10),
                  },
                ]}
                onChangeText={text => updateState({ otpField: text })}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>
          )}

          {!!(
            params?.data?.updatedProofArray &&
            params?.data?.updatedProofArray.length
          ) && (
              <View style={{

              }}>
                <View style={styles.documentContainer}>
                  <Text style={styles.attachment}>{strings.ATTACHMENTS}</Text>
                  <View style={styles.documentListContainer}>
                    {taskProofArray.map((i, inx) => {
                      const { width, height } = Image.resolveAssetSource(
                        i?.imagePath,
                      );

                      return (
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => onPressCategory(i)}
                          style={styles.documentContainerView}>
                          <Image
                            source={getImage(i)}
                            onLayout={onImageLayout}
                            style={{
                              width: width - 40,
                              height: height - 40, //362 is actual height of image
                              // alignSelf: 'center',
                            }}
                            resizeMode={'contain'}
                          />
                          <Text style={styles.titleStyle}>{i?.title}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
                {showInputBox && (
                  <View>
                    <Text style={styles.reason}>{strings.NOTE}</Text>
                    <TextInput
                      multiline={true}
                      value={note}
                      textAlignVertical={'top'}
                      returnKeyType={'done'}
                      style={styles.textInputStyle}
                      onChangeText={text => updateState({ note: text })}
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                  </View>
                )}

                <View
                  style={{
                    marginHorizontal: moderateScale(10),
                    marginTop: moderateScale(10),
                  }}>
                  {/* <Text style={styles.attachment}>{strings.REQUIREDDATA}</Text> */}

                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    {/* signature image */}
                    {!!signatureImage && (
                      <Image
                        source={{
                          uri: signatureImage,
                        }}
                        style={{
                          width: width / 3.5,
                          height: width / 3.5, //362 is actual height of image
                        }}
                      />
                    )}

                    {/* image */}
                    {!!image && (
                      <Image
                        source={{
                          uri: image,
                        }}
                        style={{
                          width: width / 3.5,
                          height: width / 3.5, //362 is actual height of image
                        }}
                      />
                    )}

                    {/* faceImage */}
                    {!!faceImage && (
                      <Image
                        source={{
                          uri: faceImage.uri,
                        }}
                        style={{
                          width: width / 3.5,
                          height: width / 3.5, //362 is actual height of image
                        }}
                      />
                    )}
                  </View>
                </View>
              </View>
            )}
          {
            !!userData?.client_preference?.is_show_attribute_form_toggle &&
            <View style={styles.documentContainer}>
              {!isEmpty(attributeInfo) && <Text style={styles.attachment}>Task Additional Documents</Text>}
              <View
                style={{
                  marginTop: moderateScaleVertical(16),
                  marginHorizontal: moderateScale(12)
                }}>
                <FlatList
                  data={attributeInfo}
                  keyboardShouldPersistTaps={'handled'}
                  scrollEnabled={false}
                  keyExtractor={(item, index) => String(index)}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: moderateScaleVertical(18),
                      }}
                    />
                  )}
                  renderItem={renderAttributeOptions}
                />
                <View style={{ height: moderateScaleVertical(65) }} />
              </View>
            </View>
          }
        </View>
        <View style={{ flex: 0.2, paddingVertical: moderateScale(20) }}>
          <ButtonComponent buttonTitle={strings.DONE} onPress={completeAllTask} />
        </View>
      </KeyboardAwareScrollView>




      <ModalView isVisible={isModalVisible} modalMainContent={modalMainView} />
      <ModalView
        isVisible={isShowQrCodeVendor}
        modalMainContent={qrVendorModalView}
        mainViewStyle={{
          paddingTop: 0,
          flex: 0.45,
        }}
      />
      <DatePickerModal
        isVisible={isDatePicker}
        onclose={_onCloseModal}
        onSelectDate={onDateSelectDone}
        onDateChange={onDateChange}
        date={selectedDate}
        mode="date"
      />
    </WrapperContainer>
  );
}

//completeAllTask
