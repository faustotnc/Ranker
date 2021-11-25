import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdjacencyList } from "../../../PageRank";
import { SingleInputNode } from "../EditorSideBar/Editor.store";

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
      resetProbabilities: (state) => {
         let keys = Object.keys(state.probVector);

         keys.forEach((key) => {
            state.probVector[key] = 1 / keys.length;
         });
      },
      updateNetworkFromNodeList: (state, action: PayloadAction<SingleInputNode[]>) => {
         let discoverdNodes: { [key: string]: number } = {}; // used to compute initial prob vector.
         let nodeList: AdjacencyList<string> = [];

         let parents: { [key: string]: number } = {};
         action.payload.forEach((node) => {
            if (node.name.length === 0) return;
            let children: string[] = [];

            discoverdNodes[node.name] = 0;

            (node.children || "").split(",").forEach((n) => {
               let child = n.trim();

               if (child.length > 0) {
                  discoverdNodes[child] = 0;
                  children.push(child);
               }
            });

            let parentNames = Object.keys(parents);

            if (!parentNames.includes(node.name)) {
               parents[node.name] =
                  nodeList.push({
                     from: node.name,
                     to: children,
                  }) - 1;
            } else {
               nodeList[parents[node.name]].to = [...nodeList[parents[node.name]].to, ...children];
            }
         });

         let nodes = Object.keys(discoverdNodes);
         nodes.forEach((node) => (discoverdNodes[node] = 1 / nodes.length));

         state.adjacencyList = nodeList;
         state.probVector = discoverdNodes;
      },
   },
});

// Action creators are generated for each case reducer function
export const { updateNetwork, updateProbabilities, updateNetworkFromNodeList, resetProbabilities } =
   graphViewSlice.actions;

export default graphViewSlice.reducer;
