import React from 'react'
import { StyleSheet } from 'react-native'
import BottomSheetForm from '../../Components/BottomSheetForm'

export default function ServiceSlots({
    navigation
}) {
    return (
        <BottomSheetForm
            onCloseSheet={() => navigation.goBack()}
            isDriverServiceDetailing={true}
            isGetSlots={true}
        />
    )
}

const styles = StyleSheet.create({})