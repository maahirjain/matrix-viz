export class ValidatorDisplay {
  /**
   * Displays a red border and error message if a cell is invalid.
   *
   * @param inputElem the input cell
   */
  public static displayInvalidCell(inputElem: HTMLElement): void {
    inputElem.classList.remove("valid");
    inputElem.classList.add("invalid");
    const errorDiv: HTMLElement = document.createElement("div");
    errorDiv.textContent = "Inputs must be real numbers in (-1000, 1000)";
    errorDiv.id = "invalid-msg";

    if (document.getElementById("invalid-msg") === null) {
      document
        .getElementById("matrix-facts")!
        .insertBefore(
          errorDiv,
          document.getElementById("matrix-facts")!.firstChild
        );
    }
  }

  /**
   * Displays a green border if a cell is valid.
   *
   * @param inputElem the input cell
   */
  public static displayValidCell(inputElem: HTMLElement): void {
    inputElem.classList.remove("invalid");
    inputElem.classList.add("valid");

    const invalidDiv: HTMLElement | null =
      document.getElementById("invalid-msg");
    if (invalidDiv != null) {
      invalidDiv.remove();
    }
  }
}
