import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({defaultLanguagae}) => {
  const styles = StyleSheet.create({
    imageView: {
      height: 100,
      width: 100,
      borderRadius: 100 / 2,
      backgroundColor: colors.white,
      borderWidth: StyleSheet.hairlineWidth,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderColor: colors.textGreyJ,
      position: 'absolute',
      top: -50,
    },
    imageViewStyle: {
      backgroundColor: colors.lightGreyBg,
      height: moderateScale(121),
      width: moderateScale(121),
      borderRadius: moderateScale(121 / 2),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    imageStyle: {
      height: moderateScale(121),
      width: moderateScale(121),
      borderRadius: moderateScale(121 / 2),
    },
    label: {
      fontSize: textScale(14),
      fontFamily: fontFamily.semiBold,
      color: colors.black,
      textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
    },
    rootContainer: {
      marginHorizontal: moderateScale(20),
      marginVertical: moderateScale(20),
    },
    personalInfoContainer: {
      marginTop: moderateScale(30),
    },
    transportationViewStyle: {
      height: moderateScaleVertical(60),
      marginHorizontal: moderateScale(-20),
      transform:
        defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? [{scaleX: -1}] : [{scaleX: 1}],
    },
    transportationImageStyle: {
      //backgroundColor: 'red',
      width: width / 5,
      borderRightWidth: 1,
      borderRightColor: colors.borderLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    carInfoStyle: {
      marginTop: moderateScaleVertical(20),
    },
    textInputStyle: {
      textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
    },
    label2: {
      marginBottom: moderateScaleVertical(5),
  
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      color: colors.lightGreyBg2,
    },
  });
  return styles;
};
