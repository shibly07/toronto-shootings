import { useEffect, useRef } from "react";

import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import Search from "@arcgis/core/widgets/Search.js";
import * as sizeRendererCreator from "@arcgis/core/smartMapping/renderers/size.js";
// import Legend from "@arcgis/core/widgets/Legend.js";

const url =
  "https://services.arcgis.com/S9th0jAJ7bqgIRjw/arcgis/rest/services/Shooting_and_Firearm_Discharges_Open_Data/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";

const template = {
  title: "Crime Info",
  content:
    '<p style="padding-left:1rem"><b>Report Date: </b>{OCC_MONTH}, {OCC_YEAR}<br/><b>Time of incident: </b>{OCC_TIME_RANGE}<br/><b>Neighborhood: </b>{NEIGHBOURHOOD_158}<br/><b>Injured: </b>{INJURIES}<br/><b>Dead: </b>{DEATH}</p>',
};

const renderer = {
  type: "simple", // autocasts as new SimpleRenderer()
  symbol: {
    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
    color: [0, 0, 0, 0],
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: "#71de6e",
      width: 1,
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
    const map = new Map({
      basemap: "hybrid",
      layers: [geojsonLayer],
    });

    // Select div to show map with pre selected coordinates
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

      const sizeParams = {
        layer: geojsonLayer,
        view: view,
        valueExpression: "($feature.INJURIES*10)",
        legendOptions: {
          title: "% population living in poverty",
        },
        minValue: 0,
        maxValue: 20,
        sizeOptimizationEnabled: true,
        // sizeScheme: { color: color },
      };

      // Render different sized marker on the map
      let rendererResult = null;
      sizeRendererCreator
        .createContinuousRenderer(sizeParams)
        .then((response) => {
          // Set the output renderer on the layer.
          rendererResult = response;
          geojsonLayer.renderer = rendererResult.renderer;
          rendererResult.renderer.classBreakInfos[0].symbol.color = "#22A7F0";
          rendererResult.renderer.classBreakInfos[0].symbol.outline.color =
            "#E31A1C";
          rendererResult.renderer.classBreakInfos[0].symbol.outline.width = 2;
        });

      geojsonLayer.featureReduction.fields = [
        {
          name: "INJURIES",
          statisticType: "count",
          onStatisticField: "INJURIES",
          onStatisticExpression: {
            expression: "$feature.INJURIES",
            title: "population density",
            returnType: "number",
          },
        },
      ];

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
