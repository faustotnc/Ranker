import BackIcon from "@mui/icons-material/NavigateBefore";
import { Box, Divider, IconButton, Paper, Typography } from "@mui/material";
import * as React from "react";
import { toggleOpenEditor } from "../../AppSettings.store";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { ColorButton } from "../../theme";
import { generateAdjListFromInputs } from "../../utils";
import { setGraphSettingsData } from "../GraphView/GraphView.store";
import AdjustPowerIter from "./AdjustPowerIter/AdjustPowerIter";
import {
   GraphSettingsData,
   selectIterSpeed,
   selectMatrixFormula,
   selectMaxIter,
   selectNodeList,
   selectSettingsHaveChanged,
   setChangesHaveExecuted,
} from "./Editor.store";
import "./EditorSideBar.scss";
import NodeDetails from "./NodeDetails/GraphNodes";
import SelectMatrixFormula from "./SelectMatrixFormula/SelectMatrixFormula";

interface EditorProps {}

const Editor: React.FC<EditorProps> = () => {
   const dispatch = useAppDispatch();
   const graphSettingsHaveChanged = useAppSelector(selectSettingsHaveChanged);

   // Graph Setting Values
   const nodeList = useAppSelector(selectNodeList);
   const matrixFormulaVal = useAppSelector(selectMatrixFormula);
   const maxIterVal = useAppSelector(selectMaxIter);
   const iterSpeedVal = useAppSelector(selectIterSpeed);

   const handleUpdateGraph = (e: React.BaseSyntheticEvent) => {
      e.preventDefault();

      const graphSettings: GraphSettingsData = {
         graph: generateAdjListFromInputs(nodeList),
         matrixFormula: matrixFormulaVal,
         maxIter: maxIterVal,
         iterSpeed: iterSpeedVal,
      };

      dispatch(setGraphSettingsData(graphSettings));
      dispatch(setChangesHaveExecuted());
   };

   return (
      <div className="graph-editor-sidebar">
         <form onSubmit={handleUpdateGraph} autoComplete="off" autoCapitalize="off">
            <Paper
               variant="outlined"
               elevation={0}
               className="editor-header"
               sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
               <Box sx={{ display: "flex" }}>
                  <Typography variant="h6" component="p">
                     Editor
                  </Typography>
               </Box>

               <div>
                  <ColorButton
                     size="small"
                     variant="contained"
                     disableElevation
                     className="rounded"
                     type="submit"
                     disabled={!graphSettingsHaveChanged}
                  >
                     Update Graph
                  </ColorButton>

                  <IconButton
                     aria-label="close editor"
                     color="primary"
                     onClick={() => dispatch(toggleOpenEditor())}
                     className="close-editor"
                  >
                     <BackIcon />
                  </IconButton>
               </div>
            </Paper>

            <div className="editor-content">
               <div className="editor-section">
                  <Typography variant="subtitle1" component="p" className="section-title">
                     Node Details
                  </Typography>

                  <Typography variant="caption" component="p" className="section-description caption-text">
                     Insert each node in the form of an adjacency list. Please keep node names between 1 and 3
                     characters long.
                  </Typography>

                  <NodeDetails></NodeDetails>

                  <Typography variant="caption" component="p" sx={{ mt: "16px" }} className="caption-text">
                     <b>NOTE:</b> A node will only be rendered if there exists an edge between that node and itself, or
                     between that node and another node.
                  </Typography>
               </div>

               <Divider />

               <div className="editor-section">
                  <Typography variant="subtitle1" component="p" className="section-title">
                     Matrix Formulation
                  </Typography>

                  <Typography variant="caption" component="p" className="section-description caption-text">
                     Select the method used to compute the column-stochastic matrix. This matrix will represent the
                     network as a set of flow equations.
                  </Typography>

                  <SelectMatrixFormula></SelectMatrixFormula>
               </div>

               <Divider />

               <div className="editor-section">
                  <Typography variant="subtitle1" component="p" className="section-title">
                     Power Iterator
                  </Typography>

                  <AdjustPowerIter></AdjustPowerIter>
               </div>
            </div>
         </form>
      </div>
   );
};

export default Editor;
