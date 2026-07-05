# go/token — Archivos y posiciones

Define `FileSet` y `Position` para rastrear ubicaciones en código fuente. Usado por todos los paquetes `go/*`.

```go
import "go/token"
```

---

## FileSet y posición

```go
fset := token.NewFileSet()
file := fset.AddFile("main.go", -1, 100)
// agrega líneas:
file.AddLine(10)  // línea 2 empieza en offset 10
file.AddLine(25)  // línea 3 empieza en offset 25

pos := file.Pos(15)        // token.Pos
position := fset.Position(pos)
// position.Filename = "main.go"
// position.Line, position.Column, position.Offset
```

| Método | Devuelve |
|--------|----------|
| `fset.Position(pos)` | `token.Position` con Filename, Line, Column, Offset |
| `file.Pos(offset)` | `token.Pos` en ese byte offset |
| `file.AddLine(offset)` | Registra dónde empieza una nueva línea |

---

[← Volver al índice](/indice)
