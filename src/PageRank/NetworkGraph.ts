/* eslint-disable @typescript-eslint/ban-ts-comment */
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
   // the y1-th color, while the largest probability maps to the y2-th color.
   let interpolated_prob = 40;
   if (max - min > 0) {
      const [y1, y2] = [20, 90];
      const m = (y2 - y1) / (max - min);
      interpolated_prob = m * p + y1 - m * min;
   }

   return {
      bg: NODE_COLORS[Math.round(interpolated_prob)],
      // TODO: Change "65" to be 15% above the range of y1 and y1
      fg: interpolated_prob >= 65 ? "white" : "black",
   };
};

export const getSize = (p: number, min: number, max: number): [number, number] => {
   let interpolated_size = 40;
   const [y1, y2] = [32, 72];

   if (max - min > 0) {
      const m = (y2 - y1) / (max - min);
      interpolated_size = m * p + y1 - m * min;
   }

   return [interpolated_size, interpolated_size];
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
            const container = event.cy.container();
            if (container) container.style.cursor = "pointer";
         });

         this.cytoGraph.on("mouseout", "node", (event) => {
            const container = event.cy.container();
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
                  width: 38,
                  height: 38,
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
      const min = Math.min(...Object.values(prob)) * 100;
      const max = Math.max(...Object.values(prob)) * 100;

      const discovered: string[] = [];

      const discoverNode = (node: string) => {
         discovered.push(node);

         const n = this.cytoGraph.add({
            data: { id: node },
         });

         const color = getColorCode(prob[n.id()] * 100, min, max);
         n.style("background-color", color.bg);
         n.style("color", color.fg);
      };

      edges.forEach((edge) => {
         const from = edge[0];
         const to = edge[1];

         if (!discovered.includes(from)) discoverNode(from);
         if (!discovered.includes(to)) discoverNode(to);

         this.cytoGraph.add({
            data: { id: `${from}:${to}`, source: from, target: to },
         });
      });

      return this;
   }

   public updateProb(prob: { [key: string]: number }) {
      const min = Math.min(...Object.values(prob)) * 100;
      const max = Math.max(...Object.values(prob)) * 100;

      this.cytoGraph.nodes().forEach((node) => {
         const color = getColorCode(prob[node.id()] * 100, min, max);
         node.style("background-color", color.bg);
         node.style("color", color.fg);

         const size = getSize(prob[node.id()] * 100, min, max);
         node.style("width", size);
         node.style("height", size);
      });
   }

   public rerun() {
      this.cytoGraph
         .layout({
            name: "cola",
            animate: true,
            randomize: true,
            fit: true,
            // @ts-ignore
            edgeLength: 150,
            maxSimulationTime: 30000, // 20 seconds
            padding: window.innerWidth < 500 ? 16 : 72,
         })
         .run();
   }

   public clear() {
      this.cytoGraph.elements().remove();
   }

   public center() {
      this.cytoGraph.center();
   }

   public fit() {
      this.cytoGraph.animate({
         fit: {
            padding: window.innerWidth < 500 ? 16 : 72,
            eles: this.cytoGraph.elements(),
         },
         duration: 750,
         easing: "ease-in-out-cubic",
      });
   }

   public fitTo(id: string) {
      this.cytoGraph.animate({
         fit: {
            padding: window.innerWidth < 500 ? 72 : 200,
            eles: this.cytoGraph.$id(id),
         },
         duration: 750,
         easing: "ease-in-out-cubic",
      });
   }

   public zoomIn() {
      this.cytoGraph.zoom({
         level: this.cytoGraph.zoom() + 0.1,
         renderedPosition: {
            x: this.cytoGraph.width() / 2,
            y: this.cytoGraph.height() / 2,
         },
      });
   }

   public zoomOut() {
      this.cytoGraph.zoom({
         level: this.cytoGraph.zoom() - 0.1,
         renderedPosition: {
            x: this.cytoGraph.width() / 2,
            y: this.cytoGraph.height() / 2,
         },
      });
   }

   public onNodeClick(callback: (evt: cytoscape.EventObject) => void) {
      this.cytoGraph.on("tap", "node", callback);
   }

   public onEdgeClick(callback: (evt: cytoscape.EventObject) => void) {
      this.cytoGraph.on("tap", "edge", callback);
   }

   public onBgClick(callback: (evt: cytoscape.EventObject) => void) {
      this.cytoGraph.on("tap", (evt) => {
         if (evt.target === this.cytoGraph) callback(evt);
      });
   }

   public removeAllClickListeners() {
      this.cytoGraph.off("tap");
   }
}
