import ActivityList from "@/components/app/map/ActivityList";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import React from "react";
import { activities } from "@/placeholderData";

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
  console.log(session);
  return (
    <main className="flex-1 flex flex-col lg:flex-row h-full w-full">
      <ActivityList activities={activities} />
    </main>
  );
};

export default App;
