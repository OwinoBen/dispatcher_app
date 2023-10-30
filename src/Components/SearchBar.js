import React from 'react';
import {
  I18nManager,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';

const SearchBar = ({
  containerStyle = {},
  placeholder = '',
  onChangeText,
  showRightIcon = false,
  rightIconPress = () => {},
  searchValue = '',
  rightIconStyle,
  autoFocus,
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: moderateScale(16),
        height: moderateScaleVertical(48),
        backgroundColor: colors.white,
        alignItems: 'center',
        ...containerStyle,
      }}>
      <Image
        style={{
          tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.blackLight,
        }}
        source={imagePath.icSearchb}
      />
      <View style={{flex: 1, marginLeft: 10}}>
        <TextInput
          style={{
            flex: 1,
            paddingTop: 0,
            paddingBottom: 0,
            fontFamily: fontFamily.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
          }}
          value={searchValue}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onChangeText={onChangeText}
          //onChange={onChangeText}
          placeholderTextColor={
            isDarkMode ? MyDarkTheme.colors.text : colors.textGreyB
          }
        />
      </View>
      {showRightIcon && (
        <TouchableOpacity onPress={rightIconPress}>
          <Image source={imagePath.crossBlueB} style={{...rightIconStyle}} />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default React.memo(SearchBar);
