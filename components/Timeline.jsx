// @flow
import Hammer from 'react-hammerjs';
import styles from './Timeline.css';
import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';
import ChevronLeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRightIcon from 'material-ui/svg-icons/navigation/chevron-right';
import DateRangeIcon from 'material-ui/svg-icons/action/date-range';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import $ from 'jquery';
import _ from 'lodash';

// import {} from '../actions.jsx';


const data = [
  {
    month: '2015.01', a: 4000, b: 2400, c: 2400
  },
  {
    month: '2015.02', a: 3000, b: 1398, c: 2210
  },
  {
    month: '2015.03', a: 2000, b: 9800, c: 2290
  },
  {
    month: '2015.04', a: 2780, b: 3908, c: 2000
  },
  {
    month: '2015.05', a: 1890, b: 4800, c: 2181
  },
  {
    month: '2015.06', a: 2390, b: 3800, c: 2500
  },
  {
    month: '2015.07', a: 3490, b: 4300, c: 2100
  },
];



class Timeline extends Component {

  constructor(props) {
    super(props);
    this.state = {
      option: 1,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentWillReceiveProps(newProps) {}

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  render() {
    return (

        <div className={styles.Timeline}>
          <div style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: 30,
            backgroundColor: '#94A5A6',
            padding: '0 0 0 50px',
          }}>
          <SelectField
            value={this.state.option}
            style={{ marginTop: -8 }}
            onChange={(e,i,value) => this.setState({option: value})}>
            <MenuItem value={1} label="24 uur terug" primaryText="Afgelopen dag" />
            <MenuItem value={2} label="7 dagen terug" primaryText="Afgelopen week" />
            <MenuItem value={3} label="30 dagen terug" primaryText="Afgelopen maand" />
            <MenuItem value={4} label="1/1/2016 - nu" primaryText="Afgelopen jaar" />
          </SelectField>
          </div>
          <Hammer
            onTap={(e) => {
              console.log('onTap left', e);
            }}>
            <div className={styles.ChevronLeft}>
              <ChevronLeftIcon style={{ width:40, height:40 }} />
            </div>
          </Hammer>

            <svg
              onTouchStart={(e) => {
                if (e.touches.length === 2) {
                  console.log('using two fingers!');
                }
              }}
              onTouchMove={(e) => {
                if (e.touches.length === 2) {
                  console.log('touching', e.touches[0], e.touches[1]);
                }
              }}
              style={{
                width: '100%',
              }}>
              <circle cx={50} cy={50} r={10} fill="red" />
            </svg>

          <Hammer
            onTap={(e) => {
              console.log('onTap right', e);
            }}>
            <div className={styles.ChevronRight}>
              <ChevronRightIcon style={{ width:40, height:40 }} />
            </div>
          </Hammer>
        </div>
    );
  }
}

Timeline.propTypes = {};

export default Timeline;
