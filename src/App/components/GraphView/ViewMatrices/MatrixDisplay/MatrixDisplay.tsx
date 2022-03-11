import ArrowForward from "@mui/icons-material/ArrowForward";
import {
   Box,
   Divider,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Typography,
} from "@mui/material";
import * as React from "react";
import { getColorCodes } from "../../../../../PageRank";

interface MatrixDisplayProps {
   title: string;
   nodes: string[];
   matrix: number[][];
}

const singleTableCell = (id: number, from: string, to: string, maxVal: number, val: number) => {
   const colors = getColorCodes(Number(val), 0, maxVal);
   const rounded_4 = Math.round(val * 10000) / 10000;

   return (
      <TableCell
         align="center"
         key={id}
         sx={{
            color: colors.fg,
            background: colors.bg,
            minWidth: "64px",
            padding: 0,
            "&:hover .edge-name": {
               height: "auto",
               opacity: 1,
            },
         }}
      >
         <Box className="value-container" sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box className="edge-name" sx={{ fontSize: 12, height: 0, opacity: 0 }}>
               {from}
               <ArrowForward sx={{ fontSize: 12, position: "relative", top: "2px" }} />
               {to}
            </Box>
            {rounded_4}
         </Box>
      </TableCell>
   );
};

const MatrixDisplay: React.FunctionComponent<MatrixDisplayProps> = ({ title, nodes, matrix }) => {
   const maxVal = Math.max(...matrix.flat());

   return (
      <Paper
         variant="outlined"
         elevation={0}
         sx={{ width: "90%", maxWidth: nodes.length <= 16 ? "800px" : "1100px", my: "32px", borderRadius: "8px" }}
      >
         <Typography variant="h5" component="p" sx={{ my: "16px", textAlign: "center" }}>
            {title}
         </Typography>

         <Divider />

         <TableContainer sx={{ pl: "16px", pr: "40px", pb: "32px", "& *": { border: "0 !important" } }}>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell></TableCell>
                     {nodes.map((node, id) => (
                        <TableCell align="center" key={id}>
                           {node}
                        </TableCell>
                     ))}
                  </TableRow>
               </TableHead>
               <TableBody>
                  {matrix.map((row, rid) => (
                     <TableRow
                        key={rid}
                        sx={{
                           "&:first-of-type td:nth-of-type(2)": {
                              borderTopLeftRadius: "8px",
                           },
                           "&:first-of-type td:last-of-type": {
                              borderTopRightRadius: "8px",
                           },
                           "&:last-child td:nth-of-type(2)": {
                              borderBottomLeftRadius: "8px",
                           },
                           "&:last-child td:last-of-type": {
                              borderBottomRightRadius: "8px",
                           },
                        }}
                     >
                        <TableCell key={0} align="center">
                           {nodes[rid]}
                        </TableCell>
                        {row.map((val, cid) => singleTableCell(cid + 1, nodes[rid], nodes[cid], maxVal, val))}
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </Paper>
   );
};

export default MatrixDisplay;
