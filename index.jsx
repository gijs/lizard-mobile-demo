/* globals Promise:true */
import 'babel-polyfill';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MobileDetect from 'mobile-detect';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from './configureStore.jsx';
import App from './components/App.jsx';
import MobileApp from './components/MobileApp.jsx';
import $ from 'jquery';
import {teal500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

window.HOST_IS_GITHUB = (document.location.hostname.indexOf('nens.github.io') === 0) ? true : false;
window.BASE_URL = (HOST_IS_GITHUB) ? 'https://demo.lizard.net' : '';

injectTapEventPlugin();

const store = configureStore();

const muiTheme = getMuiTheme({
  palette: {
    textColor: '#5B5C5D',
  },
  toolBar: {
    backgroundColor: teal500,
    height: 50,
  },
});

// import {
//     addLocaleData,
//     injectIntl,
//     IntlProvider,
//     FormattedRelative,
// } from 'react-intl';
// import en from 'react-intl/locale-data/en';
// import nl from 'react-intl/locale-data/nl';
// import localeData from './build/locales/data.json';
// addLocaleData([...en, ...nl]);

const md = new MobileDetect(window.navigator.userAgent);

if (md.mobile()) {
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={hashHistory}>
          <Route path='/' component={MobileApp} />
          <Route path='favorites/:uuid' component={MobileApp} />
        </Router>
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
  );
}
else {
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={hashHistory}>
          <Route path='/' component={App} />
          <Route path='favorites/:uuid' component={App} />
        </Router>
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
  );
}
