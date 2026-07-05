# hash/maphash — Hash para Mapas

> **Import:** `import "hash/maphash"`

El paquete `maphash` proporciona funciones hash para implementar tablas hash.
**Disponible desde Go 1.14.** Las funciones hash son no criptográficas y
están diseñadas para ser rápidas y tener buena dispersión en tablas hash.
El hash generado por una `Seed` NO es portable entre procesos.

---

## Tipos principales

| Tipo | Descripción |
|------|-------------|
| `Hash` | Estado de hash. Valor cero utilizable |
| `Seed` | Semilla que determina la función hash. Diferente entre procesos |

---

## Seed

| Función | Descripción |
|---------|-------------|
| `MakeSeed() Seed` | Genera una nueva semilla aleatoria |
| `Seed.String() string` | Representación legible de la semilla |

```go
seed1 := maphash.MakeSeed()
seed2 := maphash.MakeSeed()
// seed1 != seed2 siempre (son aleatorias)
```

---

## Hash — Métodos

| Método | Descripción |
|--------|-------------|
| `SetSeed(seed Seed)` | Establece la semilla a usar |
| `WriteByte(b byte) error` | Agrega un byte al hash |
| `WriteString(s string) (int, error)` | Agrega un string al hash |
| `Write(p []byte) (int, error)` | Agrega un slice de bytes (implementa io.Writer) |
| `Sum64() uint64` | Retorna el valor hash actual de 64 bits |
| `Sum(b []byte) []byte` | Agrega el hash a b (implementa hash.Hash) |
| `Reset()` | Reinicia el hash al estado inicial (sin cambiar semilla) |
| `BlockSize() int` | Retorna el block size (siempre 64) |
| `Size() int` | Retorna el tamaño del hash (siempre 8) |

```go
var h maphash.Hash
h.SetSeed(maphash.MakeSeed())
h.WriteString("clave")
h.WriteByte(':')
h.WriteString("valor")
fmt.Println(h.Sum64())
```

---

## Semilla fija (para hashing determinista)

Si se usa una misma `Seed` (obtenida con `MakeSeed()` y guardada), los hashes serán consistentes dentro del mismo proceso.

```go
type MiTabla struct {
    seed  maphash.Seed
    hash  maphash.Hash
}

func NuevaTabla() *MiTabla {
    return &MiTabla{seed: maphash.MakeSeed()}
}

func (t *MiTabla) Hash(s string) uint64 {
    t.hash.SetSeed(t.seed)
    t.hash.Reset()
    t.hash.WriteString(s)
    return t.hash.Sum64()
}
```

---

## Ejemplo completo: tabla hash simple

```go
package main

import (
    "fmt"
    "hash/maphash"
)

func main() {
    seed := maphash.MakeSeed()

    tipoHash := "persona"
    clave1 := "juan"
    valor1 := 42

    var h maphash.Hash

    // Hash compuesto: tipo + clave → bucket
    h.SetSeed(seed)
    h.WriteString(tipoHash)
    h.WriteByte(':')
    h.WriteString(clave1)
    bucket1 := h.Sum64()

    fmt.Printf("Bucket para %s:%s = %d\n", tipoHash, clave1, bucket1%8)

    // Hash del valor para comparación en el bucket
    h.Reset()
    h.SetSeed(seed)
    h.WriteString(clave1)
    h.WriteByte('=')
    fmt.Fprint(&h, valor1)
    hashValor := h.Sum64()

    fmt.Printf("Hash del valor = %d\n", hashValor)
}
```

---

## Notas importantes

- Los hashes de una misma `Seed` son consistentes **dentro del mismo proceso**, pero varían entre ejecuciones.
- No usar para hashing criptográfico. Usar `crypto/sha256` o `crypto/sha512` para eso.
- El hash es de 64 bits y está diseñado para minimizar colisiones en tablas hash.
- La semilla de proceso (`MakeSeed()`) es diferente en cada ejecución del programa; esto evita ataques de colisión de hash (hash flooding).

---

[← Volver al índice](/indice)
