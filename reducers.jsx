import _ from 'lodash';
import { combineReducers } from 'redux';
// import undoable, { distinctState } from 'redux-undo';
import {
  REQUEST_GEOCODE,
  RECEIVE_GEOCODE,
  REQUEST_SEARCH,
  RECEIVE_SEARCH,
  REQUEST_DETAILS_FOR_MAP_OBJECT,
  RECEIVE_DETAILS_FOR_MAP_OBJECT,
  RECEIVE_MULTIPLE_DETAILS_FOR_MAP_OBJECT,
  REQUEST_PROFILE_BETWEEN_LATLNGS,
  RECEIVE_PROFILE_BETWEEN_LATLNGS,
  REQUEST_AVAILABLE_MAP_LAYERS,
  RECEIVE_AVAILABLE_MAP_LAYERS,
  CLEAR_MAP_RESULTS,
  SET_DISTANCE_ON_PROFILE,
  SET_MAP_LOCATION,
  SET_NOTIFICATION_MESSAGE,
  TOGGLE_LEGENDS_AND_LAYERS_TOOL,
  TOGGLE_BACKGROUND_LAYERS,
  TOGGLE_PROFILE_TOOL,
  MAP_ZOOM_IN,
  MAP_ZOOM_OUT,
} from './actions.jsx';


function notifications(state = {
  message: '',
}, action) {
  // console.log('reducer reports() was called with state', state, 'and action', action);
  switch (action.type) {
  case SET_NOTIFICATION_MESSAGE:
    return Object.assign({}, state, {
      message: action.message,
    });
  default:
    return state;
  }
}


function map(state = {
  isFetching: false,
  layerMenuActive: false,
  profileToolActive: false,
  activeBackgroundLayer: 0,
  backgroundLayers: [
    {
      name: 'Topo',
      attribution: 'Mapbox',
      url: 'https://{s}.tiles.mapbox.com/v3/nelenschuurmans.iaa98k8k/{z}/{x}/{y}.png',
      staticMapBaseUrl: 'https://api.mapbox.com/v4/nelenschuurmans.iaa98k8k/',
    },
    {
      name: 'Grey',
      attribution: 'Mapbox',
      url: 'https://{s}.tiles.mapbox.com/v3/nelenschuurmans.l15e647c/{z}/{x}/{y}.png',
      staticMapBaseUrl: 'https://api.mapbox.com/v4/nelenschuurmans.l15e647c/',
    },
    {
      name: 'Satellite',
      attribution: 'Mapbox',
      url: 'https://{s}.tiles.mapbox.com/v3/nelenschuurmans.iaa79205/{z}/{x}/{y}.png',
      staticMapBaseUrl: 'https://api.mapbox.com/v4/nelenschuurmans.iaa79205/',
    },
  ],
  availableMapLayers: [],
  location: {
    lat: 52.0741,
    lng: 5.3032,
    zoom: 8,
  },
  profiles: [],
}, action) {
  // console.log('reducer reports() was called with state', state, 'and action', action);
  switch (action.type) {
  case REQUEST_AVAILABLE_MAP_LAYERS:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_AVAILABLE_MAP_LAYERS:
    // Here, merge with existing ones
    return Object.assign({}, state, {
      isFetching: false,
      availableMapLayers: action.results,
    });
  case SET_DISTANCE_ON_PROFILE:
    return Object.assign({}, state, {
      profiles: state.profiles.map((profile) => {
        if (profile.receivedAt === action.receivedAt) {
          profile.distance = action.distance;
          return profile;
        }
        else {
          return profile;
        }
      }),
    });
  case REQUEST_PROFILE_BETWEEN_LATLNGS:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_PROFILE_BETWEEN_LATLNGS:
    const transformedArray = action.profile.map((profile) => {
      return {
        'distance': profile[0],
        'height': profile[1],
      };
    });
    const profileObject = {
      profile: transformedArray,
      receivedAt: action.receivedAt,
      latlngs: action.latlngs,
    };
    return Object.assign({}, state, {
      profiles: [
        ...state.profiles, profileObject,
      ],
    });
  case MAP_ZOOM_IN:
    return Object.assign({}, state, {
      location: Object.assign({}, state.location, {
        lat: state.location.lat,
        lng: state.location.lng,
        zoom: state.location.zoom + 1,
      }),
    });
  case MAP_ZOOM_OUT:
    return Object.assign({}, state, {
      location: Object.assign({}, state.location, {
        lat: state.location.lat,
        lng: state.location.lng,
        zoom: state.location.zoom - 1,
      }),
    });
  case TOGGLE_LEGENDS_AND_LAYERS_TOOL:
    return Object.assign({}, state, {
      layerMenuActive: !state.layerMenuActive,
    });
  case TOGGLE_PROFILE_TOOL:
    return Object.assign({}, state, {
      profileToolActive: !state.profileToolActive,
    });
  case TOGGLE_BACKGROUND_LAYERS:
    return Object.assign({}, state, {
      activeBackgroundLayer: (state.activeBackgroundLayer < state.backgroundLayers.length - 1) ? state.activeBackgroundLayer + 1 : 0,
    });
  case SET_MAP_LOCATION:
    return Object.assign({}, state, {
      location: {
        lat: action.location.lat,
        lng: action.location.lng,
        zoom: 13,
      },
    });
  default:
    return state;
  }
}

function search(state = {
  isFetching: false,
  results: [],
}, action) {
  // console.log('reducer reports() was called with state', state, 'and action', action);
  switch (action.type) {
  case REQUEST_SEARCH:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_SEARCH:
    return Object.assign({}, state, {
      isFetching: false,
      results: action.results,
      page: action.page,
    });
  default:
    return state;
  }
}

function geocoder(state = {
  isFetching: false,
  results: [],
}, action) {
  // console.log('reducer reports() was called with state', state, 'and action', action);
  switch (action.type) {
  case REQUEST_GEOCODE:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_GEOCODE:
    return Object.assign({}, state, {
      isFetching: false,
      results: action.results,
    });
  default:
    return state;
  }
}

function assets(state = {
  isFetching: false,
  results: [],
}, action) {
  // console.log('reducer reports() was called with state', state, 'and action', action);
  switch (action.type) {
  case CLEAR_MAP_RESULTS:
    return Object.assign({}, state, {
      results: [],
    });
  case REQUEST_DETAILS_FOR_MAP_OBJECT:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_DETAILS_FOR_MAP_OBJECT:
    return Object.assign({}, state, {
      isFetching: false,
      results: [action.results],
    });
  case RECEIVE_MULTIPLE_DETAILS_FOR_MAP_OBJECT:
    const isDupe = _.find(state.results, (o) => {
      return o.id === action.results.id;
    });
    if (isDupe) {
      return Object.assign({}, state, {
        isFetching: false,
        results: [
          ...state.results,
        ],
      });
    }
    return Object.assign({}, state, {
      isFetching: false,
      results: [
        ...state.results,
        action.results,
      ],
    });
  default:
    return state;
  }
}


const rootReducer = combineReducers({
  geocoder,
  assets,
  map,
  search,
  notifications,
});

export default rootReducer;
