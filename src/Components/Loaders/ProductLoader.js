import React from 'react';
import {View} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

const ProductLoader = ({
  listSize = 1,
  cardWidth = width * 0.5 - moderateScale(12),
  height = moderateScaleVertical(128),
  containerStyle = {},
  isRow = false,
  rowContainerstyle = {},
}) => {
  const contentCard = () => {
    return (
      <View style={{...containerStyle, width: cardWidth, padding: 0}}>
        <ContentLoader
          listSize={listSize}
          pRows={4}
          tWidth={0}
          tHeight={0}
          pHeight={[cardWidth, 15, 15, 40]}
          pWidth={[cardWidth, cardWidth, cardWidth, cardWidth]}
          titleStyles={{marginLeft: 0, paddingLeft: 0}}
          containerStyles={{
            ...rowContainerstyle,
            marginLeft: 0,
            marginRight: 0,
            paddingHorizontal: 0,
            paddingBottom: 0,
          }}
        />
      </View>
    );
  };

  if (isRow) {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginHorizontal: moderateScale(8),
          }}>
          {contentCard()}
          {contentCard()}
        </View>
      </>
    );
  }
  return contentCard();
};
export default React.memo(ProductLoader);
