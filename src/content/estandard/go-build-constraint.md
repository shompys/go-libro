# go/build/constraint — Build constraints (tags)

Parse y evalúa constraints de build (`//go:build linux && amd64`).

```go
import "go/build/constraint"
```

---

```go
expr, err := constraint.Parse("//go:build linux && amd64")
// expr es constraint.Expr

ok := expr.Eval(func(tag string) bool {
    return tag == "linux" || tag == "amd64"
})
```

---

[← Volver al índice](/indice)
