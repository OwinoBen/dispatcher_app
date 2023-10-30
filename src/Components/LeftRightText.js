import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import fontFamily from '../styles/fontFamily';

export default function LeftRightText({leftText = '', rightText = ''}) {
  const {defaultLanguage} = useSelector(state => state?.initBoot);
  return (
    <View
      style={{
        ...styles.mainView,
        flexDirection: defaultLanguage?.value === 'ar' ? 'row-reverse' : 'row',
      }}>
      <Text style={styles.leftTextStyle}>{leftText}</Text>
      <Text style={styles.rightTextStyle}>{rightText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  leftTextStyle: {
    color: colors.textGreyI,
    fontFamily: fontFamily.regular,
    fontSize: textScale(12),
    opacity: 0.4,
  },
  mainView: {
    justifyContent: 'space-between',
    marginVertical: moderateScaleVertical(5),
    marginHorizontal: moderateScale(10),
  },
  rightTextStyle: {
    color: colors.textGrey,
    fontFamily: fontFamily.medium,
    fontSize: textScale(12),
    marginLeft: moderateScale(10),
  },
});
