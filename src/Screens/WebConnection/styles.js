import {I18nManager, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const styles = StyleSheet.create({
    addMoneyTopCon: {
      paddingHorizontal: moderateScaleVertical(15),
      paddingVertical: moderateScaleVertical(20),
      backgroundColor: colors.white,
    },
    addMoneyInputField: {
      borderBottomWidth: 0.5,
      paddingLeft: moderateScaleVertical(14),
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
    },
    debitFrom: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(16),
      color: colors.blackC,
    },
    bottomButtonStyle: {
      position: 'absolute',
      bottom: 10,
      left: 20,
      right: 20,
    },
   
    input: {
      fontSize: 16,
      color: "black",
    },
  });
  return styles;
};
