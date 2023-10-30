import React from 'react';
import {View} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

const CardLoader = ({
  listSize = 1,
  cardWidth = width * 0.5 - moderateScale(12),
  height = moderateScaleVertical(128),
  containerStyle = {},
  isRow = false,
  rowContainerstyle = {},
  pRows = 0,
  pWidth = 0,
}) => {
  const contentCard = () => {
    return (
      <View
        style={{
          ...containerStyle,
          width: cardWidth,
          padding: 0,
        }}>
        <ContentLoader
          active
          listSize={listSize}
          // primaryColor="rgba(	223,	223,	223,223)"
          // secondaryColor="rgba(239,239,239,239)"
          tWidth={cardWidth}
          titleStyles={{marginLeft: 0, paddingLeft: 0}}
          tHeight={height}
          pRows={pRows}
          pWidth={pWidth}
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
    );
  }
  return contentCard();
};
export default React.memo(CardLoader);
