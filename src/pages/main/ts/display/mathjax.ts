interface MathJaxGlobal {
  typeset(): void;
}

let typesetPending = false;

function getMathJax(): MathJaxGlobal | undefined {
  return (window as typeof window & { MathJax?: MathJaxGlobal }).MathJax;
}

export function typesetMath(): void {
  const mathJax = getMathJax();
  if (mathJax != undefined) {
    mathJax.typeset();
    return;
  }

  if (typesetPending) return;

  const script = document.getElementById("MathJax-script");
  if (script == null) return;

  typesetPending = true;
  script.addEventListener(
    "load",
    () => {
      typesetPending = false;
      getMathJax()?.typeset();
    },
    { once: true }
  );
}
