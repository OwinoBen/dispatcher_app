import { View, Text, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import styles from "./styles";
import WrapperContainer from "../../Components/WrapperContainer";
import Header from "../../Components/Header";
import colors from "../../styles/colors";
import MapViewDirections from "react-native-maps-directions";
import { height, moderateScale, width } from "../../styles/responsiveSize";
import { chekLocationPermission } from "../../utils/permissions";
import imagePath from "../../constants/imagePath";
import WebView from "react-native-webview";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import useInterval from "../../utils/useInterval";
import { useSelector } from "react-redux";


export default function DriverTraking(props) {
  const { navigation, route } = props;
  const paramsData = route?.params;

  const userData = useSelector((state) => state?.auth?.userData);

  const [driverCurrentLatLong, setDriverCurrentLatLong] = useState({
    longitude: null,
    latitude: null,
  });

  const [taskLocations, setTaskLocations] = useState({
    latitude: Number(paramsData?.taskDetail?.location?.latitude),
    longitude: Number(paramsData?.taskDetail?.location?.longitude),
  });

  const mapRef = useRef();
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      currentLocation();
    }, [])
  );

useEffect(()=>{
  const interval = setInterval(() => {
   
      currentLocation();
    
    }, 30000);
    return () => clearInterval(interval);
},[])

console.log(userData,"userDatauserData");

 

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
        console.log(position,"positionposition");
        setDriverCurrentLatLong({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading,
        });
      },
      (error) => console.log(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
      }
    );
  };



  return (
    <WrapperContainer>
      <Header
        headerStyle={{ backgroundColor: colors.white }}
        leftIconStyle={{ tintColor: colors.themeColor }}
        onPressLeft={() => navigation.goBack()}
        // hideRight={true}
        // onPressLeft={()=>navigation.goBack()}
        centerTitle={`Tracking`}
      />

      {!!taskLocations?.latitude && driverCurrentLatLong?.latitude && (
        <MapView
          ref={mapRef}
          //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          // region={region}
          zoomEnabled={true}
          initialRegion={{
            latitude: Number(driverCurrentLatLong?.latitude),
            longitude: Number(driverCurrentLatLong?.longitude),
            latitudeDelta: 0.035,
            longitudeDelta: 0.0321,
          }}
        >
          <MapViewDirections
            resetOnChange={false}
            origin={{
              latitude: Number(driverCurrentLatLong?.latitude),
              longitude: Number(driverCurrentLatLong?.longitude),
            }}  
            destination={taskLocations}
            apikey={userData?.client_preference?.map_key_1}
            strokeWidth={6}
            strokeColor={colors.black}
            optimizeWaypoints={true}
          
            precision={"high"}
            timePrecision={"now"}
            mode={"DRIVING"}
            // maxZoomLevel={20}
            // onReady={(result) => {
            //   mapRef.current.fitToCoordinates(result.coordinates, {
            //     edgePadding: {
            //       right: moderateScale(20),
            //       bottom: moderateScale(40),
            //       left: moderateScale(20),
            //       top: moderateScale(40),
            //     },
            //   });
            // }}
            onError={(errorMessage) => {
              //
            }}
          />
          <Marker image={imagePath.pinRed} coordinate={taskLocations}></Marker>

          <Marker.Animated
            coordinate={{
              latitude: Number(driverCurrentLatLong?.latitude),
              longitude: Number(driverCurrentLatLong?.longitude),
            }}
          >
            <Image
              style={{
                zIndex: 99,
                // height:46,
                // width: 32,
                transform: [
                  {
                    rotate: `${Number(driverCurrentLatLong?.heading)}deg`,
                  },
                ],
              }}
              source={imagePath.carMarker}
            />
          </Marker.Animated>
        </MapView>
      )}
    </WrapperContainer>
  );
}
