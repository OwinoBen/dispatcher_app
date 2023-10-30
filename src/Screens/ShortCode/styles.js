import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';

export default StyleSheet.create({
  loginUsing: {
    fontSize: textScale(18),
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  weneedCompany: {
    marginTop: moderateScaleVertical(20),
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
    color: colors.black,
  },
  cellStyle: {
    borderBottomWidth: 1,
    borderColor: colors.textGrey,
  },
  cellStyleFocused: {
    borderColor: colors.textGrey,
  },
  textStyleCodeInput: {
    fontSize: 24,
    color: colors.textGrey,
  },
  textStyleFocused: {
    color: colors.textGrey,
  },
  maskStyle: {
    width: 10,
    height: 10,
    borderRadius: 25,
    backgroundColor: colors.textGrey,
  },
  guestBtn: {
    marginTop: moderateScaleVertical(20),
    borderWidth: 0,
  },
  whereCanIhelp: {
    marginTop: moderateScaleVertical(20),
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
    color: colors.black,
    textAlign: 'center',
  },
  buttonStyle: {
    marginTop: moderateScaleVertical(20),
    borderWidth: 0,
    backgroundColor: colors.themeColor,
    borderRadius: moderateScale(40),
  },
  company_address: {
    fontSize: textScale(14),
    fontFamily: fontFamily.bold,
    color: colors.black,
    textAlign: 'center',
  },
  name: {
    fontSize: textScale(14),
    fontFamily: fontFamily.medium,
    color: colors.black,
    textAlign: 'center',
    marginTop: moderateScaleVertical(10),
  },
  cancel: {
    fontSize: textScale(12),
    fontFamily: fontFamily.bold,
    color: colors.white,
    textAlign: 'center',
  },
  confirm: {
    fontSize: textScale(12),
    fontFamily: fontFamily.bold,
    color: colors.white,
    textAlign: 'center',
  },
  cancelButtonView:{
    alignItems: 'center',
    justifyContent: 'center',
    height: moderateScaleVertical(45),
    backgroundColor: colors.textGreyJ,
   
  },
  confirmButtonView:{
    alignItems: 'center',
    justifyContent: 'center',
    height: moderateScaleVertical(45),
    backgroundColor: colors.themeColor,
   
  },
  buttonView:{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomEndRadius: moderateScale(15),
    borderBottomStartRadius: moderateScale(15),
    // backgroundColor: 'red',
    alignItems: 'flex-end',
    overflow: 'hidden',
    marginTop: 20,
  },
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
  
});
