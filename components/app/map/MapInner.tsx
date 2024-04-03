"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { FeatureGroup, Polyline, Popup, useMap } from "react-leaflet";
import polyline from "@mapbox/polyline";
import { SummaryActivity } from "@/types/strava/SummaryActivity";
import { DateTime, Duration } from "luxon";
import { FaArrowDown } from "react-icons/fa";

type Props = {
  displayedActivities: SummaryActivity[];
  selected: number | undefined;
  prevSelected: number | undefined;
  setSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
  setPrevSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
  isActivityListHidden: boolean;
};

const MapInner = ({
  displayedActivities,
  selected,
  prevSelected,
  setSelected,
  setPrevSelected,
  isActivityListHidden,
}: Props) => {
  const map = useMap();
  const polylineGroup = useRef<any>(null);
  const polylineRefs = useRef<{ [key: string]: any }>({});
  useEffect(() => {
    map.fitBounds(polylineGroup.current.getBounds());
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 500);
    return () => clearTimeout(timeout);
  }, [isActivityListHidden]);

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
              <Popup autoPan>
                <div className="">
                  <div className="font-bold text-center text-lg !-mb-1">
                    {activity.name}
                  </div>
                  <div className="text-material-400 text-sm text-center ">
                    {DateTime.fromISO(activity.start_date_local, {
                      zone: "utc",
                    }).toLocaleString(DateTime.DATETIME_SHORT)}
                  </div>
                  <FaArrowDown className="text-material-400 mx-auto" />
                  <div className="text-material-400 text-sm text-center mb-2">
                    {DateTime.fromISO(activity.start_date_local, {
                      zone: "utc",
                    })
                      .plus({ seconds: activity.elapsed_time })
                      .toLocaleString(DateTime.DATETIME_SHORT)}
                  </div>

                  <div className="flex w-full justify-between items-center gap-5">
                    <div className="text-material-400 text-sm">Distance</div>
                    <div className="font-semibold">
                      {(activity.distance / 1000).toFixed(2)} km
                    </div>
                  </div>
                  <div className="flex w-full justify-between items-center gap-5">
                    <div className="text-material-400 text-sm">Moving time</div>
                    <div className="font-semibold">
                      {Duration.fromObject({
                        seconds: activity.moving_time,
                      }).toFormat("hh'h' mm'm'")}
                    </div>
                  </div>
                  <div className="flex w-full justify-between items-center gap-5">
                    <div className="text-material-400 text-sm">
                      Elapsed time
                    </div>
                    <div className="font-semibold">
                      {Duration.fromObject({
                        seconds: activity.elapsed_time,
                      }).toFormat("hh'h' mm'm'")}
                    </div>
                  </div>
                  <div className="flex w-full justify-between items-center gap-5">
                    <div className="text-material-400 text-sm">
                      Elevation gain
                    </div>
                    <div className="font-semibold">
                      {activity.total_elevation_gain} m
                    </div>
                  </div>
                  <div className="flex w-full justify-between items-center gap-5">
                    <div className="text-material-400 text-sm">
                      Average speed
                    </div>
                    <div className="font-semibold">
                      {((activity.average_speed * 18) / 5).toFixed(1)} km/h
                    </div>
                  </div>
                  <div className="flex w-full justify-between items-center gap-5">
                    <div className="text-material-400 text-sm">Max speed</div>
                    <div className="font-semibold">
                      {((activity.max_speed * 18) / 5).toFixed(1)} km/h
                    </div>
                  </div>
                  {activity.kilojoules && (
                    <div className="flex w-full justify-between items-center gap-5">
                      <div className="text-material-400 text-sm">
                        Kilojoules
                      </div>
                      <div className="font-semibold">
                        {activity.kilojoules} KJ
                      </div>
                    </div>
                  )}
                  {activity.average_watts && (
                    <div className="flex w-full justify-between items-center gap-5">
                      <div className="text-material-400 text-sm">
                        Average watts
                      </div>
                      <div className="font-semibold">
                        {activity.average_watts} W
                      </div>
                    </div>
                  )}
                  {activity.max_watts && (
                    <div className="flex w-full justify-between items-center gap-5">
                      <div className="text-material-400 text-sm">Max watts</div>
                      <div className="font-semibold">
                        {activity.max_watts} W
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
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
