import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {height} from '../../styles/responsiveSize';

export default StyleSheet.create({
  map: {
    // ...StyleSheet.absoluteFillObject,
    height: height,
    justifyContent: 'flex-end',
  },
  dotContainerStyle:{
    height: 40,
    width: 0.5,
    backgroundColor: colors.textGreyLight,
  }
});
