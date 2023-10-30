import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux'
import Header from '../../Components/Header'
import LeftImgRightTxt from '../../Components/LeftImgRightTxt'
import WrapperContainer from '../../Components/WrapperContainer'
import imagePath from '../../constants/imagePath'
import navigationStrings from '../../navigation/navigationStrings'
import commonStylesFun from '../../styles/commonStyles'
import fontFamily from '../../styles/fontFamily'
import { moderateScale, moderateScaleVertical } from '../../styles/responsiveSize'
import ZendeskChat from '../../library/react-native-zendesk-chat';
import strings from '../../constants/lang'
import BackgroundGeolocation from '@hariks789/react-native-background-geolocation';
import actions from '../../redux/actions'
import { showError, showSuccess } from '../../utils/helperFunctions'
import { removerUserData } from '../../redux/actions/auth'
import { removeItem } from '../../utils/utils'
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles'

export default function Account({
    navigation
}) {
    const { userData } = useSelector(state => state?.auth);
    const { zendeskKeys, clientInfo, defaultLanguage } = useSelector(state => state?.initBoot || {});

    const [isLoading, setLoading] = useState(false)

    const commonStyles = commonStylesFun({
        fontFamily
    })
    useEffect(() => {
        ZendeskChat.init(
            `${zendeskKeys?.keys?.account_key}`,
            `${zendeskKeys?.keys?.application_id}`,
        );
    }, [zendeskKeys?.keys?.account_key,
    zendeskKeys?.keys?.application_id,])



    console.log(userData, "<===userData")
    const moveToNewScreen =
        (screenName, data = {}) =>
            () => {
                navigation.navigate(screenName, { data });
            };
    const onStartSupportChat = () => {
        if (zendeskKeys?.keys?.account_key == '' || zendeskKeys?.keys?.application_id == '') {
            showError(strings.SUPPORT_CHAT_NOT_CONFIGURED)
            return
        }

        ZendeskChat.setVisitorInfo({
            name: userData?.name,
            phone: userData?.phone_number ? userData?.phone_number : '',
        })
        ZendeskChat.startChat({
            name: userData?.name,
            phone: userData?.phone_number ? userData?.phone_number : '',
            withChat: true,
            color: '#000',
        });
    };

    const onLogoutPress = () => {

        Alert.alert('', strings.AREYOUSURE, [
            {
                text: strings.CANCEL,
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: strings.OK,
                onPress: () => {
                    console.log('progress');
                    logout();
                    BackgroundGeolocation.removeAllListeners();
                    // navigation.toggleDrawer();
                },
            },
        ]);
    };

    const logout = () => {
        setLoading(true)
        actions.logout({}, { client: clientInfo?.database_name })
            .then(res => {
                console.log(res, 'login data');
                removeItem("userData").then((res)=>{
                    showSuccess(res?.message ? res?.message : 'Logout successfully.');
                    setLoading(false)
                    setTimeout(() => {
                    removerUserData();
                   }, 600);
                }).catch((error)=>{
                    console.log("cant remove")
                    showError('cant remove')
                })
               
            })
            .catch(errorMethod);
    };

    //Error handling in api
    const errorMethod = error => {

        showError(error?.message || error?.error);
    };


    return (
        <WrapperContainer
        isLoadingB={isLoading}
        source={loaderOne}
        >
            <Header centerTitle={strings.MY_ACCOUNT} noLeftIcon />
            <View style={{
                flex: 1,
                marginHorizontal: moderateScale(20)
            }}>
                <TouchableOpacity disabled activeOpacity={0.7} style={{
                    ...commonStyles.flexRowCenter,
                    marginTop: moderateScaleVertical(20)
                }}>
                    <FastImage source={{
                        uri: userData?.image_url
                    }} style={{
                        height: moderateScale(60), width: moderateScale(60),
                        borderRadius: moderateScale(30)
                    }} />
                    <View style={{
                        marginLeft: moderateScale(10),
                    }}>
                        <Text style={{
                            ...commonStyles.mediumFont14
                        }}>
                            {userData?.name || ''}
                        </Text>
                        <Text style={{
                            ...commonStyles.font13
                        }}>{userData?.phone_number}</Text>
                    </View>
                </TouchableOpacity>
                <LeftImgRightTxt onPress={moveToNewScreen(navigationStrings.PROFILESTACK)} leftImgSrc={imagePath.profileImage} rightTxt={strings.PROFILE} />
                <LeftImgRightTxt onPress={moveToNewScreen(navigationStrings.TASKHISTORY)} leftImgSrc={imagePath.taskHistory} rightTxt={strings.TASKHISTORY} />
                <LeftImgRightTxt onPress={moveToNewScreen(navigationStrings.WALLETSTACK)} leftImgSrc={imagePath.wallet} rightTxt={strings.WALLET} />
                <LeftImgRightTxt onPress={moveToNewScreen(navigationStrings.SERVICE_SLOTS)} leftImgSrc={imagePath.time} rightTxt={strings.DATE_TIME} />
                <LeftImgRightTxt onPress={moveToNewScreen(navigationStrings.PRODUCTS_PRICE)} leftImgSrc={imagePath.icPayout} rightTxt={strings.SERVICE_DETAILS} />
                <LeftImgRightTxt onPress={moveToNewScreen(navigationStrings.SUBSCRIPTION_STACK)} leftImgSrc={imagePath.icSubscription} rightTxt={strings.SUBSCRIPTIONS} />
                <LeftImgRightTxt onPress={moveToNewScreen(navigationStrings.SETTINGS)} leftImgSrc={imagePath.settingsIcon} rightTxt={strings.SETTINGS} />
                <LeftImgRightTxt onPress={onStartSupportChat} leftImgSrc={imagePath.support2} rightTxt={strings.SUPPORT} />
                <LeftImgRightTxt onPress={moveToNewScreen(navigationStrings.CONTACTUS)} leftImgSrc={imagePath.contact2} rightTxt={strings.CONTACT} />
                <LeftImgRightTxt onPress={onLogoutPress} leftImgSrc={imagePath.logout} rightTxt={strings.LOGOUT} />

            </View>
        </WrapperContainer>
    )
}

const styles = StyleSheet.create({})