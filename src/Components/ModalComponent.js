import React from 'react';
import {useRef} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import Modal from 'react-native-modal';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {
  height,
  moderateScaleVertical,
  StatusBarHeight,
} from '../styles/responsiveSize';
import Header from './Header';

export default function ModalComponent({
  isVisible = false,
  onClose,
  modalStyle,
  transistionOut = 200,
  leftIcon = imagePath.backArrow,
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
  backdropColor = colors.whiteOpacity77,
  modalRef,
}) {
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      avoidKeyboard={true}
      backdropTransitionInTiming={transistionOut}
      style={{...styles.modalStyle, ...modalStyle}}>
      <View
        style={{
          backgroundColor: colors.white,
          ...mainViewStyle,
        }}>
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

        <>{modalMainContent()}</>

        <>{modalBottomContent()}</>
      </View>
      <FlashMessage
        ref={modalRef}
        position={'center'}
        style={{
          backgroundColor: 'green',
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalStyle: {
    marginHorizontal: moderateScaleVertical(20),
    borderRadius: 15,
  },
});
