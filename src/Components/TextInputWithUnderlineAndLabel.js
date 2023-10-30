import React, {useEffect, useRef} from 'react';
import {
  I18nManager,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {hitSlopProp} from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';
import imagePath from '../constants/imagePath';
import fontFamily from '../styles/fontFamily';

// import styles from '../Screens/Tracking/styles';

const TextInputWithUnderlineAndLabel = ({
  label,
  labelStyle,
  lableViewStyle,
  containerStyle,
  txtInputStyle,
  leftIcon,
  color = colors.textGreyOpcaity7,
  rightIcon,
  onChangeText,
  value,
  placeholder,
  marginBottom = 20,
  onPressRight = () => {},
  withRef = false,
  secureTextEntry = false,
  disabled = true,
  textViewOnly = false,
  tintColor,
  subLabel = null,
  sublabelStyle,
  mainStyle,
  onPress = () => {},
  isLableIcon = true,
  labelIconPath = '',
  labelIconStyle = {},
  onPressLabel = () => {},
  underlineColor = colors.textGreyB,
  placeholderTextColor = colors.textGreyB,
  onRightPress = () => {},
  isEditable = true,
  keyboardType = '',
  defaultValue = '',
  autoFocus = false,
  ...props
}) => {



  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={disabled}
      onPress={onPress}
      style={mainStyle}>
      <View style={{flexDirection: 'row', ...lableViewStyle}}>
        <Text
          numberOfLines={1}
          style={{
            color: colors.textGreyB,
            // backgroundColor: 'red',
            flex: 1,
            textAlign:'left',
            ...labelStyle,
          }}>
          {label}
        </Text>
        {isLableIcon && (
          <TouchableOpacity activeOpacity={0.8} onPress={onPressLabel}>
            <Image source={labelIconPath} style={labelIconStyle} />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          minHeight: moderateScaleVertical(30),
          color: colors.white,
          marginBottom,
           borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: underlineColor,
          paddingBottom: 11,
          alignItems: 'center',
          ...containerStyle,
        }}>
        <TextInput
          autoFocus={autoFocus || false}
          selectionColor={ colors.black}
          placeholder={placeholder}
          placeholderTextColor={
             placeholderTextColor
          }
          style={{
            flex: 1,
            opacity: 0.7,
            color:colors.textGreyOpcaity7,
            fontFamily: fontFamily.medium,
            fontSize: textScale(14),
            paddingHorizontal: 8,
            paddingTop: 0,
            paddingBottom: 0,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
            ...txtInputStyle,
          }}
          
          // numberOfLines
          blurOnSubmit
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={'none'}
          editable={isEditable}
          defaultValue={defaultValue}
          {...props}
        />
        {!!rightIcon && (
          <TouchableOpacity hitSlop={hitSlopProp} onPress={onRightPress}>
            <Image source={rightIcon} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};


  
export default React.memo(TextInputWithUnderlineAndLabel);
