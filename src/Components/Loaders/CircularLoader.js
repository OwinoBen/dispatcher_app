import React from 'react';
import {View} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

const CircularLoader = ({
  listSize = 1,
  cardWidth = width * 0.5 - moderateScale(12),
  height = moderateScaleVertical(128),
  containerStyle = {},
  isRow = false,
  rowContainerstyle = {},
  pRows = 0,
  pWidth = 0,
}) => {
  return (
    <View
      style={{
        ...containerStyle,
        width: cardWidth,
        padding: 0,
      }}>
      <ContentLoader avatar active pRows={2} aSize="large" />
    </View>
  );
};
export default React.memo(CircularLoader);
