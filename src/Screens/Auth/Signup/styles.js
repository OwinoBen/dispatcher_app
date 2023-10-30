import {StyleSheet} from 'react-native';
import generateBoxShadowStyle from '../../../Components/generateBoxShadowStyle';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {getColorCodeWithOpactiyNumber} from '../../../utils/helperFunctions';

export default ({defaultLanguagae}) => {
  const style = StyleSheet.create({
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
      // backgroundColor: colors.lightGreyBg,
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
      // textAlign: 'center',
      textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
    },
    shadowStyle: {
      flexDirection: 'row',
      borderWidth: 1,
      marginHorizontal: moderateScale(2),
      borderColor: colors.grey2,
      backgroundColor: colors.white,
      borderRadius: 8,
      marginVertical: 5,
      // height: moderateScaleVertical(100),
      ...generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717'),
      marginTop: moderateScaleVertical(10),
    },
    employeetypeHeadingtext: {
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      color: colors.lightGreyBg2,
      marginVertical: moderateScaleVertical(10),
      textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
    },
    label2: {
      marginBottom: moderateScaleVertical(10),

      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      color: colors.lightGreyBg2,
      textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
    },
    label3: {
      marginBottom: moderateScaleVertical(10),
      textAlign: 'center',
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      color: colors.lightGreyBg2,
    },
    imageUpload: {
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: moderateScaleVertical(10),
    },
    imageStyle2: {
      height: 100,
      width: 100,
      borderRadius: moderateScale(4),
    },
    uploadStyle: {
      color: colors.blue,
      fontFamily: fontFamily.medium,
    },
    textInputlabel: {
      textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
    },
    transportationContainer: {
      // backgroundColor: 'red',
      width: width / 6,
      borderRightColor: colors.borderLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    transporationOuterContainer: {
      height: moderateScaleVertical(70),
      // marginHorizontal: moderateScale(-20),
      transform:
        defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? [{scaleX: -1}] : [{scaleX: 1}],
    },
    mainallEmployeeTypeStyle: {
      height: moderateScaleVertical(50),
      // marginHorizontal: moderateScale(-20),
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
    },
    employeeInnerContainer: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
    },
    employeeImageContainer: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      marginHorizontal: moderateScale(30),
      marginVertical: moderateScaleVertical(10),
      alignItems: 'center',
    },
    viewStyleForUploadImage: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      // justifyContent: 'space-between',
    },
    labelTxt: {
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      color: colors.lightGreyBg2,
    },
    modalMainView: {
      backgroundColor: colors.white,
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScale(15),
      borderRadius: moderateScale(10),
      height: moderateScale(200),
    },
    thanksMsgTxt: {
      textAlign: 'center',
      fontFamily: fontFamily.bold,
      fontSize: textScale(16),
      color: colors.themeColor,
    },
    signupDoneTxt: {
      textAlign: 'center',
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),
      marginTop: moderateScale(30),
    },
    driverTagsView: {
      borderWidth: 1,
      width: (width - moderateScale(70)) / 3,
      alignItems: 'center',
      marginVertical: moderateScale(5),
      paddingVertical: moderateScale(5),
      marginHorizontal: moderateScale(5),
      zIndex: 1,
      borderRadius: moderateScale(5),
      justifyContent: 'center',
    },
    noDataFound: {
      width: '100%',
      height: moderateScale(30),
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalMainViewOTP: {
      backgroundColor: colors.white,
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScale(15),
      borderTopLeftRadius: moderateScale(10),
      borderTopRightRadius: moderateScale(10),
      minHeight: moderateScale(200),
    },
    maskStyle: {
      width: 10,
      height: 10,
      borderRadius: 25,
      backgroundColor: colors.textGrey,
    },
    cellStyle: {
      borderBottomWidth: 1,
      borderColor: colors.textGrey,
      color: colors.black,
      alignSelf:'center'
    },
    cellStyleFocused: {
      borderColor: colors.textGrey,
      color: colors.black,
    },
    textStyleCodeInput: {
      fontSize: 24,
      color: colors.textGrey,
    },
    textStyleFocused: {
      color: colors.textGrey,
    },
  });
  return style;
};
