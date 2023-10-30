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

export default ({defaultLanguagae}) => {
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = StyleSheet.create({
    header: {
      color: colors.black,
      fontSize: textScale(24),
      fontFamily: fontFamily.bold,
      textAlign: 'center',
    },
    txtSmall: {
      ...commonStyles.mediumFont14,
      lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.medium,
      marginTop: moderateScaleVertical(15),
    },
    socialRow: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    socialRowBtn: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      marginTop: moderateScaleVertical(40),
      alignSelf: 'center',
    },
    hyphen: {
      width: 20,
      height: 1,
      backgroundColor: colors.textGrey,
      opacity: 0.6,
    },
    bottomContainer: {
      marginBottom: moderateScaleVertical(30),
    },
    guestBtn: {
      marginTop: moderateScaleVertical(20),
      backgroundColor: colors.lightSky,
      borderWidth: 0,
    },
    orText: {
      ...commonStyles.mediumFont14,
      lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.medium,
      opacity: 0.6,
      marginTop: 0,
      marginHorizontal: moderateScale(16),
    },
    orText2: {
      lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.bold,
      marginTop: 0,
      marginHorizontal: moderateScale(16),
      color: colors.black,
      fontSize: textScale(14),
    },
    forgotContainer: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      justifyContent:
        defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'flex-start' : 'flex-end',
      marginBottom: moderateScaleVertical(8),
    },
    headerContainer: {
      height: moderateScaleVertical(60),
      paddingHorizontal: moderateScale(24),
      justifyContent: 'center',
    },

    imageStyle: {
      height: height / 3,

      justifyContent: 'center',
      alignItems: 'center',
      // marginTop:moderateScaleVertical(50)
    },
    bottomSectionStyle: {
      height: height - height / 2,
      justifyContent: 'flex-end',
      // backgroundColor: 'red',
    },
    bylogging: {
      color: colors.themeColor,
      fontSize: textScale(10),
      lineHeight: moderateScaleVertical(14),
      fontFamily: fontFamily.medium,
    },
    byContinue: {
      color: colors.black,
      fontSize: textScale(10),
      lineHeight: moderateScaleVertical(14),
      fontFamily: fontFamily.medium,
    },
    termsAndConditions: {
      color: colors.white,
      fontSize: textScale(10),
      lineHeight: moderateScaleVertical(14),
      fontFamily: fontFamily.regular,
    },
    loginUsing: {
      fontSize: textScale(18),
      fontFamily: fontFamily.bold,
      color: colors.black,
      textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
    },
    weneedCompany: {
      marginTop: moderateScaleVertical(20),
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      color: colors.black,
      textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
    },
    signUpView: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: moderateScaleVertical(10),
    },
    signUpText: {
      color: colors.themeColor,
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),
    },
    byContinueTextContainer: {
      marginTop: moderateScaleVertical(20),
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      justifyContent: 'center',
    },
    webLinkContainer: {
      marginTop: moderateScaleVertical(5),
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });
  return styles;
};
