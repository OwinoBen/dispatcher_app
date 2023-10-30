import {callingCodes} from 'country-data';
import React, {useState} from 'react';
import {
  I18nManager,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import CountryPicker, {Flag} from 'react-native-country-picker-modal';
import {getBundleId} from 'react-native-device-info';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {appIds} from '../utils/constants/DynamicAppKeys';

export default function PhoneNumberInput({
  cca2 = '',
  callingCode = '',
  onChangePhone,
  onCountryChange,
  phoneNumber,
  placeholder,
  containerStyle,
  color,
  keyboardType = 'numeric',
  returnKeyType = 'done',
  borderColor = colors.black,
  label = null,
  labelStyle = {},
  borderLeftColor = null,
  callingCodeTextStyle = {},
  textinputStyle,
}) {
  const [state, setState] = useState({
    countryPickerModalVisible: false,
  });

  const {appStyle} = useSelector(state => state?.initBoot);
  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );

  const fontFamily = appStyle?.fontSizeData;

  const _onCountryChange = data => {
    setState({countryPickerModalVisible: false});
    onCountryChange(data);
  };
  const _openCountryPicker = () => {
    if (getBundleId() !== appIds.baytukom) {
      setState({countryPickerModalVisible: true});
    }
  };
  const _onCountryPickerModalClose = () => {
    setState({countryPickerModalVisible: false});
  };
  const {countryPickerModalVisible} = state;
  return (
    <>
      {label && (
        <View>
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        </View>
      )}
      <View
        style={{
          flexDirection:
            defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
          borderBottomWidth: 1,
          borderRadius: 13,
          borderColor: borderColor ? borderColor : colors.white,
          height: moderateScale(49),
          ...containerStyle,
        }}>
        <TouchableOpacity
          style={{
            flexDirection:
              defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: moderateScale(88),
          }}
          onPress={_openCountryPicker}>
          <View style={{marginRight: moderateScale(-10)}}>
            <Flag countryCode={cca2} />
          </View>
          <Text
            style={[
              {
                fontFamily: fontFamily.medium,
                color: color ? color : colors.white,
                marginStart: 2,
                fontSize: textScale(14),
              },
              callingCodeTextStyle,
            ]}>
            +{callingCode}
          </Text>

          <Image source={imagePath.dropdownTriangle} />
        </TouchableOpacity>
        <TextInput
          selectionColor={colors.black}
          placeholder={placeholder}
          keyboardType={keyboardType}
          value={phoneNumber}
          placeholderTextColor={color ? color : colors.textGreyOpcaity7}
          onChangeText={onChangePhone}
          style={[
            styles.textInputStyle,
            {
              borderLeftColor: borderLeftColor
                ? borderLeftColor
                : colors?.themeColor,
              textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
              borderRightWidth: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 1 : 0,
              borderLeftWidth: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 0 : 1,
              borderRightColor: borderLeftColor
                ? borderLeftColor
                : colors?.themeColor,
            },
          ]}
          returnKeyType={returnKeyType}
        />
        {countryPickerModalVisible && (
          <CountryPicker
            withCallingCode={true}
            cca2={cca2}
            visible={countryPickerModalVisible}
            withFlagButton={false}
            withFilter
            onClose={_onCountryPickerModalClose}
            countryCode={callingCode}
            onSelect={_onCountryChange}
            closeButtonImage={imagePath.closeButton}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  textInputStyle: {
    // flex: 1,
    width: width / 1.57,
    borderLeftWidth: 1,
    fontFamily: fontFamily.medium,
    color: colors.black,
    fontSize: textScale(14),

    // opacity: 0.7,
    paddingTop: 0,
    paddingBottom: 0,
    marginVertical: 8,
    paddingHorizontal: 10,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  label: {
    marginBottom: moderateScaleVertical(10),
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
    color: colors.lightGreyBg2,
  },
});
