export const PI: number = Math.PI;

const toRadians = (degrees: number): number => degrees * (PI / 180);

export const abs: (x: number) => number = Math.abs;
export const cos: (x: number) => number = Math.cos;

export const sind: (x: number) => number = (x: number) =>
  Math.sin(toRadians(x));
export const cosd: (x: number) => number = (x: number) =>
  Math.cos(toRadians(x));
export const tand: (x: number) => number = (x: number) =>
  Math.tan(toRadians(x));

export const asin: (x: number) => number = Math.asin;
export const acos: (x: number) => number = Math.acos;
export const atan: (x: number) => number = Math.atan;
export const atan2: (y: number, x: number) => number = Math.atan2;
