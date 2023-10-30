import React, {useRef} from 'react';
import SwitchSelector from 'react-native-switch-selector';
import colors from '../styles/colors';
import {
  StyleSheet,
  I18nManager,
  TouchableOpacity,
  TextInput,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import fontFamily from '../styles/fontFamily';
import {
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
const ButtonComponent = ({
  onPress,
  buttonTitle = '',
  buttonStyle = {},
  imagevalue = false,
  imageStyle = {},
  buttonTitleStyle = {},
  containerStyle = {},
}) => {
  return (
    <View style={{...styles.container, ...containerStyle}}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{...styles.button, ...buttonStyle}}>
          {imagevalue && (
            <View>
              <Image style={imageStyle} source={imagevalue} />
            </View>
          )}
          <Text style={{...styles.text, ...buttonTitleStyle}}>
            {buttonTitle}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: fontFamily.semiBold,
  },
  label: {
    marginBottom: moderateScaleVertical(10),

    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
    color: colors.lightGreyBg2,
  },
  textInputStyle: {width: width / 1.8},
  container: {
    flex: 1,
    // flexDirection: 'column',
    justifyContent: 'flex-end',
    marginBottom: -15,
  },
  button: {
    padding: 15,
    borderWidth: 0,
    borderColor: '#111',
    backgroundColor: colors.themeColor,
  },
  text: {
    backgroundColor: 'transparent',
    color: '#111',
    textAlign: 'center',
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    fontSize: textScale(14),
  },
  bgFill: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default ButtonComponent;
