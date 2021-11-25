import { Button, Paper, Typography, Divider, IconButton, Box } from "@mui/material";
import * as React from "react";
import "./EditorSideBar.scss";
import NodeDetails from "./NodeDetails/GraphNodes";
import { updateNetworkFromNodeList } from "../GraphView/GraphView.store";
import { useAppDispatch, useAppSelector } from "../../hooks";
import SelectMatrixFormula from "./SelecMatrixFormula/SelectMatrixFormula";
import BackIcon from "@mui/icons-material/NavigateBefore";
import { toggleOpenEditor } from "../../AppSettings.store";
import AdjustPowerIter from "./AdjustPowerIter/AdjustPowerIter";
import { setGraphHasBeenUpdated } from "./Editor.store";

interface EditorProps {}

const Editor: React.FC<EditorProps> = () => {
   const dispatch = useAppDispatch();
   const nodeList = useAppSelector((state) => state.editor.nodes);
   const graphSettingsHaveChanged = useAppSelector((state) => state.editor.hasChanged);

   const handleUpdateGraph = (e: any) => {
      e.preventDefault();
      dispatch(updateNetworkFromNodeList(nodeList));
      dispatch(setGraphHasBeenUpdated())
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
                  <Button
                     size="small"
                     variant="contained"
                     disableElevation
                     className="rounded"
                     type="submit"
                     disabled={!graphSettingsHaveChanged}
                  >
                     Update Graph
                  </Button>

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
