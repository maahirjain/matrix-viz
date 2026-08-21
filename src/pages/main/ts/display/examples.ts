import { Validator } from "../model/validator";

interface MatrixExample {
  name: string;
  description: string;
  dimension: 2 | 3;
  values: string[];
}

const examples: MatrixExample[] = [
  {
    name: "Rotation by 45°",
    description: "Rotate the plane counterclockwise.",
    dimension: 2,
    values: ["cos(45deg)", "-sin(45deg)", "sin(45deg)", "cos(45deg)"]
  },
  {
    name: "Horizontal shear",
    description: "Slide each horizontal row to the side.",
    dimension: 2,
    values: ["1", "1", "0", "1"]
  },
  {
    name: "Reflection across y-axis",
    description: "Mirror the plane from left to right.",
    dimension: 2,
    values: ["-1", "0", "0", "1"]
  },
  {
    name: "Projection onto XY plane",
    description: "Flatten three-dimensional space along z.",
    dimension: 3,
    values: ["1", "0", "0", "0", "1", "0", "0", "0", "0"]
  },
  {
    name: "3D nonuniform scaling",
    description: "Stretch along x while compressing along z.",
    dimension: 3,
    values: ["2", "0", "0", "0", "1", "0", "0", "0", "0.5"]
  }
];

export class Examples {
  private static trigger: HTMLButtonElement;
  private static popover: HTMLElement;

  public static initialize(): void {
    this.trigger = document.getElementById("examples-btn") as HTMLButtonElement;
    this.popover = document.getElementById("examples-popover")!;

    this.renderExamples();

    this.trigger.addEventListener("click", () => {
      this.popover.hidden ? this.open() : this.close();
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (
        !this.popover.hidden &&
        target instanceof Node &&
        !document.getElementById("examples-control")!.contains(target)
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

  private static renderExamples(): void {
    const list = document.getElementById("examples-list")!;

    examples.forEach((example) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "example-choice";
      button.innerHTML = `<strong>${example.name}</strong><span>${example.description}</span><small>${example.dimension} x ${example.dimension}</small>`;
      button.addEventListener("click", () => this.select(example));
      list.appendChild(button);
    });
  }

  private static select(example: MatrixExample): void {
    if (!Validator.areBtnsClickable()) return;

    const dimensionButton = document.getElementById(
      example.dimension === 2 ? "two-d-btn" : "three-d-btn"
    ) as HTMLButtonElement;
    if (!dimensionButton.classList.contains("selected")) {
      dimensionButton.click();
    }

    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        '#matrix-grid input[type="text"]'
      )
    );
    inputs.forEach((input, index) => {
      input.value = example.values[index];
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    this.close();
    (document.getElementById("enter-btn") as HTMLButtonElement).click();
  }

  private static open(): void {
    this.popover.hidden = false;
    this.trigger.setAttribute("aria-expanded", "true");
    this.popover.querySelector<HTMLButtonElement>("button")?.focus();
  }

  private static close(returnFocus: boolean = false): void {
    this.popover.hidden = true;
    this.trigger.setAttribute("aria-expanded", "false");
    if (returnFocus) this.trigger.focus();
  }
}
