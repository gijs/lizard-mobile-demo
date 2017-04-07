// @flow
import styles from './MapWidgets.css';
import FlatButton from 'material-ui/FlatButton';
import React, { Component, PropTypes } from 'react';
import TerrainIcon from 'material-ui/svg-icons/maps/terrain';
import LayersIcon from 'material-ui/svg-icons/maps/layers';
import MyLocationIcon from 'material-ui/svg-icons/maps/my-location';
import TimeIcon from 'material-ui/svg-icons/device/access-time';
import UpIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import LegendsAndLayers from './LegendsAndLayers.jsx';
import $ from 'jquery';
import _ from 'lodash';

import {
  handleNotification,
  loadAvailableMapLayers,
  mapZoomIn,
  mapZoomOut,
  performGeoLocation,
  toggleLayersAndLegendsTool,
  toggleProfileTool,
} from '../actions.jsx';


class MapWidgets extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillUnmount() {}

  componentWillReceiveProps(newProps) {}

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) ||
      !_.isEqual(this.state, nextState);
  }

  render() {
    return (
        <div className={styles.MapWidgets}>
          {this.props.map.layerMenuActive ?
            <LegendsAndLayers {...this.props }/> : ''}

          <div
            className={styles.MapWidgetsIconContainer}
            style={{
              padding: '7px 10px 10px 10px',
              borderRight: '1px solid #f5f5f5' }}>
            <TerrainIcon
              onClick={() => this.props.dispatch(toggleProfileTool())}
              style={{
                color: (this.props.map.profileToolActive) ?
                  '#FBBE40' : '#CCCCCC',
                cursor: 'pointer',
              }} />
          </div>
          <div
            className={styles.MapWidgetsIconContainer}
            style={{
              padding: '7px 10px 10px 10px',
              borderRight: '1px solid #f5f5f5' }}>
            <MyLocationIcon
              onClick={() => this.props.dispatch(performGeoLocation())}
              style={{
                color: '#CCCCCC',
                cursor: 'pointer',
              }} />
          </div>
          <div
            className={styles.MapWidgetsIconContainer}
            style={{
              padding: '7px 10px 10px 10px',
              borderRight: '1px solid #f5f5f5' }}>
            <LayersIcon
              onClick={() => this.props.dispatch(toggleLayersAndLegendsTool())}
              style={{
                color: (this.props.map.layerMenuActive) ?
                  '#FBBE40' : '#CCCCCC',
                cursor: 'pointer'
              }} />
          </div>
          <div
            className={styles.MapWidgetsIconContainer}
            style={{ padding: '7px 5px 10px 5px' }}>
            <UpIcon
              onClick={() => console.log('open/close timeline')}
              style={{
                color: '#CCCCCC',
                cursor: 'pointer',
              }} />
          </div>
          <div className={styles.ZoomButtons}>
            <div
              onClick={() => {
                this.props.dispatch(mapZoomIn());
              }}
              className={styles.ZoomIn}>
              +
            </div>
            <div
              onClick={() => {
                this.props.dispatch(mapZoomOut());
              }}
              className={styles.ZoomOut}>
              -
            </div>
          </div>
        </div>
    );
  }
}

MapWidgets.propTypes = {};

export default MapWidgets;
