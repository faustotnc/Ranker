import { Network, PowerIterator } from ".";
import cytoscape from "cytoscape";
import ColorMap from "colormap";

// @ts-ignore
import * as cola from "cytoscape-cola";
cytoscape.use(cola);

export const NODE_COLORS = ColorMap({
   colormap: "greens",
   nshades: 101,
   format: "hex",
   alpha: 1,
}).reverse();

export const getColorCode = (p: number, min: number, max: number) => {
   // Interpolates the probabilities such that the smallest probability maps to
   // the 0th color, while the largest probability maps to the 100th color.
   const [y1, y2] = [25, 85];

   let interpolated_prob = 50;
   if (max - min > 0) {
      let m = (y2 - y1) / (max - min);
      interpolated_prob = m * p + y1 - m * min;
   }

   return {
      bg: NODE_COLORS[Math.round(interpolated_prob)],
      // Change "65" to be 15% above the range of y1 and y1
      fg: interpolated_prob >= 65 ? "white" : "black",
   };
};

export class NetworkGraph {
   public cytoGraph: cytoscape.Core;
   private hasMounted = false;

   constructor(container?: HTMLElement) {
      this.cytoGraph = cytoscape();
      if (container) this.mountOn(container);
   }

   public mountOn(container: HTMLElement) {
      if (!this.hasMounted) {
         this.cytoGraph = this.createGraph(container);

         this.cytoGraph.on("mouseover", "node", (event) => {
            let container = event.cy.container();
            if (container) container.style.cursor = "pointer";
         });

         this.cytoGraph.on("mouseout", "node", (event) => {
            let container = event.cy.container();
            if (container) container.style.cursor = "default";
         });

         this.hasMounted = true;
      } else {
         console.error("Graph already mounded.");
      }
   }

   private createGraph(container: HTMLElement) {
      return cytoscape({
         container,
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

   public addNetwork(edges: [string, string][], prob: { [key: string]: number }) {
      let min = Math.min(...Object.values(prob)) * 100;
      let max = Math.max(...Object.values(prob)) * 100;

      let discovered: string[] = [];

      const discoverNode = (node: string) => {
         discovered.push(node);

         let n = this.cytoGraph.add({
            data: { id: node },
         });

         let color = getColorCode(prob[n.id()] * 100, min, max);
         n.style("background-color", color.bg);
         n.style("color", color.fg);
      };

      edges.forEach((edge) => {
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

   public updateProb(prob: { [key: string]: number }) {
      let min = Math.min(...Object.values(prob)) * 100;
      let max = Math.max(...Object.values(prob)) * 100;

      this.cytoGraph.nodes().forEach((node) => {
         let color = getColorCode(prob[node.id()] * 100, min, max);
         node.style("background-color", color.bg);
         node.style("color", color.fg);
      });
   }

   public rerun() {
      this.cytoGraph
         .layout({
            name: "cola",
            animate: true,
            randomize: true,
            fit: false,
            // @ts-ignore
            maxSimulationTime: 30000, // 20 seconds
         })
         .run();
   }
}
