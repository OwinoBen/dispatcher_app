import React from 'react';
import {View, StyleSheet} from 'react-native';

const HorizontalLine = ({lineStyle}) => {
  return <View style={{...styles.lineStyle, ...lineStyle}} />;
};

const styles = StyleSheet.create({
  lineStyle: {
    borderBottomWidth: 0.7,
    borderBottomColor: '#EBEBEB',
  },
});

export default React.memo(HorizontalLine);
