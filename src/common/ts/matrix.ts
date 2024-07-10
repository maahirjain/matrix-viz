import { Matrix as MLMatrix } from "ml-matrix";
import { evaluate } from "mathjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Matrix {
  private _matrix: number[][];
  private _dimension: number;
  private _mlMatrix: MLMatrix;

  constructor(matrix: string[][]) {
    this._matrix = this.evaluateMatrix(matrix);
    this._dimension = matrix.length;
    this._mlMatrix = new MLMatrix(this._matrix);
  }

  public evaluateMatrix(matrix: string[][]): number[][] {
    return matrix.map((row) => {
      return row.map((cell) => +evaluate(cell));
    });
  }

  public get matrix() {
    return this._matrix;
  }

  public get dimension() {
    return this._dimension;
  }
}
