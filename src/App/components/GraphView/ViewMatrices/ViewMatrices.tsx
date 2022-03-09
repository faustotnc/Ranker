import { Box, Paper } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Heatmap from "highcharts/modules/heatmap.js";
import * as React from "react";
import { Network } from "../../../../PageRank";
import "./ViewMatrices.scss";

Heatmap(Highcharts);

interface ViewMatricesProps {
   isOpen: boolean;
   network: Network<string>;
}

const toHighChartHeatmap = (matrix: number[][]) => {
   const data = [];

   for (let row_idx = 0; row_idx < matrix.length; row_idx++) {
      const row = matrix[row_idx];

      for (let i = 0; i < row.length; i++) {
         const element = row[i];
         data.push([i, row_idx, element]);
      }
   }

   return data;
};

const getPointCategoryName = (point: Highcharts.Point, dimension: string) => {
   const series = point.series;
   const isY = dimension === "y";
   const axis = series[isY ? "yAxis" : "xAxis"];
   return axis.categories[point[isY ? "y" : "x"] as number];
};

const makeHeatmap = (title: string, categories: string[], matrix: number[][], fixedDecimals = true) => {
   const charOptions1: Highcharts.Options = {
      chart: {
         type: "heatmap",
         marginTop: 72,
         marginBottom: 16,
         plotBorderWidth: 1,
         height: 500,
         borderRadius: 8,
      },
      title: {
         text: title,
      },
      xAxis: {
         categories: categories,
         opposite: true,
         title: {
            text: null,
         },
      },
      yAxis: {
         categories: categories,
         title: {
            text: null,
         },
         reversed: true,
      },
      colorAxis: {
         min: 0,
         minColor: "#FFFFFF",
         maxColor: "#4AAF61",
      },
      legend: {
         align: "right",
         layout: "vertical",
         margin: 0,
         symbolHeight: 280,
         enabled: false,
      },
      tooltip: {
         formatter: function () {
            const node1 = getPointCategoryName(this.point, "y");
            const node2 = getPointCategoryName(this.point, "x");
            // round to two six decimal places
            const rounded = Math.round((this.point.value || 0) * 1000000) / 1000000;
            const value = fixedDecimals ? rounded : this.point.value;
            return `<b>${node1}</b> to <b>${node2}</b>: ${value}`;
         },
      },
      series: [
         {
            name: "Adjacency",
            borderWidth: 0,
            type: "heatmap",
            data: toHighChartHeatmap(matrix),
            dataLabels: {
               enabled: true,
               color: "#000000",
               style: {
                  textOutline: "",
               },
               formatter: function () {
                  // round to two two decimal places
                  const rounded = Math.round((this.point.value || 0) * 100) / 100;
                  return fixedDecimals ? rounded : this.point.value;
               },
            },
         },
      ],
      responsive: {
         rules: [
            {
               condition: {
                  maxWidth: 500,
               },
               chartOptions: {
                  series: [
                     {
                        type: "heatmap",
                        dataLabels: {
                           formatter: function () {
                              // round to two one decimal place
                              const rounded = Math.round((this.point.value || 0) * 10) / 10;
                              return fixedDecimals ? rounded : this.point.value;
                           },
                        },
                     },
                  ],
               },
            },
         ],
      },
   };

   return charOptions1;
};

const ViewMatrices: React.FC<ViewMatricesProps> = ({ isOpen, network }) => {
   const isOpenClassName = isOpen ? "isOpen" : "";

   return (
      <Paper elevation={0} sx={{ boxShadow: "none" }} className={"view-matrices-container " + isOpenClassName}>
         <Box className="title" sx={{ textAlign: "center" }}>
            <h1>Computed Matrices</h1>
         </Box>

         {isOpen ? (
            <Box className="matrix-plots" sx={{ display: "flex", justifyContent: "center" }}>
               <Box sx={{ width: "90%", maxWidth: "800px" }}>
                  <Paper className="chart-wrapper" elevation={0} variant="outlined" sx={{ borderRadius: "8px" }}>
                     <HighchartsReact
                        highcharts={Highcharts}
                        options={makeHeatmap(
                           "Adjacency Matrix",
                           network.getNodes(),
                           network.toAdjacencyMatrix(),
                           false
                        )}
                     />
                  </Paper>
                  <Paper className="chart-wrapper" elevation={0} variant="outlined" sx={{ borderRadius: "8px" }}>
                     <HighchartsReact
                        highcharts={Highcharts}
                        options={makeHeatmap(
                           "Simple Column-Stochastic",
                           network.getNodes(),
                           network.getNodeTable().semiColStochasticMatrix
                        )}
                     />
                  </Paper>
                  <Paper className="chart-wrapper" elevation={0} variant="outlined" sx={{ borderRadius: "8px" }}>
                     <HighchartsReact
                        highcharts={Highcharts}
                        options={makeHeatmap(
                           "True Column-Stochastic",
                           network.getNodes(),
                           network.getNodeTable().trueColStochasticMatrix
                        )}
                     />
                  </Paper>
                  <Paper className="chart-wrapper" elevation={0} variant="outlined" sx={{ borderRadius: "8px" }}>
                     <HighchartsReact
                        highcharts={Highcharts}
                        options={makeHeatmap(
                           "Google's PageRank",
                           network.getNodes(),
                           network.getNodeTable().computeGoogleColStochastic(0.8)
                        )}
                     />
                  </Paper>
               </Box>
            </Box>
         ) : (
            ""
         )}
      </Paper>
   );
};

export default ViewMatrices;
