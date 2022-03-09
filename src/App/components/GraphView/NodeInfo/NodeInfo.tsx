import { IconButton, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import "./NodeInfo.scss";
import CenterIcon from "@mui/icons-material/Adjust";
import { getColorCode, Network, NetworkGraph } from "../../../../PageRank";
import { useAppSelector } from "../../../hooks";
import { selectProbVector, selectSelectedNode } from "../GraphView.store";

interface NodeInfoProps {
   network: Network<string>;
   cytoGraph: NetworkGraph;
}

const NodeInfo: React.FC<NodeInfoProps> = (props) => {
   const selectedNode = useAppSelector(selectSelectedNode);
   const probVector = useAppSelector(selectProbVector);
   const probMin = Math.min(...Object.values(probVector).map((p) => p * 100));
   const probMax = Math.max(...Object.values(probVector).map((p) => p * 100));

   const nodeColor = selectedNode ? getColorCode(probVector[selectedNode] * 100, probMin, probMax) : { bg: "", fg: "" };

   let nodeParents = "*None*";
   if (selectedNode) {
      const parents = props.network.getParentsOf(selectedNode);

      if (parents.length > 4) {
         nodeParents = parents.slice(0, 4).join(", ") + " (...)";
      } else if (parents.length > 0) {
         nodeParents = parents.slice(0, 4).join(", ");
      }
   }

   let nodeChildren = "*None*";
   if (selectedNode) {
      const parents = props.network.getChildrenOf(selectedNode);

      if (parents.length > 4) {
         nodeChildren = parents.slice(0, 4).join(", ") + " (...)";
      } else if (parents.length > 0) {
         nodeChildren = parents.slice(0, 4).join(", ");
      }
   }

   if (selectedNode === null) {
      return (
         <Box
            className="select-node"
            sx={{
               display: "flex",
               flexDirection: "row",
               justifyContent: "center",
               alignItems: "center",
               paddingX: "16px",
            }}
         >
            <span>Select a Node</span>
         </Box>
      );
   } else {
      return (
         <Box
            className="node-info"
            sx={{
               display: "flex",
               flexDirection: "row",
               justifyContent: "space-between",
               alignItems: "center",
               paddingX: "16px",
            }}
         >
            <Box
               sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
               }}
            >
               <div className="active-node" style={{ background: nodeColor.bg, color: nodeColor.fg }}>
                  {selectedNode}
               </div>

               <div className="node-detail rank">
                  Rank: <span>{+(probVector[selectedNode] * 100).toFixed(3)}</span>
               </div>
               <div className="node-detail parents">
                  Parent(s): <span>{nodeParents}</span>
               </div>
               <div className="node-detail children">
                  Children: <span>{nodeChildren}</span>
               </div>
               {/* out minus in */}
               <div className="node-detail retention">
                  Divergence:{" "}
                  <span>
                     {props.network.getChildrenOf(selectedNode).length -
                        props.network.getParentsOf(selectedNode).length}
                  </span>
               </div>
            </Box>

            <Tooltip title="Focus Node" placement="top">
               <IconButton
                  onClick={() => {
                     if (selectedNode) props.cytoGraph.fitTo(selectedNode);
                  }}
               >
                  <CenterIcon />
               </IconButton>
            </Tooltip>
         </Box>
      );
   }
};

export default NodeInfo;
