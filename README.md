LIZARD-CLIENT-2
===============

Lizard front-end reimplemented in React + Redux.


IDEAS
-----

Desktop and mobile/tablet omniboxes
You can star assets or parts of assets
Starred items can be found in a personal catalog
Dashboard is a seperate product with Lizard as one of its integration points
Timeline will show only when temporal data is shown on map




*Dashboard*

Inspiration:
Look at periscopedata.com, powerbi, tableau

What is it?
Multi page dynamic reports, configurable with widgets such as charts

*Management environment*

Look at the settings pages of google cloud etcetera







IMPLEMENTED
-----------

 - Map
 - Omnibox
 - Timeseries in Omnibox
 - Profiletool
 - Background switcher
 - Top bar


NOT YET IMPLEMENTED
-------------------

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


BUGS
----

- Shiftkey sometimes remains activated
- Profile tool bears proper projection
- SVGs shift while zooming


LOOK INTO
---------

- Victorycharts / custom charts?
- https://github.com/FormidableLabs/formidable-charts
- Migration to webpack 2 (treeshaking, codesplitting etc.)
  - http://jonathancreamer.com/advanced-webpack-part-2-code-splitting/
- https://github.com/callemall/material-ui/issues/1670
- https://github.com/malte-wessel/react-custom-scrollbars
- http://malte-wessel.github.io/react-custom-scrollbars/

- https://demo.lizard.net/api/v2/wms/?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=radar%3Ahour&STYLES=radar-hour&FORMAT=image%2Fpng&TRANSPARENT=false&HEIGHT=497&WIDTH=525&TIME=2017-02-06T08%3A00%3A00&ZINDEX=20&SRS=EPSG%3A3857&BBOX=469629.1017841229,6574807.4249777235,626172.1357121639,6731350.458905761
