import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {moderateScaleVertical} from '../styles/responsiveSize';
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
  onClose1 = () => {},
}) {
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose1}
      backdropTransitionInTiming={transistionOut}
      style={[styles.modalStyle, modalStyle]}>
      <View
        style={{
          // flex: 1,
          backgroundColor: colors.white,
          borderRadius: 15,
          paddingTop: moderateScaleVertical(30),
          ...mainViewStyle,
        }}>
        {/* //Header */}
        {topCustomComponent ? (
          topCustomComponent()
        ) : (
          <Header
            leftIcon={leftIcon}
            centerTitle={centerTitle}
            rightIcon={rightIcon}
            onPressLeft={onPressLeft}
          />
        )}

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
