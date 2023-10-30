import React from 'react';
import {View} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

const CategoryLoader = ({
  listSize = 1,
  cardWidth = width * 0.297,
  height = moderateScaleVertical(128),
  containerStyle = {},
  isRow = false,
  pRows = 0,
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
          pRows={pRows}
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
          marginHorizontal: moderateScale(8),
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {contentCard()}
        {contentCard()}
        {contentCard()}
        {contentCard()}
      </View>
    );
  }
  return contentCard();
};
export default React.memo(CategoryLoader);
