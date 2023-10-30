import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DeviceInfo from 'react-native-device-info';
import {Pagination} from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import {useSelector} from 'react-redux';
import Banner from '../Components/Banner';
import GradientButton from '../Components/GradientButton';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import commonStylesFun, {hitSlopProp} from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {currencyNumberFormatter} from '../utils/commonFunction';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  hapticEffects,
  playHapticEffect,
  showError,
  showSuccess,
} from '../utils/helperFunctions';
import HtmlViewComp from './HtmlViewComp';
import BannerLoader from './Loaders/BannerLoader';
import HeaderLoader from './Loaders/HeaderLoader';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';

const VariantAddons = ({
  productdetail = {},
  isVisible = false,
  onClose,
  resizeMode = 'contain',
  imagestyle = {},
  showShimmer,
  shimmerClose = () => {},
  updateCartItems,
  taskDetail = null,
}) => {
  // const dine_In_Type = useSelector((state) => state?.home?.dineInType);

  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    productId: productdetail?.id,
    productDetailData: null,
    productPriceData: null,
    variantSet: [],
    addonSet: [],
    relatedProducts: [],
    showListOfAddons: false,
    venderDetail: null,
    productTotalQuantity: 0,
    productSku: null,
    productVariantId: null,
    isVisibleAddonModal: false,
    lightBox: false,
    productQuantityForCart: 1,
    showErrorMessageTitle: false,
    btnLoader: false,
    typeId: null,
    selectedVariant: null,
    selectedOption: null,
    isProductImageLargeViewVisible: false,
    isLoadingC: false,
  });

  const {
    variantSet,
    addonSet,
    productDetailData,
    showErrorMessageTitle,
    productPriceData,
    productTotalQuantity,
    productSku,
    productVariantId,
    productQuantityForCart,
    btnLoader,
    typeId,
    selectedVariant,
    selectedOption,
    isProductImageLargeViewVisible,
    isLoadingC,
  } = state;

  const theme = useSelector(state => state?.initBoot?.themeColor);
  const isDarkMode = theme;
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector(state => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const buttonTextColor = themeColors;
  const commonStyles = commonStylesFun({fontFamily, buttonTextColor});
  // let typeId = productdetail?.category?.category_detail?.type_id;
  console.log(typeId, 'typeId>typeId');
  // !!data?.variant[0]?.quantity || (!!typeId && typeId == 8) ||  !!data?.sell_when_out_of_stock?
  const updateState = data => setState(state => ({...state, ...data}));

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (variantSet.length) {
  //       let variantSetData = variantSet
  //         .map((i, inx) => {
  //           let find = i.options.filter((x) => x.value);
  //           if (find.length) {
  //             return {
  //               variant_id: find[0].variant_id,
  //               optionId: find[0].id,
  //             };
  //           }
  //         })
  //         .filter((x) => x != undefined);
  //       console.log(variantSetData, 'variantSetData callback');
  //       if (variantSetData.length) {
  //         getProductDetailBasedOnFilter(variantSetData);
  //       } else {
  //         getProductDetail();
  //       }
  //     }
  //   }, [productdetail, isVisible]),
  // );
  useFocusEffect(
    React.useCallback(() => {
      getProductDetail();
    }, [productdetail, isVisible]),
  );

  const getProductDetailBasedOnFilter = variantSetData => {
    console.log('api hit getProductDetailBasedOnFilter');
    let data = {};
    data['variants'] = variantSetData.map(i => i.variant_id);
    data['options'] = variantSetData.map(i => i.optionId);
    actions
      .getProductDetailByVariants(`/${productDetailData.sku}`, data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then(res => {
        console.log(res.data, 'res.data by vendor id ');
        updateState({
          productDetailData: res.data,
          productPriceData: {
            multiplier: res.data.multiplier,
            price: res.data.price,
          },
          productSku: res.data.sku,
          productVariantId: res.data.id,
          showErrorMessageTitle: false,
          typeId: res?.data?.products?.category?.category_detail?.type_id,
          isLoadingC: false,
          selectedVariant: null,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = error => {
    console.log(error, 'Error>>>>>');

    if (error?.message?.alert == 1) {
      updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {text: 'Clear Cart', onPress: () => clearCart()},
      ]);
    } else {
      if (error?.data?.variant_empty) {
        updateState({
          isLoading: false,
          showErrorMessageTitle: true,
          isLoadingB: false,
          isLoadingC: false,
          selectedVariant: null,
        });
      } else {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isLoadingC: false,
          selectedVariant: null,
        });
        showError(error?.message || error?.error);
      }
    }
  };

  console.log('type id++', typeId);

  const clearCart = addonSet => {
    // actions
    //   .clearCart(
    //     {},
    //     {
    //       code: appData?.profile?.code,
    //       currency: currencies?.primary_currency?.id,
    //       language: languages?.primary_language?.id,
    //       systemuser: DeviceInfo.getUniqueId(),
    //     },
    //   )
    //   .then((res) => {
    //     actions.cartItemQty(res);
    //     // updateState({
    //     //   cartItems: [],
    //     //   cartData: {},
    //     //   isLoadingB: false,
    //     // });
    //     // addToCart();
    //     if (addonSet) {
    //       // _finalAddToCart(addonSet);
    //     } else {
    //       addToCart();
    //     }
    //     // _finalAddToCart(addonSet);
    //     showSuccess(res?.message);
    //   })
    //   .catch(errorMethod);
  };

  console.log('typeId++', typeId);
  useEffect(() => {
    // getProductDetail();
  }, [productdetail, isVisible]);

  const getProductDetail = () => {
    // let data = {};
    // data['cart_product_id'] = itemToUpdate?.id;
    // data['cart_id'] = itemToUpdate?.cart_id;
    // // data['type'] = dineInType;
    // console.log(data, 'datadatadata');
    // let url = `https://${getHostName(
    //   taskDetail?.order?.call_back_url,
    // )}/edit-order/temp-cart/product/detailWithAddons`;

    // console.log('api hit getProductDetail');
    // actions
    // .getAllAndVariantDetail(url, data, {client: clientInfo?.database_name})
    //   .then(res => {
    //     console.log(res.data, 'res.data++ prodcut detail');
    //     // updateState({
    //     //   productDetailData: res.data.products,
    //     //   relatedProducts: res.data.relatedProducts,
    //     //   productPriceData: res.data.products.variant[0],
    //     //   addonSet: res.data.products.add_on,
    //     //   venderDetail: res.data.products.vendor,
    //     //   productTotalQuantity: res.data.products.variant[0].quantity,
    //     //   productVariantId: res.data.products.variant[0].id,
    //     //   productSku: res.data.products.sku,
    //     //   variantSet: res.data.products.variant_set,
    //     //   typeId: res?.data?.products?.category?.category_detail?.type_id,
    //     //   isLoadingC: false,
    //     //   selectedVariant: null,
    //     //   productQuantityForCart: !!res.data.products?.minimum_order_count
    //     //     ? Number(res.data.products?.minimum_order_count)
    //     //     : 1,
    //     // });
    //     shimmerClose(false);
    //   })
    //   .catch(error => {
    //     console.log('error raised', error);
    //     updateState({
    //       selectedVariant: null,
    //       isLoadingC: false,
    //     });
    //   });
  };

  const selectSpecificOptionsForAddions = (options, i, inx) => {
    let newArray = cloneDeep(options);
    console.log(i, 'i>>>i');
    console.log(newArray, 'newArray>>>newArray');
    console.log(addonSet, 'add on set');
    let find = addonSet.find(x => x?.addon_id == i?.addon_id);
    console.log(find, 'find>>>find');

    updateState({
      addonSet: addonSet.map((vi, vnx) => {
        if (vi.addon_id == i.addon_id) {
          return {
            ...vi,
            setoptions: newArray.map((j, jnx) => {
              if (vi?.max_select > 1) {
                let incrementedValue = 0;
                newArray.forEach(e => {
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

  const checkBoxButtonViewAddons = ({setoptions}) => {
    return (
      <View>
        {setoptions.map((i, inx) => {
          return (
            <TouchableOpacity
              key={inx}
              activeOpacity={1}
              onPress={() => {
                playHapticEffect(hapticEffects.rigid);
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
                  style={{
                    ...styles.variantValue,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
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
                    style={{tintColor: themeColors.primary_color}}
                    source={
                      i?.value
                        ? imagePath.checkBox2Active
                        : imagePath.checkBox2InActive
                    }
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
    let variantSetData = cloneDeep(addonSet);
    return (
      <>
        <View
          style={{
            marginTop: moderateScaleVertical(5),
          }}>
          {variantSetData.map((i, inx) => {
            return (
              <View
                key={inx}
                style={{
                  marginVertical: moderateScaleVertical(5),
                }}>
                <Text
                  style={{
                    ...styles.variantLable,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGrey,
                  }}>
                  {i?.title}
                </Text>

                <Text
                  style={{
                    ...styles.chooseOption,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.grayOpacity51,
                    fontSize: textScale(10),
                  }}>
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

  const showhomeServiceAddons = () => {
    let variantSetData = cloneDeep(addonSet);
    return (
      <>
        <View
          style={{
            marginTop: moderateScaleVertical(5),
          }}>
          {variantSetData.map((i, inx) => {
            return (
              <View
                key={inx}
                style={{
                  marginVertical: moderateScaleVertical(5),
                }}>
                <Text
                  style={{
                    ...styles.variantLable,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGrey,
                  }}>
                  {i?.title}
                </Text>
                <Text
                  style={{
                    ...styles.chooseOption,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.grayOpacity51,
                  }}>
                  {strings.PLS_SELECT_ONE}
                </Text>
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

  const selectSpecificOptions = (options, i, inx) => {
    let newArray = cloneDeep(options);
    let modifyVariants = variantSet.map((vi, vnx) => {
      if (vi.variant_type_id == i.variant_id) {
        return {
          ...vi,
          options: newArray.map((j, jnx) => {
            if (j.id == i.id) {
              return {
                ...j,
                value: true,
              };
            }
            return {
              ...j,
              value: false,
            };
          }),
        };
      } else {
        return vi;
      }
    });
    updateState({
      variantSet: modifyVariants,
      selectedOption: i,
    });
  };

  const onSelect = () => {
    if (variantSet.length) {
      let variantSetData = variantSet
        .map((i, inx) => {
          let find = i.options.filter(x => x.value);
          if (find.length) {
            return {
              variant_id: find[0].variant_id,
              optionId: find[0].id,
            };
          }
        })
        .filter(x => x != undefined);
      console.log(variantSetData, 'variantSetData callback');
      if (variantSetData.length) {
        updateState({isLoadingC: true});
        getProductDetailBasedOnFilter(variantSetData);
      } else {
        getProductDetail();
      }
    }
  };

  const variantSetValue = item => {
    const {options, type, variant_type_id} = item;
    console.log('variantSetValuevariantSetValue', variant_type_id);
    if (type == 1) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => updateState({selectedVariant: item})}
            style={{
              ...styles.dropDownStyle,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.blackOpacity05,
            }}>
            <Text
              style={{
                fontSize: moderateScale(12),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {options.filter(val => {
                if (val?.value) {
                  return val;
                }
              })[0]?.title || strings.SELECT + ' ' + item?.title}
            </Text>
            <Image source={imagePath.dropDownSingle} />
          </TouchableOpacity>
          {selectedVariant?.variant_type_id == variant_type_id
            ? radioButtonView(options)
            : null}
        </View>
      );
    }
    return (
      <View>
        <TouchableOpacity
          onPress={() => updateState({selectedVariant: item})}
          style={{
            ...styles.dropDownStyle,
            backgroundColor: isDarkMode
              ? colors.whiteOpacity22
              : colors.blackOpacity05,
          }}>
          <Text
            style={{
              fontSize: moderateScale(12),
              fontFamily: fontFamily.medium,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {options.filter(val => {
              if (val?.value) {
                return val;
              }
            })[0]?.title || strings.SELECT + ' ' + item?.title}
          </Text>
          <Image source={imagePath.dropDownSingle} />
        </TouchableOpacity>

        {selectedVariant?.variant_type_id == variant_type_id
          ? circularView(options)
          : null}
      </View>
    );
  };

  const radioButtonView = options => {
    return (
      <Modal
        key={'1'}
        isVisible
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onBackdropPress={() => updateState({selectedVariant: null})}>
        <View
          style={{
            ...styles.modalView,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: moderateScale(18),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.SELECT} {selectedVariant?.title}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => updateState({selectedVariant: null})}>
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.horizontalLine,
              borderBottomColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.lightGreyBg,
            }}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((i, inx) => {
              return (
                <TouchableOpacity
                  key={inx}
                  // disabled={options && options.length == 1 ? true : false}
                  onPress={() => selectSpecificOptions(options, i, inx)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // marginRight: moderateScale(16),
                    marginBottom: moderateScaleVertical(10),
                  }}>
                  <Image
                    source={
                      i?.value
                        ? imagePath.icActiveRadio
                        : imagePath.icInActiveRadio
                    }
                    style={{
                      tintColor: themeColors.primary_color,
                      marginRight: moderateScale(16),
                    }}
                  />
                  <Text
                    style={{
                      ...styles.variantValue,
                      color: i?.value
                        ? themeColors.primary_color
                        : isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.blackOpacity43,
                      fontSize: textScale(14),
                      fontFamily: i.value
                        ? fontFamily.bold
                        : fontFamily.regular,
                    }}>
                    {i?.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <GradientButton
            indicator={isLoadingC}
            indicatorColor={colors.white}
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={{
              fontFamily: fontFamily.medium,
              textTransform: 'capitalize',
              color: colors.white,
            }}
            onPress={onSelect}
            btnText={strings.SELECT}
            btnStyle={{
              borderRadius: moderateScale(4),
              height: moderateScale(38),
            }}
          />
        </View>
      </Modal>
    );
  };

  const circularView = options => {
    return (
      <Modal
        key={'2'}
        isVisible
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onBackdropPress={() => updateState({selectedVariant: null})}>
        <View
          style={{
            ...styles.modalView,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: moderateScale(18),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.SELECT} {selectedVariant?.title}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => updateState({selectedVariant: null})}>
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.horizontalLine,
              borderBottomColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.lightGreyBg,
            }}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((i, inx) => {
              return (
                <TouchableOpacity
                  key={inx}
                  // disabled={options && options.length == 1 ? true : false}
                  onPress={() => selectSpecificOptions(options, i, inx)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: moderateScale(5),
                    marginBottom: moderateScaleVertical(10),
                  }}
                  activeOpacity={0.8}>
                  <View
                    style={[
                      styles.variantSizeViewTwo,
                      {
                        backgroundColor: colors.white,
                        borderWidth: i?.value ? 1 : 0,

                        borderColor:
                          i?.value &&
                          (i.hexacode == '#FFFFFF' || i.hexacode == '#FFF')
                            ? colors.textGrey
                            : i.hexacode,
                      },
                    ]}>
                    <View
                      style={[
                        styles.variantSizeViewOne,
                        {
                          backgroundColor: i.hexacode,
                          borderWidth:
                            i.hexacode == '#FFFFFF' || i.hexacode == '#FFF'
                              ? StyleSheet.hairlineWidth
                              : 0,
                        },
                      ]}></View>
                  </View>
                  <Text
                    style={{
                      ...styles.variantValue,
                      color: i?.value
                        ? themeColors.primary_color
                        : isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.blackOpacity43,
                      fontSize: textScale(14),
                      fontFamily: i.value
                        ? fontFamily.bold
                        : fontFamily.regular,
                      marginLeft: moderateScale(8),
                    }}>
                    {i?.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <GradientButton
            indicator={isLoadingC}
            indicatorColor={colors.white}
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={{
              fontFamily: fontFamily.medium,
              textTransform: 'capitalize',
              color: colors.white,
            }}
            onPress={onSelect}
            btnText={strings.SELECT}
            btnStyle={{
              borderRadius: moderateScale(4),
              height: moderateScale(38),
            }}
          />
        </View>
      </Modal>
    );
  };

  const {bannerRef} = useRef();

  console.log('variantSetvariantSet', variantSet);

  const renderVariantSet = ({item, index}) => {
    return (
      <View
        key={String(index)}
        style={{
          flex: 1,
          marginRight: moderateScale(8),
        }}>
        <Text
          style={{
            ...styles.variantLable,
            marginBottom: moderateScale(5),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>{`${item?.title}`}</Text>
        {item?.options ? variantSetValue(item) : null}
      </View>
    );
  };

  const showAllVariants = () => {
    let variantSetData = cloneDeep(variantSet);
    return (
      <View
        style={{
          marginVertical: moderateScaleVertical(12),
          paddingHorizontal: moderateScale(0),
        }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          numColumns={2}
          data={!!variantSetData ? variantSetData : []}
          renderItem={renderVariantSet}
          keyExtractor={item => item?.variant_type_id.toString()}
        />
      </View>
    );
  };

  const checkIfMaxReached = (minVal, Arr) => {
    const SelectedItems = Arr.filter(el => el.value);
    if (SelectedItems.length >= minVal) {
      return true;
    }
    return false;
  };

  var totalProductQty = 0;
  if (!!productdetail?.check_if_in_cart_app) {
    productdetail?.check_if_in_cart_app.map(val => {
      totalProductQty = totalProductQty + val.quantity;
    });
  }

  const addToCart = addonSet => {
    playHapticEffect(hapticEffects.rigid);
    console.log('add on set', addonSet);
    const addon_ids = [];
    const addon_options = [];

    addonSet.map((i, inx) => {
      const temp = checkIfMaxReached(i.min_select, i.setoptions);
      console.log('temp value', temp);
      if (temp) {
        i.setoptions.map((j, jnx) => {
          if (j?.value == true) {
            addon_ids.push(j?.addon_id);
            addon_options.push(j?.id);
          }
        });
        let CloneArr = addonSet;
        CloneArr[inx] = {...CloneArr[inx], errorShow: false};
        updateState({addonSet: CloneArr});
      } else {
        let CloneArr = addonSet;
        CloneArr[inx] = {...CloneArr[inx], errorShow: true};
        updateState({addonSet: CloneArr});
      }
    });

    const checkIsError = addonSet.findIndex(el => el.errorShow);
    let data = {};
    if (checkIsError == -1) {
      data['sku'] = productSku;
      data['quantity'] = productQuantityForCart;
      data['product_variant_id'] = productVariantId;
      data['type'] = dine_In_Type;
      if (addonSet && addonSet.length) {
        // console.log(addonSetData, 'addonSetData');
        data['addon_ids'] = addon_ids;
        data['addon_options'] = addon_options;
      }
      console.log(data, 'data for cart');
      updateState({btnLoader: true});
      actions
        .addProductsToCart(data, {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then(async res => {
          actions.cartItemQty(res);
          showSuccess(strings.PRODUCT_ADDED_SUCCESS);
          updateCartItems(
            productdetail,
            res.data.product_total_qty_in_cart, ////localy update cart quanity
            res.data.cart_product_id,
            res.data.id,
          );
          updateState({isLoadingC: false, btnLoader: false});
          // onClose();
        })
        .catch(error => errorMethodSecond(error, addonSet));
      return;
    }
  };

  const errorMethodSecond = (error, addonSet) => {
    console.log(error.message.alert, 'Error>>>>>');

    if (error?.message?.alert == 1) {
      updateState({
        isLoading: false,
        isLoadingB: false,
        isLoadingC: false,
        btnLoader,
      });
      // showError(error?.message?.error || error?.error);
      // Alert.alert('', error?.message?.error, [
      //   {
      //     text: 'Cancel',
      //     onPress: () => console.log('Cancel Pressed'),
      //     // style: 'destructive',
      //   },
      //   { text: 'Clear Cart', onPress: () => clearCart(addonSet) },
      // ]);
    } else {
      updateState({
        isLoading: false,
        isLoadingB: false,
        isLoadingC: false,
        btnLoader: false,
      });
      showError(error?.message || error?.error);
    }
  };

  const shimmerShow = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? MyDarkTheme.colors.background : '#fff',
          borderTopLeftRadius: 0,
          borderTopStartRadius: 0,
          // backgroundColor:'red'
        }}>
        <BannerLoader
          isBannerDots
          homeLoaderWidth={width}
          homeLoaderHeight={moderateScaleVertical(190)}
          viewStyles={{
            marginHorizontal: 0,
          }}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(80)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={moderateScale(80)}
          rectHeightLeft={moderateScaleVertical(10)}
          rx={5}
          ry={5}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(60)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={moderateScale(60)}
          rectHeightLeft={moderateScaleVertical(10)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={width - moderateScale(30)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={width - moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(10)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(12)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={width}
          heightLeft={moderateScaleVertical(2)}
          rectWidthLeft={width}
          rectHeightLeft={moderateScaleVertical(2)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(12)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(30)}
          heightLeft={moderateScaleVertical(7)}
          rectWidthLeft={moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(7)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          widthLeft={moderateScale(60)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={moderateScale(60)}
          rectHeightLeft={moderateScaleVertical(10)}
          widthRight={moderateScale(60)}
          heightRight={moderateScaleVertical(10)}
          rectWidthRight={moderateScale(60)}
          rectHeightRight={moderateScaleVertical(10)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          widthLeft={moderateScale(60)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={moderateScale(60)}
          rectHeightLeft={moderateScaleVertical(10)}
          widthRight={moderateScale(60)}
          heightRight={moderateScaleVertical(10)}
          rectWidthRight={moderateScale(60)}
          rectHeightRight={moderateScaleVertical(10)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(30)}
          heightLeft={moderateScaleVertical(7)}
          rectWidthLeft={moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(7)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(30)}
          heightLeft={moderateScaleVertical(7)}
          rectWidthLeft={moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(7)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />

        <HeaderLoader
          isRight={false}
          widthLeft={width}
          heightLeft={moderateScaleVertical(2)}
          rectWidthLeft={width}
          rectHeightLeft={moderateScaleVertical(2)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(15)}}
        />
        <HeaderLoader
          widthLeft={moderateScale(80)}
          heightLeft={moderateScaleVertical(30)}
          rectWidthLeft={moderateScale(80)}
          rectHeightLeft={moderateScaleVertical(30)}
          widthRight={width - moderateScale(130)}
          heightRight={moderateScaleVertical(30)}
          rectWidthRight={width - moderateScale(130)}
          rectHeightRight={moderateScaleVertical(30)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: 'auto',
            marginBottom: moderateScaleVertical(25),
          }}
        />
      </View>
    );
  };

  const productIncrDecreamentForCart = type => {
    playHapticEffect(hapticEffects.rigid);
    let quantityToIncreaseDecrease = !!productDetailData?.batch_count
      ? Number(productDetailData?.batch_count)
      : 1;

    if (type == 2) {
      let limitOfMinimumQuantity = !!productDetailData?.minimum_order_count
        ? Number(productDetailData?.minimum_order_count)
        : 1;
      if (productQuantityForCart <= limitOfMinimumQuantity) {
        onClose();
      } else {
        updateState({
          productQuantityForCart:
            productQuantityForCart - quantityToIncreaseDecrease,
        });
      }
    } else if (type == 1) {
      if (productQuantityForCart == productTotalQuantity) {
        showError(strings.MAXIMUM_LIMIT_REACHED);
      } else {
        updateState({
          productQuantityForCart:
            productQuantityForCart + quantityToIncreaseDecrease,
        });
      }
    }
  };

  const getAdditionalPriceOfAddons = () => {
    // console.log(
    //   'productPriceDataproductPriceDataproductPriceData>>>',
    //   productQuantityForCart,
    // );
    let addOnsAdditionalPrice = 0;
    if (addonSet && addonSet[0]) {
      addonSet[0].setoptions.forEach(el => {
        if (el.value) {
          addOnsAdditionalPrice = addOnsAdditionalPrice + Number(el.price);
        }
      });
    }
    addOnsAdditionalPrice = currencyNumberFormatter(
      (
        Number(productPriceData?.multiplier) *
          Number(productPriceData?.price) *
          productQuantityForCart +
        addOnsAdditionalPrice
      ).toFixed(2),
    );
    return addOnsAdditionalPrice;
  };

  const allImagesArrayForZoom = [];
  productDetailData?.product_media
    ? productDetailData?.product_media?.map((item, index) => {
        return (allImagesArrayForZoom[index] = {
          url: getImageUrl(
            item?.image.path.image_fit,
            item?.image.path.image_path,
            '1000/1000',
          ),
        });
      })
    : getImageUrl(
        productDetailData?.product_media[0]?.image?.path?.image_fit,
        productDetailData?.product_media[0]?.image?.path?.image_path,
        '1000/1000',
      );

  const renderImageZoomingView = () => {
    return (
      <View
        style={{
          height: moderateScaleVertical(height),
          width: moderateScale(width),
        }}>
        <ImageViewer
          renderHeader={() => <View style={{backgroundColor: 'red'}}></View>}
          renderIndicator={(currentIndex, allSize) => (
            <View
              style={{
                position: 'absolute',
                top: 100,
                width: width / 2,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() =>
                  updateState({
                    isProductImageLargeViewVisible: false,
                  })
                }>
                <Image
                  style={{
                    tintColor: colors.white,
                    marginHorizontal: moderateScale(20),
                  }}
                  source={imagePath.backArrow}
                />
              </TouchableOpacity>
              <Text style={{color: colors.white}}>
                {currentIndex + '/' + allSize}
              </Text>
            </View>
          )}
          imageUrls={allImagesArrayForZoom}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {/* <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Image source={imagePath.crossC} />
      </TouchableOpacity> */}
      {showShimmer ? (
        shimmerShow()
      ) : (
        <Animatable.View style={{flex: 1}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            // onScroll={onScroll}
            style={{
              ...styles.modalMainViewContainer,
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : '#fff',
            }}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Banner
                bannerRef={bannerRef}
                bannerData={productDetailData?.product_media}
                sliderWidth={width}
                itemWidth={width}
                pagination={false}
                setActiveState={index =>
                  updateState({slider1ActiveSlide: index})
                }
                showLightbox={true}
                cardViewStyle={styles.cardViewStyle}
                onPressImage={() =>
                  updateState({
                    isProductImageLargeViewVisible: true,
                  })
                }
                // resizeMode="contain"
              />
              <View style={{paddingTop: 5}}>
                <Pagination
                  dotsLength={productDetailData?.product_media?.length}
                  activeDotIndex={state.slider1ActiveSlide}
                  dotColor={'grey'}
                  dotStyle={[styles.dotStyle]}
                  inactiveDotColor={'black'}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.8}
                />
              </View>
            </View>
            {/* <ImageBackground
            source={{
              uri: getImageUrl(
                productImage?.image?.path?.image_fit,
                productImage?.image?.path?.image_path,
                '400/400',
              ),
            }}
            style={[styles.cardView, imagestyle]}
            resizeMode={resizeMode}
          /> */}
            <Animatable.View
              delay={1}
              animation="fadeInUp"
              style={styles.mainView}>
              <View>
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.productName,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    fontFamily: fontFamily.bold,
                  }}>
                  {productdetail?.translation[0]?.title}
                </Text>

                {/* rating View */}
                {productDetailData?.averageRating !== null && (
                  <View
                    style={{
                      borderWidth: 0.5,
                      alignSelf: 'flex-start',
                      padding: 2,
                      borderRadius: 2,
                      marginVertical: moderateScaleVertical(4),
                      borderColor: colors.yellowB,
                      backgroundColor: colors.yellowOpacity10,
                    }}>
                    <StarRating
                      // disabled={false}
                      maxStars={5}
                      rating={Number(productDetailData?.averageRating).toFixed(
                        1,
                      )}
                      fullStarColor={colors.yellowB}
                      starSize={8}
                      containerStyle={{width: width / 9}}
                    />
                  </View>
                )}
              </View>
              <View style={{justifyContent: 'center'}}>
                {!!typeId && typeId !== 8 && (
                  <Text
                    style={{
                      color:
                        (productTotalQuantity && productTotalQuantity != 0) ||
                        !!productDetailData?.sell_when_out_of_stock
                          ? colors.green
                          : colors.orangeB,
                      fontSize: textScale(10),
                      fontFamily: fontFamily.medium,
                    }}>
                    {(productTotalQuantity && productTotalQuantity != 0) ||
                    !!productDetailData?.sell_when_out_of_stock ||
                    productDetailData?.has_inventory == 0
                      ? ''
                      : strings.OUT_OF_STOCK}
                  </Text>
                )}
              </View>

              {productdetail?.translation[0]?.body_html != null && (
                <View>
                  <HtmlViewComp
                    plainHtml={productdetail?.translation[0]?.body_html}
                  />
                  <View style={{marginBottom: 10}} />
                </View>
              )}

              <View
                style={{
                  ...commonStyles.headerTopLine,
                  marginTop: moderateScaleVertical(8),
                  // marginVertical: moderateScaleVertical(10),
                }}
              />
              {/* ********Addon set View*******  */}
              {!!addonSet && addonSet?.length ? showAllAddons() : null}

              {!!variantSet && variantSet?.length ? showAllVariants() : null}
            </Animatable.View>
            {showErrorMessageTitle ? (
              <Text
                style={{
                  fontSize: textScale(14),
                  marginHorizontal: moderateScale(20),
                  color: colors.redB,
                  fontFamily: fontFamily.medium,
                  marginBottom: moderateScaleVertical(20),
                }}>
                {strings.NOVARIANTPRODUCTAVAILABLE}
              </Text>
            ) : null}
          </ScrollView>

          {!!(
            productDetailData?.has_inventory == 0 ||
            (!showErrorMessageTitle && productTotalQuantity > 0) ||
            (!!typeId && typeId == 8) ||
            !!productDetailData?.sell_when_out_of_stock
          ) ? (
            <View>
              {true ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: moderateScale(16),
                    paddingBottom: moderateScaleVertical(16),
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.background
                      : '#fff',
                  }}>
                  {!showErrorMessageTitle && (
                    <View style={{flex: 0.25}}>
                      <View
                        style={{
                          ...commonStyles.buttonRect,
                          ...styles.incDecBtnStyle,
                          backgroundColor: getColorCodeWithOpactiyNumber(
                            themeColors.primary_color.substr(1),
                            15,
                          ),
                          borderColor: themeColors?.primary_color,
                          height: moderateScale(38),
                        }}
                        // onPress={onPress}
                      >
                        <TouchableOpacity
                          onPress={() => productIncrDecreamentForCart(2)}
                          hitSlop={hitSlopProp}>
                          <Text
                            style={{
                              ...commonStyles.mediumFont14,
                              color: themeColors?.primary_color,
                              fontFamily: fontFamily.bold,
                            }}>
                            -
                          </Text>
                        </TouchableOpacity>
                        <Text
                          style={{
                            ...commonStyles.mediumFont14,
                            color: isDarkMode
                              ? MyDarkTheme.colors.text
                              : colors.black,
                          }}>
                          {productQuantityForCart}
                        </Text>
                        <TouchableOpacity
                          onPress={() => productIncrDecreamentForCart(1)}
                          hitSlop={hitSlopProp}>
                          <Text
                            style={{
                              ...commonStyles.mediumFont14,
                              color: themeColors?.primary_color,
                              fontFamily: fontFamily.bold,
                            }}>
                            +
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  <View style={{marginHorizontal: 8}} />
                  {!showErrorMessageTitle && (
                    <View
                      pointerEvents={btnLoader ? 'none' : 'auto'}
                      style={{flex: 0.75}}>
                      <GradientButton
                        indicator={btnLoader}
                        indicatorColor={colors.white}
                        colorsArray={[
                          themeColors.primary_color,
                          themeColors.primary_color,
                        ]}
                        textStyle={{
                          fontFamily: fontFamily.medium,
                          textTransform: 'capitalize',
                          color: colors.white,
                        }}
                        onPress={() => addToCart(addonSet)}
                        btnText={`${strings.ADD_ITEM} - ${
                          currencies?.primary_currency?.symbol
                        } ${getAdditionalPriceOfAddons()}`}
                        btnStyle={{
                          borderRadius: moderateScale(4),
                          height: moderateScale(38),
                        }}
                      />
                    </View>
                  )}
                </View>
              ) : null}
            </View>
          ) : null}
          <View style={{height: moderateScale(100)}} />
        </Animatable.View>
      )}
      <Modal
        isVisible={isProductImageLargeViewVisible}
        style={{
          height: height,
          width: width,
          margin: 0,
        }}
        animationInTiming={600}>
        {renderImageZoomingView()}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  productName: {
    color: colors.textGrey,
    fontSize: textScale(18),
    lineHeight: 28,
    fontFamily: fontFamily.medium,
  },
  description: {
    color: colors.textGreyB,
    fontSize: textScale(14),
    lineHeight: 22,
    fontFamily: fontFamily.medium,
  },
  relatedProducts: {
    color: colors.textGrey,
    fontSize: textScale(18),
    lineHeight: 28,
    fontFamily: fontFamily.medium,
    marginVertical: moderateScaleVertical(10),
  },

  variantLable: {
    color: colors.textGrey,
    fontSize: textScale(12),
    // lineHeight: 22,
    fontFamily: fontFamily.medium,
  },

  modalMainViewContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // overflow: 'hidden',
    // paddingHorizontal: moderateScale(24),
  },
  modalContainer: {
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: moderateScaleVertical(height / 10),
    overflow: 'hidden',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: moderateScaleVertical(10),
  },
  imageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  cardView: {
    height: height / 3.8,
    width: width,
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  productName: {
    color: colors.textGrey,
    fontSize: textScale(14),
    // lineHeight: 28,
    fontFamily: fontFamily.regular,
  },
  mainView: {
    marginVertical: moderateScaleVertical(15),
    paddingHorizontal: moderateScale(12),
  },
  description: {
    color: colors.textGreyB,
    fontSize: textScale(14),
    lineHeight: 22,
    fontFamily: fontFamily.regular,
    textAlign: 'left',
  },
  variantValue: {
    color: colors.black,
    fontSize: textScale(10),
    lineHeight: 22,
    fontFamily: fontFamily.regular,
    paddingRight: moderateScale(4),
  },

  chooseOption: {
    marginBottom: moderateScale(2),
    color: colors.textGreyF,
    fontSize: textScale(9),
    lineHeight: 22,
    fontFamily: fontFamily.regular,
  },
  incDecBtnStyle: {
    borderWidth: 0.4,
    borderRadius: moderateScale(4),
    height: moderateScale(38),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(12),
  },
  variantSizeViewOne: {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: moderateScale(30 / 2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  variantSizeViewTwo: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(40 / 2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardViewStyle: {
    alignItems: 'center',
    height: width * 0.6,
    width: width,
    // marginRight: 20
  },
  dotStyle: {height: 12, width: 12, borderRadius: 12 / 2},
  ratingColor: {
    color: colors.backgroundGrey,
    paddingLeft: 5,
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
  },
  dropDownStyle: {
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateScaleVertical(2),
  },
  modalView: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScaleVertical(16),
    paddingBottom: moderateScaleVertical(16),
    borderTopLeftRadius: moderateScale(12),
    borderTopRightRadius: moderateScale(12),
  },
  horizontalLine: {
    width: '100%',
    borderBottomWidth: 1.5,
    marginVertical: moderateScaleVertical(8),
  },
});
export default React.memo(VariantAddons);
