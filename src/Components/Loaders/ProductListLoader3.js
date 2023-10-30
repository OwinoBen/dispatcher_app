import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import CircularProfileLoader from './CircularProfileLoader';
import HeaderLoader from './HeaderLoader';
import HomeLoader from './HomeLoader';

const ProductListLoader3 = ({
  viewStyles = {},
  widthTop = moderateScale(95),
  rectWidthBottom = moderateScaleVertical(90),
  mainView = {},
  widthLeft = 20,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...mainView,
      }}>
      <View
        style={{
          // alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <HeaderLoader
          isRight={false}
          heightLeft={20}
          rectHeightLeft={20}
          widthLeft={widthLeft}
          rectWidthLeft={widthLeft}
          rx={6}
          ry={6}
          viewStyles={{marginHorizontal: 20, marginBottom: 10}}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View>
            <HeaderLoader
              isRight={false}
              heightLeft={8}
              rectHeightLeft={8}
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              rx={6}
              ry={6}
            />
            <HeaderLoader
              isRight={false}
              heightLeft={8}
              rectHeightLeft={8}
              widthLeft={moderateScale(70)}
              rectWidthLeft={moderateScale(70)}
              viewStyles={{marginTop: moderateScale(7)}}
              rx={6}
              ry={6}
            />
            <HeaderLoader
              isRight={false}
              heightLeft={8}
              rectHeightLeft={8}
              widthLeft={moderateScale(60)}
              rectWidthLeft={moderateScale(60)}
              viewStyles={{marginTop: moderateScale(7)}}
              rx={6}
              ry={6}
            />
          </View>
        </View>
      </View>

      <HomeLoader
        width={widthTop}
        height={rectWidthBottom}
        rectWidth={widthTop}
        rectHeight={rectWidthBottom}
        viewStyles={{marginRight: 10}}
        ry={7}
        rx={7}
      />
    </View>
  );
};
export default React.memo(ProductListLoader3);
const styles = StyleSheet.create({});
