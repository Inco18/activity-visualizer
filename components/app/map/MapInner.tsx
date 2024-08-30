"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { FeatureGroup, Polyline, Popup, useMap } from "react-leaflet";
import polyline from "@mapbox/polyline";
import { DateTime, Duration } from "luxon";
import { FaArrowDown } from "react-icons/fa";
import L from "leaflet";
import GeometryUtil from "leaflet-geometryutil";
import { useActivities } from "@/context/ActivitiesContext";

const MapInner = () => {
  const {
    displayedActivities,
    selectedActivity,
    prevSelectedActivity,
    setSelectedActivity,
    setPrevSelectedActivity,
    isActivityListHidden,
  } = useActivities();
  const map = useMap();
  const polylineGroup = useRef<any>(null);
  const polylineRefs = useRef<{ [key: string]: any }>({});
  const markersLayerGroup = useMemo(() => L.layerGroup(), [map]);
  useEffect(() => {
    map.fitBounds(polylineGroup.current.getBounds());
    map.addLayer(markersLayerGroup);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 500);
    return () => clearTimeout(timeout);
  }, [isActivityListHidden]);

  useEffect(() => {
    if (
      (prevSelectedActivity && !selectedActivity) ||
      (prevSelectedActivity && selectedActivity)
    ) {
      if (polylineRefs.current[prevSelectedActivity]) {
        polylineRefs.current[prevSelectedActivity].setStyle({
          color: "#991b1b",
          opacity: 0.5,
          weight: 3,
        });
        polylineRefs.current[prevSelectedActivity].closePopup();
      }
      markersLayerGroup.clearLayers();
    }
    if (selectedActivity) {
      polylineRefs.current[selectedActivity].setStyle({
        color: "#fc4c01",
        opacity: 1,
        weight: 5,
      });

      const activity = displayedActivities.find(
        (el) => el.id == selectedActivity
      );
      for (let i = 10; i < activity?.distance! / 1000; i += 10) {
        const markerCoords = GeometryUtil.interpolateOnLine(
          map,
          polyline.decode(activity!.map.summary_polyline),
          (i * 1000) / activity?.distance!
        )?.latLng;
        markersLayerGroup.addLayer(
          L.marker([markerCoords?.lat!, markerCoords?.lng!], {
            icon: L.divIcon({
              iconSize: [25, 25],
              iconAnchor: [12.5, 12.5],
              className:
                "bg-dark-800 !flex items-center justify-center border-[1px] border-strava rounded-full !pointer-events-none",
              html: `${i}`,
            }),
          })
        );
      }
      polylineRefs.current[selectedActivity].bringToFront();
      map.fitBounds(polylineRefs.current[selectedActivity].getBounds());
    }

    const clickFns = Object.fromEntries(
      Object.entries(polylineRefs.current).map((val: any[]) => {
        const key = val[0];
        const fn = (e: any) => {
          if (selectedActivity && selectedActivity == val[0]) {
            e.target.setStyle({
              color: "#fc4c01",
              opacity: 1,
              weight: 3,
            });
            setSelectedActivity(undefined);
            map.closePopup();
          } else {
            if (selectedActivity) {
              polylineRefs.current[selectedActivity].setStyle({
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
            setPrevSelectedActivity(selectedActivity);
            setSelectedActivity(val[0]);
          }
        };
        return [key, fn];
      })
    );

    Object.entries(polylineRefs.current).forEach((val: any[]) => {
      if (val[1]) {
        val[1].on("mouseover", (e: any) => {
          if (!selectedActivity) {
            const activity = displayedActivities.find((el) => el.id == val[0]);
            for (let i = 10; i < activity?.distance! / 1000; i += 10) {
              const markerCoords = GeometryUtil.interpolateOnLine(
                map,
                polyline.decode(activity!.map.summary_polyline),
                (i * 1000) / activity?.distance!
              )?.latLng;
              markersLayerGroup.addLayer(
                L.marker([markerCoords?.lat!, markerCoords?.lng!], {
                  icon: L.divIcon({
                    iconSize: [25, 25],
                    iconAnchor: [12.5, 12.5],
                    className:
                      "bg-dark-800 !flex items-center justify-center border-[1px] border-strava rounded-full !pointer-events-none",
                    html: `${i}`,
                  }),
                })
              );
            }
          }
          if (val[0] != selectedActivity) {
            e.target.bringToFront();
            e.target.setStyle({ color: "#fc4c01", opacity: 1 });
            if (selectedActivity) {
              polylineRefs.current[selectedActivity].bringToFront();
            }
          }
        });

        val[1].on("mouseout", (e: any) => {
          if (!selectedActivity) markersLayerGroup.clearLayers();
          if (val[0] != selectedActivity) {
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
  }, [selectedActivity, displayedActivities]);

  const displayMap = useMemo(
    () => (
      <FeatureGroup ref={polylineGroup} key={selectedActivity}>
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
