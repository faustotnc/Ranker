import { Slider, Stack, Typography } from "@mui/material";
import * as React from "react";
import katex from "katex";

interface AdjustPowerIterProps {}

const AdjustPowerIter: React.FC<AdjustPowerIterProps> = () => {
   const [maxIterations, setMaxIterations] = React.useState(10);

   const handleChange = (e: any) => {
      setMaxIterations(e.target.value);

      console.log(e.target.value);
   };

   return (
      <div>
         <Typography variant="caption" component="p" className="section-description caption-text">
            The power iteration algorithm is an approximation method for computing the eigenvectors of a
            matrix. It the uses the following recursive formula to find the principal eigenvector of a matrix{" "}
            <var>M</var>.
         </Typography>

         <div
            style={{
               marginBottom: "16px",
               textAlign: "center",
               fontSize: "26px",
            }}
            dangerouslySetInnerHTML={{
               __html: katex.renderToString("\\vec{r}_{n+1} = \\frac{M \\vec{r}_{n}}{||M \\vec{r}_{n} ||}", {
                  throwOnError: false,
               }),
            }}
         />

         <Typography component="legend" sx={{ opacity: 0.7 }}>
            Max Iterations
         </Typography>
         <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <span>10</span>
            <Slider
               min={0}
               max={200}
               valueLabelDisplay="auto"
               aria-label="Iterations"
               value={maxIterations}
               onChange={handleChange}
            />
            <span>200</span>
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
            />
            <span>Slow</span>
         </Stack>
      </div>
   );
};

export default AdjustPowerIter;
