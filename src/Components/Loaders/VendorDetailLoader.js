import React from 'react';
import {View} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

const VendorDetailLoader = ({
  listSize = 1,
  cardWidth = width * 0.297,
  height = moderateScaleVertical(128),
  containerStyle = {},
  isRow = false,
}) => {
  const contentCard = () => {
    return (
      <View style={{...containerStyle, width: cardWidth, padding: 0}}>
        <ContentLoader
          active
          listSize={listSize}
          tWidth={cardWidth}
          titleStyles={{marginLeft: 0, paddingLeft: 0}}
          tHeight={height}
          pRows={1}
          pWidth={['100%']}
          paragraphStyles={{marginTop: -4, marginBottom: 10}}
          containerStyles={{
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginHorizontal: moderateScale(8),
        }}>
        {contentCard()}
        {contentCard()}
        {contentCard()}
      </View>
    );
  }
  return contentCard();
};
export default React.memo(VendorDetailLoader);
