import { Network } from ".";
import { StringNumberPairs } from "../App/utils";

export class PowerIterator {
   public state: "running" | "paused" = "paused";
   private powerIterTimer = -1;
   private matrix: number[][] = [];
   private r: number[] = [];
   private currentStep = 0;

   /**
    * A Power Iterator. Used to compute the principal eigenvector of a matrix.
    * @param network The network used for power iteration
    * @param maxIter The maximum number of iterations
    * @param iterSpeed The speed at which to execute iterations (iterations/second)
    */
   constructor(private network: Network<string>, private maxIter = 100, private iterSpeed = 1) {
      this.resetWith(network, maxIter, iterSpeed);
   }

   /**
    * Creates a new power iterator with default iteration count and speed.
    * @param network The network from which to create a power iterator.
    * @returns A new power iterator with default parameters.
    */
   public static default(network: Network<string>) {
      return new PowerIterator(network, 100, 1);
   }

   /**
    * Gets the current rank for each node (the probability vector R).
    * @returns An object with key-value pairs corresponding to each node and its rank.
    */
   public getRVector() {
      return this.network.getNodes().reduce<StringNumberPairs>((obj, node, idx) => {
         obj[node] = this.r[idx];
         return obj;
      }, {});
   }

   /**
    * Gets the current step in the power iteration.
    * @returns The current iteration step.
    */
   public getCurrentStep() {
      return this.currentStep;
   }

   /**
    * Resets the power iterator using the provided parameters.
    * @param network The network to use for power iteration.
    * @param maxIter The maximum number of iterations.
    * @param iterSpeed The speed at which to execute iterations (iter/second).
    */
   public resetWith(network: Network<string>, maxIter: number, iterSpeed: number) {
      this.pause();

      this.network = network;
      this.matrix = network.toColumnStochastic();
      this.currentStep = 0;

      if (this.matrix.length > 0) {
         this.r = new Array(this.matrix[0].length).fill(1 / this.matrix[0].length);
      } else {
         this.r = [];
      }

      this.maxIter = maxIter;
      this.iterSpeed = iterSpeed;
   }

   /**
    * Resets the power iterator to its initial state.
    */
   public reset() {
      this.resetWith(this.network, this.maxIter, this.iterSpeed);
   }

   /**
    * Pauses the power iterator.
    */
   public pause() {
      this.state = "paused";
      if (this.powerIterTimer) window.clearInterval(this.powerIterTimer);
   }

   /**
    * Checks whether or not the power iterator is paused.
    * @returns `true` if the iterator is paused. `false` otherwise.
    */
   public isPaused() {
      return this.state === "paused";
   }

   /**
    * Executes the power iterator.
    * @param callback Callback to execute after each iteration.
    */
   public run(callback: (r: number[]) => void) {
      this.state = "running";

      this.powerIterTimer = window.setInterval(() => {
         if (this.currentStep >= this.maxIter - 1) {
            window.clearInterval(this.powerIterTimer);
         }

         callback(this.next());
      }, (1 / this.iterSpeed) * 1000);
   }

   /**
    * Executes the next step in the power iteration.
    * @returns The probability vector at this step.
    */
   public next() {
      const vec = [];

      for (const row of this.matrix) {
         vec.push(this.dot(row, this.r));
      }

      this.r = vec;
      this.currentStep += 1;
      return vec;
   }

   /**
    * Computes the dot product between two vectors.
    * @param a The first vector.
    * @param b The second vector.
    * @returns The dot-product of the two vectors.
    */
   private dot(a: number[], b: number[]) {
      if (a.length !== b.length) throw new Error("Vectors do not match in length.");

      let product = 0;

      for (let i = 0; i < a.length; i++) {
         product += a[i] * b[i];
      }

      return product;
   }
}
