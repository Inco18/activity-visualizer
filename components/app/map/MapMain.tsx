"use client";
import { SummaryActivity } from "@/types/strava/SummaryActivity";
import React, { useEffect, useMemo, useState } from "react";
import ActivityList, { sortOptions } from "./ActivityList";
import { sortActivities } from "@/utils/helpers";
// import Map from "./Map";
import { useActivities } from "@/context/ActivitiesContext";
import dynamic from "next/dynamic";
import Spinner from "@/components/UI/Spinner";

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

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <Spinner />
    </div>
  ),
});

const MapMain = ({ activities }: Props) => {
  const { setAllActivities, allActivities } = useActivities();
  useEffect(() => setAllActivities(activities), [activities]);
  return allActivities.length > 0 ? (
    <main className="flex-1 flex flex-col lg:flex-row h-full w-full">
      <ActivityList />
      <Map />
    </main>
  ) : (
    <div className="flex items-center justify-center w-full h-full">
      <Spinner />
    </div>
  );
};

export default MapMain;
