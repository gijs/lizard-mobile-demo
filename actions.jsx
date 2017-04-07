/* globals Promise:true */
import $ from 'jquery';
import _ from 'lodash';

export const REQUEST_GEOCODE = 'REQUEST_GEOCODE';
export const RECEIVE_GEOCODE = 'RECEIVE_GEOCODE';
export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';
export const REQUEST_AVAILABLE_MAP_LAYERS = 'REQUEST_AVAILABLE_MAP_LAYERS';
export const RECEIVE_AVAILABLE_MAP_LAYERS = 'RECEIVE_AVAILABLE_MAP_LAYERS';
export const REQUEST_DETAILS_FOR_MAP_OBJECT = 'REQUEST_DETAILS_FOR_MAP_OBJECT';
export const RECEIVE_DETAILS_FOR_MAP_OBJECT = 'RECEIVE_DETAILS_FOR_MAP_OBJECT';
export const RECEIVE_MULTIPLE_DETAILS_FOR_MAP_OBJECT = 'RECEIVE_MULTIPLE_DETAILS_FOR_MAP_OBJECT';
export const REQUEST_PROFILE_BETWEEN_LATLNGS = 'REQUEST_PROFILE_BETWEEN_LATLNGS';
export const RECEIVE_PROFILE_BETWEEN_LATLNGS = 'RECEIVE_PROFILE_BETWEEN_LATLNGS';
export const CLEAR_MAP_RESULTS = 'CLEAR_MAP_RESULTS';
export const SET_DISTANCE_ON_PROFILE = 'SET_DISTANCE_ON_PROFILE';
export const SET_MAP_LOCATION = 'SET_MAP_LOCATION';
export const SET_NOTIFICATION_MESSAGE = 'SET_NOTIFICATION_MESSAGE';
export const TOGGLE_BACKGROUND_LAYERS = 'TOGGLE_BACKGROUND_LAYERS';
export const TOGGLE_PROFILE_TOOL = 'TOGGLE_PROFILE_TOOL';
export const TOGGLE_LEGENDS_AND_LAYERS_TOOL = 'TOGGLE_LEGENDS_AND_LAYERS_TOOL';
export const MAP_ZOOM_OUT = 'MAP_ZOOM_OUT';
export const MAP_ZOOM_IN = 'MAP_ZOOM_IN';


function requestSearch() {
  return {
    type: REQUEST_SEARCH,
  };
}

function receiveSearch(results, page) {
  return {
    type: RECEIVE_SEARCH,
    results,
    page,
  };
}

export function performSearch(string, page) {
  return dispatch => {
    dispatch(requestSearch());
    const lizardEndpoint = $.ajax({
      type: 'GET',
      xhrFields: {
        withCredentials: (window.HOST_IS_GITHUB) ? true : false,
      },
      url: `${window.BASE_URL}/api/v2/search/?q=${string}&page=${(page) ? page : 1}`,
      success: (data) => {
        return data;
      },
    });
    Promise.all([lizardEndpoint]).then(([results]) => {
      return dispatch(receiveSearch(results, page));
    });
  };
}




function requestGeocode() {
  return {
    type: REQUEST_GEOCODE,
  };
}

function receiveGeocode(results) {
  return {
    type: RECEIVE_GEOCODE,
    results,
  };
}

export function performGeocode(string) {
  return dispatch => {
    dispatch(requestGeocode());
    const googleGeocoderEndpoint = $.ajax({
      type: 'GET',
      url: `https://maps.googleapis.com/maps/api/geocode/json?bounds=50.292848766619365,1.8017578124999998%7C54.00131186464819,8.7286376953125&language=nl&address=${string}&language=nl`,
      success: (data) => {
        return data;
      },
    });
    Promise.all([googleGeocoderEndpoint]).then(([geocoderResults]) => {
      return dispatch(receiveGeocode(geocoderResults));
    });
  };
}


export function clearMapResults() {
  return {
    type: CLEAR_MAP_RESULTS,
  };
}

function requestDetailsForMapObject() {
  return {
    type: REQUEST_DETAILS_FOR_MAP_OBJECT,
  };
}

function receiveDetailsForMapObject(results) {
  return {
    type: RECEIVE_DETAILS_FOR_MAP_OBJECT,
    results,
  };
}

function receiveMultipleDetailsForMapObject(results) {
  return {
    type: RECEIVE_MULTIPLE_DETAILS_FOR_MAP_OBJECT,
    results,
  };
}

export function addToSelection(e) {
  // ADD MULTIPLE SELECTIONS
  return dispatch => {
    dispatch(requestDetailsForMapObject());
    const lizardEndpoint = $.ajax({
      type: 'GET',
      xhrFields: {
        withCredentials: (window.HOST_IS_GITHUB) ? true : false,
      },
      url: `${window.BASE_URL}/api/v2/${e.data.entity_name}s/${e.data.id}/`,
      success: (data) => {
        return data;
      },
    });
    Promise.all([lizardEndpoint]).then(([lizardResults]) => {
      lizardResults.entity_name = e.data.entity_name;
      return dispatch(receiveMultipleDetailsForMapObject(lizardResults, e.data.entity_name));
    });
  };
}

export function mapClick(e) {
  // SHOW SINGLE SELECTION
  return dispatch => {
    dispatch(requestDetailsForMapObject());
    const lizardEndpoint = $.ajax({
      type: 'GET',
      xhrFields: {
        withCredentials: (window.HOST_IS_GITHUB) ? true : false,
      },
      url: `${window.BASE_URL}/api/v2/${e.data.entity_name}s/${e.data.id}/`,
      success: (data) => {
        return data;
      },
    });
    Promise.all([lizardEndpoint]).then(([lizardResults]) => {
      lizardResults.entity_name = e.data.entity_name;
      return dispatch(receiveDetailsForMapObject(lizardResults, e.data.entity_name));
    });
  };
}


export function setMapLocation(location) {
  return {
    type: SET_MAP_LOCATION,
    location,
  };
}

export function toggleBackgroundLayers() {
  return {
    type: TOGGLE_BACKGROUND_LAYERS,
  };
}


export function toggleProfileTool() {
  return {
    type: TOGGLE_PROFILE_TOOL,
  };
}

export function handleNotification(message) {
  return {
    type: SET_NOTIFICATION_MESSAGE,
    message,
  };
}



export function mapZoomIn() {
  return {
    type: MAP_ZOOM_IN,
  };
}

export function mapZoomOut() {
  return {
    type: MAP_ZOOM_OUT,
  };
}



function requestProfileBetweenLatlngs() {
  return {
    type: REQUEST_PROFILE_BETWEEN_LATLNGS,
  };
}

function receiveProfileBetweenLatlngs(profile, latlngs) {
  return {
    type: RECEIVE_PROFILE_BETWEEN_LATLNGS,
    profile: profile.data,
    receivedAt: Date.now(),
    latlngs,
  };
}

export function getProfileBetweenLatlngs(latlngs) {
  return dispatch => {
    dispatch(requestProfileBetweenLatlngs());
    const lizardEndpoint = $.ajax({
      type: 'GET',
      xhrFields: {
        withCredentials: (window.HOST_IS_GITHUB) ? true : false,
      },
      url: `${window.BASE_URL}/api/v2/raster-aggregates/?agg=curve&geom=LINESTRING+(${latlngs[0][1]}+${latlngs[0][0]},+${latlngs[1][1]}+${latlngs[1][0]})&rasters=1d65a4e&srs=EPSG:4326&start=2011-12-04T21:51:33&stop=2016-11-06T23:51:33&window=360`,
      success: (data) => {
        return data;
      },
    });
    Promise.all([lizardEndpoint]).then(([lizardResults]) => {
      return dispatch(receiveProfileBetweenLatlngs(lizardResults, latlngs));
    });
  };
}

export function setDistanceOnProfile(distance, receivedAt) {
  return {
    type: SET_DISTANCE_ON_PROFILE,
    distance,
    receivedAt,
  };
}




export function toggleLayersAndLegendsTool() {
  return {
    type: TOGGLE_LEGENDS_AND_LAYERS_TOOL,
  };
}


function requestAvailableMapLayers() {
  return {
    type: REQUEST_AVAILABLE_MAP_LAYERS,
  };
}

function receiveAvailableMapLayers(results) {
  return {
    type: RECEIVE_AVAILABLE_MAP_LAYERS,
    results,
  };
}

function shouldFetchMapLayers(state) {
  if (state.map.availableMapLayers.length > 0) {
    return false;
  }
  return true;
}

export function loadAvailableMapLayers() {
  return (dispatch, getState) => {
    if (shouldFetchMapLayers(getState())) {
      dispatch(requestAvailableMapLayers());
      const endpoint = $.ajax({
        type: 'GET',
        xhrFields: {
          withCredentials: (window.HOST_IS_GITHUB) ? true : false,
        },
        url: `${window.BASE_URL}/api/v2/search/?exclude=b1d7f43,d58e5d1,b552fa1&page_size=0&type=assetgroup,eventseries,wmslayer,rasterstore,scenario`,
        success: (data) => {
          return data;
        },
      });
      Promise.all([endpoint]).then(([results]) => {
        return dispatch(receiveAvailableMapLayers(results));
      });
    }
  };
}


export function performGeoLocation() {
  return (dispatch, getState) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const crd = pos.coords;
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
        dispatch(setMapLocation({
          lat: crd.latitude,
          lng: crd.longitude,
          zoom: 20,
        }));
      }, (err) => {
        dispatch(handleNotification('Locatiebepaling mislukt'));
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    }
    else {
      dispatch(handleNotification('Locatiebepaling mislukt'));
    }
  };
}
