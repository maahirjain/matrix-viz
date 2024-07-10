import { Matrix } from "./src/common/ts/matrix";
import { Matrix as MLMatrix } from "ml-matrix";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const arr2D = [
  ["cos(20deg)", "sin(20deg)"],
  ["sin(20deg)", "-cos(20deg)"]
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const arr3D = [
  ["-2", "8", "20"],
  ["14", "19", "10"],
  ["2", "-2", "1"]
];

const matrix = new Matrix(arr3D);
const mlMatrix = new MLMatrix(matrix.matrix);

console.log(matrix.SVD(mlMatrix).U);
console.log(matrix.SVD(mlMatrix).D);
console.log(matrix.SVD(mlMatrix).V);

// console.log(matrix);
// const [cssTransforms, outTransforms] =
//   matrix.improperRotationTransforms(mlMatrix);
// console.log(cssTransforms);
// console.log(outTransforms);
