import { NodeTable } from ".";

export interface AdjacencyListEntry<T> {
   from: T;
   to: T[];
}

export type AdjacencyList<T> = AdjacencyListEntry<T>[];

export class Network<T> {
   private nodeTable;

   constructor(list: AdjacencyList<T>) {
      this.nodeTable = new NodeTable(list);
   }

   public updateWith(list: AdjacencyList<T>) {
      this.nodeTable = new NodeTable(list);
   }

   public get dim() {
      return this.nodeTable.dim;
   }

   public getNode(idx: number) {
      return this.nodeTable.getNode(idx);
   }

   /**
    * Gets the list of all nodes in the network (including leaves).
    * @returns An array containing all nodes in the network.
    */
   public getNodes() {
      return this.nodeTable.getNodes();
   }

   /**
    * Finds all the nodes that are parents of this node.
    * @param j The child node.
    * @returns An array of nodes that are all connected to this child.
    */
   public getParentsOf(j: T | number) {
      return this.nodeTable.getParentsOf(j);
   }

   /**
    * Finds all the nodes that are children of this node.
    * @param i The parent node.
    * @returns An array of nodes that are all children of this node.
    */
   public getChildrenOf(i: T | number) {
      return this.nodeTable.getChildrenOf(i);
   }

   public getEdges() {
      return this.nodeTable.getEdges();
   }

   /**
    * Converts the network into an adjacency matrix.
    * @returns A 2D-matrix representation of the network.
    */
   public toAdjacencyMatrix() {
      return this.nodeTable.toAdjacencyMatrix();
   }

   /**
    * Converts the network into a column-stochastic adjacency matrix based on the rules of the PageRank algorithm.
    * @returns A column-stochastic, 2D-matrix representation of the network.
    */
   public toColumnStochastic() {
      let dim = this.dim;
      let matrix: number[][] = new Array(dim).fill(0).map((_) => new Array(dim).fill(0));

      for (let i = 0; i < dim; i++) {
         for (let j = 0; j < dim; j++) {
            let hasLink = Number(this.nodeTable.hasLink(i, j));
            let di = this.getChildrenOf(i).length;

            matrix[j][i] = this.computeColStochasticEntry(hasLink, di);
         }
      }

      return matrix;
   }

   private computeColStochasticEntry(hasLink: number, di: number) {
      // Basic Page Rank
      // return di > 0 ? hasLink / di : 0;

      // True Column-Stochastic Page Rank:  rj = SUM_(i->j)[ri / di]
      // return di > 0 ? hasLink / di : 1 / this.dim;

      // Google's PageRank with Teleport
      let beta = 0.8;
      let base = di > 0 ? beta * (hasLink / di) + (1 - beta) / this.nodeTable.dim : 1 / this.dim;
      return base;
   }
}
