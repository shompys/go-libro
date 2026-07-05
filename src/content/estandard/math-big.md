# math/big — Aritmética de Precisión Arbitraria

> **Import:** `import "math/big"`

El paquete `math/big` implementa aritmética de precisión arbitraria (números grandes).
Proporciona tres tipos: `Int` (enteros), `Float` (punto flotante) y `Rat` (racionales).
No tiene límite de tamaño salvo la memoria disponible.

---

## Int

Representa un entero con signo de precisión arbitraria.

### Creación

| Función | Descripción |
|---------|-------------|
| `NewInt(x int64) *Int` | Crea un `*Int` desde un `int64` |
| `new(Int).SetString(s string, base int) (*Int, bool)` | Parsea desde string en base 0, 2–36 |

```go
x := big.NewInt(42)
y := new(big.Int)
y.SetString("deadbeef", 16) // y = 3735928559
```

### Operaciones aritméticas

| Método | Firma | Descripción |
|--------|-------|-------------|
| Add | `func (z *Int) Add(x, y *Int) *Int` | z = x + y |
| Sub | `func (z *Int) Sub(x, y *Int) *Int` | z = x − y |
| Mul | `func (z *Int) Mul(x, y *Int) *Int` | z = x × y |
| Div | `func (z *Int) Div(x, y *Int) *Int` | z = x / y (división entera truncada) |
| Mod | `func (z *Int) Mod(x, y *Int) *Int` | z = x % y |
| DivMod | `func (z *Int) DivMod(x, y, m *Int) (*Int, *Int)` | z = x / y, m = x % y |
| GCD | `func (z *Int) GCD(x, y, a, b *Int) *Int` | z = gcd(a, b), y resto: z = x·a + y·b |
| Exp | `func (z *Int) Exp(x, y, m *Int) *Int` | z = x^y mod m |
| Neg | `func (z *Int) Neg(x *Int) *Int` | z = −x |
| Abs | `func (z *Int) Abs(x *Int) *Int` | z = |x| |
| Quo | `func (z *Int) Quo(x, y *Int) *Int` | Cociente truncado hacia cero |
| Rem | `func (z *Int) Rem(x, y *Int) *Int` | Resto con signo del dividendo |
| QuoRem | `func (z *Int) QuoRem(x, y, r *Int) (*Int, *Int)` | Cociente y resto juntos: z = x/y, r = x%y |
| Sqrt | `func (z *Int) Sqrt(x *Int) *Int` | Raíz cuadrada entera (redondeada hacia abajo) |
| MulRange | `func (z *Int) MulRange(a, b int64) *Int` | Producto a × (a+1) × ... × b |
| Binomial | `func (z *Int) Binomial(n, k int64) *Int` | Coeficiente binomial C(n, k) = n!/(k!(n-k)!) |
| CmpAbs | `func (x *Int) CmpAbs(y *Int) int` | Compara valores absolutos (−1, 0, +1) |

```go
a := big.NewInt(100)
b := big.NewInt(7)
q := new(big.Int).Div(a, b) // 14
r := new(big.Int).Mod(a, b) // 2
```

### Predicados y bits

| Método | Descripción |
|--------|-------------|
| `Cmp(y *Int) int` | −1 si <, 0 si =, +1 si > |
| `Sign() int` | −1 negativo, 0 cero, +1 positivo |
| `ProbablyPrime(n int) bool` | Test de Miller-Rabin (n iteraciones) |
| `Bit(i int) uint` | Valor del i-ésimo bit |
| `BitLen() int` | Longitud en bits del valor absoluto |
| `Bytes() []byte` | Representación big-endian |
| `SetBytes(buf []byte) *Int` | Carga desde slice big-endian |
| `Text(base int) string` | Representación como string en base dada |
| `Int64() int64` | Valor como int64 (trunca si no cabe) |
| `Uint64() uint64` | Valor como uint64 |
| `IsInt64() bool` | ¿Cabe en int64? |
| `IsUint64() bool` | ¿Cabe en uint64? |
| `FillBytes(buf []byte) []byte` | Llena un slice con la representación big-endian |
| `TrailingZeroBits() uint` | Cantidad de bits 0 consecutivos menos significativos |

### Operaciones a nivel de bits

| Método | Descripción |
|--------|-------------|
| `And(z, x, y *Int) *Int` | z = x AND y |
| `Or(z, x, y *Int) *Int` | z = x OR y |
| `Xor(z, x, y *Int) *Int` | z = x XOR y |
| `AndNot(z, x, y *Int) *Int` | z = x AND NOT y |
| `Not(z, x *Int) *Int` | z = NOT x |
| `Lsh(z, x *Int, n uint) *Int` | z = x << n |
| `Rsh(z, x *Int, n uint) *Int` | z = x >> n |
| `SetBit(z *Int, i int, b uint) *Int` | Asigna el i-ésimo bit a b (0 o 1) |
| `SetUint64(z *Int, x uint64) *Int` | Asigna z desde un uint64 |

```go
a := big.NewInt(0b1100) // 12
b := big.NewInt(0b1010) // 10
and := new(big.Int).And(a, b) // 8 (1000)
or  := new(big.Int).Or(a, b)  // 14 (1110)
xor := new(big.Int).Xor(a, b) // 6 (0110)
lsh := new(big.Int).Lsh(a, 2) // 48 (110000)
```

```go
p := big.NewInt(170141183460469231731687303715884105727)
fmt.Println(p.ProbablyPrime(20)) // true (es primo de Mersenne)
```

---

## Float

Representa un número de punto flotante de precisión arbitraria.

### Creación y configuración

| Función / Método | Descripción |
|------------------|-------------|
| `NewFloat(x float64) *Float` | Desde un float64 |
| `SetPrec(prec uint) *Float` | Define precisión en bits |
| `SetMode(mode RoundingMode) *Float` | Define modo de redondeo |
| `SetString(s string) (*Float, bool)` | Parsea desde string |
| `SetFloat64(x float64) *Float` | Desde float64 |
| `SetInt64(x int64) *Float` | Desde int64 |
| `SetInt(x *Int) *Float` | Desde `*big.Int` |

**Modos de redondeo:**
- `ToNearestEven` — por defecto (round to nearest, ties to even)
- `ToNearestAway` — round half away from zero
- `ToZero` — truncar
- `AwayFromZero` — alejar de cero
- `ToNegativeInf` — hacia −∞
- `ToPositiveInf` — hacia +∞

```go
f := new(big.Float)
f.SetPrec(100)
f.SetMode(big.ToNearestEven)
f.SetString("3.141592653589793238462643383279")
```

### Operaciones

| Método | Descripción |
|--------|-------------|
| `Add(x, y *Float) *Float` | z = x + y |
| `Sub(x, y *Float) *Float` | z = x − y |
| `Mul(x, y *Float) *Float` | z = x × y |
| `Quo(x, y *Float) *Float` | z = x / y |
| `Abs(x *Float) *Float` | z = |x| |
| `Neg(x *Float) *Float` | z = −x |
| `Sqrt(x *Float) *Float` | z = √x |
| `Copy(x *Float) *Float` | Copia x en z |

### Consulta y conversión

| Método | Descripción |
|--------|-------------|
| `Cmp(y *Float) int` | Comparación |
| `Sign() int` | Signo |
| `Float64() (float64, Accuracy)` | Conversión con pérdida |
| `Int(z *Int) (*Int, Accuracy)` | Convierte a entero (redondea) |
| `Int64() (int64, Accuracy)` | Convierte a int64 |
| `Uint64() (uint64, Accuracy)` | Convierte a uint64 |
| `SetInt64(x int64) *Float` | Asigna desde int64 |
| `SetUint64(x uint64) *Float` | Asigna desde uint64 |
| `String() string` | Representación `'p'±exp` |
| `Text(format byte, prec int) string` | Formato personalizado |
| `MantExp(mant *Float) (exp int)` | Descompone en mantisa y exponente |
| `SetMantExp(mant *Float, exp int) *Float` | Compone desde mantisa y exponente |
| `Prec() uint` | Precisión actual en bits |
| `MinPrec() uint` | Precisión mínima necesaria sin pérdida |
| `Mode() RoundingMode` | Modo de redondeo actual |
| `Acc() Accuracy` | Precisión del último resultado |
| `IsInf() bool` | ¿Es infinito? |
| `IsInt() bool` | ¿Es un entero exacto? |

---

## Rat

Representa un número racional a/b con precisión arbitraria.

### Creación

| Función | Descripción |
|---------|-------------|
| `NewRat(a, b int64) *Rat` | Crea el racional a/b |
| `SetFloat64(f float64) *Rat` | Desde float64 (aproximación) |
| `SetFrac(a, b *Int) *Rat` | Desde dos `*Int` numerador/denominador |
| `SetString(s string) (*Rat, bool)` | Parsea forma "a/b" o flotante |
| `SetInt(x *Int) *Rat` | Desde entero |

```go
r := big.NewRat(1, 3) // 1/3
```

### Operaciones

| Método | Descripción |
|--------|-------------|
| `Add(x, y *Rat) *Rat` | z = x + y |
| `Sub(x, y *Rat) *Rat` | z = x − y |
| `Mul(x, y *Rat) *Rat` | z = x × y |
| `Quo(x, y *Rat) *Rat` | z = x / y |
| `Abs(x *Rat) *Rat` | z = |x| |
| `Neg(x *Rat) *Rat` | z = −x |
| `Inv(x *Rat) *Rat` | z = 1/x |

### Consulta

| Método | Descripción |
|--------|-------------|
| `Cmp(y *Rat) int` | Comparación |
| `Sign() int` | Signo |
| `Float64() (f float64, exact bool)` | Conversión a float64 |
| `Num() *Int` | Numerador |
| `Denom() *Int` | Denominador |
| `RatString() string` | Representación como "a/b" |

```go
a := big.NewRat(1, 6)
b := big.NewRat(1, 3)
sum := new(big.Rat).Add(a, b) // 1/2
```

---

## Ejemplo completo

```go
package main

import (
    "fmt"
    "math/big"
)

func main() {
    // Int: factorial
    n := new(big.Int)
    n.SetInt64(100)
    fact := new(big.Int)
    fact.MulRange(1, n.Int64())
    fmt.Println(fact)

    // Float: alta precisión
    pi := new(big.Float)
    pi.SetPrec(256)
    pi.SetString("3.14159265358979323846264338327950288419716939937510")
    fmt.Println(pi.Text('g', 50))

    // Rat: fracciones exactas
    r1 := big.NewRat(2, 3)
    r2 := big.NewRat(5, 7)
    product := new(big.Rat).Mul(r1, r2)
    fmt.Println(product.RatString()) // "10/21"
}
```

---

[← Volver al índice](/indice)
