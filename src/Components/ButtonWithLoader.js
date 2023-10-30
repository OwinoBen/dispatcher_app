import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import { moderateScaleVertical } from '../styles/responsiveSize';
const ButtonWithLoader = ({
  onPress = () => { },
  btnText = '',
  btnTextStyle = {},
  btnStyle = {},
  isLoading = false,
  color = colors.white,
  disabled = false,
}) => {
  const { appStyle } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({ fontFamily });
  return (
    <TouchableOpacity
      style={{
        ...commonStyles.buttonRect,
        marginTop: moderateScaleVertical(20),
        ...btnStyle,
      }}
      disabled={disabled}
      onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Text style={{ ...commonStyles.buttonTextWhite, color, ...btnTextStyle }}>
          {btnText}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ButtonWithLoader;
