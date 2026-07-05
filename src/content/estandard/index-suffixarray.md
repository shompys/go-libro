# index/suffixarray — Búsqueda de substrings

Índice para búsqueda rápida de substrings (Full-Text Search en memoria).

```go
import "index/suffixarray"
```

---

```go
data := []byte("el gato come pescado")
idx := suffixarray.New(data)

// Buscar todas las ocurrencias:
offsets := idx.Lookup([]byte("gato"), -1)  // -1 = todas
// offsets = [3] (posición en bytes)

for _, off := range offsets {
    fmt.Println(off)
}
```

| Método | Qué hace |
|--------|----------|
| `New(data)` | Crea un índice desde los datos |
| `Lookup(pattern, n)` | Busca `pattern`, devuelve offsets. `n=-1` = todas |
| `FindAllIndex(r, n)` | Búsqueda por `*regexp.Regexp` |

---

[← Volver al índice](/indice)
