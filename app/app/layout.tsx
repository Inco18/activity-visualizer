import React from "react";
import AppNav from "@/components/app/AppNav";

const AppLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full lg:flex-row">
      <AppNav />
      {props.children}
    </div>
  );
};

export default AppLayout;
