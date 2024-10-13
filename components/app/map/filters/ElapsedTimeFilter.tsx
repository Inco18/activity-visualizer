import { useActivities } from "@/context/ActivitiesContext";
import { Duration } from "luxon";
import Slider from "rc-slider";
import React from "react";

const ElapsedTimeFilter = () => {
  const { filters, setFilters, allActivities } = useActivities();
  const elapsedTimeRange = [
    Math.floor(
      allActivities.reduce((acc, cur) => {
        return acc < cur.elapsed_time ? acc : cur.elapsed_time;
      }, allActivities[0].elapsed_time)
    ),
    Math.ceil(
      allActivities.reduce((acc, cur) => {
        return acc > cur.elapsed_time ? acc : cur.elapsed_time;
      }, allActivities[0].elapsed_time)
    ),
  ];

  return (
    <div className="flex flex-col flex-1 items-center justify-center text-lg min-w-48 w-full">
      Elapsed Time
      <div className="pb-5 mt-auto h-fit w-[90%]">
        <p className="text-center text-sm mb-2">
          {Duration.fromObject({
            seconds:
              parseInt(filters.elapsed_time?.from as string) ||
              elapsedTimeRange[0],
          }).toFormat("hh'h' mm'm'")}{" "}
          -{" "}
          {Duration.fromObject({
            seconds:
              parseInt(filters.elapsed_time?.to as string) ||
              elapsedTimeRange[1],
          }).toFormat("hh'h' mm'm'")}
        </p>
        <Slider
          range
          onChange={(val) =>
            setFilters((prev) => {
              return {
                ...prev,
                elapsed_time: {
                  from: Array.isArray(val) ? val[0] : val,
                  to: Array.isArray(val) ? val[1] : val,
                },
              };
            })
          }
          value={[
            (filters.elapsed_time?.from as number) || elapsedTimeRange[0],
            (filters.elapsed_time?.to as number) || elapsedTimeRange[1],
          ]}
          min={elapsedTimeRange[0]}
          max={elapsedTimeRange[1]}
          step={1}
          defaultValue={elapsedTimeRange}
          marks={{
            [elapsedTimeRange[0]]: {
              label: Duration.fromObject({
                seconds: elapsedTimeRange[0],
              }).toFormat("hh'h' mm'm'"),
              style: {
                color: "white",
                paddingLeft: "1.3rem",
              },
            },
            [elapsedTimeRange[1]]: {
              label: Duration.fromObject({
                seconds: elapsedTimeRange[1],
              }).toFormat("hh'h' mm'm'"),
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

export default ElapsedTimeFilter;
