import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: [
    {
      rel: "icon",
      type: "image/svg",
      url: "../icon.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={
          montserrat.className +
          " bg-black text-white h-full flex flex-col relative"
        }
      >
        <Providers>
          {children}
          <ToastContainer theme="colored" closeOnClick />
        </Providers>
      </body>
    </html>
  );
}
