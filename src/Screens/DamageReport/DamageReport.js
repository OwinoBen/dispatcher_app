import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  ScrollView,
  Keyboard,
} from 'react-native';
import {useSelector} from 'react-redux';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
// import store from '../../redux/store';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import Header from '../../Components/Header';
import strings from '../../constants/lang';
import {cameraHandler} from '../../utils/commonFunction';
import stylesFunc from './styles';
import {
  moderateScaleVertical,
  moderateScale,
  width,
} from '../../styles/responsiveSize';
import imagePath from '../../constants/imagePath';
import ActionSheet from 'react-native-actionsheet';
import {showError, showSuccess} from '../../utils/helperFunctions';
import {cloneDeep} from 'lodash';
import ButtonComponent from '../../Components/ButtonComponent';
import actions from '../../redux/actions';

export default function DamageReport({route, navigation}) {
  const userData = useSelector(state => state?.auth?.userData);
  let params = route?.params?.data;
  console.log(params, 'params>>>');
  const [state, setState] = useState({
    isLoading: false,
    imageArray: [],
    remove_image_ids: [],
    damageType: '',
    damageTypeArray: [
      {type: 'Damage', id: 1},
      {type: 'No damage', id: 2},
    ],
    damageTitle: '',
    comments: '',
    trailor_number: '',
    truck_number: '',
    showTypeDropdown: false,
    selectedDamageType:  {type: 'Damage', id: 1},
  });

  const {
    trailor_number,
    truck_number,
    isLoading,
    imageArray,
    remove_image_ids,
    damageType,
    damageTypeArray,
    damageTitle,
    comments,
    showTypeDropdown,
    selectedDamageType,
  } = state;
  const commonStyles = commonStylesFunc({fontFamily});
  const updateState = data => setState(state => ({...state, ...data}));
  const clientInfo = useSelector(state => state?.initBoot?.clientInfo);
  console.log(clientInfo, 'clientInfo');
  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };
  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector(state => state?.initBoot);

  console.log(appData, 'appData');
  const styles = stylesFunc({defaultLanguagae});

  //Get Damage Type
  useEffect(() => {
    // getDamageType()
  }, []);

  const getDamageType = () => {
    actions
      .getAllDamageTypes({}, {client: clientInfo?.database_name})
      .then(res => {
        if (res && res?.status == 200 && res?.data) {
          updateState({
            damageTypeArray: res?.data,
          });
        }
        console.log(res, 'res>res');
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = error => {
    console.log(error, 'short code error');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };

  //this function use for open actionsheet
  let actionSheet = useRef();
  const showActionSheet = () => {
    {
      imageArray.length == 5
        ? showError(strings.MAXIMUM_PHOTO_SELECTION_LIMIT_REACHED)
        : actionSheet.current.show();
    }
  };

  /***********Remove Image from rating */
  const _removeImageFromList = selectdImage => {
    if (selectdImage?.id) {
      let copyArrayImages = cloneDeep(imageArray);

      copyArrayImages = copyArrayImages.filter(x => x?.id !== selectdImage?.id);
      updateState({
        imageArray: copyArrayImages,
        remove_image_ids: [...remove_image_ids, selectdImage?.id],
      });
    } else {
      let copyArrayImages = cloneDeep(imageArray);
      copyArrayImages = copyArrayImages.filter(
        x => x?.image_id !== selectdImage?.image_id,
      );
      updateState({
        imageArray: copyArrayImages,
      });
    }
  };

  // this funtion use for camera handle
  const cameraHandle = index => {
    if (index == 0 || index == 1) {
      cameraHandler(index, {
        width: 300,
        height: 400,
        cropping: false,
        cropperCircleOverlay: false,
        compressImageQuality: 0.5,
        mediaType: 'photo',
      })
        .then(res => {
          if (res && (res?.sourceURL || res?.path)) {
            let file = {
              image_id: Math.random(),
              name: res?.filename,
              type: res?.mime,
              uri: res?.sourceURL || res?.path,
            };
            let find = imageArray.find(x => x?.name == res?.filename);
            if (find) {
              showError(strings.IMAGE_ALREADY_UPLOADED);
            } else {
              updateState({imageArray: [...imageArray, file]});
            }
          }
        })
        .catch(err => {});
    }
  };

  const _reportDamage = () => {
    // updateState({isLoading: true});
    if (trailor_number == '') {
      showError(strings.PLEASEENTERTRAILORNUMBER);
      return;
    } else if (truck_number == '') {
      showError(strings.PLEASENTERTRUCKNUMBER);
      return;
    } else if (!selectedDamageType) {
      showError(strings.PLEASESELECTDAMAGE);
      return;
    } else if (damageTitle == '' && selectedDamageType?.id == 1) {
      showError(strings.PLEASEENTERDAMAGETITLE);
      return;
    } else if (comments == '' && selectedDamageType?.id == 1) {
      showError(strings.ADDCOMMENT);
      return;
    } else if (
      imageArray &&
      imageArray.length == 0 &&
      selectedDamageType?.id == 1
    ) {
      showError(strings.ATLEASEONEIMAGE);
      return;
    } else {
      let formdata = new FormData();
      formdata.append('trailor_no', trailor_number);
      formdata.append('truck_no', truck_number);
      formdata.append('damage_type_id', selectedDamageType?.id);

      if (selectedDamageType && selectedDamageType?.id == 1) {
        formdata.append('damage_title', damageTitle);
        formdata.append('comments', comments);

        // formdata.append('vendor_id', ratingData.vendor_id);
        if (imageArray.length) {
          imageArray.forEach(element => {
            if (element?.id) {
            } else {
              formdata.append('files[]', {
                name: element.name,
                type: element.type,
                uri: element.uri,
              });
            }
          });
        }
      }

      console.log(formdata, 'formdata>formdata');

      updateState({
        isLoading: true,
      });

      actions
        .damageReport(formdata, {client: clientInfo?.database_name})
        .then(res => {
          updateState({isLoading: false});
          // navigation.navigate(navigationStrings.TAXIHOMESCREEN);
          navigation.goBack();
          showSuccess(res?.message);
        })
        .catch(errorMethod);
    }
  };

  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoading={isLoading}
      source={loaderOne}>
      <Header
        headerStyle={{backgroundColor: colors.white}}
        leftIconStyle={{tintColor: colors.themeColor}}
        // hideRight={true}
        // onPressLeft={()=>navigation.goBack()}
        centerTitle={strings.DAMAGEREPORT}
      />
      <View style={{...commonStyles.headerTopLine}} />
      <View
        style={{
          marginHorizontal: moderateScaleVertical(20),
          marginVertical: moderateScaleVertical(20),
        }}>
        {/* TRAILORNUMBER  */}

        <Text style={styles.uploadImage}>{strings.TRAILORNUMBER}</Text>
        <TextInput
          placeholder={strings.ENTERTRAILORNUMBER}
          value={trailor_number}
          textAlignVertical={'top'}
          style={styles.textInputStyle2}
          onChangeText={text => updateState({trailor_number: text})}
        />

        {/* TRUCKNUMBER */}
        <Text style={styles.uploadImage}>{strings.TRUCKNUMBER}</Text>
        <TextInput
          placeholder={strings.ENTERTRUCKNUMBER}
          value={truck_number}
          textAlignVertical={'top'}
          style={styles.textInputStyle2}
          onChangeText={text => updateState({truck_number: text})}
        />

        {/* Damage type */}
        <Text style={styles.uploadImage}>{strings.DAMAGETYPE}</Text>

        <View style={{flexDirection: 'row'}}>
          {damageTypeArray && damageTypeArray.length
            ? damageTypeArray.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      updateState({
                        selectedDamageType: item,
                        showTypeDropdown: false,
                      })
                    }
                    style={{
                      flexDirection: 'row',
                      marginRight: moderateScale(width / 4),
                      marginVertical: moderateScaleVertical(15),
                      alignItems: 'center',
                    }}>
                    <Image
                      source={
                        selectedDamageType?.id == item?.id
                          ? imagePath.redioSelectedButton
                          : imagePath.redioUnSelectedButton
                      }
                    />
                    <Text
                      style={{
                        paddingLeft: moderateScale(5),
                        color:
                          selectedDamageType?.id == item?.id
                            ? colors.black
                            : colors.greyLight,
                      }}>
                      {item.type}
                    </Text>
                  </TouchableOpacity>
                );
              })
            : null}
        </View>
        {/* <View style={{zIndex: 5, marginBottom: 20}}>
          <TouchableOpacity
            style={styles.selectedContainerStyle}
            activeOpacity={0.7}
            onPress={() =>
              updateState({
                showTypeDropdown: !showTypeDropdown,
              })
            }>
            <Text
              style={{
                ...styles.labelTxt,
                marginBottom: 0,
              }}>
              {!!selectedDamageType
                ? selectedDamageType?.type
                : strings.SELECTTYPE}
            </Text>
            <Image source={imagePath.dropDownNew} />
          </TouchableOpacity>

          {showTypeDropdown && (
            <View style={styles.dropdownstyle}>
              <ScrollView>
                {damageTypeArray.length > 0 ? (
                  <View>
                    {damageTypeArray.map((itm, indx) => {
                      return (
                        <TouchableOpacity
                          key={indx}
                          onPress={() =>
                            updateState({
                              selectedDamageType: itm,
                              showTypeDropdown: false,
                            })
                          }
                          style={{
                            marginVertical: moderateScale(5),
                          }}>
                          <Text>{itm.type}</Text>
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
        </View> */}

        {selectedDamageType && selectedDamageType?.id == 2 ? null : (
          <View>
            {/* Damage title */}
            <Text style={styles.uploadImage}>{strings.DAMAGETITLE}</Text>
            <TextInput
              placeholder={strings.ENTERTITLE}
              value={damageTitle}
              textAlignVertical={'top'}
              style={styles.textInputStyle2}
              onChangeText={text => updateState({damageTitle: text})}
            />
            {/* Comments */}
            <Text style={styles.uploadImage}>{strings.COMMENTS}</Text>
            <TextInput
              multiline={true}
              value={comments}
              placeholder={strings.ENTERCOMMENTS}
              returnKeyType={'done'}
              onSubmitEditing={e => Keyboard.dismiss()}
              textAlignVertical={'top'}
              style={styles.commentInput}
              onChangeText={text => updateState({comments: text})}
            />
            {/* Add Images section */}
            <Text style={styles.uploadImage}>{strings.ADDIMAGES}</Text>
            <View
              style={{
                marginTop: moderateScaleVertical(5),
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              <View
                style={{
                  marginRight: 5,
                  marginBottom: moderateScaleVertical(10),
                }}>
                <TouchableOpacity
                  onPress={showActionSheet}
                  style={[styles.viewOverImage2, {borderStyle: 'dashed'}]}>
                  <Image
                    source={imagePath.icCamIcon}
                    style={{tintColor: colors.themeColor}}
                  />
                </TouchableOpacity>
              </View>

              {imageArray && imageArray.length
                ? imageArray.map((i, inx) => {
                    return (
                      <ImageBackground
                        source={{
                          uri: i.uri,
                        }}
                        style={styles.imageOrderStyle}
                        imageStyle={styles.imageOrderStyle}>
                        <View style={styles.viewOverImage}>
                          <View
                            style={{
                              position: 'absolute',
                              top: -10,
                              right: -10,
                            }}>
                            <TouchableOpacity
                              onPress={() => _removeImageFromList(i)}>
                              <Image source={imagePath.ic_cross_red} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </ImageBackground>
                    );
                  })
                : null}
            </View>
          </View>
        )}
      </View>

      <ActionSheet
        ref={actionSheet}
        // title={'Choose one option'}
        options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={index => cameraHandle(index)}
      />
      <ButtonComponent buttonTitle={strings.REPORT} onPress={_reportDamage} />
    </WrapperContainer>
  );
}
