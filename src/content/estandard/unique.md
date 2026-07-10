# unique — Valores canónicos (Go 1.23+)

Permite crear valores únicos (canónicos) para un tipo dado. Dos valores iguales producen el mismo `Handle`, lo que permite comparaciones rápidas por identidad en lugar de por valor.

```go
import "unique"
```

---

## Índice

- [Make](/estandard/iter#make)
- [Handle](/estandard/iter#handle)

---

## Make

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Make` | `Make[T comparable](value T) Handle[T]` | Crea (o reutiliza) un handle canónico para `value` |

```go
h1 := unique.Make("hola")
h2 := unique.Make("hola")
h3 := unique.Make("mundo")

h1 == h2 // true (mismo valor)
h1 == h3 // false (distinto valor)
```

---

## Handle

| Tipo | Definición | Descripción |
|------|-----------|-------------|
| `Handle[T]` | `type Handle[T comparable] struct{}` | Referencia opaca a un valor canónico |

```go
type Handle[T comparable] struct{}
```

Métodos:

| Método | Firma | Descripción |
|--------|-------|-------------|
| `Value` | `Value() T` | Devuelve el valor original |

```go
h := unique.Make("Go")
fmt.Println(h.Value()) // "Go"
```

Útil para optimizar comparaciones en estructuras grandes o como clave de map:

```go
type Config struct {
    Host string
    Port int
    // ... muchos campos
}

// En lugar de comparar Configs completos, comparás handles
h1 := unique.Make(config1)
h2 := unique.Make(config2)
if h1 == h2 {
    // son iguales (comparación O(1))
}
```

> **Precaución:** Los handles mantienen referencias a los valores. No se liberan hasta que no queden handles vivos (el GC los limpia).

---

[← Volver al índice](/indice)
