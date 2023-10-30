import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import GradientButton from '../Components/GradientButton';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeightSecond,
  width
} from '../styles/responsiveSize';
import { getCurrentLocation } from '../utils/helperFunctions';
import { chekLocationPermission } from '../utils/permissions';


export default function SelctFromMap({
  addressDone = () => { },
  mapClose = () => { },
  constCurrLoc,
  location,
  doneBtnStyle = {},
}) {
  const mapRef = React.createRef();

  const [state, setState] = useState({
    region: {
      latitude: constCurrLoc?.latitude || 30.7333,
      longitude: constCurrLoc?.longitude || 76.7794,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    coordinate: {
      latitude: constCurrLoc?.latitude || 30.7333,
      longitude: constCurrLoc?.longitude || 76.7794,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    isLoading: false,
    details: {},
    addressLabel: 'Glenpark',
    formattedAddress: '8502 Preston Rd. Inglewood, Maine 98380',
    userCurrentLongitude: null,
    userCurrentLatitude: null,
    isVisible: false,
    task_type_id: null,
  });

  const { region, details } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const _onRegionChange = (region) => {
    updateState({ region: region });
    _getAddressBasedOnCoordinates(region);
    // animate(region);
  };

  const _getAddressBasedOnCoordinates = (region) => {
    Geocoder.from({
      latitude: region.latitude,
      longitude: region.longitude,
    })
      .then((json) => {
        let finalResult = {};
        if (json?.results?.length > 0) {
          json.results.every((val, i) => {
            console.log('my val', val);
            if (
              val.types.includes('plus_code') ||
              val.types.includes('street_address') ||
              val.types.includes('route') ||
              val.types.includes('postal_code') ||
              val.types.includes('administrative_area_level_1')
            ) {
              finalResult = val;
              return false;
            } else {
              finalResult = val;
              return true;
            }
          });
        }
        if (Object.keys(finalResult).length > 0) {
          updateState({ formattedAddress: finalResult?.formatted_address });
          let detail = {};
          detail = {
            formatted_address: finalResult?.formatted_address,
            geometry: {
              location: {
                lat: region.latitude,
                lng: region.longitude,
              },
            },
            address_components: finalResult?.address_components,
            place_id: finalResult?.place_id,
          };
          updateState({ details: detail });
        } else {
          alert('location not found');
        }
      })
      .catch((error) => console.log(error, 'errro geocode'));
  };

  useEffect(() => {
    chekLocationPermission()
      .then((result) => {

        if (result !== 'goback') {
          getCurrentLocation('home')
            .then((res) => {
              console.log(res, "resultresultresultresult");
              Geolocation.getCurrentPosition(
                //Will give you the current location
                (position) => {
                  //getting the Longitude from the location json
                  const currentLongitude = JSON.stringify(
                    position.coords.longitude,
                  );

                  //getting the Latitude from the location json
                  const currentLatitude = JSON.stringify(
                    position.coords.latitude,
                  );
                  updateState({
                    userCurrentLongitude: currentLongitude,
                    userCurrentLatitude: currentLatitude,
                  });
                },
                (error) => alert(error.message),
                {
                  enableHighAccuracy: true,
                  timeout: 20000,
                  maximumAge: 1000,
                },
              );
            })
            .catch((err) => { });
        }
      })
      .catch((error) => console.log('error while accessing location', error));
  }, []);

  const _modeToNextScreen = () => {
    const pickuplocationAllData = {
      longitude: details?.geometry?.location?.lng,
      latitude: details?.geometry?.location?.lat,
      address: details?.formatted_address,
      task_type_id: 1,
      pre_address: details?.formatted_address,
      place_id: details?.place_id,
    };
    addressDone(pickuplocationAllData);
  };

  const markerRef = useRef();

  const MARKER_WIDTH = 20;
  /** Marker's height */
  const MARKER_HEIGHT = 40; // marker height

  const getCenterOffsetForAnchor = (
    anchor = {},
    markerWidth = number,
    markerHeight = number,
  ) => {
    return {
      x: markerWidth * 0.5 - markerWidth * anchor.x,
      y: markerHeight * 0.5 - markerHeight * anchor.y,
    };
  };

  /** Customizable anchor prop - Specify your desired anchor adjustements here */
  const ANCHOR = { x: 0.5, y: 0.5 }; // in my case I customized this based on marker dimensions like this: { x: 0.5, y: 1 - 10 / MARKER_HEIGHT } lifting the marker up a bit
  /** auto generated centerOffset prop based on the anchor property */
  const CENTEROFFSET = getCenterOffsetForAnchor(
    ANCHOR,
    MARKER_WIDTH,
    MARKER_HEIGHT,
  );

  const _onDrag = (res) => {
    console.log(res, 'ondrag res');
    _getAddressBasedOnCoordinates(res?.coordinate);
  };

  return (
    <>
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={{
          ...StyleSheet.absoluteFillObject,
          height: height,
        }}

        // region={region}
        initialRegion={region}
        // pointerEvents={'none'}

        onRegionChangeComplete={_onRegionChange}>
      </MapView>
      <View style={{ marginHorizontal: moderateScale(15) }}>
        <TouchableOpacity onPress={mapClose}>
          <View
            style={{
              paddingHorizontal: moderateScale(15),
              paddingVertical: moderateScaleVertical(15),
            }}>
            <Image
              style={{
                tintColor: colors.black,
              }}
              source={imagePath.backArrow}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: 'absolute',
          top: height / 2 - StatusBarHeightSecond,
          right: width / 2,
          left: width / 2,
          bottom: height / 2,
          alignItems: 'center',
          justifyContent: 'center',
          // marginTop: height / 2,
        }}>
        <Image
          source={imagePath.icLocationPin_}
          style={{ tintColor: colors.themeColor }}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 40,
          width: width - 40,
          alignSelf: 'center',
          ...doneBtnStyle,
        }}>
        <Text
          style={{
            marginBottom: 40,
            textAlign: 'center',
            color: colors.black,
            fontFamily: fontFamily.medium,
          }}>
          {state.formattedAddress}
          {/* {strings.PLACE_PIN_ON_MAP} */}
        </Text>
        <GradientButton
          btnText={strings.DONE}
          onPress={() => _modeToNextScreen()}
        />
      </View>
    </>
  );
}
