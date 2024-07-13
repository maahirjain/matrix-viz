import { Validator } from "../model/validator";
import { ValidatorDisplay } from "../display/validator-display";

export class ValidatorMediator {
  /**
   * Converts the user inputs into a two-dimensional array
   *
   * @returns a two-dimensional array with user inputs
   */
  public static processInputMatrix(): string[][] {
    const inputArr: string[] = Array.from(
      document.querySelectorAll("input")
    ).map((input) => "" + input.value);

    const matrix: string[][] = [];
    while (inputArr.length) {
      matrix.push(inputArr.splice(0, Math.sqrt(inputArr.length)));
    }

    return matrix;
  }

  private static addEnterBtnEventListener(): void {
    const enterBtn: HTMLElement | null = document.getElementById("enter-btn");
    enterBtn!.addEventListener("mouseover", () => {
      const matrix: string[][] = this.processInputMatrix();
      if (Validator.isMatrixValid(matrix)) {
        enterBtn!.classList.remove("invalid-matrix");
        enterBtn!.classList.add("valid-matrix");
      } else {
        enterBtn!.classList.remove("valid-matrix");
        enterBtn!.classList.add("invalid-matrix");
      }
    });
  }

  private static addInputEventListeners(): void {
    Array.from(document.querySelectorAll("input")).forEach((input) => {
      input.addEventListener("input", () => {
        if (Validator.isCellValid("" + input.value)) {
          ValidatorDisplay.displayValidCell(input);
        } else {
          ValidatorDisplay.displayInvalidCell(input);
        }
      });
    });
  }

  /**
   * Adds validation event listeners to input elements and the enter button.
   */
  public static addEventListeners(): void {
    this.addInputEventListeners();
    this.addEnterBtnEventListener();
  }
}
