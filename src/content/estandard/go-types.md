# go/types — Type checker de Go

Verifica tipos de código Go. Es el motor de type checking que usan IDEs y linters.

```go
import "go/types"
```

---

## Crear un type checker

```go
fset := token.NewFileSet()
node, _ := parser.ParseFile(fset, "main.go", nil, 0)

conf := types.Config{Importer: importer.Default()}
info := &types.Info{
    Types: make(map[ast.Expr]types.TypeAndValue),
    Defs:  make(map[*ast.Ident]types.Object),
    Uses:  make(map[*ast.Ident]types.Object),
}
pkg, _ := conf.Check("mipaquete", fset, []*ast.File{node}, info)
```

## Introspectar tipos

```go
// info.Types te dice el tipo de cada expresión
for expr, tv := range info.Types {
    fmt.Printf("%T → %v\n", expr, tv.Type)
}

// info.Defs te dice dónde se define cada identificador
for ident, obj := range info.Defs {
    if obj != nil {
        fmt.Printf("Definición: %s = %v\n", ident.Name, obj.Type())
    }
}
```

## Tipos básicos

| Tipo en `types` | Representa |
|-----------------|------------|
| `types.Basic` | int, string, bool, etc. |
| `types.Named` | Tipos nombrados (structs, type alias) |
| `types.Struct` | Struct anónimo |
| `types.Signature` | Firma de función |
| `types.Slice` | Slice |
| `types.Pointer` | Puntero |
| `types.Map` | Mapa |
| `types.Interface` | Interfaz |

---

[← Volver al índice](/indice)
