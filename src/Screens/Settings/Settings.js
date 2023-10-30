import React, {useState} from 'react';
import {Alert, Image, ScrollView, Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import ModalView from '../../Components/Modal';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings, {changeLaguage} from '../../constants/lang';
import actions from '../../redux/actions';
// import store from '../../redux/store';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {showError, showSuccess} from '../../utils/helperFunctions';
import stylesFunc from './styles';
import RNRestart from 'react-native-restart';
import navigationStrings from '../../navigation/navigationStrings';
import {appIds} from '../../utils/constants/DynamicAppKeys';
import DeviceInfo from 'react-native-device-info';
import {removeItem} from '../../utils/utils';
import {removerUserData} from '../../redux/actions/auth';

export default function Settings({route, navigation}) {
  const userData = useSelector(state => state?.auth?.userData);

  const {defaultLanguage, clientInfo} = useSelector(state => state?.initBoot);

  const styles = stylesFunc({defaultLanguage});
  const [state, setState] = useState({
    isLoading: false,
    allLanguages:
      appIds.bluebolt == DeviceInfo.getBundleId()
        ? [
            {
              id: 1,
              label: 'English',
              value: 'en',
            },
            {
              id: 9,
              label: 'Vietnamese',
              value: 'vi',
            },
          ]
        : [
            {
              id: 1,
              label: 'English',
              value: 'en',
            },
            {
              id: 2,
              label: 'Spanish',
              value: 'es',
            },
            {
              id: 3,
              label: 'Arabic',
              value: 'ar',
            },
            {
              id: 4,
              label: 'German',
              value: 'ger',
            },
            {
              id: 5,
              label: 'French',
              value: 'fr',
            },
            {
              id: 6,
              label: 'Chinese',
              value: 'zh',
            },
            {
              id: 7,
              label: 'Russian',
              value: 'Ru',
            },
            {
              id: 8,
              label: 'Portuguese - (Brazil)',
              value: 'ptBr',
            },
            {
              id: 8,
              label: 'Sweden',
              value: 'sv',
            },
            {
              id: 9,
              label: 'Vietnamese',
              value: 'vi',
            },
            {
              id: 10,
              label: 'Nepali',
              value: 'ne',
            },
            {
              id: 11,
              label: 'Swahili',
              value: 'swa',
            },
            {
              id: 12,
              label: 'Hebrew',
              value: 'he',
            },
          ],
    selectedLangauge: defaultLanguage?.label
      ? defaultLanguage
      : appIds.bluebolt == DeviceInfo.getBundleId()
      ? {
          id: 9,
          label: 'Vietnamese',
          value: 'vi',
        }
      : {
          id: 1,
          label: 'English',
          value: 'en',
        },
    isModalVisibleForLanguage: false,
  });

  const {isLoading, allLanguages, selectedLangauge, isModalVisibleForLanguage} =
    state;
  const commonStyles = commonStylesFunc({fontFamily});

  const updateState = data => setState(state => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  const _selecLangauge = language => {
    updateState({
      selectedLangauge: language,
    });
  };

  const onModalVisiblity = () => {
    updateState({
      isModalVisibleForLanguage: true,
    });
  };

  const setFinalSelectedLanguage = type => {
    if (type === 'ok') {
      updateState({isLoading: true});
      setTimeout(() => {
        changeLaguage(selectedLangauge?.value);
        actions.setDefaultLanguage(selectedLangauge);
        updateState({isLoading: false});
        showSuccess(strings.LANGUAGECHANGED);
      }, 2000);

      // RNRestart.Restart();
    }
    updateState({
      isModalVisibleForLanguage: false,
    });
  };

  const modalMainContent = () => {
    return (
      <View
        style={{
          height: height / 1.4,
        }}>
        <Text
          style={[
            styles.languageTitleTextStyle,
            {marginHorizontal: moderateScale(20), fontSize: textScale(16)},
          ]}>
          {strings.LANGUAGE}
        </Text>
        <View style={styles.lineViewstyle} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{height: moderateScaleVertical(height)}}>
          <View>
            {allLanguages.map((item, index) => {
              return (
                <TouchableOpacity onPress={() => _selecLangauge(item)}>
                  <View style={styles.languageListItemContainer}>
                    <TouchableOpacity onPress={() => _selecLangauge(item)}>
                      <Image
                        source={
                          selectedLangauge?.id == item?.id
                            ? imagePath.redioSelectedButton
                            : imagePath.redioUnSelectedButton
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => _selecLangauge(item)}>
                      <Text
                        style={{
                          marginHorizontal: moderateScale(20),
                          fontFamily: fontFamily.semiBold,
                          color: colors.textGrey,
                        }}>
                        {item?.label}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.modealBottomContainer} />
        <View style={styles.modalBottomButtonContainer}>
          <TouchableOpacity onPress={() => setFinalSelectedLanguage('cancel')}>
            <Text style={styles.modalText}>{strings.CANCEL}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFinalSelectedLanguage('ok')}>
            <Text style={styles.modalText}>{strings.OK}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const logout = () => {
    actions
      .logout({}, {client: clientInfo?.database_name})
      .then(res => {
        showSuccess(res?.message ? res?.message : 'Logout successfully.');
        moveToNewScreen(navigationStrings.LOGIN)();
      })
      .catch(errorMethod);
  };

  const errorMethod = error => {
    showError(error?.message || error?.error);
  };

  const _onLogout = () => {
    Alert.alert('', strings.AREYOUSURE, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: strings.OK,
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  const onDeleteAccount = () => {
    Alert.alert('', strings.ARE_YOU_SURE_YOU_WANT_TO_DELETE, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        // style: 'destructive',
      },
      {
        text: strings.CONFIRM,
        onPress: deleleUserAccount,
      },
    ]);
  };
  const deleleUserAccount = async () => {
    try {
      const res = await actions.deleteAccount(
        {},
        {
          client: clientInfo?.database_name,
          language: defaultLanguage?.value ? defaultLanguage?.value : 'en',
        },
      );
      console.log('delete user account res++++', res);
      await removeItem('userData');
      removerUserData(null);
      showSuccess(res?.massage);
      // logout()
    } catch (error) {
      console.log('erro raised', error);
      showError(error?.message);
    }
  };

  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoading={isLoading}
      source={loaderOne}>
      <Header
        headerStyle={{backgroundColor: colors.white}}
        rightIcon={
          appIds.goody === DeviceInfo.getBundleId() ? imagePath.logout : ''
        }
        onPressRight={_onLogout}
        // onPressLeft={()=>navigation.goBack()}
        centerTitle={strings.SETTING}
      />
      <View style={{...commonStyles.headerTopLine}} />
      <View style={styles.spaceViewStyle}></View>
      <TouchableOpacity onPress={() => onModalVisiblity()}>
        <View style={styles.languageContainer}>
          <Text style={styles.languageTitleTextStyle}>{strings.LANGUAGE}</Text>
          <TouchableOpacity onPress={() => onModalVisiblity()}>
            <View style={styles.selectedLanguageViewContainer}>
              <Text style={styles.selectedLanguageText}>
                {defaultLanguage?.label
                  ? defaultLanguage?.label
                  : selectedLangauge?.label}
              </Text>
              <Image
                style={styles.arrowIconStyle}
                source={imagePath.forwordArrow}
              />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onDeleteAccount}
        style={{
          marginTop: 'auto',
          alignSelf: 'center',
          marginBottom: moderateScaleVertical(12),
          // backgroundColor: colors.blueBackGroudC,
          // padding: 7,
        }}>
        <Text
          style={{
            color: colors.redB,
            fontFamily: fontFamily.bold,
            fontSize: textScale(20),
          }}>
          Delete Account
        </Text>
      </TouchableOpacity>
      <ModalView
        isVisible={isModalVisibleForLanguage}
        mainViewStyle={{
          maxHeight: height,
        }}
        modalMainContent={modalMainContent}
        // modalBottomContent={modalBottomContent}
      />
    </WrapperContainer>
  );
}
