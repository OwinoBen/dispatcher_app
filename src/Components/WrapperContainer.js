import React from 'react';
import {StatusBar, View} from 'react-native';
import colors from '../styles/colors';
import CustomAnimatedLoader from './CustomAnimatedLoader';
import Loader from './Loader';
import {defaultLoader} from '../Components/Loaders/AnimatedLoaderFiles';
import {useSelector} from 'react-redux';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import strings from '../constants/lang';

const WrapperContainer = ({
  children,
  isLoading,
  isLoadingB,
  bgColor = colors.white,
  statusBarColor = colors.white,
  barStyle = 'dark-content',
  withModal = false,
  source = defaultLoader,
  loadercolor,
  loaderHeightWidth,
  extraStyles = {},
}) => {
  // const {themeColors} = useSelector((state) => state?.initBoot);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: statusBarColor,
      }}>
      <StatusBar backgroundColor={statusBarColor} barStyle={barStyle} />
      <View style={{backgroundColor: bgColor, flex: 1}}>{children}</View>
      {!!isLoading?<Loader isLoading={isLoading} withModal={withModal} />:null}
      {!!isLoadingB?<CustomAnimatedLoader
        source={source}
        loaderTitle={strings.LOADING}
        containerColor={colors.white}
        // loadercolor={themeColors.primary_color}
        animationStyle={[
          {
            height: moderateScaleVertical(40),
            width: moderateScale(40),
          },
          {...loaderHeightWidth},
        ]}
        visible={isLoadingB}
      />:null}
    </SafeAreaView>
  );
};

export default WrapperContainer;
