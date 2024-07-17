import { DisplayController } from "./display-controller";

export class Animator {
  private static speed: number = 30;
  private static styleSheet = document.getElementById("keyframes");

  /**
   * Animates the graph and its associated linear transformations.
   *
   * @param computedTransforms an ordered array of rotations, scaling, reflections, projections, and/or shears
   * @param cssTransforms an ordered array of CSS transforms
   * @param det the determinant of the input Matrix
   * @param eigenMathJax a MathJax expression that includes the eigenvalues and corresponding eigenvectors of the input Matrix
   * @param matricesMathJax an ordered array of matrix representations in MathJax for rotations, scaling, reflections, projections, and/or shears
   */
  public static async animate(
    computedTransforms: string[],
    cssTransforms: string[],
    det: number,
    eigenMathJax: string,
    matricesMathJax: string[]
  ): Promise<void> {
    this.reset();
    const stack: HTMLElement = document.getElementById("transform-stack")!;
    document.documentElement.classList.add("animate");
    this.getCurrentShape().classList.remove("paused");
    const div: HTMLElement | null = document.querySelector(
      "#options div:last-child"
    );
    div!.style.display = "flex";
    this.addSpeedBarListener();
    this.fillTeX(det, eigenMathJax);

    let initialString: string = "";
    if (
      document.getElementById("three-d-btn")!.classList.contains("selected")
    ) {
      initialString = `rotateX(-25deg) rotateY(-25deg)`;
    }

    let transformString: string = "";
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    for (let i = 0; i < cssTransforms.length; i++) {
      const shape: HTMLElement = this.getCurrentShape();
      const cssTransform: string = cssTransforms[i];
      const transform: string = computedTransforms[i];
      const matrixMathJax: string = matricesMathJax[i];

      const keyframes1: string = `@keyframes graphTransform${i} {
          0% { transform: ${initialString + " " + this.getInitialTransform(cssTransform) + " " + transformString} }
          100% { transform: ${initialString + " " + cssTransform + " " + transformString} }
      }`;

      const keyframes2: string = `@keyframes fadeIn {
          to { opacity: 1 }
      }`;

      const element: HTMLElement = document.createElement("button");
      element.textContent = transform;
      DisplayController.revealMatrix(element, matrixMathJax);
      stack.insertBefore(element, stack.firstChild);

      const time: number = 180 / self.speed;

      self.styleSheet!.innerHTML = `${keyframes1} ${keyframes2}`;

      shape.style.animation = `graphTransform${i} ${time}s 1`;
      element.style.animation = `fadeIn ${time}s 1`;

      await this.timeout(time * 1000);

      shape.style.transform =
        initialString + " " + cssTransform + " " + transformString;

      transformString = cssTransform + " " + transformString;
      self.styleSheet!.innerHTML = "";
    }

    DisplayController.pauseOrPlay(true);
    div!.style.display = "none";
    document.documentElement.classList.remove("animate");
  }

  private static getInitialTransform(str: string) {
    let replacement: string = "1";

    if (str.includes("deg")) {
      replacement = "0";
    }
    const newStr: string = str.replace(/-?\d+(\.\d+)?/g, replacement);

    if (newStr.includes("1d")) {
      return newStr.replace("1d", "3d");
    }

    return newStr;
  }

  private static timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

  private static fillTeX(det: number, eigenMathJax: string): void {
    document.getElementById("facts")!.innerHTML =
      `<p><strong>Determinant: </strong><span class="mathjax">\\(${det}\\)</span></p><p><strong>Eigenvalues and Eigenvectors:</strong><div class="mathjax">$$\\displaylines{${eigenMathJax}}$$</div></p>`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mathjax: any = MathJax;
    mathjax.typeset();
  }
}
