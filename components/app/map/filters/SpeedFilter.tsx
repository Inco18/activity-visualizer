import { useActivities } from "@/context/ActivitiesContext";
import { SummaryActivity } from "@/types/strava/SummaryActivity";
import { Duration } from "luxon";
import Slider from "rc-slider";
import React from "react";

type Props = {
  title: string;
  activityKey: "average_speed" | "max_speed";
};

const SpeedFilter = ({ title, activityKey }: Props) => {
  const { filters, setFilters, allActivities } = useActivities();
  const speedRange = [
    Math.floor(
      allActivities.reduce((acc, cur) => {
        return acc < cur[activityKey] ? acc : cur[activityKey];
      }, allActivities[0][activityKey]) * 100
    ) / 100,
    Math.ceil(
      allActivities.reduce((acc, cur) => {
        return acc > cur[activityKey] ? acc : cur[activityKey];
      }, allActivities[0][activityKey]) * 100
    ) / 100,
  ];

  console.log(speedRange);

  return (
    <div className="flex flex-col flex-1 items-center justify-center text-lg min-w-48 w-full">
      {title}
      <div className="pb-5 mt-auto h-fit w-[90%]">
        <p className="text-center text-sm mb-2">
          {(
            (((filters[activityKey]?.from as number) || speedRange[0]) * 18) /
            5
          ).toFixed(1)}{" "}
          km/h -{" "}
          {(
            (((filters[activityKey]?.to as number) || speedRange[1]) * 18) /
            5
          ).toFixed(1)}{" "}
          km/h
        </p>
        <Slider
          range
          onChange={(val) =>
            setFilters((prev) => {
              return {
                ...prev,
                [activityKey]: {
                  from: Array.isArray(val) ? val[0] : val,
                  to: Array.isArray(val) ? val[1] : val,
                },
              };
            })
          }
          value={[
            (filters[activityKey]?.from as number) || speedRange[0],
            (filters[activityKey]?.to as number) || speedRange[1],
          ]}
          min={speedRange[0]}
          max={speedRange[1]}
          step={0.01}
          defaultValue={speedRange}
          marks={{
            [speedRange[0]]: {
              label: ((speedRange[0] * 18) / 5).toFixed(1) + " km/h",
              style: {
                color: "white",
                paddingLeft: "1.3rem",
              },
            },
            [speedRange[1]]: {
              label: ((speedRange[1] * 18) / 5).toFixed(1) + " km/h",
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

export default SpeedFilter;
