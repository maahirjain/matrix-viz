import { Validator } from "../model/validator";

type ShareableShape = "square" | "triangle" | "cube" | "pyramid";

export class ShareableLink {
  private static trigger: HTMLButtonElement;
  private static popover: HTMLElement;
  private static output: HTMLInputElement;
  private static copyButton: HTMLButtonElement;
  private static status: HTMLElement;

  public static initialize(search: string = window.location.search): void {
    this.trigger = document.getElementById("share-btn") as HTMLButtonElement;
    this.popover = document.getElementById("share-popover")!;
    this.output = document.getElementById(
      "share-link-output"
    ) as HTMLInputElement;
    this.copyButton = document.getElementById(
      "share-copy-btn"
    ) as HTMLButtonElement;
    this.status = document.getElementById("share-copy-status")!;

    const state = this.parse(search);
    if (state !== null) this.apply(state);

    this.trigger.addEventListener("click", () => {
      this.popover.hidden ? this.open() : this.close();
    });
    this.copyButton.addEventListener("click", () => this.copy());
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (
        !this.popover.hidden &&
        target instanceof Node &&
        !document.getElementById("share-control")!.contains(target)
      ) {
        this.close();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !this.popover.hidden) {
        this.close(true);
      }
    });
  }

  private static apply(state: {
    shape: ShareableShape;
    values: string[];
  }): void {
    this.selectShape(state.shape);
    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        '#matrix-grid input[type="text"]'
      )
    );
    inputs.forEach((input, index) => {
      input.value = state.values[index];
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  private static open(): void {
    const matrix = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        '#matrix-grid input[type="text"]'
      )
    ).map((input) => input.value);
    const dimension = Math.sqrt(matrix.length);

    this.status.textContent = "";
    if (
      !Number.isInteger(dimension) ||
      !Validator.isMatrixValid(
        Array.from({ length: dimension }, (_, row) =>
          matrix.slice(row * dimension, (row + 1) * dimension)
        )
      )
    ) {
      this.output.value = "";
      this.copyButton.disabled = true;
      this.status.textContent = "Enter a valid matrix to create a link.";
    } else {
      const shape = document
        .querySelector("#shape-options .selected")!
        .textContent!.toLowerCase();
      const url = new URL(window.location.href);
      url.search = "";
      url.hash = "";
      url.searchParams.set("shape", shape);
      url.searchParams.set("matrix", matrix.join(","));
      this.output.value = url.toString().replace(/%2C/gi, ",");
      this.copyButton.disabled = false;
    }

    this.popover.hidden = false;
    this.trigger.setAttribute("aria-expanded", "true");
    this.output.focus();
    this.output.select();
  }

  private static close(returnFocus = false): void {
    this.popover.hidden = true;
    this.trigger.setAttribute("aria-expanded", "false");
    if (returnFocus) this.trigger.focus();
  }

  private static async copy(): Promise<void> {
    this.output.select();
    try {
      if (navigator.clipboard !== undefined) {
        await navigator.clipboard.writeText(this.output.value);
      } else if (!document.execCommand("copy")) {
        throw new Error("Copy command unavailable");
      }
      this.status.textContent = "Link copied.";
    } catch {
      this.status.textContent = "Select and copy the link manually.";
    }
  }

  private static parse(
    search: string
  ): { shape: ShareableShape; values: string[] } | null {
    const params = new URLSearchParams(search);
    const shape = params.get("shape")?.toLowerCase() as
      | ShareableShape
      | undefined;
    const matrix = params.get("matrix");
    const shapes: ShareableShape[] = ["square", "triangle", "cube", "pyramid"];

    if (shape === undefined || !shapes.includes(shape) || matrix === null) {
      return null;
    }

    const values = matrix.split(",").map((value) => value.trim());
    const dimension = shape === "square" || shape === "triangle" ? 2 : 3;
    if (
      values.length !== dimension * dimension ||
      !Validator.isMatrixValid(
        Array.from({ length: dimension }, (_, row) =>
          values.slice(row * dimension, (row + 1) * dimension)
        )
      )
    ) {
      return null;
    }

    return { shape, values };
  }

  private static selectShape(shape: ShareableShape): void {
    const is2D = shape === "square" || shape === "triangle";
    const dimensionButton = document.getElementById(
      is2D ? "two-d-btn" : "three-d-btn"
    ) as HTMLButtonElement;
    if (!dimensionButton.classList.contains("selected")) {
      dimensionButton.click();
    }

    const usesCubeButton = shape === "square" || shape === "cube";
    const shapeButton = document.getElementById(
      usesCubeButton ? "cube-btn" : "pyramid-btn"
    ) as HTMLButtonElement;
    if (!shapeButton.classList.contains("selected")) {
      shapeButton.click();
    }
  }
}
