import moment from 'moment';
import React, { useState } from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
} from '../utils/helperFunctions';
import GradientButton from './GradientButton';
import {useDarkMode} from 'react-native-dynamic';
import fontFamily from '../styles/fontFamily';
const SubscriptionComponent = ({
  data = {},
  onPress = () => {},
  cardWidth,
  cardStyle = {},
  onAddtoWishlist,
  addToCart = () => {},
  activeOpacity = 1,
  bottomText = strings.BUY_NOW,
  clientCurrency = {},
  currentSubscription = false,
  payNowUpcoming = () => {},
  cancelSubscription = () => {},
  subscriptionData,
  allSubscriptions = [1,2],
  
}) => {
//   const theme = useSelector((state) => state?.initBoot?.themeColor);

//   const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
//   const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
//   const currentTheme = useSelector((state) => state?.appTheme);
//   const currencies = useSelector((state) => state?.initBoot?.currencies);
//   const {appStyle, themeColors} = useSelector((state) => state?.initBoot);
    //  const themeColors =  MyDarkTheme
//   const fontFamily = appStyle?.fontSizeData;
//   const {themeLayouts} = currentTheme;
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = stylesFunc({fontFamily});

  const cardWidthNew = cardWidth ? cardWidth : width - 20;
  // const url1 = data?.image?.image_fit;
  // const url2 = data?.image?.image_path;

  const url2 = 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png';
  const url1 = 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png';


  const getImage = getImageUrl(url1, url2, '500/500');
  const productPrice = data?.price;
  // data?.variant[0]?.price *
  // (data?.variant[0]?.multiplier ? data?.variant[0]?.multiplier : 1);
    // const [isDarkMode, setIsDarkMode] = useState(false)
    const isDarkMode = false

  const currentDateValue = new Date().getTime();
  const subscriptionDateValue = moment(subscriptionData?.cancelled_at).format(
    'LL',
  );
  const subscriptionEndDateValue = moment(subscriptionData?.end_date).format(
    'LL',
  );

  const currentTimeValue = new Date().getTime();
  const subscriptionTimeValue = new Date(
    subscriptionData?.cancelled_at,
  ).getTime();
  const subscriptionEndTimeValue = new Date(
    subscriptionData?.end_date,
  ).getTime();

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      // onPress={onPress}
      style={
        isDarkMode
          ? [
              {width: cardWidthNew},
              {
                ...commonStyles.shadowStyle,
                backgroundColor: MyDarkTheme.colors.lightDark,
              },
              {...cardStyle},
              {borderRadius: 10, justifyContent: 'center'},
            ]
          : [
              {width: cardWidthNew},
              {...commonStyles.shadowStyle},
              {...cardStyle},
              {borderRadius: 10, justifyContent: 'center'},
            ]
      }>
      <View>
        <View style={{padding: 10}}>
          <Image
            // source={getImage ? {uri: getImage} : ''}
            source={getImage ? {uri: url1} : ''}
            // resizeMode={'contain'} // not inc.
            style={{
              justifyContent: 'center',
              width: width - 40,
              height: width / 2,
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: moderateScale(10),
          width:moderateScale(width-85),
          // backgroundColor:'red',
          alignItems: 'center',
        }}>
        <Text
          style={
            isDarkMode
              ? [styles.title, {color: MyDarkTheme.colors.text}]
              : styles.title
          }>
          {/* {data?.title} */} 
          {`Summer Sale`}
        </Text>
        <Text
          style={
            isDarkMode
              ? [styles.title, {color: MyDarkTheme.colors.text}]
              : styles.title
          }>
          {currentSubscription
            ? `${subscriptionData?.subscription_amount}/${subscriptionData?.frequency}`
            :  ' $ 100' // `${data?.price}/${data?.frequency}` 
          }    
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: moderateScale(10),
          marginTop: moderateScale(10),
        }}>
        <Text
          style={
            isDarkMode
              ? [styles.subtitle, {color: MyDarkTheme.colors.text}]
              : [styles.subtitle]
          }>
          {(subscriptionData && subscriptionData?.plan?.description) ||
            data?.description}
            {'it is All about about summer sale'}
        </Text>
      </View>
      {currentSubscription ? null : (
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: moderateScale(10),
            marginTop: moderateScale(10),
            alignItems: 'center',
          }}>
          <Image source={imagePath.tickGreen}  />  
          <Text
            style={
              isDarkMode
                ? [styles.freeDelivery, {color: MyDarkTheme.colors.text}]
                : [styles.freeDelivery]
            }>
            {strings.FREE_DELIVERY}
            {'free delivery'}
          </Text>
        </View>
      )}

      {currentSubscription ? (
        <View>
          {subscriptionData?.cancelled_at ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: moderateScale(10),
                  marginTop: moderateScale(10),
                  marginBottom: moderateScaleVertical(10),
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'grey',
                  width: width / 2,
                  justifyContent: 'center',
                  padding: 5,
                }}>
                <Text
                  style={[
                    styles.updateBilling,
                    {color: colors.white, fontSize: textScale(12)},
                  ]}>
                  {currentDateValue == subscriptionDateValue ||
                  currentTimeValue > subscriptionTimeValue
                    ? `${strings.CANCELLED_AT} ${moment(
                        subscriptionData?.end_date,
                      ).format('LL')}`
                    : `${strings.CANCELS_AT} ${moment(
                        subscriptionData?.end_date,
                      ).format('LL')}`}
                </Text>
              </View>
              {allSubscriptions && allSubscriptions.length ? (
                <GradientButton
                //   colorsArray={[
                //     themeColors.primary_color,
                //     themeColors.primary_color,
                //   ]}
                  textStyle={styles.textStyle}
                  // onPress={() => onPress(data)}
                  marginTop={moderateScaleVertical(10)}
                  marginBottom={moderateScaleVertical(10)}
                  borderRadius={moderateScale(5)}
                  containerStyle={{
                    marginHorizontal: moderateScale(10),
                    width: width / 3,
                    backgroundColor: 'white',
                  }}
                  onPress={payNowUpcoming}
                  // btnText={
                  //   currentDateValue == subscriptionDateValue ||
                  //   currentTimeValue > subscriptionTimeValue
                  //     ? `${strings.RENEW}(${data?.price})` 
                  //     : `${strings.PAY}(${data?.price})`
                  // }
                  btnText={
                    'Pay Now $200'
                  }
                />
              ) : null}
            </View>
          ) : true||
            currentTimeValue > subscriptionEndTimeValue ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: moderateScale(10),
                  marginTop: moderateScale(10),
                  marginBottom: moderateScaleVertical(10),
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'grey',
                  width: width / 2,
                  justifyContent: 'center',
                  padding: 5,
                }}>
                <Text
                  style={[
                    styles.updateBilling,
                    {color: colors.white, fontSize: textScale(12)},
                  ]}>
                  {`${strings.EXPIRED_ON} ${moment(
                    subscriptionData?.end_date,
                  ).format('LL')}`}
                </Text>
              </View>
              {allSubscriptions && allSubscriptions.length ? (
                <GradientButton
                //   colorsArray={[
                //     themeColors.primary_color,
                //     themeColors.primary_color,
                //   ]}
                  // textStyle={styles.textStyle}
                  // onPress={() => onPress(data)}
                  marginTop={moderateScaleVertical(10)}
                  marginBottom={moderateScaleVertical(10)}
                  borderRadius={moderateScale(5)}
                  containerStyle={{
                    marginHorizontal: moderateScale(10),
                    width: width / 3,
                    backgroundColor: 'white',
                  }}
                  onPress={payNowUpcoming}
                  btnText={
                    currentDateValue == subscriptionDateValue ||
                    currentTimeValue > subscriptionTimeValue
                      ?  'pay Now $ 200' //`${strings.RENEW}(${data?.price})`
                      : 'pay Now $ 200'      // `${strings.PAY}(${data?.price})`
                  }
                />
              ) : null}
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: moderateScale(10),
                marginTop: moderateScale(10),
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.updateBilling}>
                {/* {strings.UPCOMING_BILLING_DATE} */}
                {'billingDate'}
              </Text>
              <Text>{moment(subscriptionData?.end_date).format('LL')}</Text>
            </View>
          )}

          {currentSubscription ? null : (
            <>
              {/* {subscriptionData?.cancelled_at ||
              currentDateValue == subscriptionEndDateValue ||
              currentTimeValue > subscriptionEndTimeValue ? null : ( */}
              <View
                style={{marginTop: moderateScale(10), flexDirection: 'row'}}>
                <GradientButton
                //   colorsArray={[
                //     themeColors.primary_color,
                //     themeColors.primary_color,
                //   ]}
                  textStyle={styles.textStyle}
                  onPress={() => onPress(data)}
                  marginTop={moderateScaleVertical(10)}
                  marginBottom={moderateScaleVertical(10)}
                  borderRadius={moderateScale(5)}
                  containerStyle={{
                    marginHorizontal: moderateScale(10),
                    width: width / 2,
                  }}
                //   onPress={payNowUpcoming}
                  // btnText={`${strings.PAYNOW} (${data?.price})`}
                />
                <GradientButton
                //   colorsArray={[
                //     getColorCodeWithOpactiyNumber(
                //       themeColors?.primary_color.substr(1),
                //       20,
                //     ),
                //     getColorCodeWithOpactiyNumber(
                //       themeColors?.primary_color.substr(1),
                //       20,
                //     ),
                //   ]}
                  textStyle={styles.textStyle2}
                //   onPress={() => onPress(data)}
                  marginTop={moderateScaleVertical(10)}
                  marginBottom={moderateScaleVertical(10)}
                  borderRadius={moderateScale(5)}
                  containerStyle={{
                    marginHorizontal: moderateScale(10),
                    width: width / 3,
                    backgroundColor: 'white',
                  }}
                  onPress={cancelSubscription}
                  btnText={`${strings.CANCEL}`}
                />
              </View>
              {/* )} */}
            </>
          )}
        </View>
      ) : (
        <GradientButton
        //   colorsArray={[themeColors.primary_color, themeColors.primary_color]}
          textStyle={styles.textStyle}
          onPress={() => onPress(data)}
          marginTop={moderateScaleVertical(10)}
          marginBottom={moderateScaleVertical(10)}
          borderRadius={moderateScale(5)}
          containerStyle={{marginHorizontal: moderateScale(10)}}
          // btnText={strings.SUBSCRIBE}
          btnText={'Subscribe'}
        />
      )}
    </TouchableOpacity>
  );
};

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    title: {
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
    },
    subtitle: {
      color: colors.black,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      opacity: 0.5,
    },
    freeDelivery: {
      color: colors.black,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      marginLeft: 5,
    },
    absolute: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      height: moderateScaleVertical(54),
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: moderateScaleVertical(5),
    },
    textStyle: {
      color: colors.white,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      // opacity: 0.6,
    },
    textStyle2: {
    //   color: themeColors?.primary_color,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      // opacity: 0.6,
    },
    updateBilling: {
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      opacity: 0.98,
    },
  });
  return styles;
}
export default React.memo(SubscriptionComponent);
