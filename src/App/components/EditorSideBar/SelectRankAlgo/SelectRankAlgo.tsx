import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RankAlgorithm, setRankAlgo } from "../Editor.store";
import "./SelectRankAlgo.scss";
import katex from "katex";

interface SelectRankAlgoProps {}

const SelectRankAlgo: React.FC<SelectRankAlgoProps> = () => {
   const dispatch = useAppDispatch();
   const rankAlgo = useAppSelector((state) => state.editor.rankAlgo);

   const handleChange = (e: SelectChangeEvent) => {
      let value = Number.parseInt(e.target.value) as RankAlgorithm;
      dispatch(setRankAlgo(value));
   };

   let flowEquation = "";
   let matrixComposing = "";

   if (rankAlgo === RankAlgorithm.Simple) {
      flowEquation = katex.renderToString(
         "\\vec{r}_j = \\displaystyle\\sum_{i \\rightarrow j}{\\big ( \\frac{\\vec{r}_i}{d_i} \\big ) }",
         { throwOnError: false }
      );

      matrixComposing = katex.renderToString(
         "M_{ji} = \\begin{cases} 1/d_i & i \\rightarrow j \\\\ 0 & \\text{otherwise} \\end{cases}",
         { throwOnError: false }
      );
   } else if (rankAlgo === RankAlgorithm.Stochastic) {
      flowEquation = katex.renderToString(
         "\\vec{r}_j = \\displaystyle\\sum_{i \\rightarrow j}{\\big ( \\frac{\\vec{r}_i}{d_i} + \\frac{1}{N} \\big ) }",
         { throwOnError: false }
      );

      matrixComposing = katex.renderToString(
         "M_{ji} = \\begin{cases} 1/d_i & i \\rightarrow j \\\\ 1/N & \\text{otherwise} \\end{cases}",
         { throwOnError: false }
      );
   } else {
      flowEquation = katex.renderToString(
         "\\vec{r}_j = \\displaystyle\\sum_{i \\rightarrow j}{\\big ( \\frac{\\beta \\vec{r}_i}{d_i} + \\frac{1 - \\beta}{N} \\big ) }",
         { throwOnError: false }
      );

      matrixComposing = katex.renderToString(
         "M_{ji} = \\begin{cases} \\beta/d_i & i \\rightarrow j \\\\ (1 - \\beta)/N & \\text{otherwise} \\end{cases}",
         { throwOnError: false }
      );
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
               <MenuItem value={RankAlgorithm.Simple}>Simple PageRank</MenuItem>
               <MenuItem value={RankAlgorithm.Stochastic}>Ensure Column-Stochastic</MenuItem>
               <MenuItem value={RankAlgorithm.Google}>Google's PageRank</MenuItem>
            </Select>
         </FormControl>

         <Typography variant="caption" component="p" className="caption-text" sx={{ mt: "16px" }}>
            This algorithm uses the following flow equation:
         </Typography>

         <div className="equation">
            <div
               style={{ fontSize: rankAlgo === RankAlgorithm.Simple ? "26px" : "18px" }}
               dangerouslySetInnerHTML={{ __html: flowEquation }}
            />
         </div>

         <Typography variant="caption" component="p" className="caption-text" sx={{ mt: "16px" }}>
            Which, algorithmically speaking, composes the column-stochastic matrix as follows:
         </Typography>

         <div className="equation">
            <div
               style={{ fontSize: rankAlgo === RankAlgorithm.Google ? "16px" : "18px" }}
               dangerouslySetInnerHTML={{ __html: matrixComposing }}
            />
         </div>
      </div>
   );
};

export default SelectRankAlgo;
