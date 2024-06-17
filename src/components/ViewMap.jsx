import { useEffect, useRef } from "react";

import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import Search from "@arcgis/core/widgets/Search.js";
// import Legend from "@arcgis/core/widgets/Legend.js";

const url =
  "https://services.arcgis.com/S9th0jAJ7bqgIRjw/arcgis/rest/services/Shooting_and_Firearm_Discharges_Open_Data/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";

const template = {
  title: "Crime Info",
  content:
    '<p style="padding-left:1rem"><b>Report Date: </b>{OCC_MONTH}, {OCC_YEAR}<br/><b>Time of incident: </b>{OCC_TIME_RANGE}<br/><b>Neighborhood: </b>{NEIGHBOURHOOD_158}<br/><b>Injured: </b>{INJURIES}<br/><b>Dead: </b>{DEATH}</p>',
};

const renderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    color: "orange",
    outline: {
      color: "white",
    },
  },
};

const ViewMap = ({ selectedYear }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize a geoJSON layer
    const geojsonLayer = new GeoJSONLayer({
      url: url,
      title: "Toronto Shootings",
      copyright: "Toronto Police",
      popupTemplate: template,
      renderer: renderer,
      definitionExpression: `OCC_YEAR = ${selectedYear}`,
    });

    // Select a hybrid(Satellite view with road names) and add the geoJSON layer
    const map = new Map({ basemap: "hybrid", layers: [geojsonLayer] });

    // Show the map
    const view = new MapView({
      map,
      container: mapRef.current,
      center: [-79.403523, 43.683188],
      zoom: 12,
    });

    view.when(() => {
      // Add a search widget to the the view
      const searchWidget = new Search({
        view: view,
      });
      // Add widget to the top left corner of the view
      view.ui.add(searchWidget, {
        position: "top-left",
        index: 2,
      });

      // Legend is work in progress
      // Add a legend to the view
      // const legend = new Legend({
      //   view: view,
      // });

      // Add widget to the bottom right corner of the view
      // view.ui.add(legend, "bottom-right");
    });

    return () => view && view.destroy();
  }, [selectedYear]);

  return <div style={{ width: "100vw", height: "100vh" }} ref={mapRef}></div>;
};

export default ViewMap;
