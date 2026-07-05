# encoding/ascii85 — Codificar Base85 (ASCII85)

Formato de codificación binario a texto usado en PostScript y PDF.

```go
import "encoding/ascii85"
```

---

## Codificar

```go
var buf bytes.Buffer
w := ascii85.NewEncoder(&buf)
w.Write([]byte("binary data"))
w.Close()

encoded := buf.Bytes()
```

## Decodificar

```go
r := ascii85.NewDecoder(reader)
datos, _ := io.ReadAll(r)
```

## Funciones simples

```go
encoded := make([]byte, ascii85.MaxEncodedLen(len(data)))
n := ascii85.Encode(encoded, data)

decoded := make([]byte, len(encoded))
n, _, err := ascii85.Decode(decoded, encoded, true)
```

---

[← Volver al índice](/indice)
