import { Matrix as MLMatrix } from "ml-matrix";
import { evaluate } from "mathjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Matrix {
  private _matrix: number[][];
  private _dimension: number;
  private _mlMatrix: MLMatrix;

  public constructor(matrix: string[][]) {
    this._matrix = this.evaluateMatrix(matrix);
    this._dimension = matrix.length;
    this._mlMatrix = new MLMatrix(this._matrix);
  }

  private evaluateMatrix(matrix: string[][]): number[][] {
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

  private isDiagonal(mlMatrix: MLMatrix): boolean {
    const matrix: number[][] = mlMatrix.to2DArray();

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (i != j && matrix[i][j] != 0) {
          return false;
        }
      }
    }

    return true;
  }

  private diagTransforms(mlMatrix: MLMatrix): string[][] {
    const diag: number[] = mlMatrix.diag();

    const cssTransforms: string[] = [];
    const outTransforms: string[] = [];

    for (let i = 0; i < diag.length; i++) {
      const axis: string = i == 0 ? "X" : i == 1 ? "Y" : "Z";
      cssTransforms[i] = `scale${axis}(${diag[i]})`;
      outTransforms[i] =
        diag[i] == 0 ? `project(${axis}-axis)` : `scale${axis}(${diag[i]})`;
    }

    return [cssTransforms, outTransforms];
  }
}
