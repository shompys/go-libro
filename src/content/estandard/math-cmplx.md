# math/cmplx — Números Complejos

> **Import:** `import "math/cmplx"`

El paquete `math/cmplx` proporciona constantes y funciones matemáticas para números complejos (`complex128`).
Todas las funciones aceptan y retornan `complex128`.

---

## Conversión entre formas

| Función | Descripción |
|---------|-------------|
| `Abs(x complex128) float64` | Módulo = sqrt(real² + imag²) |
| `Phase(x complex128) float64` | Argumento (fase) en radianes [−π, π] |
| `Rect(r, θ float64) complex128` | Crea complejo desde coordenadas polares: r·e^(iθ) |
| `Polar(x complex128) (r, θ float64)` | Convierte a polares (módulo, fase) |
| `Conj(x complex128) complex128` | Conjugado: real − i·imag |

```go
z := complex(3, 4)
fmt.Println(cmplx.Abs(z))   // 5
fmt.Println(cmplx.Phase(z)) // ~0.927 rad (~53.13°)
fmt.Println(cmplx.Conj(z))  // (3-4i)

r, theta := cmplx.Polar(z)
fmt.Println(r, theta)       // 5 0.9272952180016122

w := cmplx.Rect(5, math.Pi/4) // √2·5/2 + √2·5/2 i
fmt.Println(w)                 // (3.5355339+3.5355339i)
```

---

## Exponenciales y logaritmos

| Función | Descripción |
|---------|-------------|
| `Exp(x complex128) complex128` | e^x |
| `Log(x complex128) complex128` | Logaritmo natural (rama principal) |
| `Log10(x complex128) complex128` | Logaritmo base 10 |
| `Pow(x, y complex128) complex128` | x^y |

```go
z := complex(1, math.Pi)
fmt.Println(cmplx.Exp(z))    // (-1+1.2246467991473515e-16i) ≈ e^(1+iπ)
fmt.Println(cmplx.Log(-1))   // (0+3.141592653589793i) = iπ
fmt.Println(cmplx.Pow(2, 3)) // (8+0i)
```

---

## Trigonométricas

| Función | Descripción |
|---------|-------------|
| `Sin(x complex128) complex128` | Seno |
| `Cos(x complex128) complex128` | Coseno |
| `Tan(x complex128) complex128` | Tangente |
| `Sinh(x complex128) complex128` | Seno hiperbólico |
| `Cosh(x complex128) complex128` | Coseno hiperbólico |
| `Tanh(x complex128) complex128` | Tangente hiperbólica |

---

## Trigonométricas inversas

| Función | Descripción |
|---------|-------------|
| `Asin(x complex128) complex128` | Arco seno |
| `Acos(x complex128) complex128) | Arco coseno |
| `Atan(x complex128) complex128) | Arco tangente |
| `Asinh(x complex128) complex128) | Arco seno hiperbólico |
| `Acosh(x complex128) complex128) | Arco coseno hiperbólico |
| `Atanh(x complex128) complex128) | Arco tangente hiperbólica |

---

## Raíz cuadrada

| Función | Descripción |
|---------|-------------|
| `Sqrt(x complex128) complex128` | Raíz cuadrada (rama principal) |
| `IsNaN(x complex128) bool` | ¿Es NaN alguna componente? |
| `IsInf(x complex128) bool` | ¿Es Inf alguna componente? |
| `NaN() complex128` | NaN complejo |
| `Inf() complex128` | Infinito complejo |

```go
z := cmplx.Asin(2.0) // asin(2) = π/2 − i·ln(2+√3)
fmt.Println(z)        // (1.5707963267948966-1.3169578969248166i)
```

---

## Ejemplo completo

```go
package main

import (
    "fmt"
    "math/cmplx"
)

func main() {
    z := complex(1, 1)
    fmt.Printf("z = %v\n", z)
    fmt.Printf("|z| = %v\n", cmplx.Abs(z))
    fmt.Printf("arg(z) = %v rad\n", cmplx.Phase(z))
    fmt.Printf("z² = %v\n", cmplx.Pow(z, 2))
    fmt.Printf("√z = %v\n", cmplx.Sqrt(z))
    fmt.Printf("e^z = %v\n", cmplx.Exp(z))
    fmt.Printf("ln(z) = %v\n", cmplx.Log(z))
    fmt.Printf("sin(z) = %v\n", cmplx.Sin(z))
}
```

---

[← Volver al índice](/indice)
