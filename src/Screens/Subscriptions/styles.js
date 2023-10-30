import {I18nManager, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';


export const styles = StyleSheet.create({
    subscriptionTitle: {
      fontFamily: fontFamily.medium,
      fontSize: moderateScale(16),
      color: colors.blackC,
      opacity: 0.5,
    },
    subscription2:{
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(16),
        color: colors.blackC,
        // opacity: 0.5,
    },
    title: {
        color: colors.black,
        fontFamily: fontFamily.medium,
        fontSize: textScale(12),
      },
      title2: {
        color: colors.black,
        fontFamily: fontFamily.medium,
        fontSize: textScale(12),
        opacity:0.5
      },
      // headerTopLine: {
      //   height: 1,
      //   backgroundColor: colors.lightGreyBgColor,
      //   opacity: 0.26,
      // },
      rootContainer: {
        marginHorizontal: moderateScale(20),
        marginVertical: moderateScale(20),
      },
  })