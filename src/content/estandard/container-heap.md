# container/heap — Heap (montículo)

Estructura de datos que mantiene el elemento mínimo siempre accesible. Útil para colas de prioridad.

```go
import "container/heap"
```

---

## Implementar la interfaz

Tenés que definir un tipo que implemente `heap.Interface`:

```go
type MinHeap []int

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *MinHeap) Push(x any) {
    *h = append(*h, x.(int))
}

func (h *MinHeap) Pop() any {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}
```

| Método | Qué debe hacer |
|--------|---------------|
| `Len()` | Cantidad de elementos |
| `Less(i, j)` | `true` si `h[i]` < `h[j]` (para min-heap) |
| `Swap(i, j)` | Intercambiar elementos |
| `Push(x)` | Agregar `x` al final |
| `Pop()` | Quitar y devolver el último |

---

## Usar el heap

```go
h := &MinHeap{5, 2, 8, 1, 9}
heap.Init(h)        // ordena en heap

heap.Push(h, 3)     // inserta
min := heap.Pop(h)  // extrae el mínimo (1)

for h.Len() > 0 {
    fmt.Println(heap.Pop(h))  // imprime en orden: 2, 3, 5, 8, 9
}
```

---

## Funciones

| Función | Qué hace |
|---------|----------|
| `heap.Init(h)` | Convierte un slice en heap en tiempo O(n) |
| `heap.Push(h, x)` | Inserta un elemento y reordena en O(log n) |
| `heap.Pop(h)` | Extrae el elemento raíz (mínimo o máximo) en O(log n) |
| `heap.Remove(h, i)` | Elimina el elemento en índice `i` en O(log n) |
| `heap.Fix(h, i)` | Reordena después de modificar el elemento `i` en O(log n) |

### heap.Remove — Eliminar elemento arbitrario

```go
h := &MinHeap{5, 2, 8, 1, 9}
heap.Init(h)

// Eliminar el elemento en índice 2 (valor 5)
removido := heap.Remove(h, 2)
// removido = 5, heap queda [1 8 9]

// Los índices se reordenan después de Init. No uses índices pre-Init.
```

### heap.Fix — Reordenar tras modificar

```go
h := &MinHeap{5, 2, 8, 1, 9}
heap.Init(h)

// Modificar un elemento manualmente
(*h)[0] = 100  // el mínimo ahora es 100 (viola el heap)

heap.Fix(h, 0)  // reordena: el 100 "baja" y el verdadero mínimo sube
```

---

## Detalle de la interfaz heap.Interface

```go
type Interface interface {
    sort.Interface      // Len, Less, Swap
    Push(x any)         // agrega x al final
    Pop() any           // quita y devuelve el último elemento
}
```

| Método | ¿Quién lo llama? | Responsabilidad |
|--------|------------------|-----------------|
| `Len()` | `heap.Init`, `heap.Push`, `heap.Pop`, `heap.Remove`, `heap.Fix` | Devolver el tamaño actual |
| `Less(i, j)` | Operaciones de reordenamiento | Definir el orden: `true` si `i` debe estar más cerca de la raíz que `j` |
| `Swap(i, j)` | Operaciones de reordenamiento | Intercambiar físicamente los elementos `i` y `j` |
| `Push(x)` | `heap.Push` | Agregar `x` al final del slice subyacente |
| `Pop()` | `heap.Pop`, `heap.Remove` | Quitar y devolver el último elemento (no la raíz; el heap mueve la raíz al final antes de llamar a Pop) |

En `Push` recibe el elemento nuevo y debe agregarlo. En `Pop` recibe que el último elemento ya fue intercambiado con la raíz y debe removerlo.

---

## Max-heap

Para tener el máximo en vez del mínimo, invertí el `Less`:

```go
func (h MaxHeap) Less(i, j int) bool { return h[i] > h[j] }
```

---

[← Volver al índice](/indice)
