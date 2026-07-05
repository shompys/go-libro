# go/version — Versión de Go

Lee la versión de Go de archivos fuente. Go 1.21+.

```go
import "go/version"
```

---

```go
// ¿Este código requiere Go 1.18+?
version.IsValid("go1.18")  // true

// ¿La versión actual soporta X?
version.Lang("go1.21")     // "go1.21" u otra

// Comparar:
version.Compare("go1.20", "go1.21")  // -1 (anterior)
```

---

[← Volver al índice](/indice)
