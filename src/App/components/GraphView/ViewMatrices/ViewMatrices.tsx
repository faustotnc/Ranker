import { Box, Paper } from "@mui/material";
import * as React from "react";
import { Network } from "../../../../PageRank";
import MatrixDisplay from "./MatrixDisplay/MatrixDisplay";
import "./ViewMatrices.scss";

interface ViewMatricesProps {
   isOpen: boolean;
   network: Network<string>;
}

const ViewMatrices: React.FC<ViewMatricesProps> = ({ isOpen, network }) => {
   const isOpenClassName = isOpen ? "isOpen" : "";
   const nodes = network.getNodes();
   const nodeTable = network.getNodeTable();

   return (
      <Paper elevation={0} sx={{ boxShadow: "none" }} className={"view-matrices-container " + isOpenClassName}>
         <Box className="title" sx={{ textAlign: "center" }}>
            <h1>Computed Matrices</h1>
         </Box>

         <Box className="matrices-wrapper" sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            <MatrixDisplay title="Adjacency Matrix" nodes={nodes} matrix={network.toAdjacencyMatrix()}></MatrixDisplay>
            <MatrixDisplay
               title="Semi Column-Stochastic Matrix"
               nodes={nodes}
               matrix={nodeTable.semiColStochasticMatrix}
            ></MatrixDisplay>
            <MatrixDisplay
               title="True Column-Stochastic Matrix"
               nodes={nodes}
               matrix={nodeTable.trueColStochasticMatrix}
            ></MatrixDisplay>
            <MatrixDisplay
               title="Google's PageRank Matrix"
               nodes={nodes}
               matrix={nodeTable.computeGoogleColStochastic(0.8)}
            ></MatrixDisplay>
         </Box>
      </Paper>
   );
};

export default React.memo(ViewMatrices);
