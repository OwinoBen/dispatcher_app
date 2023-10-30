import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import HomeLoader from './HomeLoader';

const SearchLoader = ({viewStyles = {}}) => {
  return (
    <View style={{marginHorizontal: moderateScale(15), ...viewStyles}}>
      <HomeLoader
        width={width - moderateScale(30)}
        height={moderateScaleVertical(40)}
        rectWidth={width - moderateScale(30)}
        rectHeight={moderateScaleVertical(40)}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
export default React.memo(SearchLoader);
