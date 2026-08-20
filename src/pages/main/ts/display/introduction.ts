import { typesetMath } from "./mathjax";

export class Introduction {
  private static readonly storageKey = "matrixviz-introduction-dismissed";
  private static previousFocus: HTMLElement | null = null;

  public static initialize(): void {
    const overlay = document.getElementById("intro-overlay")!;

    document.getElementById("about-btn")!.addEventListener("click", () => {
      this.show();
    });

    document.getElementById("intro-close")!.addEventListener("click", () => {
      this.dismiss();
    });

    document.getElementById("intro-start")!.addEventListener("click", () => {
      this.dismiss();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) {
        this.dismiss();
      }
    });

    if (!this.wasDismissed()) {
      this.show();
    }

    typesetMath();
  }

  private static show(): void {
    const overlay = document.getElementById("intro-overlay")!;
    this.previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    overlay.hidden = false;
    document.getElementById("intro-start")!.focus();
  }

  private static dismiss(): void {
    document.getElementById("intro-overlay")!.hidden = true;
    this.saveDismissal();
    this.previousFocus?.focus();
    this.previousFocus = null;
  }

  private static wasDismissed(): boolean {
    try {
      return localStorage.getItem(this.storageKey) === "true";
    } catch {
      return false;
    }
  }

  private static saveDismissal(): void {
    try {
      localStorage.setItem(this.storageKey, "true");
    } catch {
      // The introduction still works when storage is unavailable.
    }
  }
}
