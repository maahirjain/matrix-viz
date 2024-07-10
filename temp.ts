import { Matrix } from "./src/common/ts/matrix";
import { Matrix as MLMatrix } from "ml-matrix";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const arr2D = [
  ["12", "0"],
  ["0", "0"]
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const arr3D = [
  ["sin(45deg)", "0", "0"],
  ["0", "5", "0"],
  ["-5", "0", "8"]
];

const matrix = new Matrix(arr3D);
const mlMatrix = new MLMatrix(matrix.matrix);

// const [cssTransforms, outTransforms] = matrix.diagTransforms(mlMatrix);
// console.log(cssTransforms);
// console.log(outTransforms);
