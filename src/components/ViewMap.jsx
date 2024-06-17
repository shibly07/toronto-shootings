import { useEffect, useRef } from "react";

import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import Search from "@arcgis/core/widgets/Search.js";
// import Legend from "@arcgis/core/widgets/Legend.js";

const url =
  "https://services.arcgis.com/S9th0jAJ7bqgIRjw/arcgis/rest/services/Major_Crime_Indicators_Open_Data/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";

const template = {
  title: "Crime Info",
  content:
    '<p style="padding-left:1rem"><b>Report Date: </b>{REPORT_MONTH}, {REPORT_YEAR}<br/><b>Premises Type: </b>{PREMISES_TYPE}<br/><b>Location Type: </b>{LOCATION_TYPE}<br/><b>Neighborhood: </b>{NEIGHBOURHOOD_158}<br/><b>Offense Category: </b>{MCI_CATEGORY}<br/><b>Offense: </b>{OFFENCE}</p>',
};

const renderer = {
  type: "unique-value",
  defaultSymbol: {
    type: "simple-marker",
    color: "orange",
    outline: {
      color: "white",
    },
  },
  field: "MCI_CATEGORY",
  uniqueValueInfos: [
    {
      // All features with value of "North" will be blue
      value: "asdasd",
      symbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "blue",
      },
    },
    {
      // All features with value of "East" will be green
      value: "East",
      symbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "green",
      },
    },
    {
      // All features with value of "South" will be red
      value: "South",
      symbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "red",
      },
    },
    {
      // All features with value of "West" will be yellow
      value: "West",
      symbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "yellow",
      },
    },
  ],
};

const ViewMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize a geoJSON layer
    const geojsonLayer = new GeoJSONLayer({
      url: url,
      title: "Toronto Crime",
      copyright: "Toronto Police",
      popupTemplate: template,
      renderer: renderer,
      outFields: ["MCI_CATEGORY"],
    });

    // Select a hybrid(Satellite view with road names) and add the geoJSON layer
    const map = new Map({ basemap: "hybrid", layers: [geojsonLayer] });

    // Show the map
    const view = new MapView({
      map,
      container: mapRef.current,
      center: [-79.403523, 43.683188],
      zoom: 14,
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
  }, []);

  return <div style={{ width: "100vw", height: "100vh" }} ref={mapRef}></div>;
};

export default ViewMap;
