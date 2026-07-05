# slices — Funciones genéricas para slices (Go 1.21+)

Paquete con operaciones comunes sobre slices usando genéricos de Go. Reemplaza patrones manuales con funciones estándar, tipadas y documentadas.

```go
import "slices"
```

---

## Índice

- [Buscar (Contains, Index)](/estandard/slices#buscar)
- [Ordenar (Sort, SortFunc, SortStableFunc)](/estandard/slices#ordenar)
- [Comparar (Equal, Compare)](/estandard/slices#comparar)
- [Modificar (Insert, Delete, Replace)](/estandard/slices#modificar)
- [Clonar y compactar (Clone, Compact)](/estandard/slices#clonar-y-compactar)
- [Buscar en slice ordenado (BinarySearch)](/estandard/slices#buscar-en-slice-ordenado)
- [Máximo y mínimo (Max, Min, MaxFunc, MinFunc)](/estandard/slices#máximo-y-mínimo)
- [Reversa (Reverse)](/estandard/slices#reversa)
- [Verificar orden (IsSorted, IsSortedFunc)](/estandard/slices#verificar-orden)
- [Crecimiento (Grow)](/estandard/slices#crecimiento)
- [Concatenar (Concat)](/estandard/slices#concatenar-concat)
- [Repetir (Repeat)](/estandard/slices#repetir-repeat)
- [Dividir (Chunk)](/estandard/slices#dividir-chunk)
- [Recortar (Clip)](/estandard/slices#recortar-clip)
- [Recolectar (Collect)](/estandard/slices#recolectar-collect)
- [Iterar invertido (Backward)](/estandard/slices#iterar-invertido-backward)
- [Eliminar con función (DeleteFunc)](/estandard/slices#eliminar-con-función-deletefunc)
- [Crear con Collect y AppendSeq](/estandard/slices#crear-con-collect-y-appendseq)

---

## Buscar

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Contains` | `Contains[S ~[]E, E comparable](s S, v E) bool` | `true` si el slice contiene `v` |
| `ContainsFunc` | `ContainsFunc[S ~[]E, E any](s S, f func(E) bool) bool` | `true` si algún elemento cumple `f` |
| `Index` | `Index[S ~[]E, E comparable](s S, v E) int` | Índice de `v`, `-1` si no está |
| `IndexFunc` | `IndexFunc[S ~[]E, E any](s S, f func(E) bool) int` | Índice del primer elemento que cumple `f` |

```go
nums := []int{10, 20, 30, 40}

slices.Contains(nums, 20)       // true
slices.Index(nums, 30)          // 2
slices.Index(nums, 99)          // -1

slices.ContainsFunc(nums, func(n int) bool { return n > 25 }) // true
slices.IndexFunc(nums, func(n int) bool { return n > 25 })    // 2 (30)
```

---

## Ordenar

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Sort` | `Sort[S ~[]E, E cmp.Ordered](s S)` | Ordena in-place (ascendente) |
| `SortFunc` | `SortFunc[S ~[]E, E any](s S, cmp func(a, b E) int)` | Ordena con comparador personalizado |
| `SortStableFunc` | `SortStableFunc[S ~[]E, E any](s S, cmp func(a, b E) int)` | Orden estable (mantiene orden relativo) |

`cmp.Ordered` incluye: `int`, `int8`, `int16`, `int32`, `int64`, `uint`, `uint8`, `uint16`, `uint32`, `uint64`, `uintptr`, `float32`, `float64`, `string`.

```go
nums := []int{3, 1, 4, 1, 5, 9}
slices.Sort(nums)
// [1 1 3 4 5 9]

nombres := []string{"Carlos", "Ana", "Beto"}
slices.Sort(nombres)
// [Ana Beto Carlos]
```

```go
// Ordenar structs por campo
type Persona struct {
    Nombre string
    Edad   int
}
gente := []Persona{
    {"Zoe", 25}, {"Ana", 30}, {"Ana", 20},
}
slices.SortFunc(gente, func(a, b Persona) int {
    if a.Nombre != b.Nombre {
        return cmp.Compare(a.Nombre, b.Nombre)
    }
    return cmp.Compare(a.Edad, b.Edad)
})
// [{Ana 20} {Ana 30} {Zoe 25}]
```

```go
slices.SortStableFunc(gente, func(a, b Persona) int {
    return cmp.Compare(a.Nombre, b.Nombre)
})
// Ana, Ana, Zoe (preserva orden original entre iguales)
```

---

## Comparar

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Equal` | `Equal[S ~[]E, E comparable](s1, s2 S) bool` | `true` si tienen misma longitud y mismos elementos |
| `EqualFunc` | `EqualFunc[S ~[]E, E any](s1, s2 S, eq func(E, E) bool) bool` | Igualdad con comparador personalizado |
| `Compare` | `Compare[S ~[]E, E cmp.Ordered](s1, s2 S) int` | Comparación lexicográfica: `-1`, `0`, `+1` |
| `CompareFunc` | `CompareFunc[S ~[]E, E any](s1, s2 S, cmp func(E, E) int) int` | Comparación con función |

```go
a := []int{1, 2, 3}
b := []int{1, 2, 3}
c := []int{1, 2, 4}

slices.Equal(a, b)    // true
slices.Equal(a, c)    // false
slices.Compare(a, c)  // -1 (a es lexicográficamente menor)
```

```go
// EqualFunc ignora mayúsculas
n1 := []string{"Go", "Rust"}
n2 := []string{"go", "RUST"}
slices.EqualFunc(n1, n2, strings.EqualFold) // true
```

---

## Modificar

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Insert` | `Insert[S ~[]E, E any](s S, i int, v ...E) S` | Inserta valores en la posición `i` |
| `Delete` | `Delete[S ~[]E, E any](s S, i, j int) S` | Elimina `s[i:j]` |
| `Replace` | `Replace[S ~[]E, E any](s S, i, j int, v ...E) S` | Reemplaza `s[i:j]` por `v...` |

```go
nums := []int{1, 2, 4}
nums = slices.Insert(nums, 2, 3)
// [1 2 3 4]

nums = slices.Insert(nums, 0, 0, -1)
// [-1 0 1 2 3 4]

nums = slices.Delete(nums, 0, 2)
// [1 2 3 4]

nums = slices.Replace(nums, 1, 3, 99, 100)
// [1 99 100 4]
```

> **Importante:** Insert, Delete y Replace **devuelven un nuevo slice** (puede o no compartir backing array). Siempre reasigná: `s = slices.Insert(s, ...)`.

---

## Clonar y compactar

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Clone` | `Clone[S ~[]E, E any](s S) S` | Copia superficial del slice (nuevo backing array) |
| `Compact` | `Compact[S ~[]E, E comparable](s S) S` | Elimina duplicados consecutivos |
| `CompactFunc` | `CompactFunc[S ~[]E, E any](s S, eq func(E, E) bool) S` | Elimina consecutivos según comparador |

```go
nums := []int{1, 1, 2, 2, 3, 1, 1}
slices.Compact(nums)
// [1 2 3 1] (solo elimina consecutivos iguales)

// Para eliminar TODOS los duplicados, ordená primero:
slices.Sort(nums)
slices.Compact(nums)
// [1 2 3]
```

```go
original := []int{1, 2, 3}
copia := slices.Clone(original)
copia[0] = 99
// original sigue [1, 2, 3]
```

---

## Buscar en slice ordenado

| Función | Firma | Descripción |
|---------|-------|-------------|
| `BinarySearch` | `BinarySearch[S ~[]E, E cmp.Ordered](x S, target E) (int, bool)` | Búsqueda binaria en slice ordenado |
| `BinarySearchFunc` | `BinarySearchFunc[S ~[]E, E, T any](x S, target T, cmp func(E, T) int) (int, bool)` | Búsqueda binaria con comparador |

```go
nums := []int{1, 3, 5, 7, 9}
i, ok := slices.BinarySearch(nums, 5)
// i = 2, ok = true

i, ok = slices.BinarySearch(nums, 4)
// i = 2 (donde debería insertarse), ok = false
```

```go
gente := []Persona{{"Ana", 20}, {"Beto", 30}, {"Carlos", 40}}
slices.SortFunc(gente, func(a, b Persona) int {
    return cmp.Compare(a.Nombre, b.Nombre)
})

i, ok := slices.BinarySearchFunc(gente, "Beto", func(p Persona, target string) int {
    return cmp.Compare(p.Nombre, target)
})
// i = 1, ok = true
```

> **Precaución:** El slice **debe** estar ordenado antes de usar BinarySearch. El resultado es impredecible si no lo está.

---

## Máximo y mínimo

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Max` | `Max[S ~[]E, E cmp.Ordered](x S) E` | Elemento máximo |
| `Min` | `Min[S ~[]E, E cmp.Ordered](x S) E` | Elemento mínimo |
| `MaxFunc` | `MaxFunc[S ~[]E, E any](x S, cmp func(a, b E) int) E` | Máximo con comparador |
| `MinFunc` | `MinFunc[S ~[]E, E any](x S, cmp func(a, b E) int) E` | Mínimo con comparador |

```go
nums := []int{3, 7, 2, 9, 1}
slices.Max(nums) // 9
slices.Min(nums) // 1
```

```go
gente := []Persona{{"Ana", 25}, {"Beto", 30}, {"Carlos", 20}}
menor := slices.MinFunc(gente, func(a, b Persona) int {
    return cmp.Compare(a.Edad, b.Edad)
})
// {Carlos 20}
```

> **Atención:** `Max` y `Min` producen **panic** si el slice está vacío.

---

## Reversa

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Reverse` | `Reverse[S ~[]E, E any](s S)` | Invierte el orden in-place |

```go
nums := []int{1, 2, 3, 4, 5}
slices.Reverse(nums)
// [5 4 3 2 1]
```

---

## Verificar orden

| Función | Firma | Descripción |
|---------|-------|-------------|
| `IsSorted` | `IsSorted[S ~[]E, E cmp.Ordered](x S) bool` | `true` si está ordenado ascendentemente |
| `IsSortedFunc` | `IsSortedFunc[S ~[]E, E any](x S, cmp func(a, b E) int) bool` | Verifica orden con comparador |

```go
slices.IsSorted([]int{1, 2, 3})   // true
slices.IsSorted([]int{1, 3, 2})   // false
```

---

## Crecimiento

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Grow` | `Grow[S ~[]E, E any](s S, n int) S` | Aumenta la capacidad para `n` elementos más |

```go
nums := make([]int, 0, 2)
nums = slices.Grow(nums, 100)
// cap(nums) ahora tiene espacio para al menos 102 elementos
```

Evita realocaciones repetidas cuando sabés cuántos elementos vas a agregar.

---

## Concatenar (Concat)

Une varios slices en uno solo.

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Concat` | `Concat[S ~[]E, E any](slices ...S) S` | Concatena múltiples slices |

```go
a := []int{1, 2}
b := []int{3, 4}
c := []int{5, 6}
result := slices.Concat(a, b, c)
// [1 2 3 4 5 6]
```

---

## Repetir (Repeat)

Crea un slice repitiendo el mismo valor `n` veces.

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Repeat` | `Repeat[S ~[]E, E any](x S, count int) S` | Repite el slice `count` veces |

```go
base := []int{1, 2}
result := slices.Repeat(base, 3)
// [1 2 1 2 1 2]
```

---

## Dividir (Chunk)

Divide un slice en sub-slices de tamaño fijo.

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Chunk` | `Chunk[S ~[]E, E any](s S, n int) []S` | Divide `s` en chunks de hasta `n` elementos |

```go
nums := []int{1, 2, 3, 4, 5, 6, 7}
chunks := slices.Chunk(nums, 3)
// [1 2 3] [4 5 6] [7](/1 2 3] [4 5 6] [7)
```

---

## Recortar (Clip)

Elimina capacidad no usada del slice.

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Clip` | `Clip[S ~[]E, E any](s S) S` | `cap(s) = len(s)` |

```go
s := make([]int, 3, 100)
s = slices.Clip(s)
// cap(s) == 3 (libera los 97 restantes)
```

---

## Recolectar (Collect)

Convierte un iterador (seq) en un slice.

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Collect` | `Collect[E any](seq iter.Seq[E]) []E` | Recolecta elementos de un iterador |

```go
items := slices.Collect(maps.Keys(miMapa))
// convierte las claves del mapa en un slice
```

---

## Iterar invertido (Backward)

Itera un slice en orden inverso.

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Backward` | `Backward[S ~[]E, E any](s S) iter.Seq2[int, E]` | Iterador que recorre `s` de atrás hacia adelante |

```go
nums := []int{1, 2, 3, 4, 5}
for i, v := range slices.Backward(nums) {
    fmt.Println(i, v)
}
// 4 5
// 3 4
// 2 3
// 1 2
// 0 1
```

---

## Eliminar con función (DeleteFunc)

Elimina elementos que cumplen un predicado.

| Función | Firma | Descripción |
|---------|-------|-------------|
| `DeleteFunc` | `DeleteFunc[S ~[]E, E any](s S, del func(E) bool) S` | Elimina elementos donde `del` retorna `true` |

```go
nums := []int{1, 2, 3, 4, 5, 6}
nums = slices.DeleteFunc(nums, func(n int) bool {
    return n%2 == 0  // eliminar pares
})
// [1 3 5]
```

---

[← Volver al índice](/indice)
