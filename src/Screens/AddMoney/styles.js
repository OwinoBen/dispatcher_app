import {I18nManager, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default () => {
  const styles = StyleSheet.create({
    addMoneyTopCon: {
      paddingHorizontal: moderateScaleVertical(15),
      paddingVertical: moderateScaleVertical(20),
      backgroundColor: colors.white,
    },
    addMoneyInputField: {
      width: width,
      paddingVertical: moderateScaleVertical(8),
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    inputAmountText: {
      fontFamily: fontFamily.bold,
      color: colors.walletTextD,
    },
    currencySymble: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(17),
      position: 'absolute',
    },
    selectAmountCon: {
      borderWidth: 0.5,
      width: 105,
      padding: moderateScale(10),
      marginHorizontal: moderateScaleVertical(10),
      marginTop: moderateScaleVertical(8),
      borderRadius: 3,
      justifyContent: 'center',
      flexDirection: 'row',
      borderColor: colors.walletTimeG,
    },
    chooseAddMoney: {
      // fontFamily:fontFamily.regular
    },
    title: {
      fontFamily: fontFamily.medium,
      fontSize: moderateScale(16),
      color: colors.textGreyJ,
      paddingLeft: moderateScale(10),
      textAlign: 'left',
    },
    debitFrom: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(16),
      color: colors.blackC,
      textAlign: 'left',
    },
    bottomButtonStyle: {
      position: 'absolute',
      bottom: 22,
      left: 20,
      right: 20,
    },

    input: {
      fontSize: 16,
      color: 'black',
    },
    noPaymentFound: {
      textAlign: 'center',
      fontFamily: fontFamily.regular,
      fontSize: textScale(13),
      marginTop: moderateScale(20),
    },
    selectPaymentTxt: {
      fontFamily: fontFamily.medium,
      fontSize: textScale(16),
      marginVertical: moderateScale(10),
    },

    inputAmountText: {
      fontFamily: fontFamily.bold,
      color: colors.walletTextD,
    },
  });
  return styles;
};
