import React from 'react';
import {Modal, View} from 'react-native';
import {DotIndicator} from 'react-native-indicators';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';

const LoadingComponent = () => {
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector(state => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});

  return (
    <View
      style={{
        ...commonStyles.loader,
        // backgroundColor: 'rgba(255,255,255,0.5)',
        backgroundColor: 'transparent',
        elevation: 5,
      }}>
      <DotIndicator size={15} color={colors.themeColor} />
    </View>
  );
};
const Loader = ({isLoading = false, withModal}) => {
  if (withModal) {
    return (
      <Modal transparent visible={isLoading}>
        <LoadingComponent />
      </Modal>
    );
  }
  if (isLoading) {
    return <LoadingComponent />;
  }
  return null;
};

export default Loader;
