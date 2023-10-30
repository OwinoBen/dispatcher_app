import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  ImageBackground,
} from 'react-native';
import {GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import socketServices from '../../utils/scoketService';
import {useSelector} from 'react-redux';
import imagePath from '../../constants/imagePath';
import Header from '../../Components/Header';
import colors from '../../styles/colors';
import WrapperContainer from '../../Components/WrapperContainer';
import actions from '../../redux/actions';
import {getImageUrl} from '../../utils/helperFunctions';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import _ from 'lodash';
import CircularImages from '../../Components/CircularImages';
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native-gesture-handler';
import fontFamily from '../../styles/fontFamily';
import {useFocusEffect} from '@react-navigation/native';

export default function ChatScreen({route}) {
  const paramData = route.params.data;
  const clientInfo = useSelector(state => state?.initBoot?.clientInfo);
  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );

  const userData = useSelector(state => state?.auth?.userData);

  console.log('paramDataparamData', paramData);

  const styles = stylesFun({});

  const [messages, setMessages] = useState([]);
  const [state, setState] = useState({
    showParticipant: false,
    isLoading: false,
    roomUsers: [],
    allRoomUsersAppartFromAgent: [],
    allAgentIds: [],
    allAgentIds: [],
  });
  const {
    isLoading,
    roomUsers,
    showParticipant,
    allRoomUsersAppartFromAgent,
    allAgentIds,
  } = state;

  const updateState = data => setState(state => ({...state, ...data}));

  useEffect(() => {
    socketServices.on('new-message', data => {
      console.log(data, 'data to be emitted in chat screen');
      if (
        paramData?.room_id == data?.message?.roomData?.room_id &&
        paramData?.room_name == data?.message?.roomData?.room_name
      ) {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, {
            ...data.message.chatData,
            user: {_id: 0},
          }),
        );
      }
      // fetchAllMessages()
      fetchAllRoomUser();
    });
    return () => {
      socketServices.removeListener('new-message');
      socketServices.removeListener('save-message');
    };
  }, []);

  console.log('all messages', messages);

  useEffect(() => {
    updateState({isLoading: true});
    fetchAllRoomUser();
    fetchAllMessages();
  }, []);

  const fetchAllMessages = useCallback(async () => {
    try {
      const apiData = `/${paramData?._id}`;
      const res = await actions.getAllMessages(apiData, {});
      console.log('fetchAllMessages res', res);
      updateState({isLoading: false});
      if (!!res) {
        setMessages(res.reverse());
      }
    } catch (error) {
      console.log('error raised in fetchAllMessages api', error);
      updateState({isLoading: false});
    }
  }, []);

  const fetchAllRoomUser = async () => {
    try {
      const apiData = `/${paramData?._id}`;
      const res = await actions.getAllRoomUser(
        apiData,
        {},
        {
          client: clientInfo?.database_name,
          language: defaultLanguagae?.value ? defaultLanguagae?.value : 'en',
        },
      );
      console.log(res, 'resresresres');
      if (!!res?.userData) {
        const allRoomUsersAppartFromAgent = res?.userData.filter(function (el) {
          return el.user_type != 'agent';
        });
        const allAgentIds = res?.userData.filter(function (el) {
          return el.user_type == 'agent';
        });

        updateState({
          allRoomUsersAppartFromAgent: allRoomUsersAppartFromAgent,
          allAgentIds: allAgentIds,
          roomUsers: res?.userData,
        });
      }
    } catch (error) {
      console.log('error raised in fetchAllRoomUser api', error);
    }
  };

  const onSend = useCallback(
    async (messages = []) => {
      if (String(messages[0].text).trim().length < 1) {
        return;
      }
      try {
        const apiData = {
          room_id: paramData?._id,
          message: messages[0].text,
          user_type: 'agent',
          to_message: 'to_user',
          from_message: 'from_agent',
          user_id: userData?.id || '',
          email: userData?.email || '',
          username: userData?.name || '',
          phone_num: `${userData.phone_number}`,
          display_image: userData?.image_url,
          // sub_domain: clientInfo?.custom_domain,
          //'room_name' =>$data->name,
          chat_type: 'agent_to_user',
        };
        console.log('sending api data', apiData);
        const res = await actions.sendMessage(apiData, {
          client: clientInfo?.database_name,
          language: defaultLanguagae?.value ? defaultLanguagae?.value : 'en',
        });
        console.log('on send message res', res);
        socketServices.emit('save-message', res);

        await sendToUserNotification(paramData?._id, messages[0].text);
      } catch (error) {
        console.log('error raised in sendMessage api', error);
      }
    },
    [allRoomUsersAppartFromAgent, allAgentIds],
  );

  const sendToUserNotification = async (id, text) => {
    let apiData = {
      user_ids:
        allRoomUsersAppartFromAgent.length == 0
          ? [{auth_user_id: paramData?.order_user_id}]
          : allRoomUsersAppartFromAgent,
      roomId: id,
      roomIdText: paramData?.room_id,
      text_message: text,
      chat_type: paramData?.type,
      order_number: paramData?.room_id,
      all_agentids: allAgentIds,
      order_vendor_id: paramData?.order_vendor_id,
      username: userData?.name,
      vendor_id: paramData?.vendor_id,
      auth_id: userData?.id,
      web: false,
      from: 'from_dispatcher',
      order_id: paramData?.order_id,
    };
    console.log(
      allRoomUsersAppartFromAgent,
      'sending api data>>>>> notification',
      apiData,
    );

    try {
      const res = await actions.sendNotification(apiData, {
        client: clientInfo?.database_name,
        language: defaultLanguagae?.value ? defaultLanguagae?.value : 'en',
      });
      console.log('res sendNotification', res);
    } catch (error) {
      console.log('error raised in sendToUserNotification api', error);
    }
  };

  const showRoomUser = useCallback(
    props => {
      if (_.isEmpty(roomUsers)) {
        return null;
      }
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => updateState({showParticipant: true})}>
          <CircularImages size={25} data={roomUsers} />
        </TouchableOpacity>
      );
    },
    [roomUsers],
  );

  const renderMessage = useCallback(props => {
    const {currentMessage} = props;
    let isRight = currentMessage?.auth_user_id == userData?.id;
    if (isRight) {
      return (
        <View
          key={String(currentMessage._id)}
          style={{
            ...styles.chatStyle,
            alignSelf: 'flex-end',
            backgroundColor: '#0084ff',
            borderBottomRightRadius: 0,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginHorizontal: 8, flexShrink: 1}}>
              <Text
                style={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                  textTransform: 'capitalize',
                  color: colors.white,
                }}>
                {currentMessage?.username}
              </Text>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    ...styles.descText,
                    color: colors.white,
                  }}>
                  {currentMessage?.message}
                </Text>
                <Text
                  style={{...styles.timeText, color: colors.whiteOpacity77}}>
                  {moment(currentMessage?.created_date).format('LT')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={{flexDirection: 'row'}}>
        <FastImage
          source={{
            uri: currentMessage?.display_image,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.cahtUserImage}
        />
        <View
          key={String(currentMessage._id)}
          style={{
            ...styles.chatStyle,
            alignSelf: 'flex-start',
            backgroundColor: colors.white,
            borderBottomLeftRadius: moderateScale(0),
            maxWidth: width / 1.2,
          }}>
          <View style={{marginHorizontal: 8, flexShrink: 1}}>
            <Text
              style={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
                textTransform: 'capitalize',
                color: colors.black,
              }}>
              {currentMessage?.username}
            </Text>

            <Text
              style={{
                ...styles.descText,
                color: colors.black,
              }}>
              {currentMessage?.message}
            </Text>
            <Text style={styles.timeText}>
              {moment(currentMessage?.created_date).format('LT')}
            </Text>
          </View>
        </View>
      </View>
    );
  }, []);

  const SendButton = useCallback(() => {
    return (
      <View
        style={{
          marginHorizontal: 10,
          alignSelf: 'center',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image source={imagePath.send} />
      </View>
    );
  }, []);

  return (
    <WrapperContainer
      bgColor={colors.white}
      statusBarColor={colors.white}
      isLoading={false}>
      <Header
        leftIcon={imagePath.backArrow}
        centerTitle={`# ${paramData?.room_id || ''}`}
        customRight={showRoomUser}
        // onPressLeft={onBack}
      />

      <ImageBackground source={imagePath.icBgLight} style={{flex: 1}}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{_id: userData?.id}}
          renderMessage={renderMessage}
          isKeyboardInternallyHandled={true}
          renderInputToolbar={props => {
            return (
              <InputToolbar
                containerStyle={{backgroundColor: '#f6f6f6', paddingTop: 0}}
                {...props}
              />
            );
          }}
          textInputStyle={{
            backgroundColor: '#ffffff',
            paddingTop: Platform.OS == 'ios' ? 10 : undefined,
            borderRadius: 20,
            paddingHorizontal: 20,
            // marginVertical: 30,
            textAlignVertical: 'center',
            fontFamily: fontFamily.regular,
            alignSelf: 'center',
            color: colors.black,
          }}
          renderSend={props => {
            return (
              <Send
                alwaysShowSend
                containerStyle={{backgroundColor: 'red'}}
                children={<SendButton />}
                {...props}
              />
            );
          }}
        />
      </ImageBackground>

      <Modal
        isVisible={showParticipant}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onBackdropPress={() => updateState({showParticipant: false})}>
        <View
          style={{
            ...styles.modalStyle,
            backgroundColor: colors.white,
          }}>
          <Text
            style={{
              fontFamily: fontFamily?.bold,
              fontSize: textScale(16),
              color: colors.black,
            }}>
            {roomUsers.length} Participants
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => updateState({showParticipant: false})}>
            <Image source={imagePath.closeButton} />
          </TouchableOpacity>

          <ScrollView>
            {roomUsers.map((val, i) => {
              return (
                <View
                  style={{
                    marginVertical: moderateScaleVertical(8),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <FastImage
                    source={{
                      uri: val?.display_image,
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    style={{
                      ...styles.imgStyle,
                      backgroundColor: colors.blackOpacity43,
                    }}
                  />
                  <View style={{marginLeft: moderateScale(8)}}>
                    <Text>
                      {val?.auth_user_id == userData?.id
                        ? 'You'
                        : val?.username}
                    </Text>
                    {!!val?.phone_num ? <Text>{val?.phone_num}</Text> : null}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </WrapperContainer>
  );
}

const stylesFun = ({}) => {
  const styles = StyleSheet.create({
    imgStyle: {
      width: moderateScale(35),
      height: moderateScale(35),
      borderRadius: moderateScale(35 / 2),
    },
    modalStyle: {
      padding: moderateScale(10),
      borderTopLeftRadius: moderateScale(8),
      borderTopRightRadius: moderateScale(8),
      maxHeight: height / 2,
    },
    userNameStyle: {
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      textTransform: 'capitalize',
    },
    cahtUserImage: {
      width: moderateScale(20),
      height: moderateScale(20),
      borderRadius: moderateScale(10),
      backgroundColor: colors.blackOpacity43,
      marginLeft: 8,
    },
    descText: {
      fontSize: textScale(12),
      fontFamily: fontFamily.regular,
      textTransform: 'capitalize',
      lineHeight: moderateScale(18),
      marginTop: moderateScaleVertical(4),
    },
    timeText: {
      fontSize: textScale(10),
      fontFamily: fontFamily.regular,
      textTransform: 'uppercase',
      color: colors.blackOpacity43,
      marginLeft: moderateScale(12),
      marginTop: moderateScaleVertical(6),
      alignSelf: 'flex-end',
    },
    flexView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chatStyle: {
      paddingVertical: moderateScaleVertical(6),
      borderRadius: moderateScale(8),
      marginBottom: moderateScale(10),
      paddingHorizontal: moderateScale(2),
      maxWidth: width - 16,
      marginHorizontal: moderateScale(8),
    },
  });
  return styles;
};
