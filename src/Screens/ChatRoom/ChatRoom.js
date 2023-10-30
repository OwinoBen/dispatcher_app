import React, {useState, useCallback, useEffect, useRef} from 'react';
import {Text, View, FlatList, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import colors from '../../styles/colors';
import WrapperContainer from '../../Components/WrapperContainer';
import actions from '../../redux/actions';
import {moderateScale} from '../../styles/responsiveSize';
import _ from 'lodash';
import {showError} from '../../utils/helperFunctions';
import navigationStrings from '../../navigation/navigationStrings';
import stylesFun from './styles';
import moment from 'moment';
import CircularImages from '../../Components/CircularImages';
import strings from '../../constants/lang';
import fontFamily from '../../styles/fontFamily';
import imagePath from '../../constants/imagePath';
import socketServices from '../../utils/scoketService';

export default function ChatRoom({navigation, route}) {
  const clientInfo = useSelector(state => state?.initBoot?.clientInfo);
  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );
  const userData = useSelector(state => state?.auth?.userData);

  const paramData = route?.params?.data;

  console.log('userDatauserDatauserData', userData);

  const styles = stylesFun({fontFamily});

  const [state, setState] = useState({
    roomData: [],
    isLoading: true,
    sendMessage: false,
  });
  const {roomData, isLoading, sendMessage} = state;

  const updateState = data => setState(state => ({...state, ...data}));

  const isFocused = useIsFocused();

  const roomDataRef = useRef([]);

  useEffect(() => {
    socketServices.on('room-created', data => {
      console.log(data, 'new room created');
      fetchData();
    });
    return () => {
      socketServices.removeListener('room-created');
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  useEffect(() => {
    socketServices.on('new-app-message', data => {
      fetchData();
    });
    return () => {
      socketServices.removeListener('new-app-message');
    };
  }, []);

  let fetchData = async () => {
    if (_.isEmpty(roomData)) {
      updateState({isLoading: true});
    }
    try {
      let headerData = {
        client: clientInfo?.database_name,
        language: defaultLanguagae?.value ? defaultLanguagae?.value : 'en',
      };
      let apiData = {
        agent_id: userData?.id,
        type: 'agent_to_user',
        sub_domain: clientInfo?.custom_domain,
        agent_db: clientInfo?.database_name,
        client_id: String(clientInfo?.client_db_id),
      };
      console.log('apiDataapiDataapiData', apiData);
      const res = await actions.fetchAgentChatRoom(apiData, headerData);
      updateState({isLoading: false});
      if (!!res?.roomData && isFocused) {
        roomDataRef.current = res.roomData;
        updateState({roomData: res.roomData});
      }
      console.log('room res++++', res);
    } catch (error) {
      console.log('error raised in start chat api', error);
      showError(error?.message);
      updateState({isLoading: false});
    }
  };

  const goToChatRoom = useCallback(item => {
    navigation.navigate(navigationStrings.CHAT_SCREEN, {
      data: {...item, id: item?.order_vendor_id},
    });
  }, []);

  const renderItem = useCallback(({item, index}) => {
    let isAnyMessage = _.isEmpty(item?.chat_Data);
    return (
      <TouchableOpacity
        onPress={() => goToChatRoom(item)}
        style={styles.boxStyle}>
        <View style={styles.flexView}>
          <Text style={styles.textStyle}>
            <Text>Order</Text> # {item?.room_id}
          </Text>
          {!isAnyMessage ? (
            <Text style={styles.timeStyle}>
              {moment(item?.chat_Data[0]?.created_date).format('LLL')}
            </Text>
          ) : null}
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {_.isEmpty(item?.user_Data) ? null : (
            <CircularImages data={item?.user_Data} />
          )}
          {!isAnyMessage ? (
            <Text numberOfLines={2} style={styles.textDesc}>
              {item?.chat_Data[0]?.message}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }, []);

  const listEmptyComponent = useCallback(() => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image source={imagePath.icChatroom} />
      </View>
    );
  }, []);

  const awesomeChildListKeyExtractor = useCallback(
    item => `awesome-child-key-${item?._id}`,
    [roomData],
  );

  const itemSeparatorComponent = useCallback(() => {
    return <View style={styles.borderStyle} />;
  }, []);

  return (
    <WrapperContainer
      bgColor={colors.white}
      statusBarColor={colors.white}
      isLoading={isLoading}>
      <Header leftIcon={imagePath.backArrow} centerTitle={strings.CHAT_ROOM} />
      <View style={styles.container}>
        <FlatList
          data={roomData}
          renderItem={renderItem}
          ListEmptyComponent={!isLoading && listEmptyComponent}
          keyExtractor={awesomeChildListKeyExtractor}
          ItemSeparatorComponent={itemSeparatorComponent}
          contentContainerStyle={{flexGrow: 1}}
        />
      </View>
    </WrapperContainer>
  );
}
