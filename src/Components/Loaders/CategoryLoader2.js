import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import HomeLoader from './HomeLoader';

const CategoryLoader2 = ({
  viewStyles = {},
  widthTop = (width - moderateScale(50)) / 4,
  heightTop = moderateScaleVertical(70),
  rectWidthTop = (width - moderateScale(50)) / 4,
  rectHeightTop = moderateScaleVertical(70),
  rectWidthBottom = moderateScaleVertical(15),
  isFourthItem = true,
  isSubCategory = false,
}) => {
  const _categoryView = () => {
    return (
      <View>
        <HomeLoader
          width={widthTop}
          height={heightTop}
          rectWidth={rectWidthTop}
          rectHeight={rectHeightTop}
        />
        <HomeLoader
          width={widthTop}
          height={rectWidthBottom}
          rectWidth={widthTop}
          rectHeight={rectWidthBottom}
          viewStyles={{marginTop: 5}}
          ry={10}
          rx={10}
        />
      </View>
    );
  };
  return (
    <View
      style={{
        marginHorizontal: moderateScale(15),
        ...viewStyles,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      {_categoryView()}
      {_categoryView()}
      {_categoryView()}
      {isFourthItem && <>{_categoryView()}</>}
    </View>
  );
};

const styles = StyleSheet.create({});
export default React.memo(CategoryLoader2);
