import React, {useEffect, useState} from 'react';
import ContentLoader, {Circle, Rect} from 'react-content-loader/native';
import {
  FlatList,
  I18nManager,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {useSelector} from 'react-redux';
import FooterLoader from '../../Components/FooterLoader';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import RoundImg from '../../Components/RoundImg';
import SearchBar from '../../Components/SearchBar';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc, {hitSlopProp} from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {getCurrentLocation, getHostName} from '../../utils/helperFunctions';
import {setItem} from '../../utils/utils';
import styles from './styles';

let isNoMore = false;
let onEndReachedCalledDuringMomentum = false;

export default function SearchProductVendorItem2({navigation, route}) {
  let cartDetail = route?.params?.data?.cartDetail;
  let taskDetail = route?.params?.data?.taskDetail;
  let apiData = route?.params?.data?.apiData;
  console.log(cartDetail,"cartDetail>cartDetail");
  const [state, setState] = useState({
    isLoading: true,
    searchInput: '',
    searchData: [],
    showRightIcon: false,
    pageCount: 1,
    isLoadMore: false,
    showShimmer: false,
    userCurrentLatitude: null,
    userCurrentLongitude: null,
  });

  const theme = useSelector(state => state?.initBoot?.themeColor);
  const toggleTheme = useSelector(state => state?.initBoot?.themeToggle);
  const previousSearches = useSelector(state => state?.initBoot?.searchText);
  const dineInType = useSelector(state => state?.home?.dineInType);
  const clientInfo = useSelector(state => state?.initBoot?.clientInfo);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {
    isLoading,
    searchInput,
    searchData,
    showRightIcon,
    recentlySearched,
    trendingNearYou,
    pageCount,
    isLoadMore,
    showShimmer,
    userCurrentLatitude,
    userCurrentLongitude,
  } = state;
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector(state => state?.initBoot);

  //route params
  const paramData = route?.params?.data;
  console.log('param data', paramData);
  const appMainData = useSelector(state => state?.home?.appMainData);
  const recommendedVendorsdata = appMainData?.vendors;
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});

  //update state
  const updateState = data => setState(state => ({...state, ...data}));
  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const onChangeText = value => {
    updateState({
      searchInput: value,
      isLoading: false,
    });
  };
  console.log(paramData, 'paramData');
  userCurrentLatitude, userCurrentLongitude;

  //Global searching of data
  const globalSearch = (pageCount, searchAgain = false) => {
    let data = {};
    data['keyword'] = searchInput;
    data['vendor'] = paramData.id;
    data['page'] = pageCount;
    // edit-order/search/vendor/products
    let url = `https://${getHostName(
      taskDetail?.order?.call_back_url,
    )}/edit-order/search/vendor/products`;

    actions
      .searchAction(url, data, {client: clientInfo?.database_name})
      .then(response => {
        console.log('res==>>>>++', response);
        if (response?.data?.length == 0) {
          isNoMore = true;
        }
        updateState({
          searchData: searchAgain
            ? response?.data
            : [...searchData, ...response?.data],
          pageCount: searchAgain ? 1 : pageCount + 1,
          isLoading: false,
          isLoadMore: false,
          showShimmer: false,
        });
      })
      .catch(error => {
        console.log(error);
        updateState({
          searchData: [],
          isLoading: false,
          showShimmer: false,
          isLoadMore: false,
        });
      });
  };

  // useEffect(() => {
  //   if (searchInput != '') {
  //     updateState({ showRightIcon: true });
  //     globalSearch(1);
  //   } else {
  //     updateState({ searchData: [], showRightIcon: false, isLoading: false });
  //   }
  // }, [searchInput]);

  // userCurrenetLocation

  const currentLocation = () => {
    getCurrentLocation()
      .then(res => {
        updateState({
          userCurrentLatitude: res?.latitude,
          userCurrentLongitude: res?.longitude,
        });
      })
      .catch(error => {
        console.log(error, ' error in response for current location');
      });
  };

  useEffect(() => {
    currentLocation();
    const searchInterval = setTimeout(() => {
      let searchObj = {};
      if (searchInput.trim()) {
        updateState({
          searchLoader: true,
          showRightIcon: true,
          pageCount: 1,
          showShimmer: true,
        });
        searchObj.search_text = searchInput;
        isNoMore = false;
      }
      if (!!searchObj.search_text) {
        globalSearch(1, true); //search from start
      } else {
        updateState({
          searchData: [],
          showRightIcon: false,
          isLoading: false,
          searchLoader: false,
          showShimmer: false,
        });
      }
    }, 600);
    return () => {
      if (searchInterval) {
        clearInterval(searchInterval);
      }
    };
  }, [searchInput]);

  const _onclickSearchItem = item => {
    console.log(item, 'clickedItem');
    navigation.push(navigationStrings.PRODUCTDETAIL, {
      data: {id: item.id},
      taskDetail: taskDetail,
      cartDetail: cartDetail,
      apiData:apiData
    });
  };

  const onEndReached = () => {
    if (!onEndReachedCalledDuringMomentum && !isNoMore) {
      updateState({isLoadMore: true});
      globalSearch(pageCount + 1);
    }
  };

  const onClickRecent = item => {
    console.log('item+++++', item);
    // return;
    updateState({
      searchInput: item?.dataname || item?.name,
      isLoading: false,
    });
  };

  const renderProduct = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => _onclickSearchItem(item)}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: moderateScale(20),
        }}>
        {!!item?.image_url && (
          <RoundImg
            img={item?.image_url}
            size={35}
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
          />
        )}
        <View style={{flex: 1, marginLeft: moderateScale(12)}}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: textScale(12),
              fontFamily: fontFamily.medium,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {item?.dataname || item?.title || item?.name}
          </Text>
          {/* <Text
            style={{
              fontSize: textScale(9),
              fontFamily: fontFamily.regular,
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.grayOpacity51,
              marginTop: moderateScaleVertical(5),
            }}>
            Dish
          </Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  const _listEmptyComponent = () => {
    return <View />;
  };
  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: moderateScale(8),
            marginTop: moderateScale(5),
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={{
              flex: 0.2,
            }}
            hitSlop={hitSlopProp}>
            <Image
              source={
                appStyle?.homePageLayout === 3
                  ? imagePath.icBackb
                  : imagePath.backArrow
              }
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
              }}
            />
          </TouchableOpacity>

          <SearchBar
            containerStyle={{
              marginRight: moderateScale(18),
              borderRadius: 8,
              width: width / 1.12,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
              height: moderateScaleVertical(37),
              marginLeft: moderateScale(25),
            }}
            searchValue={searchInput}
            placeholder={strings.SEARCH_PRODUCT_VENDOR_ITEM}
            onChangeText={value => onChangeText(value)}
            showRightIcon={showRightIcon}
            rightIconPress={() =>
              updateState({searchInput: '', isLoading: false})
            }
            autoFocus={true}
          />
        </View>

        <View style={{flex: 1}}>
          {showShimmer ? (
            <View
              style={{
                flex: 1,
                marginHorizontal: moderateScale(20),
                marginTop: moderateScaleVertical(24),
              }}>
              {[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}].map(() => {
                return (
                  <ContentLoader style={{height: moderateScale(54)}}>
                    <Circle cx="20" cy="20" r="20" />
                    <Rect x="50" y="14" rx="2" ry="2" width="100" height="8" />
                  </ContentLoader>
                );
              })}
            </View>
          ) : (
            <FlatList
              data={searchData}
              renderItem={renderProduct}
              keyExtractor={(item, index) => String(index)}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              style={{flex: 1, marginVertical: moderateScaleVertical(10)}}
              ListEmptyComponent={_listEmptyComponent}
              ItemSeparatorComponent={() => (
                <View style={{height: moderateScale(20)}} />
              )}
              onEndReached={onEndReached}
              ListHeaderComponent={() => (
                <View style={{height: moderateScale(16)}} />
              )}
              extraData={searchData}
              ListFooterComponent={
                isLoadMore ? (
                  <View style={styles.bottomLoader}>
                    <FooterLoader />
                  </View>
                ) : (
                  <View style={{height: moderateScale(80)}} />
                )
              }
            />
          )}
        </View>
      </View>
    </WrapperContainer>
  );
}
