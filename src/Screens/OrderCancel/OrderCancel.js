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
  showSuccess,
} from '../../utils/helperFunctions';
import styles from './styles';
import Communications from 'react-native-communications';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ButtonComponent from '../../Components/ButtonComponent';
import actions from '../../redux/actions';
import navigationStrings from '../../navigation/navigationStrings';

export default function OrderCancel({route, navigation}) {
  let taskDetail = route?.params?.data;
  const {clientInfo} = useSelector(state => state?.initBoot);

  const [state, setState] = useState({
    isLoading: true,
    cancelReasons: [],
    selectedReason: null,
    inputReason: '',
  });

  const {isLoading, cancelReasons, selectedReason, inputReason} = state;
  const commonStyles = commonStylesFunc({fontFamily});
  const updateState = data => setState(state => ({...state, ...data}));

  useEffect(() => {
    getAllCancellationReason();
  }, []);

  const getAllCancellationReason = () => {
    actions
      .getListOfAllCancelReason({}, {client: clientInfo?.database_name})
      .then(res => {
        updateState({
          isLoading: false,
          cancelReasons: res?.data,
        });
      })
      .catch(errorMethod);
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
      data['reject_reason'] = selectedReason?.reason;
      console.log(data, 'updateTaskStatus>>>DATA');
      console.log(taskDetail?.order_id, 'orderId');
      actions
        .submitCancelOrderRequest(`/${taskDetail?.order_id}`, data, {
          client: clientInfo?.database_name,
        })
        .then(res => {
          console.log(res, 'submitReason>res>res');
          updateState({isLoading: false});
          navigation.navigate(navigationStrings.DASHBOARD);
          showSuccess(res?.message);
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
        customCenter={() => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.textStyle}>{strings.RESEONCANCEL}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={{...commonStyles.headerTopLine}} />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        {cancelReasons.map((i, inx) => {
          return (
            <TouchableOpacity
              key={String(inx)}
              activeOpacity={1}
              onPress={() => onselectReason(i)}
              style={styles.rowViewTaskCancel}>
              <Text style={styles.reason}>{i.reason}</Text>
              {selectedReason && selectedReason?.id == i?.id && (
                <Image source={imagePath?.task_green_tik} />
              )}
            </TouchableOpacity>
          );
        })}
        {!isLoading && (
          <TextInput
            multiline={true}
            value={inputReason}
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
