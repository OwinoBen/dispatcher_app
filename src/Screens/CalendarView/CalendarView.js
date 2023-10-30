import { useFocusEffect } from '@react-navigation/native';
import { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import {
    Menu,
    MenuOptions,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';
import { useSelector } from 'react-redux';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import Header from '../../Components/Header';
import TaskListCard from '../../Components/TaskListCard';
import WrapperContainer from '../../Components/WrapperContainer';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import { moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize';
import { showError, showSuccess } from '../../utils/helperFunctions';

const calendarTheme = {
    selectedDayTextColor: colors.white,
    monthTextColor: colors.black,
    textMonthFontSize: textScale(14),
    textDayHeaderFontSize: textScale(12),
    dotColor: colors.black,
}
const { Popover } = renderers

export default function CalendarView({
    navigation
}) {
    const flatListRef = useRef(null)
    const { userData } = useSelector(state => state?.auth);
    const { clientInfo } = useSelector(state => state?.initBoot);
    const commonStyles = commonStylesFun({ fontFamily })
    const [markedDates, setMarkedDates] = useState({
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingTasks, setIsLoadingTasks] = useState(false)
    const [allTaskList, setAllTaskList] = useState([])
    const [blockedDates, setBlockedDates] = useState({})

    useFocusEffect(
        useCallback(() => {
            getDateBasedTasks()
        }, []),
    );

    const moveToNewScreen = (screenName, data) => () => {
        navigation.navigate(screenName, { data });
    };

    const getDateBasedTasks = (datesMarked = {}, isDates = false, clickedDate) => {
        setIsLoadingTasks(true)
        let datesData = []
        for (const property in datesMarked) {
            if (datesMarked[property]?.type !== 4) {
                datesData.push(property)

            }
        }
        actions.getFilteredTasks('', {
            selectedDatesArray: datesData,
            booking_type: "blocked"
        },
            {
                client: clientInfo?.database_name,
                shortcode: clientInfo?.client_db_code,
            }).then((res) => {
                flatListRef.current.scrollToOffset({ animated: true, offset: 0 })

                console.log(res, "<===res getFilteredTasks")
                let orderAsignedDates = {}
                let newOrderDates = []
                if (!isEmpty(res?.data?.ordersDates)) {
                    res?.data?.ordersDates?.map((item) => {
                        newOrderDates.push(moment(item).format("YYYY-MM-DD"))
                        orderAsignedDates[moment(item).format("YYYY-MM-DD")] = {
                            marked: true,
                            color: moment(item).format("YYYY-MM-DD") == clickedDate ? colors.black : colors.green,
                            textColor: colors.white,
                            startingDay: true,
                            endingDay: true,
                            type: moment(item).format("YYYY-MM-DD") == clickedDate ? 1 : 4,
                            id: item?.id
                        }
                    })
                }
                setIsLoadingTasks(false)
                setAllTaskList(res?.data?.tasks || [])
                if (!isEmpty(res?.data?.agent_blocked_dates)) {
                    let markedDatesNew = isDates ? datesMarked : cloneDeep(markedDates)
                    let blockedDate = {}
                    let newBlockedDates = {}
                    res?.data?.agent_blocked_dates?.map((item) => {
                        if (newOrderDates.includes(moment(item?.start_date).format("YYYY-MM-DD"))) {
                            newBlockedDates[moment(item?.start_date).format("YYYY-MM-DD")] = {
                                marked: true,
                                color: colors.yellowB,
                                textColor: colors.white,
                                startingDay: true,
                                endingDay: true,
                                type: 2,
                                id: item?.id,
                                blockedWithTask: true
                            }
                        }
                        else {
                            if (item?.schedule_date) {
                                blockedDate[moment(item?.schedule_date).format("YYYY-MM-DD")] = {
                                    marked: true,
                                    color: colors.redB,
                                    textColor: colors.white,
                                    startingDay: true,
                                    endingDay: true,
                                    type: 2,
                                    id: item?.id
                                }
                            }
                        }
                    }
                    )
                    setBlockedDates({ ...blockedDate, ...newBlockedDates })
                    setMarkedDates({ ...markedDatesNew, ...blockedDate, ...orderAsignedDates, ...newBlockedDates })
                }
                else {
                    let newObj = { ...datesMarked, ...orderAsignedDates }
                    let clickedDateObjToInesert = {}
                    if (datesMarked[clickedDate]?.type == 1) {
                        for (const val in newObj) {
                            if (newObj[val]?.type == 1) {
                                delete newObj[val]
                            }
                        }
                        clickedDateObjToInesert[clickedDate] = {
                            marked: true,
                            color: colors.black,
                            textColor: colors.white,
                            startingDay: true,
                            endingDay: true,
                            type: 1,
                        }
                    }

                    setMarkedDates({ ...newObj, ...clickedDateObjToInesert })
                }
            }).catch(errorMethod)
    }

    const onBlockUnblockDate = () => {
        let dateToUnblock = checkDateToBlock()
        let newMarkedDates = cloneDeep(markedDates)
        let dateToBlock = {}
        setIsLoading(true)
        if (!dateToUnblock) {
            for (const value in newMarkedDates) {
                if (newMarkedDates[value].type == 1) {
                    dateToBlock = value
                }
            }
        }
        let dataToSend = {
            slot_date: !!dateToUnblock ? dateToUnblock : dateToBlock,
            type: !!dateToUnblock ? 0 : 1
        }
        actions.blockOrUnblockAgentTaskDates(dataToSend, {
            client: clientInfo?.database_name,
            shortcode: clientInfo?.client_db_code,
        }).then((res) => {
            setIsLoading(false)
            if (!!dateToUnblock) {
                showSuccess(strings.DATE_UNBLOCKED)

                delete newMarkedDates[dateToUnblock]

                let newBlockedDates = cloneDeep(blockedDates)
                delete newBlockedDates[dateToUnblock]
                setBlockedDates(newBlockedDates)
                setMarkedDates(newMarkedDates)
                getDateBasedTasks(newMarkedDates, true)
            }
            else {
                showSuccess(strings.DATE_BLOCKED)
                getDateBasedTasks(newMarkedDates)
            }
        }).catch(errorMethod)


    }
    const onDayPress = (day) => {
        console.log("akjsdfk;lasdfla1", blockedDates)
        if (!isEmpty(blockedDates[day?.dateString])) {

            let newMarkedDates = cloneDeep(markedDates)
            console.log(newMarkedDates, "newMarkedDates>>>>>newMarkedDates")
            for (const val in newMarkedDates) {
                if (newMarkedDates[val]?.type == 3 && newMarkedDates[val]?.color == colors.blue) {
                    if (newMarkedDates[val]?.blockedWithTask == true) {
                        newMarkedDates[val].color = colors.yellowB
                    }
                    else {
                        newMarkedDates[val].color = colors.redB
                    }

                    newMarkedDates[val].type = 2
                }
            }
            newMarkedDates[day?.dateString].color = colors.blue
            newMarkedDates[day?.dateString].type = 3
            setMarkedDates(newMarkedDates)
        }
        else {
            console.log("akjsdfk;lasdfla2")
            let pressedDate = {
                [day.dateString]: {
                    marked: true,
                    color: colors.black,
                    textColor: colors.white,
                    startingDay: true,
                    endingDay: true,
                    type: 1
                }
            }
            let newMarkedDates = cloneDeep(markedDates)
            // remove previous selected date
            for (const val in newMarkedDates) {
                if (newMarkedDates[val]?.type == 1) {
                    delete newMarkedDates[val]
                    newMarkedDates = { ...newMarkedDates, ...pressedDate }
                }
            }
            setMarkedDates({ ...newMarkedDates, ...pressedDate })
            getDateBasedTasks({ ...newMarkedDates, ...pressedDate }, true, day?.dateString)
        }
    }


    const checkDateToBlock = () => {
        let newMarkedDates = cloneDeep(markedDates)
        let blockedDate = ''
        for (const property in newMarkedDates) {
            if (newMarkedDates[property]?.type == 3) {
                blockedDate = property
            }
        }
        return blockedDate
    }

    const errorMethod = error => {
        setIsLoading(false)
        setIsLoadingTasks(false)
        showError(error?.description || error?.message || error?.error || error);
    };

    const _onPressTask = item => {
        moveToNewScreen(navigationStrings.TASKDETAIL, { item: item, is_from_calendar: true })();
    };


    const ColorIndicators = ({ bgColor = colors.yellowB, description = '' }) => {

        return <View style={{
            ...commonStyles.flexRowCenter,
            marginBottom: 10
        }}>
            <View style={{
                height: 16,
                width: 16,
                borderRadius: 8,
                backgroundColor: bgColor,
                marginRight: moderateScale(12)
            }}></View>
            <Text>{description}</Text>
        </View>
    }

    const renderItem = useCallback(
        ({ item, index }) => {
            let allData = allTaskList;
            return <TaskListCard
                data={item}
                index={index}
                previousData={index > 0 ? allData[index - 1] : null}
                allTasks={allData}
                _onPressTask={() => _onPressTask(item)}
            />
        },
        [allTaskList],
    )

    const ListFooterComponent = useCallback(
        () => {
            return <View style={{
                marginBottom: moderateScaleVertical(10)
            }}>
                {
                    !isEmpty(markedDates) && <ButtonWithLoader btnText={!!checkDateToBlock() ? strings.UNBLOCK_DATE : strings.BLOCK_DATE} onPress={onBlockUnblockDate} btnStyle={{
                        marginHorizontal: moderateScale(15)
                    }} btnTextStyle={{
                        textTransform: "none"
                    }} />
                }
            </View>
        },
        [allTaskList, markedDates],
    )

    return (
        <WrapperContainer isLoading={isLoadingTasks} >
            <Header centerTitle={strings.CALENDAR} />
            <View>
                <CalendarList

                    horizontal
                    style={styles.calendarContainer}
                    onDayPress={onDayPress}
                    hideDayNames={false}
                    markingType={'period'}
                    markedDates={markedDates}
                    theme={calendarTheme}
                    minDate={moment(new Date()).format("YYYY-MM-DD")}
                    hideArrows={false}
                    pagingEnabled
                    pastScrollRange={24}
                    futureScrollRange={24}
                    calendarWidth={width}

                />
                <View style={{
                    position: "absolute",
                    right: moderateScale(20), bottom: moderateScale(10)
                }}>
                    <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
                        <MenuTrigger text='i' customStyles={{
                            triggerText: {
                                color: colors.themeColor,
                            },
                            triggerWrapper: {
                                height: moderateScale(20), width: moderateScale(20),

                                alignItems: "center",
                                justifyContent: "center",

                                borderWidth: 1,
                                borderRadius: moderateScale(10),
                                borderColor: colors.themeColor,

                            },
                            TriggerTouchableComponent: TouchableOpacity,
                        }} />
                        <MenuOptions style={{
                            padding: 10,
                        }}>
                            <ColorIndicators bgColor={colors.redB} description={strings.BLOCKED_DATES} />
                            <ColorIndicators bgColor={colors.black} description={strings.TASK_LIST_SELECTED_DATE} />
                            <ColorIndicators bgColor={colors.green} description={strings.TASK_FOR_DATE} />
                            <ColorIndicators bgColor={colors.yellowB} description={strings.TASK_FOR_DATE_BLOCKED} />
                            <ColorIndicators bgColor={colors.blue} description={strings.DATE_AVAILABLE_UNBLOCK} />
                        </MenuOptions>
                    </Menu>
                </View>
            </View>

            <FlatList ref={flatListRef} data={allTaskList}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={ListFooterComponent} ListEmptyComponent={() => <View style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: moderateScaleVertical(100)
                }}>
                    <Text style={{
                        ...commonStyles.boldFont14
                    }}>{strings.NODATAFOUND} !</Text>
                </View>} />
        </WrapperContainer>
    )
}

const styles = StyleSheet.create({
    calendarContainer: {
        borderBottomWidth: 1,
        borderColor: colors.borderColorB,
        width: width,
        marginHorizontal: moderateScale(10)

    }
})