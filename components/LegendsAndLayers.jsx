// @flow
import styles from './LegendsAndLayers.css';
import React, { Component, PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { VelocityTransitionGroup, VelocityComponent, velocityHelpers } from 'velocity-react';
import ActionInfo from 'material-ui/svg-icons/action/info';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {List, ListItem} from 'material-ui/List';
import $ from 'jquery';
import _ from 'lodash';

import {
  loadAvailableMapLayers,
} from '../actions.jsx';


class LegendsAndLayers extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch(loadAvailableMapLayers());
  }

  render() {
    return (
      <VelocityComponent
        animation={{
          bottom: (this.props.map.layerMenuActive) ? 50 : 0,
        }}
        duration={250}>
        <div className={styles.LegendsAndLayers}>
          {/* <AutoComplete
            fullWidth={true}
            floatingLabelText='Begin te typen...'
            filter={AutoComplete.fuzzyFilter}
            dataSource={this.props.map.availableMapLayers.map((l) => l.title)}
            maxSearchResults={5}
          /> */}

          <List>
            {this.props.map.isFetching ?
              <RefreshIndicator
                size={40}
                left={140}
                top={90}
                status='loading'
              /> : ''}
            {this.props.map.availableMapLayers.map((layer, i) => {
              return (
                <ListItem
                  key={i}
                  primaryText={layer.title} />
              );
            })}
          </List>
        </div>
      </VelocityComponent>
    );
  }
}

LegendsAndLayers.propTypes = {};

export default LegendsAndLayers;
