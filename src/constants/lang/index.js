import LocalizedStrings from 'react-native-localization';
import {appIds} from '../../utils/constants/DynamicAppKeys';
import DeviceInfo, {getBundleId} from 'react-native-device-info';

import ar from './ar';
import de from './de';
import en from './en';
import es from './es';
import fr from './fr';
import heb from './heb';
import ne from './ne';
import pr from './pr';
import ptBr from './ptBr';
import ru from './ru';
import sv from './sv';
import swa from './swa';
import tr from './tr';
import vi from './vi';
import zh from './zh';
import ger from './ger';

const arbicFile = () => {
  return ar;
};

let strings = new LocalizedStrings({
  en: en,
  ar: arbicFile(),
  es: es,
  de: de,
  fr: fr,
  tr: tr,
  zh: zh,
  ru: ru,
  ptBr: ptBr,
  sv: sv,
  pr: pr,
  vi: vi,
  ne: ne,
  swa: swa,
  he: heb,
  ger:ger
});
export const changeLaguage = languageKey => {
  strings.setLanguage(languageKey);
};
export default strings;
