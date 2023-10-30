import axios from 'axios';
import {PermissionsAndroid, Platform} from 'react-native';
// import store from '../redux/store';
// import types from '../redux/types';
import {sessionHandler} from './helperFunctions';
// import actions from '../redux/actions';
import navigationStrings from '../navigation/navigationStrings';
import * as NavigationService from '../navigation/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';


export const createAxiosInstance = () => {
  const source = axios.CancelToken.source();
  const instance = axios.create({
    cancelToken: source.token,
  });
  return { instance, cancel: source.cancel };
};


export async function getHeaders() {
  let userData = await AsyncStorage.getItem('userData');

  if (userData) {
    userData = JSON.parse(userData);
    return {
      Authorization: `${userData?.access_token}`,
    };
  }
  return {};
}

export function setUserData(data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem('userData', data);
}

export function setDefaultSelectedLanguage(data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem('defaultLanguage', data);
}

export function setClientInfo(data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem('clientInfo', data);
}

export function saveShortCodeData(data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem('saveShortCode', data);
}

export function setItem(key, data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem(key, data);
}

export function getItem(key) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key).then(data => {
      resolve(JSON.parse(data));
    });
  });
}

export function removeItem(key) {
  return AsyncStorage.removeItem(key);
}

export function clearAsyncStorate(key) {
  return AsyncStorage.clear();
}

export async function getUserData() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('userData').then(data => {
      resolve(JSON.parse(data));
    });
  });
}

export async function getAppData() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('appData').then(data => {
      resolve(JSON.parse(data));
    });
  });
}

export async function clearUserData() {
  return AsyncStorage.removeItem('userData');
}

export async function apiReq(
  endPoint,
  data,
  method,
  headers,
  requestOptions = {},
) {
  return new Promise(async (res, rej) => {
    const getTokenHeader = await getHeaders();
    headers = {
      ...getTokenHeader,
      ...headers,
    };

    if (method === 'get' || method === 'delete') {
      data = {
        ...requestOptions,
        ...data,
        headers,
      };
    }

    console.log(endPoint, '+++++endPoint');
    console.log(data, '+++++data');
    console.log(headers, '+++++headers');
 // Create an axios instance with a CancelToken
 const { instance } = createAxiosInstance();

    instance[method](endPoint, data, {headers})
      .then(result => {
        console.log('+++++success result', result);
        const {data} = result;
        if (data.status === false) {
          return rej(data);
        }
        return res(data);
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('Request was canceled');
          return rej({
            error: 'Request was canceled please try again later',
          });
        } else if (error && error.response && error.response.status === 401) {
          sessionHandler(error.response.data.message);
          // return rej(error);
        } else {
          console.log(error?.response, 'all error++++');
          if (error && error.response && error.response.data) {
            if (!error.response.data.error) {
              return rej({
                ...error.response.data,
                error: error.response.data.error || 'Network Error',
              });
            }
            return rej(error.response.data);
          } else {
            return rej({error: 'Network Error', message: 'Network Error'});
          }
        }
        return rej(error);
      });
  });
}

export function apiPost(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, 'post', headers);
}

export function apiDelete(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, 'delete', headers);
}

export function apiGet(endPoint, data, headers = {}, requestOptions) {
  return apiReq(endPoint, data, 'get', headers, requestOptions);
}

export function apiPut(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, 'put', headers);
}

export function randomString(len = 5) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}


export function saveCabPollingStatus(status){
 const poolingStatus = JSON.stringify(status);
return  AsyncStorage.setItem('cabPoolingStatus',poolingStatus)
}


export function removeCabPollingStatusFromAsyncStorage(key){
return  AsyncStorage.removeItem(key)
}

