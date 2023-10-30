import {
  ACCEPTREJECTSTATUS,
  DRIVEROTP,
  GETTASKHISTORY,
  GETTASKS,
  GETWALLETDATA,
  UPDATEONOFFDUTYSTATUS,
  UPDATETASKSTATUS,
  GETORDERUPDATEDETAILS,
  PAYMENTOPTIONS,
  WALLET_CREDIT,
  AGENT_PAYOUT,
  AGENT_PAYOUT_DETAILS,
  AGENT_BANK_DETAILS,
  GET_DAMAGE_TYPES,
  DAMAGE_REPORTS,
  GETORDERDETAILFORTASK,
  GETCANCELORDERREASONLIST,
  CANCELORDER,
  GETWEBURL,
  GET_CAB_POOLING_SUGGESTION,
  CREATECONTACT,
  CREATERAZORPAYADDFUND,
  CREATERAZORPAYDETAIL,
  UPDATE_GO_TO_HOME_STATUS,
  AGENT_HOME_ADDRESSES,
  ADD_AGENT_HOME_ADDRESS,
  SET_AGENT_PRIMARY_ADDRESS,
  BLOCK_UNBLOCK_AGENT_DATES,
  GET_FILTERED_TASK_LIST,
} from '../../config/urls';
import { apiGet, apiPost } from '../../utils/utils';
import store from '../store';
const { dispatch } = store;

//Get List of payment method
export function getListOfTasks(url = '', data = {}, headers = {}) {
  console.log(headers, 'headersheaders');
  return new Promise((resolve, reject) => {
    apiGet(GETTASKS + url, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//Get List of payment method
export function getListOfTaskHistory(uri = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GETTASKHISTORY + uri, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//ON/OFF ton duty and off duty data

export function onOffDuty(uri = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(UPDATEONOFFDUTYSTATUS + uri, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//cancel task

export function cancelTask(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(UPDATETASKSTATUS, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function updateTask(data = {}, headers = {}) {
  console.log(data, 'data in task task proof');
  return new Promise((resolve, reject) => {
    apiPost(UPDATETASKSTATUS, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function acceptRejectTask(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(ACCEPTREJECTSTATUS, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function sendOtpToDriver(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(DRIVEROTP, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function getWalletData(uri = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GETWALLETDATA + uri, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function getProductUpdateDetails(uri = '', data = {}, headers = {}) {
  console.log(uri, 'uri in actions >>>>>>>>>>>');
  return new Promise((resolve, reject) => {
    apiGet(uri, data, headers)
      .then(res => {
        console.log('resres', res);
        resolve(res);
      })
      .catch(error => {
        console.log('error', error);
        reject(error);
      });
  });
}

export function getPaymentOptions(uri = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(PAYMENTOPTIONS + uri, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function walletCredit(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(WALLET_CREDIT, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function agentPayoutCreate(url, data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(AGENT_PAYOUT + url, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function agentPayoutDetails(uri = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(AGENT_PAYOUT_DETAILS + uri, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function agentBankDetails(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(AGENT_BANK_DETAILS, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//Get Damage types
export function getAllDamageTypes(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_DAMAGE_TYPES, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//Damage report
export function damageReport(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(DAMAGE_REPORTS, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//Get Reimbursement types
export function getAllReimbursementTypes(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_REIMBURSEMENT_TYPES, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//Reimbursement report
export function reimbursement(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(REIMBURSEMENT, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//Get customre order detail
export function getCustomerOrderDetail(url = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(url, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//add delete product from cart
export const increaseDecreaseItemQty = (url = '', data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(url, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

//searchAction
export const searchAction = (url = '', data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(url, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

//getProductDetailByProductId
export const getProductDetailByProductId = (url = '', data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(url, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

//getProductDetailByProductId
export const addProductsToCart = (url = '', data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(url, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

//Remove product from cart
export const removeProductFromCart = (url = '', data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(url, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

//submit temp cart informataion to client
export const submitTempCartInformation = (url = '', data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(url, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

//remove temp cart informataion
export const removeTempCartInformation = (url = '', data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(url, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

//Get customre order detail
export function getAllAndVariantDetail(url = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(url, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//GET ALL CANCEL REASON
export function getListOfAllCancelReason(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GETCANCELORDERREASONLIST, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//Submit request by driver to cancel order and sent to admin
export function submitCancelOrderRequest(url = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(CANCELORDER + url, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//Get List of payment method
export function openPaymentWebUrl(query = '', data = {}, headers = {}) {
  console.log('payment++ query', query);
  console.log('payment++ data', data);
  console.log(GETWEBURL + query, data, headers, 'webPaymentUrl');
  return new Promise((resolve, reject) => {
    apiGet(GETWEBURL + query, data, headers)
      .then(res => {
        resolve(res);
        console.log(res, 'ressssofweburl');
      })
      .catch(error => {
        console.log(error, 'error in web Url');
        reject(error);
      });
  });
}

//razorpay create contact
export function createContact(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(CREATERAZORPAYDETAIL, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function createRazorpayFund(data = {}, headers = {}) {
  console.log(data, headers, 'createContact>>>');
  return new Promise((resolve, reject) => {
    apiPost(CREATERAZORPAYADDFUND, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}


//getAllPoolingSuggestions
export function getAllPoolingSuggestions(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_CAB_POOLING_SUGGESTION, data, headers)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//Go To Home 
export function updateGoToHomeStatus(data = {}, headers = {}) {
  return apiPost(UPDATE_GO_TO_HOME_STATUS, data, headers)
}

export function getAgentHomeAddress(data = {}, headers = {}) {
  return apiGet(AGENT_HOME_ADDRESSES, data, headers)
}

export function addAgentHomeAddress(data = {}, headers = {}) {
  return apiPost(ADD_AGENT_HOME_ADDRESS, data, headers)
}

export function setAgentsPrimaryAddress(data = {}, headers = {}) {
  return apiPost(SET_AGENT_PRIMARY_ADDRESS, data, headers)
}

export function getFilteredTasks(uri = '', data = {}, headers = {}) {
  return apiPost(GET_FILTERED_TASK_LIST + uri, data, headers)
}

export function blockOrUnblockAgentTaskDates(data = {}, headers = {}) {
  return apiPost(BLOCK_UNBLOCK_AGENT_DATES, data, headers)
}

