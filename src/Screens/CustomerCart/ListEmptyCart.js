import React from 'react';
import {Image, SafeAreaView, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import {MyDarkTheme} from '../../styles/theme';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dynamic';

export default function ListEmptyCart({
  isLoading = false,
  containerStyle = {},
  text = strings.NOPRODUCTCART,
  textStyle = {},
  image = null,
}) {
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});
  if (!isLoading) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={[styles.containerStyle, containerStyle]}>
          <Image source={image ? image : imagePath.emptyCart2} />
          <Text
            style={{
              ...styles.textStyle,
              ...textStyle,
              color: theme ? MyDarkTheme.colors.text : colors.textGreyB,
            }}>
            {text}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  return null;
}
