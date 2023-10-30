import { isEmpty } from 'lodash';
import React from 'react';
import {
  I18nManager, Image,
  Keyboard, StyleSheet,
  TextInput, TouchableOpacity, View
} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import ModalView from '../Components/Modal';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale, textScale
} from '../styles/responsiveSize';
import { googlePlacesApi } from '../utils/googlePlaceApi';
import SelctFromMap from './SelctFromMap';

const SearchPlaces = ({
  containerStyle = {},
  mapKey = '',
  fetchArrayResult = () => { },
  value = '',
  setValue = () => { },
  placeHolder,
  onFocus = () => { },
  autoFocus = false,
  curLatLng = {},
  placeHolderColor = colors.black,
  onClear = () => { },
  textStyle = {},
  mapClose = () => { },
  addressDone = () => { },
  isMapSelectLocation = false,
  currentLatLong = {},
}) => {


  const textChangeHandler = async (data) => {
    setValue(data);
    var res = await googlePlacesApi(
      data,
      mapKey,
      curLatLng,
      RNLocalize.getCountry(),
    );
    if (res && !isEmpty(res?.results)) {
      fetchArrayResult(res?.results.slice(0, 5));
    }

  };

  const modalMainContent = () => {
    return (
      <View style={{ flex: 1, }}>
        <SelctFromMap
          addressDone={addressDone}
          mapClose={mapClose} //address map close
          constCurrLoc={currentLatLong}
        />
      </View>
    );
  };

  return (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: colors.greyNew,
          ...containerStyle,
        }}>
        <TextInput

          autoFocus={autoFocus}
          value={value}
          placeholder={placeHolder}
          onChangeText={textChangeHandler}
          style={{
            ...styles.text,
            color: colors.black,
            ...textStyle,
          }}
          onSubmitEditing={Keyboard.dismiss}
          onFocus={onFocus}
          placeholderTextColor={
            placeHolderColor
          }
        />
        {value !== '' && (
          <TouchableOpacity onPress={onClear} activeOpacity={0.8}>
            <Image
              style={{
                height: moderateScale(15),
                width: moderateScale(15),
                borderRadius: moderateScale(15 / 2),
                marginHorizontal: moderateScale(4),
              }}
              resizeMode="contain"
              source={imagePath.icCloseButton}
            />
          </TouchableOpacity>
        )}

      </View>

      <ModalView
        isVisible={isMapSelectLocation}
        onClose={mapClose}
        modalMainContent={modalMainContent}
        mainViewStyle={{ flex: 1 }}
        modalStyle={{
          flex: 1,
          marginVertical: 0,
          marginHorizontal: 0,
        }}
      />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: moderateScale(36),
    backgroundColor: 'gray',
    borderRadius: moderateScale(4),
    paddingHorizontal: moderateScale(8),
  },
  text: {
    flex: 1,
    fontFamily: fontFamily.medium,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontSize: textScale(11),
  },
});

export default React.memo(SearchPlaces);
