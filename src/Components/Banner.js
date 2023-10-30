import React, {useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CardView from 'react-native-cardview';
import FastImage from 'react-native-fast-image';
import {UIActivityIndicator} from 'react-native-indicators';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useSelector} from 'react-redux';
import {moderateScale, width} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';

const Banner = ({
  imagestyle = {},
  // slider1ActiveSlide = 0,
  bannerData = [],
  dotStyle = {},
  bannerRef,
  cardViewStyle = {},
  sliderWidth = width - 20,
  itemWidth = width - 20,
  onSnapToItem,
  pagination = true,
  resizeMode = 'cover',
  setActiveState = () => {},
  childView = null,
  showLightbox = false,
  onPressImage = () => {}
}) => {
  const {themeColors} = useSelector((state) => state?.initBoot);

  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    showLightboxView: false,
    imageLoader: true,
    // profileInfo: null
  });
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {slider1ActiveSlide, showLightboxView} = state;
  const setSnapState = (index) => {
    updateState({slider1ActiveSlide: index});
    setActiveState(index);
  };
  const bannerDataImages = ({item, index}) => {
    const imageUrl = item?.image?.path
      ? getImageUrl(
          item.image.path.image_fit,
          item.image.path.image_path,
          '1000/1000',
        )
      : getImageUrl(item.image.image_fit, item.image.image_path, '1000/1000');

    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.imageStyle, imagestyle]}
          onPress={onPressImage}>
          {/* <Lightbox
            underlayColor={'black'}
            renderContent={() => renderCarousel(imageUrl)}> */}

          <FastImage
            source={{uri: imageUrl, priority: FastImage.priority.high}}
            //  onLoadStart={()=>}
            onLoadEnd={() => updateState({imageLoader: false})}
            style={{height: width * 0.7, width: width, ...imagestyle}}
            resizeMode={resizeMode}>
            {!!state.imageLoader && (
              <UIActivityIndicator
                color={themeColors.primary_color}
                size={40}
              />
            )}
            {childView}
          </FastImage>

          {/* </Lightbox> */}

          {pagination && (
            <View style={{justifyContent: 'flex-end', height: 200}}>
              <Pagination
                dotsLength={bannerData.length}
                activeDotIndex={slider1ActiveSlide}
                containerStyle={{paddingTop: 5}}
                dotColor={'grey'}
                dotStyle={[styles.dotStyle, dotStyle]}
                inactiveDotColor={'black'}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.8}
              />
            </View>
          )}
        </TouchableOpacity>
      </>
    );
  };
  return (
    <CardView style={[styles.cardViewStyle, cardViewStyle]}>
      <Carousel
        ref={bannerRef}
        data={bannerData}
        renderItem={bannerDataImages}
        autoplay={true}
        loop={true}
        autoplayInterval={3000}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        onSnapToItem={(index) => setSnapState(index)}
      />
    </CardView>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  dotStyle: {height: 12, width: 12, borderRadius: 12 / 2},
  cardViewStyle: {
    alignItems: 'center',
    height: 200,
    width: width - 20,
    marginHorizontal: moderateScale(10),
    overflow: 'visible',

    // marginRight: 20
  },
});
export default React.memo(Banner);
