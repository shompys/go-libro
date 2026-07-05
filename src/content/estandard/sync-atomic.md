# sync/atomic — Operaciones atómicas

Operaciones thread-safe sin usar mutex. Para contadores, flags y swaps simples.

```go
import "sync/atomic"
```

Más rápido que un `sync.Mutex` para operaciones simples porque se ejecuta a nivel hardware.

---

## Contadores atómicos

```go
var contador int64

atomic.AddInt64(&contador, 1)   // incrementar
atomic.AddInt64(&contador, -1)  // decrementar
val := atomic.LoadInt64(&contador)  // leer
```

| Función | Qué hace |
|---------|----------|
| `AddInt64(addr, delta)` | Suma `delta` al valor en `addr` |
| `LoadInt64(addr)` | Lee el valor atómicamente |
| `StoreInt64(addr, val)` | Guarda el valor atómicamente |
| `SwapInt64(addr, new)` | Guarda `new` y devuelve el anterior |

---

## Tipos disponibles

Desde Go 1.19, existe el tipo `atomic.Int64` (más limpio):

```go
var contador atomic.Int64

contador.Add(1)
val := contador.Load()
contador.Store(0)
anterior := contador.Swap(5)
```

| Tipo | Contiene |
|------|----------|
| `atomic.Int32` | `int32` |
| `atomic.Int64` | `int64` |
| `atomic.Uint32` | `uint32` |
| `atomic.Uint64` | `uint64` |
| `atomic.Uintptr` | `uintptr` |
| `atomic.Bool` | `bool` |
| `atomic.Pointer[T]` | Puntero a `T` (Genérico, Go 1.19+) |

---

## CompareAndSwap (CAS)

"Solo actualizá si el valor actual es X":

```go
var estado atomic.Int64

// Si el estado es 0, pasalo a 1 (lock optimista)
if estado.CompareAndSwap(0, 1) {
    defer estado.Store(0) // unlock
    // sección crítica
}
```

| Función | Qué hace |
|---------|----------|
| `CompareAndSwap(old, new)` | Solo guarda `new` si el valor actual es `old`. Devuelve `true` si lo cambió |

---

## Ejemplo: flag atómico

```go
var procesando atomic.Bool

func procesar() {
    if !procesando.CompareAndSwap(false, true) {
        return // ya está procesando
    }
    defer procesando.Store(false)
    // ... hacer trabajo ...
}
```

---

[← Volver al índice](/indice)
