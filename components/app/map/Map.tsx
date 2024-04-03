"use client";
import React, { useLayoutEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { SummaryActivity } from "@/types/strava/SummaryActivity";
import polyline from "@mapbox/polyline";
import MapInner from "./MapInner";
type Props = {
  displayedActivities: SummaryActivity[];
  selected: number | undefined;
  setSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
  prevSelected: number | undefined;
  setPrevSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
  isActivityListHidden: boolean;
};

const Map = ({
  displayedActivities,
  selected,
  setSelected,
  prevSelected,
  setPrevSelected,
  isActivityListHidden,
}: Props) => {
  return (
    <div className="h-full w-full">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          minZoom={0}
          maxZoom={20}
        />
        {displayedActivities.length > 0 && (
          <MapInner
            displayedActivities={displayedActivities}
            selected={selected}
            setSelected={setSelected}
            prevSelected={prevSelected}
            setPrevSelected={setPrevSelected}
            isActivityListHidden={isActivityListHidden}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
