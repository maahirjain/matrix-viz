import { DisplayController } from "./display-controller";

export class Animator {
  private static speed: number = 30;

  /**
   * Animates the graph and its associated linear transformations.
   *
   * @param computedTransforms an ordered array of rotations, scaling, reflections, projections, and/or shears
   * @param cssTransforms an ordered array of CSS transforms
   * @param det the determinant of the input Matrix
   * @param eigenMathJax a MathJax expression that includes the eigenvalues and corresponding eigenvectors of the input Matrix
   * @param matricesMathJax an ordered array of matrix representations in MathJax for rotations, scaling, reflections, projections, and/or shears
   */
  public static animate(
    computedTransforms: string[],
    cssTransforms: string[],
    det: number,
    eigenMathJax: string,
    matricesMathJax: string[]
  ): void {
    this.reset();
    const shape: HTMLElement = this.getCurrentShape();
    document.documentElement.classList.add("animate");
    shape.classList.remove("paused");
    const div: HTMLElement | null = document.querySelector(
      "#options div:last-child"
    );
    div!.style.display = "flex";
    this.addSpeedBarListener();
  }

  private static reset(): void {
    if (document.getElementById("cube-btn")!.classList.contains("selected")) {
      DisplayController.cubeSquareReset();
    } else {
      DisplayController.pyramidTriangleReset();
    }

    document.getElementById("transform-stack")!.innerHTML =
      `<button id="identity-btn">identity</button>`;
    DisplayController.identityHover();
  }

  private static getCurrentShape(): HTMLElement {
    if (document.getElementById("cube-btn")!.classList.contains("selected")) {
      if (document.getElementById("cube-btn")!.textContent === "Cube") {
        return document.getElementById("transform-cube")!;
      } else {
        return document.getElementById("transform-square")!;
      }
    } else {
      if (document.getElementById("pyramid-btn")!.textContent === "Pyramid") {
        return document.getElementById("transform-pyramid")!;
      } else {
        return document.getElementById("transform-triangle")!;
      }
    }
  }

  private static addSpeedBarListener() {
    const speedBar: HTMLElement = document.getElementById("speed")!;
    speedBar!.addEventListener("input", () => {
      this.speed = +(<HTMLInputElement>speedBar).value;
    });
  }
}
