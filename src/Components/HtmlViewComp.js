import React from 'react';
import {View} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {moderateScale, textScale} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';

const HtmlViewComp = ({plainHtml = null, numOfLine = 2, ...props}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const isDarkMode = theme;
  return (
    <View style={{maxHeight: 40}}>
      <HTMLView
        value={'<div>' + plainHtml + '</div>'}
        stylesheet={{
          div: {
            fontSize: textScale(9),
            fontFamily: fontFamily.regular,
            lineHeight: moderateScale(14),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyE,
            textAlign: 'left',
          },
        }}
        {...props}
      />
    </View>
  );
};

export default React.memo(HtmlViewComp);
