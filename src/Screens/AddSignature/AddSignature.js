import React, {useRef, useState} from 'react';
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
import {moderateScale, textScale} from '../../styles/responsiveSize';
import navigationStrings from '../../navigation/navigationStrings';

var ACTION_TIMER = 1500;
var COLORS = ['#8FEE90', '#27A468'];
var _value = 0;
export default function AddSignature({route, navigation}) {
  const userData = useSelector(state => state?.auth?.userData);
  let params = route?.params?.data;
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

  const saveSign = () => {
    signRef.current.saveImage();
  };

  const resetSign = () => {
    signRef.current.resetImage();
  };

  const _onSaveEvent = result => {
    console.log(result, 'resultresultresultresultresult');
    updateState({isLoading: true});
    if (params && params?.updateSignature) {
      params?.updateSignature(result);
      updateState({isLoading: false});
      navigation.goBack();
    } else {
      updateState({isLoading: false});
    }
  };
  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    console.log('dragged');
  };

  const _onSelect = () => {};
  const signRef = useRef();
  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoading={isLoading}
      source={loaderOne}>
      <Header
        headerStyle={{backgroundColor: colors.white}}
        leftIconStyle={{tintColor: colors.themeColor}}
        leftIcon={imagePath.backArrow}
        centerTitle={strings.ADDSIGNATURE}
        customRight={() => (
          <TouchableOpacity onPress={resetSign}>
            <Text style={styles.clear}>{strings.CLEAR}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={{...commonStyles.headerTopLine}} />
      <View style={{flex: 1}}>
        <SignatureCapture
          style={[{flex: 0.8}, styles.signature]}
          ref={signRef}
          onSaveEvent={_onSaveEvent}
          onDragEvent={_onDragEvent}
          saveImageFileInExtStorage={true}
          showNativeButtons={false}
          showTitleLabel={false}
          // backgroundColor="#ff0fff"
          // strokeColor="#ffffff"
          minStrokeWidth={6}
          maxStrokeWidth={6}
          showBorder={false}
          viewMode={'portrait'}
        />
        <View style={{flex: 0.2, paddingVertical: moderateScale(20)}}>
          <ButtonComponent buttonTitle={strings.DONE} onPress={saveSign} />
        </View>
      </View>
    </WrapperContainer>
  );
}
