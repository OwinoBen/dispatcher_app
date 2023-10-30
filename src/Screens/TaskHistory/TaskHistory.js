import {debounce} from 'lodash';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import DatePickerModal from '../../Components/DatePickerModal';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import TaskListCard from '../../Components/TaskListCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
// import store from '../../redux/store';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import {moderateScaleVertical} from '../../styles/responsiveSize';
import {showError} from '../../utils/helperFunctions';
import stylesFunction from './styles';
export default function TaskHistory({route, navigation}) {
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
  });

  const {
    isLoading,
    totalCashCollected,
    allTaskInHistory,
    selectedDate,
    savedDate,
    isRefreshing,
    pageNo,
    isModalVisibleForDateTime,
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

  useEffect(() => {
    {
      (isLoading || isRefreshing) && getAllTaskHistory();
    }
  }, [isLoading, isRefreshing]);

  const getAllTaskHistory = () => {
    let url = '';
    if (selectedDate) {
      url = `?from_date=${moment(selectedDate).format(
        'YYYY-MM-DD',
      )}&to_date=${moment(selectedDate).format('YYYY-MM-DD')}`;
    } else {
      url = `?from_date=&to_date=`;
    }
    console.log(url, 'url');
    console.log(clientInfo?.database_name, 'Client>>>>>>>>>');
    actions
      .getListOfTaskHistory(url, {}, {client: clientInfo?.database_name})
      .then(res => {
        console.log(res, 'getAllTaskHistory>>>getAllTaskHistory data');
        let totalAmount =
          res?.data?.totalCashCollected
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') || 0.0;
        updateState({
          isLoading: false,
          isRefreshing: false,
          totalCashCollected: totalAmount,
          allTaskInHistory: res?.data?.tasks,
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
  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageNo: pageNo + 1});
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
  const renderTaskList = ({item, index}) => {
    return (
      <>
      
      <TaskListCard
        data={item}
        index={index}
        allTasks={allTaskInHistory}
        showCurrency={true}
        _onPressTask={() => _onPressTask(item)}
        isFromHistory={true}
        previousData={allTaskInHistory[index-1]}
       
      />
      </>
    );
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  const onDateChange = value => {
    console.log(value, 'value>value>value');
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




  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoading={isLoading}
      source={loaderOne}>
      <Header
        headerStyle={{backgroundColor: colors.white}}
        leftIconStyle={{tintColor: colors.themeColor}}
        // hideRight={true}
        // onPressLeft={()=>navigation.goBack()}
        centerTitle={strings.TASKHISTORY}
      />
      <View style={{...commonStyles.headerTopLine}} />

      <View style={styles.cashCollectionContainer}>
        <View style={styles.cashTextView}>
          <Text style={styles.cashCollected}>
            {`${strings.CASHCOLLECTED} :- ${totalCashCollected}`}
          </Text>
        </View>
        <View
          style={{
            ...styles.clearViewStyle,
          }}>
          {selectedDate ? (
            <TouchableOpacity
              onPress={() =>
                updateState({
                  selectedDate: null,
                  savedDate: null,
                  isLoading: true,
                })
              }
              style={styles.viewStyle}>
              <Text style={styles.clear}>{strings.CLEAR}</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => updateState({isModalVisibleForDateTime: true})}
            style={styles.dateSelectView}>
            <Text style={styles.selectedDate}>
              {selectedDate
                ? moment(selectedDate).format('DD-MM-YYYY')
                : strings.SELECTADATE}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateState({isModalVisibleForDateTime: true})}
            style={{justifyContent: 'center'}}>
            <Image source={imagePath.taskHistory} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{backgroundColor: colors.backGround, flex: 1}}>
        {!isLoading ? (
          <FlatList
            data={allTaskInHistory}
            extraData={allTaskInHistory}
            renderItem={renderTaskList}
            keyExtractor={(item, index) => String(index)}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
            }}
            contentContainerStyle={{
              flexGrow: 1,
              marginVertical: moderateScaleVertical(20),
            }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={colors.themeColor}
              />
            }
            onEndReached={onEndReachedDelayed}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => (
              <View style={{height: moderateScaleVertical(65)}} />
            )}
          />
        ) : (
          <></>
        )}
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
