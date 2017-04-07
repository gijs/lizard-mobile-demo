// @flow
// import styles from './BackgroundLayerToggler.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { VelocityTransitionGroup, VelocityComponent, velocityHelpers }
from 'velocity-react';

import React, { Component, PropTypes } from 'react';

import {
  toggleBackgroundLayers,
} from '../actions.jsx';

class BackgroundLayerToggler extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  render() {
    const backgroundLayerData = this.props.map.backgroundLayers[
      this.props.map.activeBackgroundLayer
    ];

    return (
      <VelocityComponent
        animation={{
          left: (this.props.value ||
                this.props.map.profiles.length > 0 ||
                this.props.assets.results.length > 0) ? 440 : 10,
          bottom: (this.props.value ||
                   this.props.map.profiles.length > 0 ||
                   this.props.assets.results.length > 0) ? 20 : 50,
        }}
        duration={250}>
        <div
          onClick={
            () => this.props.dispatch(toggleBackgroundLayers())
          }
          style={{
          position: 'absolute',
          left: 440,
          height: 100,
          width: 100,
          bottom: 50,
          cursor: 'pointer',
          backgroundImage: `url("${backgroundLayerData.staticMapBaseUrl}${this.props.map.location ? this.props.map.location.lng : 52.0741},${this.props.map.location ? this.props.map.location.lat : 5.3032},8/100x100.png?access_token=pk.eyJ1IjoibmVsZW5zY2h1dXJtYW5zIiwiYSI6ImhkXzhTdXcifQ.3k2-KAxQdyl5bILh_FioCw")`,
          boxShadow: '0 0 20px rgba(0,0,0,0.3)',
          border: '2px solid black' }}>
        </div>
      </VelocityComponent>
    );
  }
}

BackgroundLayerToggler.propTypes = {};

export default BackgroundLayerToggler;
