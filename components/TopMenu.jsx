import styles from './TopMenu.css';
import React, { Component, PropTypes } from 'react';
import $ from 'jquery';

import icon3di from '../images/appicons/3di@3x.svg';
import iconKlimaatatlas from '../images/appicons/klimaatatlas@3x.svg';
import iconKPI from '../images/appicons/kpi@3x.svg';
import iconUploadservice from '../images/appicons/uploadservice@3x.svg';
import iconRegenradar from '../images/appicons/regenradar@3x.svg';
import iconWaterkaart from '../images/appicons/waterkaart@3x.svg';
import iconWaterlabel from '../images/appicons/waterlabel@3x.svg';
import iconDigitaleDelta from '../images/appicons/digitaldelta@3x.svg';
import iconEFCIS from '../images/appicons/efcis@3x.svg';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Divider from 'material-ui/Divider';
import Download from 'material-ui/svg-icons/file/file-download';
import DropDownMenu from 'material-ui/DropDownMenu';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import Face from 'material-ui/svg-icons/action/face';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AppsIcon from 'material-ui/svg-icons/navigation/apps';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Send from 'material-ui/svg-icons/content/send';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


class TopMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 3,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(newProps) {}

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  render() {
    return (
      <Toolbar className={styles.TopMenu} style={{
        // opacity: '0.85',
      }}>
        <ToolbarGroup firstChild={true}></ToolbarGroup>
        <ToolbarGroup>
          <IconMenu
            iconButtonElement={<Avatar style={{
              margin: '20px 10px 0 0',
              cursor: 'pointer',
              backgroundColor: 'transparent',
            }}><AppsIcon /></Avatar>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}>
            <MenuItem
              onClick={() =>
                window.open('https://3di.lizard.net/', '_blank')
              }
              style={{ color: 'black' }}
              leftIcon={
                <img
                  style={{ transform: 'scale(1.8)' }}
                  src={icon3di}
                />
              }
              primaryText="3Di" />
            <MenuItem
              onClick={() =>
                window.open('https://flevoland.lizard.net/report/kpi/', '_blank')
              }
              style={{ color: 'black' }}
              leftIcon={<img
                  style={{ transform: 'scale(1.8)' }}
                  src={iconKPI}
                />}
              primaryText="KPI" />
            <MenuItem
              onClick={() =>
                window.open('https://www.klimaatatlas.net//', '_blank')
              }
              style={{ color: 'black' }}
              leftIcon={<img
                  style={{ transform: 'scale(1.8)' }}
                  src={iconKlimaatatlas}
                />}
              primaryText="Klimaatatlas" />
            <MenuItem
              onClick={() =>
                window.open('https://uploadservice.lizard.net/', '_blank')
              }
              style={{ color: 'black' }}
              leftIcon={<img
                  style={{ transform: 'scale(1.8)' }}
                  src={iconUploadservice}
                />}
              primaryText="Uploadservice" />
            <MenuItem
              onClick={() =>
                window.open('https://hdsr-efcis.lizard.net/', '_blank')
              }
              style={{ color: 'black' }}
              leftIcon={<img
                  style={{ transform: 'scale(1.8)' }}
                  src={iconEFCIS}
                />}
              primaryText="EFCIS" />
            <MenuItem
              onClick={() =>
                window.open('https://digitaledelta.lizard.net/', '_blank')
              }
              style={{ color: 'black' }}
              leftIcon={<img
                  style={{ transform: 'scale(1.8)' }}
                  src={iconDigitaleDelta}
                />}
              primaryText="Digitale Delta" />
            <MenuItem
              onClick={() =>
                window.open('https://regenradar.lizard.net/', '_blank')
              }
              style={{ color: 'black' }}
              leftIcon={<img
                  style={{ transform: 'scale(1.8)' }}
                  src={iconRegenradar}
                />}
              primaryText="Regenradar" />
            <MenuItem
              onClick={() =>
                window.open('http://www.waterlabel.net/', '_blank')
              }
              style={{ color: 'black' }}
              leftIcon={<img
                  style={{ transform: 'scale(1.8)' }}
                  src={iconWaterlabel}
                />}
              primaryText="Waterlabel" />
              <MenuItem
                style={{ color: 'black' }}
                leftIcon={<img
                    style={{ transform: 'scale(1.8)' }}
                    src={iconWaterkaart}
                  />}
                primaryText="Waterkaart" />
          </IconMenu>
          <IconMenu
            iconButtonElement={<Avatar style={{
              margin: '20px 10px 0 0',
              cursor: 'pointer',
              backgroundColor: '#239F85',
            }}>G</Avatar>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}>
            <MenuItem
              style={{ color: 'black' }}
              leftIcon={<Send />}
              primaryText="Delen" />
            <MenuItem
              style={{ color: 'black' }}
              leftIcon={<MessageIcon />}
              primaryText="Berichten" />
            <MenuItem
              style={{ color: 'black' }}
              leftIcon={<Face />}
              primaryText="Profiel" />
            <Divider />
            <MenuItem
              style={{ color: 'black' }}
              value="Del"
              leftIcon={<ExitToApp/>}
              primaryText="Uitloggen" />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

TopMenu.propTypes = {};

export default TopMenu;
