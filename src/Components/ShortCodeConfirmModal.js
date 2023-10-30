import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';
import Header from './Header';

export default function ModalView({
  isVisible = false,
  onClose,
  modalStyle,
  transistionIn = 200,
  transistionOut = 200,
  leftIcon = imagePath.back,
  centerTitle,
  textStyle,
  horizontLine = true,
  rightIcon = '',
  onPressLeft,
  onPressRight,
  modalMainContent = () => {},
  modalBottomContent = () => {},
  mainViewStyle = {},
  topCustomComponent = () => {},
  animationIn = 'bounceIn',
  animationOut = 'bounceOut',
}) {
  return (
    <Modal
      animationIn={animationIn}
      animationOut={animationOut}
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      backdropTransitionInTiming={transistionIn}
      backdropTransitionInTiming={transistionOut}
      style={[styles.modalStyle, modalStyle]}>
      <View
        style={{
          // flex: 1,
          backgroundColor: colors.white,
          borderRadius: moderateScale(15),
          //   paddingTop: moderateScaleVertical(30),
          ...mainViewStyle,
        }}>
        {/* center content */}
        <>{modalMainContent()}</>

        {/* bottom content */}
        <>{modalBottomContent()}</>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalStyle: {
    marginHorizontal: moderateScaleVertical(20),
    marginVertical: moderateScaleVertical(50),
    // backgroundColor: colors.white,
    borderRadius: 15,
  },
});
