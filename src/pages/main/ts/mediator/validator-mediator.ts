import { Validator } from "../model/validator";
import { ValidatorDisplay } from "../display/validator-display";

export class ValidatorMediator {
  /**
   * Adds validation event listeners to input elements.
   */
  public static addInputEventListeners(): void {
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
}
