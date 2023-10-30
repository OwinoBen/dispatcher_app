import {debounce} from 'lodash';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  RefreshControl,
  FlatList,
  ScrollView,
} from 'react-native';
import Communications from 'react-native-communications';
import {useSelector} from 'react-redux';
import Header, {stylesFunc} from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import TaskListCard from '../../Components/TaskListCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
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
import LinearGradient from 'react-native-linear-gradient';
import {
  colorArray,
  transportationArray,
} from '../../utils/constants/ConstantValues';
import {showError} from '../../utils/helperFunctions';
import DatePicker from 'react-native-date-picker';
import DatePickerModal from '../../Components/DatePickerModal';
import {TouchableOpacity} from 'react-native';
import moment from 'moment';
import navigationStrings from '../../navigation/navigationStrings';
import stylesFunction from './styles';
export default function ContactUs({route, navigation}) {
  const userData = useSelector(state => state?.auth?.userData);
  console.log(userData, 'userData');
  const [state, setState] = useState({
    isLoading: false,
  });

  const {isLoading} = state;
  const commonStyles = commonStylesFunc({fontFamily});
  const updateState = data => setState(state => ({...state, ...data}));
  const clientInfo = useSelector(state => state?.initBoot?.clientInfo);
  console.log(clientInfo, 'clientInfoclientInfo');
  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );

  const styles = stylesFunction({defaultLanguagae});

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  //Error handling in api
  const errorMethod = error => {
    updateState({isLoading: false});
    showError(error?.message || error?.error);
  };

  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoading={isLoading}
      source={loaderOne}>
      <Header
        headerStyle={{backgroundColor: colors.white}}
        leftIconStyle={{tintColor: colors.themeColor}}
        // hideRight={true}
        // onPressLeft={()=>navigation.goBack()}
        centerTitle={strings.CONTACT}
      />
      <View style={{...commonStyles.headerTopLine}} />

      <View
        style={{
          marginHorizontal: moderateScale(20),
          marginTop: moderateScale(50),
        }}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.getInTouch}>{strings.GETINTOUCH}</Text>
          <Text style={styles.wanttoget}>{strings.WANTTOGET}</Text>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: moderateScale(20),
          marginVertical: moderateScale(20),
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            Communications.phonecall(
              `+${clientInfo?.get_country_set?.phonecode}${clientInfo?.phone_number}`,
              true,
            )
          }
          style={styles.emailCallView}>
          <Image source={imagePath?.call} />

          <Text style={styles.phoneEmailStyle}>{`${
            !!clientInfo?.get_country_set?.phonecode
              ? '+ ' + clientInfo?.get_country_set?.phonecode + ' - '
              : ''
          }${clientInfo?.phone_number}`}</Text>
        </TouchableOpacity>

        {/* email  View*/}

        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            Communications.email(
              [clientInfo?.email, clientInfo?.email],
              null,
              null,
              '',
              '',
            )
          }
          style={{...styles.emailCallView, marginTop: moderateScale(20)}}>
          <Image source={imagePath?.chatBlue} />
          <Text style={styles.phoneEmailStyle}>{clientInfo?.email}</Text>
        </TouchableOpacity>
      </View>
      {/* email  View*/}
    </WrapperContainer>
  );
}
