import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { StringNumberPairs } from "../../utils";
import { GraphSettingsData, MatrixFormula } from "../EditorSideBar/Editor.store";

// Define a type for the slice state
interface GraphViewSliceState {
   graphSettingsData: GraphSettingsData;
   probVector: StringNumberPairs;
   powerIterIsRunning: boolean;
   selectedNode: string | null;
}

// Define the initial state of the store
const initialState: GraphViewSliceState = {
   graphSettingsData: {
      graph: [],
      matrixFormula: MatrixFormula.Simple,
      maxIter: 0,
      iterSpeed: 0,
   },
   probVector: {},
   powerIterIsRunning: false,
   selectedNode: null,
};

export const graphViewSlice = createSlice({
   name: "editor",
   initialState,
   reducers: {
      setGraphSettingsData: (state, action: PayloadAction<GraphSettingsData>) => {
         state.graphSettingsData = action.payload;
         // state.powerIterIsRunning = false;
      },
      setProbVector: (state, action: PayloadAction<StringNumberPairs>) => {
         state.probVector = action.payload;
      },
      setPowerIterIsRunning: (state, action: PayloadAction<boolean>) => {
         state.powerIterIsRunning = action.payload;
      },
      setSelectedNode: (state, action: PayloadAction<string | null>) => {
         state.selectedNode = action.payload;
      },
   },
});

// Action creators are generated for each case reducer function
export const { setGraphSettingsData, setProbVector, setPowerIterIsRunning, setSelectedNode } = graphViewSlice.actions;

export const selectGraphSettingsData = (state: RootState) => state.graphView.graphSettingsData;
export const selectProbVector = (state: RootState) => state.graphView.probVector;
export const selectPowerIterIsRunning = (state: RootState) => state.graphView.powerIterIsRunning;
export const selectSelectedNode = (state: RootState) => state.graphView.selectedNode;

export default graphViewSlice.reducer;
