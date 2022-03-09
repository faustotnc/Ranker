/* eslint-disable @typescript-eslint/ban-ts-comment */
import ColorMap from "colormap";
import cytoscape from "cytoscape";
// @ts-ignore
import * as cola from "cytoscape-cola";

cytoscape.use(cola);

// The color map used for nodes.
export const NODE_COLORS = ColorMap({
   colormap: "greens",
   nshades: 101,
   format: "hex",
   alpha: 1,
}).reverse();

/**
 * Computes the background and foreground colors for node with probability value `p`.
 * @param p The probability.
 * @param min The minimum probability.
 * @param max The maximum probability.
 * @returns The background and foreground colors for a node with this probability value.
 */
export const getColorCodes = (p: number, min: number, max: number) => {
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
      fg: interpolated_prob >= 65 ? "white" : "black",
   };
};

/**
 * Computes the relative size of a node based on its probability value.
 * @param p This node's probability value.
 * @param min The minimum probability.
 * @param max The maximum probability.
 * @returns The relative size of a node based on its probability value.
 */
export const getSize = (p: number, min: number, max: number): number => {
   // Minimum and maximum size a node can have.
   const [y1, y2] = [32, 72];

   let interpolated_size = 40;
   if (max - min > 0) {
      const m = (y2 - y1) / (max - min);
      interpolated_size = m * p + y1 - m * min;
   }

   return interpolated_size;
};

export class CytoGraph {
   public cytoGraph: cytoscape.Core;
   private hasMounted = false;

   /**
    * A new Cytoscape graph.
    * @param container The HTML element where to mount the Cytoscape canvas.
    */
   constructor(container?: HTMLElement) {
      this.cytoGraph = cytoscape();
      if (container) this.mountOn(container);
   }

   /**
    * Mounts the Cytoscape canvas on the given HTML element.
    * @param container The HTML element where to mount the Cytoscape canvas.
    */
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

   /**
    * Create a new Cytoscape object.
    * @param container The HTML element where to mount the Cytoscape canvas.
    * @returns A new Cytoscape object.
    */
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

   /**
    * Adds a network to the Cytoscape canvas.
    * @param edges The network's edges.
    * @param prob The probability values associated with each node.
    * @returns `this` - This NetworkCytoGraph
    */
   public addNetwork(edges: [string, string][], prob: { [key: string]: number }) {
      const min = Math.min(...Object.values(prob)) * 100;
      const max = Math.max(...Object.values(prob)) * 100;

      const discovered: string[] = [];

      const discoverNode = (node: string) => {
         discovered.push(node);

         const n = this.cytoGraph.add({
            data: { id: node },
         });

         const color = getColorCodes(prob[n.id()] * 100, min, max);
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

   /**
    * Updates the probability values of the nodes in this Cytoscape graph.
    * @param prob The probability values associated with each node.
    */
   public updateProb(prob: { [key: string]: number }) {
      const min = Math.min(...Object.values(prob)) * 100;
      const max = Math.max(...Object.values(prob)) * 100;

      this.cytoGraph.nodes().forEach((node) => {
         const color = getColorCodes(prob[node.id()] * 100, min, max);
         node.style("background-color", color.bg);
         node.style("color", color.fg);

         const size = getSize(prob[node.id()] * 100, min, max);
         node.style("width", size);
         node.style("height", size);
      });
   }

   /** Rerun the Cytoscape layout algorithm. */
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

   /** Clears the Cytoscape graph. */
   public clear() {
      this.cytoGraph.elements().remove();
   }

   /** Fit the entire Cytoscape graph to the canvas. */
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

   /**
    * Fit (zoom into) the specified node to the canvas
    * @param id The node's id.
    */
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

   /** Zoom into the center of the canvas. */
   public zoomIn() {
      this.cytoGraph.zoom({
         level: this.cytoGraph.zoom() + 0.1,
         renderedPosition: {
            x: this.cytoGraph.width() / 2,
            y: this.cytoGraph.height() / 2,
         },
      });
   }

   /** Zoom out from the center of the canvas. */
   public zoomOut() {
      this.cytoGraph.zoom({
         level: this.cytoGraph.zoom() - 0.1,
         renderedPosition: {
            x: this.cytoGraph.width() / 2,
            y: this.cytoGraph.height() / 2,
         },
      });
   }

   /**
    * Execute a callback when a node is clicked.
    * @param callback The callback to execute when a node is clicked.
    */
   public onNodeClick(callback: (evt: cytoscape.EventObject) => void) {
      this.cytoGraph.on("tap", "node", callback);
   }

   /**
    * Execute a callback when an edge is clicked.
    * @param callback The callback to execute when an edge is clicked.
    */
   public onEdgeClick(callback: (evt: cytoscape.EventObject) => void) {
      this.cytoGraph.on("tap", "edge", callback);
   }

   /**
    * Execute a callback when the canvas' background is clicked.
    * @param callback The callback to execute when the canvas' background is clicked.
    */
   public onBgClick(callback: (evt: cytoscape.EventObject) => void) {
      this.cytoGraph.on("tap", (evt) => {
         if (evt.target === this.cytoGraph) callback(evt);
      });
   }

   /** Remove all click listeners from the Cytoscape graph. */
   public removeAllClickListeners() {
      this.cytoGraph.off("tap");
   }
}
