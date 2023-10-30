import {useNavigation} from '@react-navigation/native';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import strings from '../constants/lang';
import {showError} from './helperFunctions';
import {openAppSetting} from './openNativeApp';

export const androidCameraPermission = () =>
new Promise(async (resolve, reject) => {
console.log(Platform.constants.Release,'');
try {
if (Platform.OS === "android" && parseInt(Platform.constants.Release) <= Number(5)) {
if (parseInt(Platform.constants.Release) <= Number(13)) {
const granted = await PermissionsAndroid.requestMultiple([
PERMISSIONS.ANDROID.CAMERA,
PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
]);
if (
granted["android.permission.CAMERA"] !== "granted" ||
granted["android.permission.READ_MEDIA_IMAGES"] !== "granted"
) {
Alert.alert(
"Alert",
"Don't have permission to open camera",
[{ text: "Okay" }],
{ cancelable: true }
);
return resolve(false);
// alert(strings.DO_NOT_HAVE_PERMISSIONS_TO_SELECT_IMAGE);
}
} else {
const granted = await PermissionsAndroid.requestMultiple([
PermissionsAndroid.PERMISSIONS.CAMERA,
PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
]);
if (
granted["android.permission.CAMERA"] !== "granted" ||
granted["android.permission.WRITE_EXTERNAL_STORAGE"] !== "granted" ||
granted["android.permission.READ_EXTERNAL_STORAGE"] !== "granted"
) {
Alert.alert(
"Alert",
"Don't have permission to open camera",
[{ text: "Okay" }],
{ cancelable: true }
);
return resolve(false);
// alert(strings.DO_NOT_HAVE_PERMISSIONS_TO_SELECT_IMAGE);
}
}
return resolve(true);
}

return resolve(true);
} catch (error) {
return resolve(false);
}
});

// export const locationPermission = () => {
//   if (Platform.OS === 'android' && Platform.Version > 22) {
//     return PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//     );
//   }

//   return Promise.resolve('granted');
// };
console.log(Platform.constants.Release, 'Platform.constants.ReleasePlatform.constants.Release')
export const locationPermission = () =>
  new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
      try {
        const permissionStatus = await Geolocation.requestAuthorization(
          'whenInUse',
        );
        if (permissionStatus === 'granted') {
          return resolve('granted');
        }
        reject('Permission not granted');
      } catch (error) {
        return reject(error);
      }
    }
    else {
     


      if (parseInt(Platform.constants.Release) <= Number(9)) {
        return PermissionsAndroid.request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION &&
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
        )
          .then(granted => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              //console.log('You can use the location');
              console.log(granted, 'grantedgranted');
              return resolve('granted');
            }
            //console.log('Location permission denied');
            else {
              return reject('denied');
            }
          })
          .catch(error => {
            console.log('Ask Location permission error: ', error);
            return reject(error);
          });
      } else if(Number(Platform.constants.Release) >=Number(10)) {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: 'Permission Requires',
            message: 'collects location data in background and foreground mode to track the order delivery location and estimate delivery time for the end customer',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
            
          }
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
        )
          .then(granted => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              //console.log('You can use the location');
              console.log(granted, 'grantedgranted');
              return resolve('granted');
            }
            //console.log('Location permission denied');
            else {
              return reject('denied');
            }
          })
          .catch(error => {
            console.log('Ask Location permission error: ', error);
            return reject(error);
          });
      }


    }
  });

  export const chekLocationPermission = (showAlert = true) =>
  new Promise(async (resolve, reject) => {
    try {
      check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      )
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              showError(strings.LOCATION_UNAVAILABLE);
              break;
            case RESULTS.DENIED:
              request(
                Platform.OS === 'ios'
                  ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                  : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              )
                .then((result) => {
                  return resolve(result);
                })
                .catch((error) => {
                  return reject(error);
                });

              break;
            case RESULTS.LIMITED:
              showError(strings.LOCATION_LIMITED);
              break;
            case RESULTS.GRANTED:
              return resolve(result);
            case RESULTS.BLOCKED:
              if (showAlert) {
                Alert.alert('', strings.LOCATION_DISABLED_MSG, [
                  {
                    text: strings.CANCEL,
                    onPress: () => resolve('goback'),
                  },
                  {
                    text: strings.CONFIRM,
                    onPress: () => {
                      const locationPath = 'LOCATION_SERVICES';
                      openAppSetting(locationPath);
                    },
                  },
                ]);
              }
              return resolve(result);
          }
        })
        .catch((error) => {
          console.log('errorrrrrrrrr', error);
          return reject(error);
        });
    } catch (error) {
      return reject(error);
    }
  });

// export const chekLocationPermission = () =>
//   new Promise(async (resolve, reject) => {
//     try {
//       check(
//         Platform.OS === 'ios'
//           ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
//           : Platform.constants.Release <= String(9)
//             ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION &&
//             PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
//             : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
//       )
//         .then(result => {
//           switch (result) {
//             case RESULTS.UNAVAILABLE:
//               openAppSetting('LOCATION_SERVICES');
//               break;
//             case RESULTS.DENIED:
//               request(
//                 Platform.OS === 'ios'
//                   ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
//                   : Platform.constants.Release <= String(9)
//                   ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION &&
//                     PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
//                   : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
//               )
//                 .then(result => {
//                   return resolve(result);
//                 })
//                 .catch(error => {
//                   return reject(error);
//                 });

//               break;
//             case RESULTS.LIMITED:
//               showError(strings.LOCATION_LIMITED);
//               break;
//             case RESULTS.GRANTED:
//               return resolve(result);
//               break;
//             case RESULTS.BLOCKED:
//               Alert.alert('', strings.LOCATION_DISABLED_MSG, [
//                 {
//                   text: 'Cancel',
//                   onPress: () => resolve('goback'),
//                 },
//                 {
//                   text: 'Confirm',
//                   onPress: () => {
//                     const locationPath = 'LOCATION_SERVICES';
//                     openAppSetting(locationPath);
//                   },
//                 },
//               ]);

//               break;
//           }
//         })
//         .catch(error => {
//           return reject(error);
//         });
//     } catch (error) {
//       return reject(error);
//     }
//   });

//Check camera permission
export const checkCameraPermission = () =>
  new Promise(async (resolve, reject) => {
    try {
      check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA,
      )
        .then(result => {
          console.log(result, 'result');
          switch (result) {
            case RESULTS.UNAVAILABLE:
              // showError(strings.);
              request(
                Platform.OS === 'ios'
                  ? PERMISSIONS.IOS.CAMERA
                  : PERMISSIONS.ANDROID.CAMERA,
              )
                .then(result => {
                  return resolve(result);
                })
                .catch(error => {
                  return reject(error);
                });
              break;
            case RESULTS.DENIED:
              request(
                Platform.OS === 'ios'
                  ? PERMISSIONS.IOS.CAMERA
                  : PERMISSIONS.ANDROID.CAMERA,
              )
                .then(result => {
                  return resolve(result);
                })
                .catch(error => {
                  return reject(error);
                });

              break;
            case RESULTS.LIMITED:
              showError(strings.LOCATION_LIMITED);
              break;
            case RESULTS.GRANTED:
              return resolve(result);
              break;
            case RESULTS.BLOCKED:
              Alert.alert('', strings.LOCATION_DISABLED_MSG, [
                {
                  text: 'Cancel',
                  onPress: () => resolve('goback'),
                },
                {
                  text: 'Confirm',
                  onPress: () => {
                    const locationPath = '';
                    openAppSetting(locationPath);
                  },
                },
              ]);

              break;
          }
        })
        .catch(error => {
          return reject(error);
        });
    } catch (error) {
      return reject(error);
    }
  });
