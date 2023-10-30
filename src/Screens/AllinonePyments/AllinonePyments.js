import queryString from 'query-string';
import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import colors from '../../styles/colors';
import { moderateScaleVertical } from '../../styles/responsiveSize';

export default function AllinonePyments({ navigation, route }) {
  let paramsData = route?.params?.data || {};
  console.log(paramsData,"paramsData")


  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const onNavigationStateChange = (props) => {

    const { url } = props;
    const URL = queryString.parseUrl(url);
    const queryParams = URL.query;
    const nonQueryURL = URL.url;
    console.log(props, 'returnURL');
    console.log('query params', queryParams);
    let transId = '';
    if (url.includes('payment/checkoutSuccess')) {
      //in case of paypal
      transId = url.substring(url.lastIndexOf('/') + 1);
    } else {
      transId = queryParams?.transaction_id;
    }
    setTimeout(() => {
      if (
        queryParams?.status == 200 ||
        url.includes('payment/checkoutSuccess')
      ) {

        if (paramsData.action == 'wallet') {
          moveToNewScreen(paramsData?.screenName)();

          return;
        }
      }
      else if (queryParams?.status == 0) {

        setTimeout(() => {
          moveToNewScreen(paramsData?.screenName)();


        }, 1000);
      }
    }, 1500);
  };


  return (
    <WrapperContainer
      bgColor={colors.transparent}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={false}>
      <Header
        leftIcon={
          imagePath.backArrow
        }
        centerTitle={"Payment"}
        headerStyle={{ backgroundColor: colors.white }}
      />
      {!!paramsData?.paymentUrl && paramsData?.id != 6 ? (
        <WebView
          // onLoad={() => updateState({ isLoading: false })}
          source={{ uri: paramsData?.paymentUrl }}
          onNavigationStateChange={onNavigationStateChange}
        />
      ) : (
        <WebView
          // onLoad={() => updateState({ isLoading: false })}
          source={{
            uri: paramsData?.paymentUrl?.redirectUrl,
            method: 'POST',
            body: queryString.stringify(paramsData?.paymentUrl?.formData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          }}
          onNavigationStateChange={onNavigationStateChange}
        />
        // <></>
      )}

      <View
        style={{
          height: moderateScaleVertical(75),
          backgroundColor: colors.transparent,
        }}
      />
    </WrapperContainer>
  );
}
