import { Metadata } from "next";
import { getServerSession } from "next-auth";
import React from "react";
import MapMain from "@/components/app/map/MapMain";
import { authOptions } from "@/utils/authOptions";
import { activities } from "@/placeholderData";

export const metadata: Metadata = {
  title: "Activity Visualizer - Map",
  description: "All your activities on a map",
};

const App = async () => {
  // const session = await getServerSession(authOptions);
  // const activitiesRes = await fetch(
  //   "https://www.strava.com/api/v3/athlete/activities?page=1&per_page=200",
  //   {
  //     cache: "no-store",
  //     headers: {
  //       Authorization: `Bearer ${session?.access_token}`,
  //     },
  //   }
  // );
  // const activities = await activitiesRes.json();
  return <MapMain activities={activities} />;
};

export default App;
