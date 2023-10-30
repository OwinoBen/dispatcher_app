import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';

const GradientButton = ({
  containerStyle,
  btnStyle = {},
  //colorsArray = [themeColors?.primary_color, themeColors?.primary_color],
  borderRadius = 40,
  onPress,
  btnText,
  marginTop = 0,
  marginBottom = 0,
  textStyle = {},
  indicator = false,
  colorsArray = null,
}) => {
  const {appStyle, themeColors} = useSelector(state => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const buttonTextColor = themeColors;

  const commonStyles = commonStylesFun({fontFamily, buttonTextColor});
  return (
    <TouchableOpacity
      style={{
        ...commonStyles.buttonRect,
        borderWidth: 0,
        marginTop,
        marginBottom,
        borderRadius,
        ...containerStyle,
      }}
      onPress={onPress}>
      <LinearGradient
        style={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          borderRadius,
          ...btnStyle,
        }}
        colors={
          colorsArray ? colorsArray : [colors?.themeColor, colors?.themeColor]
        }>
        {!!indicator ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Text style={{...commonStyles.buttonTextWhite, ...textStyle}}>
            {btnText}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
