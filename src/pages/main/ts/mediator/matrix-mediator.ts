import { Matrix } from "../model/matrix";
import { Validator } from "../model/validator";
import { ValidatorMediator } from "./validator-mediator";
import { Animator } from "../display/animator";

export class MatrixMediator {
  /**
   * Performs the animation when "Enter Matrix" is clicked for a valid matrix.
   */
  public static enterAndAnimate(): void {
    document.getElementById("enter-btn")!.addEventListener("click", () => {
      if (Validator.areBtnsClickable()) {
        const processedMatrix: string[][] =
          ValidatorMediator.processInputMatrix();

        if (Validator.isMatrixValid(processedMatrix)) {
          const matrix: Matrix = new Matrix(processedMatrix);
          const computedTransforms: string[] = matrix.computeTransforms();
          const det: number = matrix.det();
          const eigenMathJax: string = matrix.eigenMathJax();
          const matricesMathJax: string[] =
            matrix.computeTransformMatricesMathJax();
          const cssTransforms: string[] = this.scaleCSSTransforms(
            matrix.computeCSSTransforms()
          );

          Animator.animate(
            computedTransforms,
            cssTransforms,
            det,
            eigenMathJax,
            matricesMathJax
          );
        }
      }
    });
  }

  private static scaleCSSTransforms(cssTransforms: string[]): string[] {
    const scaledArr: string[] = [];

    for (const str of cssTransforms) {
      if (str.includes("(0)") || str.includes(",0)") || str.includes(", 0)")) {
        const newStr: string = str.replaceAll("0", "0.01");
        scaledArr.push(newStr);
      } else {
        scaledArr.push(str);
      }
    }

    return scaledArr;
  }
}
