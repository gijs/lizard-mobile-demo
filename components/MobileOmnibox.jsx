// @flow
import styles from './MobileOmnibox.css';
import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import { geoMercator } from 'd3-geo';
import $ from 'jquery';
import _ from 'lodash';
import L from 'leaflet';
import along from 'turf-along';
import BackgroundLayerToggler from './BackgroundLayerToggler.jsx';
import TimeseriesCarousel from './TimeseriesCarousel.jsx';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import TerrainIcon from 'material-ui/svg-icons/maps/terrain';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';
import PlaceIcon from 'material-ui/svg-icons/maps/place';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import {AreaChart, Area, Brush, LineChart, BarChart, Line, Bar, XAxis, YAxis,
        CartesianGrid, Tooltip, Legend} from 'recharts';
import median from 'simple-statistics';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import GeolocateIcon from 'material-ui/svg-icons/maps/near-me';
import DateRangeIcon from 'material-ui/svg-icons/action/date-range';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { VelocityTransitionGroup, VelocityComponent, velocityHelpers } from 'velocity-react';

const ENTITY_NAMES = {
  'bridge': 'Brug',
  'groundwaterstation': 'Grondwaterstation',
  'manhole': 'Put',
  'measuringstation': 'Meetstation',
  'monitoringwell': 'Meetput',
  'overflow': 'Overstort',
  'pipe': 'Leiding',
  'orifice': 'Uitlaat',
  'sluice': 'Sluis',
  'levee': 'Dijk',
  'culvert': 'Doorlaat',
  'pressurepipe': 'Drukleiding',
  'pumpeddrainagearea': 'Regenwaterleiding',
  'pumpstation': 'Gemaal',
  'wastewatertreatmentplant': 'RWZI',
  'weir': 'Stuw',
};

import {
  performGeocode,
  setDistanceOnProfile,
  setMapLocation,
  performGeoLocation,
  toggleBackgroundLayers,
} from '../actions.jsx';

let myLayer = undefined;

const geojsonMarkerOptions = {
    radius: 8,
    fillColor: 'none',
    color: '#C65B4D',
    weight: 5,
    opacity: 1,
};
let svg, circle, g;


class MobileOmnibox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      tabindex: 1,
    };
    this._handleSearchInput = this._handleSearchInput.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this._setQuery = _.debounce(this._setQuery, 500);
    this._handleMouseOverProfile = this._handleMouseOverProfile.bind(this);
    this._handleMouseOutProfile = this._handleMouseOutProfile.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown, false);

    $(document).ready(() => {
      myLayer = L.geoJson(null, {
       pointToLayer: (feature, latlng) => {
         return L.circleMarker(latlng, geojsonMarkerOptions);
       },
     }).addTo(window.map);

     svg = d3.select(window.map.getPanes().overlayPane).append('svg'),
       g = svg.append('g').attr('class', 'leaflet-zoom-hide');
     svg.style('width', '100%');
     svg.style('height', '100%');

     circle = g.append('circle')
       .style('opacity', 0)
       .style('fill', 'red')
       .attr('r', 7);
   });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown, false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  _handleMouseOutProfile(e, profile) {
    circle.style('opacity', 0);
  }

  _handleMouseOverProfile(e, profile) {
    // try {
    const distance = e.activePayload[0].payload.distance;
    const fromLatlng = profile.latlngs[0];
    const toLatlng = profile.latlngs[1];

    const line = {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [fromLatlng[0], fromLatlng[1]],
          [toLatlng[0], toLatlng[1]],
        ],
      },
    };

    const indicator = along(line, distance / 1000, 'kilometers');

    circle.style('opacity', 1);
    circle.style(
      'transform',
      `translate(
        ${window.map.latLngToLayerPoint(
          L.latLng(indicator.geometry.coordinates)).x}px,
        ${window.map.latLngToLayerPoint(
          L.latLng(indicator.geometry.coordinates)).y}px)`
    );

    // catch(e) {}

    //
    // try {
    //   this.props.dispatch(
    //     setDistanceOnProfile(
    //       e.activePayload[0].payload.distance,
    //       profile.receivedAt
    //     )
    //   );
    // } catch(e) {}
  }

  handleKeydown(e) {
    if (e.keyCode === 83 && e.ctrlKey) {
      e.preventDefault();
      document.getElementById('q').focus();
    }
    // if (e.key === 's') {
    //   e.preventDefault();
    //   document.getElementById('q').focus();
    // }
    if (e.key === 'ArrowUp') {
      this.setState({tabindex: this.state.tabindex - 1}, () => {
        $('[tabindex=' + (parseInt($(e.target).attr('tabindex')) + this.state.tabindex) + ']').focus();
      });
      console.log('go up through results');
    }
    if (e.key === 'ArrowDown') {
      this.setState({tabindex: this.state.tabindex + 1}, () => {
        $('[tabindex=' + (parseInt($(e.target).attr('tabindex')) + this.state.tabindex) + ']').focus();
      });
      console.log('go down through results');
    }
  }


  _setQuery(value) {
    this.props.dispatch(performGeocode(value));
  }

  _handleSearchInput(e) {
    const value = this.refs.q.input.value;
    this.setState({ value }, () => {
      this._setQuery(value);
    });
  }

  render() {

    const geocoderResults = (this.props.geocoder.isFetching) ? '' :
      (this.props.geocoder.results.results) ? this.props.geocoder.results.results.map((result, i) => {
        const ti = i + 1;
        return <ListItem
          id='listitem'
          key={i}
          tabIndex={ti}
          leftIcon={<PlaceIcon  />}
          onClick={() =>
            this.props.dispatch(setMapLocation(result.geometry.location))
          }
          primaryText={`${result.formatted_address}`}
        />;
      }) : '';

    const assetResults = (this.props.assets.isFetching) ? '' :
      (this.props.assets.results.length > 0) ? this.props.assets.results.map((result, i) => {
        return <Card key={i}
                     expanded={this.state.expanded}
                     onExpandChange={this.handleExpandChange}>
            <CardHeader
              title={ENTITY_NAMES[result.entity_name] || '...'}
              subtitle={result.category}
              avatar={
                <span style={{ color: '#E34E42' }}
                      className='lz lz-pumpstation-diesel'>
                </span>
              }
              actAsExpander={true}
              showExpandableButton={true}
            />

            <CardText expandable={true}>
              <Table>
                <TableBody displayRowCheckbox={false}>
                  <TableRow>
                    <TableRowColumn>Naam</TableRowColumn>
                    <TableRowColumn>{result.name}</TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>Categorie</TableRowColumn>
                    <TableRowColumn>{result.category}</TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>Frequentie</TableRowColumn>
                    <TableRowColumn>{result.frequency}</TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn>Code</TableRowColumn>
                    <TableRowColumn>{result.code}</TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
            </CardText>
            <CardText expandable={true}>
              <TimeseriesCarousel data={result.timeseries} {...this.props} />
            </CardText>
            <CardActions>
              <FlatButton
                label='Zoom naartoe'
                onClick={() => this.props.dispatch(setMapLocation({
                  lat: result.geometry.coordinates[1],
                  lng: result.geometry.coordinates[0]
                }))}
                onTouchTap={this.handleExpand} />
            </CardActions>
          </Card>;
      }) : '';

      const profiles = this.props.map.profiles.map((profile, i) => {
        return <Card
                key={i}
                initiallyExpanded={true}
                expanded={this.state.expanded}
                onExpandChange={this.handleExpandChange}>
            <CardHeader
              title={'Hoogte'}
              subtitle={`Hoogteprofiel over ${parseInt(profile.profile[profile.profile.length-1].distance)} meter`}
              avatar={<TerrainIcon />}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
              <AreaChart
                width={390}
                height={150}
                data={profile.profile}
                onMouseLeave={(e) => this._handleMouseOutProfile(e, profile)}
                onMouseMove={(e) => this._handleMouseOverProfile(e, profile)}
                margin={{top: 2, right: 5, left: -30, bottom: 2}}>
                <XAxis
                  tickFormatter={(tick) => {
                    return parseInt(tick);
                  }}
                  dataKey='distance' />
                <YAxis
                  tickFormatter={(tick) => {
                    return parseInt(tick);
                  }}
                  dataKey='height' />
                <Tooltip
                  offset={20}
                  formatter={(label) => {
                    return `${parseInt(label)} m.`;
                  }}
                  labelFormatter={(tick) => {
                    const distance = parseInt(tick);
                    let formattedDistance;
                    if (distance < 1000) {
                      formattedDistance = `${distance} meter`;
                    }
                    else {
                      formattedDistance = `${(distance / 1000).toFixed(1)} kilometer`;
                    }
                    return formattedDistance;
                  }}
                />
                <Area isAnimationActive={false}
                      type='monotone'
                      dataKey='height'
                      stroke='#82ca9d'
                      fill='#82ca9d' />
                <Brush dataKey='height' height={30} stroke='#82ca9d'/>
              </AreaChart>
            </CardText>
            </Card>
      });

    return (
      <div>
        <VelocityComponent
          animation={{
            bottom: (this.state.value || this.props.map.profiles.length > 0 || this.props.assets.results.length > 0) ?
              220 :
              25,
          }}
          duration={250}>
          <FloatingActionButton
            style={{
              position: 'absolute',
              bottom: 220,
              right: 10,
            }}
            onClick={() => this.props.dispatch(performGeoLocation())}
            primary={true}>
            <DateRangeIcon />
          </FloatingActionButton>
        </VelocityComponent>
        <VelocityComponent
          animation={{
            bottom: (this.state.value || this.props.map.profiles.length > 0 || this.props.assets.results.length > 0) ?
              155 :
              25,
          }}
          duration={250}>
          <FloatingActionButton
            style={{
              position: 'absolute',
              bottom: 25,
              right: 10,
            }}
            onClick={() => this.props.dispatch(performGeoLocation())}
            secondary={true}>
            <GeolocateIcon />
          </FloatingActionButton>
        </VelocityComponent>
        <VelocityComponent
          animation={{
            bottom: (this.state.value || this.props.map.profiles.length > 0 || this.props.assets.results.length > 0) ? 0 : -600,
          }}
          duration={250}>
          <div
            style={{
              backgroundColor: (this.state.value || this.props.map.profiles.length > 0 || this.props.assets.results.length > 0) ? '#fff' : '',
              boxShadow: (this.state.value || this.props.map.profiles.length > 0 || this.props.assets.results.length > 0) ? '0 0 20px rgba(0,0,0,0.3)' : '',
            }}
            className={styles.MobileOmnibox}
            id='MobileOmnibox'>
            <List style={{}}>{geocoderResults}</List>
            {assetResults}
            {profiles}
          </div>
        </VelocityComponent>

      </div>
    );
  }
}

MobileOmnibox.propTypes = {};

export default MobileOmnibox;
