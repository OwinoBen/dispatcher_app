import React, { useState, useEffect, createRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Image, View, Text, ScrollView, Button, RefreshControl, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import TextInputWithlabel from '../../Components/TextInputWithlabel';
import WrapperContainer from '../../Components/WrapperContainer';
import PhoneNumberInput from '../../Components/PhoneNumberInput';

import strings from '../../constants/lang';
// import store from '../../redux/store';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import imagePath from '../../constants/imagePath';
import { transportationArray } from '../../utils/constants/ConstantValues';
import {styles} from './styles';
import SubscriptionComponent from '../../Components/SubscriptionComponent';
import { FlatList } from 'react-native-gesture-handler';
import SubscriptionComponent2 from '../../Components/SubscriptionComponent2';
import actions from '../../redux/actions';
import { showError, showSuccess } from '../../utils/helperFunctions';
import axios from 'axios';
import ListEmptySubscriptions from './ListEmptySubscriptions';
import { GET_ALL_SUBSCRIPTION_PLANS } from '../../config/urls';
import ModalView from '../../Components/Modal';
import GradientButton from '../../Components/GradientButton';
import FastImage from 'react-native-fast-image';

export default function Subscriptions({ route, navigation }) {
  const userData = useSelector(state => state?.auth?.userData);
  console.log(userData, 'userData');
  const [state, setState] = useState({
    isRefreshing: false,
    isLoading: false,
    isLoadingB: false,
    allSubscriptions: [],
    isRefreshing: false,
    limit: 12,
    currentSubscription: null,
    clientCurrency,
    isModalVisibleForPayment: false,
    selectedPlan: null,
    paymentOptions: [],
    selectedPaymentMethod: null,
    cardInfo: null,
    planPrice: 0,
    paymentDataFlutterWave: null,
    isModalVisibleForPayFlutterWave: false,
    clientCurrencyToBuy,
  });

  const {
    isModalVisibleForPayFlutterWave,
    paymentDataFlutterWave,
    allSubscriptions,
    isRefreshing,
    isLoading,
    isLoadingB,
    clientCurrency,
    currentSubscription,
    isModalVisibleForPayment,
    selectedPlan,
    paymentOptions,
    selectedPaymentMethod,
    cardInfo,
    planPrice,
    clientCurrencyToBuy

  } = state;

  // updated your state 
  const updateState = data => setState(state => ({ ...state, ...data }));

  const commonStyles = commonStylesFunc({ fontFamily });
  const explosion = createRef();

  useFocusEffect(
    React.useCallback(() => {
      updateState({ isLoadingB: true });
      getAllSubscriptions();
      console.log(explosion, 'explosion');
    }, []),
  );

  // useEffect(() => {
  //   console.log(transportationArray, 'transportationArray');
  // }, [transportationArray]);



  const clientInfo = useSelector(state => state?.initBoot?.clientInfo);
  const shortCode = useSelector(state => state?.initBoot?.shortCode);
  console.log(clientInfo, shortCode, "dataaaaa")

  // const defaultLanguagae = useSelector(
  //   state => state?.initBoot?.defaultLanguage,
  // );

  // const styles = stylesFunction({defaultLanguagae});

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };

  //On country change
  const _onCountryChange = data => {
    updateState({ cca2: data.cca2, callingCode: data.callingCode[0] });
    return;
  };


  //Subscribe for specific plan
  const selectSpecificSubscriptionPlan = (item) => {
    console.log(item, '>>>>>>>>>>>>>selectSpecificSubscriptionPlan');
    updateState({ isLoading: true, planPrice: 120.0 });
    actions
      .selectSpecificSubscriptionPlan(
        `/${item?.slug}`,
        {},
        { client: clientInfo?.database_name },
      )
      .then((res) => {
        console.log('selectSpecificSubscriptionPlan', res);
        if (res && res.status == 'Success') {
          updateState({
            isLoadingB: false,
            isLoading: false,
            isModalVisibleForPayment: true,
            selectedPlan: res?.data?.sub_plan,
            clientCurrencyToBuy : res?.data?. clientCurrency,
            paymentOptions: res?.data?.payment_options
              ? res?.data?.payment_options
              : [],
          });
        } else {
          showError(res?.message);
          updateState({
            isLoadingB: false,
            isLoading: false,
          });
        }
      })
      .catch(errorMethod);
  };


  // Purchase Subscription 

  const purchaseSubscriptionPlan =  (item) => {
    console.log(item,"selectedPlan")
    updateState({isLoading:true, isLoadingB:true, })

      actions
          .purchaseSubscriptionPlan(
            `/${item?.slug}`,
            {},
            { client: clientInfo?.database_name },
          )
          .then((res) => {
            console.log(res,"ressssssss>>")
            getAllSubscriptions(true);
            updateState({
              isLoadingB: false,
              isLoading: false,
              isRefreshing: false,
              isModalVisibleForPayment: false 
            });
            showSuccess(res?.message); 
          })
          .catch(errorMethod);
    // if (!!item) {
       
    //     // let selectedMethod = selectedPaymentMethod.title.toLowerCase();
    //     actions
    //       .purchaseSubscriptionPlan(
    //         `/${item?.slug}`,
    //         {},
    //         { client: clientInfo?.database_name },
    //       )
    //       .then((res) => {
    //         getAllSubscriptions(true);
    //         updateState({
    //           isLoadingB: false,
    //           isLoading: false,
    //           isRefreshing: false,
    //         });
    //       })
    //       .catch(errorMethod);
    //   } else {
    //     if (res && res?.error) {
    //       updateState({
    //         isLoadingB: false,
    //         isLoading: false,
    //         isRefreshing: false,
    //       });
    //       showError(res?.error?.message);
    //     }
    //   }
  }


  //cancel subscription
  const cancelSubscription = (item) => {
    console.log(item, 'item>>selectSpecificSubscriptionPlan');
    updateState({ isLoading: true ,isLoadingB:true,});
    actions
      .cancelSubscriptionPlan(
        `/${item?.slug}`,
        {},
        { client: clientInfo?.database_name },
      )
      .then((res) => {
        console.log('selectSpecificSubscriptionPlan data', res);
        updateState({
          isLoadingB: false,
          isLoading: false,
        });
        showSuccess(res?.message);
        getAllSubscriptions();
      })
      .catch(errorMethod);
  };


  

  const getAllSubscriptions = (showSuccess) => {
    actions
      .getAllSubscriptions({},
        { client: clientInfo?.database_name },
      )
      .then((res) => {
        console.log('Get all subscription plans', res);
        updateState({
          isLoadingB: false,
          isLoading: false,
          isRefreshing: false,
          allSubscriptions: res?.data?.all_plans,
          currentSubscription: res?.data?.subscription,
          clientCurrency: res?.data?.clientCurrency,
        });
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({ isLoading: false, isLoadingB: false, isRefreshing: false , isModalVisibleForPayment:false });
    showError(error?.message || error?.error);
  };


  //Pull to refresh
  const handleRefresh = () => {
    updateState({ isRefreshing: true });
    getAllSubscriptions();
  };



  // Modal View functions  

  const modalMainContent = () => {
    return (
      <>
        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: moderateScale(20),
            marginVertical: moderateScale(20),
          }}>
          <Text style={styles.title}>{selectedPlan?.title}</Text>
          <Text
            style={[
              styles.title2,
              { marginTop: moderateScale(10) },
            ]}>{`${Number(selectedPlan?.price).toFixed(2)}/${selectedPlan?.frequency}`}</Text>
        </View>

        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: moderateScale(20),
            marginVertical: moderateScale(10),
          }}>
          <Text style={styles.title}>{strings.FEATURES_INCLUDED}</Text>
        
          <View
            style={{
              flexDirection: 'row',
              //   marginHorizontal: moderateScale(10),
              marginTop: moderateScale(10),
              alignItems: 'center',
            }}>
            <Image source={imagePath.tickGreen} />
            <Text
              style={[
                styles.title2,
                { marginLeft: moderateScale(10) },
              ]}> {`${strings.FIXED_COMMISION} : ${clientCurrencyToBuy?.symbol} ${Number(selectedPlan?.driver_commission_fixed).toFixed(2)}`} </Text>
              
          </View>

          <View
            style={{
              flexDirection: 'row',
              //   marginHorizontal: moderateScale(10),
              marginTop: moderateScale(10),
              alignItems: 'center',
            }}>
            <Image source={imagePath.tickGreen} />
            <Text
              style={[
                styles.title2,
                { marginLeft: moderateScale(10) },
              ]}> {`${strings.PERCENTAGE_COMMISION} : ${clientCurrencyToBuy?.symbol} ${Number(selectedPlan?.driver_commission_percentage.toFixed(2))}`} </Text>
          </View>
        </View>

        <View
          style={{
            height: 0.5,
            backgroundColor: colors.textGreyJ,
            marginTop: moderateScale(10),
          }}
        />

        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: moderateScale(20),
            marginVertical: moderateScale(10),
          }}>
          <View style={{}} >
            <Text style={styles.title}>{strings.DEBIT_FROM}</Text>
           <View style={{flexDirection:'row', alignItems:'center',}} >
           <Image
              style={{marginRight:moderateScale(4),height:moderateScaleVertical(18), width:moderateScale(18) }}
              source={imagePath.radioActive}
            />
           <Text style={{ ...styles.title2, marginVertical:moderateScale(10)}} > {strings.WALLET} </Text>
            
           </View>
          </View>
          <View>
            {/* <FlatList
              data={paymentOptions}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              // horizontal
              style={{ marginTop: moderateScaleVertical(10) }}
              keyExtractor={(item, index) => String(index)}
              // renderItem={_renderItemPayments}
              ListEmptyComponent={() => (
                <Text style={{ textAlign: 'center' }}>
                  {strings.NO_PAYMENT_METHOD}
                </Text>
              )}
            /> */}
          </View>
        </View>
      </>
    );
  };

  const topCustomComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: moderateScale(20),
        }}>
        <Text style={styles.subscription2}>{strings.SUBSCRIPTION}</Text>
        <TouchableOpacity
          onPress={() => updateState({ isModalVisibleForPayment: false })}>
          <Image source={imagePath.ic_cross} />
        </TouchableOpacity>
      </View>
    );
  };

  const modalBottomContent = () => {
    return (
      <>
        {selectedPaymentMethod?.id != 17 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: moderateScale(10),
            }}>
            <GradientButton
              // colorsArray={[
              //   themeColors.primary_color,
              //   themeColors.primary_color,
              // ]}
              textStyle={styles.textStyle}
              onPress={() => updateState({ isModalVisibleForPayment: false })}
              borderRadius={moderateScale(5)}
              containerStyle={{
                marginHorizontal: moderateScale(10),
                // width: paymentOptions.length ? width / 3 : width - 60,
                width: width / 4
              }}
              btnText={strings.CANCEL} 
            />
            <GradientButton
              // colorsArray={[
              //   themeColors.primary_color,
              //   themeColors.primary_color,
              // ]}
              textStyle={styles.textStyle}
              onPress={()=> {purchaseSubscriptionPlan(selectedPlan)} }
              borderRadius={moderateScale(5)}
              containerStyle={{
                marginHorizontal: moderateScale(10),
                width: width / 3
                // width: paymentOptions.length ? width / 3 : width - 60,
              }}
              btnText={strings.BUY_NOW}
            />


            {/* {paymentOptions.length ? (
              <GradientButton
                // colorsArray={[
                //   themeColors.primary_color,
                //   themeColors.primary_color,
                // ]}
                textStyle={styles.textStyle}
                // onPress={payAmount}
                borderRadius={moderateScale(5)}
                containerStyle={{
                  marginHorizontal: moderateScale(10),
                  width: width / 3,
                }}
                btnText={`Pay`}
              />
            ) : null} */}
          </View>
        ) : (
          <></>
        )}
      </>
    );
  };


  // render List Header of flat List
  const listHeaderComponent = () => {
    return (
      <>
        {!!currentSubscription && (
          <>
            <View style={{ marginVertical: moderateScale(10) }}>
              <Text
              style={styles.subscriptionTitle}
                // style={
                //   isDarkMode
                //     ? [
                //       styles.subscriptionTitle,
                //       { color: MyDarkTheme.colors.text },
                //     ]
                //     : styles.subscriptionTitle
                // }
                >
              {strings.MY_SUBSCRIPTION}
              </Text>
            </View>
            <SubscriptionComponent2
              data={currentSubscription?.plan}
              subscriptionData={currentSubscription}
              clientCurrency={clientCurrency}
              allSubscriptions={allSubscriptions}
              currentSubscription={currentSubscription.subscription_id}
              payNowUpcoming={() =>
                selectSpecificSubscriptionPlan(currentSubscription?.plan)
              }
              cancelSubscription={() => cancelSubscription(currentSubscription)}
              isCancelBtn={true}
            />
          </>
        )}
      </>
    );
  };
  const renderProduct = ({ item, index }) => {
    
    return (
      <View>
        {!!(index == 0) && (
          <View
            style={{
              marginTop: currentSubscription ? moderateScale(40) : null,
              marginBottom: moderateScale(20),
            }}>
            <Text style={styles.subscriptionTitle}>
              {currentSubscription
                ?` ${strings.OTHER_SUBSCRIPTION}`
                : `${strings.ALL_SUBSCRIPTION}`}
            </Text>
          </View>
        )}
        <SubscriptionComponent2
          data={item}
          clientCurrency={clientCurrency}
          onPress={(item) => selectSpecificSubscriptionPlan(item)}
          payNowUpcoming={() =>
            selectSpecificSubscriptionPlan(currentSubscription?.plan)
          }
          subscriptionData={currentSubscription}
          currentSubscription={item?.id == currentSubscription?.subscription_id}
          cancelSubscription={() => cancelSubscription(item)}
        />
      </View>
    );
  };


  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoadingB={isLoading}
      source={loaderOne}
    >
      <Header
        headerStyle={{ backgroundColor: colors.white }}
        // hideRight={true}
        // onPressLeft={()=>navigation.goBack()}
        centerTitle={strings.SUBSCRIPTIONS}
      />
      <View style={{ ...commonStyles.headerTopLine }} />
      <View style={styles.rootContainer}>
            <FlatList
              data={(!isLoadingB && allSubscriptions) || []}
              renderItem={renderProduct}
              keyExtractor={(item, index) => String(index)}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              ListHeaderComponent={listHeaderComponent()}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              initialNumToRender={12}
              maxToRenderPerBatch={10}
              windowSize={10}
              ListFooterComponent={() => <View style={{ height: 40 }} />}
              ListEmptyComponent={<ListEmptySubscriptions isLoading={isLoadingB} />}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={colors.themeColor}
                />
              }
            />
      </View>
      <ModalView
        data={selectedPlan}
        isVisible={isModalVisibleForPayment}
        // onClose={() => updateState({isModalVisibleForPayment: false})}

        leftIcon={imagePath.ic_cross}
        topCustomComponent={topCustomComponent}
        modalMainContent={modalMainContent}
        modalBottomContent={modalBottomContent}
        avoidKeyboard={Platform.OS == 'ios' ? true : false}
      />
    </WrapperContainer>
  );
}
