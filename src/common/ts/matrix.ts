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
      return row.map((cell) => +(+evaluate(cell).toFixed(2)));
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

      if (diag[i] != 1) {
        cssTransforms[i] = `scale${axis}(${diag[i]})`;
        outTransforms[i] =
          diag[i] == 0 ? `project(${axis}-axis)` : `scale${axis}(${diag[i]})`;
      }
    }

    return [cssTransforms, outTransforms];
  }

  private isIdentity(mlMatrix: MLMatrix): boolean {
    return (
      this.isDiagonal(mlMatrix) && JSON.stringify(mlMatrix.diag()) === "[1,1,1]"
    );
  }

  private isXShear(mlMatrix: MLMatrix): boolean {
    const matrix: number[][] = mlMatrix.to2DArray();
    const checkNonZero = matrix[0][1] != 0;

    matrix[0][1] = 0;
    mlMatrix = new MLMatrix(matrix);

    return this.isIdentity(mlMatrix) && checkNonZero;
  }

  private isYShear(mlMatrix: MLMatrix): boolean {
    const matrix: number[][] = mlMatrix.to2DArray();
    const checkNonZero = matrix[1][0] != 0;

    matrix[1][0] = 0;
    mlMatrix = new MLMatrix(matrix);

    return this.isIdentity(mlMatrix) && checkNonZero;
  }

  private isXYShear(mlMatrix: MLMatrix): boolean {
    const matrix: number[][] = mlMatrix.to2DArray();
    const checkNonZero = matrix[0][1] != 0 && matrix[1][0] != 0;

    matrix[0][1] = 0;
    matrix[1][0] = 0;
    mlMatrix = new MLMatrix(matrix);

    return this.isIdentity(mlMatrix) && checkNonZero;
  }

  private isShear(mlMatrix: MLMatrix): boolean {
    return (
      this.isXShear(mlMatrix) ||
      this.isYShear(mlMatrix) ||
      this.isXYShear(mlMatrix)
    );
  }

  private shearTransforms(mlMatrix: MLMatrix): string[][] {
    let cssTransforms: string[] = [];
    let outTransforms: string[] = [];

    const matrix: number[][] = mlMatrix.to2DArray();
    const angleX: number = +Math.atan(matrix[0][1]).toFixed(2);
    const angleY: number = +Math.atan(matrix[1][0]).toFixed(2);

    if (this.isXShear(mlMatrix)) {
      cssTransforms[0] = `skewX(${angleX}rad)`;
      outTransforms[0] = `shearX(${angleX}rad)`;
    } else if (this.isYShear(mlMatrix)) {
      cssTransforms[0] = `skewY(${angleY}rad)`;
      outTransforms[0] = `shearY(${angleY}rad)`;
    } else if (this.isXYShear(mlMatrix)) {
      cssTransforms = [`skewX(${angleX}rad)`, `skewY(${angleY}rad)`];
      outTransforms = [`shearX(${angleX}rad)`, `shearY(${angleY}rad)`];
    }

    return [cssTransforms, outTransforms];
  }
}
