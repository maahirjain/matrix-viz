import { evaluate } from "mathjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Validator {
  public isCellValid(input: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const evaluatedInput: any = evaluate(input);
    return typeof evaluatedInput === "number" && evaluatedInput < 1000;
  }

  public isMatrixValid(matrix: string[][]): boolean {
    return matrix.every((row) => row.every((cell) => this.isCellValid(cell)));
  }
}
