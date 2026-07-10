# maps — Funciones genéricas para maps (Go 1.21+)

Operaciones comunes sobre maps usando genéricos. Simplifica tareas como clonar, copiar, comparar y filtrar mapas sin escribir código repetitivo.

```go
import "maps"
```

---

## Índice

- [Clonar (Clone)](/estandard/maps#clonar-clone)
- [Copiar (Copy)](/estandard/maps#copiar-copy)
- [Comparar (Equal, EqualFunc)](/estandard/maps#comparar-equal-equalfunc)
- [Eliminar con función (DeleteFunc)](/estandard/maps#eliminar-con-función-deletefunc)
- [Iteradores (All, Keys, Values)](/estandard/maps#iteradores-all-keys-values)
- [Recolectar (Collect)](/estandard/maps#recolectar-collect)
- [Insertar (Insert)](/estandard/maps#insertar-insert)

---

## Clonar (Clone)

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Clone` | `Clone[M ~map[K]V, K comparable, V any](m M) M` | Copia superficial del mapa (nuevo mapa, mismos valores) |

```go
original := map[string]int{"a": 1, "b": 2}
copia := maps.Clone(original)

copia["c"] = 3
// original no se modifica: map["a":1 "b":2]
// copia: map["a":1 "b":2 "c":3]
```

> **Importante:** Si `Clone` recibe `nil`, devuelve `nil`.

---

## Copiar (Copy)

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Copy` | `Copy[M1 ~map[K]V, M2 ~map[K]V, K comparable, V any](dst M1, src M2)` | Copia todos los pares clave/valor de `src` a `dst` |

```go
src := map[string]int{"a": 1, "b": 2}
dst := map[string]int{"c": 3}

maps.Copy(dst, src)
// dst: map["a":1 "b":2 "c":3]
```

> **Atención:** Si hay claves duplicadas, los valores de `src` sobreescriben los de `dst`.

---

## Comparar (Equal, EqualFunc)

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Equal` | `Equal[M1, M2 ~map[K]V, K, V comparable](m1 M1, m2 M2) bool` | `true` si tienen las mismas claves y valores |
| `EqualFunc` | `EqualFunc[M1 ~map[K]V1, M2 ~map[K]V2, K comparable, V1, V2 any](m1 M1, m2 M2, eq func(V1, V2) bool) bool` | Igualdad con comparador personalizado |

```go
a := map[string]int{"x": 1, "y": 2}
b := map[string]int{"y": 2, "x": 1}

maps.Equal(a, b) // true (el orden no importa)
```

```go
// Comparar ignorando mayúsculas
m1 := map[string]string{"nombre": "Go"}
m2 := map[string]string{"nombre": "go"}

maps.EqualFunc(m1, m2, func(v1, v2 string) bool {
    return strings.EqualFold(v1, v2)
}) // true
```

---

## Eliminar con función (DeleteFunc)

| Función | Firma | Descripción |
|---------|-------|-------------|
| `DeleteFunc` | `DeleteFunc[M ~map[K]V, K comparable, V any](m M, del func(K, V) bool)` | Elimina entradas donde `del` retorna `true` |

```go
edades := map[string]int{
    "Ana":    17,
    "Beto":   25,
    "Carlos": 15,
    "Diana":  30,
}

maps.DeleteFunc(edades, func(k string, v int) bool {
    return v < 18 // eliminar menores de edad
})
// map["Beto":25 "Diana":30]
```

---

## Iteradores (All, Keys, Values)

Disponibles desde Go 1.23+.

| Función | Firma | Descripción |
|---------|-------|-------------|
| `All` | `All[M ~map[K]V, K comparable, V any](m M) iter.Seq2[K, V]` | Iterador sobre todos los pares clave/valor |
| `Keys` | `Keys[M ~map[K]V, K comparable, V any](m M) iter.Seq[K]` | Iterador sobre las claves |
| `Values` | `Values[M ~map[K]V, K comparable, V any](m M) iter.Seq[V]` | Iterador sobre los valores |

```go
m := map[string]int{"a": 1, "b": 2, "c": 3}

for k, v := range maps.All(m) {
    fmt.Println(k, v)
}

for k := range maps.Keys(m) {
    fmt.Println(k)
}

for v := range maps.Values(m) {
    fmt.Println(v)
}
```

> **Precaución:** El orden de iteración de un map **no está garantizado** en Go.

---

## Recolectar (Collect)

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Collect` | `Collect[K comparable, V any](seq iter.Seq2[K, V]) map[K]V` | Crea un map a partir de un iterador de pares |

```go
// Convertir un slice de pares en un map
pares := []struct {
    K string
    V int
}{{"a", 1}, {"b", 2}}

seq := func(yield func(string, int) bool) {
    for _, p := range pares {
        if !yield(p.K, p.V) {
            return
        }
    }
}

m := maps.Collect(seq)
// map["a":1 "b":2]
```

---

## Insertar (Insert)

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Insert` | `Insert[M ~map[K]V, K comparable, V any](m M, seq iter.Seq2[K, V])` | Inserta pares de un iterador en el map existente |

```go
m := map[string]int{"a": 1}

seq := func(yield func(string, int) bool) {
    yield("b", 2)
    yield("c", 3)
}

maps.Insert(m, seq)
// map["a":1 "b":2 "c":3]
```

> **Atención:** `Insert` modifica el map original in-place.

---

[← Volver al índice](/indice)
