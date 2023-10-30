import React from 'react';
import {View, Text} from 'react-native';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import CardLoader from './CardLoader';
import ProductLoader from './ProductLoader';
const ProductLoader2 = ({
  listSize = 1,
  pRows = 0,
  isLoading,
  isProductList = false,
}) => {
  const productCardLoader = () => {
    if (isLoading) {
      return (
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: moderateScale(20),
            height: moderateScale(135),
            width: '90%',
            alignSelf: 'center',
          }}>
          <CardLoader
            cardWidth={moderateScale(200)}
            height={moderateScale(20)}
            listSize={1}
            pRows={5}
            pHeight={8}
            rowContainerstyle={{
              marginLeft: moderateScale(16),
            }}
          />
          <CardLoader
            cardWidth={moderateScale(100)}
            height={moderateScaleVertical(110)}
            listSize={1}
            containerStyle={{
              marginLeft: moderateScale(40),
              height: moderateScale(150),
            }}
          />
        </View>
      );
    } else null;
  };

  const productLoaderList = () => {
    if (isProductList) {
      return (
        <View
          style={{
            marginTop: moderateScaleVertical(20),
          }}>
          {productCardLoader()}
          {productCardLoader()}
          {productCardLoader()}
          {productCardLoader()}
          {productCardLoader()}
        </View>
      );
    } else {
      productCardLoader();
    }
  };

  return productLoaderList();
};
export default React.memo(ProductLoader2);
