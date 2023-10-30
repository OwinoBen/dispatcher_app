import { StyleSheet } from 'react-native';
import { getColorCodeWithOpactiyNumber } from '../utils/helperFunctions';
import colors from './colors';
import { moderateScaleVertical, textScale } from './responsiveSize';

export const hitSlopProp = {
  top: 12,
  right: 12,
  left: 12,
  bottom: 12,
};

export default ({ fontFamily, buttonTextColor }) => {
  const styles = StyleSheet.create({
    loader: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mediumFont12: {
      fontSize: textScale(12),
      color: colors.textGrey,
      fontFamily: fontFamily?.medium,
      opacity: 0.7,
    },
    mediumFont14: {
      // fontSize:RFValue(14,height),
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily?.medium,
      opacity: 0.7,
    },
    mediumFont14Normal: {
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily?.medium,
      opacity: 1,
    },
    mediumFont16: {
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily?.medium,
    },
    futuraBtHeavyFont16: {
      fontSize: textScale(16),
      color: colors.black,
      fontFamily: fontFamily?.bold,
    },
    futuraBtHeavyFont14: {
      fontSize: textScale(14),
      color: colors.black,
      fontFamily: fontFamily?.bold,
    },
    futuraHeavyBt: {
      fontSize: textScale(16),
      color: colors.black,
      fontFamily: fontFamily?.bold,
    },
    buttonRect: {
      height: moderateScaleVertical(46),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.themeColor,
      borderWidth: 1,
      borderColor: colors.themeColor,
      borderRadius: 13,
    },
    buttonRectTransparent: {
      height: moderateScaleVertical(46),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.themeColor,
      borderWidth: 1,
      borderColor: getColorCodeWithOpactiyNumber('1E2428', 20),
      borderRadius: 13,
    },

    buttonRectCommonButton: {
      height: moderateScaleVertical(46),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(67,162,231,0.3)',
      borderWidth: 0,
      borderColor: getColorCodeWithOpactiyNumber('1E2428', 20),
      borderRadius: 13,
    },

    shadowStyle: {
      backgroundColor: colors.white,
      borderRadius: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      // borderColor: colors.lightWhiteGrayColor,
      // borderWidth: 0.7,
    },
    buttonTextWhite: {
      fontFamily: fontFamily?.bold,
      textTransform: 'uppercase',
      color: buttonTextColor?.secondary_color
        ? buttonTextColor?.secondary_color
        : colors.white,
      textAlign: 'center',
    },

    buttonTextBlue: {
      fontFamily: fontFamily?.bold,
      textTransform: 'uppercase',
      color: colors.textBlue,
      textAlign: 'center',
    },
    buttonTextBlack: {
      fontFamily: fontFamily?.medium,
      textTransform: 'uppercase',
      color: colors.textGrey,
      textAlign: 'center',
    },
    imgOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerTopLine: {
      height: 1,
      backgroundColor: colors.lightGreyBgColor,
      opacity: 0.26,
    },

    flexRowCenter: {
      flexDirection: "row",
      alignItems: "center"
    },
    flexRowSpaceBtwn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    font10: {
      fontSize: textScale(10),
      color: colors.black,
      fontFamily: fontFamily.regular,
    },
    mediumFont10: {
      fontSize: textScale(10),
      color: colors.black,
      fontFamily: fontFamily.medium,
    },
    boldFont10: {
      fontSize: textScale(10),
      color: colors.black,
      fontFamily: fontFamily.bold,
    },
    font11: {
      fontSize: textScale(11),
      color: colors.black,
      fontFamily: fontFamily.regular,
    },
    mediumFont11: {
      fontSize: textScale(11),
      color: colors.black,
      fontFamily: fontFamily.medium,
    },

    boldFont11: {
      fontSize: textScale(11),
      color: colors.black,
      fontFamily: fontFamily.bold,
    },
    font12: {
      fontSize: textScale(12),
      color: colors.black,
      fontFamily: fontFamily.regular,
    },
    mediumFont12: {
      fontSize: textScale(12),
      color: colors.black,
      fontFamily: fontFamily.medium,
    },

    boldFont12: {
      fontSize: textScale(12),
      color: colors.black,
      fontFamily: fontFamily.bold,
    },

    font13: {
      fontSize: textScale(13),
      color: colors.black,
      fontFamily: fontFamily.regular,
    },
    mediumFont13: {
      fontSize: textScale(13),
      color: colors.black,
      fontFamily: fontFamily.medium,
    },

    boldFont13: {
      fontSize: textScale(13),
      color: colors.black,
      fontFamily: fontFamily.bold,
    },

    font14: {
      fontSize: textScale(14),
      color: colors.black,
      fontFamily: fontFamily.regular,
    },
    mediumFont14: {
      fontSize: textScale(14),
      color: colors.black,
      fontFamily: fontFamily.medium,
    },

    boldFont14: {
      fontSize: textScale(14),
      color: colors.black,
      fontFamily: fontFamily.bold,
    },
    font15: {
      fontSize: textScale(15),
      color: colors.black,
      fontFamily: fontFamily.regular,
    },
    mediumFont15: {
      fontSize: textScale(15),
      color: colors.black,
      fontFamily: fontFamily.medium,
    },

    boldFont15: {
      fontSize: textScale(15),
      color: colors.black,
      fontFamily: fontFamily.bold,
    },
    font16: {
      fontSize: textScale(16),
      color: colors.black,
      fontFamily: fontFamily.regular,
    },
    mediumFont16: {
      fontSize: textScale(16),
      color: colors.black,
      fontFamily: fontFamily.medium,
    },

    boldFont16: {
      fontSize: textScale(16),
      color: colors.black,
      fontFamily: fontFamily.bold,
    },
    font17: {
      fontSize: textScale(17),
      color: colors.black,
      fontFamily: fontFamily.regular,
    },
    mediumFont17: {
      fontSize: textScale(17),
      color: colors.black,
      fontFamily: fontFamily.medium,
    },

    boldFont17: {
      fontSize: textScale(17),
      color: colors.black,
      fontFamily: fontFamily.bold,
    },

    font18: {
      fontSize: textScale(18),
      color: colors.black,
      fontFamily: fontFamily.regular,
    },
    mediumFont18: {
      fontSize: textScale(18),
      color: colors.black,
      fontFamily: fontFamily.medium,
    },

    boldFont18: {
      fontSize: textScale(18),
      color: colors.black,
      fontFamily: fontFamily.bold,
    },

    font20: {
      fontSize: textScale(20),
      color: colors.black,
      fontFamily: fontFamily.regular,
    },
    mediumFont20: {
      fontSize: textScale(20),
      color: colors.black,
      fontFamily: fontFamily.medium,
    },

    boldFont20: {
      fontSize: textScale(20),
      color: colors.black,
      fontFamily: fontFamily.bold,
    },
  });
  return styles;
};
