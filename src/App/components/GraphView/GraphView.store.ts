import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdjacencyList, Network, PowerIterator } from "../../../PageRank";
import { RootState } from "../../store";

// Define a type for the slice state
interface GraphViewSliceState<T> {
   adjacencyList: AdjacencyList<T>;
   probVector: { [key: string]: number };
}

interface UpdateNetworkPayload {
   list: AdjacencyList<string>;
   prob: { [key: string]: number };
}

// Define the initial state using that type
const initialState: GraphViewSliceState<string> = {
   adjacencyList: [],
   probVector: {},
};

export const graphViewSlice = createSlice({
   name: "editor",
   initialState,
   reducers: {
      updateNetwork: (state, action: PayloadAction<UpdateNetworkPayload>) => {
         state.adjacencyList = action.payload.list;
         state.probVector = action.payload.prob;
      },
      updateProbabilities: (state, action: PayloadAction<{ [key: string]: number }>) => {
         state.probVector = action.payload;
      },
   },
});

// Action creators are generated for each case reducer function
export const { updateNetwork, updateProbabilities } = graphViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectNodes = (state: RootState) => state.counter.nodes;

export default graphViewSlice.reducer;
