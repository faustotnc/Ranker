import { createSlice } from "@reduxjs/toolkit";
import { ThemeType } from "./theme";
import { getCookie } from "./utils";

// Define a type for the slice state
interface appSettingsSliceState {
   currentTheme: ThemeType;
}

let savedTheme = getCookie("theme") as ThemeType;

// Define the initial state using that type
const initialState: appSettingsSliceState = {
   currentTheme: ["light", "dark", "auto"].includes(savedTheme) ? savedTheme : "light",
};

export const appSettingsSlide = createSlice({
   name: "editor",
   initialState,
   reducers: {
      rotateTheme: (state) => {
         switch (state.currentTheme) {
            case "light":
               state.currentTheme = "dark";
               break;
            case "dark":
               state.currentTheme = "auto";
               break;
            case "auto":
               state.currentTheme = "light";
         }

         document.cookie = `theme=${state.currentTheme};max-age=86400`;
      },
   },
});

// Action creators are generated for each case reducer function
export const { rotateTheme } = appSettingsSlide.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectNodes = (state: RootState) => state.counter.nodes;

export default appSettingsSlide.reducer;
