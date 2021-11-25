import { AdjacencyListEntry } from ".";

export class NodeTable<T> {
   public readonly dim;
   private _nodes: T[] = [];
   private _edges: [T, T][] = [];
   private adjMatrix: (0 | 1)[][] = [];
   public semiColStochasticMatrix: number[][] = [];
   public trueColStochasticMatrix: number[][] = [];
   public googColStochasticMatrix: number[][] = [];

   // TODO: This is clearly very slow. We can definitely do better.
   constructor(private list: AdjacencyListEntry<T>[]) {
      // Compose the flat list of nodes.
      for (const node of list) {
         if (!this._nodes.includes(node.from)) this._nodes.push(node.from);

         for (const child of node.to) {
            if (!this._nodes.includes(child)) this._nodes.push(child);

            this._edges.push([node.from, child]);
         }
      }

      this.dim = this._nodes.length;

      // Compose the adjacency matrix
      for (const ith of this._nodes) {
         this.adjMatrix.push([]); // current row

         for (const jth of this._nodes) {
            let hasLink = Number(this.hasLink(ith, jth)) as 0 | 1;
            this.adjMatrix[this.adjMatrix.length - 1].push(hasLink);
         }
      }

      this.semiColStochasticMatrix = this.computeSemiColStochastic();
      this.trueColStochasticMatrix = this.computeFullColStochastic();
   }

   private computeSemiColStochastic() {
      const grid = [];
      for (let j = 0; j < this.dim; j++) {
         grid[j] = Array(this.dim);
      }

      for (let i = 0; i < this.dim; i++) {
         let di = this.getChildrenOf(this._nodes[i]).length;

         for (let j = 0; j < this.dim; j++) {
            let hasLink = this.adjMatrix[i][j];

            if (di > 0) {
               grid[j][i] = hasLink / di;
            } else {
               grid[j][i] = 0;
            }
         }
      }

      return grid;
   }

   private computeFullColStochastic() {
      const grid = [];
      for (let j = 0; j < this.dim; j++) {
         grid[j] = Array(this.dim);
      }

      for (let i = 0; i < this.dim; i++) {
         let di = this.getChildrenOf(this._nodes[i]).length;

         for (let j = 0; j < this.dim; j++) {
            let hasLink = this.adjMatrix[i][j];

            if (di > 0) {
               grid[j][i] = hasLink / di;
            } else {
               grid[j][i] = 1 / this.dim;
            }
         }
      }

      return grid;
   }

   public computeGoogleColStochastic(beta: number) {
      const grid = [];
      for (let i = 0; i < this.dim; i++) {
         grid[i] = Array(this.dim);
      }

      for (let i = 0; i < this.dim; i++) {
         for (let j = 0; j < this.dim; j++) {
            let S_ix = this.trueColStochasticMatrix[i][j];
            grid[i][j] = beta * S_ix + (1 - beta) / this.dim;
         }
      }

      return grid;
   }

   public getNodes() {
      return this._nodes;
   }

   /**
    * Finds all edges (i, j) in the network.
    * @returns An array of all edges in the network.
    */
   public getEdges() {
      return this._edges;
   }

   /**
    * Checks that the edge (i, j) exists in the network.
    * @param i The source node.
    * @param j The child node.
    * @returns True if there is a link from i to j, false otherwise.
    */
   public hasLink(i: T, j: T) {
      for (let idx = 0; idx < this._edges.length; idx++) {
         const edge = this._edges[idx];
         if (edge[0] === i && edge[1] === j) return true;
      }

      return false;
   }

   /**
    * Finds all the nodes that are parents of this node.
    * @param node The child node.
    * @returns An array of nodes that are all connected to this child.
    */
   public getParentsOf(node: T) {
      let parents: T[] = [];

      for (let idx = 0; idx < this._edges.length; idx++) {
         const edge = this._edges[idx];
         if (edge[1] === node) parents.push(edge[0]);
      }

      return parents;
   }

   /**
    * Finds all the nodes that are children of this node.
    * @param node The parent node.
    * @returns An array of nodes that are all children of this node.
    */
   public getChildrenOf(node: T) {
      let parents: T[] = [];

      for (let idx = 0; idx < this._edges.length; idx++) {
         const edge = this._edges[idx];
         if (edge[0] === node) parents.push(edge[1]);
      }

      return parents;
   }

   /**
    * Converts the network into an adjacency matrix.
    * @returns A 2D-matrix representation of the network.
    */
   public toAdjacencyMatrix() {
      return this.adjMatrix;
   }
}
