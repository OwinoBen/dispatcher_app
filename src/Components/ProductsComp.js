import React from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {currencyNumberFormatter} from '../utils/commonFunction';
import {
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';

const ProductsComp = ({isDiscount, item, imageStyle, onPress = () => {}}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {themeColors, appStyle, currencies} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;

  const scaleInAnimated = new Animated.Value(0);

  const {
    translation = [],
    category = {},
    media = [],
    vendor = {},
    variant = [],
  } = item;
  const imageUrl = getImageUrl(
    media[0]?.image?.path?.image_fit,
    media[0]?.image?.path?.image_path,
    '600/600',
  );
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        width: width / 2.5,
        ...getScaleTransformationStyle(scaleInAnimated),
      }}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}>
      <ImageBackground
        source={{uri: imageUrl}}
        style={{
          height: moderateScale(100),
          width: width / 2.5,
          ...imageStyle,
        }}
        imageStyle={{
          borderRadius: moderateScale(10),
          backgroundColor: isDarkMode
            ? colors.whiteOpacity15
            : colors.greyColor,
        }}>
        {!!item?.averageRating && item?.averageRating !== '0.0' && (
          <View style={styles.hdrRatingTxtView}>
            <Text
              style={{
                ...styles.ratingTxt,
                fontFamily: fontFamily.medium,
              }}>
              {Number(item?.averageRating).toFixed(1)}
            </Text>
            <Image
              style={styles.starImg}
              source={imagePath.star}
              resizeMode="contain"
            />
          </View>
        )}
      </ImageBackground>
      <View style={{marginVertical: moderateScaleVertical(6)}}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: textScale(12),
            fontFamily: fontFamily.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            textAlign: 'left',
            lineHeight: moderateScale(16),
          }}>
          {translation[0]?.title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: textScale(11),
            fontFamily: fontFamily.regular,
            marginVertical: moderateScaleVertical(4),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity66,
            textAlign: 'left',
          }}>
          {vendor?.name}
        </Text>
        {!isDiscount ? (
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 0.5, alignItems: 'flex-start'}}>
              {category?.category_detail?.translation[0]?.name && (
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.inTextStyle,
                    fontFamily: fontFamily.regular,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity66,
                    width: width / 4,
                  }}>
                  {strings.IN} {category?.category_detail?.translation[0]?.name}
                </Text>
              )}
            </View>
            <View style={{marginHorizontal: 10}} />
            <View style={{flex: 0.5, alignItems: 'flex-end'}}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: textScale(10),
                  fontFamily: fontFamily.medium,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                <Text>
                  {`${
                    currencies?.primary_currency?.symbol
                  } ${currencyNumberFormatter(
                    Number(variant[0]?.price).toFixed(2),
                  )}`}
                </Text>
              </Text>
            </View>
          </View>
        ) : (
          <View>
            <Text
              style={{
                ...styles.inTextStyle,
                fontFamily: fontFamily.regular,
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity66,
              }}>
              {strings.IN} {category?.category_detail?.translation[0]?.name}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.medium,
                  color: colors.green,
                  marginVertical: moderateScaleVertical(8),
                }}>
                $ {variant[0]?.price}
              </Text>
              <Text
                style={{
                  textDecorationLine: 'line-through',
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity40,
                  marginLeft: moderateScale(12),
                }}>
                $ {variant[0]?.price}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  hdrRatingTxtView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green,
    paddingVertical: moderateScale(2),
    paddingHorizontal: moderateScale(4),
    alignSelf: 'flex-start',
    borderRadius: moderateScale(2),
    marginTop: moderateScaleVertical(16),
  },
  ratingTxt: {
    textAlign: 'left',
    color: colors.white,
    fontSize: textScale(9),
    textAlign: 'left',
  },
  starImg: {
    tintColor: colors.white,
    marginLeft: 2,
    width: 9,
    height: 9,
  },
  inTextStyle: {
    fontSize: textScale(9),
    width: width / 3,
    textAlign: 'left',
  },
});

export default React.memo(ProductsComp);
