import { Matrix } from "./src/common/ts/matrix";
import { Matrix as MLMatrix } from "ml-matrix";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const arr2D = [
  ["1", "0"],
  ["1", "1"]
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const arr3D = [
  ["1", "0", "0"],
  ["0", "1", "0"],
  ["0", "0", "1"]
];

const matrix = new Matrix(arr2D);
const mlMatrix = new MLMatrix(matrix.matrix);

// console.log(matrix);
// const [cssTransforms, outTransforms] = matrix.shearTransforms(mlMatrix);
// console.log(cssTransforms);
// console.log(outTransforms);
