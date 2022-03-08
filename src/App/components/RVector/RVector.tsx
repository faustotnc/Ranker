import { Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { getColorCode } from "../../../PageRank";
import { useAppSelector } from "../../hooks";
import "./RVector.scss";
import { selectProbVector } from "../GraphView/GraphView.store";

interface RVectorProps { }

const RVector: React.FC<RVectorProps> = () => {
   let currentTheme = useTheme();
   let probVector = useAppSelector(selectProbVector);
   const [vectorCells, setVectorCells] = React.useState<JSX.Element[]>([]);

   React.useEffect(() => {
      let cells = Object.entries(probVector).map((p) => {
         let probMin = Math.min(...Object.values(probVector).map((p) => p * 100));
         let probMax = Math.max(...Object.values(probVector).map((p) => p * 100));
         let color = getColorCode(p[1] * 100, probMin, probMax);

         return (
            <Box className="cell" sx={{ display: "flex", alignItems: "center" }} key={p[0]}>
               <Box className="cell-value" sx={{ color: color.fg, backgroundColor: color.bg }}>
                  {+(p[1] * 100).toFixed(3)}
               </Box>
               <span className="cell-name">{p[0]}</span>
            </Box>
         );
      });

      setVectorCells(cells);
   }, [probVector]);

   let vectorMathImage =
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
