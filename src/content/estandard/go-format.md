# go/format — Formatear código Go

El motor detrás de `gofmt`. Formatea código Go programáticamente.

```go
import "go/format"
```

---

## Formatear código

```go
src, _ := os.ReadFile("main.go")
formatted, err := format.Source(src)
os.WriteFile("main.go", formatted, 0644)
```

| Función | Qué hace |
|---------|----------|
| `format.Source(src)` | Formatea código Go (`[]byte` → `[]byte`) |
| `format.Node(w, fset, node)` | A partir de un `ast.Node` (ver [go/ast](/go-ast)) |

## Con parser y formatter (herramienta completa)

```go
fset := token.NewFileSet()
node, _ := parser.ParseFile(fset, "main.go", src, parser.ParseComments)
format.Node(os.Stdout, fset, node) // imprime formateado
```

---

[← Volver al índice](/indice)
