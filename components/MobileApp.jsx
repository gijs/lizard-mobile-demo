// @flow
import { connect } from 'react-redux';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import MapComponent from './MapComponent.jsx';
import MapWidgets from './MapWidgets.jsx';
import MobileOmnibox from './MobileOmnibox.jsx';
import TopMenu from './TopMenu.jsx';
import Snackbar from 'material-ui/Snackbar';
import React, { Component, PropTypes } from 'react';
import $ from 'jquery';


import {
  clearMapResults,
  handleNotification,
} from '../actions.jsx';



class MobileApp extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleKeydown = this.handleKeydown.bind(this);
  }


  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown, false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.props.dispatch(clearMapResults());
    }
  }

  render() {
    // console.log('this.props.params.uuid', this.props.params.uuid);
    const snackbarOpen = (this.props.notifications.message) ? true : false;
    return (
      <div>
        <TopMenu {...this.props} />
        <MobileOmnibox {...this.props} />
        <MapComponent {...this.props} />
        <Snackbar
          open={snackbarOpen}
          message={this.props.notifications.message || '...'}
          action='OK'
          autoHideDuration={4000}
          onActionTouchTap={this.handleActionTouchTap}
          onRequestClose={() => this.props.dispatch(handleNotification(undefined))}
        />
      </div>
    );
  }
}

MobileApp.propTypes = {};

function mapStateToProps(state) {
  // This function maps the Redux state to React Props.
  return {
    'geocoder': state.geocoder,
    'assets': state.assets,
    'map': state.map,
    'notifications': state.notifications,
  };
}

export default connect(mapStateToProps)(MobileApp);
