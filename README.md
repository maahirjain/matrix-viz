# MatrixViz

A linear algebra tool that identifies linear transformations associated with any 3 x 3 or 2 x 2 matrix, and creates an interactive animation displaying the transformations.

## [Live Preview](https://matrixviz.com/)
Visit at [matrixviz.com](https://matrixviz.com/).

![Dark mode screenshot](./screenshot_dark_mode.png)
![Light mode screenshot](./screenshot_light_mode.png)

## Features
- Decomposes 2×2 and 3×3 matrices into sequences of recognizable transformations, including rotations, scaling, reflections, shears, and projections
- Animates each transformation in sequence on a square, triangle, cube, or pyramid while retaining an outline of the original shape for comparison
- Includes curated examples demonstrating common 2D and 3D transformations
- Accepts mathematical expressions such as `sin(45deg)` and `sqrt(2)/2`
- Displays the determinant, eigenvalues, and eigenvectors of the input matrix
- Reveals the matrix associated with each step in the transformation sequence
- Provides animation speed controls and pause/resume functionality
- Supports shareable links that preserve the selected shape and matrix
- Supports mouse, touch, and pen interaction for changing the 3D viewing angle
- Preserves independent visualization state when switching between 2D and 3D modes
- Includes responsive phone, tablet, and desktop layouts
- Supports light and dark themes and reduced-motion preferences

## Documentation
You can access TypeDoc documentation for the project [here](https://maahirjain.github.io/matrix-viz/docs/).

## Behind the Scenes
Here is a sketch of how the linear transformations associated with the input matrix are computed:

The input matrix is first compared against some common matrix forms associated with scaling, shears, reflections, and projections – specifically, the following, where $*$ represents any real number.

### 2 x 2
```math
  \begin{bmatrix} 
    * & 0 \\ 
    0 & * 
  \end{bmatrix},
  \quad
  \begin{bmatrix} 
    1 & * \\ 
    * & 1 
  \end{bmatrix}
```

### 3 x 3
```math
  \begin{bmatrix} 
    * & 0 & 0 \\ 
    0 & * & 0 \\
    0 & 0 & *
  \end{bmatrix},
  \quad
  \begin{bmatrix} 
    1 & * & 0 \\ 
    * & 1 & 0 \\
    0 & 0 & 0
  \end{bmatrix}
```

If the input matrix $M$ is not in one of these forms, its [singular value decomposition](https://en.wikipedia.org/wiki/Singular_value_decomposition) $M = U\Sigma V^T$ is computed.

We know that $\Sigma$ is a diagonal matrix and hence represents the product of a scaleX, scaleY, and scaleZ matrix.

$U$ and $V^T$ are orthogonal, and it is known that every orthogonal matrix can be expressed as a product of rotation and reflection matrices. We find a decomposition of $U$ and $V^T$ into rotation and reflection matrices, as follows.

The determinant of an orthogonal matrix $Q$ is $\pm 1$ – if it is $1$, it represents a _proper_ rotation, and if it is $-1$, it represents a reflection followed by a _proper_ rotation.

Thus, if $\det(Q) = 1$, we can decompose $Q$ into rotateX, rotateY, and rotateZ matrices by [computing Euler angles](https://eecs.qmul.ac.uk/%7Egslabaugh/publications/euler.pdf). 

If $\det(Q) = -1$, we can decompose $Q = (QR)R$ where 
```math
  R =  
  \begin{bmatrix} 
    1 & 0 & 0 \\ 
    0 & 1 & 0 \\
    0 & 0 & -1
  \end{bmatrix}
```
which represents a reflection with respect to the $XY$-plane. We have $(QR)^T = R^TQ^T = R^{-1}Q^{-1} = (QR)^{-1}$ and $\det(QR) = \det(Q)\det(R) = -1 \cdot -1 = 1$. Hence, $QR$ represents a proper rotation and can be decomposed as above.

