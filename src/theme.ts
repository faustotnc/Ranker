import { ThemeOptions } from "@mui/material/styles";

export const lightTheme: ThemeOptions = {
   palette: {
      mode: "light",
      primary: {
         main: "#1976D2",
      },
      secondary: {
         main: "#19d2d2",
      },
      background: {
         default: "red"
      }
   },
};

export const darkTheme: ThemeOptions = {
   palette: {
      mode: "dark",
      primary: {
         main: "#1976D2",
      },
      secondary: {
         main: "#19d2d2",
      },
      background: {
         default: "#101213",
         paper: "#202226",
      },
   },
};