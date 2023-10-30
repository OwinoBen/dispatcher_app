import {StyleSheet} from 'react-native';
import colors from '../../../styles/colors';
import commonStylesFunc from '../../../styles/commonStyles';
import fontFamily from '../../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';

export default ({themeColors}) => {
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = StyleSheet.create({
    verification: {
      fontFamily: fontFamily.bold,
      fontSize: textScale(16),
      color: colors.black,
    },
    codesendto: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      color: colors.black,
      marginTop: moderateScaleVertical(10),
    },
    cellStyle: {
      borderBottomWidth: 1,
      borderColor: colors.textGrey,
    },
    cellStyleFocused: {
      borderColor: colors.textGrey,
    },
    textStyleCodeInput: {
      fontSize: 24,
      color: colors.textGrey,
    },
    textStyleFocused: {
      color: colors.textGrey,
    },
    maskStyle: {
      width: 10,
      height: 10,
      borderRadius: 25,
      backgroundColor: colors.textGrey,
    },
    didntgetOtp: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
      color: colors.black,
      marginTop: moderateScaleVertical(30),
    },
  });
  return styles;
};
