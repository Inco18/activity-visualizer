"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { FeatureGroup, Polyline, useMap } from "react-leaflet";
import polyline from "@mapbox/polyline";
import L, { LatLng } from "leaflet";
import GeometryUtil from "leaflet-geometryutil";
import { useActivities } from "@/context/ActivitiesContext";
import { FaChevronUp, FaFlag, FaFlagCheckered } from "react-icons/fa";
import { renderToString } from "react-dom/server";

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
    // Hide markers when map is zoomed out
    map.on("zoomend", () => {
      if (map.getZoom() < 11) {
        map.removeLayer(markersLayerGroup);
      } else {
        map.addLayer(markersLayerGroup);
      }
    });
  }, []);

  // Handle map size change on ActivityList hide
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
      const decodedPolyline = polyline.decode(activity!.map.summary_polyline);
      // Add start and end flags
      markersLayerGroup.addLayer(
        L.marker([decodedPolyline[0][0], decodedPolyline[0][1]], {
          icon: L.divIcon({
            iconSize: [25, 25],
            iconAnchor: [12.5, 12.5],
            className: `text-green-500 !pointer-events-none`,
            html: `<div style="transform:translate(50%, 0)">${renderToString(
              <FaFlag />
            )}</div>`,
          }),
        })
      );
      markersLayerGroup.addLayer(
        L.marker(
          [
            decodedPolyline[decodedPolyline.length - 1][0],
            decodedPolyline[decodedPolyline.length - 1][1],
          ],
          {
            icon: L.divIcon({
              iconSize: [25, 25],
              iconAnchor: [12.5, 12.5],
              className: `text-red-500 !pointer-events-none`,
              html: `<div style="transform:translate(50%, 0)">${renderToString(
                <FaFlagCheckered />
              )}</div>`,
            }),
          }
        )
      );

      // Add direction arrows
      for (let i = 1; i < activity?.distance! / 1000; i += 1) {
        const arrowCoords = GeometryUtil.interpolateOnLine(
          map,
          decodedPolyline,
          (i * 1000) / activity?.distance!
        );
        if (
          decodedPolyline[arrowCoords?.predecessor as number] &&
          decodedPolyline[(arrowCoords?.predecessor as number) + 2]
        ) {
          markersLayerGroup.addLayer(
            L.marker([arrowCoords?.latLng.lat!, arrowCoords?.latLng.lng!], {
              icon: L.divIcon({
                iconSize: [25, 25],
                iconAnchor: [12.5, 12.5],
                className: `!flex items-center justify-center !pointer-events-none text-orange-400`,
                html: `<div style="transform:rotate(${Math.round(
                  GeometryUtil.angle(
                    map,
                    decodedPolyline[arrowCoords?.predecessor as number],
                    decodedPolyline[(arrowCoords?.predecessor as number) + 2]
                  )
                )}deg);">${renderToString(<FaChevronUp />)}</div>`,
              }),
            })
          );
        }
      }

      // Add distance markers
      for (let i = 10; i < activity?.distance! / 1000; i += 10) {
        const markerCoords = GeometryUtil.interpolateOnLine(
          map,
          decodedPolyline,
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

    // Handle hover
    Object.entries(polylineRefs.current).forEach((val: any[]) => {
      if (val[1]) {
        val[1].on("mouseover", (e: any) => {
          if (!selectedActivity) {
            const activity = displayedActivities.find((el) => el.id == val[0]);
            const decodedPolyline = polyline.decode(
              activity!.map.summary_polyline
            );
            // Add start and end flags
            markersLayerGroup.addLayer(
              L.marker([decodedPolyline[0][0], decodedPolyline[0][1]], {
                icon: L.divIcon({
                  iconSize: [25, 25],
                  iconAnchor: [12.5, 12.5],
                  className: `text-green-500 !pointer-events-none`,
                  html: `<div style="transform:translate(50%, 0)">${renderToString(
                    <FaFlag />
                  )}</div>`,
                }),
              })
            );
            markersLayerGroup.addLayer(
              L.marker(
                [
                  decodedPolyline[decodedPolyline.length - 1][0],
                  decodedPolyline[decodedPolyline.length - 1][1],
                ],
                {
                  icon: L.divIcon({
                    iconSize: [25, 25],
                    iconAnchor: [12.5, 12.5],
                    className: `text-red-500 !pointer-events-none`,
                    html: `<div style="transform:translate(50%, 0)">${renderToString(
                      <FaFlagCheckered />
                    )}</div>`,
                  }),
                }
              )
            );

            // Add direction arrows
            for (let i = 1; i < activity?.distance! / 1000; i += 1) {
              const arrowCoords = GeometryUtil.interpolateOnLine(
                map,
                decodedPolyline,
                (i * 1000) / activity?.distance!
              );
              if (
                decodedPolyline[arrowCoords?.predecessor as number] &&
                decodedPolyline[(arrowCoords?.predecessor as number) + 2]
              ) {
                markersLayerGroup.addLayer(
                  L.marker(
                    [arrowCoords?.latLng.lat!, arrowCoords?.latLng.lng!],
                    {
                      icon: L.divIcon({
                        iconSize: [25, 25],
                        iconAnchor: [12.5, 12.5],
                        className: `!flex items-center justify-center !pointer-events-none text-orange-400`,
                        html: `<div style="transform:rotate(${Math.round(
                          GeometryUtil.angle(
                            map,
                            decodedPolyline[arrowCoords?.predecessor as number],
                            decodedPolyline[
                              (arrowCoords?.predecessor as number) + 2
                            ]
                          )
                        )}deg);">${renderToString(<FaChevronUp />)}</div>`,
                      }),
                    }
                  )
                );
              }
            }

            // Add distance markers
            for (let i = 10; i < activity?.distance! / 1000; i += 10) {
              const markerCoords = GeometryUtil.interpolateOnLine(
                map,
                decodedPolyline,
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
              positions={polyline.decode(
                activity.map.summary_polyline
              )}></Polyline>
          );
        })}
      </FeatureGroup>
    ),
    [displayedActivities]
  );

  return <div>{displayMap}</div>;
};

export default MapInner;
