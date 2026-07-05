# encoding/base32 — Codificar Base32

Igual que [base64](/encoding-base64) pero con alfabeto de 32 caracteres.

```go
import "encoding/base32"
```

---

## Índice

- [Codificar](/estandard/encoding-base32#codificar)
- [Decodificar](/estandard/encoding-base32#decodificar)
- [Esquemas](/estandard/encoding-base32#esquemas)
- [Encoder y Decoder (streaming)](/estandard/encoding-base32#encoder-y-decoder-streaming)
- [Configuración avanzada](/estandard/encoding-base32#configuración-avanzada)

---

## Codificar

```go
data := []byte("hello")
encoded := base32.StdEncoding.EncodeToString(data)
// "NBSWY3DP"
```

| Método | Descripción |
|--------|-------------|
| `base32.StdEncoding.EncodeToString(src []byte) string` | Codifica a string |
| `base32.StdEncoding.Encode(dst, src []byte)` | Codifica escribiendo en `dst` |
| `base32.StdEncoding.EncodedLen(n int) int` | Longitud en bytes del resultado codificado |

## Decodificar

```go
decoded, _ := base32.StdEncoding.DecodeString("NBSWY3DP")

src := []byte("NBSWY3DP")
dst := make([]byte, base32.StdEncoding.DecodedLen(len(src)))
n, err := base32.StdEncoding.Decode(dst, src)
// dst[:n] = "hello"
```

| Método | Descripción |
|--------|-------------|
| `base32.StdEncoding.DecodeString(s string) ([]byte, error)` | Decodifica string |
| `base32.StdEncoding.Decode(dst, src []byte) (int, error)` | Decodifica a `dst`, devuelve bytes escritos |
| `base32.StdEncoding.DecodedLen(n int) int` | Longitud máxima del resultado decodificado |

---

## Esquemas

| Esquema | Alfabeto | Padding |
|---------|----------|---------|
| `StdEncoding` | A-Z 2-7 | `=` |
| `HexEncoding` | 0-9 A-V | `=` |

```go
base32.HexEncoding.EncodeToString(data)  // salida hexadecimal
```

---

## Encoder y Decoder (streaming)

Para flujos grandes sin cargar todo en memoria:

```go
// Encoder: bytes → base32 a un io.Writer
enc := base32.NewEncoder(base32.StdEncoding, os.Stdout)
enc.Write([]byte("hello"))
enc.Close()

// Decoder: base32 → bytes desde un io.Reader
dec := base32.NewDecoder(base32.StdEncoding, strings.NewReader("NBSWY3DP"))
data, _ := io.ReadAll(dec)
// data = []byte("hello")
```

| Función | Descripción |
|---------|------------|
| `NewEncoder(enc *Encoding, w io.Writer) io.WriteCloser` | Crea encoder streaming |
| `NewDecoder(enc *Encoding, r io.Reader) io.Reader` | Crea decoder streaming |

---

## Configuración avanzada

### WithPadding

```go
sinPad := base32.StdEncoding.WithPadding(base32.NoPadding)
sinPad.EncodeToString(data) // sin =

conPad := base32.StdEncoding.WithPadding('*')
```

| Constante / Método | Descripción |
|-------------------|------------|
| `base32.StdPadding` | (-1) |
| `base32.NoPadding` | (-1) |
| `enc.WithPadding(padding rune) *Encoding` | Crea encoding con padding personalizado |

### Strict — decodificación estricta (Go 1.17+)

```go
strict := base32.StdEncoding.Strict()
_, err := strict.DecodeString("NBSW Y3DP") // error: espacio no permitido
```

| Método | Descripción |
|--------|------------|
| `enc.Strict() *Encoding` | Rechaza caracteres no alfabéticos (Go 1.17+) |

### Encoding personalizado

```go
enc := base32.NewEncoding("abcdefghijklmnopqrstuvwxyz234567")
```

| Función | Descripción |
|---------|------------|
| `NewEncoding(alphabet string) *Encoding` | Crea encoding con alfabeto de 32 caracteres |

---

[← Volver al índice](/indice)
