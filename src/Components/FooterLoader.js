import React from 'react';
import {UIActivityIndicator} from 'react-native-indicators';
import colors from '../styles/colors';

const FooterLoader = ({style = {}}) => {
  return (
    <UIActivityIndicator style={style} size={40} color={colors.themeColor} />
  );
};

export default React.memo(FooterLoader);
