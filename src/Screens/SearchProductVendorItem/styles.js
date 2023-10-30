import { StyleSheet } from 'react-native';
import { moderateScale, moderateScaleVertical } from '../../styles/responsiveSize';


export default StyleSheet.create({
    bottomLoader: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        // marginTop: moderateScaleVertical(12),
        height: moderateScale(80)
      },

});
