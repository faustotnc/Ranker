import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import * as React from "react";
import { getColorCodes } from "../../../PageRank";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectProbVector, setSelectedNode } from "../GraphView/GraphView.store";
import "./RVector.scss";

interface RVectorProps {}

const RVector: React.FC<RVectorProps> = () => {
   const dispatch = useAppDispatch();
   const currentTheme = useTheme();
   const probVector = useAppSelector(selectProbVector);
   const [vectorCells, setVectorCells] = React.useState<JSX.Element[]>([]);

   React.useEffect(() => {
      const cells = Object.entries(probVector).map((p) => {
         const probMin = Math.min(...Object.values(probVector).map((p) => p * 100));
         const probMax = Math.max(...Object.values(probVector).map((p) => p * 100));
         const color = getColorCodes(p[1] * 100, probMin, probMax);

         return (
            <Box
               className="cell"
               sx={{ display: "flex", alignItems: "center" }}
               key={p[0]}
               onClick={() => dispatch(setSelectedNode(p[0]))}
            >
               <Box className="cell-value" sx={{ color: color.fg, backgroundColor: color.bg }}>
                  {p[1].toFixed(3)}
               </Box>
               <span className="cell-name">{p[0]}</span>
            </Box>
         );
      });

      setVectorCells(cells);
   }, [dispatch, probVector]);

   const vectorMathImage =
      currentTheme.palette.mode === "light"
         ? "https://chart.apis.google.com/chart?cht=tx&chl=%5Cvec%7Br%7D%20&chf=bg%2Cs%2CFFFFFF80&chco=000000&chs=50"
         : "https://chart.apis.google.com/chart?cht=tx&chl=%5Cvec%7Br%7D%20&chf=bg%2Cs%2C202226&chco=FFFFFF&chs=50";

   return (
      <Box className="vector-super-wrapper" sx={{ display: "flex", flexDirection: "row" }}>
         <div className="section-title">
            <span>Probability Vector</span>
         </div>

         <Box className="vector-container">
            <Box className="r-vector">
               <div className="vector">
                  <Box className="cell vector-symbol-cell" key="0">
                     <Box className="cell-value">
                        <img src={vectorMathImage} alt="r"></img>
                     </Box>
                  </Box>

                  {vectorCells}
               </div>
            </Box>
         </Box>
      </Box>
   );
};

export default RVector;
