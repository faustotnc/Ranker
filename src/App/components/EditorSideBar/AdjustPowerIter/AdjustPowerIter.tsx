import { Slider, Stack, Typography } from "@mui/material";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import KatexEq from "../../KatexEq/KetexEq";
import { setIterSpeed, setMaxIter } from "../Editor.store";
import "./AdjustPowerIter.scss";

interface AdjustPowerIterProps {}

const AdjustPowerIter: React.FC<AdjustPowerIterProps> = () => {
   const dispatch = useAppDispatch();
   const maxIter = useAppSelector((state) => state.editor.maxIter);
   const iterSpeed = useAppSelector((state) => state.editor.iterSpeed);

   const handleChangeMaxIter = (e: any) => {
      dispatch(setMaxIter(Number(e.target.value)));
   };

   const handleChangeIterSpeed = (e: any) => {
      dispatch(setIterSpeed(Number(e.target.value)));
   };

   return (
      <div>
         <Typography variant="caption" component="p" className="section-description caption-text">
            The power iteration algorithm is an approximation method for computing the eigenvectors of a matrix. It uses
            the following recursive formula to find the principal eigenvector <KatexEq>{"\\vec{r}"}</KatexEq> of a
            matrix <KatexEq>M</KatexEq>:
         </Typography>

         <div className="equation">
            <KatexEq>{"\\vec{r}_{n+1} = \\frac{M \\vec{r}_{n}}{||M \\vec{r}_{n} ||}"}</KatexEq>
         </div>

         <Typography variant="caption" component="p" className="caption-text">
            However, because <KatexEq>M</KatexEq> is column-stochastic and <KatexEq>{"\\vec{r}"}</KatexEq> is a
            probability vector, <KatexEq>{"||M \\vec{r}_{n} || = 1"}</KatexEq>, and we can reduce the power iteration
            formula to:
         </Typography>

         <div className="equation">
            <KatexEq>{"\\vec{r}_{n+1} = M \\vec{r}_{n}"}</KatexEq>
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
               onChange={handleChangeMaxIter}
            />
            <span>100</span>
         </Stack>

         <Typography component="legend" sx={{ mt: "24px", opacity: 0.7 }}>
            Iteration Speed
         </Typography>
         <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <span>Fast</span>
            <Slider
               aria-label="Iteration Speed"
               defaultValue={1}
               // getAriaValueText={valuetext}
               valueLabelDisplay="auto"
               step={0.25}
               marks
               min={0.25}
               max={1.75}
               value={iterSpeed}
               onChange={handleChangeIterSpeed}
            />
            <span>Slow</span>
         </Stack>
      </div>
   );
};

export default AdjustPowerIter;
