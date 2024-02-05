import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import Providers from "@/components/Providers";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Activity Visualizer",
  description: "The best activity visualizer powered by Strava",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
