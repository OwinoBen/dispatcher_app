import React, {useRef} from 'react';
import SwitchSelector from 'react-native-switch-selector';
import colors from '../styles/colors';
import {
  StyleSheet,
  I18nManager,
  TouchableOpacity,
  TextInput,
  View,
  Text,
} from 'react-native';
import fontFamily from '../styles/fontFamily';
import {
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
const TextInputWithlabel = ({
  containerStyle,
  textInputStyle,
  leftIcon,
  color,
  rightIcon,
  onChangeText,
  value,
  placeholder,
  marginBottom = 10,
  onPressRight = () => {},
  withRef = false,
  secureTextEntry = false,
  label = '',
  labelStyle = {},
  editable = false,
  mainStyle = {},
  keyboardType = 'default',
  onTouchStart = () => {},
  ...props
}) => {
  const inputRef = useRef();

  return (
    <View style={{...mainStyle}} onTouchStart={onTouchStart}>
      <View>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          height: moderateScaleVertical(40),
          color: colors.white,
          borderWidth: 1,
          borderRadius: moderateScaleVertical(4),
          borderColor: colors.borderLight,
          marginBottom,
          overflow: 'hidden',
          ...containerStyle,
        }}>
        <TextInput
          editable={editable}
          selectionColor={colors.black}
          placeholder={placeholder}
          placeholderTextColor={colors.textGreyB}
          style={{
            flex: 1,
            opacity: 0.7,
            color: colors.black,
            fontFamily: fontFamily.semiBold,
            fontSize: textScale(14),
            paddingHorizontal: 8,
            paddingTop: 0,
            paddingBottom: 0,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
            ...textInputStyle,
          }}
          ref={inputRef}
          // numberOfLines
          blurOnSubmit
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={secureTextEntry}
          autoCapitalize={'none'}
          keyboardType={keyboardType}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: fontFamily.semiBold,
  },
  label: {
    marginBottom: moderateScaleVertical(10),

    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
    color: colors.lightGreyBg2,
  },
  textInputStyle: {width: width / 1.8},
});

export default TextInputWithlabel;
