import React, {useEffect, useRef, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import ButtonComponent from '../../Components/ButtonComponent';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
// import store from '../../redux/store';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import styles from './styles';
import SignatureCapture from 'react-native-signature-capture';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import navigationStrings from '../../navigation/navigationStrings';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {event} from 'react-native-reanimated';

var ACTION_TIMER = 1500;
var COLORS = ['#8FEE90', '#27A468'];
var _value = 0;
export default function Scanner({route, navigation}) {
  const userData = useSelector(state => state?.auth?.userData);
  let params = route?.params?.data;
  // let params = {
  //   selected_id: 6,
  //   updateBarcodeScan: () => {},
  // };

  console.log(params, 'params>>>');
  const [state, setState] = useState({
    isLoading: false,
  });

  const {isLoading} = state;
  const commonStyles = commonStylesFunc({fontFamily});
  const updateState = data => setState(state => ({...state, ...data}));
  const clientInfo = useSelector(state => state?.initBoot?.clientInfo);

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  const capture = () => {};
  const barcodeReceived = event => {
    console.log(event, 'event>event>event');
    console.log('Type: ' + event.type + '\nData: ' + event.data);
    if (event && event?.data) {
      if (params?.selected_id == 6 && params?.updateQRcodeScan) {
        params?.updateQRcodeScan(event);
        updateState({isLoading: false});
        navigation.goBack();
      } else if (params && params?.updateBarcodeScan) {
        params?.updateBarcodeScan(event);
        updateState({isLoading: false});
        navigation.goBack();
      } else {
        updateState({isLoading: false});
      }
    }
  };
  const camRef = useRef();

  const topContent = () => {
    return (
      <View
        style={{
          width: width,
          position: 'absolute',
          top: 0,
        }}>
        <Header
          headerStyle={{backgroundColor: colors.white}}
          leftIconStyle={{tintColor: colors.themeColor}}
          leftIcon={imagePath.backArrow}
          centerTitle={
            params?.selected_id == 6 ? strings.SCANBARCODE : 'QR Code'
          }
          customRight={() => (
            <TouchableOpacity>
              <Text style={styles.clear}>{strings.CLEAR}</Text>
              {/* <Image source={}/> */}
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoading={isLoading}
      source={loaderOne}>
      <View style={{...commonStyles.headerTopLine}} />

      <View style={{flex: 1}}>
        <QRCodeScanner
          reactivate={true}
          showMarker={true}
          markerStyle={{
            borderColor: colors.themeColor,
          }}
          onRead={barcodeReceived}
          flashMode={RNCamera.Constants.FlashMode.off}
          topContent={topContent()}
          containerStyle={{
            flex: 1,
            backgroundColor: colors.black,
          }}
          bottomContent={
            <View
              style={{
                width: width,
                height: moderateScaleVertical(80),
                paddingVertical: moderateScale(20),
              }}>
              <ButtonComponent buttonTitle={strings.DONE} onPress={capture} />
            </View>
          }
        />
      </View>
    </WrapperContainer>
  );
}
