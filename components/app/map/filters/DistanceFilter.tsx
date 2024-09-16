import { useActivities } from "@/context/ActivitiesContext";
import Slider from "rc-slider";
import React from "react";

const DistanceFilter = () => {
  const { filters, setFilters, allActivities } = useActivities();
  const distanceRange = [
    Math.floor(
      allActivities.reduce((acc, cur) => {
        return acc < cur.distance ? acc : cur.distance;
      }, allActivities[0].distance) / 1000
    ),
    Math.ceil(
      allActivities.reduce((acc, cur) => {
        return acc > cur.distance ? acc : cur.distance;
      }, allActivities[0].distance) / 1000
    ),
  ];

  return (
    <div className="flex flex-col flex-1 items-center text-lg min-w-48">
      Distance
      <div className="pb-5 w-full mt-auto h-fit">
        <p className="text-center text-sm mb-2">
          {filters.distance?.from || distanceRange[0]} km -{" "}
          {filters.distance?.to || distanceRange[1]} km
        </p>
        <Slider
          range
          onChange={(val) =>
            setFilters((prev) => {
              return {
                ...prev,
                distance: {
                  from: Array.isArray(val) ? val[0] : val,
                  to: Array.isArray(val) ? val[1] : val,
                },
              };
            })
          }
          value={[
            (filters.distance?.from as number) || distanceRange[0],
            (filters.distance?.to as number) || distanceRange[1],
          ]}
          min={distanceRange[0]}
          max={distanceRange[1]}
          step={1}
          defaultValue={distanceRange}
          marks={{
            [distanceRange[0]]: {
              label: distanceRange[0] + " km",
              style: {
                color: "white",
                paddingLeft: "1.3rem",
              },
            },
            [distanceRange[1]]: {
              label: distanceRange[1] + " km",
              style: {
                color: "white",
                paddingRight: "1.3rem",
                whiteSpace: "nowrap",
              },
            },
          }}
          className="[&>.rc-slider-rail]:bg-dark-300 [&>.rc-slider-track]:bg-strava [&_.rc-slider-dot]:bg-dark-50 [&_.rc-slider-dot]:border-dark-50 [&_.rc-slider-handle]:border-strava [&_.rc-slider-handle]:bg-dark-50 [&_.rc-slider-handle]:opacity-100 [&_.rc-slider-handle-dragging]:!border-strava [&_.rc-slider-handle-dragging]:!shadow-[0_0_0_5px] [&_.rc-slider-handle-dragging]:!shadow-strava/80 [&_.rc-slider-handle:focus-visible]:!border-strava [&_.rc-slider-handle:focus-visible]:!shadow-[0_0_0_5px] [&_.rc-slider-handle:focus-visible]:!shadow-strava/80 [&_.rc-slider-handle:hover]:border-strava [&_.rc-slider-handle:hover]:border-opacity-50"
        />
      </div>
    </div>
  );
};

export default DistanceFilter;
