# hash/fnv — Hash No Criptográfico FNV

> **Import:** `import "hash/fnv"`

El paquete `fnv` implementa la función hash FNV-1 y FNV-1a, hashes no criptográficos
creados por Glenn Fowler, Landon Curt Noll y Phong Vo.

---

## Constructores

| Función | Descripción |
|---------|-------------|
| `New32() hash.Hash32` | Nuevo hash FNV-1 de 32 bits |
| `New32a() hash.Hash32` | Nuevo hash FNV-1a de 32 bits |
| `New64() hash.Hash64` | Nuevo hash FNV-1 de 64 bits |
| `New64a() hash.Hash64` | Nuevo hash FNV-1a de 64 bits |
| `New128() hash.Hash` | Nuevo hash FNV-1 de 128 bits (Go 1.17+) |
| `New128a() hash.Hash` | Nuevo hash FNV-1a de 128 bits (Go 1.17+) |

Todos satisfacen la interfaz `hash.Hash`, que incluye `io.Writer`.

```go
h := fnv.New32()
h.Write([]byte("hello"))
sum := h.Sum32()
fmt.Println(sum) // valor hash de 32 bits
```

---

## Interfaces implementadas

| Interfaz | Métodos |
|----------|---------|
| `hash.Hash` | `Write(p []byte) (n int, err error)`, `Sum(b []byte) []byte`, `Reset()`, `Size() int`, `BlockSize() int` |
| `hash.Hash32` | `Sum32() uint32` |
| `hash.Hash64` | `Sum64() uint64` |

---

## Diferencia entre FNV-1 y FNV-1a

Ambos algoritmos multiplican y aplican XOR, pero en orden distinto:

| Variante | Algoritmo |
|----------|-----------|
| FNV-1 | hash = hash × prime **primero**, luego XOR con byte |
| FNV-1a | XOR con byte **primero**, luego hash = hash × prime |

FNV-1a generalmente tiene mejor dispersión (avalancha) para bytes individuales.

---

## Ejemplo básico

```go
package main

import (
    "fmt"
    "hash/fnv"
)

func main() {
    data := []byte("golang")

    h32 := fnv.New32()
    h32.Write(data)
    fmt.Printf("FNV-1  32: %d\n", h32.Sum32())

    h32a := fnv.New32a()
    h32a.Write(data)
    fmt.Printf("FNV-1a 32: %d\n", h32a.Sum32())

    h64 := fnv.New64()
    h64.Write(data)
    fmt.Printf("FNV-1  64: %d\n", h64.Sum64())

    h64a := fnv.New64a()
    h64a.Write(data)
    fmt.Printf("FNV-1a 64: %d\n", h64a.Sum64())
}
```

---

## Uso con fmt.Fprintf

Como implementa `io.Writer`, puede usarse como destino de `fmt.Fprint`:

```go
h := fnv.New64a()
fmt.Fprint(h, "clave:", 42, "-", true)
fmt.Printf("Hash: %d\n", h.Sum64())
```

---

## Ejemplo: hash de un archivo

```go
package main

import (
    "fmt"
    "hash/fnv"
    "io"
    "os"
)

func main() {
    f, _ := os.Open("archivo.txt")
    defer f.Close()

    h := fnv.New64a()
    io.Copy(h, f)

    fmt.Printf("FNV-1a 64: %d\n", h.Sum64())
}
```

---

## Reinicio del hash

```go
h := fnv.New64a()
h.Write([]byte("primer dato"))
h.Reset() // vuelve al estado inicial
h.Write([]byte("segundo dato"))
fmt.Println(h.Sum64())
```

---

[← Volver al índice](/indice)
