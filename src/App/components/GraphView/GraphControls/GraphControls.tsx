import { Button, IconButton, LinearProgress, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { useState } from "react";
import "./GraphControls.scss";

// ICONS
import NextIcon from "@mui/icons-material/NextPlan";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RefreshIcon from "@mui/icons-material/SettingsBackupRestore";
import RestartIcon from "@mui/icons-material/RestartAlt";
import MoreIcon from "@mui/icons-material/MoreVert";
import TableViewIcon from "@mui/icons-material/TableView";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import { useAppSelector } from "../../../hooks";
import { selectPowerIterIsRunning } from "../GraphView.store";

interface GraphControlsProps {
   onNextPowerIter: () => void;
   onRerunGraph: () => void;
   onFitGraph: () => void;
   onZoomIn: () => void;
   onZoomOut: () => void;
   onRestartPowerIteration: () => void;
   onStartPausePowerIter: () => void;
   currentStep: number;
   maxIter: number;
}

const GraphControls: React.FC<GraphControlsProps> = (props: GraphControlsProps) => {
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);
   const isRunning = useAppSelector(selectPowerIterIsRunning);
   const isCompleted = props.currentStep === props.maxIter;

   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };

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
            <Tooltip title="Reset Graph Layout" className="reset-graph-layout-main-button">
               <IconButton aria-label="Reset Graph Layout" onClick={() => props.onRerunGraph()} color="primary">
                  <RefreshIcon />
               </IconButton>
            </Tooltip>

            <Tooltip title="Restart Power Iteration">
               <IconButton aria-label="Restart Power Iteration" onClick={() => props.onRestartPowerIteration()} color="primary">
                  <RestartIcon />
               </IconButton>
            </Tooltip>

            <Tooltip title={`${isRunning ? "Pause" : "Play"} Power Iteration`}>
               <IconButton
                  aria-label="Start/Pause Power Iteration"
                  onClick={() => {
                     props.onStartPausePowerIter();
                  }}
                  color="primary"
                  disabled={isCompleted}
               >
                  {isRunning && !isCompleted ? <PauseIcon /> : <PlayIcon />}
               </IconButton>
            </Tooltip>

            <Tooltip title="Next Iteration" className="no-xs-screen">
               <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  className="rounded next-step-button"
                  aria-label="start/pause"
                  startIcon={<NextIcon />}
                  onClick={() => props.onNextPowerIter()}
                  disabled={isRunning || isCompleted}
               >
                  Next Step
               </Button>
            </Tooltip>

            <Tooltip title="Next Iteration" className="no-desktop">
               <IconButton aria-label="next iteration" onClick={() => props.onNextPowerIter()} color="primary">
                  <NextIcon />
               </IconButton>
            </Tooltip>
         </Box>

         <Box className="iteration-progress-bar" sx={{ display: "flex", alignItems: "center" }}>
            <span>{props.currentStep}</span>
            <LinearProgress className="bar" variant="determinate" value={(props.currentStep / props.maxIter) * 100} sx={{ width: 300 }} />
            <span className="slash">/</span>
            <span>{props.maxIter}</span>
         </Box>

         <Box className="view-icons">
            <div className="full-buttons">
               <Tooltip title="Fit Graph">
                  <IconButton aria-label="fit graph" color="primary" onClick={() => props.onFitGraph()}>
                     <FitScreenIcon />
                  </IconButton>
               </Tooltip>

               <Tooltip title="Zoom In">
                  <IconButton aria-label="zoom in" color="primary" onClick={() => props.onZoomIn()}>
                     <ZoomInIcon />
                  </IconButton>
               </Tooltip>

               <Tooltip title="Zoom Out">
                  <IconButton aria-label="zoom out" color="primary" onClick={() => props.onZoomOut()}>
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
            </div>

            <div className="menu-buttons">
               <IconButton
                  id="graph-view-controls"
                  aria-controls="graph-view-controls-menu"
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  color="primary"
               >
                  <MoreIcon />
               </IconButton>
               <Menu
                  id="graph-view-controls-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                     "aria-labelledby": "graph-view-controls",
                  }}
               >
                  <MenuItem onClick={() => props.onRerunGraph()}>
                     <ListItemIcon>
                        <RefreshIcon fontSize="small" />
                     </ListItemIcon>
                     <ListItemText>Reset Graph Layout</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => props.onFitGraph()}>
                     <ListItemIcon>
                        <FitScreenIcon fontSize="small" />
                     </ListItemIcon>
                     <ListItemText>Fit Graph</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => props.onZoomIn()}>
                     <ListItemIcon>
                        <ZoomInIcon fontSize="small" />
                     </ListItemIcon>
                     <ListItemText>Zoom In</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => props.onZoomOut()}>
                     <ListItemIcon>
                        <ZoomOutIcon fontSize="small" />
                     </ListItemIcon>
                     <ListItemText>Zoom Out</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                     <ListItemIcon>
                        <TableViewIcon fontSize="small" />
                     </ListItemIcon>
                     <ListItemText>View Matrices</ListItemText>
                  </MenuItem>
               </Menu>
            </div>
         </Box>
      </Box>
   );
};

export default GraphControls;
