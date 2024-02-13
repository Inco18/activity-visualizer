import React from "react";
import AppNav from "./AppNav";

const AppLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full">
      <AppNav />
      {props.children}
    </div>
  );
};

export default AppLayout;
