# go/ast — Árbol de sintaxis abstracta

Representa código Go como árbol para herramientas de análisis estático.

```go
import "go/ast"
import "go/token"
```

---

## Parsear un archivo

```go
fset := token.NewFileSet()
node, _ := parser.ParseFile(fset, "mipaquete.go", nil, parser.ParseComments)

ast.Inspect(node, func(n ast.Node) bool {
    if fn, ok := n.(*ast.FuncDecl); ok {
        fmt.Println("Función:", fn.Name.Name)
    }
    return true
})
```

## Tipos principales

| Tipo | Representa |
|------|------------|
| `ast.File` | Un archivo Go completo |
| `ast.FuncDecl` | Declaración de función/método |
| `ast.GenDecl` | Declaración genérica (import, var, const, type) |
| `ast.ImportSpec` | Una importación |
| `ast.TypeSpec` | Una declaración de tipo |
| `ast.AssignStmt` | Asignación (`x := 1`) |
| `ast.IfStmt` | Bloque if |
| `ast.ForStmt` | Bucle for |
| `ast.CallExpr` | Llamada a función |
| `ast.BasicLit` | Literal (número, string) |
| `ast.Ident` | Identificador (nombre de variable) |

## Recorrer con `ast.Inspect`

```go
ast.Inspect(node, func(n ast.Node) bool {
    if ident, ok := n.(*ast.Ident); ok {
        fmt.Println("Identificador:", ident.Name)
    }
    return true // seguir recorriendo hijos
})
```

---

[← Volver al índice](/indice)
