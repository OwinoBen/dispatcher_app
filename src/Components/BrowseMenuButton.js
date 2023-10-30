import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import {moderateScale, textScale} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';

const BrowseMenuButton = ({fontFamily, containerStyle, onMenuTap}) => {
  return (
    <TouchableOpacity
      onPress={onMenuTap}
      activeOpacity={0.8}
      style={{
        backgroundColor: MyDarkTheme.dark
          ? MyDarkTheme.colors.lightDark
          : colors.black,
        position: 'absolute',
        bottom: 40,
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScale(10),
        borderRadius: 50,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        ...containerStyle,
      }}>
      <Image
        source={imagePath.whiteMenu}
        style={{
          width: moderateScale(12),
          height: moderateScale(12),
          marginRight: moderateScale(8),
        }}
      />
      <Text
        style={{
          color: colors.white,
          fontSize: textScale(13),
          fontFamily: fontFamily.medium,
        }}>
        {strings.BROWSE_MENU}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(BrowseMenuButton);
