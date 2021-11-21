import React, { useState } from "react";
import "./GraphNodes.scss";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import NodeInputs, { SingleInputNode } from "./NodeInputs";

interface GraphNodesProps {}

const GraphNodes: React.FC<GraphNodesProps> = (props: GraphNodesProps) => {
   const [nodeList, setNodeList] = useState<SingleInputNode[]>([{ name: "A", children: "A, B, C" }]);

   const addNode = () => {
      setNodeList([...nodeList, { name: "", children: "" }]);
   };

   const handleUpdateGraph = (e: any) => {
      e.preventDefault();
      console.log(e);
   };

   // ------------------- TEMPLATE -------------------
   return (
      <Box>
         <h2>Graph Details</h2>
         <p>Enter the nodes in the graph in the form of an adjacency-list </p>

         <form onSubmit={handleUpdateGraph}>
            <Box className="node-list">
               <NodeInputs inputs={nodeList}></NodeInputs>
            </Box>

            <Box className="actions">
               <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  className="rounded add-node"
                  onClick={() => addNode()}
               >
                  Add Node
               </Button>

               <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  className="rounded"
                  type="submit"
                  disabled={nodeList.length <= 1}
               >
                  Update Graph
               </Button>
            </Box>
         </form>
      </Box>
   );
};

export default GraphNodes;
