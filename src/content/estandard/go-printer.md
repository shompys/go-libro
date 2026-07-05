# go/printer — Impresor de AST a código Go

Convierte un AST de vuelta a código Go formateado.

```go
import "go/printer"
import "go/token"
```

---

```go
fset := token.NewFileSet()
node, _ := parser.ParseFile(fset, "main.go", src, parser.ParseComments)

var buf bytes.Buffer
printer.Fprint(&buf, fset, node)
fmt.Println(buf.String()) // código Go formateado
```

| Función | Qué hace |
|---------|----------|
| `printer.Fprint(w, fset, node)` | Escribe el AST formateado a `w` |

---

[← Volver al índice](/indice)
