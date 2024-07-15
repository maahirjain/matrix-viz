import { Validator } from "../model/validator";
import { ValidatorMediator } from "../mediator/validator-mediator";

export class DisplayController {
  /**
   * Toggles between light and dark modes.
   */
  public static toggleTheme(): void {
    const svg: HTMLElement | null = document.querySelector("#header svg");
    const htmlElement: HTMLElement | null = document.documentElement;

    svg!.addEventListener("click", () => {
      if (htmlElement!.classList.contains("light-theme")) {
        htmlElement!.classList.remove("light-theme");
        htmlElement!.classList.add("dark-theme");

        svg!.innerHTML = `<path fill="white" d="M17.75,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5" />`;
      } else {
        htmlElement!.classList.remove("dark-theme");
        htmlElement!.classList.add("light-theme");

        svg!.innerHTML = `<path fill="rgb(105, 105, 105)" d="M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13" />`;
      }
    });
  }

  /**
   * Adds event listeners for page buttons.
   */
  public static addEventListeners(): void {
    this.addTwoDBtnListener();
    this.addThreeDBtnListener();
    this.addCubeSquareBtnListener();
    this.addPyramidTriangleBtnListener();
  }

  private static addTwoDBtnListener(): void {
    document.getElementById("two-d-btn")!.addEventListener("click", () => {
      if (Validator.areBtnsClickable()) {
        document.getElementById("three-d-btn")!.classList.remove("selected");
        document.getElementById("two-d-btn")!.classList.add("selected");

        const matrixGrid: HTMLElement | null =
          document.getElementById("matrix-grid");

        matrixGrid!.style.gridTemplateRows = "repeat(2, 35px)";
        matrixGrid!.style.gridTemplateColumns = "repeat(2, 30%)";
        matrixGrid!.innerHTML = `<input type="text" class="valid" value="1"><input type="text" class="valid" value="0"><input type="text" class="valid" value="0"><input type="text" class="valid" value="1"><p>Supports expressions like sin(45deg), sqrt(2)/2</p>`;

        const p: HTMLElement | null = document.querySelector("#matrix-input p");
        p!.style.gridColumn = "1 / 3";

        document.getElementById("cube-btn")!.textContent = "Square";
        document.getElementById("pyramid-btn")!.textContent = "Triangle";

        this.addSquareContent();
        this.selectCubeSquare();

        document.querySelector("#facts div")!.innerHTML =
          "$$\\displaylines{\\lambda_1 = 1, \\quad \\mathbf{v_1} = \\begin{bmatrix}1\\\\0\\end{bmatrix}\\\\\\lambda_2 = 1, \\quad \\mathbf{v_2} = \\begin{bmatrix}0\\\\1\\end{bmatrix}}$$";

        document.getElementById("matrix-mathjax")!.innerHTML =
          "$$\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$$<div><div>Hover over a transformation below to see its associated matrix</div></div>";

        const invalidDiv: HTMLElement | null =
          document.getElementById("invalid-msg");
        if (invalidDiv != null) {
          invalidDiv.remove();
        }

        ValidatorMediator.addEventListeners();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mathjax: any = MathJax;
        mathjax.typeset();
      }
    });
  }

  private static addThreeDBtnListener(): void {
    document.getElementById("three-d-btn")!.addEventListener("click", () => {
      if (Validator.areBtnsClickable()) {
        document.getElementById("two-d-btn")!.classList.remove("selected");
        document.getElementById("three-d-btn")!.classList.add("selected");

        const matrixGrid: HTMLElement | null =
          document.getElementById("matrix-grid");

        matrixGrid!.style.gridTemplateRows = "repeat(3, 35px)";
        matrixGrid!.style.gridTemplateColumns = "repeat(3, 30%)";
        matrixGrid!.innerHTML = `<input type="text" class="valid" value="1"><input type="text" class="valid" value="0"><input type="text" class="valid" value="0"><input type="text" class="valid" value="0"><input type="text" class="valid" value="1"><input type="text" class="valid" value="0"><input type="text" class="valid" value="0"><input type="text" class="valid" value="0"><input type="text" class="valid" value="1"><p>Supports expressions like sin(45deg), sqrt(2)/2</p>`;

        const p: HTMLElement | null = document.querySelector("#matrix-input p");
        p!.style.gridColumn = "1 / 4";

        document.getElementById("cube-btn")!.textContent = "Cube";
        document.getElementById("pyramid-btn")!.textContent = "Pyramid";

        this.addCubeContent();
        this.selectCubeSquare();

        document.querySelector("#facts div")!.innerHTML =
          "$$\\displaylines{\\lambda_1 = 1, \\quad \\mathbf{v_1} = \\begin{bmatrix}1\\\\0\\\\0\\end{bmatrix}\\\\\\lambda_2 = 1, \\quad \\mathbf{v_2} = \\begin{bmatrix}0\\\\1\\\\0\\end{bmatrix}\\\\\\lambda_3 = 1, \\quad \\mathbf{v_3} = \\begin{bmatrix}0\\\\0\\\\1\\end{bmatrix}}$$";

        document.getElementById("matrix-mathjax")!.innerHTML =
          "$$\\begin{bmatrix}1&0&0\\\\0&1&0\\\\0&0&1\\end{bmatrix}$$<div><div>Hover over a transformation below to see its associated matrix</div></div>";

        const invalidDiv: HTMLElement | null =
          document.getElementById("invalid-msg");
        if (invalidDiv != null) {
          invalidDiv.remove();
        }

        ValidatorMediator.addEventListeners();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mathjax: any = MathJax;
        mathjax.typeset();
      }
    });
  }

  private static addCubeSquareBtnListener() {
    const btn: HTMLElement | null = document.getElementById("cube-btn");
    btn!.addEventListener("click", () => {
      if (Validator.areBtnsClickable()) {
        this.selectCubeSquare();
        if (btn!.textContent === "Cube") {
          this.addCubeContent();
        } else {
          this.addSquareContent();
        }
      }
    });
  }

  private static addPyramidTriangleBtnListener() {
    const btn: HTMLElement | null = document.getElementById("pyramid-btn");
    btn!.addEventListener("click", () => {
      if (Validator.areBtnsClickable()) {
        this.selectPyramidTriangle();
        if (btn!.textContent === "Pyramid") {
          this.addPyramidContent();
        } else {
          this.addTriangleContent();
        }
      }
    });
  }

  private static selectCubeSquare(): void {
    const cubeBtn: HTMLElement | null = document.getElementById("cube-btn");
    const pyramidBtn: HTMLElement | null =
      document.getElementById("pyramid-btn");

    cubeBtn!.classList.add("selected");
    pyramidBtn!.classList.remove("selected");
  }

  private static selectPyramidTriangle(): void {
    const cubeBtn: HTMLElement | null = document.getElementById("cube-btn");
    const pyramidBtn: HTMLElement | null =
      document.getElementById("pyramid-btn");

    pyramidBtn!.classList.add("selected");
    cubeBtn!.classList.remove("selected");
  }

  private static addCubeContent(): void {
    document.getElementById("graph")!.innerHTML =
      `<div id="cube"><div id="cube-face-front"></div><div id="cube-face-back"></div><div id="cube-face-right"></div><div id="cube-face-left"></div><div id="cube-face-top"></div><div id="cube-face-bottom"></div></div><div id="transform-cube"><div id="transform-cube-face-front"></div><div id="transform-cube-face-back"></div><div id="transform-cube-face-right"></div><div id="transform-cube-face-left"></div><div id="transform-cube-face-top"></div><div id="transform-cube-face-bottom"></div></div><div id="axes"><div id="x-axis"></div><div id="y-axis"></div><div id="z-axis"></div></div>`;
  }

  private static addPyramidContent(): void {
    document.getElementById("graph")!.innerHTML =
      `<div id="pyramid"><div id = "pyramid-side-one" class="pyramid-side">&#9650;</div><div id = "pyramid-side-two" class="pyramid-side">&#9650;</div><div id = "pyramid-side-three" class="pyramid-side">&#9650;</div><div id = "pyramid-side-four" class="pyramid-side">&#9650;</div></div><div id="transform-pyramid"><div id="transform-pyramid-side-one" class="transform-pyramid-side">&#9650;</div><div id="transform-pyramid-side-two" class="transform-pyramid-side">&#9650;</div><div id="transform-pyramid-side-three" class="transform-pyramid-side">&#9650;</div><div id="transform-pyramid-side-four" class="transform-pyramid-side">&#9650;</div></div><div id="axes"><div id="x-axis"></div><div id="y-axis"></div><div id="z-axis"></div></div>`;
  }

  private static addSquareContent(): void {
    document.getElementById("graph")!.innerHTML =
      `<div id="square"></div><div id="transform-square"></div><div id="two-d-axes"><div id="x-axis"></div><div id="y-axis"></div></div>`;
  }

  private static addTriangleContent(): void {
    document.getElementById("graph")!.innerHTML =
      `<div id="triangle">&#9650;</div><div id="transform-triangle">&#9650;</div><div id="two-d-axes"><div id="x-axis"></div><div id="y-axis"></div></div>`;
  }
}
