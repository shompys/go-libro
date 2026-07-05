# container/list — Lista doblemente enlazada

```go
import "container/list"
```

---

## Crear y agregar

```go
l := list.New()
l.PushBack("tercero")
l.PushFront("primero")
l.InsertAfter("segundo", l.Front())
l.InsertBefore("cuarto", l.Back())

// Recorrer
for e := l.Front(); e != nil; e = e.Next() {
    fmt.Println(e.Value)
}
```

| Método | Devuelve |
|--------|----------|
| `PushBack(v)` | Inserta al final, devuelve `*Element` |
| `PushFront(v)` | Inserta al inicio |
| `InsertAfter(v, mark)` | Inserta después de `mark` |
| `InsertBefore(v, mark)` | Inserta antes de `mark` |

---

## Remover

```go
l.Remove(elemento)  // remueve y devuelve el valor
```

---

## Moverse

| Método | Qué hace |
|--------|----------|
| `MoveToFront(e)` | Mueve el elemento al frente |
| `MoveToBack(e)` | Mueve el elemento al final |
| `MoveBefore(e, mark)` | Mueve antes de `mark` |
| `MoveAfter(e, mark)` | Mueve después de `mark` |

---

## Tipo Element

Cada nodo de la lista es `*list.Element`. Expone:

| Campo/Método | Descripción |
|---------------|-------------|
| `Value any` | El valor almacenado en el elemento |
| `Next() *Element` | Siguiente elemento (nil si es el último) |
| `Prev() *Element` | Elemento anterior (nil si es el primero) |

```go
e := l.PushBack("hola")
fmt.Println(e.Value)           // "hola"
siguiente := e.Next()          // nil (es el único)
anterior := e.Prev()           // nil
```

---

## Init

Vacía la lista y la reinicializa:

| Método | Descripción |
|--------|-------------|
| `l.Init() *List` | Vacía la lista (elimina todos los elementos) |

```go
l.Init()  // l.Len() == 0, l.Front() == nil
```

---

## PushBackList / PushFrontList

Inserta todos los elementos de otra lista al final o al principio:

| Método | Descripción |
|--------|-------------|
| `l.PushBackList(other *List)` | Agrega todos los elementos de `other` al final |
| `l.PushFrontList(other *List)` | Agrega todos los elementos de `other` al principio |

```go
a := list.New()
a.PushBack(1)
a.PushBack(2)

b := list.New()
b.PushBack(3)
b.PushBack(4)

a.PushBackList(b)
// a: 1, 2, 3, 4  (b queda vacía — los elementos se mueven, no se copian)
```

---

## Propiedades

```go
l.Len()       // cantidad de elementos
l.Front()     // primer elemento (nil si vacía)
l.Back()      // último elemento
```

---

[← Volver al índice](/indice)
