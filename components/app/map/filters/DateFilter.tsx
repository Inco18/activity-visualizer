import { useActivities } from "@/context/ActivitiesContext";
import { dateToInputTypeDate } from "@/utils/helpers";
import Slider from "rc-slider";
import React from "react";

const DateFilter = () => {
  const { filters, setFilters, allActivities } = useActivities();

  const activitiesSortedByDate = allActivities.toSorted((a, b) => {
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
  });
  const dates: {
    [key: number]: { label: string; style: React.CSSProperties };
  } = {};
  for (let i = 0; i < activitiesSortedByDate.length; i++) {
    dates[
      new Date(
        new Date(activitiesSortedByDate[i].start_date).toDateString()
      ).getTime()
    ] = {
      label: new Date(
        activitiesSortedByDate[i].start_date
      ).toLocaleDateString(),
      style:
        i === 0
          ? {
              color: "white",
              paddingLeft: "2rem",
            }
          : i === activitiesSortedByDate.length - 1
          ? {
              color: "white",
              paddingRight: "2rem",
            }
          : { display: "none" },
    };
  }

  return (
    <div className="flex flex-col flex-1 items-center text-lg w-full">
      Date
      <div className="flex gap-2 w-full mb-2">
        <label className="flex flex-col text-sm flex-1">
          From:
          <input
            type="date"
            name="from"
            max={filters.start_date?.to || undefined}
            value={
              filters.start_date?.from
                ? dateToInputTypeDate(
                    new Date(filters.start_date?.from as string)
                  )
                : dateToInputTypeDate(
                    new Date(activitiesSortedByDate[0].start_date)
                  )
            }
            onChange={(e) =>
              setFilters((prev) => {
                return {
                  ...prev,
                  start_date: {
                    from: new Date(e.target.value).toDateString(),
                    to: prev.start_date?.to || undefined,
                  },
                };
              })
            }
            className="bg-dark-300 p-2 w-full relative rounded-md text-sm lg:text-base text-white hover:bg-dark-50 transition-colors text-left"
          />
        </label>
        <label className="flex flex-col text-sm flex-1">
          To:
          <input
            type="date"
            name="to"
            value={
              filters.start_date?.to
                ? dateToInputTypeDate(
                    new Date(filters.start_date?.to as string)
                  )
                : dateToInputTypeDate(
                    new Date(
                      activitiesSortedByDate[
                        activitiesSortedByDate.length - 1
                      ].start_date
                    )
                  )
            }
            min={filters.start_date?.from || undefined}
            onChange={(e) =>
              setFilters((prev) => {
                return {
                  ...prev,
                  start_date: {
                    from: prev.start_date?.from || undefined,
                    to: new Date(e.target.value).toDateString(),
                  },
                };
              })
            }
            className="bg-dark-300 p-2 w-full relative rounded-md text-sm lg:text-base text-white hover:bg-dark-50 transition-colors"
          />
        </label>
      </div>
      <div className="w-[90%]">
        <Slider
          range
          onChange={(val) =>
            setFilters((prev) => {
              return {
                ...prev,
                start_date: {
                  from: Array.isArray(val)
                    ? new Date(val[0]).toDateString()
                    : new Date(val).toDateString(),
                  to: Array.isArray(val)
                    ? new Date(val[1]).toDateString()
                    : new Date(val).toDateString(),
                },
              };
            })
          }
          value={[
            new Date(filters.start_date?.from as string).getTime() ||
              new Date(activitiesSortedByDate[0].start_date).getTime(),
            new Date(filters.start_date?.to as string).getTime() ||
              new Date(
                activitiesSortedByDate[
                  activitiesSortedByDate.length - 1
                ].start_date
              ).getTime(),
          ]}
          min={new Date(activitiesSortedByDate[0].start_date).getTime()}
          max={new Date(
            activitiesSortedByDate[activitiesSortedByDate.length - 1].start_date
          ).getTime()}
          step={null}
          defaultValue={[
            new Date(activitiesSortedByDate[0].start_date).getTime(),
            new Date(
              activitiesSortedByDate[
                activitiesSortedByDate.length - 1
              ].start_date
            ).getTime(),
          ]}
          marks={dates}
          className="[&>.rc-slider-rail]:bg-dark-300 [&>.rc-slider-track]:bg-strava [&_.rc-slider-dot]:bg-dark-50 [&_.rc-slider-dot]:border-dark-50 [&_.rc-slider-handle]:border-strava [&_.rc-slider-handle]:bg-dark-50 [&_.rc-slider-handle]:opacity-100 [&_.rc-slider-handle-dragging]:!border-strava [&_.rc-slider-handle-dragging]:!shadow-[0_0_0_5px] [&_.rc-slider-handle-dragging]:!shadow-strava/80 [&_.rc-slider-handle:focus-visible]:!border-strava [&_.rc-slider-handle:focus-visible]:!shadow-[0_0_0_5px] [&_.rc-slider-handle:focus-visible]:!shadow-strava/80 [&_.rc-slider-handle:hover]:border-strava [&_.rc-slider-handle:hover]:border-opacity-50"
        />
      </div>
    </div>
  );
};

export default DateFilter;
