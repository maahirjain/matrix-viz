import { Matrix } from "./src/common/ts/matrix";
import { Matrix as MLMatrix } from "ml-matrix";

const arr = [
  ["12", "0", "0"],
  ["0", "5", "0"],
  ["-5", "0", "8"]
];

const matrix = new Matrix(arr);
const mlMatrix = new MLMatrix(matrix.matrix);

console.log(matrix.isDiagonal(mlMatrix));
