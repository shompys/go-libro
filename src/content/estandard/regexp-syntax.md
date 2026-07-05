# regexp/syntax — Parseo de sintaxis regex

Parseo de bajo nivel de expresiones regulares (usado por [regexp](/regexp)).

```go
import "regexp/syntax"
```

---

```go
re, _ := syntax.Parse(`a(b|c)d`, syntax.Perl)
// analizar la estructura:
fmt.Println(re.Op)   // OpConcat
for _, sub := range re.Sub {
    fmt.Printf("  %v\n", sub)
}
```

| Flag | Significado |
|------|-------------|
| `syntax.Perl` | Sintaxis estilo Perl (como `\d`, `\w`) |
| `syntax.POSIX` | Sintaxis POSIX |
| `syntax.UnicodeGroups` | Habilita `\p{...}` |

---

[← Volver al índice](/indice)
