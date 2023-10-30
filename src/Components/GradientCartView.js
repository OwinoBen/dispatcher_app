import React, {useEffect, useState} from 'react';
import {Image, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {moderateScale, width} from '../styles/responsiveSize';
import {getColorCodeWithOpactiyNumber} from '../utils/helperFunctions';
import BrowseMenuButton from './BrowseMenuButton';
import {MaterialIndicator} from 'react-native-indicators';

const GradientCartView = ({
  containerStyle,
  btnStyle = {},
  //colorsArray = [themeColors?.primary_color, themeColors?.primary_color],
  borderRadius = 13,
  onPress,
  btnText,
  marginTop = 0,
  marginBottom = 0,
  textStyle = {},
  indicator = false,
  endcolor = {},
  startcolor = {},
  colorsArray = null,
  indicatorColor = '#0000ff',
  disabled = false,
  onMenuTap,
  ifCartShow,
  isMenuBtnShow,
  isLoading = false,
}) => {
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const buttonTextColor = themeColors;

  const commonStyles = commonStylesFun({fontFamily, buttonTextColor});
  const [zoomIn, setZoomIn] = useState(true);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // setTimeout(() => {
    //   setZoomIn(false)
    // }, 1000);

    // setTimeout(() => {
    //   setShowText(true)
    // }, 1500);
    setTimeout(() => {
      setZoomIn(false);
    }, 100);

    setTimeout(() => {
      setShowText(true);
    }, 300);
  }, []);

  const zoomOut = {
    0: {
      opacity: 0,
      scale: 0,
    },
    0.5: {
      opacity: 1,
      scale: 0.3,
    },
    1: {
      opacity: 1,
      scale: 1,
    },
  };

  const expand = {
    0: {
      opacity: 1,
      scale: 1,
      width: 58,
    },
    0.5: {
      opacity: 1,
      scale: 1,
      width: 200,
    },
    1: {
      opacity: 1,
      scale: 1,
      width: width,
    },
  };

  const textOpacity = {
    0: {
      marginLeft: -100,
    },
    0.5: {
      marginLeft: -70,
    },
    1: {
      marginLeft: 20,
    },
  };

  const menuBtnAnimation = {
    0: {
      marginBottom: -70,
    },
    0.5: {
      marginBottom: -40,
    },
    1: {
      marginBottom: 0,
    },
  };

  const menuBtnAnimationReverse = {
    0: {
      marginBottom: 80,
    },
    0.5: {
      marginBottom: 40,
    },
    1: {
      marginBottom: 0,
    },
  };

  return (
    <View>
      {isMenuBtnShow ? (
        <Animatable.View
          duration={400}
          animation={ifCartShow ? menuBtnAnimation : menuBtnAnimationReverse}>
          <BrowseMenuButton
            fontFamily={fontFamily}
            onMenuTap={onMenuTap}
            // containerStyle={{ marginBottom: moderateScale(-58) }}
          />
        </Animatable.View>
      ) : null}

      {ifCartShow && (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
          <Animatable.View
            style={{
              ...commonStyles.buttonRect,
              borderWidth: 0,
              marginTop,
              marginBottom,
              height: moderateScale(65),
              width: moderateScale(65),
              borderRadius: 100,
              ...containerStyle,
            }}
            animation={zoomIn ? zoomOut : expand}
            duration={500}>
            <LinearGradient
              start={{x: 0.0, y: -1.5}}
              end={{x: 0.5, y: 1.0}}
              // end={endcolor}
              style={{
                height: '100%',
                alignItems: 'center',
                // justifyContent: 'space-between',
                flexDirection: 'row',
                width: '85%',
                marginBottom: moderateScale(40),
                paddingRight: moderateScale(4),
                // paddingLeft: moderateScale(20),
                borderRadius: 100,
                ...btnStyle,
              }}
              colors={
                colorsArray
                  ? colorsArray
                  : [
                      themeColors?.primary_color,
                      getColorCodeWithOpactiyNumber(
                        themeColors?.primary_color.substr(1),
                        70,
                      ),
                    ]
              }>
              {showText && (
                <Animatable.Text
                  duration={500}
                  animation={showText ? textOpacity : null}
                  style={{
                    ...commonStyles.buttonTextWhite,
                    color: colors.white,
                    ...textStyle,
                  }}>
                  {btnText}
                </Animatable.Text>
              )}
              <Animatable.View
                animation={zoomOut}
                duration={500}
                style={{
                  width: moderateScale(50),
                  height: moderateScale(50),
                  borderRadius: moderateScale(50),
                  backgroundColor: 'rgba(255,255,255,.5)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: showText ? moderateScale(10) : 0,
                }}>
                {isLoading && (
                  <MaterialIndicator
                    color="#fff"
                    style={{position: 'absolute', opacity: 0.8}}
                    size={moderateScale(55)}
                    trackWidth={moderateScale(4.5)}
                  />
                )}
                <Image source={imagePath.cartIcon} />
              </Animatable.View>
            </LinearGradient>
          </Animatable.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(GradientCartView);
