# math/rand/v2 — Números pseudoaleatorios moderno (Go 1.22+)

Reemplazo moderno de `math/rand` con mejor API, fuentes más rápidas y sin necesidad de seed manual. No es compatible con `math/rand` (distintas firmas).

```go
import "math/rand/v2"
```

---

## Índice

- [Enteros aleatorios](/estandard/math-rand-v2#enteros-aleatorios)
- [Floats aleatorios](/estandard/math-rand-v2#floats-aleatorios)
- [Booleanos](/estandard/math-rand-v2#booleanos)
- [Shuffle y Perm](/estandard/math-rand-v2#shuffle-y-perm)
- [Distribuciones (NormFloat64, ExpFloat64)](/estandard/math-rand-v2#distribuciones)
- [Fuentes personalizadas (ChaCha8, PCG)](/estandard/math-rand-v2#fuentes-personalizadas)
- [Diferencias con math/rand](/estandard/math-rand-v2#diferencias-con-mathrand)

---

## Enteros aleatorios

| Función | Firma | Descripción |
|---------|-------|-------------|
| `IntN` | `IntN(n int) int` | Entero en `[0, n)` |
| `Int32N` | `Int32N(n int32) int32` | `int32` en `[0, n)` |
| `Int64N` | `Int64N(n int64) int64` | `int64` en `[0, n)` |
| `Uint32` | `Uint32() uint32` | `uint32` aleatorio |
| `Uint64` | `Uint64() uint64` | `uint64` aleatorio |
| `Uint32N` | `Uint32N(n uint32) uint32` | `uint32` en `[0, n)` |
| `Uint64N` | `Uint64N(n uint64) uint64` | `uint64` en `[0, n)` |
| `Int` | `Int() int` | Entero no negativo |

```go
rand.IntN(100)       // [0, 100)
rand.Int64N(1000)    // [0, 1000) como int64
rand.Uint32()        // uint32 aleatorio
```

> **Importante:** `IntN(0)` produce **panic**. Siempre verificá que `n > 0`.

---

## Floats aleatorios

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Float32` | `Float32() float32` | `float32` en `[0.0, 1.0)` |
| `Float64` | `Float64() float64` | `float64` en `[0.0, 1.0)` |

```go
rand.Float64()              // 0.7342...
rand.Float32() * 100        // [0.0, 100.0)
```

---

## Booleanos

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Bool` | `Bool() bool` | `true` o `false` aleatorio |

```go
if rand.Bool() {
    fmt.Println("cara")
} else {
    fmt.Println("cruz")
}
```

---

## Shuffle y Perm

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Shuffle` | `Shuffle(n int, swap func(i, j int))` | Mezcla `n` elementos usando `swap` |
| `Perm` | `Perm(n int) []int` | Permutación de `[0, n)` |

```go
nums := []int{1, 2, 3, 4, 5}
rand.Shuffle(len(nums), func(i, j int) {
    nums[i], nums[j] = nums[j], nums[i]
})
// nums mezclado

perm := rand.Perm(5)
// [3 0 4 1 2] (permutación aleatoria de 0..4)
```

---

## Distribuciones

| Función | Firma | Descripción |
|---------|-------|-------------|
| `NormFloat64` | `NormFloat64() float64` | Distribución normal estándar (media=0, σ=1) |
| `ExpFloat64` | `ExpFloat64() float64` | Distribución exponencial (λ=1) |

```go
// Normal con media 50 y desvío 10
valor := rand.NormFloat64()*10 + 50
```

---

## Fuentes personalizadas

| Tipo | Descripción |
|------|-------------|
| `ChaCha8` | Fuente basada en ChaCha8 (criptográficamente segura, rápida) |
| `PCG` | Fuente PCG (rápida, no criptográfica) |

```go
// Fuente con seed explícito
src := rand.NewChaCha8([32]byte{1, 2, 3})
r := rand.New(src)

r.IntN(100)
r.Float64()
```

```go
// PCG
src := rand.NewPCG(1, 2)
r := rand.New(src)
```

---

## Diferencias con math/rand

| `math/rand` | `math/rand/v2` |
|-------------|----------------|
| Requiere `rand.Seed()` | No necesita seed (auto-seeded) |
| `Intn(n)` | `IntN(n)` (convención Go) |
| `Int31n`, `Int63n` | `Int32N`, `Int64N` |
| Fuente default: LFSR | Fuente default: ChaCha8 |
| No thread-safe por fuente | Thread-safe en funciones globales |

> **Precaución:** `math/rand/v2` **no es drop-in replacement** de `math/rand`. Las firmas son distintas.

---

[← Volver al índice](/indice)
