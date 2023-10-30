import { algo } from 'crypto-js';
import { Platform, Keyboard } from 'react-native';
import { openCamera, openPicker } from './imagePicker';
import { callingCountries } from 'country-data';
const cameraHandler = async (data, option) => {
  Keyboard.dismiss();
  //this condition use for open camera
  if (data == 0) {
    let options = {
      ...option,
    };
    try {
      const res = await openCamera(options);
      if (res) {
        return res;
      }
    } catch (err) { }
  }

  //this condition use for open gallery
  else if (data == 1) {
    let options = {
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.5,
      cropperCircleOverlay: true,
      ...option,
    };

    try {
      const res = await openPicker(options);
      if (res) {
        return res;
      }
    } catch (err) { }
  } else {
    return null;
  }
};

const currencyNumberFormatter = item => {
  let unformateAmount = item;
  return parseFloat(unformateAmount)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export function getImageUrl(url1, url2, dimentions) {
  //
  return `${url1}${dimentions}${url2}`;
}

const kFormatter = num => {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
    : Math.sign(num) * Math.abs(num);
};

export const checkValueExistInAry = (item = {}, arr2 = []) => {
  let found = arr2.includes(item?.id);
  return found;
};

export { cameraHandler, currencyNumberFormatter, kFormatter };
