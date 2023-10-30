import {StyleSheet, I18nManager} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default StyleSheet.create({
  cashCollected: {
    fontSize: textScale(12),
    fontFamily: fontFamily.semiBold,
    color: colors.black,
  },
  textStyle: {
    color: colors.black2Color,
    fontSize: textScale(14),
    lineHeight: textScale(28),
    textAlign: 'center',
    fontFamily: fontFamily.semiBold,
  },
  reason: {
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
    color: colors.black,
  },
  rowViewTaskCancel: {
    marginHorizontal: moderateScale(20),
    borderBottomColor: colors.iconGrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: moderateScale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputBottomView: {
   
  },
  textInputStyle: {
    opacity: 0.7,
    color: colors.black,
    fontFamily: fontFamily.semiBold,
    fontSize: textScale(14),
    paddingHorizontal: 8,
    paddingTop: 0,
    paddingBottom: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    marginHorizontal: moderateScale(20),
    backgroundColor: colors.backGround,
    height: moderateScaleVertical(width / 3.5),
    borderRadius: moderateScale(4),
    marginVertical: moderateScale(10),
  },
});
