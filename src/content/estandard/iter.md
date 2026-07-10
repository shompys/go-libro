# iter — Iteradores (Go 1.23+)

Define los tipos `Seq` y `Seq2` que representan iteradores en Go. Son la base de los rangos sobre funciones (`for range`) introducidos en Go 1.23, y los usan paquetes como `slices`, `maps` y `maps`.

```go
import "iter"
```

---

## Índice

- [Seq y Seq2 (tipos)](/estandard/iter#seq-y-seq2-tipos)
- [Pull](/estandard/iter#pull)
- [Pull2](/estandard/iter#pull2)

---

## Seq y Seq2 (tipos)

| Tipo | Definición | Descripción |
|------|-----------|-------------|
| `Seq[V]` | `type Seq[V any] func(yield func(V) bool)` | Iterador de un solo valor |
| `Seq2[K, V]` | `type Seq2[K, V any] func(yield func(K, V) bool)` | Iterador de pares clave/valor |

Un iterador es una función que llama a `yield` por cada elemento. Si `yield` devuelve `false`, la iteración se detiene.

```go
// Crear un iterador simple
func numeros(n int) iter.Seq[int] {
    return func(yield func(int) bool) {
        for i := 0; i < n; i++ {
            if !yield(i) {
                return
            }
        }
    }
}

for v := range numeros(5) {
    fmt.Println(v) // 0, 1, 2, 3, 4
}
```

```go
// Iterador de pares
func pares[K comparable, V any](m map[K]V) iter.Seq2[K, V] {
    return func(yield func(K, V) bool) {
        for k, v := range m {
            if !yield(k, v) {
                return
            }
        }
    }
}

for k, v := range pares(miMapa) {
    fmt.Println(k, v)
}
```

---

## Pull

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Pull` | `Pull[V any](seq Seq[V]) (next func() (V, bool), stop func())` | Convierte un `Seq` en un iterador pull (llamada manual) |

```go
seq := func(yield func(int) bool) {
    for i := 1; i <= 3; i++ {
        if !yield(i) { return }
    }
}

next, stop := iter.Pull(seq)
defer stop()

for {
    v, ok := next()
    if !ok { break }
    fmt.Println(v)
}
// 1, 2, 3
```

> **Importante:** Siempre llamá `stop()` cuando termines para liberar recursos.

---

## Pull2

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Pull2` | `Pull2[K, V any](seq Seq2[K, V]) (next func() (K, V, bool), stop func())` | Convierte un `Seq2` en un iterador pull de pares |

```go
next, stop := iter.Pull2(maps.All(miMapa))
defer stop()

for {
    k, v, ok := next()
    if !ok { break }
    fmt.Println(k, v)
}
```

---

[← Volver al índice](/indice)
