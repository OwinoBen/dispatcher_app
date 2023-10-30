import { getColorCodeWithOpactiyNumber } from '../../utils/helperFunctions';
import types from '../types';

const initial_state = {
  themeColors: {
    themeMain: '#41A2E6',
    themeOpacity20: getColorCodeWithOpactiyNumber('41A2E6', 20),
    headingColor: '#000000',
    textGrey: '#1E2428',
    textGreyLight: '#8F92A1',
    bottomBarGradientA: 'rgba(50,181,252,1)',
    bottomBarGradientB: 'rgba(97,160,242,1)',
    backgroundGrey: '#F4F7FA',
    currencyRed: '#F44746',
  },
  themeLayouts: {},
  appData: {},
  currencies: {},
  languages: {},
  allAddresss: [],
  shortCodeStatus: null,
  appStyle: {
    fontSizeData: {
      regular: 'campton-light',
      bold: 'campton-semibold',
      medium: 'campton-book',
      semiBold: 'campton-medium',
    },
    tabBarLayout: 1,
    homePageLayout: 1,
  },
  themeColor: false,
  themeToggle: false,
  clientInfo: null,
  notificationData: {
    isModalVisibleForAcceptReject: false,
    notificationData: null,
  },
  refreshHomeData: false,
  sessionLogoutUser: false,
  defaultLanguage: {},
  fcmToken: null,
  shortCode: null,
  zendeskKeys: {},
  attributeFormData: [],
  currentLocation:{}
  //internetConnection: false,
};

export default function (state = initial_state, action) {
  switch (action.type) {
    case types.APP_INIT: {
      const data = action.payload;
      return {
        ...state,
        clientInfo: data,
      };
    }
    case types.NO_INTERNET: {
      const internetConnection = action.payload;
      return { ...state, internetConnection };
    }
    case types.MODAL_VISIBLE_ACCEPT_REJECT: {
      const data = action.payload;
      return {
        ...state,
        notificationData: data,
      };
    }
    case types.UPDATE_HOME_PAGE: {
      const data = action.payload;
      return {
        ...state,
        refreshHomeData: data,
      };
    }

    case types.SESSIONLOGOUT: {
      const data = action.payload;
      return {
        ...state,
        sessionLogoutUser: data,
      };
    }
    case types.DEFAULTLANGUAGE: {
      const data = action.payload;
      return {
        ...state,
        defaultLanguage: data,
      };
    }
    case types.FCMTOKEN: {
      const data = action.payload;
      return {
        ...state,
        fcmToken: data,
      };
    }
    case types.SAVE_SHORT_CODE: {
      const data = action.payload;
      console.log(data, 'short code in reducer');
      return {
        ...state,
        shortCode: data,
      };
    }

    case types.ZENDEKSKKEYS: {
      const data = action.payload;
      return {
        ...state,
        zendeskKeys: data,
      };
    }
    case types.CURRENT_LOCATION: {
      const data = action.payload;
      return { ...state, currentLocation: data };
    }

    case types.ATTRIBUTE_FORM_DATA: {
      return { ...state, attributeFormData: action.payload };
    }

   

    default: {
      return { ...state };
    }
  }
}
