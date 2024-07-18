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
    const shape: HTMLElement = this.getCurrentShape();
    const stack: HTMLElement = document.getElementById("transform-stack")!;
    let addedTransforms: string = "";
    document.documentElement.classList.add("animate");
    shape.classList.remove("paused");
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
      initialString = DisplayController.transform;
    }

    let transformString: string = "";
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    const axes: HTMLElement | null = document.getElementById("axes");
    if (axes != null) {
      axes.style.transform = initialString;
    }
    this.getInitialShape().style.transform = initialString;

    for (let i = 0; i < cssTransforms.length; i++) {
      const cssTransform: string = cssTransforms[i];
      const transform: string = computedTransforms[i];
      const matrixMathJax: string = matricesMathJax[i];
      addedTransforms = addedTransforms + " " + cssTransform;

      const keyframes1: string = `@keyframes graphTransform${i} {
          0% { transform: ${initialString + " " + this.getInitialTransform(cssTransform) + " " + transformString} }
          100% { transform: ${initialString + " " + cssTransform + " " + transformString} }
      }`;

      const keyframes2: string = `@keyframes fadeIn {
          to { opacity: 1 }
      }`;

      const element: HTMLElement = document.createElement("button");
      element.textContent = transform;
      element.dataset.index = "" + i;

      DisplayController.revealMatrix(element, matrixMathJax);
      stack.insertBefore(element, stack.firstChild);

      const time: number = 60 / self.speed;

      self.styleSheet!.innerHTML = `${keyframes1} ${keyframes2}`;

      shape.style.animation = `graphTransform${i} ${time}s 1`;
      element.style.animation = `fadeIn ${time}s 1`;

      await this.timeout(time * 1000);

      if (shape.classList.contains("paused")) {
        await this.pauseClick();
      }

      shape.style.transform =
        initialString + " " + cssTransform + " " + transformString;

      transformString = cssTransform + " " + transformString;
      self.styleSheet!.innerHTML = "";
    }

    if (
      document.getElementById("three-d-btn")!.classList.contains("selected")
    ) {
      DisplayController.shapeTransforms = window
        .getComputedStyle(shape)
        .getPropertyValue("transform");
      DisplayController.rawTransforms = addedTransforms
        .split(" ")
        .reverse()
        .join(" ");
      DisplayController.matricesMathJax = matricesMathJax;
      DisplayController.stack = stack.innerHTML;
    }

    div!.style.display = "none";
    document.documentElement.classList.remove("animate");
  }

  private static async pauseClick() {
    return new Promise<void>(
      (resolve) =>
        (document.getElementById("pause-play-btn")!.onclick = () => resolve())
    );
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

  private static getInitialShape(): HTMLElement {
    if (document.getElementById("cube-btn")!.classList.contains("selected")) {
      if (document.getElementById("cube-btn")!.textContent === "Cube") {
        return document.getElementById("cube")!;
      } else {
        return document.getElementById("square")!;
      }
    } else {
      if (document.getElementById("pyramid-btn")!.textContent === "Pyramid") {
        return document.getElementById("pyramid")!;
      } else {
        return document.getElementById("triangle")!;
      }
    }
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
