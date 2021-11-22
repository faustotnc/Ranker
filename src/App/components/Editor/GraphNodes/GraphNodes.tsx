import React from "react";
import "./GraphNodes.scss";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import NodeInputs from "./NodeInputs";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { addNode } from "../Editor.store";
import { updateNetwork, updateNetworkFromNodeList } from "../../GraphView/GraphView.store";
import { AdjacencyList } from "../../../../PageRank";

interface GraphNodesProps {}

const GraphNodes: React.FC<GraphNodesProps> = (props: GraphNodesProps) => {
   const nodeList = useAppSelector((state) => state.editor.nodes);
   const dispatch = useAppDispatch();

   const handleUpdateGraph = (e: any) => {
      e.preventDefault();
      dispatch(updateNetworkFromNodeList(nodeList));
   };

   return (
      <Box>
         <h4>Graph Details</h4>
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
