import {I18nManager, Platform, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {getColorCodeWithOpactiyNumber} from '../../utils/helperFunctions';

export default ({ themeColors, isDarkMode, MyDarkTheme}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      // flexDirection: 'column',
      justifyContent: 'flex-end',
      // marginBottom: -15,
    },
    scrollviewHorizontal: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      height: moderateScaleVertical(50),
      flex: undefined,
      borderColor: colors.borderLight,
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
    text2: {
      backgroundColor: 'transparent',
      color: '#111',
      textAlign: 'center',
      color: colors.white,
      fontFamily: fontFamily.semiBold,
      fontSize: textScale(12),
    },
    headerText: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScale(20),
      alignSelf: 'center',
    },
    mainComponent: {
      flex: 1,
      backgroundColor: colors.backgroundGrey,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      zIndex: 2,
    },
    topLable: {
      flexDirection: 'row',
      paddingHorizontal: moderateScale(12),
    },
    deliveryLocationAndTime: {
      ...commonStyles.mediumFont14,
      color: colors.textGreyB,
      fontSize: textScale(12),
    },
    clearCartView: {
      height: moderateScaleVertical(30),
      backgroundColor: getColorCodeWithOpactiyNumber(
        colors?.themeColor.substr(1),
        20,
      ),
      marginTop: moderateScaleVertical(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    vendorView: {
      flexDirection: 'row',
      // height: moderateScaleVertical(35),
      // backgroundColor: colors.white,
      // alignItems: 'center',
      paddingHorizontal: moderateScale(2),
      // borderBottomWidth: moderateScaleVertical(0.5),
      borderBottomColor: colors.borderLight,
      marginVertical: moderateScaleVertical(8),
    },
    clearCart: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScale(20),
      color: colors?.themeColor,
      opacity: 1,
      alignSelf: 'center',
    },
    vendorText: {
      ...commonStyles.futuraHeavyBt,
      marginRight: moderateScale(20),
      color: colors.blackB,
      opacity: 1,
      fontFamily: fontFamily.medium,
    },
    offersView: {
      backgroundColor: colors.lightGreyBgB,
      padding: moderateScale(20),
      marginTop: moderateScaleVertical(10),
    },
    offerText: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    selectPromoCode: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      paddingLeft: moderateScale(5),
    },
    viewOffers: {
      color: colors?.themeColor,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      paddingRight: moderateScale(5),
    },
    removeCoupon: {
      color: colors.themeColor,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      paddingRight: moderateScale(5),
    },
    priceSection: {
      // paddingHorizontal: moderateScale(12),
    },
    price: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    priceItemLabel: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(13),
    },
    priceTipLabel: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
    },
    priceItemLabelVat: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
    },
    priceItemLabel2: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      color: colors.black,
    },
    addInstruction: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      textDecorationLine: 'underline',
    },
    selectedMethod: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      marginLeft: moderateScale(10),
    },
    paymentMainView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScaleVertical(20),
      paddingVertical: moderateScaleVertical(10),
      backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.greyNew,
      marginHorizontal: 16,
      borderRadius: moderateScale(10),
    },

    // cart item design start from here
    cartItemMainContainer: {
      flexDirection: 'row',
      paddingTop: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(10),
      paddingBottom: moderateScale(2),
      // backgroundColor: colors.white,
    },
    cartItemImage: {
      height: width / 4.5,
      width: width / 4.5,
      backgroundColor: colors.white,
    },
    cartItemName: {
      fontSize: textScale(15),
      fontFamily: fontFamily.bold,
      marginTop: moderateScaleVertical(5),
      color: colors.black,
      opacity: 0.8,
    },
    cartItemDetailsCon: {
      width: width - width / 4 - 20,
      paddingHorizontal: moderateScale(10),
    },
    cartItemPrice: {
      fontFamily: fontFamily.bold,
      color: colors.cartItemPrice,
      fontSize: textScale(14),
      marginVertical: moderateScaleVertical(8),
    },
    cartItemWeight: {
      color: colors.textGreyB,
    },
    cartItemWeight2: {
      color: colors.textGreyB,
      fontSize: moderateScaleVertical(11),
    },
    cartItemWeight3: {
      color: colors.black,
      fontSize: moderateScaleVertical(11),
    },
    rattingContainer: {
      paddingRight: moderateScale(16),
      width: moderateScaleVertical(100),
    },
    incDecBtnContainer: {
      backgroundColor: colors?.themeColor,
      borderRadius: moderateScale(16),
      paddingHorizontal: moderateScale(6),
      paddingVertical: moderateScaleVertical(4),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cartItemRatting: {
      tintColor: colors.orange,
      marginTop: moderateScaleVertical(2),
      marginTop: moderateScaleVertical(8),
    },
    cartItemRattingNum: {
      marginLeft: moderateScaleVertical(5),
      fontFamily: fontFamily.bold,
      color: colors.orange,
      marginTop: moderateScaleVertical(8),
    },
    cartItemValueBtn: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(20),
      color: colors.white,
    },
    cartItemValue: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(12),
      color: colors.white,
    },
    cartItemLine: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginBottom: moderateScaleVertical(10),
    },

    itemPriceDiscountTaxView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: moderateScaleVertical(4),
    },
    offersViewB: {
      backgroundColor: isDarkMode
        ? MyDarkTheme.colors.lightDark
        : colors.transactionHistoryBg,
      paddingVertical: moderateScaleVertical(15),
      paddingHorizontal: moderateScaleVertical(10),
      marginTop: moderateScaleVertical(0),
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: moderateScale(12),
    },
    bottomTabLableValue: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: moderateScale(18),
      marginVertical: moderateScale(8),
    },
    amountPayable: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(8),
      marginHorizontal: moderateScale(18),
    },
    paymentView: {
      marginVertical:
        Platform.OS === 'ios'
          ? moderateScaleVertical(16)
          : moderateScaleVertical(26),
      marginHorizontal: moderateScale(10),
      justifyContent: 'space-between',
      flex: 1,
      flexDirection: 'row',
    },
    placeOrderButtonStyle: {
      backgroundColor: colors?.themeColor,
      flex: 1,
      marginHorizontal: moderateScale(5),
    },
    sceduleOrderStyle: {
      backgroundColor: getColorCodeWithOpactiyNumber(
        colors?.themeColor.substr(1),
        20,
      ),
      width: width / 2,
    },
    dashedLine: {
      height: 1,
      borderRadius: 1,
      borderWidth: 0.5,
      borderColor: colors.borderLight,
      borderStyle: 'dashed',
    },
    address: {
      fontFamily: fontFamily.medium,
      color: colors.lightGreyBgColor,
      fontSize: textScale(12),
      marginHorizontal: moderateScale(2),
    },
    imageStyle: {
      height: width / 4.5,
      width: width / 4.5,
      borderRadius: moderateScale(8),
    },

    containerStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textStyle: {
      ...commonStyles.mediumFont14,
      fontSize: textScale(13),
      color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity40,
    },
    tipArrayStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0.7,
      paddingHorizontal: moderateScaleVertical(8),
      paddingVertical: 5,
      borderColor: colors.textGreyB,
      marginRight: 5,
      marginTop: moderateScaleVertical(8),
      borderRadius: moderateScale(5),
      borderColor: colors?.themeColor,
    },
    tipArrayStyle2: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0.7,
      paddingHorizontal: moderateScaleVertical(14),
      paddingVertical: 5,
      marginLeft: 2,
      marginTop: moderateScaleVertical(8),
      borderRadius: moderateScale(5),
      borderColor: colors?.themeColor,
    },
    bottomAddToCartView: {
      marginHorizontal: moderateScale(20),
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
    modalContainer: {
      marginHorizontal: 0,
      marginBottom: 0,
      marginTop: moderateScaleVertical(height / 2),
      overflow: 'hidden',
    },
    closeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: moderateScaleVertical(10),
    },
    modalMainViewContainer: {
      // flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      // overflow: 'hidden',
      // paddingHorizontal: moderateScale(24),
    },
    carType: {
      fontSize: textScale(14),
      color: colors.blackC,
      fontFamily: fontFamily.bold,
    },
    dateTimePickerText: {
      width: width - 20,
      height: height / 3.5,
    },
    swipeView: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: moderateScale(16),
      borderRadius: moderateScale(8),
      backgroundColor: '#FFC8C8',
      marginBottom: moderateScaleVertical(12),
      // alignItems:'flex-end',
      width: moderateScale(42),
      // width: width,
    },
    commTextStyle: {
      color: colors.white,
      fontSize: textScale(14),
      fontFamily: fontFamily.medium,
      textAlign: 'left',
      marginHorizontal: moderateScale(12),
      marginBottom: moderateScaleVertical(12),
    },
    addAddressTxt: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      marginVertical: moderateScale(2),
      color: colors.black,
      opacity: 0.6,
      lineHeight: 20,
      textAlign: 'left',
    },
    addressView: {
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(4),
      // justifyContent: 'space-between',
    },
    homeTxt: {
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      textAlign: 'left',
    },
    editIcon: {
      height: moderateScaleVertical(18),
      width: moderateScale(18),
      tintColor: colors?.themeColor,
    },
    dropDownStyle: {
      width: width - moderateScale(40),
      alignSelf: 'center',
      // zIndex: 5000,
    },
    dropDownContainerStyle: {
      height: 40,
      marginVertical: moderateScaleVertical(10),
      // zIndex: 10,
    },
    mainViewRednderItem: {
      paddingHorizontal: moderateScale(10),
      // marginVertical: moderateScaleVertical(10),
      // marginBottom: moderateScaleVertical(10),
      zIndex: 1000,
    },
    suggetionView: {
      marginHorizontal: moderateScale(20),
      marginBottom: moderateScaleVertical(16),
    },
    instructionView: {
      height: moderateScale(80),
      borderRadius: moderateScale(15),
      backgroundColor: colors.borderColorD,
      marginVertical: moderateScaleVertical(16),
      padding: moderateScale(10),
      marginHorizontal: moderateScale(10),
      fontFamily: fontFamily.regular,
      color: isDarkMode ? colors.white : colors.black,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    laundrySection: {
      backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.greyNew,
      padding: moderateScale(10),
      marginHorizontal: moderateScale(10),
      borderRadius: moderateScale(5),
    },
    LaundryApppriceItemLabel: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
    },
    LaundryApppriceItemLabel2: {
      marginLeft: moderateScale(5),
      color: themeColors?.primary_color,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      opacity: 0.6,
    },
    LaundryApppriceItemLabel3: {
      marginLeft: moderateScale(5),
      color: colors.black,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      opacity: 0.6,
    },
    outOfStock: {
      color: colors.orangeB,
      fontSize: textScale(10),
      lineHeight: 20,
      fontFamily: fontFamily.medium,
    },
  });
  return styles;
};
