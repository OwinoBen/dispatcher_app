import React from 'react';
import Modal from 'react-native-modal';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {useSelector} from 'react-redux';
import {useDarkMode} from 'react-native-dynamic';
import colors from '../styles/colors';
import {MyDarkTheme} from '../styles/theme';
import commonStylesFun from '../styles/commonStyles';
import strings from '../constants/lang';
import imagePath from '../constants/imagePath';
import ButtonComponent from './ButtonComponent';
import {ScrollView} from 'react-native';

const BottomSlideModal = ({
  isModalVisible = false,
  onBackdropPress = () => {},
  mainContainView,
  _onLangSelect = () => {},
  isLangSelected = false,
  allLangs = [],
  _updateLang = () => {},
  mainContainerStyle,
  innerViewContainerStyle,
}) => {
  const {themeColor, themeToggle, appStyle, themeColors, languages} =
    useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});
  const selectedLangTitle = allLangs.find((itm) => itm.isActive === true);
  return (
    <Modal
      isVisible={isModalVisible}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
      }}
      onBackdropPress={onBackdropPress}>
      <View>
        {/* <TouchableOpacity
        style={styles.closeButton}
        onPress={() => updateState({isModalVisible: false})}>
        <Image source={imagePath.crossC} resizeMode="contain" />
      </TouchableOpacity> */}

        <View
          style={{
            ...styles.mainContainer,

            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
            ...mainContainerStyle,
          }}>
          <View
            style={{
              paddingHorizontal: moderateScale(10),
              paddingVertical: moderateScaleVertical(15),
              ...innerViewContainerStyle,
              // flex: 1,
            }}>
            {mainContainView()}
            {/* <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1}}>
              {allLangs.map((item, indx) => {
                return (
                  <View style={{marginHorizontal: moderateScale(10)}}>
                    <TouchableOpacity
                      key={indx}
                      style={{
                        borderBottomWidth: 0.7,
                        flexDirection: 'row',
                        paddingVertical: moderateScaleVertical(13),
                      }}
                      onPress={(itm) => _onLangSelect(item, indx)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <Text
                          style={{
                            fontFamily: fontFamily.medium,
                            color: isDarkMode
                              ? MyDarkTheme.colors.text
                              : colors.blackOpacity86,
                            fontSize: textScale(12),
                          }}>
                          {item.label}
                        </Text>
                        <Image
                          source={
                            item?.isActive
                              ? imagePath.radioNewActive
                              : imagePath.radioNewInActive
                          }
                          style={{
                            height: moderateScale(20),
                            width: moderateScale(20),
                            tintColor: item?.isActive
                              ? themeColors.primary_color
                              : colors.blackOpacity43,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
              <View style={{height: moderateScale(15)}} />
            </ScrollView> */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export function stylesFunc({fontFamily, themeColors}) {
  const commonStyles = commonStylesFun({fontFamily, themeColors});

  const styles = StyleSheet.create({
    mainContainer: {
      borderTopLeftRadius: moderateScaleVertical(15),
      borderTopRightRadius: moderateScale(15),
      // maxHeight: height - width / 2,
      // minHeight: height / 2.1,
      paddingHorizontal: moderateScale(10),
    },
    changeLangTxt: {
      ...commonStyles.futuraBtHeavyFont18,
    },
    preferLangTxt: {
      ...commonStyles.mediumFont12,
      marginTop: moderateScaleVertical(10),
    },
    placeOrderButtonStyle: {
      backgroundColor: themeColors.primary_color,
      marginHorizontal: moderateScale(5),
      borderRadius: moderateScale(25),
      marginTop: 'auto',
      marginBottom: moderateScaleVertical(15),
    },
  });
  return styles;
}
export default React.memo(BottomSlideModal);
