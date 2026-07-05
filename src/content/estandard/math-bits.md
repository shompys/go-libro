# math/bits — Manipulación de Bits

> **Import:** `import "math/bits"`

El paquete `math/bits` implementa funciones para manipular bits en enteros sin signo.
Todas las funciones son eficientes y traducen a instrucciones nativas cuando el hardware lo permite.

---

## Longitud y conteo

| Función | Descripción |
|---------|-------------|
| `Len(x uint) int` | Número de bits mínimo para representar x (0 → 0) |
| `Len8(x uint8) int` | Versión para uint8 |
| `Len16(x uint16) int` | Versión para uint16 |
| `Len32(x uint32) int` | Versión para uint32 |
| `Len64(x uint64) int` | Versión para uint64 |

| Función | Descripción |
|---------|-------------|
| `LeadingZeros(x uint) int` | Cantidad de ceros a la izquierda |
| `LeadingZeros8(x uint8) int` | Versión para uint8 |
| `LeadingZeros16(x uint16) int` | Versión para uint16 |
| `LeadingZeros32(x uint32) int` | Versión para uint32 |
| `LeadingZeros64(x uint64) int` | Versión para uint64 |

| Función | Descripción |
|---------|-------------|
| `TrailingZeros(x uint) int` | Cantidad de ceros a la derecha |
| `TrailingZeros8(x uint8) int` | Versión para uint8 |
| `TrailingZeros16(x uint16) int` | Versión para uint16 |
| `TrailingZeros32(x uint32) int` | Versión para uint32 |
| `TrailingZeros64(x uint64) int` | Versión para uint64 |

| Función | Descripción |
|---------|-------------|
| `OnesCount(x uint) int` | Cantidad de bits en 1 |
| `OnesCount8(x uint8) int` | Versión para uint8 |
| `OnesCount16(x uint16) int` | Versión para uint16 |
| `OnesCount32(x uint32) int` | Versión para uint32 |
| `OnesCount64(x uint64) int` | Versión para uint64 |

```go
fmt.Println(bits.Len(14))          // 4 (1110 en binario)
fmt.Println(bits.LeadingZeros(14)) // 60 (en uint de 64 bits)
fmt.Println(bits.TrailingZeros(24)) // 3 (24 = 11000₂)
fmt.Println(bits.OnesCount(14))     // 3 (1110 tiene tres 1)
```

---

## Rotación y reversión

| Función | Descripción |
|---------|-------------|
| `RotateLeft(x uint, k int) uint` | Rota x a la izquierda k posiciones |
| `RotateLeft8(x uint8, k int) uint8` | Para uint8 |
| `RotateLeft16(x uint16, k int) uint16` | Para uint16 |
| `RotateLeft32(x uint32, k int) uint32` | Para uint32 |
| `RotateLeft64(x uint64, k int) uint64` | Para uint64 |

| Función | Descripción |
|---------|-------------|
| `Reverse(x uint) uint` | Invierte el orden de los bits |
| `Reverse8(x uint8) uint8` | Para uint8 |
| `Reverse16(x uint16) uint16` | Para uint16 |
| `Reverse32(x uint32) uint32` | Para uint32 |
| `Reverse64(x uint64) uint64` | Para uint64 |
| `ReverseBytes(x uint) uint` | Invierte orden de bytes |
| `ReverseBytes16(x uint16) uint16` | Para uint16 |
| `ReverseBytes32(x uint32) uint32` | Para uint32 |
| `ReverseBytes64(x uint64) uint64` | Para uint64 |

```go
var x uint8 = 0b00001111 // 15
fmt.Printf("%08b\n", bits.RotateLeft8(x, 2)) // 00111100 = 60
fmt.Printf("%08b\n", bits.Reverse8(x))       // 11110000 = 240
```

---

## Aritmética con acarreo

| Función | Descripción |
|---------|-------------|
| `Add(x, y, carry uint) (sum, carryOut uint)` | Suma con acarreo: x + y + carry |
| `Add32(x, y, carry uint32) (uint32, uint32)` | uint32 |
| `Add64(x, y, carry uint64) (uint64, uint64)` | uint64 |
| `Sub(x, y, borrow uint) (diff, borrowOut uint)` | Resta con préstamo: x − y − borrow |
| `Sub32(x, y, borrow uint32) (uint32, uint32)` | uint32 |
| `Sub64(x, y, borrow uint64) (uint64, uint64)` | uint64 |
| `Mul(x, y uint) (hi, lo uint)` | Multiplicación completa x × y |
| `Mul32(x, y uint32) (uint32, uint32)` | uint32 |
| `Mul64(x, y uint64) (uint64, uint64)` | uint64 |
| `Div(hi, lo, y uint) (quo, rem uint)` | División (hi<<bits.Len(lo) + lo) / y |
| `Div32(hi, lo, y uint32) (uint32, uint32)` | uint32 |
| `Div64(hi, lo, y uint64) (uint64, uint64)` | uint64 |
| `Rem(hi, lo, y uint) uint` | Resto de Div |
| `Rem32(hi, lo, y uint32) uint32` | Resto de Div32 |
| `Rem64(hi, lo, y uint64) uint64` | Resto de Div64 |

```go
s, c := bits.Add(1, 2, 0) // s = 3, c = 0
hi, lo := bits.Mul(1<<32, 1<<32) // hi = 1, lo = 0 (2^64)
```

---

[← Volver al índice](/indice)
