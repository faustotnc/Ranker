import { Box, Paper } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { Network, NetworkGraph, PowerIterator } from "../../../PageRank";
import { useAppDispatch, useAppSelector } from "../../hooks";
import GraphControls from "./GraphControls/GraphControls";
import "./GraphView.scss";
import { updateProbabilities } from "./GraphView.store";
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
   let cyContainer = useRef(null);
   let graphAdjacencyList = useAppSelector((state) => state.graphView.adjacencyList);
   let dispatch = useAppDispatch();

   // Initialize the network, cytoscape graph, and power iterator.
   let network = new Network<string>([]);
   let cytoGraph = new NetworkGraph();
   let powerIterator = new PowerIterator([[]], []);

   /**
    * Executed every time the network is updated
    */
   useEffect(() => {
      // Create the network and cyto-graph
      network.updateWith(graphAdjacencyList);
      cytoGraph.mountOn(cyContainer.current!);

      // Create the base probability vector (r).
      let nodes = network.getNodes();
      let baseProb: { [key: string]: number } = {};
      nodes.forEach((node) => {
         baseProb[node] = 1 / nodes.length;
      });

      // Display the graph
      cytoGraph.addNetwork(network.getEdges(), baseProb).rerun();

      // Reset the power iterator
      powerIterator = new PowerIterator(network.toColumnStochastic(), Object.values(baseProb));
      // console.log("first")
   }, [graphAdjacencyList]);

   const handleNextPowerIter = () => {
      let newR = powerIterator.next();
      let prob: { [key: string]: number } = {};

      network.getNodes().forEach((node, idx) => (prob[node] = newR[idx]));
      dispatch(updateProbabilities(prob));
      cytoGraph.updateProb(prob);
      console.log(prob);
   };

   const handleRerunGraph = () => {
      cytoGraph.rerun();
   };

   return (
      <Box className="graphView" height="100%" sx={{ display: "flex", flexDirection: "column" }}>
         <Paper variant="outlined" elevation={0} className="graph-controls-bar">
            <GraphControls
               onRerunGraph={handleRerunGraph}
               onNextPowerIter={handleNextPowerIter}
            ></GraphControls>
         </Paper>

         <Paper elevation={0} sx={{ boxShadow: "none" }} className="graphContainer" ref={cyContainer}></Paper>

         <Paper variant="outlined" elevation={0} className="node-info-bar">
            <NodeInfo></NodeInfo>
         </Paper>
      </Box>
   );
};

export default GraphView;
