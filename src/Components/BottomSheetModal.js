import BottomSheet from '@gorhom/bottom-sheet';
import React from 'react';
import { StyleSheet } from 'react-native';
import colors from '../styles/colors';

const BottomSheetModal = ({
  children = <></>,
  sheetRef = null,
  snapPoints = [0],
  index = 0,
  enableContentPanningGesture = false,
  handleComponent = () => <></>,
  backgroundStyle = {},
  containerStyle = {},
}) => {
  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      index={index}
      enableContentPanningGesture={enableContentPanningGesture}
      handleComponent={handleComponent}
      detached={true}
      containerStyle={{
        backgroundColor: colors.blackOpacity20,
        ...containerStyle,
      }}
      backgroundStyle={{
        backgroundColor: colors.blackOpacity20,
        borderRadius: 0,
        ...backgroundStyle,
      }}>
      {children}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({});
export default React.memo(BottomSheetModal);
