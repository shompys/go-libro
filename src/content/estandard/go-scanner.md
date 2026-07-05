# go/scanner — Scanner léxico de Go

Tokeniza archivos Go en tokens individuales (identificadores, literales, operadores).

```go
import "go/scanner"
import "go/token"
```

---

```go
fset := token.NewFileSet()
src, _ := os.ReadFile("main.go")
file := fset.AddFile("main.go", -1, len(src))

var s scanner.Scanner
s.Init(file, src, nil, scanner.ScanComments)

for {
    pos, tok, lit := s.Scan()
    if tok == token.EOF { break }
    fmt.Printf("%s\t%s\t%q\n", fset.Position(pos), tok, lit)
}
```

| Función | Qué hace |
|---------|----------|
| `s.Init(file, src, errHandler, mode)` | Inicializa el scanner |
| `s.Scan()` | Devuelve (Pos, Token, Literal) del próximo token |

---

[← Volver al índice](/indice)
