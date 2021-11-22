import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SingleInputNode {
   name: string;
   children: string;
}

// Define a type for the slice state
interface editorSliceState {
   nodes: SingleInputNode[];
}

// Define the initial state using that type
const initialState: editorSliceState = {
   nodes: [],
};

export const editorSlice = createSlice({
   name: "editor",
   initialState,
   reducers: {
      addNode: (state) => {
         state.nodes.push({ name: "", children: "" });
      },
      addNamedNode: (state, action: PayloadAction<SingleInputNode>) => {
         state.nodes.push(action.payload);
      },
      removeNode: (state, action: PayloadAction<number>) => {
         state.nodes.splice(action.payload, 1);
      },
      updateNode: (state, action: PayloadAction<{ id: number } & SingleInputNode>) => {
         state.nodes[action.payload.id] = { name: action.payload.name, children: action.payload.children };
      },
   },
});

// Action creators are generated for each case reducer function
export const { addNode, addNamedNode, removeNode, updateNode } = editorSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectNodes = (state: RootState) => state.counter.nodes;

export default editorSlice.reducer;
