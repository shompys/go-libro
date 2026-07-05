# math — Funciones matemáticas

Operaciones matemáticas básicas: constantes, trigonometría, potencias, redondeo.

```go
import "math"
```

---

## Índice

- [Constantes](/estandard/math#constantes)
- [Redondeo y valor absoluto](/estandard/math#redondeo-y-valor-absoluto)
- [Potencias y raíces](/estandard/math#potencias-y-raíces)
- [Trigonometría](/estandard/math#trigonometría)
- [Logaritmos](/estandard/math#logaritmos)
- [Funciones especiales (Mod, Gamma, Bessel)](/estandard/math#funciones-especiales)
- [Signo y manipulación de bits](/estandard/math#signo-y-manipulación-de-bits)
- [Valores especiales (Inf, NaN)](/estandard/math#valores-especiales-y-verificación)
- [Descomposición de flotantes](/estandard/math#descomposición-de-flotantes)
- [Min y Max](/estandard/math#min-y-max)
- [Random en math/rand](/estandard/math#random-ver-math/rand)

---

## Constantes

```go
math.Pi      // 3.141592653589793
math.E       // 2.718281828459045
math.Phi     // 1.618033988749895
math.MaxFloat64  // máximo float64: 1.7976931348623157e+308
math.MinFloat64  // mínimo float64 positivo
```

---

## Redondeo y valor absoluto

| Función | Qué hace | Ejemplo |
|---------|----------|---------|
| `Abs(x)` | Valor absoluto | `Abs(-5)` → `5` |
| `Ceil(x)` | Redondear hacia arriba | `Ceil(3.2)` → `4.0` |
| `Floor(x)` | Redondear hacia abajo | `Floor(3.8)` → `3.0` |
| `Round(x)` | Redondear al más cercano | `Round(3.5)` → `4.0` |
| `Trunc(x)` | Truncar (quitar decimales) | `Trunc(3.9)` → `3.0` |

---

## Potencias y raíces

| Función | Qué hace |
|---------|----------|
| `Pow(x, y)` | x elevado a la y (`x^y`) |
| `Pow10(n)` | 10 elevado a la n |
| `Sqrt(x)` | Raíz cuadrada |
| `Cbrt(x)` | Raíz cúbica |
| `Hypot(x, y)` | sqrt(x*x + y*y) — hipotenusa |

```go
math.Pow(2, 3)    // 8.0
math.Pow(2, 10)   // 1024.0
math.Sqrt(9)      // 3.0
math.Sqrt(2)      // 1.4142135623730951
```

---

## Trigonometría

Todas trabajan en **radianes**, no grados:

| Función | Qué hace |
|---------|----------|
| `Sin(x)` | Seno |
| `Cos(x)` | Coseno |
| `Tan(x)` | Tangente |
| `Asin(x)` | Arco seno |
| `Acos(x)` | Arco coseno |
| `Atan(x)` | Arco tangente |
| `Atan2(y, x)` | Arco tangente de y/x |

```go
math.Sin(math.Pi / 2)  // 1.0
math.Cos(math.Pi)      // -1.0
```

---

## Logaritmos

| Función | Qué hace |
|---------|----------|
| `Log(x)` | Logaritmo natural (base e) |
| `Log2(x)` | Logaritmo base 2 |
| `Log10(x)` | Logaritmo base 10 |
| `Exp(x)` | e^x |
| `Log1p(x)` | ln(1+x) — más preciso para x cercano a 0 |

### Logb e Ilogb

| Función | Qué hace |
|---------|----------|
| `Logb(x)` | Exponente binario de x |
| `Ilogb(x)` | Exponente binario de x como int |

---

## Funciones especiales

### Mod, Remainder, Dim

| Función | Qué hace |
|---------|----------|
| `Mod(x, y)` | Resto de x/y (truncado, como en C) |
| `Remainder(x, y)` | Resto IEEE 754 de x/y |
| `Dim(x, y)` | max(x-y, 0) — distancia positiva |

### Gamma y error complementario

| Función | Qué hace |
|---------|----------|
| `Gamma(x)` | Función gamma Γ(x) |
| `Lgamma(x)` | ln(|Γ(x)|) y signo. Devuelve `(float64, int)` |
| `Erf(x)` | Función error |
| `Erfc(x)` | Función error complementaria (1 − erf(x)) |

### Funciones de Bessel

Funciones de Bessel de primer tipo (J) y segundo tipo (Y):

| Función | Orden |
|---------|-------|
| `J0(x)` | Orden 0 |
| `J1(x)` | Orden 1 |
| `Jn(n int, x)` | Orden n |
| `Y0(x)` | Orden 0 |
| `Y1(x)` | Orden 1 |
| `Yn(n int, x)` | Orden n |

---

## Signo y manipulación de bits

| Función | Qué hace | Ejemplo |
|---------|----------|---------|
| `Copysign(x, y)` | x con el signo de y | `Copysign(5, -1)` → `-5` |
| `Signbit(x)` | ¿El signo es negativo? | `Signbit(-5)` → `true` |
| `FMA(x, y, z)` | x*y + z con un solo redondeo | `FMA(2, 3, 4)` → `10` |
| `Float32bits(f float32) uint32` | Representación binaria IEEE 754 | |
| `Float64bits(f float64) uint64` | Representación binaria IEEE 754 | |
| `Float32frombits(b uint32) float32` | Decodifica representación IEEE 754 | |
| `Float64frombits(b uint64) float64` | Decodifica representación IEEE 754 | |

```go
bits := math.Float64bits(3.14)
f := math.Float64frombits(bits)
```

---

## Valores especiales y verificación

| Función | Qué hace |
|---------|----------|
| `IsInf(x, sign int) bool` | ¿Es +Inf (sign>0), -Inf (sign<0) o cualquiera (sign=0)? |
| `IsNaN(x) bool` | ¿Es NaN? |
| `Inf(sign int) float64` | Devuelve +Inf (sign>=0) o -Inf (sign<0) |
| `NaN() float64` | Devuelve un NaN |
| `Nextafter(x, y) float64` | Siguiente valor representable de x hacia y |
| `Nextafter32(x, y float32) float32` | Igual para float32 |

---

## Descomposición de flotantes

| Función | Qué hace |
|---------|----------|
| `Frexp(x) (frac float64, exp int)` | Descompone x = frac × 2^exp, con |frac| en [0.5, 1) |
| `Ldexp(frac float64, exp int) float64` | Inversa de Frexp: frac × 2^exp |
| `Sincos(x) (sin, cos float64)` | Calcula Sin(x) y Cos(x) simultáneamente |

---

## Min y Max

Desde Go 1.21, `min` y `max` son built-in (no del paquete `math`):

```go
min(3, 5, 2)  // 2
max(3, 5, 2)  // 5
```

Para compatibilidad con versiones anteriores, `math` también los provee (solo con 2 argumentos, tipo float64):

```go
math.Max(3.5, 5.1)  // 5.1
math.Min(3.5, 5.1)  // 3.5
```

---

## Random: `math/rand`

⚠️ `math/rand` es pseudoaleatorio. Para criptografía usá [crypto/rand](/crypto-rand).

```go
import "math/rand"

rand.Intn(100)       // entero entre 0 y 99
rand.Float64()       // float entre 0.0 y 1.0
rand.Int()           // entero aleatorio
rand.Shuffle(len, func(i, j int) { ... })  // mezclar slice
```

### Semilla

Desde Go 1.20, la semilla se inicializa automáticamente. Ya no necesitás `rand.Seed()`.

---

[← Volver al índice](/indice)
