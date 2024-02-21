import ActivityList from "@/components/app/map/ActivityList";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import React from "react";
import { activities } from "@/placeholderData";
import MapMain from "@/components/app/map/MapMain";

export const metadata: Metadata = {
  title: "Activity Visualizer - map",
  description: "All your activities on a map",
};

const App = async () => {
  const session = await getServerSession(authOptions);
  // const activitiesRes = await fetch(
  //   "https://www.strava.com/api/v3/athlete/activities",
  //   {
  //     next: { revalidate: 60 * 60 },
  //     headers: {
  //       Authorization: `Bearer ${session?.access_token}`,
  //     },
  //   }
  // );
  // const activities = await activitiesRes.json();
  return <MapMain activities={activities} />;
};

export default App;
