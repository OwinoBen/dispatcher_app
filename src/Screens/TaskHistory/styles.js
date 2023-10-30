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
      paddingVertical: moderateScale(10),
      backgroundColor: colors.white,
      paddingHorizontal: moderateScale(20),
    },
    cashTextView: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',

      alignItems: 'center',
    },
    clearViewStyle: {
      flexDirection: defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' ? 'row-reverse' : 'row',
    },
    dateSelectView: {
      justifyContent: 'center',
      marginHorizontal: moderateScale(10),
    },
  });
  return styles;
};
