import "ol/ol.css";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";

var basemap = new TileLayer({
  source: new OSM()
});

var wmsSourceF = new ImageWMS({
  url:
    "https://mapservices.weather.noaa.gov:443/static/services/nws_reference_maps/USGS_Stream_Gauges/MapServer/WMSServer?",
  params: {
    LAYERS: ["0"]
  },
  ratio: 1,
  serverType: "geoserver",
  crossOrigin: "anonymous"
});

var NWMF = new ImageLayer({
  minZoom: 1,
  extent: [-15884991, 2270341, -5455066, 8338219],
  source: wmsSourceF
});

var view = new View({
  center: [-10997148, 4569099],
  zoom: 4
});

var map = new Map({
  layers: [basemap, NWMF],
  target: "map",
  view: view
});

map.on("singleclick", function (evt) {
  /*document.getElementById("info").innerHTML = "";*/
  var viewResolution = /** @type {number} */ (view.getResolution());
  var url = wmsSourceF.getFeatureInfoUrl(
    evt.coordinate,
    viewResolution,
    "EPSG:3857",
    { INFO_FORMAT: "text/html" }
  );
  if (url) {
    fetch(url)
      .then(function (response) {
        return response.text();
      })
      .then(function (html) {
        document.getElementById("info").innerHTML = html;
      });
  }
});

map.on("pointermove", function (evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  var hit = map.forEachLayerAtPixel(pixel, function () {
    return true;
  });
  map.getTargetElement().style.cursor = hit ? "pointer" : "";
});
