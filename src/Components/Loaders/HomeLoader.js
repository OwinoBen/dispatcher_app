import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import colors from '../../styles/colors';
const HomeLoader = ({
  width = 20,
  height = 20,
  backgroundColor = colors.greyNew,
  foregroundColor = '#DFDFDF',
  rectWidth = 20,
  rectHeight = 20,
  isReact = false,
  viewStyles = {},
  x = 0,
  y = 0,
  rx = 5,
  ry = 5,
}) => {
  return (
    <View style={{...viewStyles}}>
      <ContentLoader
        foregroundColor={foregroundColor}
        backgroundColor={backgroundColor}
        width={width}
        height={height}>
        <Rect
          x={x}
          y={y}
          rx={rx}
          ry={ry}
          width={rectWidth}
          height={rectHeight}
        />
      </ContentLoader>
    </View>
  );
};
export default React.memo(HomeLoader);
// const styles = StyleSheet.create({});
