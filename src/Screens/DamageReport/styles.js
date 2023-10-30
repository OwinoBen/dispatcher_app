import {StyleSheet, I18nManager} from 'react-native';
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
    containerStyle: {
      paddingVertical: 0,
      height: moderateScaleVertical(58),
      alignItems: 'center',
      borderBottomColor: colors.lightGreyBorder,
      borderBottomWidth: 0.7,
    },
    starViewStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadImage: {
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      color: colors.textGreyD,
    },
    imageOrderStyle: {
      height: width / 5,
      width: width / 5,
      borderRadius: 5,
      marginRight: 10,
      marginBottom: moderateScaleVertical(10),
    },
    viewOverImage: {
      height: width / 5,
      width: width / 5,
      borderRadius: 5,

      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    viewOverImage2: {
      borderWidth: 1,
      height: width / 5,
      width: width / 5,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: 'rgba(0,0,0,0.2)',
    },
    textInputContainer: {
      marginTop: moderateScaleVertical(10),
      borderRadius: 5,
      borderWidth: 1,
      height: width / 2,
      borderColor: colors.textGreyLight,
    },
    textInputStyle: {
      height: width / 2,
      padding: 10,
      borderRadius: 5,
      textAlignVertical: 'top',
    },
    textStyle: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      // opacity: 0.6,
    },
    commentInput: {
      opacity: 0.7,
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      paddingHorizontal: 8,
      paddingTop: 0,
      paddingBottom: 0,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      // marginHorizontal: moderateScale(20),
      backgroundColor: colors.backGround,
      height: moderateScaleVertical(width / 3.5),
      borderRadius: moderateScale(4),
      marginVertical: moderateScale(10),
    },
    textInputStyle2: {
      opacity: 0.7,
      color: colors.black,
      fontFamily: fontFamily.semiBold,
      fontSize: textScale(12),
      paddingHorizontal: 8,
      paddingTop: 0,
      paddingBottom: 0,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      // marginHorizontal: moderateScale(20),
      backgroundColor: colors.backGround,
      height: moderateScaleVertical(40),
      borderRadius: moderateScale(4),
      marginVertical: moderateScale(10),
      justifyContent:'center'
    },
    noDataFound: {
      width: '100%',
      height: moderateScale(30),
      justifyContent: 'center',
      alignItems: 'center',
    },
    labelTxt: {
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      color: colors.lightGreyBg2,
    },
    dropdownstyle:{
      borderWidth: 1,
      borderColor: colors.borderColorB,
      backgroundColor: colors.white,
      width: '100%',
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      minHeight: moderateScale(50),
      borderRadius: moderateScale(5),
      maxHeight: moderateScale(150),
    },
    selectedContainerStyle:{
      borderRadius: 8,
      height: moderateScaleVertical(44),
      paddingHorizontal: moderateScale(10),
      //   borderWidth: 1,
      borderColor: colors.borderLight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: moderateScale(5),
      backgroundColor: colors.backGround,
    }
  });
  return styles;
};
