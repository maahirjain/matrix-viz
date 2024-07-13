import { evaluate } from "mathjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Validator {
  /**
   * Checks if a cell input is a real number less between -1000 and 1000 (exclusive).
   *
   * @param input the user's cell input
   * @returns true for a valid cell and false for an invalid cell
   */
  public isCellValid(input: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const evaluatedInput: any = evaluate(input);
    return (
      input != "" &&
      typeof evaluatedInput === "number" &&
      !isNaN(+evaluatedInput) &&
      evaluatedInput < 1000 &&
      evaluatedInput > -1000
    );
  }

  /**
   * Checks if every cell in the input matrix contains a real number between -1000 and 1000 (exclusive).
   *
   * @param matrix the user's input matrix
   * @returns true if every cell in the matrix is valid and false otherwise
   */
  public isMatrixValid(matrix: string[][]): boolean {
    return matrix.every((row) => row.every((cell) => this.isCellValid(cell)));
  }
}
