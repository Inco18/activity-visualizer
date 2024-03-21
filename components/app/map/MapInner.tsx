"use client";
import React, { useEffect, useRef, useState } from "react";
import { FeatureGroup, Polyline, Popup, useMap } from "react-leaflet";
import polyline from "@mapbox/polyline";
import { SummaryActivity } from "@/types/strava/SummaryActivity";

type Props = {
  displayedActivities: SummaryActivity[];
  selected: number | undefined;
  setSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const MapInner = ({ displayedActivities, selected, setSelected }: Props) => {
  const map = useMap();
  const polylineGroup = useRef<any>(null);
  const [hovered, setHovered] = useState<number>();
  useEffect(() => {
    map.fitBounds(polylineGroup.current.getBounds());
  }, []);
  return (
    <FeatureGroup ref={polylineGroup} key={selected}>
      {displayedActivities.map((activity) => {
        return (
          <Polyline
            key={activity.id}
            eventHandlers={{
              mouseover: (e) => {
                setHovered(activity.id);
                if (!selected || selected === activity.id)
                  e.target.bringToFront();
              },
              mouseout: (e) => {
                setHovered(undefined);
              },
              click: () => setSelected(activity.id),
            }}
            className={`hover:stroke-red-800 ${
              activity.id === selected
                ? "stroke-red-800 opacity-100 stroke-[5px]"
                : "stroke-strava opacity-50 hover:opacity-100"
            }`}
            positions={polyline.decode(
              activity.map.summary_polyline
            )}></Polyline>
        );
      })}
    </FeatureGroup>
  );
};

export default MapInner;
