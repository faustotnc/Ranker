import {
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

const singleTableCell = (id: number, maxVal: number, val: number) => {
   const colors = getColorCodes(Number(val), 0, maxVal);

   return (
      <TableCell
         key={id}
         align="center"
         sx={{
            color: colors.fg,
            background: colors.bg,
            minWidth: "64px",
         }}
      >
         {Math.round(val * 10000) / 10000}
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
                        {row.map((val, cid) => singleTableCell(cid + 1, maxVal, val))}
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </Paper>
   );
};

export default MatrixDisplay;
