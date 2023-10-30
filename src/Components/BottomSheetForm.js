import _, { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { List } from 'react-native-paper';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import {
  default as commonStylesFun,
  default as commonStylesFunc
} from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../styles/responsiveSize';
import { showError, showSuccess } from '../utils/helperFunctions';
import BottomSheetModal from './BottomSheetModal';
import DatePickerModal from './DatePickerModal';
import Header from './Header';
import WrapperContainer from './WrapperContainer';

navigator.geolocation = require('react-native-geolocation-service');


const BottomSheetForm = ({
  onCloseSheet = () => { },
  onSignupDone = () => { },
  userDataSignup = {},
  isDriverServiceDetailing = false,
  isFromAccountStack = false,
  isGetSlots = false
}) => {
  const { clientInfo, defaultLanguage } = useSelector(state => state?.initBoot);
  const { userData } = useSelector(state => state?.auth);
  const styles = stylesData({ fontFamily });
  const commonStyles = commonStylesFunc({ fontFamily });
  const [state, setState] = useState({
    servicesDetails: isFromAccountStack ? true : clientInfo?.is_driver_slot ? false : true,
    isModalVisibleForDateTime: false,
    weekDay: [
      {
        label: strings.SUNDAY,
        value: 'Sunday',
        selectable: true,
        val: 1,

      },
      {
        label: strings.MONDAY,
        value: 'Monday',
        selectable: true,
        val: 2,

      },
      {
        label: strings.TUESDAY,
        value: 'Tuesday',
        selectable: true,
        val: 3,

      },
      {
        label: strings.WEDNESDAY,
        value: 'Wednesday',
        selectable: true,
        val: 4,

      },
      {
        label: strings.THURSADY,
        value: 'Thursday',
        selectable: true,
        val: 5,

      },
      {
        label: strings.FRIDAY,
        value: 'Friday',
        selectable: true,
        val: 6,

      },
      {
        label: strings.SATURDAY,
        value: 'Saturday',
        selectable: true,
        val: 7,

      },
    ],
    savedDate: null,
    keyValueTime: null,
    IndexValueTime: null,
    IndexValueWeekDaysParent: null,
    timeset: new Date(),
    workingSlots: [
      {
        weekDayName: [],
        weekDaysAry: [],
        selectedTags: [],
        timeSlots: [
          {
            start_time: '',
            end_time: '',
          },
        ],
        startDate: '',
        endDate: '',
        defaultEndDate: new Date(),
        // isRecurring: false,
        memo: '',
      },
    ],
    workTimeSlots: [],
    driverTagsAry: [],
  });
  const {
    servicesDetails,
    weekDay,
    workingSlots,
    timeset,
    isModalVisibleForDateTime,
    savedDate,
    keyValueTime,
    IndexValueTime,
    IndexValueWeekDaysParent,
    workTimeSlots,
    driverTagsAry,
  } = state;
  const [selectedWeekDays, setSelectedWeekDays] = useState([])

  // const [isStartDate, setIsStartDate] = useState(false);
  // const [isEndDate, setIsEndDate] = useState(false);
  // const [selectedItem, setSelectedItem] = useState({});
  // const [scrollStartDate, setScrollStartDate] = useState(new Date());
  // const [scrollEndDate, setScrollEndDate] = useState('');
  // const [agentSavedSlots, setAgentSavedSlots] = useState([]);


  const [muttipleDropDownOpenClose, setmuttipleDropDownOpenClose] = useState(
    {},
  );
  const [isTagsShow, setmuttipleIsTagsShow] = useState({});

  const updateState = data => setState(state => ({ ...state, ...data }));


  useEffect(() => {
    if (isGetSlots) {
      if (clientInfo?.is_driver_slot) {
        getTimeSlots();
        getAgentSlots();
      }
    }
    else {
      if (!isDriverServiceDetailing) {
        if (clientInfo?.is_driver_slot && !isFromAccountStack) {
          getTimeSlots();
        }
        isFromAccountStack ? getAgentProductsWithCategory() : getAgentProductsOnSignup();
      } else {
        getAgentSlots();
      }
    }
  }, []);

  const updateStateOpenClose = data =>
    setmuttipleDropDownOpenClose(state => ({ ...state, ...data }));

  const updateStateOpenCloseTagsShow = data =>
    setmuttipleIsTagsShow(state => ({ ...state, ...data }));

  const onDropDownOpen = useCallback(
    slugName => {
      const obj = muttipleDropDownOpenClose;
      Object.keys(obj).forEach(key => {
        if (key !== slugName) {
          obj[key] = false;
        } else {
          obj[key] = true;
        }
      });
      updateStateOpenClose(obj);
    },
    [weekDay],
  );



  const getTimeSlots = () => {
    actions
      .getTimeSlotsData(
        {},
        {
          client: clientInfo?.database_name,
          shortcode: clientInfo?.client_db_code,
        },
      )
      .then(res => {
        console.log(res, "<=== res getTimeSlots")
        if (!!res?.data) {
          let newRes = cloneDeep(res?.data)
          let resToUpdate = []
          newRes.map((item) => {
            let objToPush = {
              id: item?.id,
              start_time: item?.start_time.substring(0, item?.start_time.length - 3),
              end_time: item?.end_time.substring(0, item?.end_time.length - 3),
              status: 1
            }
            resToUpdate.push(objToPush)
          })
          updateState({ workTimeSlots: resToUpdate, driverTagsAry: res?.data });
        }
      })
      .catch(err => errorMethod(err));
  };
  // end


  // Time Picker
  const OpenTimePicker = (item, index, parentIndex) => {
    updateState({
      isModalVisibleForDateTime: true,
      keyValueTime: item,
      IndexValueTime: index,
      IndexValueWeekDaysParent: parentIndex,
      savedDate: savedDate ? savedDate : new Date(),
    });
  };

  const onDateChange = value => {
    updateState({ savedDate: value });
  };


  const onSelectDate = () => {
    const TimeSet = moment(savedDate).format('HH:mm');
    const valu = [...workingSlots];
    valu[IndexValueWeekDaysParent].timeSlots[IndexValueTime][keyValueTime] =
      TimeSet;
    if (savedDate) {
      updateState({
        workingSlots: valu,
        isLoading: true,
      });
    } else {
      updateState({
        workingSlots: valu,
        isLoading: true,
      });
    }
    updateState({ isModalVisibleForDateTime: false });
  };



  const removeFromToAtIndex = (item, index, parentIndex) => {
    const valu = [...workingSlots];
    valu[parentIndex].timeSlots.splice(index, 1);
    updateState({ workingSlots: valu });
  };

  const addWorkingDaysTemplate = () => {
    const workingSlotsAry = [...workingSlots];
    const insetObj = {
      weekDayName: [],
      weekDaysAry: [],
      selectedTags: [],
      timeSlots: [
        {
          start_time: '',
          end_time: '',
        },
      ],
      startDate: '',
      endDate: '',
      defaultEndDate: new Date(),
      // isRecurring: false,
      memo: '',
    };

    workingSlotsAry?.push(insetObj);
    updateState({ workingSlots: workingSlotsAry });
  };
  const removeWorkingDaysTemplate = () => {
    const valu = [...workingSlots];
    if (valu?.length >= 2) {
      valu?.splice(-1);
      updateState({ workingSlots: valu });
    }
  };

  const onChangeTextMemo = (text, index) => {
    let newWorkingSlots = [...workingSlots];
    newWorkingSlots[index].memo = text;
    updateState({
      workingSlots: newWorkingSlots,
    });
  };



  const removeWeekDays = (item, index, mainIndx) => {
    let weekDayNew = cloneDeep(weekDay)
    weekDayNew.map((itm, index) => {
      if (itm?.value == item) {
        weekDayNew[index].selectable = true
      }
    })

    const workingSlotsNew = cloneDeep(workingSlots)
    workingSlotsNew[mainIndx].weekDayName.splice(index, 1)
    workingSlotsNew[mainIndx].weekDaysAry.splice(index, 1)

    updateState({
      workingSlots: workingSlotsNew,
      weekDay: weekDayNew
    })
  }


  // working Hours/Days component start
  const renderWorkingSlotsComp = useCallback(
    ({ item, index }) => {
      return (
        <View style={styles.eachWCardView}>
          <View
            style={{
              marginTop: moderateScaleVertical(10),
            }}>
            <Text
              style={[styles.subHeading, { fontFamily: fontFamily.semiBold }]}>
              {strings.SELECT_AVAILABLE_WEEKDAYS}:
            </Text>
            <View
              onLayout={event => {
                updateState({ tagsViewHeight: event.nativeEvent.layout.height });
              }}
              style={{
                minHeight: moderateScaleVertical(44),
                color: colors.white,
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 3,
                paddingHorizontal: 3,
                justifyContent: 'center',
                borderColor: colors.borderLight,
                marginTop: moderateScaleVertical(6)
              }}>
              <View>

                {!isEmpty(item.weekDayName) && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                    {item?.weekDayName.map((itm, indx) => {
                      return (
                        <TouchableOpacity
                          key={String(indx)}
                          onPress={() => removeWeekDays(itm, indx, index)}
                          activeOpacity={0.7}
                          style={{
                            borderWidth: 1,
                            borderColor: colors.borderColorB,
                            alignItems: 'center',
                            backgroundColor: colors.borderColorB,
                            marginHorizontal: moderateScale(2),
                            paddingHorizontal: moderateScale(2),
                            flexDirection: 'row',
                            marginVertical: 3,
                            width: '48%',
                            justifyContent: 'space-around',
                            borderRadius: moderateScale(5),
                            paddingVertical: moderateScale(3),
                          }}>
                          <Image
                            source={imagePath.ic_cross}
                            style={{
                              height: 10,
                              width: 10,
                              tintColor: colors.black,
                            }}
                          />
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: textScale(11),
                              fontFamily: fontFamily.medium,
                              marginLeft: 3,
                            }}>
                            {itm}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                <TextInput
                  placeholder={"Select days"}
                  onFocus={() => {
                    updateStateOpenClose({
                      [index]: !muttipleDropDownOpenClose[index],
                    })
                  }
                  }
                  onBlur={() =>
                    updateStateOpenClose({
                      [index]: !muttipleDropDownOpenClose[index],
                    })
                  }
                  // onChangeText={onSearchTags}
                  style={{
                    opacity: 0.7,
                    color: colors.textGreyOpcaity7,
                    fontFamily: fontFamily.medium,
                    fontSize: textScale(14),
                    paddingHorizontal: 8,
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                  }}
                />
                <View style={{
                  ...commonStyles.flexRowCenter,
                  flexWrap: "wrap"
                }}>
                  {
                    muttipleDropDownOpenClose[index] && weekDay.map((vl, indx) => {

                      return (
                        <TouchableOpacity key={String(indx)} disabled={(!vl?.selectable && !item?.weekDaysAry?.includes(vl?.val))} onPress={() => {
                          const newWorkingSlots = cloneDeep(workingSlots)
                          let weekDaysNew = cloneDeep(weekDay)
                          if (!workingSlots[index].weekDaysAry.includes(vl?.val)) {
                            newWorkingSlots[index].weekDaysAry = [...newWorkingSlots[index].weekDaysAry, vl?.val]
                            newWorkingSlots[index].weekDayName = [...newWorkingSlots[index].weekDayName, vl?.label]
                            weekDaysNew[indx].selectable = false

                            updateState({
                              workingSlots: newWorkingSlots,
                              weekDay: weekDaysNew
                            });
                          }
                        }}
                          style={{
                            ...styles.driverTagsView,
                            borderColor: colors.borderColorB,
                            backgroundColor: (!vl?.selectable && !item?.weekDaysAry?.includes(vl?.val)) ? colors.green : item?.weekDaysAry?.includes(vl?.val) ? colors.themeColor : colors.borderColorB,
                          }}>


                          <Text style={{
                            ...commonStyles.font12,
                            textAlign: "center",
                            color: (!vl?.selectable && !item?.weekDaysAry?.includes(vl?.val)) ? colors.white : item?.weekDaysAry?.includes(vl?.val) ? colors.white : colors.black
                          }}>{vl?.label}</Text>
                        </TouchableOpacity>
                      )

                    })
                  }
                </View>
              </View>
            </View>
          </View>
          <View style={{ paddingVertical: moderateScaleVertical(10) }}>
            <Text
              style={[styles.subHeading, { fontFamily: fontFamily.semiBold }]}>
              {strings.SELECT_AVAILABLE_TIME_SLOTS}:
            </Text>
          </View>
          <View style={{}}>
            {!isEmpty(workTimeSlots) ? (
              workingTimeSlots(item, index)
            ) : (
              <>
                {item?.timeSlots?.map((value, place) => {
                  return CustomTimeSlots(value, place, index);
                })}
              </>
            )}
          </View>
          <Text
            style={[
              styles.subHeading,
              {
                fontFamily: fontFamily.semiBold,
                paddingVertical: moderateScaleVertical(10),
              },
            ]}>
            {strings.MEMO}:
          </Text>
          <TextInput
            onChangeText={text => onChangeTextMemo(text, index)}
            value={item?.memo}
            style={{
              borderWidth: 1,
              borderColor: colors.borderColorGrey,
              paddingHorizontal: moderateScale(12),
              borderRadius: moderateScale(8),
              paddingVertical: moderateScaleVertical(10),
            }}
          />
        </View>
      );
    },
    [workingSlots, workTimeSlots, muttipleDropDownOpenClose, isTagsShow, selectedWeekDays, weekDay],
  );

  const CustomTimeSlots = (value, place, inx) => {
    return (
      <View style={[styles.timeView]} key={place}>
        <View style={[styles.fromTOParent, {}]}>
          <Text style={[styles.subHeading]}>{strings.FROM}:</Text>
          <TouchableOpacity
            style={[styles.fromTOParentChild, {}]}
            onPress={() => OpenTimePicker(Object.keys(value)[0], place, inx)}>
            <View style={[styles.fromTOChild]}>
              <Text style={[styles.subHeading, { fontSize: textScale(12) }]}>
                {Object.values(value)[0] ? Object.values(value)[0] : '00:00'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.fromTOParent}>
          <Text style={[styles.subHeading]}>{strings.TO}:</Text>
          <TouchableOpacity
            style={styles.fromTOParentChild}
            onPress={() => OpenTimePicker(Object.keys(value)[1], place, inx)}>
            <View style={[styles.fromTOChild]}>
              <Text style={[styles.subHeading, { fontSize: textScale(12) }]}>
                {Object.values(value)[1] ? Object.values(value)[1] : '00:00'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.lastDeleteView}>
          <Text></Text>
          {place !== 0 && (
            <TouchableOpacity
              style={styles.addRemove}
              onPress={() =>
                removeFromToAtIndex(Object.keys(value)[0], place, inx)
              }>
              <Image
                style={{ height: 12, width: 12 }}
                resizeMode="contain"
                source={imagePath.delete}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const workingTimeSlots = (value, place) => {
    const { selectedTags } = value;
    return (
      <View style={{ zIndex: 2, marginBottom: moderateScale(10) }}>
        <View
          onLayout={event => {
            updateState({ tagsViewHeight: event.nativeEvent.layout.height });
          }}
          style={{
            minHeight: moderateScaleVertical(44),
            color: colors.white,
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 3,
            paddingHorizontal: 3,
            justifyContent: 'center',
            borderColor: colors.borderLight,
          }}>
          <View>
            <ScrollView nestedScrollEnabled style={{
              maxHeight: moderateScaleVertical(100)
            }}>
              {selectedTags?.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {selectedTags.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={String(index)}
                        onPress={() => removeTag(item, index, value, place)}
                        activeOpacity={0.7}
                        style={{
                          borderWidth: 1,
                          borderColor: colors.borderColorB,
                          alignItems: 'center',
                          backgroundColor: colors.borderColorB,
                          marginHorizontal: moderateScale(2),
                          paddingHorizontal: moderateScale(2),
                          flexDirection: 'row',
                          marginVertical: 3,
                          width: '48%',

                          borderRadius: moderateScale(5),
                          paddingVertical: moderateScale(3),
                        }}>
                        <Image
                          source={imagePath.ic_cross}
                          style={{
                            height: 10,
                            width: 10,
                            tintColor: colors.black,
                          }}
                        />
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: textScale(11),
                            fontFamily: fontFamily.medium,
                            marginLeft: 20,
                          }}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </ScrollView>
            <TextInput
              placeholder={strings.SELECT_TIME_SLOT}
              onFocus={() => {
                updateStateOpenCloseTagsShow({ [place]: !isTagsShow[place] })
              }
              }
              onBlur={() =>
                updateStateOpenCloseTagsShow({ [place]: !isTagsShow[place] })
              }
              onChangeText={onSearchTags}
              style={{
                opacity: 0.7,
                color: colors.textGreyOpcaity7,
                fontFamily: fontFamily.medium,
                fontSize: textScale(14),
                paddingHorizontal: 8,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
              }}
            />
            {isTagsShow[place] && (
              <View
                style={{
                  backgroundColor: colors.white,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  width: '100%',
                }}>

                {workTimeSlots.length > 0 ? (
                  <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                    {workTimeSlots.map((item, index) => {
                      const { start_time, end_time } = item;

                      return (
                        <TouchableOpacity
                          key={String(index)}
                          onPress={() =>
                            _onTagSelect(item, index, value, place)
                          }
                          activeOpacity={0.7}
                          style={{
                            ...styles.driverTagsView,
                            borderColor: selectedTags.includes(
                              `${start_time} - ${end_time}`,
                            )
                              ? colors.themeColor
                              : colors.borderColorB,
                            backgroundColor: selectedTags.includes(
                              `${start_time} - ${end_time}`,
                            )
                              ? colors.themeColor
                              : colors.borderColorB,
                          }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              textAlign: 'center',
                              color: selectedTags.includes(
                                `${start_time} - ${end_time}`,
                              )
                                ? colors.white
                                : colors.black,
                            }}>

                            {start_time} - {end_time}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.noDataFound}>
                    <Text
                      style={{
                        fontFamily: fontFamily.medium,
                        fontSize: moderateScale(13),
                      }}>
                      {strings.NODATAFOUND}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };
  // end

  // workingTimeSlots time slots
  const onSearchTags = text => {
    const driverTagsNewAry = [...driverTagsAry];
    let searchedAry;
    if (text) {
      searchedAry = driverTagsNewAry.filter(item => {
        const { start_time, end_time } = item;
        return start_time.includes(text) || end_time.includes(text);
      });
      updateState({
        workTimeSlots: searchedAry?.length > 0 ? searchedAry : driverTagsNewAry,
      });
    } else {
      updateState({ workTimeSlots: driverTagsNewAry });
    }
  };

  const _onTagSelect = (itm, indx, value, place) => {
    const { start_time, end_time } = itm;
    const { selectedTags } = value;
    // console.log("finObjectValueInArray(selectedTags, start_time) => ", finObjectValueInArray(selectedTags, start_time));
    if (!finObjectValueInArray(selectedTags, `${start_time} - ${end_time}`)) {
      const newUpdatedState2 = workingSlots.map((item, index) => {
        if (place === index) {
          item.selectedTags.push(`${start_time} - ${end_time}`);
          return { ...item };
        }
        return { ...item };
      });
      // console.log("newUpdatedState2 =>", newUpdatedState2);
      updateState({ workingSlots: newUpdatedState2 });
    } else {
      const newUpdatedState2 = workingSlots.map((item, index) => {
        if (place === index) {
          const result = item.selectedTags.filter(
            (item, idx) => item !== `${start_time} - ${end_time}`,
          );
          return { ...item, selectedTags: result };
        }
        return { ...item };
      });
      // console.log("newUpdatedState2 =>", newUpdatedState2);
      updateState({ workingSlots: newUpdatedState2 });
    }
  };

  const removeTag = (itm, indx, value, place) => {
    const newUpdatedState2 = workingSlots.map((item, index) => {
      if (place === index) {
        const result = item.selectedTags.filter((item, idx) => item !== itm);
        return { ...item, selectedTags: result };
      }
      return { ...item };
    });
    updateState({ workingSlots: newUpdatedState2 });
  };

  const finObjectValueInArray = (arr, value) => {
    return (
      arr.filter(function (e) {
        return e === value;
      }).length > 0
    );
  };

  const [serviceState, setServiceState] = useState({
    isLoadingS: false,
    servicesData: [],
    modelMake: '',
  });
  const serviceUpdateState = data =>
    setServiceState(state => ({ ...state, ...data }));
  const { isLoadingS, servicesData, modelMake } = serviceState;
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const getAgentProductsWithCategory = () => {
    isFromAccountStack && setIsSubmitLoading(true)
    actions
      .getProductDetailsWithCategory(
        {},
        {
          client: clientInfo?.database_name,
          shortcode: clientInfo?.client_db_code,
        },
      )
      .then(res => {
        setIsSubmitLoading(false)
        if (!isEmpty(res?.data)) {
          const newArr = res?.data.map(element => {
            if (element?.products?.length > 0) {
              element?.products?.map(item => {
                item['available_product_service'] = !!item?.variant[0]?.agent_price?.price;
                item['selling_price'] = !!item?.variant[0]?.agent_price?.price ? Number(item?.variant[0]?.agent_price?.price).toFixed(0) : null;
                item?.variant?.map((im, inx) => {
                  im['is_selected'] = !!item?.variant[0]?.agent_price?.price;
                  im['selling_price'] = !!item?.variant[0]?.agent_price?.price ? Number(item?.variant[0]?.agent_price?.price).toFixed(0) : null;
                });
              });
            }
            return element;
          });
          // console.log('newArr =>', newArr);
          serviceUpdateState({ servicesData: newArr });

        }
      })
      .catch(errorMethod);
  };

  const getAgentProductsOnSignup = () => {
    isFromAccountStack && setIsSubmitLoading(true)
    actions
      .getAgentProductsByCategory(
        {},
        {
          client: clientInfo?.database_name,
          shortcode: clientInfo?.client_db_code,
        },
      )
      .then(res => {
        setIsSubmitLoading(false)
        if (!isEmpty(res?.data)) {
          const newArr = res?.data.map(element => {
            if (element?.products?.length > 0) {
              element?.products?.map(item => {
                item['available_product_service'] = false;
                item['selling_price'] = null;
                item?.variant?.map((im, inx) => {
                  im['is_selected'] = false;
                  im['selling_price'] = null;
                });
              });
            }
            return element;
          });
          // console.log('newArr =>', newArr);
          serviceUpdateState({ servicesData: newArr });

        }
      })
      .catch(errorMethod);
  };

  const errorMethod = error => {
    console.log(error, '=> errorOccured');
    serviceUpdateState({ isLoadingS: false });
    setIsSubmitLoading(false);
    showError(error?.description || error?.message || error?.error || error);
  };

  const onPressCheckBox = (id, index) => {
    console.log('id, index =>', id, index);
    const newArr = servicesData?.map(element => {
      if (element?.id === id) {
        element?.products?.map((item, idx) => {
          if (idx === index) {
            (item.available_product_service = !item.available_product_service),
              (item.selling_price = '');
          }
          return item;
        });
      }
      return element;
    });
    serviceUpdateState({ servicesData: newArr });
  };

  const setInputPricevalue = (text, id, index) => {
    let servicesDataAry = [...servicesData];
    const newArr = servicesDataAry?.map(element => {
      if (element?.id === id) {
        element?.products?.map((item, idx) => {
          if (idx === index) {
            if (!!text) {
              item.selling_price = text ? text.replace(/[^0-9.]/g, '') : '';
              item.available_product_service = true;
            } else {
              item.selling_price = null;
              item.available_product_service = false;
            }
          }
          return item;
        });
      }
      return element;
    });
    serviceUpdateState({ servicesData: newArr });
  };

  const getAgentSlots = () => {
    setIsSubmitLoading(true);
    actions
      .getAgentSlots(
        {},
        {
          client: clientInfo?.database_name,
          shortcode: clientInfo?.client_db_code,
        },
      )
      .then(res => {
        console.log(res, '<===res getAgentSlots');
        setIsSubmitLoading(false);
        if (res?.data) {
          const filteredServicesData = res?.data?.categories?.map(element => {
            if (element?.products?.length > 0) {
              element?.products?.map(item => {
                item['available_product_service'] = false;
                item['selling_price'] = item?.variant[0]?.agent_price?.price;
                item?.variant?.map((im, inx) => {
                  im['is_selected'] = false;
                  im['selling_price'] = im?.agent_price?.price;
                });
              });
            }
            return element;
          });

          setServiceState({
            servicesData: filteredServicesData,
          });

          let agentSlots = cloneDeep(res?.data?.agent_slots)

          if (!isEmpty(agentSlots)) {
            // Iterate through the object
            let newWorkingSlots = []
            let newWeekDays = cloneDeep(weekDay)
            for (const key in agentSlots) {
              let selected_tags = []
              agentSlots[key]?.slot_time?.map((item) => {
                let slotToPush = `${item?.start_time.substring(0, item?.start_time.length - 3)} - ${item?.end_time.substring(0, item?.end_time.length - 3)}`
                if (!selected_tags?.includes(slotToPush))
                  selected_tags.push(slotToPush)
              })
              let objToPush = {
                startDate: moment(new Date).local().toDate(),
                endDate: moment(new Date()).local().toDate(),
                defaultEndDate: moment(new Date).local().toDate(),
                memo: agentSlots[key]?.memo[0],
                timeSlots: [
                  {
                    start_time: '',
                    end_time: '',
                  },
                ],
                selectedTags: selected_tags,
                weekDaysAry: [key == "Sunday" ? 1 : key == "Monday" ? 2 : key == "Tuesday" ? 3 : key == "Wednesday" ? 4 : key == "Thursday" ? 5 : key == "Friday" ? 6 : 7],
                weekDayName: [key]
              };
              newWeekDays.map((itm, ind) => {
                if (itm?.value == key) {
                  newWeekDays[ind].selectable = false
                }
              })
              newWorkingSlots.push(objToPush)
            }

            updateState({
              workingSlots: newWorkingSlots,
              weekDay: newWeekDays
            });
          }

          // res?.data?.agent_slots?.map((item, index) => {
          //   //will loop 4 times
          //   let currentAry = []
          //   let nextAry = []
          //   item?.slot_day.map((item) => {
          //     currentAry.push({
          //       day: item?.day
          //     })
          //   })
          //   res?.data?.agent_slots[index + 1]?.slot_day?.map((item) => {
          //     nextAry.push({
          //       day: item?.day
          //     })
          //   })
          //   if (_.isEqualWith(currentAry, nextAry)) {
          //     if (!indes.includes(index)) {
          //       slotsToPush.push(item)
          //       indes.push(index)
          //     }
          //   }
          // });

          // console.log(indes, "indes>>>>>indes", slotsToPush)
          // let newWeekDays = cloneDeep(weekDay)

          // let newWorkingSlots = slotsToPush.map((item) => {
          //   let weekDays = [];
          //   let weekDaysName = [];
          //   let objToPush = {
          //     startDate: moment(item?.start_date).local().toDate(),
          //     endDate: moment(item?.end_date).local().toDate(),
          //     defaultEndDate: moment(item?.start_date).local().toDate(),
          //     memo: item?.slot_roster[0]?.memo,
          //     timeSlots: [
          //       {
          //         start_time: '',
          //         end_time: '',
          //       },
          //     ],
          //     selectedTags: [`${item?.start_time} - ${item?.end_time}`],
          //   };
          //   item?.slot_day?.map((item, index) => {

          //     newWeekDays.map((itm, ind) => {
          //       if (itm?.val == item?.day) {
          //         newWeekDays[ind].selectable = false
          //       }
          //     })

          //     weekDays.push(item?.day);
          //     weekDaysName.push(
          //       item?.day == 1
          //         ? strings.SUNDAY
          //         : item?.day == 2
          //           ? strings.MONDAY
          //           : item?.day == 3
          //             ? strings.TUESDAY
          //             : item?.day == 4
          //               ? strings.WEDNESDAY
          //               : item?.day == 5
          //                 ? strings.THURSADY
          //                 : item?.day == 6
          //                   ? strings.FRIDAY
          //                   : strings.SATURDAY,
          //     );
          //   });
          //   objToPush['weekDaysAry'] = weekDays || [];
          //   objToPush['weekDayName'] = weekDaysName || [];

          //   return objToPush
          // })
          // console.log(newWorkingSlots, "newWorkingSlots>>>>newWorkingSlots")
          // updateState({
          //   workingSlots: newWorkingSlots,
          //   weekDay: newWeekDays
          // });
        }
      })
      .catch(errorMethod);
  };

  const onPressLeftForm = () => {
    if (!isFromAccountStack && clientInfo?.is_driver_slot) {
      if (!servicesDetails) {
        onCloseSheet();
        return;
      }
      updateState({ servicesDetails: false });
    } else {
      onCloseSheet();
    }
  };

  const onPressVariants = (mainItem, productItm, variantItm) => {
    let servicesDataAry = _.cloneDeep(servicesData);
    servicesDataAry.map(item => {
      if (item?.id == mainItem?.id) {
        item?.products?.map(itm => {
          if (itm?.id == productItm?.id) {
            itm.available_product_service =
              !productItm.available_product_service;
            itm?.variant?.map(i => {
              if (i?.id == variantItm?.id) {
                i['is_selected'] = !variantItm?.is_selected;
                if (variantItm?.is_selected) {
                  i['selling_price'] = null;
                }
              }
            });
          }
        });
      }
    });
    serviceUpdateState({ servicesData: servicesDataAry });
  };
  const onChangeVariantPrice = (text, mainItem, productItm, variantItm) => {
    let servicesDataAry = _.cloneDeep(servicesData);
    servicesDataAry.map(item => {
      if (item?.id == mainItem?.id) {
        item?.products?.map(itm => {
          if (itm?.id == productItm?.id) {
            itm?.variant?.map(i => {
              if (i?.id == variantItm?.id) {
                if (!!text) {
                  i['is_selected'] == true;
                  i['selling_price'] = text;
                } else {
                  i['is_selected'] == false;
                  i['selling_price'] = null;
                }
              }
            });
          }
        });
      }
    });
    serviceUpdateState({ servicesData: servicesDataAry });
  };



  const onSubmitForm = () => {

    let servicesDataAry = _.cloneDeep(servicesData);
    var productPrices = [];
    let objToInsert = {};
    let isAtleastOneSelected = false;
    let isPriceEntredError = false;
    servicesDataAry.map(item => {
      item?.products?.map(itm => {
        if (itm?.variant?.length > 1) {
          itm?.variant?.map(i => {
            if (i?.is_selected) {
              if (i?.selling_price !== null) {
                objToInsert = {
                  product_id: itm?.id,
                  variant_id: i?.id,
                  price: i?.selling_price,
                };
                productPrices = [...productPrices, objToInsert];
                isAtleastOneSelected = true;
              } else {
                isPriceEntredError = true;
                return;
              }
            }
          });
        }
        if (itm?.available_product_service) {
          isAtleastOneSelected = true;
          if (!!itm?.selling_price) {
            objToInsert = {
              product_id: itm?.id,
              variant_id: itm?.variant[0]?.id,
              price: itm?.selling_price,
            };
            productPrices = [...productPrices, objToInsert];
          } else {
            isPriceEntredError = true;
            return;
          }
        }
      });
    });
    if (!isAtleastOneSelected) {
      showError(strings.PLEASE_SELECT_PRODUCT);
      return;
    }
    if (isPriceEntredError) {
      showError(strings.PLEASE_SELECT_PRICE_FOR_PRODUCT);
      return;
    }
    setIsSubmitLoading(true);
    actions
      .onSaveProductWithVariants(
        {
          product_prices: productPrices,
          agent_id: userDataSignup?.id || userData?.id,
        },
        {
          client: clientInfo?.database_name,
          shortcode: clientInfo?.client_db_code,
        },
      )
      .then(res => {
        console.log(res, '<===res onSaveProductWithVariants');
        setIsSubmitLoading(false);
        if (isFromAccountStack) {
          onCloseSheet()
          showSuccess(strings.DONE)
        }
        else {
          onSignupDone();
        }
      })
      .catch(errorMethod);
  };

  const onSubmitSlots = () => {
    let newWorkingSlots = [...workingSlots];
    if (isEmpty(newWorkingSlots)) {
      showError(strings.NO_SLOTS_AVAILABLE)
      return
    }
    let aryToSendInApi = [];
    let isRecurringErr = false;
    let isStartEndTimeErr = false;
    // let startEndDateErr = false;
    newWorkingSlots.map((item, index) => {
      // if (item?.startDate && item?.endDate) {
      // if (item?.isRecurring) {
      //   if (isEmpty(item?.weekDaysAry)) {
      //     isRecurringErr = true;
      //   }
      // }
      if (!isEmpty(workTimeSlots)) {
        if (!isEmpty(item?.selectedTags)) {
          item?.selectedTags?.map(itm => {
            let splitedAry = itm.split(' - ');
            let objToPush = {
              start_date: moment(new Date()).format('YYYY-MM-DD'),
              end_date: moment(new Date).endOf('year').format('YYYY-MM-DD'),
              start_time: splitedAry[0],
              end_time: splitedAry[1],
              recurring: !isEmpty(item?.weekDaysAry) ? '1' : '0',
              week_day: item?.weekDaysAry,
              slot_type: 'Working Hours',
              memo: item?.memo,
            };
            aryToSendInApi.push(objToPush);
          });
        } else {
          isStartEndTimeErr = true;
        }
      } else {
        if (!isEmpty(item?.timeSlots)) {
          item?.timeSlots?.map(itm => {
            if (itm?.start_time && itm?.end_time) {
              let objToPush = {
                start_date: moment(item?.startDate).format('YYYY-MM-DD'),
                end_date: moment(item?.endDate).format('YYYY-MM-DD'),
                start_time: itm?.start_time,
                end_time: itm?.end_time,
                recurring: !isEmpty(item?.weekDaysAry) ? '1' : '0',
                week_day: item?.weekDaysAry,
                slot_type: 'Working Hours',
                memo: item?.memo,
              };
              aryToSendInApi.push(objToPush);
            } else {
              isStartEndTimeErr = true;
            }
          });
        } else {
          isStartEndTimeErr = true;
        }
      }
      // } else {
      //   startEndDateErr = true;
      // }
    });
    // if (isRecurringErr) {
    //   showError(strings.PLEASE_SELECT_VALID_DAYS);
    //   return;
    // }
    if (isStartEndTimeErr) {
      showError(strings.PLEASE_SELECT_VALID_SLOTS);
      return;
    }
    // if (startEndDateErr) {
    //   showError(strings.PLEASE_SELECT_VALID_START_END_DATE);
    //   return;
    // }

    setIsSubmitLoading(true);
    actions
      .saveAgentSlots(
        {
          agent_id: userDataSignup?.id || userData?.id,
          agent_slots: aryToSendInApi,
          booking_type: "working_hours"
        },
        {
          client: clientInfo?.database_name,
          shortcode: clientInfo?.client_db_code,
        },
      )
      .then(res => {
        console.log(res, '<===res saveAgentSlots');
        setIsSubmitLoading(false);
        if (isGetSlots) {
          showSuccess(strings.DONE)
          onCloseSheet()
          return
        }
        if (isEmpty(servicesData)) {
          onSignupDone();
        }
        else {
          updateState({ servicesDetails: true });
        }
      })
      .catch(errorMethod);
  };


  return (
    <BottomSheetModal snapPoints={[height]}  >
      <WrapperContainer isLoading={isSubmitLoading}>
        <Header
          headerStyle={{ backgroundColor: colors.white }}
          onPressLeft={onPressLeftForm}
          customRight={() => (
            <TouchableOpacity
              onPress={!servicesDetails ? onSubmitSlots : onSubmitForm}>
              <Text numberOfLines={1} style={{ ...commonStyles.boldFont13, lineHeight: textScale(28), }}>{strings.SUBMIT}</Text>
            </TouchableOpacity>
          )}
          rightIconStyle={{ transform: [{ rotate: '180 deg' }] }}
          onPressRight={() => updateState({ servicesDetails: true })}

          centerTitle={
            servicesDetails ? strings.SERVICE_DETAILING : strings.WORKING_HOURS
          }
        />
        <View style={{ ...commonStyles.headerTopLine }} />
        <View style={{ flex: 1 }}>

          {!servicesDetails ? (
            <View style={styles.parentView}>
              {!isEmpty(workingSlots) && <Text style={{ ...styles.textHeading }}>{strings.ADDTIMESLOT}:</Text>}
              <View style={styles.formView}>
                <FlatList
                  data={workingSlots || []}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps={"handled"}
                  renderItem={renderWorkingSlotsComp}
                  ListEmptyComponent={() => <Text style={{ textAlign: 'center', marginTop: moderateScale(200), ...commonStyles.boldFont14 }}>
                    {strings.NODATAFOUND}
                  </Text>}
                  ListFooterComponent={() => (
                    <>
                      {
                        !isEmpty(workingSlots) && <View>
                          <TouchableOpacity
                            style={styles.RemoveWorkingDaysButton}
                            onPress={() => removeWorkingDaysTemplate()}>
                            <Text
                              style={[
                                styles.buttonText,
                                { color: colors.redFireBrick },
                              ]}>
                              {strings.REMOVE}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.addWorkingDaysButton}
                            onPress={() => addWorkingDaysTemplate()}>
                            <Text style={styles.buttonText}>
                              {strings.ADD_MORE}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      }
                    </>
                  )}
                />
              </View>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.parentView}>
                <List.AccordionGroup children>
                  {!isEmpty(servicesData) ? <View>
                    {
                      servicesData.map((item, index) => {
                        return (
                          <View
                            key={String(index)}
                            style={{
                              marginVertical: moderateScale(8),
                              borderRadius: 10,
                            }}>
                            <List.Accordion
                              id={index.toString()}
                              theme={{ colors: { background: 'white' } }}
                              style={{
                                borderTopRightRadius: 10,
                                borderTopLeftRadius: 10,
                                backgroundColor: colors.greysearchHeader,
                                borderColor: colors.themeColor,
                                // borderWidth: 0.8,
                              }}
                              title={item?.translation?.name || item.slug}
                              titleStyle={{
                                textTransform: 'capitalize',
                                color: colors.black,
                                borderRadius: 10,
                              }}
                              left={() => (
                                <Image
                                  source={imagePath.dropDownNew}
                                  style={{
                                    height: 12,
                                    width: 12,
                                    resizeMode: 'contain',
                                  }}
                                />
                              )}
                              right={({ isExpanded }) =>
                                isExpanded ? (
                                  <Image
                                    source={imagePath.dropDownNew}
                                    resizeMode="contain"
                                    style={{
                                      height: 10,
                                      width: 10,
                                      transform: [{ rotate: '180 deg' }],
                                    }}
                                  />
                                ) : (
                                  <Image
                                    source={imagePath.dropDownNew}
                                    resizeMode="contain"
                                    style={{ height: 10, width: 10 }}
                                  />
                                )
                              }>
                              {item?.products &&
                                item?.products?.map((it, inx, row) => {
                                  return (
                                    <List.Item
                                      key={String(inx)}
                                      titleNumberOfLines={2}
                                      style={{
                                        borderBottomRightRadius:
                                          inx + 1 === row.length ? 10 : 0,
                                        borderBottomLeftRadius:
                                          inx + 1 === row.length ? 10 : 0,
                                        borderLeftWidth: 0.8,
                                        borderRightWidth: 0.8,
                                        borderTopWidth: inx === 0 ? 0.8 : 0,
                                        borderTopRightRadius: inx === 0 ? 10 : 0,
                                        borderTopLeftRadius: inx === 0 ? 10 : 0,
                                        borderBottomWidth:
                                          inx + 1 === row.length ? 0.8 : 0,
                                        borderColor: colors.themeColor,
                                      }}
                                      titleStyle={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: it.available_product_service
                                          ? colors.black
                                          : colors.greyLight,
                                      }}
                                      left={({ color, style }) => (
                                        <View>
                                          <TouchableOpacity
                                            disabled={it?.variant?.length > 1}
                                            style={{
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              width: moderateScale(200)
                                            }}
                                            onPress={() =>
                                              onPressCheckBox(item.id, inx)
                                            }>
                                            {it?.variant?.length <= 1 && (
                                              <Image
                                                source={
                                                  it.available_product_service
                                                    ? imagePath.checkBox
                                                    : imagePath.unCheckBox
                                                }
                                                resizeMode="contain"
                                                style={{ width: 15 }}
                                              />
                                            )}
                                            <Text
                                              style={{
                                                marginLeft: moderateScale(7),
                                                opacity: 1,
                                              }}>
                                              {it?.title || it?.translation?.title}
                                            </Text>
                                          </TouchableOpacity>

                                          {it?.variant?.length > 1 && (
                                            <KeyboardAwareScrollView
                                              contentContainerStyle={{
                                                minHeight: 100,
                                                paddingLeft: moderateScale(16),
                                              }}>
                                              {it?.variant?.map((itm, indx) => {


                                                return (
                                                  <View
                                                    key={String(indx)}
                                                    style={{
                                                      flexDirection: 'row',
                                                      alignItems: 'center',
                                                      justifyContent:
                                                        'space-between',
                                                      marginBottom: 3,
                                                    }}>
                                                    <TouchableOpacity
                                                      style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                      }}
                                                      onPress={() =>
                                                        onPressVariants(
                                                          item,
                                                          it,
                                                          itm,
                                                        )
                                                      }>
                                                      <Image
                                                        source={
                                                          itm?.is_selected
                                                            ? imagePath.checkBox
                                                            : imagePath.unCheckBox
                                                        }
                                                        resizeMode="contain"
                                                        style={{ width: 15 }}
                                                      />
                                                      <Text
                                                        numberOfLines={1}
                                                        style={{
                                                          marginLeft:
                                                            moderateScale(7),
                                                          opacity: 1,
                                                          width: '60%',
                                                        }}>
                                                        {itm?.title || itm?.sku}
                                                      </Text>
                                                    </TouchableOpacity>
                                                    <View
                                                      style={{
                                                        borderWidth: 1,
                                                        borderColor:
                                                          colors.borderColorB,
                                                        borderRadius:
                                                          moderateScale(8),
                                                        paddingHorizontal:
                                                          moderateScale(7),
                                                      }}>
                                                      <TextInput
                                                        onChangeText={text =>
                                                          onChangeVariantPrice(
                                                            text,
                                                            item,
                                                            it,
                                                            itm,
                                                          )
                                                        }
                                                        value={itm?.selling_price}
                                                        keyboardType={'numeric'}
                                                        placeholder={strings.ENTER_PRICE}
                                                        style={{
                                                          paddingVertical: moderateScaleVertical(10),
                                                          width: moderateScale(70)
                                                        }}
                                                      />
                                                    </View>
                                                  </View>
                                                );
                                              })}
                                            </KeyboardAwareScrollView>
                                          )}
                                        </View>
                                      )}
                                      right={() => (
                                        <View>
                                          {it?.variant?.length <= 1 && (
                                            <View
                                              style={{
                                                borderWidth: 1,
                                                borderColor: colors.borderColorB,
                                                borderRadius: moderateScale(8),
                                                paddingHorizontal:
                                                  moderateScale(7),
                                              }}>
                                              <TextInput
                                                onChangeText={text =>
                                                  setInputPricevalue(
                                                    text,
                                                    item.id,
                                                    inx,
                                                  )
                                                }
                                                value={it?.selling_price}
                                                keyboardType={'numeric'}
                                                placeholder={strings.ENTER_PRICE}
                                                style={{
                                                  paddingVertical: moderateScaleVertical(10),
                                                  width: moderateScale(75)
                                                }}
                                              />
                                            </View>
                                          )}
                                        </View>
                                      )}
                                    />
                                  );
                                })}
                            </List.Accordion>
                          </View>
                        );
                      })}
                  </View> : <Text style={{
                    fontFamily: fontFamily?.bold,
                    textAlign: "center",
                    fontSize: textScale(14),
                    marginTop: moderateScaleVertical(100)

                  }}>{strings.NODATAFOUND}</Text>}
                </List.AccordionGroup>
              </View>
            </ScrollView>
          )}
        </View>
        {isModalVisibleForDateTime && (
          <DatePickerModal
            mode="time"
            isVisible={isModalVisibleForDateTime}
            date={savedDate ? savedDate : timeset}
            onclose={() => updateState({ isModalVisibleForDateTime: false })}
            onSelectDate={() => onSelectDate()}
            onDateChange={value => onDateChange(value)}
          />
        )}

      </WrapperContainer>
    </BottomSheetModal>
  );
};

export function stylesData({ fontFamily, themeColors }) {
  const commonStyles = commonStylesFun({ fontFamily });

  const styles = StyleSheet.create({
    parentView: {
      flex: 1,
      width: width - 50,
      alignSelf: 'center',
    },
    childMainViewSpacing: {
      // backgroundColor: 'yellow',
      marginVertical: moderateScaleVertical(10),
    },
    textHeading: {
      marginTop: moderateScaleVertical(10),
      fontSize: textScale(14),
      fontFamily: fontFamily.medium,
      color: colors.black,
      textAlign: 'left',
    },
    eachWCardView: {
      marginVertical: moderateScale(5),
      borderWidth: 2,
      borderColor: colors.borderColorGrey,
      padding: moderateScale(10),
      borderRadius: 10,
    },
    formView: {
      flex: 1,
      paddingHorizontal: moderateScale(5),
      paddingVertical: moderateScale(10),
      borderTopLeftRadius: moderateScale(10),
      borderTopRightRadius: moderateScale(10),
      minHeight: moderateScale(200),

    },
    timeView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingVertical: moderateScaleVertical(3),
    },
    addTimeButton: {
      backgroundColor: colors.themeColor,
      alignSelf: 'flex-end',
      borderRadius: 5,
      width: '20%',
      height: 30,
      justifyContent: 'space-evenly',
      flexDirection: 'row',
      alignItems: 'center',
    },
    fromTOParent: {
      flex: 0.4,
      paddingVertical: moderateScale(10),
    },
    lastDeleteView: {
      flex: 0.12,
      paddingVertical: moderateScale(10),
    },
    fromTOParentChild: {
      height: moderateScale(40),
      // paddingVertical: moderateScale(10),
    },
    addRemove: {
      borderRadius: 5,
      height: moderateScale(40),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.ligthRedBackGround,
    },
    addWorkingDaysButton: {
      backgroundColor: colors.lightSky,
      height: moderateScale(30),
      alignContent: 'center',
      justifyContent: 'center',
      borderRadius: 5,
    },
    RemoveWorkingDaysButton: {
      marginVertical: moderateScale(8),
      backgroundColor: colors.ligthRedBackGround,
      height: moderateScale(30),
      alignContent: 'center',
      justifyContent: 'center',
      borderRadius: 5,
    },
    buttonText: {
      fontSize: textScale(14),
      fontFamily: fontFamily.semiBold,
      color: colors.blueSolid,
      textAlign: 'center',
    },
    fromTOChild: {
      height: '100%',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: moderateScaleVertical(10),
      alignItems: 'center',
      // borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.textGreyJ,
      borderRadius: 5,
      backgroundColor: colors.grey2,
    },
    subHeading: {
      fontSize: textScale(13),
      fontFamily: fontFamily.medium,
      color: colors.black,
      textAlign: 'left',
    },
    // time slots
    driverTagsView: {
      borderWidth: 1,
      width: width / 3,
      alignItems: 'center',
      marginVertical: moderateScale(5),
      paddingVertical: moderateScale(5),
      marginHorizontal: moderateScale(5),
      zIndex: 100,
      borderRadius: moderateScale(5),
      justifyContent: 'center',
    },
    noDataFound: {
      width: '100%',
      height: moderateScale(30),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  return styles;
}
export default React.memo(BottomSheetForm);
