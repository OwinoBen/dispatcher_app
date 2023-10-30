import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import HomeLoader from './HomeLoader';
const HeaderLoader = ({
  widthLeft = moderateScale(240),
  heightLeft = moderateScaleVertical(35),
  rectWidthLeft = moderateScale(240),
  rectHeightLeft = moderateScaleVertical(35),
  widthRight = moderateScale(90),
  heightRight = moderateScaleVertical(35),
  rectWidthRight = moderateScale(90),
  rectHeightRight = moderateScaleVertical(35),
  viewStyles = {},
  isRight = true,
  rx = 15,
  ry = 15,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginHorizontal: moderateScale(15),
        justifyContent: 'space-between',
        ...viewStyles,
      }}>
      <HomeLoader
        width={widthLeft}
        height={heightLeft}
        rectWidth={rectWidthLeft}
        rectHeight={rectHeightLeft}
        rx={rx}
        ry={ry}
      />
      {isRight && (
        <HomeLoader
          width={widthRight}
          height={heightRight}
          rectWidth={rectWidthRight}
          rectHeight={rectHeightRight}
          rx={rx}
          ry={ry}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({});
export default React.memo(HeaderLoader);
