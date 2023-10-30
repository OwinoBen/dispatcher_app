import React from 'react'
import { StyleSheet } from 'react-native'
import BottomSheetForm from '../../Components/BottomSheetForm'

export default function ProductsPrice({
    navigation
}) {
    return (
        <BottomSheetForm
            onCloseSheet={() => navigation.goBack()}
            isDriverServiceDetailing={false}
            isFromAccountStack
        />
    )
}

const styles = StyleSheet.create({})