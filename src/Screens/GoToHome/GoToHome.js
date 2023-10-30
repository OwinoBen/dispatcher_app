import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import AddressBottomSheet from '../../Components/AddressBottomSheet';
import Header from '../../Components/Header';
import SearchPlaces from '../../Components/SearchPlaces';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import { moderateScale, moderateScaleVertical, textScale } from '../../styles/responsiveSize';
import { showError, showSuccess } from '../../utils/helperFunctions';
import { chekLocationPermission } from "../../utils/permissions";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

navigator.geolocation = require("react-native-geolocation-service");



const GoToHome = ({ navigation }) => {
    const { userData } = useSelector((state) => state?.auth || {});
    const { clientInfo, } = useSelector(
        (state) => state?.initBoot || {}
    );
    const [isGoToHome, setIsGoToHome] = useState(!!userData?.is_go_to_home_address || false)
    const [isLoading, setIsLoading] = useState(false)
    const [agentAllAddresses, setAgentAllAddresses] = useState([])
    const [currentAgentLocation, setCurrentAgentLocation] = useState({
        latitude: 30.7333,
        longitude: 76.7794,
    })
    const [address, setAddress] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [isMapSelectLocation, setIsMapSelectLocation] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [updateData, setUpdateData] = useState({})
    const [selectViaMap, setSelectViaMap] = useState(false)
    const [indicator, setIndicator] = useState(false)

    useEffect(() => {
        getAgentsHomeAddress()
        setIsLoading(true)
        currentLocation()
    }, [])

    const currentLocation = () => {
        chekLocationPermission()
            .then((result) => {
                if (result !== "goback") {
                    getCurrentPosition();
                }
            })
            .catch((error) => console.log("error while accessing location ", error));
    };

    const getCurrentPosition = () => {
        return navigator.geolocation.default.getCurrentPosition(
            (position) => {
                setCurrentAgentLocation({
                    latitude: position?.coords?.latitude,
                    longitude: position?.coords?.longitude
                })
            },
            (error) => console.log(error.message),
            {
                enableHighAccuracy: true,
                timeout: 20000,
            }
        );
    };

    const getAgentsHomeAddress = () => {
        actions.getAgentHomeAddress({
        }, {
            client: clientInfo?.database_name,
        }).then((res) => {
            setIsLoading(false)
            setAgentAllAddresses(res?.data || [])
            console.log(res, "<===res getAgentHomeAddress")
        }).catch(errorMethod)
    }

    const onToggleChange = (val) => {
        if (!isEmpty(agentAllAddresses) || !val) {
            setIsGoToHome(val)
            setIsLoading(true)
            actions.updateGoToHomeStatus(
                {
                    is_go_to_home_address: !!val ? 1 : 0
                },
                {
                    client: clientInfo?.database_name,
                }
            ).then((res) => {
                console.log(res, "<===res updateGoToHomeStatus")
                setIsLoading(false)
                showSuccess("Status updated.")
            }).catch(errorMethod)
        }
        else {
            showError("Please add address.")
        }
    }

    //Error handling in api
    const errorMethod = (error) => {
        setIsLoading(false)
        showError(error?.message || error?.error);

    };

    const addressDone = (value) => {

    };

    const onSetAddressAsPrimary = (item) => {
        console.log(item, "item>>>>>>>>item")
        setIsLoading(true)
        actions.setAgentsPrimaryAddress({
            address_id: item?.id
        }, {
            client: clientInfo?.database_name,
        }).then((res) => {
            showSuccess("Your primary address updated.")
            getAgentsHomeAddress()
        }).catch(errorMethod)
    }

    const onPressAddress = (val) => {
        setIsLoading(true)
        let apiData = {
            latitude: val?.latitude,
            longitude: val?.longitude,
            short_name: val?.address_type == 1 ? 'Home' : "Work",
            address: val?.address,

        }
        actions.addAgentHomeAddress(apiData, {
            client: clientInfo?.database_name,
        }).then((res) => {
            // setIsLoading(false)
            showSuccess("Address added.")
            getAgentsHomeAddress()
        }).catch(errorMethod)

    }

    const customCenter = () => {
        return <View>
            {!!userData?.client_preference?.is_go_to_home ? (
                <View
                    style={{
                        alignItems: "center"
                    }}
                >
                    <Switch
                        trackColor={{ false: colors.backGround, true: colors.themeColor }}
                        thumbColor={colors.white}
                        onValueChange={onToggleChange}
                        value={isGoToHome}
                    />
                    <Text
                        style={styles.goToHome}
                    >
                        Go To Home
                    </Text>
                </View>
            ) : null}
        </View>
    }

    const renderItem = useCallback(
        ({ item, index }) => {
            return <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: moderateScaleVertical(6),
                    borderBottomWidth: 0.5,
                    marginBottom: moderateScaleVertical(4),
                    borderBottomColor: colors.lightGreyBg,
                }}
                onPress={() => onPressAddress(item)}
            >
                <View style={{ flex: 0.15 }}>
                    <Image source={imagePath.icSearchedLoc} />
                </View>
                <View style={{ flex: 0.9 }}>
                    <Text
                        style={{
                            fontSize: textScale(12),
                            color: colors.black,
                            fontFamily: fontFamily.regular,
                        }}
                    >
                        {item?.name || item?.city}
                    </Text>
                    <Text
                        numberOfLines={2}
                        style={{
                            fontSize: textScale(10),
                            color: colors.textGreyJ,
                            fontFamily: fontFamily.regular,
                            lineHeight: moderateScaleVertical(20),
                        }}
                    >
                        {item?.formatted_address}
                    </Text>
                </View>
            </TouchableOpacity>
        },
        [searchResult],
    )

    const renderAllAddressItem = useCallback(
        ({ item, index }) => {
            return <TouchableOpacity

                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: moderateScaleVertical(6),
                    borderBottomWidth: 0.5,
                    marginBottom: moderateScaleVertical(4),
                    borderBottomColor: colors.lightGreyBg,
                }}
                onPress={() => onSetAddressAsPrimary(item)}
            >
                <View style={{ flex: 0.15 }}>
                    <Image source={imagePath.icSearchedLoc} />
                </View>
                <View style={{ flex: 0.9 }}>
                    <Text
                        style={{
                            fontSize: textScale(12),
                            color: colors.black,
                            fontFamily: fontFamily.regular,
                        }}
                    >
                        {item?.short_name}
                    </Text>
                    <Text
                        numberOfLines={2}
                        style={{
                            fontSize: textScale(10),
                            color: colors.textGreyJ,
                            fontFamily: fontFamily.regular,
                            lineHeight: moderateScaleVertical(20),
                        }}
                    >
                        {item?.address}
                    </Text>
                </View>

                <Image source={!!item?.is_default ? imagePath.checkBox2Active : imagePath.checkBox2InActive} />
            </TouchableOpacity>
        },
        [agentAllAddresses],
    )


    return (
        <WrapperContainer isLoading={isLoading} bgColor={colors.white}>

            <Header
                reverse={false}
                headerStyle={{ backgroundColor: colors.white }}
                // leftIcon={imagePath.menu}
                // onPressLeft={() => navigation.toggleDrawer()}
                hideRight={true}
                customCenter={() => customCenter()}
            />



            <View style={{
                marginHorizontal: moderateScale(20),
                marginVertical: moderateScaleVertical(20)
            }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: "center"
                    }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: textScale(16),
                            fontFamily: fontFamily.medium,
                            width: moderateScale(180),
                            color: colors.blackOpacity86,
                        }}>
                        {"Saved Locations"}
                    </Text>
                    <TouchableOpacity
                        disabled={isLoading}
                        onPress={() => setIsVisible(true)}
                    >
                        <Text
                            style={{
                                fontSize: textScale(12),
                                fontFamily: fontFamily.medium,
                                color: colors.themeColor,
                            }}>
                            {" + Add New Address"}
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* <SearchPlaces
                    curLatLng={`${currentAgentLocation.latitude}-${currentAgentLocation.longitude}`}
                    autoFocus={true}
                    placeHolder={"Search Location"}
                    value={address} // instant update search value
                    mapKey={userData?.client_preference?.map_key_1} //send here google Key
                    fetchArrayResult={(data) => setSearchResult(data)}
                    setValue={(text) => setAddress(text)} //return & update on change text value
                    // _moveToNextScreen={getCurrentLocate}
                    placeHolderColor={colors.textGreyB}
                    onClear={() => {
                        setAddress('')
                        setSearchResult([])
                    }}
                    mapClose={() => setIsMapSelectLocation(false)}
                    addressDone={addressDone}
                    isMapSelectLocation={isMapSelectLocation}
                    currentLatLong={currentAgentLocation}
                /> */}
            </View>
            {/* {!isEmpty(searchResult) && <View>
                <FlatList data={searchResult}
                    contentContainerStyle={{
                        paddingHorizontal: moderateScale(20),

                    }} renderItem={renderItem} />
            </View>} */}

            {
                !isEmpty(agentAllAddresses) ? <View>

                    <FlatList data={agentAllAddresses} contentContainerStyle={{
                        paddingHorizontal: moderateScale(20),
                    }} renderItem={renderAllAddressItem} />
                </View> :
                    <View style={{
                        alignItems: "center",
                        marginTop: moderateScaleVertical(40)
                    }}>
                        <Text>No home address found!</Text>
                    </View>
            }


            {isVisible ? (
                <AddressBottomSheet
                    navigation={navigation}
                    updateData={updateData}
                    indicator={indicator}
                    type={"addAddress"}
                    passLocation={onPressAddress}
                    openCloseMapAddress={(type) => setSelectViaMap(type == 1 ? true : false)}
                    selectViaMap={selectViaMap}
                    onCloseSheet={() => {
                        setSelectViaMap(false)
                        setIsVisible(false)
                    }}
                    currentAgentLocation={currentAgentLocation}
                />
            ) : null}
        </WrapperContainer>
    )
}

export default gestureHandlerRootHOC(GoToHome)

const styles = StyleSheet.create({
    goToHome: {
        fontSize: textScale(16),
        fontFamily: fontFamily?.bold,
        color: colors.black,
    }
})
