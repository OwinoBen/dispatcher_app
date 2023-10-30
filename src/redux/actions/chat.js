import { AGENT_CHAT_ROOM, ALL_ROOM_USER, GET_ALL_MESSAGES, SEND_MESSAGE, SEND_NOTIFCATION, START_CHAT } from "../../config/urls";
import { apiGet, apiPost, getItem } from "../../utils/utils";

export function onStartChat(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(START_CHAT, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}



export function fetchAgentChatRoom(data = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    const defaultUrl = 'https://chat.royoorders.com';
    const getClientInfo = await getItem('clientInfo');
    const socketUrl = getClientInfo?.socket_url ? getClientInfo?.socket_url : defaultUrl
    apiPost(socketUrl + AGENT_CHAT_ROOM, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}



export function sendMessage(data = {}, headers = {}) {
  return new Promise(async(resolve, reject) => {
    const defaultUrl = 'https://chat.royoorders.com';
    const getClientInfo = await getItem('clientInfo');
    const socketUrl = getClientInfo?.socket_url ? getClientInfo?.socket_url : defaultUrl
    
    apiPost(socketUrl + SEND_MESSAGE, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export function getAllMessages(query = '', data = {}, headers = {}) {
  return new Promise(async(resolve, reject) => {
    const defaultUrl = 'https://chat.royoorders.com';
    const getClientInfo = await getItem('clientInfo');
    const socketUrl = getClientInfo?.socket_url ? getClientInfo?.socket_url : defaultUrl

    apiGet(socketUrl + GET_ALL_MESSAGES + query, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getAllRoomUser(query = '', data = {}, headers = {}) {
  return new Promise(async(resolve, reject) => {
    const defaultUrl = 'https://chat.royoorders.com';
    const getClientInfo = await getItem('clientInfo');
    const socketUrl = getClientInfo?.socket_url ? getClientInfo?.socket_url : defaultUrl
console.log(socketUrl,"socketUrlsocketUrlsocketUrl",ALL_ROOM_USER);
    apiGet(socketUrl + ALL_ROOM_USER + query, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function sendNotification(data = {}, headers = {}) {
  console.log(data,"datadatadatadata> for notification");
  return new Promise(async(resolve, reject) => {
    apiPost(SEND_NOTIFCATION, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

