import React from 'react';
import {StyleSheet, View, Modal, ViewPropTypes, Text} from 'react-native';
import PropTypes from 'prop-types';
import LottieAnimation from 'lottie-react-native';
import {defaultLoader} from './Loaders/AnimatedLoaderFiles';
import colors from '../styles/colors';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';
export default class CustomAnimatedLoader extends React.PureComponent {
  static defaultProps = {
    visible: false,
    overlayColor: 'rgba(0, 0, 0, 0.25)',
    animationType: 'none',
    source: defaultLoader,
    animationStyle: {},
    speed: 1,
    loop: true,

    colorFilters: [
      {
        keypath: defaultLoader?.layers[0].nm,
        color: '#808080',
      },
    ],
  };

  static propTypes = {
    visible: PropTypes.bool,
    overlayColor: PropTypes.string,
    animationType: PropTypes.oneOf(['none', 'slide', 'fade']),
    source: PropTypes.object,
    animationStyle: ViewPropTypes.style,
    speed: PropTypes.number,
    loop: PropTypes.bool,
    colorFilters: PropTypes.array,
  };

  animation = React.createRef();

  componentDidMount() {
    if (this.animation.current) {
      this.animation.current.play();
    }
  }

  componentDidUpdate(prevProps) {
    const {visible} = this.props;
    if (visible !== prevProps.visible) {
      if (this.animation.current) {
        this.animation.current.play();
      }
    }
  }

  _renderLottie = () => {
    const {
      source,
      animationStyle,
      speed,
      loop,
      loadercolor = colors.themeColor,
    } = this.props;

    return (
      <LottieAnimation
        ref={this.animation}
        source={source}
        loop={loop}
        speed={speed}
        style={[styles.animationStyle, animationStyle]}
        colorFilters={
          source?.nm == 'loader_circular1'
            ? [
                {
                  keypath: source?.layers[0].nm,
                  color: loadercolor,
                },
                {
                  keypath: source?.layers[1].nm,
                  color: loadercolor,
                },
              ]
            : [
                {
                  keypath: source?.layers[0].nm,
                  color: loadercolor,
                },
              ]
        }
      />
    );
  };

  render() {
    const {
      visible,
      overlayColor,
      animationType,
      loadercolor,
      containerColor,
      loaderTitle,
    } = this.props;

    return (
      <Modal
        transparent
        visible={visible}
        animationType={animationType}
        supportedOrientations={['portrait']}
        onRequestClose={() => {}}>
        <View style={[styles.container, {backgroundColor: overlayColor}]}>
          <View
            style={{
              height: moderateScaleVertical(100),
              width: moderateScale(100),
              backgroundColor: containerColor,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this._renderLottie()}
            <Text style={{color: loadercolor}}>{loaderTitle}</Text>
          </View>
          {this.props.children}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationStyle: {
    height: '100%',
    width: '100%',
  },
});
