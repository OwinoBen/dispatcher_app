import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import HeaderLoader from './HeaderLoader';
import HomeLoader from './HomeLoader';

const BannerLoader = ({
  viewStyles = {},
  isBannerDots = false,
  isVendorLoader = false,
  vendorTxtStyles = {},
  homeLoaderWidth = width - moderateScale(30),
  homeLoaderHeight = moderateScaleVertical(130),
}) => {
  const renderDots = () => {
    return (
      <HomeLoader
        width={moderateScale(10)}
        height={moderateScaleVertical(10)}
        rectWidth={moderateScale(10)}
        rectHeight={moderateScaleVertical(15)}
        viewStyles={{marginHorizontal: moderateScale(2)}}
      />
    );
  };

  const rendorVendorTxtLoader = () => {
    return (
      <HeaderLoader
        heightLeft={moderateScaleVertical(15)}
        rectHeightLeft={moderateScaleVertical(15)}
        heightRight={moderateScaleVertical(15)}
        rectHeightRight={moderateScaleVertical(15)}
        widthLeft={moderateScale(290)}
        rectWidthLeft={moderateScale(290)}
        widthRight={moderateScale(50)}
        rectWidthRight={moderateScale(50)}
        viewStyles={{marginTop: moderateScaleVertical(5), marginHorizontal: 0}}
      />
    );
  };

  return (
    <View
      style={{
        marginHorizontal: moderateScale(15),
        ...viewStyles,
      }}>
      <HomeLoader
        width={homeLoaderWidth}
        height={isVendorLoader ? moderateScaleVertical(160) : homeLoaderHeight}
        rectWidth={homeLoaderWidth}
        rectHeight={
          isVendorLoader ? moderateScaleVertical(160) : homeLoaderHeight
        }
      />
      {isBannerDots && (
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: moderateScale(10),
          }}>
          {renderDots()}
          {renderDots()}
          {renderDots()}
        </View>
      )}
      {isVendorLoader && (
        <View style={{...vendorTxtStyles}}>
          {rendorVendorTxtLoader()}
          {rendorVendorTxtLoader()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});
export default React.memo(BannerLoader);
