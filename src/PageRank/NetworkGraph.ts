import { Network, PowerIterator } from ".";
import cytoscape from "cytoscape";
import ColorMap from "colormap";

// @ts-ignore
import * as cola from "cytoscape-cola";
cytoscape.use(cola);

export class NetworkGraph {
   public cytoGraph: cytoscape.Core;

   constructor(private container: HTMLElement | null) {
      this.cytoGraph = this.createGraph();
   }

   private createGraph() {
      return cytoscape({
         container: this.container,
         zoom: 1000,
         style: [
            {
               selector: "node",
               style: {
                  width: 24,
                  height: 24,
                  "background-color": "#5b9a9c",
                  label: "data(id)",
                  "text-valign": "center",
                  "text-halign": "center",
                  "font-size": 12,
               },
            },
            {
               selector: "edge",
               style: {
                  width: 2,
                  "line-color": "#ccc",
                  "target-arrow-color": "#ccc",
                  "target-arrow-shape": "triangle",
                  "curve-style": "bezier",
                  "loop-direction": "45deg",
               },
            },
         ],
      });
   }

   public addNetwork(edges: [string, string][], prob?: { [key: string]: number }) {
      console.log(prob)
      let colors: string[];
      let min = 0;

      if (prob) {
         let colorInfo = this.computeColors(prob);
         colors = colorInfo.colorList;
         console.log(colors)
         min = colorInfo.min;
      }

      let discovered: string[] = [];
      const discoverNode = (node: string) => {
         discovered.push(node);

         let n = this.cytoGraph.add({
            data: { id: node },
         });

         if (prob) {
            console.log(colors[Math.round(prob[node] - min)])
            n.style("background-color", colors[Math.round(prob[node] - min)])
         }
      };

      edges.forEach(edge => {
         let from = edge[0];
         let to = edge[1];

         if (!discovered.includes(from)) discoverNode(from);
         if (!discovered.includes(to)) discoverNode(to);

         this.cytoGraph.add({
            data: { id: `${from}:${to}`, source: from, target: to },
         });
      });

      return this;
   }

   public rerun() {
      this.cytoGraph
         .layout({
            name: "cola",
            // @ts-ignore
            animate: true,
            randomize: true,
         })
         .run();
   }

   private computeColors(prob: { [key: string]: number }) {
      let min = Infinity;
      let max = 0;

      Object.values(prob).forEach((p) => {
         if (p < min) min = p;
         if (p > max) max = p;
      });

      let range = Math.round(max) - Math.round(min);

      return {
         min,
         max,
         range,
         colorList: ColorMap({
            colormap: "greens",
            nshades: range >= 10 ? range + 1 : 10,
            format: "hex",
            alpha: 1,
         }).reverse(),
      };
   }
}
