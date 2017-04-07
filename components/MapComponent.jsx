// @flow
import { Map, TileLayer, Polyline, LayerGroup, Circle } from 'react-leaflet';
import pointAlongLine from '../lib/PointOnLine.jsx';
import styles from './MapComponent.css';
import L from 'leaflet';
import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import geojsonvt from 'geojson-vt';
import GeoJsonUpdatable from '../lib/GeoJsonUpdatable.jsx';
import leafletGeometryutil from 'leaflet-geometryutil';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import GeolocateIcon from 'material-ui/svg-icons/maps/near-me';

import {
  mapClick,
  addToSelection,
  clearMapResults,
  handleNotification,
  toggleBackgroundLayers,
  getProfileBetweenLatlngs,
  performGeoLocation,
} from '../actions.jsx';


class MapComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      autoHideDuration: 4000,
      multiselect: false,
      mapclicked: 1,
      fromCoordinates: undefined,
      toCoordinates: undefined,
    };
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
    this._handleMapClick = this._handleMapClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown, false);
    document.addEventListener('keyup', this.handleKeyup, false);
    L.control.scale({ position: 'bottomleft' })
      .addTo(this.refs.map.leafletElement);
    const self = this;
    const map = self.refs.map.leafletElement;
    window.map = self.refs.map.leafletElement;
    $(document).ready(() => {
      const utfgrid = L.utfGrid(`${window.BASE_URL}/api/v2/tiles/9c2d7b6/{z}/{x}/{y}.grid`, {
        resolution: 4,
        pointerCursor: true,
        mouseInterval: 66,  // Delay for mousemove events
      });
      utfgrid.addTo(this.refs.map.leafletElement);

      utfgrid.on('mouseover', () => {
          // console.log('------->', e);
      });
      utfgrid.on('mouseout', () => {
          // console.log('------->', e);
      });
      utfgrid.on('click', (e) => {
        if (self.props.map.profileToolActive === false) {
          if (e.data) {
            if (self.state.multiselect) {
              self.props.dispatch(addToSelection(e));
              // ^^ TODO: setView to the envelope of the selection?
            }
            else {
              map.setView(e.latlng, map.getZoom());
              self.props.dispatch(mapClick(e));
            }
          }
          else {
            self.props.dispatch(clearMapResults());
          }
        }
      });
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  // }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown, false);
    document.removeEventListener('keyup', this.handleKeyup, false);
  }

  _handleMapClick(e) {
    const map = this.refs.map.leafletElement;
    if (this.props.map.profileToolActive) {
      // use this http://turfjs.org/examples/turf-distance/
      if (this.state.mapclicked === 1) {
        // 1st click
        this.props.dispatch(
          handleNotification('Klik nogmaals om een profiel te tekenen')
        );
        this.setState({ mapclicked: 2, fromCoordinates: e.latlng });
        return;
      }
      if (this.state.mapclicked === 2) {
        // 2nd click
        this.setState({ mapclicked: 1, toCoordinates: e.latlng }, () => {
          const latlngs = [
              [this.state.fromCoordinates.lat, this.state.fromCoordinates.lng],
              [this.state.toCoordinates.lat, this.state.toCoordinates.lng],
          ];
          this.props.dispatch(getProfileBetweenLatlngs(latlngs));
        });
        return;
      }
    }
  }

  handleKeydown(e) {
    if (e.keyCode === 66) { // b down
      this.props.dispatch(toggleBackgroundLayers());
    }
    if (e.keyCode === 16) { // shift down
      this.setState({
        multiselect: true,
      });
      this.props.dispatch(handleNotification('Multiselect aan'));
    }
  }

  handleKeyup(e) {
    if (e.keyCode === 16) { // shift up
      this.setState({
        multiselect: false,
      });
      this.props.dispatch(handleNotification('Multiselect uit'));
    }
  }

  componentWillReceiveProps(newProps) {}


  render() {

    let initialLocation;
    if (this.props.map.location.lat && this.props.map.location.lng) {
      initialLocation = {
        lat: this.props.map.location.lat,
        lng: this.props.map.location.lng,
        zoom: this.props.map.location.zoom,
      };
    }

    const position = [initialLocation.lat, initialLocation.lng];
    const backgroundLayerData = this.props.map.backgroundLayers[
      this.props.map.activeBackgroundLayer
    ];

    const backgroundLayer = <TileLayer
                attribution={backgroundLayerData.attribution}
                url={backgroundLayerData.url} />;


    const profiles = this.props.map.profiles.map((profile, i) => {
      return (
        <LayerGroup key={i}>
          <Polyline
            className={`leaflet-interactive ${profile.receivedAt}`}
            positions={profile.latlngs}
            color={'red'}
          />
        </LayerGroup>
      );
    });

    return (
      <div>
        <Map center={position}
             preferCanvas={true}
             animate={true}
             onClick={this._handleMapClick}
             style={{
               cursor: (this.props.map.profileToolActive) ?
                'crosshair' : 'pointer',
             }}
             onZoomEnd={(e) => {
               this.props.dispatch(
                 handleNotification(`Huidig zoomlevel: ${e.target._zoom}`)
               );
             }}
             zoomAnimation={true}
             zoomControl={false}
             trackResize={true}
             ref='map'
             id='map'
             zoom={initialLocation.zoom}
             className={styles.Map}>

          {backgroundLayer}

          <TileLayer
            attribution='Nelen &amp; Schuurmans'
            url={`${window.BASE_URL}/api/v2/tiles/9c2d7b6/{z}/{x}/{y}.png`}
          />

          {(this.props.assets.results) ? this.props.assets.results.map((asset, i) => {
            const geojsonMarkerOptions = {
                radius: 8,
                fillColor: 'none',
                color: '#C65B4D',
                weight: 5,
                opacity: 1,
            };
            return <GeoJsonUpdatable
                      key={i}
                      data={asset.geometry}
                      pointToLayer={(feature, latlng) => {
                        return L.circleMarker(latlng, geojsonMarkerOptions);
                      }}
                      style={(feature) => {
                        return {
                          color: '#C65B4D',
                          fillColor: 'none',
                          weight: 5,
                          opacity: 1,
                        };
                      }}
                   />;
          }) : ''}

          {profiles}
        </Map>
      </div>
    );
  }
}

MapComponent.propTypes = {};

export default MapComponent;
