import { useActivities } from "@/context/ActivitiesContext";
import Slider from "rc-slider";
import React from "react";

const ElevationFilter = () => {
  const { filters, setFilters, allActivities } = useActivities();
  const elevationRange = [
    Math.floor(
      allActivities.reduce((acc, cur) => {
        return acc < cur.total_elevation_gain ? acc : cur.total_elevation_gain;
      }, allActivities[0].total_elevation_gain)
    ),
    Math.ceil(
      allActivities.reduce((acc, cur) => {
        return acc > cur.total_elevation_gain ? acc : cur.total_elevation_gain;
      }, allActivities[0].total_elevation_gain)
    ),
  ];

  return (
    <div className="flex flex-col flex-1 items-center justify-center text-lg min-w-48 w-full">
      Elevation Gain
      <div className="pb-5 mt-auto h-fit w-[90%]">
        <p className="text-center text-sm mb-2">
          {filters.total_elevation_gain?.from || elevationRange[0]} m -{" "}
          {filters.total_elevation_gain?.to || elevationRange[1]} m
        </p>
        <Slider
          range
          onChange={(val) =>
            setFilters((prev) => {
              return {
                ...prev,
                total_elevation_gain: {
                  from: Array.isArray(val) ? val[0] : val,
                  to: Array.isArray(val) ? val[1] : val,
                },
              };
            })
          }
          value={[
            (filters.total_elevation_gain?.from as number) || elevationRange[0],
            (filters.total_elevation_gain?.to as number) || elevationRange[1],
          ]}
          min={elevationRange[0]}
          max={elevationRange[1]}
          step={1}
          defaultValue={elevationRange}
          marks={{
            [elevationRange[0]]: {
              label: elevationRange[0] + " m",
              style: {
                color: "white",
                paddingLeft: "1.3rem",
              },
            },
            [elevationRange[1]]: {
              label: elevationRange[1] + " m",
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

export default ElevationFilter;
