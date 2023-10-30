import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import commonStylesFunc from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
export function stylesFunc({defaultLanguagae}) {
  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      // flexDirection: 'column',
      justifyContent: 'flex-end',
      // marginBottom: -15,
    },
    text: {
      backgroundColor: 'transparent',
      color: '#111',
      textAlign: 'center',
      color: colors.white,
      fontFamily: fontFamily.semiBold,
      fontSize: textScale(14),
    },
    button: {
      padding: 15,
      borderWidth: 0,
      borderColor: '#111',
      backgroundColor: colors.themeColor,
    },
    scrollviewHorizontal: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      height: moderateScaleVertical(50),
      flex: undefined,
      borderColor: colors.borderLight,
    },
    headerText: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScale(20),
      alignSelf: 'center',
    },
    editOrder: {
      backgroundColor: 'transparent',
      color: '#111',
      textAlign: 'center',
      color: colors.blue,
      fontFamily: fontFamily.bold,
      fontSize: textScale(13),
    },

    mainComponent: {
      flex: 1,
      backgroundColor: colors.backgroundGrey,
      // borderTopLeftRadius: 20,
      // borderTopRightRadius: 20,
      marginBottom: moderateScale(5),
      // justifyContent: 'flex-end',

      // marginBottom: moderateScaleVertical(20),
    },
    userName: {
      color: colors.textGreyI,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
    },
    orderLableStyle: {
      color: colors.textGreyI,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      opacity: 0.4,
    },
    topLable: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      paddingHorizontal: moderateScale(16),
      backgroundColor: colors.white,
    },
    deliveryLocationAndTime: {
      fontSize: textScale(14),
      color: colors.textGreyB,
      // marginHorizontal: 10,
    },
    clearCartView: {
      height: moderateScaleVertical(30),
      backgroundColor: colors.blueBackGroudC,
      marginTop: moderateScaleVertical(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    vendorView: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      height: moderateScaleVertical(35),
      // backgroundColor: colors.white,
      alignItems: 'center',
      paddingHorizontal: moderateScale(10),
      // borderBottomWidth: moderateScaleVertical(0.5),
      borderBottomColor: colors.borderLight,
    },
    clearCart: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScale(20),
      color: colors.blueColor,
      opacity: 1,
      alignSelf: 'center',
    },
    vendorText: {
      marginRight: moderateScale(20),
      color: colors.blackB,
      opacity: 1,
      // alignSelf: 'center',
      fontSize: textScale(16),
      fontFamily: fontFamily.bold,
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
      color: colors.themeColor,
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
      backgroundColor: colors.lightGreyBgB,
      paddingHorizontal: moderateScale(12),
      marginTop: moderateScaleVertical(10),
    },
    price: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      textAlign: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'right' : 'left',
    },
    priceItemLabel: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    priceItemLabel2: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    addInstruction: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      textDecorationLine: 'underline',
    },
    selectedMethod: {
      color: colors.textGrey,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      marginLeft: moderateScale(10),
    },
    paymentMainView: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingHorizontal: moderateScaleVertical(20),
      paddingVertical: moderateScaleVertical(10),
      backgroundColor: colors.lightGreyBgB,
    },

    //   cart item design start from here
    cartItemMainContainer: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      paddingVertical: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(10),
      backgroundColor: colors.white,
      borderRadius: moderateScale(10),
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
      // opacity:0.
      opacity: 0.8,
    },
    cartItemDetailsCon: {
      // backgroundColor: 'red',
      // height: width / 4.5,
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
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
    },
    cartItemWeight2: {
      color: colors.textGreyB,
      fontSize: moderateScaleVertical(11),
      fontFamily: fontFamily.regular,
    },
    rattingContainer: {
      // borderWidth: 0.5,
      paddingRight: moderateScale(16),
      width: moderateScaleVertical(100),
    },
    incDecBtnCobtainer: {
      // paddingHorizontal: moderateScale(20),
      backgroundColor: colors.cartItemAddRemoveBtn,
      borderRadius: moderateScale(5),
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      justifyContent: 'space-evenly',
      paddingVertical: moderateScaleVertical(3),
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
      fontSize: moderateScale(14),
      color: colors.white,
      marginTop: moderateScaleVertical(5),
    },
    cartItemLine: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginBottom: moderateScaleVertical(10),
    },

    itemPriceDiscountTaxView: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(5),
      marginHorizontal: moderateScale(10),
    },
    offersViewB: {
      marginHorizontal: moderateScale(10),
      backgroundColor: colors.blueBackGroudC,
      paddingVertical: moderateScaleVertical(15),
      paddingHorizontal: moderateScaleVertical(10),
      marginVertical: moderateScaleVertical(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    bottomTabLableValue: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(5),
    },
    amountPayable: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(10),
      borderTopWidth: 0.3,
      borderColor: colors.textGreyLight,
    },
    paymentView: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginVertical: moderateScaleVertical(20),
    },
    placeOrderButtonStyle: {
      backgroundColor: colors.themeColor,
      width: width / 2.4,
    },
    sceduleOrderStyle: {
      backgroundColor: 'rgba(67,162,231,0.3)',
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
      marginLeft: moderateScale(5),
      fontFamily: fontFamily.medium,
      color: colors.lightGreyBgColor,
      fontSize: textScale(14),
      marginRight: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? moderateScale(5) : 0,
    },
    imageStyle: {
      height: width / 4.5,
      width: width / 4.5,
      borderRadius: moderateScale(8),
    },
    writeAReview: {
      fontFamily: fontFamily.bold,
      color: colors.lightGreyBgColor,
      fontSize: textScale(10),
      textAlign: 'left',
    },
    containerStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // marginVertical: moderateScaleVertical(height / 4),
    },
    textStyle: {
      ...commonStyles.mediumFont16,
      fontSize: textScale(18),
      textAlign: 'left',
    },
    waitToAccept: {
      fontFamily: fontFamily.regular,
      color: colors.black,
      fontSize: textScale(14),
      lineHeight: 19,
      opacity: 0.7,
      paddingVertical: 10,
    },
    summaryText: {
      fontSize: textScale(16),
      fontFamily: fontFamily.medium,
      textAlign: 'left',
      marginBottom: moderateScaleVertical(12),
    },
    dottedLine: {
      borderWidth: 1,
      height: 1,
      borderStyle: 'dotted',
      borderColor: '#979797',
      marginBottom: moderateScaleVertical(12),
    },
    ariveTextStyle: {
      fontFamily: fontFamily.bold,
      fontSize: textScale(11),
    },
    ariveView: {
      padding: moderateScale(6),
    },
    quantityStyles: {
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
    },
  });
  return styles;
}
