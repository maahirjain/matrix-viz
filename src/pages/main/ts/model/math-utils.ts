/**
 * Equivalent to Math.PI.
 */
export const PI: number = Math.PI;

const toRadians = (degrees: number): number => degrees * (PI / 180);

/**
 * Equivalent to Math.abs.
 */
export const abs: (x: number) => number = Math.abs;

/**
 * Equivalent to Math.cos.
 */
export const cos: (x: number) => number = Math.cos;

/**
 * Equivalent to Math.sin for degrees.
 */
export const sind: (x: number) => number = (x: number) =>
  Math.sin(toRadians(x));

/**
 * Equivalent to Math.cos for degrees.
 */
export const cosd: (x: number) => number = (x: number) =>
  Math.cos(toRadians(x));

/**
 * Equivalent to Math.tan for degrees.
 */
export const tand: (x: number) => number = (x: number) =>
  Math.tan(toRadians(x));

/**
 * Equivalent to Math.asin.
 */
export const asin: (x: number) => number = Math.asin;

/**
 * Equivalent to Math.acos.
 */
export const acos: (x: number) => number = Math.acos;

/**
 * Equivalent to Math.atan.
 */
export const atan: (x: number) => number = Math.atan;

/**
 * Equivalent to Math.atan2.
 */
export const atan2: (y: number, x: number) => number = Math.atan2;
