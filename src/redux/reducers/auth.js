import types from '../types';

const initial_state = {
  userData: {},
  profileAddress:{}, 
  isCabPooling:false,
  initialValue: 0
};

export default function (state = initial_state, action) {
  switch (action.type) {
    case types.LOGIN: {
      const data = action.payload;
      return {...state, userData: data};
    }

    case types.UPDATEUSER: {
      const data = action.payload;
      return {...state, userData: data};
    }

    case types.USER_LOGOUT: {
      const data = action.payload;
      return {...state, userData: undefined};
    }
    case types.POOLING: {
      const data = action.payload;
      return {...state,isCabPooling:data, initialValue: 0 };
    }


    default: {
      return { ...state };
    }
  }
}
