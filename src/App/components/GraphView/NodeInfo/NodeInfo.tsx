import { IconButton } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import "./NodeInfo.scss";
import CenterIcon from "@mui/icons-material/Adjust";

interface NodeInfoProps {}

const NodeInfo: React.FC<NodeInfoProps> = () => {
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
            <div className="active-node">A</div>

            <div className="node-detail rank">
               Rank: <span>39.66</span>
            </div>
            <div className="node-detail parents">
               Parent(s): <span>A, C, B, K (...)</span>
            </div>
            <div className="node-detail children">
               Children: <span>A, C, B, K (...)</span>
            </div>
            {/* in minus out */}
            <div className="node-detail retention">
               Retention: <span>-3</span>
            </div>
         </Box>

         <IconButton>
            <CenterIcon />
         </IconButton>
      </Box>
   );
};

export default NodeInfo;
