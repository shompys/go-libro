# container/ring — Lista circular (ring buffer)

```go
import "container/ring"
```

Un anillo circular donde cada elemento apunta al siguiente, y el último apunta al primero. No tiene principio ni fin definido.

---

## Crear un anillo

```go
r := ring.New(3) // anillo con capacidad para 3 elementos

r.Value = "uno"
r.Next().Value = "dos"
r.Next().Next().Value = "tres"

// Ahora r.Next().Next().Next() == r (vuelve al principio)
```

| Función | Descripción |
|---------|-------------|
| `ring.New(n int)` | Crea un anillo de `n` elementos (todos con Value = nil) |

---

## Recorrer el anillo

```go
r.Do(func(v interface{}) {
    fmt.Println(v)
})
// Salida: uno, dos, tres (en orden circular)
```

| Método | Descripción |
|--------|-------------|
| `r.Do(f func(interface{}))` | Ejecuta `f` en cada elemento del anillo |

---

## Navegación

```go
r = r.Next()  // avanzar al siguiente
r = r.Prev()  // retroceder al anterior
r = r.Move(2) // avanzar 2 posiciones (puede ser negativo)
```

| Método | Descripción |
|--------|-------------|
| `r.Next()` | Devuelve el siguiente elemento del anillo |
| `r.Prev()` | Devuelve el elemento anterior |
| `r.Move(n int)` | Avanza `n` posiciones (negativo = retroceder) |

---

## Unir y separar anillos

```go
a := ring.New(2)
a.Value = "A1"
a.Next().Value = "A2"

b := ring.New(2)
b.Value = "B1"
b.Next().Value = "B2"

// Unir: inserta b después de a
a.Link(b) // ahora a tiene 4 elementos: A1, B1, B2, A2
```

```go
// Separar: remueve n elementos a partir de r.Next()
resto := r.Unlink(2) // quita 2 elementos, devuelve el anillo con ellos
```

| Método | Descripción |
|--------|-------------|
| `r.Link(s *Ring)` | Inserta el anillo `s` después de `r` |
| `r.Unlink(n int)` | Remueve `n` elementos desde `r.Next()`, los devuelve |

---

## Contar elementos

```go
n := r.Len() // cantidad de elementos en el anillo
```

---

## Anillo vacío vs nil

```go
var r *ring.Ring = nil  // nil != anillo vacío
r = ring.New(0)          // anillo vacío con Len() == 0
```

Un `*Ring` nil no tiene métodos seguros (produce panic). `ring.New(0)` es seguro.

---

[← Volver al índice](/indice)
