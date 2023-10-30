import { combineReducers } from 'redux';
import types from '../types';
import initBoot from './initBoot';
import auth from './auth'
const appReducer = combineReducers({
  initBoot,
  auth
});

const rootReducer = (state, action) => {
  if (action.type == types.CLEAR_REDUX_STATE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
