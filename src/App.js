import "./styles.css";
import "./styles.css";
import React, { useEffect, useState, useCallback } from "react";
import { render } from "react-dom";
import DeckGL from "@deck.gl/react";
import { MVTLayer } from "@deck.gl/geo-layers";
import geojsonvt from "geojson-vt";
import vtpbf from "vt-pbf";
import { StaticMap } from "react-map-gl";

import { load } from "@loaders.gl/core";

const DATA_URL =
  "https://gist.githubusercontent.com/PapaEcureuil/74a620d41402e989f0e725f025e7cbd3/raw/4d7e0ac1f6be1adc1e8fbca339ed51fe99600581/ny.json";

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.72,
  zoom: 10,
  minZoom: 0,
  maxZoom: 23
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const EXTENT = 4096;
const MAX_ZOOM = 23;

export default function App({ data_url = DATA_URL }) {
  const [tileIndex, setTileIndex] = useState(null);

  useEffect(() => {
    fetch(data_url)
      .then((r) => r.json())
      .then((d) => {
        const index = geojsonvt(d, {
          maxZoom: MAX_ZOOM,
          buffer: 64,
          extent: EXTENT
        });
        setTileIndex(index);
      });
  }, [data_url]);

  const fetchData = useCallback(
    (url, { layer, loadOptions }) => {
      let _url = url.split("/");
      const x = parseInt(_url[0]);
      const y = parseInt(_url[1]);
      const z = parseInt(_url[2]);

      const tile = tileIndex.getTile(z, x, y);
      if (!tile) {
        return null;
      }
      var buff = vtpbf.fromGeojsonVt({ geojsonLayer: tile });

      return load(buff, layer.props.loaders, loadOptions);
    },
    [tileIndex]
  );

  const layer =
    tileIndex &&
    new MVTLayer({
      id: "mvt-layer",
      data: "{x}/{y}/{z}",
      fetch: fetchData,
      // extruded: true,
      pickable: true,
      filled: true,
      // getLineColor: [255,0,100],
      lineWidthMinPixels: 5,
      getLineColor: [0, 0, 0, 100],
      getFillColor: [255, 0, 0, 150],
      stroked: true,
      onHover: (e) => console.log("hovered", e)
    });

  return (
    <DeckGL
      layers={[layer]}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
    >
      <StaticMap mapStyle={MAP_STYLE} />
    </DeckGL>
  );
}

export function renderToDOM(container) {
  render(<App />, container);
}
