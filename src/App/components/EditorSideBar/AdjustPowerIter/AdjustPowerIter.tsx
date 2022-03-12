import { Slider, Stack, Typography } from "@mui/material";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import KatexEq from "../../KatexEq/KetexEq";
import { selectIterSpeed, selectMaxIter, setIterSpeed, setMaxIter } from "../Editor.store";
import "./AdjustPowerIter.scss";

interface AdjustPowerIterProps {}

const AdjustPowerIter: React.FC<AdjustPowerIterProps> = () => {
   const dispatch = useAppDispatch();
   const maxIter = useAppSelector(selectMaxIter);
   const iterSpeed = useAppSelector(selectIterSpeed);

   const handleChangeMaxIter = (e: MouseEvent) => {
      if (e.target) {
         const n = Number((e.target as HTMLInputElement).value);
         dispatch(setMaxIter(n));
      }
   };

   const handleChangeIterSpeed = (e: MouseEvent) => {
      if (e.target) {
         const n = Number((e.target as HTMLInputElement).value);
         dispatch(setIterSpeed(n));
      }
   };

   return (
      <div>
         <Typography variant="caption" component="p" className="section-description caption-text">
            The power iteration algorithm is an approximation method for computing the eigenvectors of a matrix. It uses
            the following recursive formula to find the principal eigenvector <KatexEq>{"r"}</KatexEq> of a
            matrix <KatexEq>M</KatexEq>:
         </Typography>

         <div className="equation">
            <KatexEq>{"r^{(n+1)} = \\frac{M r^{(n)}}{||M r^{(n)} ||}"}</KatexEq>
         </div>

         <Typography variant="caption" component="p" className="caption-text">
            However, in the case of PageRank, the matrix <KatexEq>M</KatexEq> is column-stochastic and{" "}
            <KatexEq>{"r"}</KatexEq> is a probability vector, therefore,{" "}
            <KatexEq>{"||M r^{(n)} || = 1"}</KatexEq>, and we can reduce the power iteration formula to:
         </Typography>

         <div className="equation">
            <KatexEq>{"r^{(n+1)} = M r^{(n)}"}</KatexEq>
         </div>

         <Typography variant="caption" component="p" className="section-description caption-text">
            Select the maximum number of iterations that will be applied to the network, as well as the speed at which
            the iterations will occur.
         </Typography>
         <Typography component="legend" sx={{ opacity: 0.7 }}>
            Max Iterations
         </Typography>
         <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <span>10</span>
            <Slider
               min={10}
               max={100}
               valueLabelDisplay="auto"
               aria-label="Iterations"
               value={maxIter}
               onChange={(e) => handleChangeMaxIter(e as MouseEvent)}
            />
            <span>100</span>
         </Stack>

         <Typography component="legend" sx={{ mt: "24px", opacity: 0.7 }}>
            Iterations Per Second
         </Typography>
         <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <span>Slow</span>
            <Slider
               aria-label="Iteration Speed"
               defaultValue={1}
               // getAriaValueText={valuetext}
               valueLabelDisplay="auto"
               step={0.1}
               marks
               min={0.1}
               max={3}
               value={iterSpeed}
               onChange={(e) => handleChangeIterSpeed(e as MouseEvent)}
            />
            <span>Fast</span>
         </Stack>
      </div>
   );
};

export default AdjustPowerIter;
