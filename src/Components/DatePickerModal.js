import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import strings from '../constants/lang';
import colors from '../styles/colors';
import {
  height,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import imagePath from '../constants/imagePath';
import fontFamily from '../styles/fontFamily';
import {useSelector} from 'react-redux';
const DatePickerModal = ({
  isVisible = false,
  animationType = 'none',
  modalContainer = {},
  date = new Date(),
  mode = 'datetime',
  onDateChange = () => {},
  onclose,
  onSelectDate,
  closeIcon,
  closeText = strings.DONE,
  showHeader = false,
  ...props
}) => {
  const inputRef = useRef();
  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );

  return (
    <Modal
      transparent={true}
      isVisible={isVisible}
      animationType={animationType}
      onBackdropPress={onclose}
      onBackButtonPress={onclose}
      style={[styles.modalContainer, modalContainer]}>
      <View style={styles.modalMainViewContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onSelectDate}>
          {closeIcon ? (
            <Image source={imagePath.crossB} />
          ) : (
            <Text style={styles.closeText}>{closeText}</Text>
          )}
        </TouchableOpacity>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          style={styles.modalMainViewContainer}>
          {!!showHeader && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Text style={styles.carType}>{strings.SELECTDATEANDTIME}</Text>
            </View>
          )}

          <View style={{alignItems: 'center', height: height / 3}}>
            <DatePicker
              date={date ? date : new Date()}
              mode={mode}
              locale={defaultLanguagae?.value}
              // minimumDate={undefined}
              theme={'light'}
              style={{width: width - 20, height: height / 4}}
              onDateChange={value => onDateChange(value)}
              textColor={colors.black}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalMainViewContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // overflow: 'hidden',
    // paddingHorizontal: moderateScale(24),
  },
  modalContainer: {
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: moderateScaleVertical(height / 1.5),
    overflow: 'hidden',
  },
  closeButton: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginVertical: moderateScaleVertical(10),
    marginHorizontal: moderateScaleVertical(20),
  },
  closeText: {
    fontFamily: fontFamily.bold,
    fontSize: textScale(14),
    color: colors.themeColor,
  },
  carType: {
    fontSize: textScale(14),
    color: colors.blackC,
    fontFamily: fontFamily.bold,
  },
});

export default DatePickerModal;
