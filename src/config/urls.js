// export const API_BASE_URL = 'https://api.rdstaging.com/';
export const API_BASE_URL='https://dispatch.patazone.co.ke/'

export const getApiUrl = endpoint => API_BASE_URL + endpoint;

export const SEND_OTP = getApiUrl('api/auth/login');
export const LOGIN_API = getApiUrl('api/auth/sendOtp');
export const SIGNUP_API = getApiUrl('api/auth/signup');
export const LOGOUT_API = getApiUrl('api/auth/logout');
export const SIGNUP_SEND_OTP = getApiUrl('api/auth/signup/sendOtp');

// export const SIGN_UP_API = getApiUrl('/auth/register');
export const APP_INITIAL_SETTINGS = getApiUrl('api/shortCode');
export const PRIVACYANDTERMSANDCONDITIONS = getApiUrl('api/cmscontent');

//Task Apis
export const GETTASKS = getApiUrl('api/taskList');
export const GETTASKHISTORY = getApiUrl('api/task/history');
export const UPDATEONOFFDUTYSTATUS = getApiUrl('api/updateStatus');
export const UPDATETASKSTATUS = getApiUrl('api/updateTaskStatus');
export const ACCEPTREJECTSTATUS = getApiUrl('api/task/accecpt/reject');

//Logs
export const LOGSAPI = getApiUrl('api/agent/logs');
export const SIGNUPDOC = getApiUrl('api/auth/new-send-documents');
export const DRIVEROTP = getApiUrl('api/checkOTPRequried');

//Wallet
export const GETWALLETDATA = getApiUrl('api/agent/transaction/details');
export const PAYMENTOPTIONS = getApiUrl('api/payment/options');
export const WALLET_CREDIT = getApiUrl('api/agentWallet/credit');

// get Notification Data
export const CUSTOMNOTIFICATIONPAYLOAD = getApiUrl('api/notification/tracking');

//Payout
export const AGENT_PAYOUT = getApiUrl('api/agent/payout/request/create');
export const AGENT_PAYOUT_DETAILS = getApiUrl('api/agent/payout/details');
export const AGENT_BANK_DETAILS = getApiUrl('api/agent/bank/details');

//DAMAGETYPE
export const GET_DAMAGE_TYPES = getApiUrl('api/damagetypes');
export const DAMAGE_REPORTS = getApiUrl('api/agent/reportdamange');

//Reimbursement
export const GET_REIMBURSEMENT_TYPES = getApiUrl('api/reimbursementtypes');
export const REIMBURSEMENT = getApiUrl('api/agent/create/reimbursement');
export const GETORDERDETAILFORTASK = getApiUrl(
  'edit-order/vendor/products/getProductsInCart',
);
export const GETCANCELORDERREASONLIST = getApiUrl('api/order/cancel/reasons');
export const CANCELORDER = getApiUrl('api/order/cancel/request/create');
export const GETWEBURL = getApiUrl('api/payment');

//subscripations api collection

export const GET_ALL_SUBSCRIPTION_PLANS = getApiUrl(
  'api/driver/subscription/plans',
);
export const SELECT_SPECIFIC_PLAN = getApiUrl(
  'api/driver/subscription/selectPlan',
);
export const PURCHASE_SPECIFIC_PLAN = getApiUrl(
  'api/driver/subscription/purchase',
);
export const CANCEL_SPECIFIC_PLAN = getApiUrl('api/driver/subscription/cancel');

//Chat Apis
export const USER_CHAT = getApiUrl('/chat/userVendorChatRoom');
export const VENDOR_CHAT = getApiUrl('/chat/vendorUserChatRoom');
export const START_CHAT = getApiUrl('api/chat/startChat');

export const AGENT_DELETE = getApiUrl('api/agent/delete');
//Socket urls end point
export const AGENT_CHAT_ROOM = '/api/room/fetchRoomByUserAgent';
export const SEND_MESSAGE = '/api/chat/sendMessageJoin';
export const GET_ALL_MESSAGES = '/api/chat';
export const ALL_ROOM_USER = '/api/chat/getRoomUser';
export const SEND_NOTIFCATION = getApiUrl('api/chat/sendNotification');
export const CAB_POOLING_STATUS = getApiUrl('api/updateCabPoolingStatus');
export const GET_CAB_POOLING_SUGGESTION = getApiUrl(
  'api/agent/poolingTaskSuggession',
);

//razorpay url end point'
export const CREATERAZORPAYDETAIL = getApiUrl('api/create-razorpay-details');

//Go to home

export const UPDATE_GO_TO_HOME_STATUS = getApiUrl(
  'api/agent/update-go-to-home-address-status',
);
export const AGENT_HOME_ADDRESSES = getApiUrl('api/agent/home-address');
export const ADD_AGENT_HOME_ADDRESS = getApiUrl('api/agent/add-home-address');
export const SET_AGENT_PRIMARY_ADDRESS = getApiUrl(
  'api/agent/home-address-status',
);
export const CREATERAZORPAYADDFUND = getApiUrl('api/create-razorpay-add-funds');

// bide requestes
export const BIDEREQUESTS = getApiUrl('api/bidRide/requests');
// export const DECLINEBIDEREQUESTS = getApiUrl('api/decline/bidRide/requests');
export const ACCEPTDECLINEBIDEREQUESTS = getApiUrl(
  'api/accept/decline/bidRide/requests',
);

// Agent Slot scheduling
export const GET_GENERAL_SLOT = getApiUrl('api/auth/agent/general_slot');
export const GET_CATEGORIES_OF_PRODUCT = getApiUrl(
  'api/get/on_demand_services',
);

export const GET_AGENT_SLOTS = getApiUrl('api/agent/getslot');

export const GET_PRODUCT_WITH_CATEGORY = getApiUrl(
  'api/agent/category_with_product_with_price',
);

export const AGENT_CATEGORY_WITH_PRODUCT = getApiUrl(
  'api/auth/agent/category_with_product',
);

export const SAVE_PRODUCT_WITH_VARIANTS = getApiUrl(
  'api/auth/agent/save_product_variant_price',
);

export const SAVE_AGENT_SLOTS = getApiUrl('api/auth/agent/saveSlot');

export const GET_FILTERED_TASK_LIST = getApiUrl('api/filter_task_list');
export const BLOCK_UNBLOCK_AGENT_DATES = getApiUrl(
  'api/agent/add_delete_block_slot',
);
