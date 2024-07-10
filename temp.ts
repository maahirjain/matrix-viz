import { Matrix } from "./src/common/ts/matrix";

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

console.log(matrix);
const cssTransforms: string[] = matrix.computeCSSTransforms();
const outTransforms: string[] = matrix.computeTransforms();
console.log(cssTransforms);
console.log(outTransforms);
