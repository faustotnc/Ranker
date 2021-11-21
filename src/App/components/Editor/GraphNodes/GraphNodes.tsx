import React from "react";
import "./GraphNodes.scss";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import NodeInputs from "./NodeInputs";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { addNode } from "../Editor.store";
import { updateNetwork } from "../../GraphView/GraphView.store";
import { AdjacencyList } from "../../../../PageRank";

interface GraphNodesProps {}

const GraphNodes: React.FC<GraphNodesProps> = (props: GraphNodesProps) => {
   const nodeList = useAppSelector((state) => state.editor.nodes);
   const dispatch = useAppDispatch();

   const handleUpdateGraph = (e: any) => {
      e.preventDefault();

      let discoverdNodes: { [key: string]: number } = {}; // used to compute initial prob vector.

      let adjacencyList: AdjacencyList<string> = nodeList.map((node) => {
         discoverdNodes[node.name] = 0;

         return {
            from: node.name,
            to: node.children.split(",").map((n) => {
               n = n.trim();
               discoverdNodes[n] = 0;
               return n;
            }),
         };
      });

      let nodes = Object.keys(discoverdNodes);
      nodes.forEach((node) => (discoverdNodes[node] = 1 / nodes.length));

      dispatch(
         updateNetwork({
            list: adjacencyList,
            prob: discoverdNodes,
         })
      );
   };

   return (
      <Box>
         <h2>Graph Details</h2>
         <p>Enter the nodes in the graph in the form of an adjacency-list </p>

         <form onSubmit={handleUpdateGraph} autoComplete="off" autoCapitalize="off">
            <Box className="node-list">
               <NodeInputs></NodeInputs>
            </Box>

            <Box className="actions">
               <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  className="rounded add-node"
                  onClick={() => dispatch(addNode())}
               >
                  Add Node
               </Button>

               <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  className="rounded"
                  type="submit"
                  disabled={nodeList.length <= 0}
               >
                  Update Graph
               </Button>
            </Box>
         </form>
      </Box>
   );
};

export default GraphNodes;
