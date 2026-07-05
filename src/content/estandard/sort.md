# sort — Ordenamiento

Ordena slices de tipos básicos y slices personalizados.

```go
import "sort"
```

---

## Slices de tipos básicos

```go
nums := []int{5, 2, 8, 1, 9}
sort.Ints(nums)                         // [1 2 5 8 9]

strs := []string{"perro", "gato", "ave"}
sort.Strings(strs)                      // ["ave" "gato" "perro"]

floats := []float64{3.14, 1.41, 2.72}
sort.Float64s(floats)                   // [1.41 2.72 3.14]
```

| Función | Para |
|---------|------|
| `sort.Ints(s)` | `[]int` |
| `sort.Strings(s)` | `[]string` |
| `sort.Float64s(s)` | `[]float64` |
| `sort.IntsAreSorted(s)` | Verifica si está ordenado |
| `sort.SearchInts(a, x)` | Búsqueda binaria en `[]int` ordenado |
| `sort.SearchFloat64s(a, x)` | Búsqueda binaria en `[]float64` ordenado |
| `sort.SearchStrings(a, x)` | Búsqueda binaria en `[]string` ordenado |
| `sort.IsSorted(data)` | Devuelve `true` si los datos cumplen `Less` |

---

## Verificar si está ordenado

```go
if sort.IntsAreSorted(nums) {
    fmt.Println("Está ordenado")
}

// sort.IsSorted funciona con cualquier tipo que implemente sort.Interface
if sort.IsSorted(sort.IntSlice(nums)) {
    fmt.Println("Está ordenado")
}
```

---

## sort.Interface

La interfaz que todo tipo debe implementar para usar `sort.Sort`, `sort.IsSorted`, `sort.Reverse`:

```go
type Interface interface {
    Len() int           // cantidad de elementos
    Less(i, j int) bool // ¿el elemento i debe ir antes que j?
    Swap(i, j int)      // intercambia los elementos i y j
}
```

```go
type Personas []Persona

func (p Personas) Len() int           { return len(p) }
func (p Personas) Less(i, j int) bool { return p[i].Edad < p[j].Edad }
func (p Personas) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }

gente := Personas{{"Ana", 30}, {"Juan", 25}}
sort.Sort(gente)       // ordena usando la interfaz
sort.IsSorted(gente)   // true
sort.Reverse(gente)    // invierte el orden
```

---

## Búsqueda binaria con helpers

Funciones de búsqueda que asumen slice ordenado:

```go
nums := []int{1, 2, 5, 8, 9}
idx := sort.SearchInts(nums, 5)       // 2 (índice de 5)
idx = sort.SearchInts(nums, 4)        // 2 (donde debería insertarse)

strs := []string{"Ana", "Beto", "Carlos"}
sort.SearchStrings(strs, "Beto")       // 1

floats := []float64{1.41, 2.72, 3.14}
sort.SearchFloat64s(floats, 3.0)       // 2 (donde insertar 3.0)
```

---

## sort.Find (Go 1.19+)

Busca usando función de comparación con 3 valores (-1, 0, +1):

```go
nums := []int{10, 20, 30, 40, 50}
target := 30
idx, found := sort.Find(len(nums), func(i int) int {
    return target - nums[i]
})
// idx = 2, found = true
```

---

## Ordenamiento descendente

```go
sort.Sort(sort.Reverse(sort.IntSlice(nums)))
// o más fácil:
sort.Slice(nums, func(i, j int) bool {
    return nums[i] > nums[j]
})
```

---

## Ordenar slice de structs

```go
type Persona struct { Nombre string; Edad int }

personas := []Persona{
    {"Ana", 30},
    {"Juan", 25},
}

// Por edad (ascendente):
sort.Slice(personas, func(i, j int) bool {
    return personas[i].Edad < personas[j].Edad
})
```

| Función | Qué hace |
|---------|----------|
| `sort.Slice(s, less)` | Ordena cualquier slice con función `less(i, j)` |
| `sort.SliceStable(s, less)` | Orden estable (no cambia el orden de elementos iguales) |

---

## Search (búsqueda binaria)

Busca en un slice **ordenado**:

```go
nums := []int{1, 2, 5, 8, 9}
idx := sort.Search(len(nums), func(i int) bool {
    return nums[i] >= 5  // primer índice donde nums[i] >= 5
})
fmt.Println(idx)  // 2
```

---

[← Volver al índice](/indice)
