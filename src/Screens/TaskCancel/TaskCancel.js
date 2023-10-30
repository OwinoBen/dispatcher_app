import React, {useState, useEffect} from 'react';
import {
  Image,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
  TextInput,
} from 'react-native';
import MapView from 'react-native-maps';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
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
import {
  getColorCodeWithOpactiyNumber,
  showError,
} from '../../utils/helperFunctions';
import styles from './styles';
import Communications from 'react-native-communications';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ButtonComponent from '../../Components/ButtonComponent';
import actions from '../../redux/actions';
import navigationStrings from '../../navigation/navigationStrings';

var ACTION_TIMER = 1500;
var COLORS = ['#8FEE90', '#27A468'];
var _value = 0;
export default function TaskCancel({route, navigation}) {
  const userData = useSelector(state => state?.auth?.userData);
  let taskDetail = route?.params?.data;
  console.log(taskDetail, 'taskDetail>>>');
  const [state, setState] = useState({
    isLoading: false,
    cancelReasons: [
      {
        id: 1,
        reason: strings.DRIVERVEHICLE,
      },
      {
        id: 2,
        reason: strings.DESTINATIONUNREACHABLE,
      },
      {
        id: 3,
        reason: strings.RECIPIENTUNAVAILABLE,
      },
      {
        id: 4,
        reason: strings.REFUSEDINCORRECTMISSING,
      },
      {
        id: 5,
        reason: strings.REFUSEDDAMAGED,
      },
      {
        id: 6,
        reason: strings.UNABLETOLOCATE,
      },
      {
        id: 7,
        reason: strings.OTHER,
      },
    ],
    selectedReason: null,
    inputReason: '',
  });

  const {isLoading, cancelReasons, selectedReason, inputReason} = state;
  const commonStyles = commonStylesFunc({fontFamily});
  const updateState = data => setState(state => ({...state, ...data}));
  const clientInfo = useSelector(state => state?.initBoot?.clientInfo);

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  //Error handling in api
  const errorMethod = error => {
    console.log(error, 'error');
    updateState({isLoading: false, isRefreshing: false, isLoading: false});
    showError(error?.message || error?.error);
  };

  const onselectReason = item => {
    updateState({selectedReason: item});
  };

  const submitReason = () => {
    if (!selectedReason) {
      showError(strings.SELECTREASON);
    } else if (selectedReason && selectedReason?.id == 7 && inputReason == '') {
      showError(strings.PLEASEINPUTSOMEREADY);
    } else {
      updateState({isLoading: true});
      let data = {};
      data['task_status'] = 5;
      data['note'] = selectedReason?.reason;
      data['task_id'] = taskDetail?.id;
      console.log(data, 'updateTaskStatus>>>DATA');
      actions
        .updateTask(data, {client: clientInfo?.database_name})
        .then(res => {
          console.log(res, 'submitReason>res>res');
          updateState({isLoading: false});
          if (res?.data) {
            navigation.navigate(navigationStrings.DASHBOARD);
          }
        })
        .catch(errorMethod);
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
        customLeft={() => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={imagePath.backArrow} />
            <Text style={styles.textStyle}>{strings.TASK}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={{...commonStyles.headerTopLine}} />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        {cancelReasons.map((i, inx) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onselectReason(i)}
              style={{
                ...styles.rowViewTaskCancel,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <Image
                source={
                  selectedReason?.id == i?.id
                    ? imagePath?.radioActive
                    : imagePath?.radioInactive
                }
              />
              <Text style={{...styles.reason, marginLeft: moderateScale(10)}}>
                {i.reason}
              </Text>
            </TouchableOpacity>
          );
        })}
        {selectedReason?.id == 7 && (
          <TextInput
            multiline={true}
            value={inputReason}
            placeholder="Enter your reason here"
            pla
            textAlignVertical={'top'}
            style={styles.textInputStyle}
            onChangeText={text => updateState({inputReason: text})}
          />
        )}
      </KeyboardAwareScrollView>

      <ButtonComponent buttonTitle={strings.DONE} onPress={submitReason} />
    </WrapperContainer>
  );
}
