# math/rand — Números pseudoaleatorios

Genera números aleatorios (no criptográficos). Para seguridad usá [crypto/rand](/crypto-rand).

```go
import "math/rand"
```

Desde Go 1.20, la semilla se inicializa automáticamente. Ya no necesitás `rand.Seed()`.

---

## Entero aleatorio

```go
n := rand.Intn(100)      // 0 a 99
n := rand.Intn(100) + 1  // 1 a 100
```

## Float aleatorio

```go
f := rand.Float64()      // 0.0 a 1.0
f := rand.Float64() * 10 // 0.0 a 10.0
```

---

## Generar con rango personalizado

```go
// Entero entre min y max (inclusive):
func entre(min, max int) int {
    return rand.Intn(max-min+1) + min
}

n := entre(10, 50)  // número entre 10 y 50
```

---

## Selección aleatoria

```go
frutas := []string{"manzana", "pera", "uva", "naranja"}
elegida := frutas[rand.Intn(len(frutas))]
```

## Mezclar slice

```go
nums := []int{1, 2, 3, 4, 5}
rand.Shuffle(len(nums), func(i, j int) {
    nums[i], nums[j] = nums[j], nums[i]
})
// [3, 1, 5, 2, 4] (ejemplo)
```

---

## Nueva fuente aleatoria (para tests determinísticos)

```go
// Rand con semilla fija (útiles en tests):
rng := rand.New(rand.NewSource(42))
rng.Intn(100)  // siempre el mismo resultado con seed 42
```

---

## Todas las funciones de generación

| Función | Qué genera | Rango |
|---------|-----------|-------|
| `rand.Int()` | Entero no negativo | |
| `rand.Intn(n)` | Entero | [0, n) |
| `rand.Int31()` | int31 | |
| `rand.Int31n(n)` | int31 | [0, n) |
| `rand.Int63()` | int63 | |
| `rand.Int63n(n)` | int63 | [0, n) |
| `rand.Uint32()` | uint32 | |
| `rand.Uint64()` | uint64 | |
| `rand.Float32()` | float32 | [0.0, 1.0) |
| `rand.Float64()` | float64 | [0.0, 1.0) |
| `rand.NormFloat64()` | float64 distribución normal | media=0, stddev=1 |
| `rand.ExpFloat64()` | float64 distribución exponencial | media=1 |

## Permutaciones y mezcla

```go
// rand.Perm devuelve una permutación de [0, n):
nums := rand.Perm(5) // ej: [3, 0, 1, 4, 2]

// rand.Shuffle mezcla un slice existente:
cartas := []string{"A", "B", "C", "D"}
rand.Shuffle(len(cartas), func(i, j int) {
    cartas[i], cartas[j] = cartas[j], cartas[i]
})
```

## Distribución Zipf

Para generar valores según la ley de Zipf (modela frecuencias de palabras, popularidad, etc.):

```go
// NewZipf(rng, s, v, imax)
// s > 1, v >= 1
zipf := rand.NewZipf(rng, 1.1, 2.0, 100)
valor := zipf.Uint64() // número con distribución Zipf
```

| Función | Qué hace |
|---------|----------|
| `rand.NewZipf(rng *Rand, s float64, v float64, imax uint64) *Zipf` | Crea generador Zipf |
| `z.Uint64() uint64` | Genera siguiente valor |

## Lectura de bytes aleatorios

```go
buf := make([]byte, 16)
rand.Read(buf) // ⚠️ deprecado en Go 1.24, usar crypto/rand.Read
```

## Nuevas fuentes: PCG y ChaCha8 (Go 1.22+)

En Go 1.22 se introdujeron dos fuentes de aleatoriedad modernas que reemplazan al antiguo generador:

```go
// PCG (recomendado para la mayoría de casos):
rng := rand.NewPCG(42, 0) // seed1, seed2
r := rand.New(rng)
r.Intn(100)

// ChaCha8 (mayor calidad criptográfica, pero no criptográficamente seguro):
rng := rand.NewChaCha8([32]byte{}) // semilla de 32 bytes
r := rand.New(rng)
r.Intn(100)
```

| Tipo / Función | Descripción |
|----------------|-------------|
| `rand.PCG` | Generador PCG (permuted congruential generator) |
| `rand.NewPCG(seed1, seed2 uint64) *PCG` | Crea un generador PCG |
| `rand.ChaCha8` | Generador ChaCha8 |
| `rand.NewChaCha8(seed [32]byte) *ChaCha8` | Crea un generador ChaCha8 |

`PCG` y `ChaCha8` implementan `rand.Source`, por lo que se usan con `rand.New()`.

---

[← Volver al índice](/indice)
