import { Platform } from 'react-native';
import { getBundleId } from 'react-native-device-info';

const shortCodes = {
 
  patazone: '448993',
 
};

const appIds = {
  
  patazone: Platform.select({
    ios: 'com.patazone.dispatcher',
    android: 'com.patazone.dispatcher',
  }),
  
};

export { appIds, shortCodes };