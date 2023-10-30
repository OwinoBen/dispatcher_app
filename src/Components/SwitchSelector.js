import React from 'react';
import SwitchSelector from 'react-native-switch-selector';
import colors from '../styles/colors';
import {StyleSheet} from 'react-native';
import fontFamily from '../styles/fontFamily';
import {textScale, width} from '../styles/responsiveSize';
const SwitchSelectorComponent = ({
  initial = 0,
  onPress = () => {},
  textColor = colors?.themeColor,
  selectedColor = colors.white,
  buttonColor = colors?.themeColor,
  borderColor = colors?.themeColor,
  animationDuration = 300,
  textStyleInput = {},
  borderRadius = 10,
  textInputStyle = {},
  valuePadding = 0,
  options = [],
  height = 35,
  fontSize = textScale(10),
  borderWidth = 0,
}) => {
  console.log("inital value+++",initial)
  return (
  
    <SwitchSelector
      initial={initial}
      onPress={onPress}
      textColor={textColor} //'#7a44cf'
      selectedColor={selectedColor}
      buttonColor={buttonColor}
      borderColor={borderColor}
      hasPadding
      animationDuration={animationDuration}
      textStyle={{...styles.textStyle, ...textStyleInput}}
      borderRadius={borderRadius}
      style={[styles.textInputStyle, {...textInputStyle}]}
      valuePadding={valuePadding}
      options={options}
      height={height}
      borderWidth={borderWidth}
      fontSize={fontSize}
      backgroundColor={colors.lightGreyBg}
      testID="switch-selector"
      accessibilityLabel="switch-selector"
    />
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: fontFamily.semiBold,
    color: colors.black,
  },
   textInputStyle: {width: width - 40},
});

export default SwitchSelectorComponent
