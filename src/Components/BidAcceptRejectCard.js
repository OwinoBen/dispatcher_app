import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import fontFamily from '../styles/fontFamily';
import colors from '../styles/colors';
import GradientButton from './GradientButton';
import { moderateScale, moderateScaleVertical, textScale, width } from '../styles/responsiveSize';
import imagePath from '../constants/imagePath';
import TextInputWithUnderlineAndLabel from './TextInputWithUnderlineAndLabel';

const BidAcceptRejectCard = ({
  data = {},
  _onAcceptRideBid = () => { },
  setBidRidePrice = () => { },
  _onSetBidPrice = () => { },
  _onDeclineBid=()=>{}
}) => {
  



const allBidLocations = data?.tasks.replace(/'/g, '"')

  const renderDotContainer = () => {
    return (
      <>
        <View style={{ height: 40, overflow: "hidden", alignItems: "center" }}>
          <View style={{
            height: 40,
            width: 0.5,
            backgroundColor: colors.textGreyLight,
          }} />
        </View>
        <Image
          style={{
            tintColor: colors.redB,
          }}
          source={imagePath.blackSquare}
        />
      </>
    );
  };


  const onListAllAddress = (item) => {
    if (item?.task_type_id == 2) {
      return (
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginHorizontal: moderateScale(10) }}>
            {renderDotContainer()}
          </View>
          <View style={{ justifyContent: "center" }}>
            <Text
              numberOfLines={1}
              style={
                {
                  marginTop: moderateScaleVertical(28),
                  fontFamily: fontFamily.semiBold,
                  fontSize: textScale(14),

                }
              }
            >
              {item?.address}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ paddingHorizontal: moderateScale(30) }}>
          <Text numberOfLines={1} style={{
            fontFamily: fontFamily.semiBold,
            fontSize: textScale(14)
          }}>
            {item?.address}
          </Text>
        </View>
      );
    }
  };






  return (
    <View style={{
      marginTop: moderateScaleVertical(20),
      width: moderateScale(width - 40),
      alignSelf: 'center',
      backgroundColor: colors.whiteSmokeColor,
      borderRadius: moderateScale(15), overflow: 'hidden'
    }}>
      <View style={{
        alignSelf: 'flex-end',
        marginHorizontal: moderateScale(20),
        marginTop: moderateScaleVertical(8)
      }} >
        <CountdownCircleTimer
          isPlaying
          duration={Number(data?.expire_seconds)}
          colors={[colors.themeColor]}
          size={40}
          strokeWidth={5}
        >
          {({ remainingTime }) => {
            remainingTime == 1 && _onDeclineBid(data?.id)
            return (
              <Text>{remainingTime}</Text>
            )
          }}
        </CountdownCircleTimer>

      </View>
      <View style={{ marginHorizontal: moderateScale(10), flexDirection: 'row', alignItems: 'center', }}>
        <View
          style={{
            marginHorizontal: moderateScale(10),
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1
          }}>
          <View style={{ flex: 0.25, }}>
            <Image
              style={{ height: moderateScaleVertical(50), width: moderateScale(50), borderRadius: moderateScale(25) }}
              source={{ uri: data?.customer_image }} />
            <Text style={{ fontSize: textScale(13), fontFamily: fontFamily.bold }}>{data?.customer_name}</Text>
            <Text style={{ fontSize: textScale(15), color: colors.themeColor, fontFamily: fontFamily?.bold }}> {Number(data?.requested_price).toFixed(2)}</Text>
          </View>
          {/* address location */}
          <View style={{ flexDirection: "row", flex: 0.75 }}>
            <View>
              <Image
                style={{
                  position: "absolute",
                  marginHorizontal: moderateScale(11),
                  top: 8,
                  tintColor: colors.green
                }}
                source={imagePath.grayDot}
              />
            </View>
            <View>
              {JSON.parse(allBidLocations)?.map((item, index) => {
                return (
                  onListAllAddress(item)
                )
              })}
            </View>
            {/* end */}
          </View>
        </View>
      </View>
      {/* Accept button */}
      {/* <View style={{ marginVertical: moderateScaleVertical(10), width: '80%', alignSelf: 'center' }}>
        <GradientButton
          colorsArray={[colors.themeColor, colors.themeColor]}
          textStyle={{
            textTransform: 'none',
            fontSize: textScale(13),
            color: colors.white,
          }}
          onPress={() => _onAcceptRideBid({ ...data, finial_selected_price: !!data?.allCustomerBidsList ? data?.allCustomerBidsList : data?.requested_price })}
          btnText={`Bid For ${!!data?.allCustomerBidsList ? data?.allCustomerBidsList : Number(data?.requested_price).toFixed(2)}`}
          btnStyle={{ width: moderateScale(width / 2.5) }}
        />
      </View>

      <View style={{ width: '90%', marginVertical: moderateScaleVertical(10), alignSelf: 'center' }}>
        <Text style={{ fontSize: textScale(15), color: colors.themeColor, fontFamily: fontFamily?.bold }}>
          Offer you fare for the trip
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={allPricesForRideSubmit}
          renderItem={({ item, index }) => {
            return (
              <GradientButton
                colorsArray={
                  item?.selected && !!data?.allCustomerBidsList ?
                    [colors.redB, colors.redB] :
                    [colors.white, colors.white]}
                textStyle={{
                  textTransform: 'none',
                  fontSize: textScale(13),
                  color: item?.selected && !!data?.allCustomerBidsList ? colors.white : colors?.redB,
                }}
                onPress={() => _onChangeBidPrice(item, data?.bid_id, index)}
                btnText={`${item?.price}`}
                btnStyle={{ width: moderateScale(width / 4.6), borderWidth: moderateScale(1), borderColor: colors.redB }}
                containerStyle={{ backgroundColor: colors.whiteSmokeColor, padding: moderateScale(6) }}
              />
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
     */}

      <View style={{ flexDirection: 'row', marginTop: moderateScaleVertical(20),paddingHorizontal:moderateScale(10) }}>
        <TouchableOpacity style={{
          backgroundColor: colors.themeColor,
          flex: 0.15,
          height: moderateScaleVertical(50),
          justifyContent: 'center', alignItems: 'center', borderRadius: moderateScale(8)
        }}
          onPress={() => _onSetBidPrice('minus',data)}>
          <Text style={{ color: colors.white, fontFamily: fontFamily?.bold }}>- 10</Text>
        </TouchableOpacity>
        <View style={{ flex: 0.7, marginHorizontal: moderateScale(10) }}>
          <TextInputWithUnderlineAndLabel
            txtInputStyle={{ textAlign: 'center' }}
            isEditable={false}
            placeholder={'Recommend fare,adjustable'}
            onChangeText={(text) => setBidRidePrice(text)}
            value={`${Number(data?.selectedPriceForBid||data?.requested_price).toFixed(2)}`} />
        </View>
        <TouchableOpacity style={{
          backgroundColor: colors.themeColor,
          flex: 0.15,
          height: moderateScaleVertical(50),
          justifyContent: 'center', alignItems: 'center', borderRadius: moderateScale(8)
        }}
          onPress={() => _onSetBidPrice('plus',data)}>
          <Text style={{ color: colors.white, fontFamily: fontFamily?.bold }}>+ 10</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginVertical: moderateScaleVertical(10), width: '80%', alignSelf: 'center' }}>
        <GradientButton
          colorsArray={[colors.themeColor, colors.themeColor]}
          textStyle={{
            textTransform: 'none',
            fontSize: textScale(13),
            color: colors.white,
          }}
          onPress={() => _onAcceptRideBid({ ...data, finial_selected_price: !!data?.selectedPriceForBid ?data?.selectedPriceForBid : data?.requested_price })}
          btnText={`Bid For ${!!data?.selectedPriceForBid ? Number(data?.selectedPriceForBid).toFixed(2) : Number(data?.requested_price).toFixed(2)}`}
          btnStyle={{ width: moderateScale(width / 2.5) }}
        />
      </View>


    </View>
  )
}

export default BidAcceptRejectCard;