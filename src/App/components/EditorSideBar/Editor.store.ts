import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdjacencyList } from "../../../PageRank";
import { RootState } from "../../../store";

export interface SingleInputNode {
   name: string;
   children: string;
}

export enum MatrixFormula {
   Simple,
   Stochastic,
   Google,
}

// The data structure passed to the GraphView every time
// the user clicks the "Update Graph" button.
export interface GraphSettingsData {
   graph: AdjacencyList<string>,
   matrixFormula: MatrixFormula;
   maxIter: number;
   iterSpeed: number;
}

// Define a type for the slice state
interface editorSliceState {
   nodes: SingleInputNode[];
   matrixFormula: MatrixFormula;
   maxIter: number;
   iterSpeed: number;
   hasChanged: boolean;
}

// Define the initial state using that type
const initialState: editorSliceState = {
   nodes: [],
   matrixFormula: MatrixFormula.Simple,
   maxIter: 64,
   iterSpeed: 1,
   hasChanged: false,
};

export const editorSlice = createSlice({
   name: "editor",
   initialState,
   reducers: {
      addNode: (state) => {
         state.nodes.push({ name: "", children: "" });
         state.hasChanged = true;
      },
      addNamedNode: (state, action: PayloadAction<SingleInputNode>) => {
         state.nodes.push(action.payload);
         state.hasChanged = true;
      },
      removeNode: (state, action: PayloadAction<number>) => {
         state.nodes.splice(action.payload, 1);
         state.hasChanged = true;
      },
      updateNode: (state, action: PayloadAction<{ id: number } & SingleInputNode>) => {
         state.nodes[action.payload.id] = { name: action.payload.name, children: action.payload.children };
         state.hasChanged = true;
      },
      setMatrixFormula: (state, action: PayloadAction<MatrixFormula>) => {
         state.matrixFormula = action.payload;
         state.hasChanged = true;
      },
      setMaxIter: (state, action: PayloadAction<number>) => {
         state.maxIter = action.payload;
         state.hasChanged = true;
      },
      setIterSpeed: (state, action: PayloadAction<number>) => {
         state.iterSpeed = action.payload;
         state.hasChanged = true;
      },
      setChangesHaveExecuted: (state) => {
         state.hasChanged = false;
      },
   },
});

// Action creators are generated for each case reducer function
export const {
   addNode,
   addNamedNode,
   removeNode,
   updateNode,
   setMatrixFormula,
   setMaxIter,
   setIterSpeed,
   setChangesHaveExecuted,
} = editorSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectMatrixFormula = (state: RootState) => state.editor.matrixFormula;
export const selectMaxIter = (state: RootState) => state.editor.maxIter;
export const selectIterSpeed = (state: RootState) => state.editor.iterSpeed;
export const selectSettingsHaveChanged = (state: RootState) => state.editor.hasChanged;
export const selectNodeList = (state: RootState) => state.editor.nodes;

export default editorSlice.reducer;

export const getGraphSettings = () => {
   console.log("Settings");
};
