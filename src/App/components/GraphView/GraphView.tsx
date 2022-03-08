import { Box, LinearProgress, Paper } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Network, NetworkGraph, PowerIterator } from "../../../PageRank";
import { useAppDispatch, useAppSelector } from "../../hooks";
import GraphControls from "./GraphControls/GraphControls";
import "./GraphView.scss";
import NodeInfo from "./NodeInfo/NodeInfo";
import {
   selectGraphSettingsData,
   selectProbVector,
   setPowerIterIsRunning,
   setProbVector,
   setSelectedNode,
} from "./GraphView.store";

interface GraphViewProps { }

// Initialize external classes needed to compute PageRank
let network = Network.default();
let powerIterator = PowerIterator.default(network);
let cytoGraph = new NetworkGraph();

const GraphView: React.FC<GraphViewProps> = () => {
   const dispatch = useAppDispatch();
   const cyContainer = useRef(null);

   const [currentStep, setCurrentStep] = useState<number>(0);

   // Internal State of the GraphView Store
   const graphSettingsData = useAppSelector(selectGraphSettingsData);
   const probVector = useAppSelector(selectProbVector);

   /** Mount the CytoGraph canvas once the element is ready. */
   useEffect(() => cytoGraph.mountOn(cyContainer.current!), [cyContainer]);

   /** Executed every time the graph settings data are updated */
   useEffect(() => {
      // Update the network with the current adjacency list and matrix formula
      network.updateWith(graphSettingsData.graph, graphSettingsData.matrixFormula);

      // Reset the power iterator
      powerIterator.resetWith(network, graphSettingsData.maxIter, graphSettingsData.iterSpeed);
      updateProbVector();

      dispatch(setPowerIterIsRunning(false));

      // Display the graph
      cytoGraph.clear();
      cytoGraph.addNetwork(network.getEdges(), powerIterator.getRVector()).rerun();

      //
      cytoGraph.removeAllClickListeners();

      cytoGraph.onNodeClick((ev) => dispatch(setSelectedNode(ev.target.id())));
      cytoGraph.onBgClick(() => dispatch(setSelectedNode(null)));
      cytoGraph.onEdgeClick(() => dispatch(setSelectedNode(null)));
   }, [graphSettingsData]);

   /** Update the Cytoscape graph every time the probability vector is updated.  */
   useEffect(() => cytoGraph.updateProb(probVector), [probVector]);

   const updateProbVector = () => {
      dispatch(setProbVector(powerIterator.getRVector()));
      setCurrentStep(powerIterator.getCurrentStep())
   }

   const handleNextPowerIter = useCallback(() => {
      powerIterator.next();
      updateProbVector();
   }, [dispatch]);

   const handleRerunGraph = () => {
      cytoGraph.rerun();
   };

   const handleRestartPowerIter = () => {
      powerIterator.reset();
      updateProbVector();
      dispatch(setPowerIterIsRunning(false));
   };

   const handleStartPausePowerIter = () => {
      if (powerIterator.isPaused()) {
         powerIterator.run(() => updateProbVector());
         dispatch(setPowerIterIsRunning(true));
      } else {
         powerIterator.pause();
         dispatch(setPowerIterIsRunning(false));
      }
   };

   return (
      <Box className="graphView" height="100%" sx={{ display: "flex", flexDirection: "column" }}>
         <Paper variant="outlined" elevation={0} className="graph-controls-bar">
            <GraphControls
               onRerunGraph={handleRerunGraph}
               onNextPowerIter={handleNextPowerIter}
               onRestartPowerIteration={handleRestartPowerIter}
               onStartPausePowerIter={handleStartPausePowerIter}
               onFitGraph={() => cytoGraph.fit()}
               onZoomIn={() => cytoGraph.zoomIn()}
               onZoomOut={() => cytoGraph.zoomOut()}
               currentStep={currentStep}
               maxIter={graphSettingsData.maxIter}
            ></GraphControls>
         </Paper>

         <Paper elevation={0} sx={{ boxShadow: "none" }} className="graph-container" ref={cyContainer}></Paper>

         <Paper variant="outlined" elevation={0} className="node-info-bar">
            <NodeInfo
               network={network}
               cytoGraph={cytoGraph}
            ></NodeInfo>
         </Paper>
      </Box>
   );
};

export default GraphView;
