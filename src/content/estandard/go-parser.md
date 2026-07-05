# go/parser — Parser de código Go

Lee archivos .go y produce un AST (árbol de sintaxis).

```go
import "go/parser"
import "go/token"
```

---

## Parsear archivo

```go
fset := token.NewFileSet()
node, err := parser.ParseFile(fset, "main.go", nil, parser.ParseComments)
```

## Parsear string

```go
src := `package main; func main() {}`
node, _ := parser.ParseFile(fset, "", src, parser.ParseComments)
```

## Parsear directorio

```go
pkgs, _ := parser.ParseDir(fset, "/ruta/al/paquete", nil, parser.ParseComments)
for name, pkg := range pkgs {
    fmt.Println("Paquete:", name)
}
```

## Modos de parseo

| Flag | Qué hace |
|------|----------|
| `parser.ParseComments` | Incluye comentarios en el AST |
| `parser.AllErrors` | Reporta todos los errores (no solo el primero) |
| `parser.SkipObjectResolution` | No resuelve identificadores a objetos |

---

[← Volver al índice](/indice)
