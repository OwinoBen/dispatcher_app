import axios from 'axios';
import Geocoder from 'react-native-geocoder';
import Geolocation from 'react-native-geolocation-service';

export const googlePlacesApi = async (data, key, latLng) => {
  // console.log("key", key)
  try {
    // location=30.7173%2C-76.8035
    let res = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${data}&location=${latLng}&key=${key}`,
      {
        method: 'GET',
      },
    );

    let response = await res.json();
    console.log('ressss', response);
    return response;
  } catch (e) {
    console.log('erorr in goole place', e);
  }
};

export const getPlaceDetails = async (id, key) => {
  try {
    let res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${key}`,
      {
        method: 'GET',
      },
    );
    let response = await res.json();
    return response;
  } catch (e) {
    console.log('erorr in goole place', e);
  }
};

export const placesGeoCoding = async (lat, long, key) => {
  try {
    let res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${key}`,
      {
        method: 'GET',
      },
    );
    let response = await res.json();
    return response;
  } catch (e) {
    console.log('erorr in goole place', e);
  }
};

export const nearbySearch = async (latlng, key) => {
  try {
    let res = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latlng}&types=city&radius=5000&key=${key}`,
      {
        method: 'GET',
      },
    );
    let response = await res.json();
    return response;
  } catch (e) {
    console.log('erorr in goole place', e);
  }
};
// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670,151.1957&radius=5000&types=street&key=API_KEY

export const getCurrentLocationFromApi = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('posisition', position);
        const cords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        resolve(cords);
      },
      error => {
        reject(error.message);
      },
      {enableHighAccuracy: true, timeout: 25000, maximumAge: 20000},
    );
  });

export const getAddressFromLatLong = (latlng, mapKey) =>
  axios({
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    params: {
      latlng,
      key: mapKey,
      language: 'en',
    },
  })
    .then(response => {
      // console.log("success resp==>>", response)
      if (response.data.results && response.data.results.length > 0) {
        const dataToSend = {
          address: response.data.results[0].formatted_address,
        };

        return dataToSend;
      }
      return '';
    })
    .catch(error => {
      error;
      console.log('error==>>>', error);
    });

export const getAllTravelDetails = async (addresses, key) => {
  try {
    let res = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${
        addresses[0]?.pickupAddress
      }&destinations=${
        addresses[1]?.dropAddress
      }&units=imperial&key=${'AIzaSyDa0TVxssrT6wV21f6CTvYBenao5wVxUgM'}`,
      {
        method: 'GET',
      },
    );
    let response = await res.json();
    return response;
  } catch (e) {
    console.log('erorr in goole place', e);
  }
};
