// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ValidatorDisplay {
  /**
   * Displays a red border and error message if a cell is invalid.
   *
   * @param document the current HTML document
   * @param inputElem the input cell
   */
  public displayInvalidCell(document: Document, inputElem: HTMLElement): void {
    inputElem.style.border = "1px solid red";
    const errorDiv: HTMLElement = document.createElement("div");
    errorDiv.textContent = "Inputs must be real numbers in (-1000, 1000)";
    errorDiv.id = "invalid-msg";
    document.getElementById("matrix-facts")!.appendChild(errorDiv);
  }

  /**
   * Displays a green border if a cell is valid.
   *
   * @param document the current HTML document
   * @param inputElem the input cell
   */
  public displayValidCell(document: Document, inputElem: HTMLElement): void {
    inputElem.style.border = "1px solid green";

    const invalidDiv: HTMLElement | null =
      document.getElementById("invalid-msg");
    if (invalidDiv != null) {
      invalidDiv.remove();
    }
  }
}
