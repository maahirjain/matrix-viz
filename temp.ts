import { Matrix } from "./src/common/ts/matrix";

const arr = [
  ["sin(45 deg)", "sqrt(2)", "5 / 2"],
  ["5", "8.35", "cos(20 deg)"],
  ["2", "-0.1", "-3^2"]
];

const matrix = new Matrix(arr);

console.log(matrix.matrix);
console.log(matrix.dimension);
