import { AdjacencyListEntry } from ".";


interface NoteTableEntry<T> {
   node: T;
   parents: {
      nodes: number[];
      rowVec: (0 | 1)[];
   };
   children: {
      nodes: number[];
      rowVec: (0 | 1)[];
   };
}

export class NodeTable<T> {
   public readonly dim;
   private _nodes: T[] = [];
   private _edges: [T, T][] = [];
   private table: { [key: number]: NoteTableEntry<T> } = {};
   private adjMatrix: (0 | 1)[][] = [];

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

      // Create the artificial table of nodes
      for (let idx = 0; idx < this._nodes.length; idx++) {
         let n = this._nodes[idx];

         this.table[idx] = {
            node: n,
            parents: {
               nodes: [],
               rowVec: new Array(this._nodes.length).fill(0),
            },
            children: {
               nodes: list[idx]?.to.map((x) => this._nodes.indexOf(x)) ?? [],
               rowVec: new Array(this._nodes.length).fill(0),
            },
         };

         // Create the adjacency row vector for this node's children
         for (const child of this.table[idx].children.nodes) {
            this.table[idx].children.rowVec[child] = 1;
         }

         this.adjMatrix.push(this.table[idx].children.rowVec);

         // Find this node's parents
         for (const node of list) {
            let isParent = node.to.includes(n);

            if (isParent) {
               this.table[idx].parents.nodes.push(this._nodes.indexOf(node.from));
            }
         }

         for (const parent of this.table[idx].parents.nodes) {
            this.table[idx].parents.rowVec[parent] = 1;
         }
      }
   }

   public getNode(idx: number) {
      return this._nodes[idx];
   }

   public getNodes() {
      return this._nodes;
   }

   private mapIdsToNodes(ids: number[]) {
      return ids.map((x) => this._nodes[x]);
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
   public hasLink(i: number | T, j: number | T) {
      let a = typeof i !== "number" ? this._nodes.indexOf(i) : i;
      let b = typeof j !== "number" ? this._nodes.indexOf(j) : j;
      return this.table[a].children.nodes.includes(b);
   }

   /**
    * Finds all the nodes that are parents of this node.
    * @param id The child node.
    * @returns An array of nodes that are all connected to this child.
    */
   public getParentsOf(id: number | T) {
      let idx = typeof id === "number" ? id : this._nodes.indexOf(id);
      return this.mapIdsToNodes(this.table[idx].parents.nodes);
   }

   /**
    * Finds all the nodes that are children of this node.
    * @param id The parent node.
    * @returns An array of nodes that are all children of this node.
    */
   public getChildrenOf(id: number | T) {
      let idx = typeof id === "number" ? id : this._nodes.indexOf(id);
      return this.mapIdsToNodes(this.table[idx].children.nodes);
   }

   /**
    * Converts the network into an adjacency matrix.
    * @returns A 2D-matrix representation of the network.
    */
   public toAdjacencyMatrix() {
      return this.adjMatrix;
   }
}
