import store from "../store";
import types from "../types";
const { dispatch } = store;
import {
  apiGet,
  apiPost,
  saveShortCodeData,
  setClientInfo,
  setDefaultSelectedLanguage,
  setUserData,
} from "../../utils/utils";
import {
  APP_INITIAL_SETTINGS,
  PRIVACYANDTERMSANDCONDITIONS,
  LOGSAPI,
  CUSTOMNOTIFICATIONPAYLOAD,
} from "../../config/urls";
import DeviceInfo from "react-native-device-info";
import { appIds } from "../../utils/constants/DynamicAppKeys";

export function initApp(data = {}, headers = {}, reload = false) {
  console.log(data, "data>>", headers, "data>>headers>>");
  return new Promise((resolve, reject) => {
    apiPost(APP_INITIAL_SETTINGS, data, headers)
      .then(async (res) => {
        let data = res?.data;
        setClientInfo(data).then((suc) => {
          dispatch({
            type: types.APP_INIT,
            payload: data,
          });
          resolve(res);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get List of payment method
export function getListOfAllCmsLinks(url = "", data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(PRIVACYANDTERMSANDCONDITIONS + url, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getCustomNotificationPayload(
  url = "",
  data = {},
  headers = {}
) {
  return new Promise((resolve, reject) => {
    apiGet(CUSTOMNOTIFICATIONPAYLOAD + url, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const updateInternetConnection = (data) => {
  dispatch({
    type: types.NO_INTERNET,
    payload: data,
  });
};

//Save your short code
export function saveShortCode(data = {}) {
  saveShortCodeData(data).then((suc) => {
    dispatch({
      type: types.SAVE_SHORT_CODE,
      payload: data,
    });
  });
}

export const saveUserData = (data) => {
  dispatch({
    type: types.LOGIN,
    payload: data,
  });
};



export const userCurrentLocation = (data) => {
  dispatch({
    type: types.CURRENT_LOCATION,
    payload: data,
  });
};



//Logs api hitting after  some  frequent interval

export function logsApi(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(LOGSAPI, data, headers)
      .then(res => {
        dispatch({
          type: types.ATTRIBUTE_FORM_DATA,
          payload: res?.data?.attribute_form,
        });
        setUserData(res?.data?.user).then(suc => {
          saveUserData(res?.data?.user);
          resolve(res);
        });
      })
      .catch((error) => {
        console.log(error)
      });
  });
}

export function isModalVisibleForAcceptReject(data = false) {
  console.log(data, "data");
  dispatch({
    type: types.MODAL_VISIBLE_ACCEPT_REJECT,
    payload: data,
  });
}

export function updateHomepage(data = false) {
  console.log(data, "data");
  dispatch({
    type: types.UPDATE_HOME_PAGE,
    payload: data,
  });
}

//sessionLogoutUser logout key
export function sessionLogoutUser(data = false) {
  console.log(data, "data");
  dispatch({
    type: types.SESSIONLOGOUT,
    payload: data,
  });
}

export function setDefaultLanguage(data = {}) {
  setDefaultSelectedLanguage(data).then((suc) => {
    dispatch({
      type: types.DEFAULTLANGUAGE,
      payload: data,
    });
  });
}

export const saveFcmToken = (data) => {
  dispatch({
    type: types.FCMTOKEN,
    payload: data,
  });
};

export const setZendeskKeys = (data) => {
  dispatch({
    type: types.ZENDEKSKKEYS,
    payload: data,
  });
};


export function saveCabPoolingStatus(data = {}) {
  saveCabPollingStatus(data).then((res) => {
    dispatch({
      type: types.POOLING,
      payload: data,
    })
  }).catch((error) => {
    console.log('data not saved in asyncStorage');
  })

}


export function removeAllCabPoolingStatus(data = {}) {
  removeCabPollingStatusFromAsyncStorage('cabPoolingStatus').then((res) => {
    dispatch({
      type: types.POOLING,
      payload: data,
    })
  }).catch((error) => {
    console.log('data not saved in asyncStorage');
  })
}


export function submitDriverRequestForPush(
  url = "",
  data = {},
  headers = {}
) {
  return new Promise((resolve, reject) => {
    apiPost(url, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}



