import { Button, Icon, IconButton, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import "./GraphControls.scss";

// ICONS
import RedoIcon from "@mui/icons-material/Redo";
import PlayIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
import TableViewIcon from "@mui/icons-material/TableView";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import FitScreenIcon from "@mui/icons-material/FitScreen";

interface GraphControlsProps {
   onNextPowerIter: () => void;
   onRerunGraph: () => void;
}

const GraphControls: React.FC<GraphControlsProps> = (props: GraphControlsProps) => {
   return (
      <Box
         className="graph-controls"
         sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingX: "16px",
         }}
      >
         <Box className="power-icons">
            <Tooltip title="Reset Graph">
               <IconButton aria-label="delete" onClick={() => props.onRerunGraph()}>
                  <RefreshIcon />
               </IconButton>
            </Tooltip>

            <Tooltip title="Start Power Iteration">
               <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  className="rounded"
                  aria-label="start/pause"
                  startIcon={<PlayIcon />}
               >
                  Start
               </Button>
            </Tooltip>

            <Tooltip title="Next Iteration">
               <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  className="rounded"
                  aria-label="start/pause"
                  startIcon={<RedoIcon />}
                  onClick={() => props.onNextPowerIter()}
               >
                  Next Step
               </Button>
            </Tooltip>
         </Box>

         <Box>
            <Tooltip title="Fit Graph">
               <IconButton aria-label="delete">
                  <FitScreenIcon />
               </IconButton>
            </Tooltip>

            <Tooltip title="Zoom In">
               <IconButton aria-label="delete">
                  <ZoomInIcon />
               </IconButton>
            </Tooltip>

            <Tooltip title="Zoom Out">
               <IconButton aria-label="delete">
                  <ZoomOutIcon />
               </IconButton>
            </Tooltip>

            <Button
               size="small"
               variant="contained"
               disableElevation
               className="rounded"
               aria-label="start/pause"
               endIcon={<TableViewIcon />}
            >
               View Matrices
            </Button>
         </Box>
      </Box>
   );
};

export default GraphControls;
