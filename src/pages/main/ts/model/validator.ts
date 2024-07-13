import { evaluate } from "mathjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Validator {
  /**
   * Checks if a cell input is a real number less than 1000.
   *
   * @param input the user's cell input
   * @returns true for a valid cell and false for an invalid cell
   */
  public isCellValid(input: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const evaluatedInput: any = evaluate(input);
    return typeof evaluatedInput === "number" && evaluatedInput < 1000;
  }

  /**
   * Checks if every cell in the input matrix contains a real number less than 1000.
   *
   * @param matrix the user's input matrix
   * @returns true if every cell in the matrix is valid and false otherwise
   */
  public isMatrixValid(matrix: string[][]): boolean {
    return matrix.every((row) => row.every((cell) => this.isCellValid(cell)));
  }

  /**
   * Identifies cells that are not real numbers less than 1000 in the input matrix.
   *
   * @param matrix the user's input matrix
   * @returns an array of indices of invalid cells
   */
  public getInvalidCells(matrix: string[][]): number[] {
    const arr: number[] = [];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (!this.isCellValid(matrix[i][j])) {
          arr.push(i + j);
        }
      }
    }

    return arr;
  }
}
