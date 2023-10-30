import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {moderateScale, textScale, width} from '../../styles/responsiveSize';

export default ({defaultLanguagae}) => {
  const styles = StyleSheet.create({
    cashCollected: {
      fontSize: textScale(12),
      fontFamily: fontFamily.semiBold,
      color: colors.black,
    },
    viewStyle: {
      width: 55,
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
      justifyContent: 'center',
      width: 100,
    },
    cashCollectionContainer: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: colors.white,
      //paddingRight: defaultLanguagae?.value === 'en' ? 0 : moderateScale(45),
    },
    cashTextView: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      flex: 0.5,
      alignItems: 'center',
    },
    clearViewStyle: {
      flex: 0.5,
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
    },
    dateSelectView: {
      justifyContent: 'center',
      marginHorizontal: moderateScale(10),
    },
    gradientStyle: {
      height: '100%',
      // alignItems: 'center',
      justifyContent: 'center',
      width: '45%',
      borderRadius: moderateScale(10),
      height: moderateScale(120),
      padding: moderateScale(10),
    },
    transactionHistory: {
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(16),
    },
    amountText: {
      color: colors.white,
      fontFamily: fontFamily.medium,
      fontSize: textScale(20),
    },
    totalRevenue: {
      color: colors.white,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      marginBottom: moderateScale(10),
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
    moneyViewTransaction: {
      backgroundColor: colors.white,
      marginVertical: moderateScale(15),
      borderRadius: moderateScale(5),
      padding: moderateScale(10),
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    earningBottomTextLable: {
      color: colors.lightGreyBg2,
      fontSize: moderateScale(10),
      fontFamily: fontFamily.medium,
      textAlign: 'center',
    },
    currency: {
      color: colors.green,
      fontSize: moderateScale(12),
      fontFamily: fontFamily.medium,
    },
    amountToReturn: {
      color: colors.redB,
      fontSize: moderateScale(12),
      fontFamily: fontFamily.bold,
    },
    address: {
      color: colors.black,
      fontSize: moderateScale(14),
      fontFamily: fontFamily.medium,
      // textAlign: 'center',
    },
  });
  return styles;
};
