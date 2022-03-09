import { Box, Paper } from "@mui/material";
import * as React from "react";
import { CytoGraph, Network, PowerIterator } from "../../../PageRank";
import { useAppDispatch, useAppSelector } from "../../hooks";
import GraphControls from "./GraphControls/GraphControls";
import "./GraphView.scss";
import {
   selectGraphSettingsData,
   selectProbVector,
   selectSelectedNode,
   setPowerIterIsRunning,
   setProbVector,
   setSelectedNode,
} from "./GraphView.store";
import NodeInfo from "./NodeInfo/NodeInfo";
import ViewMatrices from "./ViewMatrices/ViewMatrices";

interface GraphViewProps {}

// Initialize external classes needed to compute PageRank
const network = Network.default();
const powerIterator = PowerIterator.default(network);
const cytoGraph = new CytoGraph();

const GraphView: React.FC<GraphViewProps> = () => {
   const dispatch = useAppDispatch();
   const cyContainer = React.useRef(null);
   const [viewMatricesIsOpen, setViewMatricesIsOpen] = React.useState<boolean>(false);

   const [currentStep, setCurrentStep] = React.useState<number>(0);

   // Internal State of the GraphView Store
   const graphSettingsData = useAppSelector(selectGraphSettingsData);
   const probVector = useAppSelector(selectProbVector);
   const selectedNode = useAppSelector(selectSelectedNode);

   const updateProbVector = React.useCallback(() => {
      dispatch(setProbVector(powerIterator.getRVector()));
      setCurrentStep(powerIterator.getCurrentStep());
   }, [dispatch]);

   const handleNextPowerIter = React.useCallback(() => {
      powerIterator.next();
      updateProbVector();
   }, [updateProbVector]);

   const handleRestartPowerIter = React.useCallback(() => {
      powerIterator.reset();
      updateProbVector();
      dispatch(setPowerIterIsRunning(false));
   }, [dispatch, updateProbVector]);

   const handleStartPausePowerIter = React.useCallback(() => {
      if (powerIterator.isPaused()) {
         powerIterator.run(() => updateProbVector());
         dispatch(setPowerIterIsRunning(true));
      } else {
         powerIterator.pause();
         dispatch(setPowerIterIsRunning(false));
      }
   }, [dispatch, updateProbVector]);

   /** Mount the CytoGraph canvas once the element is ready. */
   React.useEffect(() => {
      if (cyContainer.current) {
         cytoGraph.mountOn(cyContainer.current);
      }
   }, [cyContainer]);

   /** Executed every time the graph settings data are updated */
   React.useEffect(() => {
      // Update the network with the current adjacency list and matrix formula
      network.updateWith(graphSettingsData.graph, graphSettingsData.matrixFormula);

      // Reset the power iterator
      powerIterator.resetWith(network, graphSettingsData.maxIter, graphSettingsData.iterSpeed);
      updateProbVector();

      dispatch(setPowerIterIsRunning(false));

      // Display the graph
      cytoGraph.clear();
      cytoGraph.addNetwork(network.getEdges(), powerIterator.getRVector()).rerun();

      // Prevent adding many listeners every time the graph is updated
      cytoGraph.removeAllClickListeners();

      cytoGraph.onNodeClick((ev) => {
         dispatch(setSelectedNode(ev.target.id()));
      });
      cytoGraph.onBgClick(() => dispatch(setSelectedNode(null)));
      cytoGraph.onEdgeClick(() => dispatch(setSelectedNode(null)));
   }, [dispatch, graphSettingsData, updateProbVector]);

   /** Update the Cytoscape graph every time the probability vector is updated.  */
   React.useEffect(() => cytoGraph.updateProb(probVector), [probVector]);

   React.useEffect(() => {
      if (selectedNode) cytoGraph.fitTo(selectedNode);
   }, [selectedNode]);

   return (
      <Box className="graphView" height="100%" sx={{ display: "flex", flexDirection: "column" }}>
         <Paper variant="outlined" elevation={0} className="graph-controls-bar">
            <GraphControls
               onRerunGraph={() => cytoGraph.rerun()}
               onNextPowerIter={handleNextPowerIter}
               onRestartPowerIteration={handleRestartPowerIter}
               onStartPausePowerIter={handleStartPausePowerIter}
               onFitGraph={() => cytoGraph.fit()}
               onZoomIn={() => cytoGraph.zoomIn()}
               onZoomOut={() => cytoGraph.zoomOut()}
               currentStep={currentStep}
               maxIter={graphSettingsData.maxIter}
               onToggleViewMatrices={() => setViewMatricesIsOpen(!viewMatricesIsOpen)}
            ></GraphControls>
         </Paper>

         <Box className="main-view">
            <ViewMatrices isOpen={viewMatricesIsOpen} network={network}></ViewMatrices>
            <Paper
               elevation={0}
               sx={{ boxShadow: "none" }}
               className={"graph-container " + (viewMatricesIsOpen ? "isClosed" : "")}
               ref={cyContainer}
            ></Paper>
         </Box>

         <Paper variant="outlined" elevation={0} className="node-info-bar">
            <NodeInfo network={network} cytoGraph={cytoGraph}></NodeInfo>
         </Paper>
      </Box>
   );
};

export default GraphView;
