import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView} from 'react-native';
// import {WebView} from 'react-native-webview';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {moderateScale} from '../../styles/responsiveSize';
import {showError} from '../../utils/helperFunctions';
import stylesFun from './styles';

export default function Webview({navigation, route}) {
  const paramData = route?.params;
  console.log(paramData, 'paramData>>>');
  const [state, setState] = useState({
    isLoading: false,
    title: '',
    content: null,
  });

  const {title, content} = state;
  //update your state
  const updateState = data => setState(state => ({...state, ...data}));


  //Redux Store Data
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle,clientInfo} =
  useSelector(state => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});
  const styles = stylesFun({fontFamily});

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  useEffect(() => {
    getListOfAllCmsLinks();
  }, []);


  const getListOfAllCmsLinks = () => {
    actions
      .getListOfAllCmsLinks(`?cms_id=${paramData?.id}`, {}, {client: clientInfo?.database_name})
      .then(res => {
        console.log('All Cms links', res);
        if (res?.data) {
          updateState({
            title: res?.data?.name,
            content: res?.data?.content,
          });
        }
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = error => {
    console.log(error, 'error');
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.white}>
      <Header
        leftIcon={imagePath.backArrow}
        centerTitle={title}
        headerStyle={{backgroundColor: colors.white}}
      />
      <View style={{...commonStyles.headerTopLine}} />
      {/* <WebView source={{uri: content}} /> */}
      <ScrollView bounces={false}>
      <View
        style={{
          marginHorizontal: moderateScale(20),
          marginTop: moderateScale(20),
        }}>
        <Text style={styles.content}>{content}</Text>
      </View>
      </ScrollView>
      
    </WrapperContainer>
  );
}
