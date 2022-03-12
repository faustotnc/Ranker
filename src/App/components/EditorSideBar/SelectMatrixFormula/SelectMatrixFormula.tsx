import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import KatexEq from "../../KatexEq/KetexEq";
import { MatrixFormula, setMatrixFormula } from "../Editor.store";
import "./SelectMatrixFormula.scss";

interface SelectMatrixFormulaProps {}

const SelectMatrixFormula: React.FC<SelectMatrixFormulaProps> = () => {
   const dispatch = useAppDispatch();
   const rankAlgo = useAppSelector((state) => state.editor.matrixFormula);

   const handleChange = (e: SelectChangeEvent) => {
      const value = Number.parseInt(e.target.value) as MatrixFormula;
      dispatch(setMatrixFormula(value));
   };

   let flowEquation = "";

   if (rankAlgo === MatrixFormula.Simple) {
      flowEquation = "r_j = \\displaystyle\\sum_{i \\rightarrow j}{\\big ( \\frac{r_i}{d_i} \\big ) }";
   } else if (rankAlgo === MatrixFormula.Stochastic) {
      flowEquation = "r_j = \\displaystyle\\sum_{i \\rightarrow j}{\\big ( \\frac{r_i}{d_i} \\big ) }";
   } else {
      flowEquation =
         "r_j = \\displaystyle\\sum_{i \\rightarrow j}{\\big ( \\frac{\\beta r_i}{d_i} + \\frac{1 - \\beta}{N} \\big ) }";
   }

   return (
      <div>
         <FormControl fullWidth>
            <Select
               labelId="demo-simple-select-label"
               id="demo-simple-select"
               value={rankAlgo.toString()}
               placeholder="Select Algorithm"
               onChange={handleChange}
               variant="filled"
               size="small"
               className="algo-selector"
            >
               <MenuItem value={MatrixFormula.Simple}>Simple Column-Stochastic</MenuItem>
               <MenuItem value={MatrixFormula.Stochastic}>True Column-Stochastic</MenuItem>
               <MenuItem value={MatrixFormula.Google}>Google&apos;s PageRank</MenuItem>
            </Select>
         </FormControl>

         <Typography variant="caption" component="p" className="caption-text" sx={{ mt: "16px" }}>
            This algorithm uses the following flow equation:
         </Typography>

         <div className="equation">
            <div style={{ fontSize: rankAlgo === MatrixFormula.Google ? "18px" : "26px" }}>
               <KatexEq>{flowEquation}</KatexEq>
            </div>
         </div>

         <Typography variant="caption" component="p" className="caption-text" sx={{ mt: "16px" }}>
            Where <KatexEq>d_i</KatexEq> is the number of links leaving node <KatexEq>i</KatexEq>. This, algorithmically
            speaking, composes the column-stochastic matrix as follows:
         </Typography>

         <div className="equation">
            <div style={{ fontSize: rankAlgo === MatrixFormula.Google ? "16px" : "18px" }}></div>
         </div>

         {rankAlgo === MatrixFormula.Simple && (
            <>
               <div className="equation" style={{ fontSize: "18px" }}>
                  <KatexEq>
                     {"M_{ji} = \\begin{cases} 1/d_i & i \\rightarrow j \\\\ 0 & \\text{otherwise} \\end{cases}"}
                  </KatexEq>
               </div>
               <Typography variant="caption" component="p" className="caption-text" sx={{ mt: "16px" }}>
                  The problem with this formulation is that it does not guarantee the matrix will be column stochastic
                  (it cannot handle dead ends) because if a node does not have any outgoing links,{" "}
                  <KatexEq>d_i = 0</KatexEq>, and we would have a division by zero error. So, instead, we insert zeros
                  for that column, which then prevents the matrix from being true column-stochastic.
               </Typography>
            </>
         )}

         {rankAlgo === MatrixFormula.Stochastic && (
            <>
               <div className="equation" style={{ fontSize: "18px" }}>
                  <KatexEq>
                     {
                        "M_{ji} = \\begin{cases} 1/d_i & i \\rightarrow j \\\\ 1/N & d_i \\leq 0 \\\\ 0 & \\text{otherwise} \\end{cases}"
                     }
                  </KatexEq>
               </div>
               <Typography variant="caption" component="p" className="caption-text" sx={{ mt: "16px" }}>
                  The only difference between the true column-stochastic formulation and the simple column-stochastic
                  formulation is that when <KatexEq>d_i = 0</KatexEq>, instead of inserting a zero at that cell, we
                  insert <KatexEq>1 / N</KatexEq>, where <KatexEq>N</KatexEq> is the number of nodes in the network.
                  This enures that the matrix is column stochastic (which solves the problem of dead ends), but still
                  does not provide a solution to spider traps.
               </Typography>
            </>
         )}

         {rankAlgo === MatrixFormula.Google && (
            <>
               <div className="equation" style={{ fontSize: "18px" }}>
                  <KatexEq>{"M_{ij}=\\beta S_{ij}+(1-\\beta) \\frac{1}{N}"}</KatexEq>
               </div>
               <Typography variant="caption" component="p" className="caption-text" sx={{ mt: "16px" }}>
                  Where <KatexEq>{"S"}</KatexEq> is the generated, true column-stochastic matrix. With this formulation,
                  a random surfer will follow an outgoing link from the current node with probability{" "}
                  <KatexEq>\beta</KatexEq>, and will jump to any other random node in the network with probability{" "}
                  <KatexEq>(1-\beta)</KatexEq>. The Google matrix solves both dead ends and spider traps.
               </Typography>
            </>
         )}
      </div>
   );
};

export default SelectMatrixFormula;
