import * as auth from './auth';
import * as init from './init';
import * as tasks from './tasks';
import * as chat from './chat';

export default {
  ...init,
  ...auth,
  ...tasks,
  ...chat
};
