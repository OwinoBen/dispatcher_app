import {useNavigation} from '@react-navigation/native';
import {cloneDeep} from 'lodash';
import React, {useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import HTMLView from 'react-native-htmlview';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {currencyNumberFormatter} from '../../utils/commonFunction';
import {
  getImageUrl,
  hapticEffects,
  playHapticEffect,
} from '../../utils/helperFunctions';
import stylesFunc from './styles';

export default function AddonModal({
  productdetail = {},
  addonSet = [],
  isVisible = false,
  onClose,
  onPress,
  resizeMode = 'cover',
  imagestyle = {},
}) {
  const navigation = useNavigation();

  const [state, setState] = useState({
    addonSetData: addonSet,
    viewHeight: 0,
    maxLimitAddon: 0,
  });
  const {addonSetData, viewHeight, maxLimitAddon} = state;
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});

  let productImage = productdetail?.product_media[0];

  const selectSpecificOptionsForAddions = (options, i, inx) => {
    let newArray = cloneDeep(options);
    console.log(i, 'i>>>i');
    console.log(newArray, 'newArray>>>newArray');
    console.log(addonSetData, 'addonSetData>>>addonSetData');
    let find = addonSetData.find((x) => x?.addon_id == i?.addon_id);
    console.log(find, 'find>>>find');

    updateState({
      addonSetData: addonSetData.map((vi, vnx) => {
        if (vi.addon_id == i.addon_id) {
          return {
            ...vi,
            setoptions: newArray.map((j, jnx) => {
              if (vi?.max_select > 1) {
                let incrementedValue = 0;
                newArray.forEach((e) => {
                  if (e.value) {
                    incrementedValue = incrementedValue + 1;
                  }
                });
                console.log(incrementedValue, 'incrementedValue');
                if (incrementedValue == vi?.max_select && !j.value) {
                  return {
                    ...j,
                  };
                } else {
                  if (j?.id == i?.id) {
                    return {
                      ...j,
                      value: i?.value ? false : true,
                    };
                  }

                  return {
                    ...j,
                  };
                }
              } else {
                if (j.id == i.id) {
                  return {
                    ...j,
                    value: i?.value ? false : true,
                  };
                }

                return {
                  ...j,
                  value: false,
                };
              }
            }),
          };
        } else {
          return vi;
        }
      }),
    });
  };

  let plainHtml = productdetail?.translation[0]?.body_html || null;
  const checkBoxButtonViewAddons = ({setoptions}) => {
    return (
      <View>
        {setoptions.map((i, inx) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                selectSpecificOptionsForAddions(setoptions, i, inx);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',

                marginBottom: moderateScaleVertical(10),
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.variantValue,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    },
                  ]}>
                  {i?.title
                    ? i.title.charAt(0).toUpperCase() + i.title.slice(1)
                    : ''}
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.variantValue,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    },
                  ]}>
                  {`${
                    currencies?.primary_currency?.symbol
                  }${currencyNumberFormatter(
                    (Number(i?.multiplier) * Number(i?.price)).toFixed(2),
                  )}`}
                </Text>
                <View style={{paddingLeft: moderateScale(5)}}>
                  <Image
                    source={i?.value ? imagePath.check : imagePath.unCheck}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const showAllAddons = () => {
    let variantSetData = cloneDeep(addonSetData);
    return (
      <>
        <View
          style={{
            marginVertical: moderateScaleVertical(5),
          }}>
          {variantSetData.map((i, inx) => {
            return (
              <View
                key={inx}
                style={{
                  marginVertical: moderateScaleVertical(5),
                }}>
                <Text
                  style={[
                    styles.variantLable,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGrey,
                    },
                  ]}>
                  {i?.title}
                </Text>
                <Text
                  style={[
                    styles.chooseOption,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyF,
                    },
                  ]}>
                  {`${strings.MIN} ${i?.min_select} ${strings.AND_MAX} ${i?.max_select} ${strings.SELECTION_ALLOWED}`}
                </Text>
                {!!i.errorShow && (
                  <Text
                    style={{
                      color: colors.redColor,
                      fontSize: textScale(8),
                      fontFamily: fontFamily.medium,
                      textAlign: 'left',
                    }}>
                    {`${strings.MIN} ${i?.min_select} ${strings.REQUIRED}`}
                  </Text>
                )}
                {i?.setoptions ? checkBoxButtonViewAddons(i) : null}
                <View
                  style={{
                    ...commonStyles.headerTopLine,
                    marginVertical: moderateScaleVertical(10),
                  }}
                />
              </View>
            );
          })}
        </View>
      </>
    );
  };

  const checkIfMaxReached = (minVal, Arr) => {
    const SelectedItems = Arr.filter((el) => el.value);
    if (SelectedItems.length >= minVal) {
      return true;
    }
    return false;
  };

  const addToCart = () => {
    playHapticEffect(hapticEffects.impactLight);
    addonSetData.map((i, inx) => {
      const temp = checkIfMaxReached(i.min_select, i.setoptions);
      console.log('temp value', temp);
      if (temp) {
        let CloneArr = addonSetData;
        CloneArr[inx] = {...CloneArr[inx], errorShow: false};
        updateState({addonSetData: CloneArr});
      } else {
        let CloneArr = addonSetData;
        CloneArr[inx] = {...CloneArr[inx], errorShow: true};
        updateState({addonSetData: CloneArr});
      }
    });

    const checkIsError = addonSetData.findIndex((el) => el.errorShow);
    if (checkIsError == -1) {
      onClose();
      navigation.navigate(navigationStrings.PRODUCTDETAIL, {
        data: {
          addonSetData: addonSetData,
          randomValue: Math.random(),
        },
      });
    }
    return;
  };

  return (
    <Modal
      transparent={true}
      isVisible={isVisible}
      animationType={'none'}
      style={styles.modalContainer}
      onLayout={(event) => {
        updateState({viewHeight: event.nativeEvent.layout.height});
      }}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Image source={imagePath.crossC} />
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={[
          styles.modalMainViewContainer,
          {
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.white,
          },
        ]}>
        <View
          style={[
            styles.modalMainViewContainer,
            {
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white,
            },
          ]}>
          <Image
            source={{
              uri: getImageUrl(
                productImage?.image?.path?.proxy_url,
                productImage?.image?.path?.image_path,
                '500/500',
              ),
            }}
            style={[styles.cardView, imagestyle]}
            resizeMode={resizeMode}
          />
          <View style={styles.mainView}>
            <View>
              <Text
                numberOfLines={1}
                style={[
                  styles.productName,
                  {
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGrey,
                  },
                ]}>
                {productdetail?.translation[0]?.title}
              </Text>
            </View>

            {plainHtml ? (
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <HTMLView
                  value={
                    plainHtml.startsWith('<p>')
                      ? plainHtml
                      : '<p>' + plainHtml + '</p>'
                  }
                  stylesheet={{p: styles.descriptionStyle}}
                />
              </View>
            ) : null}

            <View
              style={{
                ...commonStyles.headerTopLine,
                marginVertical: moderateScaleVertical(10),
              }}
            />

            {/* ********Addon set View*******  */}
            {addonSetData && addonSetData.length ? showAllAddons() : null}
          </View>
        </View>

        <View style={{height: moderateScaleVertical(100)}} />
      </ScrollView>
      <View
        style={[styles.bottomAddToCartView, {top: viewHeight - height / 10}]}>
        <GradientButton
          colorsArray={[themeColors.primary_color, themeColors.primary_color]}
          textStyle={styles.textStyle}
          onPress={addToCart}
          marginTop={moderateScaleVertical(10)}
          marginBottom={moderateScaleVertical(10)}
          btnText={strings.ADDTOCART}
        />
      </View>
    </Modal>
  );
}
