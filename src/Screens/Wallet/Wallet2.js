import {useFocusEffect} from '@react-navigation/native';
import {debounce} from 'lodash';
import moment from 'moment';
import React, {useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import DatePickerModal from '../../Components/DatePickerModal';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
// import store from '../../redux/store';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import {moderateScale, textScale} from '../../styles/responsiveSize';
import {currencyNumberFormatter} from '../../utils/commonFunction';
import {colorArray} from '../../utils/constants/ConstantValues';
import {showError} from '../../utils/helperFunctions';
import stylesFunction from './styles';

let isNoMore = false;
let onEndReachedCalledDuringMomentum = false;

export default function Wallet({route, navigation}) {
  const userData = useSelector(state => state?.auth?.userData);
  console.log(userData, 'userData');
  const [state, setState] = useState({
    isLoading: true,
    totalCashCollected: 0,
    allTaskInHistory: [],
    isRefreshing: false,
    pageNo: 1,
    isModalVisibleForDateTime: false,
    selectedDate: null,
    savedDate: null,
    lifetimeAmount: 0.0,
    currentAmount: 0.0,
    limit: 50,
    isLoadMore: false,
  });

  const {
    lifetimeAmount,
    currentAmount,
    isLoading,
    totalCashCollected,
    allTaskInHistory,
    selectedDate,
    savedDate,
    isRefreshing,
    pageNo,
    isModalVisibleForDateTime,
    limit,
    isLoadMore,
  } = state;
  const commonStyles = commonStylesFunc({fontFamily});
  const updateState = data => setState(state => ({...state, ...data}));
  const clientInfo = useSelector(state => state?.initBoot?.clientInfo);

  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );

  const styles = stylesFunction({defaultLanguagae});

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  useFocusEffect(
    React.useCallback(() => {
      getWalletDataOfDriver(1, true);
      isNoMore = false;
      onEndReachedCalledDuringMomentum = false;
    }, []),
  );

  const getWalletDataOfDriver = (pageNo, searchAgain = false) => {
    actions
      .getWalletData(
        // `/${userData?.id}`,
        `/${userData?.id}?page=${pageNo}&limit=${limit}`,
        {},
        {client: clientInfo?.database_name},
      )
      .then(res => {
        console.log(res, 'getWalletDataOfDriver>>>getWalletDataOfDriver data');
        if (res?.payments?.data.length == 0) {
          isNoMore = true;
        }
        updateState({
          lifetimeAmount: res?.lifetime_earnings,
          currentAmount: Number(res?.final_balance),
          allTaskInHistory: searchAgain
            ? res?.payments.data
            : [...allTaskInHistory, ...res?.payments?.data],
          isLoading: false,
          isRefreshing: false,
          isLoadMore: false,
          pageNo: searchAgain ? 1 : pageNo + 1,
        });
      })
      .catch(errorMethod);
  };

  //Error handling in api
  const errorMethod = error => {
    updateState({isLoading: false, isRefreshing: false, isLoading: false});
    showError(error?.message || error?.error);
  };

  //pagination of data
  const onEndReached = () => {
    if (!onEndReachedCalledDuringMomentum && !isNoMore) {
      updateState({isLoadMore: true});
      getWalletDataOfDriver(pageNo + 1, false);
    }
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const _onPressTask = item => {
    moveToNewScreen(navigationStrings.TASKDETAIL, {
      item: item,
      fromHistory: true,
    })();
  };

  const getDynamicUpdateOnValues = data => {
    var colorData = colorArray;
    return colorData[allTaskInHistory.indexOf(data) % colorData.length];
  };
  const renderTaskList = ({item, index}) => {
    return (
      <View
        style={{
          backgroundColor: colors.lightGreyBg3,
          marginBottom: moderateScale(15),
          marginHorizontal: moderateScale(10),
          borderRadius: moderateScale(10),
          paddingVertical: moderateScale(20),
          paddingHorizontal: moderateScale(5),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 0.2}}>
            <View
              style={[
                styles.circleView,
                {
                  backgroundColor:
                    item?.transaction_type == 'wallet'
                      ? item?.type == 'deposit'
                        ? colors.green
                        : colors.redB
                      : item?.transaction_type == 'payment'
                      ? item?.cr > 0
                        ? colors.green
                        : colors.redB
                      : colors.blueB,
                },
              ]}>
              <Text style={styles.messageInitial}>
                {item?.transaction_type == 'wallet'
                  ? item?.type == 'deposit'
                    ? 'C'
                    : 'D'
                  : item?.transaction_type == 'payment'
                  ? item?.cr > 0
                    ? 'C'
                    : 'D'
                  : 'T'}
              </Text>
            </View>
          </View>

          <View style={{flex: 0.6, justifyContent: 'center'}}>
            <Text numberOfLines={2} style={styles.message}>
              {item?.transaction_type == 'wallet'
                ? item?.type == 'deposit'
                  ? strings.WALLET_CREDITED
                  : strings.WALLET_DEBITED
                : item?.transaction_type == 'payment'
                ? item?.cr > 0
                  ? strings.PAYMENTCREDITED
                  : strings.PAYMENTDEBITED
                : item?.order?.cash_to_be_collected > 0
                ? strings.PAYMENTCREDITED
                : strings.PAYMENTDEBITED}
            </Text>
            <Text numberOfLines={1} style={styles.dateTime}>
              {moment(item?.created_at).format('lll')}
            </Text>
          </View>

          <View
            style={{
              justifyContent: 'center',
              minWidth: moderateScale(100),
              alignItems: 'center',
            }}>
            <Text
              style={[
                styles.amount,
                {
                  color:
                    item?.status > 0
                      ? colors.green
                      : item?.task_type_id
                      ? colors.lightGreyBg2
                      : colors.black,
                },
              ]}>
              {item?.transaction_type == 'wallet'
                ? item?.type == 'deposit'
                  ? `+ ${
                      userData?.client_preference?.currency?.symbol
                    }${currencyNumberFormatter(
                      Number(item?.amount).toFixed(2),
                    )}`
                  : `- ${
                      userData?.client_preference?.currency?.symbol
                    }${currencyNumberFormatter(
                      Number(item?.amount).toFixed(2),
                    )}`
                : item?.transaction_type == 'payment'
                ? item?.cr
                  ? `+ ${
                      userData?.client_preference?.currency?.symbol
                    }${currencyNumberFormatter(Number(item?.cr).toFixed(2))}`
                  : `- ${
                      userData?.client_preference?.currency?.symbol
                    }${currencyNumberFormatter(Number(item?.dr).toFixed(2))}`
                : item?.task_type_id && `${strings.TASK} ${item?.id}`}
            </Text>
          </View>
        </View>

        {!!item?.task_type_id && (
          <View style={{...styles.moneyViewTransaction}}>
            <View
              style={{
                flex: 0.33,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.currency}>
                {userData?.client_preference?.currency?.symbol}
                {item?.order?.cash_to_be_collected}
              </Text>
              <Text style={styles.earningBottomTextLable}>
                {strings.CASHCOLLECTEDCAPS}
              </Text>
            </View>
            <View
              style={{
                flex: 0.33,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.currency}>
                {userData?.client_preference?.currency?.symbol}
                {item?.order?.driver_cost}
              </Text>
              <Text style={styles.earningBottomTextLable}>
                {strings.ORDEREARNING}
              </Text>
            </View>
            {/* <View
              style={{
                flex: 0.33,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.amountToReturn}>{userData?.client_preference?.currency?.symbol}{'-100.00'}</Text>
              <Text style={styles.earningBottomTextLable}>{strings.NET}</Text>
            </View> */}
          </View>
        )}

        {/* address view */}
        {!!item?.task_type_id && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={imagePath?.location} />
            <Text
              style={[styles.address, {marginLeft: moderateScale(10)}]}
              numberOfLines={2}>
              {item?.location ? item?.location?.address : ''}
            </Text>
          </View>
        )}
      </View>
    );
  };

  console.log('page no', pageNo);

  //Pull to refresh
  const handleRefresh = () => {
    getWalletDataOfDriver(1, true); //setPageNo 1 and limit 50
    updateState({pageNo: 1, isRefreshing: true});
  };

  const onDateChange = value => {
    console.log('value>value>value');
    updateState({
      savedDate: value,
    });
  };

  const onSelectDate = () => {
    updateState({isModalVisibleForDateTime: false});
    if (savedDate) {
      updateState({
        selectedDate: savedDate,
        isLoading: true,
      });
    } else {
      updateState({
        selectedDate: new Date(),
        savedDate: new Date(),
        isLoading: true,
      });
    }
  };

  /*****TOP HEADER REVENUE VIEW***** */
  const revenueView = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <LinearGradient
          style={[styles.gradientStyle, {marginRight: moderateScale(20)}]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={[colors?.orangeC, colors?.orangeC, colors?.orangeC]}>
          <Image
            source={imagePath.lifeTimeEarn}
            style={{marginBottom: moderateScale(10)}}
          />
          <Text style={styles.totalRevenue}>{strings.LIFETIMEEARNING}</Text>

          <Text style={styles.amountText}>
            {userData?.client_preference?.currency?.symbol}
            {currencyNumberFormatter(Number(lifetimeAmount).toFixed(2))}
          </Text>
        </LinearGradient>
        <LinearGradient
          style={styles.gradientStyle}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={[colors?.themeColor, colors?.themeColor, colors?.themeColor]}>
          <Image
            source={imagePath.currentBalance}
            style={{marginBottom: moderateScale(10)}}
          />
          <Text style={styles.totalRevenue}>{strings.TOTALREVNUE}</Text>
          <Text style={styles.amountText}>
            {userData?.client_preference?.currency?.symbol}
            {currencyNumberFormatter(Number(currentAmount).toFixed(2))}
          </Text>
        </LinearGradient>
      </View>
    );
  };
  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoading={isLoading}
      source={loaderOne}>
      <Header
        headerStyle={{backgroundColor: colors.white}}
        leftIconStyle={{tintColor: colors.themeColor}}
        customRight={() => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate(navigationStrings.ADD_MONEY)}
            style={{
              width: moderateScale(85),
              backgroundColor: colors.themeColor,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: moderateScale(5),
              paddingVertical: moderateScale(3),
            }}>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: textScale(11),
                color: colors.white,
              }}>
              {strings.ADD_MONEY}
            </Text>
          </TouchableOpacity>
        )}
        // onPressLeft={()=>navigation.goBack()}
        centerTitle={strings.WALLET}
      />
      {/* <View style={{...commonStyles.headerTopLine}} /> */}

      <View
        style={{
          marginHorizontal: moderateScale(10),
          marginVertical: moderateScale(10),
        }}>
        {revenueView()}
      </View>
      <View
        style={{
          marginHorizontal: moderateScale(10),
          marginVertical: moderateScale(10),
        }}>
        <Text style={styles.transactionHistory}>
          {strings.TRANSACTIONHISTORY}
        </Text>
      </View>
      <View style={{backgroundColor: colors.backGround, flex: 1}}>
        <FlatList
          data={allTaskInHistory}
          extraData={allTaskInHistory}
          renderItem={renderTaskList}
          keyExtractor={(item, index) => String(index)}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.themeColor}
            />
          }
          onEndReached={onEndReached}
          // onEndReachedThreshold={0.5}
        />
      </View>
      <DatePickerModal
        isVisible={isModalVisibleForDateTime}
        date={savedDate}
        onclose={() => updateState({isModalVisibleForDateTime: false})}
        onSelectDate={() => onSelectDate()}
        onDateChange={value => onDateChange(value)}
      />
    </WrapperContainer>
  );
}
