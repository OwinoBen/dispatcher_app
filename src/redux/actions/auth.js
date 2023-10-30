import {
  CANCEL_SPECIFIC_PLAN,
  GET_ALL_SUBSCRIPTION_PLANS,
  AGENT_DELETE,
  LOGIN_API,
  LOGOUT_API,
  PURCHASE_SPECIFIC_PLAN,
  SELECT_SPECIFIC_PLAN,
  SEND_OTP,
  SIGNUPDOC,
  SIGNUP_API,
  SIGNUP_SEND_OTP,
  CAB_POOLING_STATUS,
  BIDEREQUESTS,
  DECLINEBIDEREQUESTS,
  ACCEPTDECLINEBIDEREQUESTS,
  GET_GENERAL_SLOT,
  GET_CATEGORIES_OF_PRODUCT,
  GET_AGENT_SLOTS,
  GET_PRODUCT_WITH_CATEGORY,
  AGENT_CATEGORY_WITH_PRODUCT,
  SAVE_PRODUCT_WITH_VARIANTS,
  SAVE_AGENT_SLOTS,
} from "../../config/urls";
import {
  apiGet,
  apiPost,
  createAxiosInstance,
  removeItem,
  saveCabPollingStatus,
  setItem,
  setUserData,
} from "../../utils/utils";
import store from "../store";
import types from "../types";
const { dispatch } = store;

const { instance, cancel } = createAxiosInstance();


export const saveUserData = (data) => {
  dispatch({
    type: types.LOGIN,
    payload: data,
  });
};

export const removerUserData = (data) => {
  dispatch({
    type: types.USER_LOGOUT,
    payload: data,
  });
};

export function login(data = {}, headers = {}) {
  console.log(data, "login>data>data>data", headers);
  return new Promise((resolve, reject) => {
    apiPost(LOGIN_API, data, headers)
      .then(async (res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function cancelRequest(reason = 'Request canceled') {
  cancel(reason);
}

export function deleteAccount(data = {}, headers = {}) {
  console.log(data, headers, 'data>>>>>>');
  return new Promise((resolve, reject) => {
    apiPost(AGENT_DELETE, data, headers)
      .then(async res => {
        console.log(res, 'resresresresres>>>>>>');
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
export function signUp(data = {}, headers = {}) {
  console.log(data, "login>data>data>data", headers);
  return new Promise((resolve, reject) => {
    apiPost(SIGNUP_API, data, headers)
      .then(async (res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const updataeUserData = (data) => {
  setUserData(data).then((suc) => {
    dispatch({
      type: types.UPDATEUSER,
      payload: data,
    });
  });
};
export const setAttributeFormInfo = data => {
  dispatch({
    type: types.ATTRIBUTE_FORM_DATA,
    payload: data,
  });
}
export function verifyAccount(data = {}, headers = {}) {
  console.log(data, "verifyAccount>data>data>data");
  return new Promise((resolve, reject) => {
    apiPost(SEND_OTP, data, headers)
      .then(async res => {
        if(!!res?.data && !!res?.data?.attribute_form){
          setAttributeFormInfo(res?.data?.attribute_form || [])
        }
        setUserData(res.data).then(suc => {
          resolve(res);
        }).catch((error)=>{
          resolve(error);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//logout

export function logout(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(LOGOUT_API, data, headers)
      .then(async (res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get Signup documents

export function signupDoc(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(SIGNUPDOC, data, headers)
      .then(async (res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//get all subscriptions
export function getAllSubscriptions(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_ALL_SUBSCRIPTION_PLANS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Select specific subscription
export function selectSpecificSubscriptionPlan(
  query = "",
  data = {},
  headers = {}
) {
  console.log(SELECT_SPECIFIC_PLAN + query, "apiIsThis ");
  return new Promise((resolve, reject) => {
    apiGet(SELECT_SPECIFIC_PLAN + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log(error, "errrrrrSELECT_SPECIFIC_PLAN");
        reject(error);
      });
  });
}

//Purchase subscription plan
export function purchaseSubscriptionPlan(query = "", data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(PURCHASE_SPECIFIC_PLAN + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Cancel subscription plan
export function cancelSubscriptionPlan(query = "", data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(CANCEL_SPECIFIC_PLAN + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export function sendOtpOnSignup(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(SIGNUP_SEND_OTP, data, headers)
      .then(async (res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateCabPoolingStatus(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(CAB_POOLING_STATUS, data, headers)
      .then((res) => {
        const isPooling = !!res?.data?.is_pooling_available ? true : false;
        if (isPooling) {
          dispatch({
            type: types.POOLING,
            payload: true,
          });
        } else {

          dispatch({
            type: types.POOLING,
            payload: false,
          });
        }

        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function savePoolingStatusForLifeCycle(data = {}) {
  dispatch({
    type: types.POOLING,
    payload: data ? true : false,
  });
}


/// bide and ride api starting here******************************

export function reciveBideRequests(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(BIDEREQUESTS, data, headers)
      .then(async (res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function acceptBideRequest(URL, data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(URL, data, headers)
      .then(async (res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// export function declineBideRequest(data = {}, headers = {}) {
//   return new Promise((resolve, reject) => {
//     apiPost(DECLINEBIDEREQUESTS, data, headers)
//       .then(async (res) => {
//         resolve(res);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// }

export function acceptdeclineBideRequest(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(ACCEPTDECLINEBIDEREQUESTS, data, headers)
      .then(async (res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}



//Get Time Slots
export function getTimeSlotsData(data = {}, headers = {}) {
  return apiGet(GET_GENERAL_SLOT, data, headers);
}

//Get Service Details
export function getServiceDetails(data = {}, headers = {}) {
  return apiGet(GET_CATEGORIES_OF_PRODUCT, data, headers);
}


export function getAgentSlots(data = {}, headers = {}) {
  return apiGet(GET_AGENT_SLOTS, data, headers);
}

export function getProductDetailsWithCategory(data = {}, headers = {}) {
  return apiGet(GET_PRODUCT_WITH_CATEGORY, data, headers);
}

export function getAgentProductsByCategory(data = {}, headers = {}) {
  return apiGet(AGENT_CATEGORY_WITH_PRODUCT, data, headers);
}



export function onSaveProductWithVariants(data = {}, headers = {}) {
  return apiPost(SAVE_PRODUCT_WITH_VARIANTS, data, headers);
}

export function saveAgentSlots(data = {}, headers = {}) {
  return apiPost(SAVE_AGENT_SLOTS, data, headers);
}

