import { Box } from "@mui/system";
import * as React from "react";
import "./NodeInfo.scss";

interface NodeInfoProps {}

const NodeInfo: React.FC<NodeInfoProps> = () => {
   return (
      <Box
         className="node-info"
         sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingX: "16px",
         }}
      >
         <div className="active-node">A</div>

         <div className="node-detail">Rank: <span>39.66</span></div>
         <div className="node-detail">Parent(s): <span>A, C, B, K (...)</span></div>
         <div className="node-detail">Children: <span>A, C, B, K (...)</span></div>
         {/* in-out */}
         <div className="node-detail">Retention: <span>-3</span></div>
      </Box>
   );
};

export default NodeInfo;
