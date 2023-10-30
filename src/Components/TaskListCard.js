import React, {useState} from 'react';
import SwitchSelector from 'react-native-switch-selector';
import colors from '../styles/colors';
import {StyleSheet} from 'react-native';
import fontFamily from '../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {TouchableOpacity, View, Text, Image} from 'react-native';
import imagePath from '../constants/imagePath';
import moment from 'moment';
import generateBoxShadowStyle from './generateBoxShadowStyle';
import {getColorCodeWithOpactiyNumber} from '../utils/helperFunctions';
import {colorArray} from '../utils/constants/ConstantValues';
import {format} from 'date-fns';
import {useSelector} from 'react-redux';
import strings from '../constants/lang';
import useInterval from '../utils/useInterval';
import {appIds} from '../utils/constants/DynamicAppKeys';
import {getBundleId} from 'react-native-device-info';
const TaskListCard = ({
  data = {},
  allTasks = [],
  index = null,
  _onPressTask = () => {},
  showCurrency = false,
  previousData = null,
  isFromHistory = false,
}) => {
  const localTimeInTimeStamp = moment
    .utc(data?.order?.order_time, 'YYYY-MM-DD HH:mm:ss')
    .unix();

  const localTimeOfOrder = new Date(localTimeInTimeStamp * 1000);
  const orderTimeWithBufferTime =
    data?.order?.order_pre_time > 0
      ? Number(data?.order?.order_pre_time) +
        Number(data?.order?.buffer_time > 0 ? data?.order?.buffer_time : 0)
      : 30 +
        Number(data?.order?.buffer_time > 0 ? data?.order?.buffer_time : 0);
  var deadline = moment(localTimeOfOrder)
    .add(orderTimeWithBufferTime, 'm')
    .toDate();

  const [orderPerpationTime, setOrderPerpationTime] = useState({});
  const [isOrderPrepartionTimeExpired, setIsOrderPrepartionTimeExpired] =
    useState(true);
  //Get Date
  const defaultLanguagae = useSelector(
    state => state?.initBoot?.defaultLanguage,
  );
  const styles = stylesFunc({defaultLanguagae});

  const getDate = date => {
    const local = moment.utc(date).format('DD MMM YYYY hh:mm:a');
    return local;
  };

  //get BackGroundColor
  const getBackGroudColor = name => {
    switch (name) {
      case 'Pickup':
        return getColorCodeWithOpactiyNumber(colors.circularBlue.substr(1), 50);
        break;
      case 'Drop':
        return getColorCodeWithOpactiyNumber(
          colors.circularOrnage.substr(1),
          50,
        );
        break;
      default:
        return getColorCodeWithOpactiyNumber(colors.circularRed.substr(1), 50);
        break;
    }
  };

  /****GET DYNAMIC VALUES */
  const getDynamicUpdateOnValues = () => {
    var colorData = colorArray;

    if (data?.order_id == previousData?.order_id) {
      data['backgroundColor'] = previousData?.backgroundColor;
      data['blur'] = 0.5;
      data['click'] = true;
      allTasks[allTasks.indexOf(data)] = data;
      data['marginTop'] = moderateScale(0);
      return {
        backgroundColor: data?.backgroundColor,
        blur: data?.blur,
        click: data?.click,

        marginTop: data?.marginTop,
      };
    } else {
      data['backgroundColor'] =
        colorData[allTasks.indexOf(data) % colorData.length];
      data['blur'] = 1;
      data['click'] = false;
      allTasks[allTasks.indexOf(data)] = data;
      data['marginTop'] = moderateScale(20);

      return {
        backgroundColor: data?.backgroundColor,
        blur: data?.blur,
        click: data?.click,
        marginTop: data?.marginTop,
      };
      // return colorData[allTasks.indexOf(data) % colorData.length];
    }
  };

  const vendorOrderPerpationTime = endtime => {
    let total = 0;
    if (Date.parse(endtime) >= Date.parse(new Date())) {
      total = Date.parse(endtime) - Date.parse(new Date());
    } else {
      total = Date.parse(new Date()) - Date.parse(endtime);
    }
    
      

    const seconds = Number(Math.abs(Math.floor((total / 1000) % 60)))
    const hours = Number(Math.abs(Math.floor((total / (1000 * 60 * 60)) % 24)))
    const days = Number(Math.abs(Math.floor(total / (1000 * 60 * 60 * 24))))
    const minutes = Number(Math.abs(Math.floor((total / 1000 / 60) % 60)))
    const totalHours = Number(days*24)+hours
    const totalMinutes = Number(Math.floor(totalHours * 60))+minutes

    return {
      total,
      days,
      totalMinutes,
      hours,
      seconds
    };
  };

  if (getBundleId() == appIds.SXM2GO) {
    useInterval(() => {
      const {
        days,
        totalMinutes,
        hours,
        seconds,
        total } = vendorOrderPerpationTime(deadline)
      const orderPerpationTime = {
        total, days, hours,
        totalMinutes,
        seconds
      }
      setOrderPerpationTime(orderPerpationTime)
      setIsOrderPrepartionTimeExpired(deadline.getTime() > new Date().getTime())

    }, 1000)
  }

  return (
    <View
      activeOpacity={1}
      disabled={getDynamicUpdateOnValues().click}
      // onPress={_onPressTask}
      style={{
        marginTop: isFromHistory ? getDynamicUpdateOnValues().marginTop : 0,
      }}>
      {isFromHistory && data?.order_id != previousData?.order_id && (
        <View
          style={{
            marginHorizontal: moderateScale(11),
            backgroundColor: colors?.white,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: moderateScale(8),
            borderTopWidth: moderateScale(2),
            borderTopRightRadius: moderateScale(8),
            borderTopLeftRadius: moderateScale(8),
            borderColor: colors?.themeColor,
          }}>
          {!!data?.order?.cash_to_be_collected ? (
            <Text
              style={{
                fontFamily: fontFamily?.bold
              }}
            >
              {(getBundleId() == appIds.mrVeloz && defaultLanguagae?.value == 'es') ? strings.CASH_COLLECTED : 'Cash Collected :'} {data?.order?.cash_to_be_collected}{' '}
            </Text>
          ) : (
            <View />
          )}
          {!!data?.order?.driver_cost ? (
            <Text
              style={{
                fontFamily: fontFamily?.bold
              }}
            >
              {(getBundleId() == appIds.mrVeloz && defaultLanguagae?.value == 'es') ? strings.EARNING:'Earning :'} {data?.order?.status == 'completed' ? data?.order?.driver_cost : 0}
            </Text>
          ) : (
            <View />
          )}
        </View>
      )}
      <View
        opacity={getDynamicUpdateOnValues().blur}
        style={{
          ...styles.shadowStyle,
        }}>
        <View style={styles.mainContainer}>
          {!isFromHistory &&
            data?.task_type_id == 1 &&
            appIds.SXM2GO == getBundleId() &&
            orderPerpationTime && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        color: colors.textGreyOpcaity7,
                      }}>
                      {!isOrderPrepartionTimeExpired
                        ? `${strings.ORDER_DELAYED_BY} :`
                        : `${strings.ORDER_WILL_PREPARED_IN} :`}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: fontFamily?.bold,
                        fontSize: textScale(16),
                        color: isOrderPrepartionTimeExpired
                          ? colors.green
                          : colors.redB,
                      }}>
                      {orderPerpationTime?.totalMinutes}M:{orderPerpationTime?.seconds}S
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    marginVertical: moderateScaleVertical(5),
                    fontFamily: fontFamily.bold,
                    color: colors.themeColor,
                  }}>
                  {data?.order?.task_description}
                </Text>
              </>
            )}
        

          <Text style={styles.address} numberOfLines={2}>
            {data?.location?.address}
          </Text>

          <View style={styles.dateContainer}>
            <Image source={imagePath.time} />
            <Text style={styles.dateTimeStyle}>
              {getDate(data?.order?.order_time)}
            </Text>
          </View>

          {!!showCurrency && (
            <View style={styles.currencyContainer}>
              {/* <Image source={imagePath.dollor} /> */}
              {/* <Text style={styles.dateTimeStyle}>
                {data?.order?.amount
                  ? Number(data?.order?.amount)
                      .toFixed(2)
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                  : Number(0).toFixed(2)}
              </Text> */}
            </View>
          )}
        </View>

        <View style={styles.dotViewStyle}>
          {isFromHistory ? (
            <View
              style={{
                paddingVertical: moderateScale(2),
                paddingHorizontal: moderateScale(2),
                backgroundColor:
                  data?.task_status == '4' ? colors.greenLight : colors.redB,
                borderRadius: moderateScale(5),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(8),
                  color: colors.white,
                }}>
                {data?.task_status == '4'
                  ? strings.COMPELETED
                  : strings.CANCELLED}
              </Text>
            </View>
          ) : (
            <></>
          )}
          <View
            style={{
              ...styles.dotBaseViewStyle,
              backgroundColor:
                isFromHistory && data?.task_status == '4'
                  ? colors.green
                  : colors.redB,
            }}
          />
          <View
            style={[
              styles.statusView,
              {
                backgroundColor: getBackGroudColor(data?.tasktype?.name),
              },
            ]}>
            <Text
              style={[
                styles.taskTypeName,
                // {color: getTextColor(data?.tasktype?.name)},
                {color: colors.black},
              ]}>
              {`${(data?.tasktype?.name).toLowerCase() == 'drop'
                ? (getBundleId() == appIds.mrVeloz && defaultLanguagae?.value == 'es') ? strings.DROP_MRVELOZ : strings.DROP
                : strings.PICKUP
                }`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export function stylesFunc({defaultLanguagae}) {
  const styles = StyleSheet.create({
    textStyle: {
      fontFamily: fontFamily.semiBold,
    },
    textInputStyle: {width: width / 1.8},
    address: {
      fontFamily: fontFamily.semiBold,
      fontSize: textScale(14),
    },
    shadowStyle: {
      flexDirection:
        defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he'
          ? 'row-reverse'
          : 'row',
      borderWidth: 1,
      marginHorizontal: moderateScale(10),
      borderColor: colors.grey2,

      backgroundColor: colors.white,
      // height: moderateScaleVertical(100),
    },
    borderLine: {
      width: moderateScale(5),
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    },
    dateTimeStyle: {
      fontFamily: fontFamily.semiBold,
      fontSize: textScale(10),
      opacity: 0.5,
      paddingLeft: 5,
    },
    statusView: {
      minWidth: moderateScale(60),
      maxWidth: moderateScale(100),
      padding: moderateScale(3),
      marginTop: moderateScale(10),
      borderRadius: moderateScale(10),
      justifyContent: 'center',
    },
    mainContainer: {
      flex: 0.6,
      justifyContent: 'center',
      marginVertical: moderateScale(10),
      marginLeft:
        defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he'
          ? 0
          : moderateScale(10),
      marginRight:
        defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he'
          ? moderateScale(10)
          : 0,
    },
    dateContainer: {
      flexDirection:
        defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he'
          ? 'row-reverse'
          : 'row',
      marginTop: moderateScale(10),
    },
    currencyContainer: {
      flexDirection:
        defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he'
          ? 'row-reverse'
          : 'row',
      marginTop: moderateScale(5),
    },
    dotViewStyle: {
      flex: 0.4,
      alignItems:
        defaultLanguagae?.value === 'ar' || defaultLanguagae?.value === 'he'
          ? 'flex-start'
          : 'flex-end',
      justifyContent: 'center',
      margin: moderateScale(10),
    },
    dotBaseViewStyle: {
      backgroundColor: colors.redB,
      height: moderateScale(10),
      width: moderateScale(10),
      borderRadius: moderateScale(10 / 2),
      marginTop: moderateScaleVertical(10),
    },
    taskTypeName: {
      textAlign: 'center',
      fontFamily: fontFamily.bold,
      fontSize: textScale(10),
    },
  });
  return styles;
}

export default React.memo(TaskListCard);
