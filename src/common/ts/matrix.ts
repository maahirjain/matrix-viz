import { determinant, Matrix as MLMatrix, SingularValueDecomposition } from "ml-matrix";
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

  public get matrix() {
    return this._matrix;
  }

  public get dimension() {
    return this._dimension;
  }

  private SVD(mlMatrix: MLMatrix) {
    const SVD: SingularValueDecomposition = new SingularValueDecomposition(
      mlMatrix
    );
    return {
      U: SVD.leftSingularVectors,
      D: SVD.diagonalMatrix,
      V: SVD.rightSingularVectors
    };
  }

  private evaluateMatrix(matrix: string[][]): number[][] {
    return matrix.map((row) => {
      return row.map((cell) => evaluate(cell));
    });
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
      const axis: string = i === 0 ? "X" : i === 1 ? "Y" : "Z";

      if (diag[i] != 1) {
        cssTransforms[i] = `scale${axis}(${diag[i]})`;
        outTransforms[i] =
          diag[i] === 0 ? `project(${axis}-axis)` : `scale${axis}(${diag[i]})`;
      }
    }

    return [cssTransforms, outTransforms];
  }

  private isIdentity(mlMatrix: MLMatrix): boolean {
    return (
      this.isDiagonal(mlMatrix) &&
      mlMatrix.diag().every((element) => element === 1)
    );
  }

  private radToDeg(angle: number): number {
    return angle * (180 / Math.PI);
  }

  private isXShear(mlMatrix: MLMatrix): boolean {
    const matrix: number[][] = mlMatrix.to2DArray();
    const checkNonZero: boolean = matrix[0][1] != 0;

    matrix[0][1] = 0;
    mlMatrix = new MLMatrix(matrix);

    return this.isIdentity(mlMatrix) && checkNonZero;
  }

  private isYShear(mlMatrix: MLMatrix): boolean {
    const matrix: number[][] = mlMatrix.to2DArray();
    const checkNonZero: boolean = matrix[1][0] != 0;

    matrix[1][0] = 0;
    mlMatrix = new MLMatrix(matrix);

    return this.isIdentity(mlMatrix) && checkNonZero;
  }

  private isXYShear(mlMatrix: MLMatrix): boolean {
    const matrix: number[][] = mlMatrix.to2DArray();
    const checkNonZero: boolean = matrix[0][1] != 0 && matrix[1][0] != 0;

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
    const angleX: number = this.radToDeg(+Math.atan(matrix[0][1]).toFixed(2));
    const angleY: number = this.radToDeg(+Math.atan(matrix[1][0]).toFixed(2));

    if (this.isXShear(mlMatrix)) {
      cssTransforms[0] = `skewX(${angleX}deg)`;
      outTransforms[0] = `shearX(${angleX}deg)`;
    } else if (this.isYShear(mlMatrix)) {
      cssTransforms[0] = `skewY(${angleY}deg)`;
      outTransforms[0] = `shearY(${angleY}deg)`;
    } else if (this.isXYShear(mlMatrix)) {
      cssTransforms = [`skewX(${angleX}deg)`, `skewY(${angleY}deg)`];
      outTransforms = [`shearX(${angleX}deg)`, `shearY(${angleY}deg)`];
    }

    return [cssTransforms, outTransforms];
  }

  private isDetOne(mlMatrix: MLMatrix): boolean {
    return determinant(mlMatrix) === 1;
  }

  private properRotationTransforms(mlMatrix: MLMatrix): string[][] {
    const matrix: number[][] = mlMatrix.to2DArray();

    let angleX: number;
    let angleY: number;
    let angleZ: number;
    const transforms: string[] = [];

    if (matrix.length === 2) {
      const angle = +this.radToDeg(Math.acos(matrix[0][0])).toFixed(2);
      if (angle != 0) {
        transforms.push(`rotate(${angle}deg)`);
      }
    } else {
      if (matrix[2][0] === 1 || matrix[2][0] === -1) {
        const multiplier: number = -1 * matrix[2][0];
        angleZ = 0;
        angleX = Math.atan2(
          multiplier * matrix[0][1],
          multiplier * matrix[0][2]
        );
        angleY = multiplier * (Math.PI / 2);
      } else {
        angleY = -1 * Math.asin(matrix[2][0]);
        const divider: number = Math.cos(angleY);
        angleX = Math.atan2(matrix[2][1] / divider, matrix[2][2] / divider);
        angleZ = Math.atan2(matrix[1][0] / divider, matrix[0][0] / divider);
      }

      angleX = +this.radToDeg(angleX).toFixed(2);
      angleY = +this.radToDeg(angleY).toFixed(2);
      angleZ = +this.radToDeg(angleZ).toFixed(2);

      if (angleX != 0) {
        transforms.push(`rotateX(${angleX}deg)`);
      }
      if (angleY != 0) {
        transforms.push(`rotateY(${angleY}deg)`);
      }
      if (angleZ != 0) {
        transforms.push(`rotateZ(${angleZ}deg)`);
      }
    }

    return [transforms, transforms];
  }

  private improperRotationTransforms(mlMatrix: MLMatrix): string[][] {
    const dimension: number = mlMatrix.rows;
    let reflectionMatrix: MLMatrix;

    if (dimension === 2) {
      reflectionMatrix = new MLMatrix([
        [1, 0],
        [0, -1]
      ]);
    } else {
      reflectionMatrix = new MLMatrix([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, -1]
      ]);
    }

    const properRotationMatrix: MLMatrix = mlMatrix.mmul(reflectionMatrix);

    let [cssTransforms, outTransforms]: string[][] =
      this.properRotationTransforms(properRotationMatrix);

    if (dimension === 2) {
      cssTransforms = [`scaleY(-1)`, ...cssTransforms];
      outTransforms = [`reflect(X-axis)`, ...outTransforms];
    } else {
      cssTransforms = [`scaleZ(-1)`, ...cssTransforms];
      outTransforms = [`reflect(XY-plane)`, ...outTransforms];
    }

    return [cssTransforms, outTransforms];
  }
}
