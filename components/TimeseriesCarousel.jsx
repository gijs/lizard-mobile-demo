import styles from './TimeseriesCarousel.css';
import _ from 'lodash';
import $ from 'jquery';
import MobileDetect from 'mobile-detect';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ChevronLeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRightIcon from 'material-ui/svg-icons/navigation/chevron-right';
import {AreaChart, Area, Brush, LineChart, BarChart, Line, Bar, XAxis, YAxis,
        ResponsiveContainer, CartesianGrid, Tooltip, Legend} from 'recharts';
import RefreshIndicator from 'material-ui/RefreshIndicator';
const md = new MobileDetect(window.navigator.userAgent);



class MiniTimeserieChart extends Component {

    constructor(props) {
      super(props);
      this.state = {
        data: [],
        loading: true,
        width: window.innerWidth,
        height: window.innerHeight,
      };
      this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
      const uuid = this.props.uuid;
      $.ajax({
        method: 'GET',
        url: `${window.BASE_URL}/api/v2/timeseries/?end=1480546800000&min_points=320&start=1480374000000&uuid=${uuid}`,
        xhrFields: {
          withCredentials: (window.HOST_IS_GITHUB) ? true : false,
        },
        success: (data) => {
          this.setState({
            loading: false,
            data: data.results[0].events,
          });
        },
      });
      window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateDimensions);
    }

    componentWillReceiveProps(newProps) {
      if (this.props.uuid !== newProps.uuid) {
        this.setState({
          loading: true,
          data: [],
        }, () => {
          const uuid = newProps.uuid;
          $.ajax({
            method: 'GET',
            url: `${window.BASE_URL}/api/v2/timeseries/?end=1480546800000&min_points=320&start=1480374000000&uuid=${uuid}`,
            xhrFields: {
              withCredentials: (window.HOST_IS_GITHUB) ? true : false,
            },
            success: (data) => {
              this.setState({
                loading: false,
                data: data.results[0].events,
              });
            },
          });
        });
      }
    }

    updateDimensions() {
      this.setState({
        width: $(window).width(),
        height: $(window).height(),
      });
    }

    render() {
      const nullFilteredData = this.state.data.filter((d) => {
        if (d.value !== null) return d;
      });
      if (this.state.loading) {
        return (
          <div style={{ padding: '30px 0 0 20px' }}>
            <RefreshIndicator
              size={40}
              left={170}
              top={90}
              status='loading'
            />
          </div>
        );
      }
      return (
        <div style={{ padding: '30px 0 0 20px' }}>
          {(nullFilteredData.length > 0) ?
            <AreaChart
              height={150}
              width={md.mobile() ? this.state.width - 80 : 350}
              data={nullFilteredData}
              margin={{top: 2, right: 5, left: -40, bottom: 2}}>
              <XAxis
                tickFormatter={(tick) => {
                  return moment(tick).format('DD/YY');
                }}
                dataKey='timestamp' />
              <YAxis
                tickFormatter={(tick) => {
                  return parseInt(tick);
                }}
                dataKey='value' />
              <Area isAnimationActive={false}
                    type='monotone'
                    dataKey='value'
                    stroke='#82ca9d'
                    fill='#82ca9d' />
            </AreaChart>
           :
           <p style={{
             lineHeight: 9,
             paddingLeft: 80,
           }}><strong>Geen data beschikbaar...</strong></p>
          }
        </div>
      );
    }
}




class TimeseriesCarousel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      numberOfTimeseries: this.props.data.length,
      currentTimeserie: 0,
      open: false,
    };
    this._handleGoLeft = this._handleGoLeft.bind(this);
    this._handleGoRight = this._handleGoRight.bind(this);
  }

  componentDidMount() {}

  componentWillReceiveProps(newProps) {}

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  _handleGoLeft() {
    this.setState({
      currentTimeserie: (this.state.currentTimeserie > 0) ? this.state.currentTimeserie - 1 : 0,
    });
  }

  _handleGoRight() {
    this.setState({
      currentTimeserie: (this.state.currentTimeserie < (this.props.data.length - 1)) ? this.state.currentTimeserie + 1 : this.state.currentTimeserie,
    });
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  render() {
    const timeserie = this.props.data[this.state.currentTimeserie];

    if (timeserie === undefined) {
      return <div/>;
    }

    let computedTitle = '...';
    try {
      computedTitle = `${timeserie.parameter} (${timeserie.name})`;
    } catch (e) {}
    return (
      <div className={styles.TimeseriesCarousel}>
      <div
        onClick={this._handleGoLeft}
        className={styles.ChevronLeft}>
        <ChevronLeftIcon />
      </div>
      <div>
        <span
          style={{ cursor: 'pointer', borderBottom: '1px dotted #ccc', }}
          onClick={(e) => this.setState({open:!this.state.open})}>
          {computedTitle}
        </span>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            {this.props.data.map((ts, i) => {
              return (
                <MenuItem
                  key={i}
                  onClick={(e) => this.setState({
                    currentTimeserie: i,
                    open: false,
                  })}
                  primaryText={ts.parameter} />
              );
            })}
          </Menu>
        </Popover>
        <MiniTimeserieChart uuid={timeserie.uuid}/>
      </div>
      <div
        onClick={this._handleGoRight}
        className={styles.ChevronRight}>
        <ChevronRightIcon />
      </div>
      </div>
    );
  }
}

TimeseriesCarousel.propTypes = {};

export default TimeseriesCarousel;
