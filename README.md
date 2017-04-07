LIZARD-MOBILE-DEMO
==================

A Lizard front-end reimplemented in React + Redux.


INSTALL AND RUN
---------------

You'll need a fairly recent Node.js installation (v6.9.1 or higher) that includes `npm`. On Ubuntu you may need to install the `nodejs-legacy` package.

Install [Yarn](https://yarnpkg.com/en/) first if you don't have it set up already. Should be as easy as `$ npm install -g yarn`.

With Yarn, Node and npm installed, run:

```bash
$ yarn install
```

This will parse `package.json` and `yarn.lock` and will install the proper versions of all dependencies.

To start a devserver:

```bash
$ sso_user=yourusername sso_pass=yourpassword yarn start
```

If you don't provide sso_user and sso_pass, the requests to demo.lizard.net won't be authenticated.

It defaults to run on [http://localhost:3000](http://localhost:3000).


BUILDING A PRODUCTION BUNDLE
----------------------------

```bash
$ npm run build
```

This will run webpack in production mode. The result will be a `bundle.js` file in the `dist/` directory.



Browser development extensions
------------------------------

This front-end uses React and Redux. These extensions may help:

- React Devtools for [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

- Redux Devtools for [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) or [Firefox](https://addons.mozilla.org/en-Gb/firefox/addon/remotedev/)



PARTIALLY IMPLEMENTED
---------------------

- Map
- Omnibox
- Timeseries in Omnibox
- Profiletool
- Background switcher
- Top bar


NOT YET IMPLEMENTED
-------------------

- The rest!
- MapboxGL (misses vector tiles endpoint)
- Cesiumjs (for 3d)
- Config overlay
- Offline mode
- Sidebar Component
- Timeline Component
- Region aggregation in Omnibox
- Legend
- Messages
- Dasboard
- Load mobile version and dashboard using code splitting
- React Redux Router
- Custom scrollbars in Omnibox
- Favorites


