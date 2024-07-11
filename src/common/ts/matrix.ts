import {
  Matrix as MLMatrix,
  determinant,
  SingularValueDecomposition
} from "ml-matrix";
import { BigNumber, eigs, evaluate, MathCollection } from "mathjs";

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

  /**
   * Computes an ordered array of linear transformations associated with this Matrix.
   *
   * @returns an ordered array of rotations, scaling, reflections, projections, and/or shears
   */
  public computeTransforms(): string[] {
    return this.computeTransformsArr(this._mlMatrix)[1];
  }

  /**
   * Computes an ordered array of CSS transforms associated with this Matrix.
   *
   * @returns an ordered array of CSS transforms
   */
  public computeCSSTransforms(): string[] {
    return this.computeTransformsArr(this._mlMatrix)[0];
  }

  /**
   * Returns the determinant of this Matrix.
   *
   * @returns the determinant of this Matrix
   */
  public det(): number {
    return determinant(this._mlMatrix);
  }

  /**
   * Returns a MathJax expression that includes the eigenvalues and corresponding eigenvectors of this Matrix.
   *
   * @returns a MathJax expression that includes the eigenvalues and corresponding eigenvectors of this Matrix
   */
  public eigenMathJax(): string {
    const eigenvalues: string[] = this.eigenvalues(this._matrix);
    let eigenvectors: string[][];

    if (this._matrix.length === 2) {
      eigenvectors = this.eigenvectors2D(this._matrix);
    } else {
      eigenvectors = this.eigenvectors3D(this._matrix);
    }

    let str: string = "";
    for (let i = 1; i <= eigenvalues.length; i++) {
      str += `\\lambda_${i} = ${eigenvalues[i - 1]}, \\quad \\mathbf{v_${i}} = ${this.vectorToMathJax(eigenvectors[i - 1])}\\\\`;
    }

    return str.slice(0, -2);
  }

  private vectorToMathJax(vector: string[]): string {
    let str: string = "\\begin{bmatrix}";
    for (const element of vector) {
      str += element + "\\\\";
    }

    return str.slice(0, -2) + "\\end{bmatrix}";
  }

  private eigenvalues(matrix: number[][]): string[] {
    const values: MathCollection = eigs(matrix).values;
    const valuesArr: string[] = values.toString().split(",");

    return valuesArr.map((str) => this.roundComplexStr(str, 2, 1));
  }

  private eigenvectors2D(matrix: number[][]): string[][] {
    const [a1, a2]: {
      value: number | BigNumber;
      vector: MathCollection;
    }[] = eigs(matrix).eigenvectors;

    const [u1, u2]: MathCollection[] = [a1.vector, a2.vector];

    const [v1, v2]: string[][] = [
      u1.toString().split(","),
      u2.toString().split(",")
    ];

    const [scale1, scale2]: number[] = [
      1 / Math.abs(+v1[0].split(" ")[0]),
      1 / Math.abs(+v2[0].split(" ")[0])
    ];

    return [
      v1.map((str) => this.roundComplexStr(str, 2, scale1)),
      v2.map((str) => this.roundComplexStr(str, 2, scale2))
    ];
  }

  private eigenvectors3D(matrix: number[][]): string[][] {
    const [a1, a2, a3]: {
      value: number | BigNumber;
      vector: MathCollection;
    }[] = eigs(matrix).eigenvectors;

    const [u1, u2, u3]: MathCollection[] = [a1.vector, a2.vector, a3.vector];

    const [v1, v2, v3]: string[][] = [
      u1.toString().split(","),
      u2.toString().split(","),
      u3.toString().split(",")
    ];

    const [scale1, scale2, scale3]: number[] = [
      1 / Math.abs(+v1[2].split(" ")[0]),
      1 / Math.abs(+v2[2].split(" ")[0]),
      1 / Math.abs(+v3[2].split(" ")[0])
    ];

    return [
      v1.map((str) => this.roundComplexStr(str, 2, scale1)),
      v2.map((str) => this.roundComplexStr(str, 2, scale2)),
      v3.map((str) => this.roundComplexStr(str, 2, scale3))
    ];
  }

  private roundComplexStr(
    str: string,
    decimalPlaces: number,
    scale: number
  ): string {
    if (scale === 0 || scale === Infinity || isNaN(scale)) {
      return str;
    }

    const splitStr: string[] = str.split(" ");

    if (
      splitStr.length === 3 ||
      (splitStr.length === 1 && splitStr[0].includes("i"))
    ) {
      const roundedImaginary: number =
        splitStr[splitStr.length - 1] === "i"
          ? 1
          : splitStr[splitStr.length - 1] === "-i"
            ? -1
            : +splitStr[splitStr.length - 1].slice(0, -1);

      let roundedReal: number = 0;
      let roundedRealStr: string = "";
      if (splitStr.length === 3) {
        roundedReal = +splitStr[0];
        roundedRealStr = (roundedReal * scale).toFixed(decimalPlaces);
      }

      const roundedImaginaryStr: string = (roundedImaginary * scale).toFixed(
        decimalPlaces
      );

      if (isNaN(roundedReal) || isNaN(roundedImaginary)) {
        return str;
      } else if (splitStr.length === 1) {
        return `${roundedImaginaryStr}i`;
      } else {
        return `${roundedRealStr} ${splitStr[1]} ${roundedImaginaryStr}i`;
      }
    } else {
      return (+str * scale).toFixed(decimalPlaces);
    }
  }

  private computeTransformsArr(mlMatrix: MLMatrix): string[][] {
    let cssTransforms: string[];
    let outTransforms: string[];

    if (this.isZero(mlMatrix)) {
      if (mlMatrix.rows === 2) {
        return [["scale(0, 0)"], ["scale(0, 0)"]];
      } else {
        return [["scale3d(0, 0, 0)"], ["scale(0, 0, 0)"]];
      }
    } else if (this.isDiagonal(mlMatrix)) {
      return this.diagTransforms(mlMatrix);
    } else if (this.isShear(mlMatrix)) {
      return this.shearTransforms(mlMatrix);
    } else {
      const SVD: { U: MLMatrix; D: MLMatrix; V: MLMatrix } = this.SVD(mlMatrix);
      const U: MLMatrix = SVD.U;
      const D: MLMatrix = SVD.D;
      const V: MLMatrix = SVD.V;

      if (this.isDetPositive(V)) {
        [cssTransforms, outTransforms] = this.properRotationTransforms(V);
      } else {
        [cssTransforms, outTransforms] = this.improperRotationTransforms(V);
      }

      const [cssTransformsD, outTransformsD]: string[][] =
        this.diagTransforms(D);

      cssTransforms = cssTransforms.concat(cssTransformsD);
      outTransforms = outTransforms.concat(outTransformsD);

      let cssTransformsU: string[];
      let outTransformsU: string[];
      if (this.isDetPositive(U)) {
        [cssTransformsU, outTransformsU] = this.properRotationTransforms(U);
      } else {
        [cssTransformsU, outTransformsU] = this.improperRotationTransforms(U);
      }

      cssTransforms = cssTransforms.concat(cssTransformsU);
      outTransforms = outTransforms.concat(outTransformsU);
    }

    return [cssTransforms, outTransforms];
  }

  private SVD(mlMatrix: MLMatrix) {
    const SVD: SingularValueDecomposition = new SingularValueDecomposition(
      mlMatrix
    );
    return {
      U: SVD.leftSingularVectors,
      D: SVD.diagonalMatrix,
      V: SVD.rightSingularVectors.transpose()
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
      const projectionAxis: string = axis === "X" ? "Y" : "X";
      const plane: string = i === 0 ? "YZ" : i === 1 ? "XZ" : "XY";
      const projectionStr: string =
        diag.length === 2 ? `${projectionAxis}-axis` : `${plane}-plane`;

      if (diag[i] != 1) {
        const roundedDiag = +diag[i].toFixed(2);
        if (diag[i] >= 0) {
          cssTransforms.push(`scale${axis}(${roundedDiag})`);
          outTransforms.push(
            diag[i] === 0
              ? `project(${projectionStr})`
              : `scale${axis}(${roundedDiag})`
          );
        } else {
          if (diag[i] != -1) {
            cssTransforms.push(`scale${axis}(${-1 * roundedDiag})`);
            outTransforms.push(`scale${axis}(${-1 * roundedDiag})`);
          }

          cssTransforms.push(`scale${axis}(-1)`);
          outTransforms.push(`reflect(${projectionStr})`);
        }
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

  private isZero(mlMatrix: MLMatrix): boolean {
    let arr: number[][];
    if (mlMatrix.rows === 2) {
      arr = [
        [0, 0],
        [0, 0]
      ];
    } else {
      arr = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];
    }
    return JSON.stringify(mlMatrix.to2DArray()) === JSON.stringify(arr);
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
    const angleX: number = +this.radToDeg(Math.atan(matrix[0][1])).toFixed(2);
    const angleY: number = +this.radToDeg(Math.atan(matrix[1][0])).toFixed(2);

    if (this.isXShear(mlMatrix)) {
      cssTransforms[0] = `skewX(${angleX}deg)`;
      outTransforms[0] = `shearX(${angleX}deg)`;
    } else if (this.isYShear(mlMatrix)) {
      cssTransforms[0] = `skewY(${angleY}deg)`;
      outTransforms[0] = `shearY(${angleY}deg)`;
    } else if (this.isXYShear(mlMatrix)) {
      cssTransforms = [`skew(${angleX}deg, ${angleY}deg)`];
      outTransforms = [`shear(${angleX}deg, ${angleY}deg)`];
    }

    return [cssTransforms, outTransforms];
  }

  private isDetPositive(mlMatrix: MLMatrix): boolean {
    return determinant(mlMatrix) > 0;
  }

  private properRotationTransforms(mlMatrix: MLMatrix): string[][] {
    const matrix: number[][] = mlMatrix.to2DArray();

    let angleX: number;
    let angleY: number;
    let angleZ: number;
    const transforms: string[] = [];

    if (matrix.length === 2) {
      const sign: number = matrix[1][0] < 0 ? -1 : 1;
      const bareAngle: number = sign * Math.abs(Math.acos(matrix[0][0]));
      const angle = +this.radToDeg(bareAngle).toFixed(2);
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
