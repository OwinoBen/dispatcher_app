import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Keyboard,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import {useSelector} from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {currencyNumberFormatter} from '../../utils/commonFunction';
import {showError} from '../../utils/helperFunctions';
import stylesFun from './styles';
import {
  CardField,
  createToken,
  initStripe,
  StripeProvider,
} from '@stripe/stripe-react-native';
import {useDarkMode} from 'react-native-dynamic';

export default function AddMoney({navigation}) {
  const {clientInfo, themeColor, themeToggle} = useSelector(
    state => state?.initBoot,
  );
  const {userData} = useSelector(state => state?.auth);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  console.log(userData, 'userData');
  const {client_preference} = userData;
  console.log(client_preference,"client_preference");
  const [state, setState] = useState({
    customAmount: [
      {id: 0, amount: 300},
      {id: 1, amount: 5000},
      {id: 2, amount: 4500},
    ],
    isLoading: true,
    amount: '',
    allPaymentOptions: [],
    seletedPaymentGateway: null,
    allAvailAblePaymentMethods: [],
    cardInfo: null,
  });

  const styles = stylesFun();
  const {
    cardInfo,
    allAvailAblePaymentMethods,
    amount,
    customAmount,
    isLoading,
    allPaymentOptions,
    seletedPaymentGateway,
  } = state;

  useEffect(() => {
    if (
      client_preference?.stripe_publishable_key != '' &&
      client_preference?.stripe_publishable_key != null
    ) {
      initStripe({
        publishableKey: client_preference?.stripe_publishable_key,
        merchantIdentifier: 'merchant.identifier',
        
      });
    }
    getWalletData();
  }, []);
  

  const getWalletData = () => {
    actions
      .getPaymentOptions(
        `/wallet`,
        {},
        {
          client: clientInfo?.database_name,
        },
      )
      .then(res => {
        console.log(res, '<<<res all payment gateways');
        updateState({
          allAvailAblePaymentMethods: res?.data,
          // updateState({allAvailAblePaymentMethods: res?.data});

          isLoading: false,
        });
      })
      .catch(errorMethod);
  };

  const updateState = data => setState(state => ({...state, ...data}));

  const _onChangeText = key => val => {
    updateState({[key]: val});
  };

  const chooseAmount = item => {
    let addedAmount = item.amount;
    updateState({amount: addedAmount});
  };

  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => chooseAmount(item)}>
        <View
          style={{
            backgroundColor: '#fff',
            flexDirection: 'row',
            paddingVertical: moderateScaleVertical(8),
          }}>
          <View style={styles.selectAmountCon}>
            <Text numberOfLines={1} style={styles.chooseAddMoney}>
              {`+ ${userData?.client_preference?.currency?.symbol}`}
              {currencyNumberFormatter(Number(item.amount).toFixed(2))}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const mainView = () => {
    return (
      <>
        <View style={styles.addMoneyTopCon}>
          <View style={styles.inputAmountCon}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.inputAmountText}>{strings.INPUT_AMOUNT}</Text>
            </View>

            <View
              style={{
                height: moderateScaleVertical(35),
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: moderateScale(3),
                borderBottomWidth: 0.5,
                borderBottomColor: colors.textGreyJ,
              }}>
              {amount != '' && (
                <Text style={styles.currencySymble}>
                  {/* {currencies?.primary_currency?.symbol} */}
                  {userData?.client_preference?.currency?.symbol}
                </Text>
              )}
              <TextInput
                style={{
                  ...styles.addMoneyInputField,
                  paddingLeft: amount == '' ? 0 : moderateScale(30),
                }}
                value={`${amount}`}
                onChangeText={_onChangeText('amount')}
                keyboardType={'numeric'}
                placeholder={strings.ENTER_AMOUNT}
                placeholderTextColor={colors.textGreyJ}
              />
            </View>
            <View style={{marginTop: 10}}>
              <FlatList
                data={customAmount}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal
                ItemSeparatorComponent={(data, index) =>
                  index == data.length ? null : (
                    <View style={styles.cartItemLine}></View>
                  )
                }
                keyExtractor={(item, index) => String(index)}
                renderItem={_renderItem}
              />
            </View>
          </View>
        </View>
        <View />
        {/* <ScrollView keyboardShouldPersistTaps={'handled'}> */}
        <View style={{flex: 1}}>
          <View
            style={{
              marginTop: moderateScaleVertical(20),
              marginHorizontal: moderateScale(20),
            }}>
            {!!(
              allAvailAblePaymentMethods && allAvailAblePaymentMethods.length
            ) && (
              <Text
                style={
                  isDarkMode
                    ? [styles.debitFrom, {color: MyDarkTheme.colors.text}]
                    : styles.debitFrom
                }>
                {strings.DEBIT_FROM}
              </Text>
            )}
            <FlatList
              data={allAvailAblePaymentMethods}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              // horizontal
              style={{marginTop: moderateScaleVertical(10)}}
              keyExtractor={(item, index) => String(index)}
              renderItem={_renderItemPayments}
              ListEmptyComponent={() => (
                <Text style={{textAlign: 'center'}}>
                  {strings.NO_PAYMENT_METHOD}
                </Text>
              )}
            />
          </View>
        </View>
        {/* </ScrollView> */}

        {/* botttom add money button */}
        <View style={styles.bottomButtonStyle}>
          <GradientButton
            containerStyle={{marginTop: moderateScaleVertical(40)}}
            onPress={_onTopUp}
            textStyle={{color: colors.black}}
            btnText={strings.ADD}
            colorsArray={[colors.themeColor, colors.themeColor]}
          />
        </View>
      </>
    );
  };

  // added web View payment func. from orders

  const apiHit = async () => {
    let queryData = `/${seletedPaymentGateway?.code?.toLowerCase()}?amount=${amount}&payment_option_id=${
      paramsData?.payment_option_id
    }&action=${paramsData?.redirectFrom}&order_number=${
      paramsData?.orderDetail?.order_number
    }`;
    console.log(queryData, 'queryData');
    try {
      const res = await actions.openPaymentWebUrl(
        queryData,
        {},
        {
          client: clientInfo?.database_name,
        },
      );
      console.log(res?.data, 'responseData===>');

      updateState({webData: res?.data});
    } catch (error) {
      updateState({isLoading: false});
      showError(error.message || error);
    }
  };

  // ///////// /// till here

  const _webPayment = () => {
    let selectedMethod = seletedPaymentGateway.code;
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.access_token}/wallet`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.access_token}/wallet`;
    console.log(returnUrl, 'returnurl>>>');

    updateState({isLoadingB: true});
    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?amount=${amount}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&payment_option_id=${seletedPaymentGateway?.id}&action=wallet`,
        {},
        {
          client: clientInfo?.database_name,
        },
      )
      .then(res => {
        updateState({isLoadingB: false, isRefreshing: false});
        // const URL = queryString.parseUrl(res.data);
        console.log('res==>>>>', res);
        if (res && res?.status == 'Success' && res?.data) {
          let sendingData = {
            id: seletedPaymentGateway.id,
            title: seletedPaymentGateway.title,
            screenName: navigationStrings.WALLET,
            paymentUrl: res.data,
            action: 'wallet',
          };

          navigation.navigate(navigationStrings.ALL_IN_ONE_PAYMENTS, {
            data: sendingData,
          });
        }
      })
      .catch(errorMethod);
  };

  //Offline payments
  const _offineLinePayment = async () => {
    
    if (cardInfo) {
      console.log(cardInfo, 'details');
      // alert("123")
      // updateState({isLoadingB: true});
      await createToken({...cardInfo, type: 'Card'})
        .then(res => {
          console.log(res, 'res>>STRIpe........');
          console.log(cardInfo, 'stripeTokencardInfo>>');
          if (res && res?.token && res.token?.id) {
            let selectedMethod = seletedPaymentGateway.code.toLowerCase();
            updateState({isLoading: true});
            actions
              .openPaymentWebUrl(
                `/${selectedMethod}?amount=${amount}&payment_option_id=${seletedPaymentGateway?.id}&action=wallet&stripe_token=${res.token?.id}`,
                {},
                {
                  client: clientInfo?.database_name,
                },
              )
              .then(res => {
                console.log(res, 'openPaymentWebUrl>res');
                updateState({isLoading: false, isRefreshing: false});
                if (res && res?.status == 'Success') {
                  // updateState({allAvailAblePaymentMethods: res?.data});
                  // alert('Payment successfull');
                  Alert.alert('', strings.PAYMENT_SUCCESS, [
                    {
                      text: strings.OK,
                      onPress: () => console.log('Cancel Pressed'),
                      // style: 'destructive',
                    },
                  ]);
                  navigation.navigate(navigationStrings.WALLET);
                }
              })
              .catch(err => console.log(err, 'errrStripe'));
          } else {
            updateState({isLoading: false});
          }
        })
        .catch(errorMethod);
    } else {
      showError('Please enter the card details');
    }
  };

  const _onTopUp = () => {
    console.log(seletedPaymentGateway, 'seletedPaymentGateway');
    if (amount == '') {
      showError(strings.PLEASE_ENTER_VALID_AMOUNT);
    } else if (!seletedPaymentGateway) {
      showError(strings.PLEASE_SELECT_PAYMENT_METHOD);
    } else {
      if (
        seletedPaymentGateway?.off_site == 0 &&
        seletedPaymentGateway?.id == 10
      ) {
        _onRazorPay();
        return;
      }

      if (seletedPaymentGateway?.off_site == 1) {
        _webPayment();
        return;
      } else {
        _offineLinePayment();
      }
    }
  };

  // const _onTopUp = () => {
  //   if (amount > 0) {
  //     if (seletedPaymentGateway?.id === 10) {
  //       _onRazorPay();
  //     } else {
  //       showError(strings.PLEASE_SELECT_PAYMENT_METHOD);
  //     }

  //     if (seletedPaymentGateway?.off_site == 1) {
  //       // _webPayment();
  //       return;
  //     } else {
  //       _offineLinePayment();
  //     }

  //   } else {
  //     showError(strings.PLEASE_ENTER_VALID_AMOUNT);
  //   }
  // };

  const errorMethod = error => {
    updateState({isLoading: false});
    showError(error?.message || error?.error || error?.description);
  };

  const _onRazorPay = () => {
    var options = {
      image: userData?.image_url,
      currency: userData?.client_preference?.currency?.iso_code,
      key: seletedPaymentGateway?.api_key,
      amount: Number(amount) * 100,
      name: 'Goody',
      prefill: {
        contact: userData?.phone_number,
        name: userData?.name,
      },
      theme: {color: '#F37254'},
    };

    RazorpayCheckout.open(options)
      .then(res => {
        console.log(`Success for razor: `, res);
        if (res?.razorpay_payment_id) {
          const data = {};
          data['amount'] = amount;
          data['transaction_id'] = res?.razorpay_payment_id;
          actions
            .walletCredit(data, {
              client: clientInfo?.database_name,
            })
            .then(res => {
              console.log(res, 'response credit wallet');
              Alert.alert('', strings.PAYMENT_SUCCESS, [
                {
                  text: strings.OK,
                  onPress: () => console.log('Okay pressed'),
                },
              ]);
              navigation.navigate(navigationStrings.WALLET);
            })
            .catch(errorMethod);
        }
      })
      .catch(err => showError(err?.error?.description));
  };

  const _selectPaymentMethod = item => {
    console.log(item, 'seletedPaymentGateway');
    {
      seletedPaymentGateway && seletedPaymentGateway?.id == item?.id
        ? updateState({seletedPaymentGateway: null})
        : updateState({seletedPaymentGateway: item});
    }
  };

  const _onChangeStripeData = cardDetails => {
    if (cardDetails?.complete) {
      updateState({
        cardInfo: cardDetails,
      });
    } else {
      updateState({cardInfo: null});
    }
  };

  const _renderItemPayments = ({item, index}) => {
    return (
      <>
        <TouchableOpacity onPress={() => _selectPaymentMethod(item)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: moderateScaleVertical(5),
            }}>
            <Image
              source={
                seletedPaymentGateway && seletedPaymentGateway?.id == item.id
                  ? imagePath.redioSelectedButton
                  : imagePath.redioUnSelectedButton
              }
            />
            <Text
              style={[
                styles.title,
                {
                  color:
                    seletedPaymentGateway &&
                    seletedPaymentGateway?.id == item.id
                      ? isDarkMode
                        ? colors.white
                        : colors.blackC
                      : colors.textGreyJ,
                },
              ]}>
              {item?.title_lng ? item?.title_lng : item?.title}
            </Text>
          </View>
        </TouchableOpacity>

        {seletedPaymentGateway &&
          seletedPaymentGateway?.id == item.id &&
          seletedPaymentGateway?.off_site == 0 &&
          seletedPaymentGateway?.id === 4 && (
            <View>
              <CardField
                postalCodeEnabled={false}
                placeholder={{
                  number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000',
                }}
                style={{
                  width: '100%',
                  height: 50,
                  marginVertical: 10,
                }}
                onCardChange={cardDetails => {
                  // console.log('cardDetails', cardDetails);
                  _onChangeStripeData(cardDetails);
                }}
                onFocus={focusedField => {
                  console.log('focusField', focusedField);
                }}
                onBlur={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
          )}

        {seletedPaymentGateway &&
          seletedPaymentGateway?.id == item.id &&
          seletedPaymentGateway?.off_site == 0 &&
          seletedPaymentGateway?.id === 17 && (
            <CheckoutPaymentView
              cardTokenized={e => {
                if (e.token) {
                  _checkoutPayment(e.token);
                }
              }}
              cardTokenizationFailed={e => {
                setTimeout(() => {
                  updateState({isLoadingB: false});
                  showError(strings.INVALID_CARD_DETAILS);
                }, 1000);
              }}
              onPressSubmit={res => {
                updateState({
                  isLoadingB: true,
                });
              }}
              btnTitle={strings.ADD}
              isSubmitBtn
              submitBtnStyle={{
                width: '100%',
                height: moderateScale(40),
              }}
            />
          )}
      </>
    );
  };

  // const _renderPaymentOptions = ({item, index}) => {
  //   return (
  //     <TouchableOpacity
  //       onPress={() =>
  //         updateState({
  //           seletedPaymentGateway: item,
  //         })
  //       }
  //       activeOpacity={0.7}
  //       style={{
  //         paddingHorizontal: moderateScale(15),
  //         paddingVertical: moderateScale(12),
  //         backgroundColor: colors.borderColorB,
  //         flexDirection: 'row',
  //         alignItems: 'center',
  //         borderWidth: seletedPaymentGateway?.id === item.id ? 1 : 0,
  //         borderColor:
  //           seletedPaymentGateway?.id === item.id
  //             ? colors.themeColor
  //             : colors.transparent,
  //         borderRadius: moderateScale(5),
  //       }}>
  //       <Image
  //         source={
  //           seletedPaymentGateway?.id === item.id
  //             ? imagePath.icRadioActive
  //             : imagePath.icRadio
  //         }
  //         style={{
  //           tintColor:
  //             seletedPaymentGateway?.id === item.id
  //               ? colors.themeColor
  //               : colors.grey2,
  //         }}
  //       />
  //       <Text
  //         style={{
  //           fontFamily: fontFamily.regular,
  //           marginLeft: moderateScale(5),
  //         }}>
  //         {item?.title_lng ? item?.title_lng : item?.title}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.white}
      isLoading={isLoading}
      source={loaderOne}>
      <Header
        leftIcon={imagePath.backArrow}
        centerTitle={strings.ADD_MONEY}
        headerStyle={{backgroundColor: colors.white}}
        leftIconStyle={{tintColor: colors.themeColor}}
      />
      <View
        style={{
          height: 1,
          backgroundColor: colors.lightGreyBgColor,
          opacity: 0.26,
        }}
      />

      {client_preference?.stripe_publishable_key != '' &&
      client_preference?.stripe_publishable_key != null ? (
        <StripeProvider
          publishableKey={client_preference?.stripe_publishable_key}
          merchantIdentifier="merchant.identifier">
          {mainView()}
        </StripeProvider>
      ) : (
        mainView()
      )}

      {/* {mainView()} */}
      {/* <View style={{marginHorizontal: moderateScale(15)}}>
        <Text style={styles.selectPaymentTxt}>{strings.PAYMENT_METHODS}</Text>
        <FlatList
          data={allPaymentOptions}
          renderItem={_renderPaymentOptions}
          ListEmptyComponent={() => (
            <Text style={styles.noPaymentFound}>
              {strings.NO_PAYMENT_METHOD}
            </Text>
          )}
        />
      </View> */}
    </WrapperContainer>
  );
}
