// rx = @(x) [1 0 0; 0 cosd(x) -sind(x); 0 sind(x) cosd(x)];
// ry = @(y) [cosd(y) 0 sind(y); 0 1 0; -sind(y) 0 cosd(y)];
// rz = @(z) [cosd(z) -sind(z) 0; sind(z) cosd(z) 0; 0 0 1];
// sx2 = @(x) [x 0; 0 1];
// sy2 = @(y) [1 0; 0 y];
// sx3 = @(x) [x 0 0; 0 1 0; 0 0 1];
// sy3 = @(y) [1 0 0; 0 y 0; 0 0 1];
// sz3 = @(z) [1 0 0; 0 1 0; 0 0 z];
// r = @(x) [cosd(x) -sind(x); sind(x) cosd(x)];
// skx2 = @(x) [1 tand(x); 0 1];
// skx3 = @(x) [1 tand(x) 0; 0 1 0; 0 0 1];
// sky2 = @(y) [1 0; tand(y) 1];
// sky3 = @(y) [1 0 0; tand(y) 1 0; 0 0 1];
// skxy2 = @(x, y) [1 tand(x); tand(y) 1];
// skxy3 = @(x, y) [1 tand(x) 0; tand(y) 1 0; 0 0 1];
// s02 = @() [0 0; 0 0];
// s03 = @() [0 0 0; 0 0 0; 0 0 0];

import { Matrix } from "./src/pages/main/ts/model/matrix";

const arr2D = [
  ["1", "0"],
  ["0", "1"]
];

const arr3D = [
  ["1", "0", "0"],
  ["0", "1", "0"],
  ["0", "0", "1"]
];

const matrix2D = new Matrix(arr2D);
const matrix3D = new Matrix(arr3D);

const cssTransforms2D: string[] = matrix2D.computeCSSTransforms();
const outTransforms2D: string[] = matrix2D.computeTransforms();
const cssTransforms3D: string[] = matrix3D.computeCSSTransforms();
const outTransforms3D: string[] = matrix3D.computeTransforms();

const arrNew3D = [];
for (let str of cssTransforms3D) {
  str = str.replace("rotateX", "rx");
  str = str.replace("rotateY", "ry");
  str = str.replace("rotateZ", "rz");
  str = str.replace("scaleX", "sx3");
  str = str.replace("scaleY", "sy3");
  str = str.replace("scaleZ", "sz3");
  str = str.replace("shearX", "skx3");
  str = str.replace("shearY", "sky3");
  str = str.replace("shearXY", "skxy3");
  str = str.replace("deg", "");
  arrNew3D.push(str);
}

const arrNew2D = [];
for (let str of cssTransforms2D) {
  str = str.replace("rotate", "r");
  str = str.replace("scaleX", "sx2");
  str = str.replace("scaleY", "sy2");
  str = str.replace("shearX", "skx2");
  str = str.replace("shearY", "sky2");
  str = str.replace("shearXY", "skxy2");
  str = str.replace("deg", "");
  arrNew2D.push(str);
}

let str2D = "";
for (let i = arrNew2D.length - 1; i >= 0; i--) {
  str2D = str2D + " * " + arrNew2D[i];
}

let str3D = "";
for (let i = arrNew3D.length - 1; i >= 0; i--) {
  str3D = str3D + " * " + arrNew3D[i];
}

str2D = str2D.substring(3);
str3D = str3D.substring(3);

console.log(matrix2D);
console.log(cssTransforms2D);
console.log(outTransforms2D);
matrix2D.computeTransformMatricesMathJax().forEach((str) => console.log(str));
console.log(matrix2D.det());
console.log(matrix2D.eigenMathJax());
console.log(str2D);
console.log("----------------------------------------------------");
console.log(matrix3D);
console.log(cssTransforms3D);
console.log(outTransforms3D);
matrix3D.computeTransformMatricesMathJax().forEach((str) => console.log(str));
console.log(matrix3D.det());
console.log(matrix3D.eigenMathJax());
console.log(str3D);
