# mime/quotedprintable — Quoted-Printable

Encoding usado en emails para caracteres no ASCII.

```go
import "mime/quotedprintable"
```

---

## Codificar

```go
var buf bytes.Buffer
w := quotedprintable.NewWriter(&buf)
w.Write([]byte("Hola mundo con eñes"))
w.Close()
```

## Decodificar

```go
r := quotedprintable.NewReader(reader)
datos, _ := io.ReadAll(r)
```

---

[← Volver al índice](/indice)
