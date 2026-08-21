import { Matrix } from "../model/matrix";
import { Validator } from "../model/validator";
import { ValidatorMediator } from "./validator-mediator";
import { Animator } from "../display/animator";
import { DisplayController } from "../display/display-controller";

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
          let eigenMathJax: string;
          try {
            eigenMathJax = matrix.eigenMathJax();
          } catch {
            eigenMathJax = "\\text{Unavailable for this matrix}";
          }
          const matricesMathJax: string[] =
            matrix.computeTransformMatricesMathJax();
          const cssTransforms: string[] = this.prepareCSSTransforms(
            matrix.computeCSSTransforms(),
            matrix.dimension
          );

          const identityMatrix3D = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
          ];

          Animator.animate(
            computedTransforms,
            cssTransforms,
            det,
            eigenMathJax,
            matricesMathJax
          );

          if (
            JSON.stringify(matrix.matrix) === JSON.stringify(identityMatrix3D)
          ) {
            if (document.getElementById("transform-cube") != null) {
              document.getElementById("transform-cube")!.style.transform =
                DisplayController.transform;
            } else {
              document.getElementById("transform-pyramid")!.style.transform =
                DisplayController.transform;
            }
            DisplayController.shapeTransforms = DisplayController.transform;
          }
        }
      }
    });
  }

  private static prepareCSSTransforms(
    cssTransforms: string[],
    dimension: number
  ): string[] {
    const preparedTransforms: string[] = [];

    for (const str of cssTransforms) {
      const displayTransform = this.toCSSCoordinates(str, dimension);

      if (
        displayTransform.includes("(0)") ||
        displayTransform.includes(",0)") ||
        displayTransform.includes(", 0)")
      ) {
        preparedTransforms.push(displayTransform.replace(/0/g, "0.01"));
      } else {
        preparedTransforms.push(displayTransform);
      }
    }

    return preparedTransforms;
  }

  private static toCSSCoordinates(
    transform: string,
    dimension: number
  ): string {
    const requiresSignChange =
      transform.startsWith("skew") ||
      (dimension === 2 && transform.startsWith("rotate(")) ||
      (dimension === 3 &&
        (transform.startsWith("rotateX(") || transform.startsWith("rotateZ(")));

    if (!requiresSignChange) return transform;

    return transform.replace(/-?\d+(?:\.\d+)?(?=deg)/g, (angle) => {
      return `${-Number(angle)}`;
    });
  }
}
