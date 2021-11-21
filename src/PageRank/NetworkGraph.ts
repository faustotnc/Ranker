import { Network, PowerIterator } from ".";
import cytoscape from "cytoscape";
import ColorMap from "colormap";

// @ts-ignore
import * as cola from "cytoscape-cola";
cytoscape.use(cola);

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
      let { colorList, range, min } = this.computeColors(Object.values(prob));

      let discovered: string[] = [];
      const discoverNode = (node: string) => {
         discovered.push(node);

         let n = this.cytoGraph.add({
            data: { id: node },
         });

         let p = prob[node] * 100 - min;
         n.style("background-color", colorList[Math.round(p)]);
         if (p / range >= 0.65) n.style("color", "white");
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
      let { colorList, range, min } = this.computeColors(Object.values(prob));

      this.cytoGraph.nodes().forEach((node) => {
         let p = prob[node.id()] * 100 - min;
         node.style("background-color", colorList[Math.round(p)]);
         if (p / range >= 0.65) node.style("color", "white");
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

   private computeColors(prob: number[]) {
      prob = prob.map((p) => p * 100);

      let min = Infinity;
      let max = 0;

      prob.forEach((p) => {
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
