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
    cashCollected: {
      fontSize: textScale(12),
      fontFamily: fontFamily.semiBold,
      color: colors.black,
    },
    viewStyle: {
      width: 50,
      alignItems: 'center',
      backgroundColor: colors.themeColor,
      padding: 5,
      borderRadius: moderateScale(4),
    },
    clear: {
      fontSize: textScale(12),
      fontFamily: fontFamily.semiBold,
      color: colors.white,
      fontFamily: fontFamily.medium,
    },
    selectedDate: {
      fontSize: textScale(12),
      fontFamily: fontFamily.regular,
      color: colors.lightGreyBg2,
    },
    map: {
      // ...StyleSheet.absoluteFillObject,
      height: moderateScale(width / 2.5),
      marginHorizontal: moderateScale(15),
      marginTop: moderateScale(10),
    },
    statusView: {
      minWidth: moderateScale(50),
      maxWidth: moderateScale(100),
      width: moderateScale(100),
      padding: moderateScale(3),
      // marginTop: moderateScale(10),
      // borderRadius: moderateScale(10),
      justifyContent: 'center',
      alignSelf: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'flex-end' : 'flex-start',
    },
    address: {
      fontSize: textScale(14),
      fontFamily: fontFamily.medium,
      color: colors.blackShade2,
      paddingBottom: moderateScale(5),
      textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
    },
    shortName: {
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
      color: colors.iconGrey,
      paddingBottom: moderateScale(5),
      textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
    },
    taskDetailView: {
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
      color: colors.iconGrey,
      // backgroundColor: colors.backGround,
      marginVertical: moderateScale(10),
      justifyContent: 'center',
      alignItems: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'flex-end' : 'flex-start',
    },
    taskText: {
      fontSize: textScale(12),
      fontFamily: fontFamily.bold,
      color: colors.textGreyOpcaity7,

      // paddingBottom: moderateScale(5),
    },
    taskLable: {
      fontSize: textScale(12),
      fontFamily: fontFamily.bold,
      // color: colors.iconGrey,
      textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
      color: colors.textGreyOpcaity7,
      marginBottom:moderateScale(6)
      // paddingBottom: moderateScale(5),
    },
    taskValue: {
      fontSize: textScale(14),
      fontFamily: fontFamily.medium,
      color: colors.blackShade2,
      textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
      // paddingBottom: moderateScale(5),
    },
    labelView: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      marginTop: moderateScale(20),
      alignItems: 'center',
    },
    mainContainer: {
      backgroundColor: 'white',
      // borderTopRightRadius: moderateScale(20),
      // borderTopLeftRadius: moderateScale(20),
      // marginTop: -20,
      marginHorizontal: moderateScale(15),
      flex: 1,
      overflow: 'hidden',
    },
    container: {
      // flex: 1,
      // flexDirection: 'column',
      justifyContent: 'flex-end',
      // marginBottom: -15,
    },
    button: {
      padding: 15,
      borderWidth: 0,
      borderColor: '#111',
      backgroundColor: colors.themeColor,
    },
    text: {
      backgroundColor: 'transparent',
      color: '#111',
      textAlign: 'center',
      color: colors.white,
      fontFamily: fontFamily.semiBold,
      fontSize: textScale(14),
    },
    bgFill: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    taskNameTextstyle: {
      textAlign: 'center',
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),
      opacity: 0.7,
      // paddingBottom: moderateScale(5),
    },
    addressContainer: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
    },
    pathImageStyle: {
      flex: 0.2,
      alignItems: 'center',
      transform: [{scaleX: defaultLanguagae?.value == 'ar' ? -1 : 1}],
    },
    customerNameContainer: {
      marginLeft: moderateScale(7),
      justifyContent: 'space-between',
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
    },
    callImageContainer: {
      flex: 0.3,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    taskTimingContainer: {
      marginLeft:
        defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? moderateScale(0) : moderateScale(7),
      marginRight:
        defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? moderateScale(7) : moderateScale(0),
    },
    emailAndPhone: {
      // textAlign: 'center',
      fontFamily: fontFamily.bold,
      fontSize: textScale(11),
      color: colors.black,
      // paddingBottom: moderateScale(5),
      marginRight: moderateScale(10),
    },
    customerName: {
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      color: colors.black,
    },
    editOrder: {
      backgroundColor: 'transparent',
      color: '#111',
      textAlign: 'center',
      color: colors.white,
      fontFamily: fontFamily.semiBold,
      fontSize: textScale(14),
    },
    distanceTimeTitleTextStyle: {
      fontSize: textScale(14),
      fontFamily: fontFamily.bold,
    },
    distanceTimeTextStyle: {
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
      marginVertical: moderateScaleVertical(5),
    },
  });
  return styles;
};
