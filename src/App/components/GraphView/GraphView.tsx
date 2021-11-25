import { Box, Paper } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Network, NetworkGraph, PowerIterator } from "../../../PageRank";
import { useAppDispatch, useAppSelector } from "../../hooks";
import GraphControls from "./GraphControls/GraphControls";
import "./GraphView.scss";
import { resetProbabilities, updateProbabilities } from "./GraphView.store";
import NodeInfo from "./NodeInfo/NodeInfo";

// { from: "y", to: ["y", "a"] },
// { from: "a", to: ["y", "m"] },
// { from: "m", to: ["a"] },
// --------------------------
// A ->
// B -> C, A
// C -> B
// D -> A, B
// E -> D, B, F
// F -> E, B
// H -> B, E
// I -> B, E
// J -> B, E
// K -> F
// L -> F
// M -> M, N
// N -> M, O, E
// O -> O, F
// --------------------------
// { from: "A", to: ["A", "B", "C"] },
// { from: "B", to: ["C"] },
// { from: "C", to: ["A"] },
// A -> A, B, C, D
// M -> A, C, K, D
// P -> O, A, B, R

interface GraphViewProps {}

const GraphView: React.FC<GraphViewProps> = (props: GraphViewProps) => {
   let dispatch = useAppDispatch();
   let cyContainer = useRef(null);
   let graphAdjacencyList = useAppSelector((state) => state.graphView.adjacencyList);
   let probVector = useAppSelector((state) => state.graphView.probVector);
   let currentMatrixFormula = useAppSelector((state) => state.editor.matrixFormula);
   let currentPowerIterSpeed = useAppSelector((state) => state.editor.iterSpeed);
   let [powerIterControl, setPowerIterControl] = useState<"started" | "paused">("paused");
   let [powerIterTimer, setPowerIterTimer] = useState<number>(-1);

   // Initialize the network, cytoscape graph, and power iterator.
   let network = useRef(new Network<string>([]));
   let cytoGraph = useRef(new NetworkGraph());
   let powerIterator = useRef(new PowerIterator([[]], []));

   useEffect(() => {
      cytoGraph.current.mountOn(cyContainer.current!);
   }, [cyContainer]);

   /**
    * Executed every time the network is updated
    */
   useEffect(() => {
      // Create the network and cyto-graph
      network.current.updateWith(graphAdjacencyList, currentMatrixFormula);

      // Create the base probability vector (r).
      let nodes = network.current.getNodes();
      let baseProb: { [key: string]: number } = {};
      nodes.forEach((node) => {
         baseProb[node] = 1 / nodes.length;
      });

      // Display the graph
      cytoGraph.current.clear();
      cytoGraph.current.addNetwork(network.current.getEdges(), baseProb).rerun();

      // Reset the power iterator
      powerIterator.current = new PowerIterator(network.current.toColumnStochastic(), Object.values(baseProb));
   }, [graphAdjacencyList]);

   useEffect(() => {
      cytoGraph.current.updateProb(probVector);

      // Reset the power iterator
      powerIterator.current = new PowerIterator(network.current.toColumnStochastic(), Object.values(probVector));

      
   }, [probVector]);

   const handleNextPowerIter = () => {
      let newR = powerIterator.current.next();
      let prob: { [key: string]: number } = {};
      network.current.getNodes().forEach((node, idx) => (prob[node] = newR[idx]));

      dispatch(updateProbabilities(prob));
   };

   const handleRerunGraph = () => {
      cytoGraph.current.rerun();
   };

   const handleRestartPowerIter = () => {
      dispatch(resetProbabilities());
   };

   const handleStartPausePowerIter = () => {
      if (powerIterControl === "started") {
         setPowerIterControl("paused");
         window.clearTimeout(powerIterTimer);
      } else {
         setPowerIterControl("started");

         let timer = window.setInterval(() => {
            handleNextPowerIter();
         }, currentPowerIterSpeed * 1000);

         setPowerIterTimer(timer);
      }
   };

   return (
      <Box className="graphView" height="100%" sx={{ display: "flex", flexDirection: "column" }}>
         <Paper variant="outlined" elevation={0} className="graph-controls-bar">
            <GraphControls
               onRerunGraph={handleRerunGraph}
               onNextPowerIter={handleNextPowerIter}
               onFitGraph={() => cytoGraph.current.fit()}
               onZoomIn={() => cytoGraph.current.zoomIn()}
               onZoomOut={() => cytoGraph.current.zoomOut()}
               onRestartPowerIteration={() => handleRestartPowerIter()}
               onStartPausePowerIter={() => handleStartPausePowerIter()}
            ></GraphControls>
         </Paper>

         <Paper elevation={0} sx={{ boxShadow: "none" }} className="graph-container" ref={cyContainer}></Paper>

         <Paper variant="outlined" elevation={0} className="node-info-bar">
            <NodeInfo></NodeInfo>
         </Paper>
      </Box>
   );
};

export default GraphView;
