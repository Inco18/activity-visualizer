import { useActivities } from "@/context/ActivitiesContext";
import { SummaryActivity } from "@/types/strava/SummaryActivity";
import { Duration } from "luxon";
import Slider from "rc-slider";
import React from "react";

type Props = {
  title: string;
  activityKey: "elapsed_time" | "moving_time";
};

const TimeFilter = ({ title, activityKey }: Props) => {
  const { filters, setFilters, allActivities } = useActivities();
  const timeRange = [
    Math.floor(
      allActivities.reduce((acc, cur) => {
        return acc < cur[activityKey] ? acc : cur[activityKey];
      }, allActivities[0][activityKey])
    ),
    Math.ceil(
      allActivities.reduce((acc, cur) => {
        return acc > cur[activityKey] ? acc : cur[activityKey];
      }, allActivities[0][activityKey])
    ),
  ];

  return (
    <div className="flex flex-col flex-1 items-center justify-center text-lg min-w-48 w-full">
      {title}
      <div className="pb-5 mt-auto h-fit w-[90%]">
        <p className="text-center text-sm mb-2">
          {Duration.fromObject({
            seconds:
              parseInt(filters[activityKey]?.from as string) || timeRange[0],
          }).toFormat("hh'h' mm'm'")}{" "}
          -{" "}
          {Duration.fromObject({
            seconds:
              parseInt(filters[activityKey]?.to as string) || timeRange[1],
          }).toFormat("hh'h' mm'm'")}
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
            (filters[activityKey]?.from as number) || timeRange[0],
            (filters[activityKey]?.to as number) || timeRange[1],
          ]}
          min={timeRange[0]}
          max={timeRange[1]}
          step={1}
          defaultValue={timeRange}
          marks={{
            [timeRange[0]]: {
              label: Duration.fromObject({
                seconds: timeRange[0],
              }).toFormat("hh'h' mm'm'"),
              style: {
                color: "white",
                paddingLeft: "1.3rem",
              },
            },
            [timeRange[1]]: {
              label: Duration.fromObject({
                seconds: timeRange[1],
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

export default TimeFilter;
