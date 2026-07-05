# go/importer — Importador de paquetes Go

Carga paquetes para usarlos con el type checker.

```go
import "go/importer"
import "go/types"
```

---

```go
conf := types.Config{Importer: importer.Default()}
pkg, err := conf.Check("mipaquete", fset, files, info)
```

| Función | Qué hace |
|---------|----------|
| `importer.Default()` | Importador que lee paquetes compilados |
| `importer.ForCompiler(fset, compiler, lookup)` | Para compiladores no estándar |

---

[← Volver al índice](/indice)
