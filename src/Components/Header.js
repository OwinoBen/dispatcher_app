import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {hitSlopProp} from '../styles/commonStyles';
import {
  moderateScale,
  StatusBarHeight,
  textScale,
} from '../styles/responsiveSize';

const Header = ({
  leftIcon = imagePath.backArrow,
  centerTitle,
  textStyle,
  horizontLine = true,
  rightIcon = '',
  onPressLeft,
  onPressRight,
  customRight,
  hideRight = true,
  headerStyle,
  noLeftIcon = false,
  rightViewStyle = {},
  customLeft,
  rightIconStyle = {},
  showImageAlongwithTitle = false,
  imageAlongwithTitle = null,
  imageAlongwithTitleStyle = {tintColor: colors.black},
  onPressImageAlongwithTitle,
  onPressCenterTitle,
  leftIconStyle,
  customCenter,
  reverse = true,
}) => {
  const {appStyle} = useSelector(state => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const navigation = useNavigation();
  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );

  return (
    <>
      <View
        style={{
          ...styles.headerStyle,
          ...headerStyle,
          flexDirection:
            defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' && reverse ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            alignItems:
              defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he'  && reverse
                ? 'flex-end'
                : 'flex-start',
            flex: 0.2,
            ...rightViewStyle,
          }}>
          {!noLeftIcon &&
            (customLeft ? (
              customLeft()
            ) : (
              <TouchableOpacity
                hitSlop={hitSlopProp}
                activeOpacity={0.7}
                onPress={
                  !!onPressLeft
                    ? onPressLeft
                    : () => {
                        navigation.goBack();
                      }
                }>
                <Image
                  resizeMode="contain"
                  source={leftIcon}
                  style={{
                    transform: [
                      {
                        scaleX:
                          defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' && reverse ? -1 : 1,
                      },
                    ],
                    ...leftIconStyle,
                  }}
                />
              </TouchableOpacity>
            ))}
        </View>
        <View
          style={{flex: 0.8, alignItems: 'center', justifyContent: 'center'}}>
          {customCenter ? (
            customCenter()
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                onPress={onPressCenterTitle}
                numberOfLines={1}
                style={{
                  ...styles.textStyle,
                  ...textStyle,
                  // width: moderateScale(150),
                }}>
                {centerTitle}
              </Text>
              {!!showImageAlongwithTitle && (
                <TouchableOpacity onPress={onPressImageAlongwithTitle}>
                  <Image
                    style={imageAlongwithTitleStyle}
                    source={imageAlongwithTitle}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View
          style={{
            flex: 0.2,
            alignItems:
              defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he' && reverse
                ? 'flex-start'
                : 'flex-end',
          }}>
          {!!rightIcon ? (
            <TouchableOpacity hitSlop={hitSlopProp} onPress={onPressRight}>
              <Image style={rightIconStyle} source={rightIcon} />
            </TouchableOpacity>
          ) : !!customRight ? (
            customRight()
          ) : hideRight ? (
            <View style={{width: 25}} />
          ) : // <Image source={imagePath.cartShop} />
          null}
        </View>
      </View>
    </>
  );
};
export default Header;

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    headerStyle: {
      // padding: moderateScaleVertical(16),
      paddingHorizontal: moderateScale(16),
      height: StatusBarHeight,
    },

    textStyle: {
      color: colors.black2Color,
      fontSize: textScale(14),
      lineHeight: textScale(28),
      textAlign: 'center',
      fontFamily: fontFamily.semiBold,
    },
  });
  return styles;
}
