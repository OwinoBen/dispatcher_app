import React from 'react';
import {View} from 'react-native';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import CardLoader from './CardLoader';

const ProductDetailLoader = ({}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CardLoader cardWidth={100} height={90} />
          <View style={{marginLeft: moderateScale(8)}}>
            <CardLoader cardWidth={80} height={6} />
            <CardLoader cardWidth={60} height={6} />
            <CardLoader cardWidth={50} height={5} />
          </View>
        </View>
      </View>
      <View>
        <CardLoader cardWidth={20} height={20} />
      </View>
    </View>
  );
};
export default React.memo(ProductDetailLoader);
