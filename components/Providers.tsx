"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import ActivitiesProvider from "@/context/ActivitiesContext";

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <ActivitiesProvider>{children}</ActivitiesProvider>
    </SessionProvider>
  );
};

export default Providers;
