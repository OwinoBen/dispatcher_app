import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import commonStylesFun from '../styles/commonStyles'
import fontFamily from '../styles/fontFamily'
import FastImage from 'react-native-fast-image'
import imagePath from '../constants/imagePath'
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize'

export default function LeftImgRightTxt({
    containerStyle = {},
    onPress = () => { },
    rightTxt = "",
    leftImgSrc = imagePath.icProfileInactive
}) {
    let commonStyles = commonStylesFun({ fontFamily })
    return (
        <TouchableOpacity onPress={onPress} style={{
            ...commonStyles.flexRowCenter,
            marginLeft: moderateScale(6),
            marginTop: moderateScaleVertical(30),
            ...containerStyle
        }}>
            <FastImage source={leftImgSrc} resizeMode={"contain"} style={{
                height: 20, width: 20
            }} />
            <Text style={{
                ...commonStyles.mediumFont14,
                marginLeft: moderateScale(8)
            }}>{rightTxt}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})