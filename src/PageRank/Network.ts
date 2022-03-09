import { NodeTable } from ".";
import { MatrixFormula } from "../App/components/EditorSideBar/Editor.store";

/** An entry of an adjacency list which represents a network. */
export interface AdjacencyListEntry<T> {
   from: T;
   to: T[];
}

/** An adjacency list to represent a network. */
export type AdjacencyList<T> = AdjacencyListEntry<T>[];

export class Network<T> {
   private matrixFormula: MatrixFormula = MatrixFormula.Simple;
   private nodeTable;

   /**
    * A Network.
    * @param list The adjacency list from which to construct the network
    * @param mAlgo The matrix formulation used to construct the col-stochastic matrix.
    */
   constructor(list: AdjacencyList<T>, mAlgo?: MatrixFormula) {
      this.nodeTable = new NodeTable(list);
      if (mAlgo) this.matrixFormula = mAlgo;
   }

   /** The default network. */
   public static default() {
      return new Network<string>([]);
   }

   /**
    * Update the network with a new adjacency matrix and matrix formulation.
    * @param list The adjacency list from which to construct the network
    * @param mAlgo The matrix formulation used to construct the col-stochastic matrix.
    */
   public updateWith(list: AdjacencyList<T>, mAlgo: MatrixFormula) {
      this.nodeTable = new NodeTable(list);
      this.matrixFormula = mAlgo;
   }

   /**
    * Gets the network's table of nodes.
    * @returns The network's table of nodes.
    */
   public getNodeTable() {
      return this.nodeTable;
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
      const nodeName = typeof j === "number" ? this.nodeTable.getNodes()[j] : j;
      return this.nodeTable.getParentsOf(nodeName);
   }

   /**
    * Finds all the nodes that are children of this node.
    * @param i The parent node.
    * @returns An array of nodes that are all children of this node.
    */
   public getChildrenOf(i: T | number) {
      const nodeName = typeof i === "number" ? this.nodeTable.getNodes()[i] : i;
      return this.nodeTable.getChildrenOf(nodeName);
   }

   /**
    * Gets the network's edges.
    * @returns The network's edges.
    */
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
      switch (this.matrixFormula) {
         case MatrixFormula.Google:
            return this.nodeTable.computeGoogleColStochastic(0.8);
         case MatrixFormula.Stochastic:
            return this.nodeTable.trueColStochasticMatrix;
         default:
            return this.nodeTable.semiColStochasticMatrix;
      }
   }
}
