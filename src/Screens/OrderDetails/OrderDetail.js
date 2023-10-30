import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import LeftRightText from '../../Components/LeftRightText';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import {navigate} from '../../navigation/NavigationService';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {currencyNumberFormatter} from '../../utils/commonFunction';
import {getImageUrl, showError} from '../../utils/helperFunctions';
import {stylesFunc} from './styles';

export default function OrderDetail({route, navigation}) {
  const {userData} = useSelector(state => state?.auth);
  const {defaultLanguage} = useSelector(state => state?.initBoot);
  const styles = stylesFunc({defaultLanguage});

  let paramData = route?.params?.data?.item;
  let taskDetail = route?.params?.data?.taskDetail;
  let apiData = route?.params?.data?.apiData;
  let fromNotification = route?.params?.data?.fromNotification;

  const [state, setState] = useState({
    allVendorsData: [],
    cartData: {},
    isLoading: false,
  });
  const {allVendorsData, cartData, isLoading} = state;
  const updateState = data => setState(state => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };
  const new_dispatch_traking_url = paramData
    ? paramData.replace(
        '/dispatch-order-status-update/',
        '/dispatch-order-status-update-details/',
      )
    : null;

  useEffect(() => {
    if (new_dispatch_traking_url) {
      updateState({
        isLoading: true,
      });
      _getproductUpdateDetails();
    }
  }, []);

  const _getproductUpdateDetails = () => {
    actions
      .getProductUpdateDetails(new_dispatch_traking_url, {})
      .then(res => {
        console.log(res, '_getproductUpdateDetails');
        updateState({
          allVendorsData: res?.data?.vendors,
          cartData: res?.data,
          isLoading: false,
        });
      })
      .catch(err => {
        console.log(err, 'errroror');
        showError(err.message || err.error);
        updateState({
          isLoading: false,
        });
      });
  };

  console.log(userData, 'userData........');

  const _renderItem = ({item, index}) => {
    return (
      <View
        style={{
          backgroundColor: colors.white,
          marginHorizontal: moderateScale(10),
          marginVertical: moderateScale(10),
        }}>
        <View style={styles.vendorView}>
          <Text style={styles.vendorText}>{item?.vendor_name}</Text>
        </View>
        <View style={{paddingHorizontal: moderateScale(10)}}>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(12),
              textAlign: defaultLanguage?.value == 'ar' ? 'right' : 'left',
              marginHorizontal:
                defaultLanguage?.value == 'ar' ? moderateScale(20) : 0,
            }}>
            {strings.VENDOR}
          </Text>
        </View>

        {item?.products.length
          ? item?.products.map((i, inx) => {
              if (item?.vendor_id == i?.vendor_id) {
                return (
                  <View key={inx}>
                    <View style={[styles.cartItemMainContainer]}>
                      <View style={styles.cartItemImage}>
                        <Image
                          source={
                            i?.image_path
                              ? {
                                  uri: getImageUrl(
                                    i?.image_path?.image_fit,
                                    i?.image_path?.image_path,
                                    '300/300',
                                  ),
                                }
                              : ''
                          }
                          style={styles.imageStyle}
                        />
                      </View>

                      <View style={styles.cartItemDetailsCon}>
                        <View
                          style={{
                            flexDirection:
                              defaultLanguage?.value == 'ar'
                                ? 'row-reverse'
                                : 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              flex: 0.7,
                              justifyContent: 'center',
                              alignItems:
                                defaultLanguage?.value == 'ar'
                                  ? 'flex-end'
                                  : 'flex-start',
                            }}>
                            <Text
                              numberOfLines={2}
                              style={[styles.priceItemLabel2, {opacity: 0.8}]}>
                              {i?.product_name}
                            </Text>
                            {i?.variant_options.length
                              ? i?.variant_options.map((j, jnx) => {
                                  return (
                                    <View
                                      style={{
                                        flexDirection:
                                          defaultLanguage?.value == 'ar'
                                            ? 'row-reverse'
                                            : 'row',
                                      }}>
                                      <Text
                                        style={styles.cartItemWeight2}
                                        numberOfLines={1}>
                                        {j.title}{' '}
                                      </Text>
                                      <Text
                                        style={styles.cartItemWeight2}
                                        numberOfLines={
                                          1
                                        }>{`(${j.option})`}</Text>
                                    </View>
                                  );
                                })
                              : null}
                          </View>

                          <View
                            style={{
                              flex: 0.5,
                              justifyContent: 'center',

                              alignItems:
                                defaultLanguage?.value == 'ar'
                                  ? 'flex-start'
                                  : 'flex-end',
                            }}>
                            <Text style={styles.cartItemPrice}>
                              {userData?.client_preference?.currency?.symbol}
                              {Number(i?.price * i?.quantity).toFixed(2)}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection:
                              defaultLanguage?.value == 'ar'
                                ? 'row-reverse'
                                : 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View style={{flex: 0.5, justifyContent: 'center'}}>
                            {i?.quantity && (
                              <View
                                style={{
                                  flexDirection:
                                    defaultLanguage?.value == 'ar'
                                      ? 'row-reverse'
                                      : 'row',
                                }}>
                                <Text
                                  style={{
                                    color: colors.textGrey,
                                    fontSize: textScale(14),
                                  }}>
                                  {strings.QTY}
                                </Text>
                                <Text style={styles.cartItemWeight}>
                                  {` ${i?.quantity} X ${Number(i?.price)}`}
                                </Text>
                              </View>
                            )}
                            {!!i?.product_addons.length && (
                              <View>
                                <Text style={styles.cartItemWeight2}>
                                  {strings.EXTRA}
                                </Text>
                              </View>
                            )}
                            {i?.product_addons.length
                              ? i?.product_addons.map((j, jnx) => {
                                  return (
                                    <View>
                                      <Text
                                        style={styles.cartItemWeight2}
                                        numberOfLines={1}>
                                        {j.addon_title}{' '}
                                      </Text>
                                      <View style={{flexDirection: 'row'}}>
                                        <Text
                                          style={styles.cartItemWeight2}
                                          numberOfLines={
                                            1
                                          }>{`(${j.option_title})`}</Text>
                                        <Text
                                          style={styles.cartItemWeight2}
                                          numberOfLines={1}>{` ${Number(
                                          j?.quantity_price,
                                        ).toFixed(2)}`}</Text>
                                      </View>
                                    </View>
                                  );
                                })
                              : null}
                          </View>
                        </View>
                      </View>
                    </View>

                    {!!paramData?.showRating ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingBottom: moderateScaleVertical(5),
                          paddingHorizontal: moderateScale(10),
                        }}>
                        <StarRating
                          disabled={false}
                          maxStars={5}
                          rating={Number(i?.product_rating?.rating)}
                          // selectedStar={(rating) =>
                          //   onStarRatingPress(i, rating)
                          // }
                          fullStarColor={colors.ORANGE}
                          starSize={15}
                        />
                      </View>
                    ) : null}

                    <View style={styles.dashedLine} />
                  </View>
                );
              } else {
                null;
              }
            })
          : null}

        {!!Number(item?.discount_amount) && (
          <View style={styles.itemPriceDiscountTaxView}>
            <Text style={styles.priceItemLabel}>{strings.DISCOUNT}</Text>
            <Text style={styles.priceItemLabel}>
              {item?.discount_amount > 0 &&
                Number(item?.discount_amount).toFixed()}
            </Text>
          </View>
        )}
        {/* {Number(item?.delivery_fee) > 0 && (
          <View style={styles.itemPriceDiscountTaxView}>
            <Text style={styles.priceItemLabel}>{strings.DELIVERYFEE}</Text>
            <Text style={styles.priceItemLabel}>
              {item?.delivery_fee > 0 && Number(item?.delivery_fee).toFixed(2)}
            </Text>
          </View>
        )} */}
        {/* <View style={styles.itemPriceDiscountTaxView}>
          <Text style={styles.priceItemLabel2}>{strings.AMOUNT}</Text>
          <Text style={styles.priceItemLabel2}>
            {item?.payable_amount ? Number(item?.payable_amount).toFixed(2) : 0}
          </Text>
        </View> */}
      </View>
    );
  };

  const orderAmountDetail = () => {
    return (
      <View style={styles.priceSection}>
        <Text style={styles.price}>{strings.PAYMENTSUMMERY}</Text>
        <View
          style={[
            styles.bottomTabLableValue,
            // {marginTop: moderateScaleVertical(10)},
          ]}>
          <Text style={styles.priceItemLabel}>{strings.SUBTOTAL}</Text>
          <Text style={styles.priceItemLabel}>
            {userData?.client_preference?.currency?.symbol}
            {cartData?.total_amount > 0 &&
              Number(cartData?.total_amount).toFixed(2)}
          </Text>
        </View>
        {cartData?.wallet_amount_used > 0 && (
          <View style={styles.bottomTabLableValue}>
            <Text style={styles.priceItemLabel}>{strings.WALLET}</Text>
            <Text style={styles.priceItemLabel}>
              -{userData?.client_preference?.currency?.symbol}
              {cartData?.wallet_amount_used > 0 &&
                Number(cartData?.wallet_amount_used).toFixed(2)}
            </Text>
          </View>
        )}
        {Number(cartData?.fixed_fee_amount) > 0 && (
          <View style={styles.bottomTabLableValue}>
            <Text style={styles.priceItemLabel}>{strings.FIXED_FEE}</Text>
            <Text style={styles.priceItemLabel}>
              {userData?.client_preference?.currency?.symbol}
              {cartData?.fixed_fee_amount > 0 &&
                Number(cartData?.fixed_fee_amount).toFixed(2)}
            </Text>
          </View>
        )}
        {cartData?.total_delivery_fee > 0 && (
          <View style={styles.bottomTabLableValue}>
            <Text style={styles.priceItemLabel}>{strings.DELIVERYFEE}</Text>
            <Text style={styles.priceItemLabel}>
              {userData?.client_preference?.currency?.symbol}
              {cartData?.total_delivery_fee
                ? Number(cartData?.total_delivery_fee).toFixed(2)
                : 0}
            </Text>
          </View>
        )}
        {cartData?.loyalty_amount_saved > 0 && (
          <View style={styles.bottomTabLableValue}>
            <Text style={styles.priceItemLabel}>{strings.LOYALTY}</Text>
            <Text style={styles.priceItemLabel}>
              -{userData?.client_preference?.currency?.symbol}
              {cartData?.loyalty_amount_saved
                ? Number(cartData?.loyalty_amount_saved).toFixed(2)
                : 0}
            </Text>
          </View>
        )}

        {cartData?.total_discount > 0 && (
          <View style={styles.bottomTabLableValue}>
            <Text style={styles.priceItemLabel}>{strings.TOTALDISCOUNT}</Text>
            <Text style={styles.priceItemLabel}>
              -{userData?.client_preference?.currency?.symbol}
              {Number(cartData?.total_discount).toFixed(2)}
            </Text>
          </View>
        )}
        {cartData?.taxable_amount > 0 && (
          <View style={styles.bottomTabLableValue}>
            <Text style={styles.priceItemLabel}>{strings.TAXAMOUNT}</Text>
            <Text style={styles.priceItemLabel}>
              {userData?.client_preference?.currency?.symbol}
              {Number(cartData?.taxable_amount).toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.amountPayable}>
          <Text
            style={[
              styles.priceItemLabel2,
              {marginTop: moderateScaleVertical(7)},
            ]}>
            {strings.TOTAL}
          </Text>
          <Text
            style={[
              styles.priceItemLabel2,
              {marginTop: moderateScaleVertical(5)},
            ]}>
            {userData?.client_preference?.currency?.symbol}
            {Number(cartData?.payable_amount).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  const getFooter = () => {
    return (
      <View>
        {/* Price section */}

        {/* Delivery Location */}
        <View style={{backgroundColor: colors.white}}>
          <View style={[styles.topLable, {marginTop: moderateScale(10)}]}>
            <View
              style={{
                flexDirection:
                  defaultLanguage?.value === 'ar' ? 'row-reverse' : 'row',
                alignItems: 'center',
                backgroundColor: colors.white,
              }}>
              <Text numberOfLines={1} style={styles.deliveryLocationAndTime}>
                {strings.DELIVERYADDERSS}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexWrap:
                defaultLanguage?.value === 'ar' ? 'wrap-reverse' : 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: moderateScale(15),
              marginTop: moderateScaleVertical(10),
            }}>
            <View
              style={{
                flexDirection:
                  defaultLanguage?.value === 'ar' ? 'row-reverse' : 'row',
              }}>
              <Image source={imagePath.map1} />
              <Text numberOfLines={2} style={{...styles.address, flex: 1}}>
                {cartData?.address?.address}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection:
                defaultLanguage?.value === 'ar' ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              marginVertical: moderateScaleVertical(5),
            }}>
            <View style={{marginLeft: moderateScale(10)}}>
              <View
                style={{
                  flexDirection:
                    defaultLanguage?.value === 'ar' ? 'row-reverse' : 'row',
                  marginTop: moderateScaleVertical(10),
                  justifyContent: 'space-between',
                  width: width - 20,
                }}>
                <Text style={styles.orderLableStyle}>
                  {strings.ORDERNUMBER}
                </Text>
                <Text
                  style={
                    styles.selectedMethod
                  }>{`#${cartData?.order_number}`}</Text>
              </View>
              {/* <View>
              <Text style={styles.orderLableStyle}>
                {cartData?.created_date}
              </Text>
            </View> */}
            </View>
          </View>

          <View style={{marginLeft: moderateScale(10)}}>
            <View
              style={{
                flexDirection:
                  defaultLanguage?.value === 'ar' ? 'row-reverse' : 'row',
                marginTop: moderateScaleVertical(4),
                justifyContent: 'space-between',
                width: width - 20,
              }}>
              <Text style={styles.orderLableStyle}>
                {strings.PAYMENTMETHOD}
              </Text>
              <Text style={styles.selectedMethod}>
                {cartData?.payment_option?.title || ''}
              </Text>
            </View>
          </View>

          <View style={{marginLeft: moderateScale(10)}}>
            <View
              style={{
                flexDirection:
                  defaultLanguage?.value === 'ar' ? 'row-reverse' : 'row',
                marginTop: moderateScaleVertical(10),
                justifyContent: 'space-between',
                width: width - 20,
              }}>
              <Text style={styles.orderLableStyle}>{strings.PLACEDON}</Text>
              <Text style={styles.selectedMethod}>
                {cartData?.created_date}
              </Text>
            </View>
          </View>
        </View>
        {!!paramData?.fromVendorApp ? null : orderAmountDetail()}
        {!!cartData?.address ? null : orderAmountDetail()}
        {/* Add instruction */}

        <View style={{height: moderateScaleVertical(20)}} />
        {!!allVendorsData[0]?.order?.customer?.resources?.resources && (
          <View
            style={{
              marginHorizontal: moderateScale(15),
            }}>
            <Text style={styles.price}>Verify with client's ID</Text>
            {!!allVendorsData[0]?.order?.customer?.resources?.resources
              ?.first_names && (
              <LeftRightText
                leftText="First Name"
                rightText={
                  allVendorsData[0]?.order?.customer?.resources?.resources
                    ?.first_names
                }
              />
            )}
            {!!allVendorsData[0]?.order?.customer?.resources?.resources
              ?.last_name && (
              <LeftRightText
                leftText="Last Name"
                rightText={
                  allVendorsData[0]?.order?.customer?.resources?.resources
                    ?.last_name
                }
              />
            )}
            {!!allVendorsData[0]?.order?.customer?.resources?.resources
              ?.date_of_birth && (
              <LeftRightText
                leftText="Date of Birth"
                rightText={
                  allVendorsData[0]?.order?.customer?.resources?.resources
                    ?.date_of_birth
                }
              />
            )}
            {!!allVendorsData[0]?.order?.customer?.resources?.resources
              ?.sex && (
              <LeftRightText
                leftText="Sex"
                rightText={
                  allVendorsData[0]?.order?.customer?.resources?.resources?.sex
                }
              />
            )}
            {!!allVendorsData[0]?.order?.customer?.resources?.resources
              ?.address && (
              <LeftRightText
                leftText="Address"
                rightText={
                  allVendorsData[0]?.order?.customer?.resources?.resources
                    ?.address
                }
              />
            )}
            {!!allVendorsData[0]?.order?.customer?.resources?.resources
              ?.country && (
              <LeftRightText
                leftText="Country"
                rightText={
                  allVendorsData[0]?.order?.customer?.resources?.resources
                    ?.country
                }
              />
            )}
            {!!allVendorsData[0]?.order?.customer?.resources?.resources
              ?.document_number && (
              <LeftRightText
                leftText="Document Number"
                rightText={
                  allVendorsData[0]?.order?.customer?.resources?.resources
                    ?.document_number
                }
              />
            )}
            {!!allVendorsData[0]?.order?.customer?.resources?.resources
              ?.date_of_issue && (
              <LeftRightText
                leftText="Date of Issue"
                rightText={
                  allVendorsData[0]?.order?.customer?.resources?.resources
                    ?.date_of_issue
                }
              />
            )}
            {!!allVendorsData[0]?.order?.customer?.resources?.resources
              ?.date_of_expiry && (
              <LeftRightText
                leftText="Date of Expiry"
                rightText={
                  allVendorsData[0]?.order?.customer?.resources?.resources
                    ?.date_of_expiry
                }
              />
            )}
            {!!allVendorsData[0]?.order?.customer?.resources?.resources
              ?.face_match_factor && (
              <LeftRightText
                leftText="Face Match Factor"
                rightText={
                  allVendorsData[0]?.order?.customer?.resources?.resources
                    ?.face_match_factor
                }
              />
            )}
            {!!allVendorsData[0]?.order?.customer?.resources?.resources
              ?.drivers_license_categories && (
              <LeftRightText
                leftText="Drivers License Categories"
                rightText={
                  allVendorsData[0]?.order?.customer?.resources?.resources
                    ?.drivers_license_categories
                }
              />
            )}
            {!!allVendorsData[0]?.order?.customer?.resources?.resources
              ?.document_origin_country && (
              <LeftRightText
                leftText="Document Origin Country"
                rightText={
                  allVendorsData[0]?.order?.customer?.resources?.resources
                    ?.document_origin_country
                }
              />
            )}
          </View>
        )}
      </View>
    );
  };

  const _onPressEditOrder = () => {
    moveToNewScreen(navigationStrings.CART, {
      // cartData: res?.data,
      taskDetail: taskDetail,
      apiData: apiData,
    })();
  };

  const _onPressLeft = () => {
    if (fromNotification) {
      // navigate(navigationStrings.TASKHISTORY);
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  };

  const buttonView = () => {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.button,
              {
                backgroundColor: colors.redB,
              },
            ]}>
            <Text style={styles.text}>{strings.ORDERCANCEL}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}
      isLoading={isLoading}>
      <Header
        reverse={false}
        headerStyle={{backgroundColor: colors.white}}
        leftIcon={imagePath.backArrow}
        centerTitle={strings.ORDERDETAILS}
        onPressLeft={_onPressLeft}
        customRight={
          !fromNotification &&
          userData &&
          userData?.client_preference?.is_edit_order_driver
            ? () => (
                <TouchableOpacity onPress={_onPressEditOrder}>
                  <Text style={styles.editOrder}>{'Edit'}</Text>
                </TouchableOpacity>
              )
            : null
        }
        // onPressLeft={() => navigation.toggleDrawer()}
        // hideRight={true}
        // customCenter={() => customCenter()}
      />
      <View style={{height: 1, backgroundColor: colors.borderLight}} />
      <View style={styles.mainComponent}>
        {allVendorsData?.length ? (
          <FlatList
            data={allVendorsData}
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: colors.backgroundGrey, flex: 1}}
            keyExtractor={(item, index) => String(index)}
            renderItem={_renderItem}
            ListFooterComponent={getFooter}
            // style={{flex: 1}}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          />
        ) : null}

        {!!(
          taskDetail?.order?.status == 'cancelled' && allVendorsData?.length
        ) && <View>{buttonView()}</View>}
      </View>
    </WrapperContainer>
  );
}
