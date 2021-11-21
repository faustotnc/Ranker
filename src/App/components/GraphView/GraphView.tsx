import { Box, Paper } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { Network, NetworkGraph, PowerIterator } from "../../../PageRank";
import { useAppDispatch, useAppSelector } from "../../hooks";
import GraphControls from "./GraphControls/GraphControls";
import "./GraphView.scss";
import { updateProbabilities } from "./GraphView.store";
import NodeInfo from "./NodeInfo/NodeInfo";

// function doPowerIteration(network: Network<string>) {
//    const r = new Array(network.dim).fill(1 / network.dim);
//    const powerIterator = new PowerIterator(network.toColumnStochastic(), r);
//    let prob: { [key: string]: number } = {};
//    powerIterator.doPowerIteration(10000).forEach((p, idx) => {
//       prob[network.getNode(idx)] = +(p * 100).toFixed(2);
//    });
//    return prob;
// }

// { from: "y", to: ["y", "a"] },
// { from: "a", to: ["y", "m"] },
// { from: "m", to: ["a"] },
// --------------------------
// { from: "A", to: [] },
// { from: "B", to: ["C", "A"] },
// { from: "C", to: ["B"] },
// { from: "D", to: ["A", "B"] },
// { from: "E", to: ["D", "B", "F"] },
// { from: "F", to: ["E", "B"] },
// { from: "H", to: ["B", "E"] },
// { from: "I", to: ["B", "E"] },
// { from: "J", to: ["B", "E"] },
// { from: "K", to: ["F"] },
// { from: "L", to: ["F"] },
// { from: "M", to: ["M", "N"] },
// { from: "N", to: ["M", "O", "E"] },
// { from: "O", to: ["O", "F"] },
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
    * Executed when the component is first mounted onto its parent.
    */
   useEffect(() => {
      // Create a graph if there are query parameters.
   }, []);

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
   }, [graphAdjacencyList]);

   const handleNextPowerIter = () => {
      let newR = powerIterator.next();
      let prob: { [key: string]: number } = {};

      network.getNodes().forEach((node, idx) => (prob[node] = newR[idx]));
      dispatch(updateProbabilities(prob));
      cytoGraph.updateProb(prob);
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
