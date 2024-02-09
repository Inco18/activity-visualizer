import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        strava: "#fc4c01",
        dark: {
          900: "#121212",
          800: "#1e1e1e",
          700: "#222222",
          600: "#242424",
          500: "#272727",
          400: "#2c2c2c",
          300: "#2e2e2e",
          200: "#333333",
          100: "#343434",
          50: "#383838",
        },
        material: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#eeeeee",
          300: "#e0e0e0",
          400: "#bdbdbd",
          500: "#9e9e9e",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
        },
        carbon: {
          50: "#f3f3f3",
          100: "#dcdcdc",
          200: "#bebebe",
          300: "#a4a4a4",
          400: "#8c8c8c",
          500: "#6f6f6f",
          600: "#565656",
          700: "#3d3d3d",
          800: "#282828",
          900: "#171717",
        },
        "gray-cool": {
          "010": "#fbfcfd",
          "020": "#f7f9fa",
          "030": "#f5f6f7",
          "040": "#f1f3f6",
          "050": "#edeff0",
          "100": "#dcdee0",
          "200": "#c6cace",
          "300": "#a9aeb1",
          "400": "#8d9297",
          "500": "#71767a",
          "600": "#565c65",
          "700": "#3d4551",
          "800": "#2d2e2f",
          "900": "#1c1d1f",
        },
      },
    },
  },
  plugins: [],
};
export default config;
