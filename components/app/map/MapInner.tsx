"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { FeatureGroup, Polyline, Popup, useMap } from "react-leaflet";
import polyline from "@mapbox/polyline";
import { SummaryActivity } from "@/types/strava/SummaryActivity";

type Props = {
  displayedActivities: SummaryActivity[];
  selected: number | undefined;
  prevSelected: number | undefined;
  setSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
  setPrevSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const MapInner = ({
  displayedActivities,
  selected,
  prevSelected,
  setSelected,
  setPrevSelected,
}: Props) => {
  const map = useMap();
  const polylineGroup = useRef<any>(null);
  const polylineRefs = useRef<{ [key: string]: any }>({});
  useEffect(() => {
    map.fitBounds(polylineGroup.current.getBounds());
  }, []);

  useEffect(() => {
    console.log(selected, prevSelected);
    if (selected) {
      polylineRefs.current[selected].setStyle({
        color: "#fc4c01",
        opacity: 1,
        weight: 5,
      });
      polylineRefs.current[selected].bringToFront();
      map.fitBounds(polylineRefs.current[selected].getBounds());
    }
    if ((prevSelected && !selected) || (prevSelected && selected)) {
      polylineRefs.current[prevSelected].setStyle({
        color: "#991b1b",
        opacity: 0.5,
        weight: 3,
      });
      polylineRefs.current[prevSelected].closePopup();
    }
    const clickFns = Object.fromEntries(
      Object.entries(polylineRefs.current).map((val: any[]) => {
        const key = val[0];
        const fn = (e: any) => {
          if (selected && selected == val[0]) {
            e.target.setStyle({
              color: "#fc4c01",
              opacity: 1,
              weight: 3,
            });
            setSelected(undefined);
            map.closePopup();
          } else {
            if (selected) {
              polylineRefs.current[selected].setStyle({
                color: "#991b1b",
                opacity: 0.5,
                weight: 3,
              });
            }
            e.target.setStyle({
              color: "#fc4c01",
              opacity: 1,
              weight: 5,
            });
            e.target.bringToFront();
            setPrevSelected(selected);
            setSelected(val[0]);
          }
        };
        return [key, fn];
      })
    );

    Object.entries(polylineRefs.current).forEach((val: any[]) => {
      if (val[1]) {
        val[1].on("mouseover", (e: any) => {
          if (val[0] != selected) {
            e.target.bringToFront();
            e.target.setStyle({ color: "#fc4c01", opacity: 1 });
            if (selected) {
              polylineRefs.current[selected].bringToFront();
            }
          }
        });

        val[1].on("mouseout", (e: any) => {
          if (val[0] != selected) {
            e.target.setStyle({
              color: "#991b1b",
              opacity: 0.5,
            });
          }
        });

        val[1].on("click", clickFns[val[0]]);
      }
    });
    return () => {
      Object.entries(polylineRefs.current).forEach((val: any[]) => {
        if (val[1]) {
          val[1].off("mouseout");
          val[1].off("mouseover");
          val[1].off("click", clickFns[val[0]]);
        }
      });
    };
  }, [selected]);

  const displayMap = useMemo(
    () => (
      <FeatureGroup ref={polylineGroup} key={selected}>
        {displayedActivities.map((activity) => {
          return (
            <Polyline
              key={activity.id}
              ref={(ref) => {
                polylineRefs.current[activity.id] = ref;
              }}
              color="#991b1b"
              opacity={0.5}
              weight={3}
              positions={polyline.decode(activity.map.summary_polyline)}>
              <Popup>TEST</Popup>
            </Polyline>
          );
        })}
      </FeatureGroup>
    ),
    [displayedActivities]
  );

  return <div>{displayMap}</div>;
};

export default MapInner;
