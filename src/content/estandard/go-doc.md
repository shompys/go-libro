# go/doc — Extraer documentación de código Go

Extrae comentarios de documentación de paquetes, funciones y tipos.

```go
import "go/doc"
import "go/parser"
import "go/token"
```

---

```go
fset := token.NewFileSet()
pkgs, _ := parser.ParseDir(fset, "/ruta/paquete", nil, parser.ParseComments)

for _, pkg := range pkgs {
    docPkg := doc.New(pkg, "./importpath", doc.AllDecls)
    
    for _, fn := range docPkg.Funcs {
        fmt.Println(fn.Name)   // nombre de la función
        fmt.Println(fn.Doc)    // comentario de documentación
    }
}
```

---

[← Volver al índice](/indice)
