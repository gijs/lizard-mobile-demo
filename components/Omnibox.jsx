// @flow
import styles from './Omnibox.css';
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
import IconButton from 'material-ui/IconButton';
import TerrainIcon from 'material-ui/svg-icons/maps/terrain';
import ShareIcon from 'material-ui/svg-icons/social/share';
import ToggleStarIcon from 'material-ui/svg-icons/toggle/star-border';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';
import PlaceIcon from 'material-ui/svg-icons/maps/place';
import ZoomInIcon from 'material-ui/svg-icons/action/zoom-in';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import {AreaChart, Area, Brush, LineChart, BarChart, Line, Bar, XAxis, YAxis,
        CartesianGrid, Tooltip, Legend} from 'recharts';
import median from 'simple-statistics';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { VelocityTransitionGroup, VelocityComponent, velocityHelpers } from 'velocity-react';
import ENTITY_NAMES from './EntityLookup.jsx';

import {
  performGeocode,
  performSearch,
  setDistanceOnProfile,
  setMapLocation,
  mapClick,
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


class Omnibox extends Component {

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
    this.props.dispatch(performSearch(value));
  }

  _handleSearchInput(e) {
    const value = this.refs.q.input.value;
    this.setState({ value }, () => {
      this._setQuery(value);
    });
  }

  render() {

    const totalresults = (this.props.search.results) ?
      parseInt(this.props.search.results.count / 10) : 0;

    const searchResults = (
      <div>
        {(this.props.search.isFetching) ?
          <LinearProgress mode='indeterminate' />
        :
        (this.props.search.results.results) ?
          this.props.search.results.results.map((result, i) => {
            const ti = i + 1;
            return (
              <ListItem
                id='listitem'
                key={i}
                tabIndex={ti}
                leftAvatar={
                  <Avatar
                    size={30}
                    style={{margin:'5px 0 0 0'}}>
                    <i className={`lz lz-${result.entity_name}`}></i>
                  </Avatar>
                }
                onClick={() => {
                  this.props.dispatch(setMapLocation({
                    lat: result.view[0],
                    lng: result.view[1],
                    zoom: result.view[2],
                  }));
                  this.props.dispatch(mapClick({
                    'data': {
                      'entity_name': `${result.entity_name}`,
                      'id': result.entity_id,
                    }})
                  );
                }}
                primaryText={`${result.title}`}
              />
            );
          }) : ''}
        <div style={{ margin: 10, width: 390, textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {_.range(1, totalresults + 1).map((r, i) => {
            return (
              <span key={i} style={{ overflowY: 'hidden' }}>
                <a
                  onClick={(e) => this.props.dispatch(
                    performSearch(this.state.value, i))}
                  style={{
                    cursor: 'pointer',
                    textDecoration: (this.props.search.page === i) ? 'underline' : '',
                  }}>{r}</a>&nbsp;
              </span>
            );
          })}
        </div>
      </div>
    );

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
        let computedTitle = '';
        try {
          computedTitle = result.name || result.code;
        }
        catch(e) {}
        return <Card key={i}
                     expanded={this.state.expanded}
                     onExpandChange={this.handleExpandChange}>
            <CardHeader
              title={computedTitle}
              subtitle={result.category}
              avatar={
                <span style={{ color: '#E34E42' }}
                      className={`lz lz-${result.entity_name}`}>
                </span>
              }
              actAsExpander={true}
              showExpandableButton={true}
            />
            {/* <CardMedia
              expandable={true}
              overlay={<CardTitle title={result.name || '...'} subtitle='Gemaal' />}
            >
              <img src='images/nature-600-337.jpg' />
            </CardMedia> */}
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
              <IconButton
                onClick={() => this.props.dispatch(setMapLocation({
                  lat: result.geometry.coordinates[1],
                  lng: result.geometry.coordinates[0]
                }))}
                tooltip="Zoom naartoe">
                <ZoomInIcon />
              </IconButton>
              <IconButton
                tooltip="Maak favoriet">
                <ToggleStarIcon />
              </IconButton>
              <IconButton
                tooltip="Deel met anderen">
                <ShareIcon />
              </IconButton>
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
        <BackgroundLayerToggler
          {...this.props}
          value={this.state.value}
        />
        <VelocityComponent
          animation={{
            left: (this.state.value || this.props.map.profiles.length > 0 || this.props.assets.results.length > 0) ? 0 : -600,
          }}
          duration={250}>
          <div
            style={{
              backgroundColor: (this.state.value || this.props.map.profiles.length > 0 || this.props.assets.results.length > 0) ? '#fff' : '',
              height: (this.state.value || this.props.map.profiles.length > 0 || this.props.assets.results.length > 0) ? '100%' : '',
              boxShadow: (this.state.value || this.props.map.profiles.length > 0 || this.props.assets.results.length > 0) ? '0 0 20px rgba(0,0,0,0.3)' : '',
            }}
            className={styles.Omnibox}
            id='omnibox'>

            <List>{geocoderResults}</List>
            <List>{searchResults}</List>
            <Divider />
            {assetResults}

            {profiles}
          </div>
        </VelocityComponent>

        <div
          style={{
            // backgroundColor: (this.state.value || this.props.map.profiles.length > 0 || this.props.assets.results.length > 0) ? '#fff' : '',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02)',
            backgroundColor: 'white',
            width: (this.state.value || this.props.map.profiles.length > 0 || this.props.assets.results.length > 0) ? 420 : 400,
            top: (this.state.value || this.props.map.profiles.length > 0 || this.props.assets.results.length > 0) ? 0 : 10,
            left: (this.state.value || this.props.map.profiles.length > 0 || this.props.assets.results.length > 0) ? 0 : 10,
          }}
          className={styles.SearchInputWrapper}>
          <TextField
            ref='q'
            id='q'
            autoComplete={false}
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck={false}
            underlineShow={false}
            onChange={this._handleSearchInput}
            style={{
              position: 'absolute',
              top: 0,
              height: 50,
              width: 400,
              color: '#fff',
              backgroundColor: 'white',
              margin: '0 0 0 10px',
            }}
            hintText='Zoek naar plaatsen en/of data (bijv. 13-10-2013)' />
        </div>
      </div>
    );
  }
}

Omnibox.propTypes = {};

export default Omnibox;
