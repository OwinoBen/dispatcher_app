import React from 'react';
import imagePath from '../constants/imagePath';
import {View, Image, Text, StyleSheet} from 'react-native';
import fontFamily from '../styles/fontFamily';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';

export default function ListEmptyComponent({
  isLoading = false,
  containerStyle = {},
  message = '',
  subMessage = '',
  image = imagePath?.noTask,
}) {
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          ...containerStyle,
        }}>
        <Image source={image} />
        <View
          style={{
            marginTop: moderateScale(40),
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: moderateScale(40),
          }}>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.subMessage}>{subMessage}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', ...containerStyle,}}>
        <Image source={image} />
        <View
          style={{
            marginTop: moderateScale(40),
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: moderateScale(40),
          }}>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.subMessage}>{subMessage}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  message: {
    fontFamily: fontFamily.medium,
    color: colors.black,
    fontSize: textScale(12),
    marginVertical: moderateScaleVertical(10),
  },
  subMessage: {
    fontFamily: fontFamily.medium,
    color: colors.iconGrey,
    fontSize: textScale(12),
    marginVertical: moderateScaleVertical(10),
    textAlign: 'center',
  },
});
