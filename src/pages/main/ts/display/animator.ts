export class Animator {
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
  ): void {}

  private static reset(): void {
    
  }
}
