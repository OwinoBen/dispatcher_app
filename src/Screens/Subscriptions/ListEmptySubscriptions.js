import React from 'react';
import {Text, View} from 'react-native';
import CardLoader from '../../Components/Loaders/CardLoader';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

export default function ListEmptySubscriptions({isLoading = false}) {
  if (isLoading) {
    return (
      <View>
        {[1, 1, 1, 1, 1].map((i, inx) => {
          return (
            <HeaderLoader
              key={String(inx)}
              isRight={false}
              widthLeft={width - moderateScale(30)}
              rectWidthLeft={width - moderateScale(30)}
              rectHeightLeft={moderateScaleVertical(150)}
              heightLeft={moderateScaleVertical(150)}
              viewStyles={{
                marginHorizontal: 0,
                alignSelf: 'center',
                marginTop: moderateScaleVertical(10),
              }}
              rx={8}
              ry={8}
            />
          );
        })}
      </View>
    );
  }
  return (
    <View>
      <Text></Text>
    </View>
  );
}
