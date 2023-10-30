import React, { useEffect, useRef } from 'react';
import {
  I18nManager,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import colors from '../styles/colors';
import { hitSlopProp } from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import { moderateScaleVertical, textScale } from '../styles/responsiveSize';


const BorderTextInput = ({
  containerStyle,
  textInputStyle,
  leftIcon,
  color,
  rightIcon,
  onChangeText,
  value,
  placeholder = '',
  marginBottom = 20,
  onPressRight = () => { },
  withRef = false,
  secureTextEntry = false,
  borderWidth = 1,
  borderRadius = 13,
  isShowPassword,
  rightIconStyle = {},
  require = false,
  keyboardType = 'default',
  maxLength,
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
    <View
      style={{
        flexDirection: 'row',
        height: moderateScaleVertical(49),
        color: colors.white,
        borderWidth: borderWidth,
        borderRadius: borderRadius,
        borderColor: colors.borderLight,
        marginBottom,
        overflow: 'hidden',

        ...containerStyle,
      }}>
      {leftIcon && (
        <View style={{ justifyContent: 'center', marginLeft: 10 }}>
          <Image source={leftIcon} />
        </View>
      )}

      <TextInput
        selectionColor={colors.black}
        placeholder={placeholder.concat(!!require ? '*' : '')}
        placeholderTextColor={
          colors.textGreyB
        }
        maxLength={maxLength}
        style={{
          flex: 1,
          opacity: 0.7,
          color: colors.black,
          fontFamily: fontFamily.medium,
          fontSize: textScale(14),
          paddingHorizontal: 8,
          textAlign: I18nManager.isRTL ? 'right' : 'left',
          ...textInputStyle,
        }}
        ref={inputRef}
        keyboardType={keyboardType}
        // numberOfLines
        blurOnSubmit
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secureTextEntry}
        autoCapitalize={'none'}
        {...props}
      />

      {rightIcon && (
        <TouchableOpacity
          style={{ justifyContent: 'center', marginRight: 10 }}
          hitSlop={hitSlopProp}
          onPress={onPressRight}>
          <Image
            style={{
              ...rightIconStyle,
              tintColor: colors.black,
            }}
            source={rightIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(BorderTextInput);
