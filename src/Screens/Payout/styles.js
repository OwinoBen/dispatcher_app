import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default () => {
  const styles = StyleSheet.create({
    payoutBlockView: {
      marginHorizontal: moderateScale(10),
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: moderateScale(10),
    },
    payoutBlockSubView: {
      width: (width - moderateScale(55)) / 2,
      backgroundColor: colors.ligthBlue,
      minHeight: moderateScale(120),
      borderRadius: moderateScale(10),
      paddingBottom: moderateScale(5),
    },
    payoutNumbersTxt: {
      fontFamily: fontFamily.bold,
      fontSize: textScale(19),
      marginTop: moderateScale(30),
      marginHorizontal: moderateScale(10),
    },
    payoutTitlesTxt: {
      fontFamily: fontFamily.regular,
      marginHorizontal: moderateScale(10),
      marginTop: moderateScale(5),
      fontSize: textScale(13),
    },
    bottomButtonStyle: {
      position: 'absolute',
      bottom: 22,
      left: 20,
      right: 20,
    },
    modalContainer: {
      height: 90,
    },
    circleView: {
      height: 55,
      width: 55,
      borderRadius: moderateScale(55 / 2),
      justifyContent: 'center',
      alignItems: 'center',
    },
    messageInitial: {
      color: colors.white,
      fontSize: moderateScale(18),
      fontFamily: fontFamily.medium,
    },
    message: {
      color: colors.black,
      fontSize: moderateScale(16),
      fontFamily: fontFamily.medium,
    },
    dateTime: {
      color: colors.lightGreyBg2,
      fontSize: moderateScale(14),
      fontFamily: fontFamily.medium,
    },
    amount: {
      color: colors.lightGreyBg2,
      fontSize: moderateScale(12),
      fontFamily: fontFamily.medium,
    },
    mainViewPayoutDetail: {
      backgroundColor: colors.lightGreyBg3,
      marginBottom: moderateScale(15),
      borderRadius: moderateScale(10),
      padding: moderateScale(20),
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusView: {
      marginTop: moderateScale(7),
      width: moderateScale(55),
      paddingVertical: moderateScale(2),
      borderRadius: moderateScale(5),
      alignItems: 'center',
    },
    transactionHistory: {
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(16),
    },
    stripeuttonLayout: {
      borderRadius: width / 2.5 / 2,
      borderWidth: 2,
      borderColor: colors.themeColor,
      width: width / 2.5,
      padding: 10,
      alignItems: 'center',
    },
    stipeText: {
      fontFamily: fontFamily?.bold,
      fontSize: 13,
      color: colors?.themeColor,
    },
    mainViewStripe: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      marginHorizontal: 10,
    },
    razorPayContainer: {
      backgroundColor: colors?.white,
      height: height / 3,
      borderRadius: moderateScale(15),
      justifyContent: 'center',
      paddingHorizontal: moderateScale(10),
    },
    handleHeaderStyle: {
      backgroundColor: colors?.whiteSmokeColor,
      paddingHorizontal: moderateScale(10),
      paddingTop: moderateScaleVertical(10),
      borderTopLeftRadius: moderateScale(15),
      borderTopRightRadius: moderateScale(15),
    },
  });
  return styles;
};
