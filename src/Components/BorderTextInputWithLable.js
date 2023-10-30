import React, { useEffect, useRef } from 'react';
import {
  I18nManager, Image, Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import colors from '../styles/colors';
import { hitSlopProp } from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../styles/responsiveSize';

// import styles from '../Screens/Tracking/styles';

const BorderTextInputWithLable = ({
  label,
  labelStyle,
  lableViewStyle,
  containerStyle,
  textInputStyle,
  leftIcon,
  color = colors.textGreyOpcaity7,
  rightIcon,
  onChangeText,
  value,
  placeholder,
  marginBottom = 20,
  onPressRight = () => { },
  withRef = false,
  secureTextEntry = false,
  disabled = true,
  textViewOnly = false,
  tintColor,
  subLabel = null,
  sublabelStyle,
  mainStyle,
  onPress = () => { },
  borderWidth = 1,
  marginBottomTxt = 10,
  ...props
}) => {
  const inputRef = useRef();


  useEffect(() => {
    if (withRef && Platform.OS === 'android') {
      if (inputRef.current) {
        inputRef.current.setNativeProps({
          style: { fontFamily: fontFamily.regular },
        });
      }
    }
  }, [secureTextEntry]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={disabled}
      onPress={onPress}
      style={mainStyle}>
      {!!label && (
        <View
          style={{
            marginBottom: marginBottomTxt,
            flexDirection: 'row',
            ...lableViewStyle,
          }}>
          <Text
            style={{ ...styles.labelStyle, ...labelStyle }
            }>
            {label}
          </Text>
          {subLabel && (
            <Text style={[styles.sublabelStyle, sublabelStyle]}>
              {subLabel}
            </Text>
          )}
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          height: moderateScaleVertical(49),
          color: colors.white,
          borderWidth: borderWidth,
          borderRadius: 13,
          borderColor: colors.borderLight,
          marginBottom,
          ...containerStyle,
          borderBottomColor: colors.lightGreyBorder,
        }}>
        {leftIcon && (
          <View style={{ justifyContent: 'center', marginLeft: 10 }}>
            <Image source={leftIcon} />
          </View>
        )}
        {textViewOnly ? (
          <Text
            style={{
              flex: 1,
              opacity: 0.7,
              color,
              fontFamily: fontFamily.medium,
              fontSize: textScale(14),
              paddingVertical: moderateScaleVertical(49 / 4),
              paddingHorizontal: moderateScaleVertical(49 / 4),
              ...textInputStyle,
            }}>
            {value}
          </Text>
        ) : (
          <TextInput
            selectionColor={colors.black}
            placeholder={placeholder}
            placeholderTextColor={color}
            style={{
              flex: 1,
              opacity: 0.7,
              color: color,
              fontFamily: fontFamily.medium,
              fontSize: textScale(14),
              paddingHorizontal: 10,
              paddingTop: 0,
              paddingBottom: 0,
              textAlign: I18nManager.isRTL ? 'right' : 'left',
              ...textInputStyle,
            }}
            ref={inputRef}
            blurOnSubmit
            onChangeText={onChangeText}
            value={value}
            secureTextEntry={secureTextEntry}
            {...props}
          />
        )}

        {rightIcon && (
          <TouchableOpacity
            style={{ justifyContent: 'center', marginRight: 10 }}
            hitSlop={hitSlopProp}
            onPress={onPressRight}>
            <Image
              style={{ tintColor: tintColor ? tintColor : colors.white }}
              source={rightIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  containerStyle: {
    paddingVertical: 0,
    height: moderateScaleVertical(58),
    alignItems: 'center',
    borderBottomColor: colors.lightGreyBorder,
    borderBottomWidth: 0.7,
  },
  userProfileView: {
    alignSelf: 'center',
    borderColor: colors.white,
    marginTop: moderateScale(30),
  },
  cameraView: {
    position: 'absolute',
    right: -20,
  },
  userName: {
    fontSize: textScale(14),
    color: colors.textGrey,
    fontFamily: fontFamily.bold,
  },
  userEmail: {
    marginTop: moderateScaleVertical(5),
    fontSize: textScale(14),
    color: colors.textGrey,
    fontFamily: fontFamily.bold,
    opacity: 0.5,
  },
  borderRoundBotton: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: moderateScaleVertical(30),
  },
  topSection: {},
  bottomSection: {
    marginVertical: moderateScaleVertical(40),
    marginHorizontal: moderateScaleVertical(20),
  },

  address: {
    fontSize: textScale(14),
    color: colors.textGrey,
    fontFamily: fontFamily.medium,
    opacity: 0.7,
  },
  textStyle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: textScale(14),
    // opacity: 0.6,
  },
  labelStyle: {
    color: colors.textGrey,
    fontFamily: fontFamily.bold,
    fontSize: textScale(14),
  },
  sublabelStyle: {
    color: colors.textGreyB,
    fontFamily: fontFamily.regular,
    fontSize: textScale(14),
  },
});

export default React.memo(BorderTextInputWithLable);
