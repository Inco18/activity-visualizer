"use client";
import { SummaryActivity } from "@/types/strava/SummaryActivity";
import React, { useEffect, useMemo, useState } from "react";
import ActivityList, { sortOptions } from "./ActivityList";
import { sortActivities } from "@/utils/helpers";
import Map from "./Map";
import { useActivities } from "@/context/ActivitiesContext";

export type SortByType = {
  id: number;
  value: string;
  type: string;
  name: string;
};

export type FiltersType = {
  [key: string]: {
    from?: string | number;
    to?: string | number;
    equals?: any;
  };
};

type Props = {
  activities: SummaryActivity[];
};

const MapMain = ({ activities }: Props) => {
  const { setAllActivities, allActivities } = useActivities();
  useEffect(() => setAllActivities(activities), [activities]);
  return allActivities.length > 0 ? (
    <main className="flex-1 flex flex-col lg:flex-row h-full w-full">
      <ActivityList />
      <Map />
    </main>
  ) : (
    <div></div>
  );
};

export default MapMain;
