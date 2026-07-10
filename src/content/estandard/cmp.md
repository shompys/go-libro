# cmp — Comparación de tipos ordenados (Go 1.21+)

Define el constraint `Ordered` y funciones básicas de comparación para tipos que soportan operadores de orden (`<`, `>`, etc.). Es la base sobre la que funcionan `slices.Sort`, `maps.Equal` y otros paquetes genéricos.

```go
import "cmp"
```

---

## Índice

- [Ordered (constraint)](/estandard/cmp#ordered-constraint)
- [Compare](/estandard/cmp#compare)
- [Less](/estandard/cmp#less)
- [Or (Go 1.22+)](/estandard/cmp#or-go-122)

---

## Ordered (constraint)

Tipo constraint que agrupa todos los tipos que soportan comparación con `<`, `<=`, `>`, `>=`:

```go
type Ordered interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64 |
    ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~uintptr |
    ~float32 | ~float64 |
    ~string
}
```

Se usa como constraint en funciones genéricas:

```go
func Minimo[T cmp.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}
```

---

## Compare

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Compare` | `Compare[T Ordered](x, y T) int` | Compara dos valores y devuelve `-1`, `0` o `+1` |

```go
cmp.Compare(1, 2)       // -1
cmp.Compare(5, 5)       // 0
cmp.Compare(9, 3)       // 1

cmp.Compare("a", "b")   // -1
cmp.Compare("z", "a")   // 1
```

Es la función que se usa como comparador en `slices.SortFunc`:

```go
slices.SortFunc(personas, func(a, b Persona) int {
    return cmp.Compare(a.Edad, b.Edad)
})
```

> **Importante:** Para strings, `Compare` usa orden lexicográfico (basado en valores Unicode). Las mayúsculas van antes que las minúsculas.

---

## Less

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Less` | `Less[T Ordered](x, y T) bool` | `true` si `x < y` |

```go
cmp.Less(1, 2)       // true
cmp.Less(5, 3)       // false
cmp.Less("a", "b")   // true
```

Útil como función `less` en contextos que la necesiten:

```go
if cmp.Less(a.Edad, b.Edad) {
    // a es menor que b
}
```

---

## Or (Go 1.22+)

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Or` | `Or[T comparable](vals ...T) T` | Devuelve el primer valor que no es el zero value |

```go
cmp.Or("hola", "")     // "hola"
cmp.Or("", "mundo")    // "mundo"
cmp.Or(0, 42)          // 42
cmp.Or("", "", "go")   // "go"
```

Ideal para valores por defecto:

```go
nombre := cmp.Or(user.Nombre, "Anónimo")
puerto := cmp.Or(config.Puerto, 8080)
```

> **Atención:** El zero value depende del tipo: `""` para strings, `0` para números, `nil` para punteros, etc.

---

[← Volver al índice](/indice)
