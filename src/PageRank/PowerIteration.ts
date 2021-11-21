export class PowerIterator {
   constructor(private M: number[][], private r: number[]) {}

   public doPowerIteration(iterCount: Number) {
      let r: number[] = this.r;
      for (let i = 0; i < iterCount; i++) r = this.next(r);
      return r;
   }

   public next(r: number[]) {
      let vec = [];
      for (const row of this.M) {
         vec.push(this.dot(row as number[], r));
      }

      return vec;
   }

   private dot(a: number[], b: number[]) {
      if (a.length !== b.length) throw new Error("Vectors do not match in length.");

      let product = 0;

      for (let i = 0; i < a.length; i++) {
         product += a[i] * b[i];
      }

      return product;
   }
}
