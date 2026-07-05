# encoding/base64 — Codificar y decodificar Base64

Convierte datos binarios a texto (y viceversa) usando el esquema Base64.

```go
import "encoding/base64"
```

---

## Índice

- [Codificar](/estandard/encoding-base64#codificar)
- [Decodificar](/estandard/encoding-base64#decodificar)
- [Esquemas de encoding](/estandard/encoding-base64#esquemas-de-encoding)
- [Encoder y Decoder (streaming)](/estandard/encoding-base64#encoder-y-decoder-streaming)
- [Configuración avanzada](/estandard/encoding-base64#configuración-avanzada)

---

## Codificar

```go
data := []byte("Hola, mundo")
encoded := base64.StdEncoding.EncodeToString(data)
// "SG9sYSwgbXVuZG8="
```

| Método | Descripción |
|--------|-------------|
| `base64.StdEncoding.EncodeToString(src []byte) string` | Codifica a string |
| `base64.StdEncoding.Encode(dst, src []byte)` | Codifica escribiendo en `dst` |
| `base64.StdEncoding.EncodedLen(n int) int` | Longitud en bytes del resultado codificado |

## Decodificar

```go
decoded, err := base64.StdEncoding.DecodeString("SG9sYSwgbXVuZG8=")
// []byte("Hola, mundo")

src := []byte("SG9sYSwgbXVuZG8=")
dst := make([]byte, base64.StdEncoding.DecodedLen(len(src)))
n, err := base64.StdEncoding.Decode(dst, src)
// dst[:n] = "Hola, mundo"
```

| Método | Descripción |
|--------|-------------|
| `base64.StdEncoding.DecodeString(s string) ([]byte, error)` | Decodifica string |
| `base64.StdEncoding.Decode(dst, src []byte) (int, error)` | Decodifica a `dst`, devuelve bytes escritos |
| `base64.StdEncoding.DecodedLen(n int) int` | Longitud máxima del resultado decodificado |

---

## Esquemas de encoding

| Esquema | Alfabeto | Padding |
|---------|----------|---------|
| `StdEncoding` | `A-Z a-z 0-9 + /` | `=` |
| `URLEncoding` | `A-Z a-z 0-9 - _` | `=` |
| `RawStdEncoding` | `A-Z a-z 0-9 + /` | Sin padding |
| `RawURLEncoding` | `A-Z a-z 0-9 - _` | Sin padding |

```go
// Para URLs (sin + ni /)
base64.URLEncoding.EncodeToString(data)
base64.RawURLEncoding.EncodeToString(data)  // sin =
```

---

## Encoder y Decoder (streaming)

Para codificar/decodificar flujos grandes sin cargar todo en memoria:

```go
// Encoder: convierte bytes → base64 escribiendo a un io.Writer
enc := base64.NewEncoder(base64.StdEncoding, os.Stdout)
enc.Write([]byte("Hola, mundo"))
enc.Close() // escribe el padding final

// Decoder: convierte base64 → bytes leyendo de un io.Reader
dec := base64.NewDecoder(base64.StdEncoding, strings.NewReader("SG9sYSwgbXVuZG8="))
data, _ := io.ReadAll(dec)
// data = []byte("Hola, mundo")
```

| Función | Descripción |
|---------|------------|
| `NewEncoder(enc *Encoding, w io.Writer) io.WriteCloser` | Crea un encoder que escribe a `w` |
| `NewDecoder(enc *Encoding, r io.Reader) io.Reader` | Crea un decoder que lee de `r` |

> **Importante:** Siempre cerrá el `Encoder` (`enc.Close()`) para escribir el padding.

---

## Configuración avanzada

### WithPadding — personalizar el padding

```go
// Usar NoPadding (sin =)
enc := base64.StdEncoding.WithPadding(base64.NoPadding)
enc.EncodeToString(data) // sin == al final

// Padding personalizado (ej. con '*')
enc := base64.StdEncoding.WithPadding('*')
```

| Constante / Método | Descripción |
|-------------------|------------|
| `base64.StdPadding` | Valor de padding estándar (`=`, -1 en rune) |
| `base64.NoPadding` | Sin padding (`-1` en rune) |
| `enc.WithPadding(padding rune) *Encoding` | Devuelve un encoding con el padding especificado |

### Strict — decodificación estricta (Go 1.17+)

Por defecto, la decodificación ignora saltos de línea y caracteres inesperados. `Strict()` exige que la entrada sea exactamente base64 válido:

```go
strict := base64.StdEncoding.Strict()
_, err := strict.DecodeString("SG9sYSwgb\nXVuZG8=") // error: newline no permitido
```

| Método | Descripción |
|--------|------------|
| `enc.Strict() *Encoding` | Crea un encoding que rechaza caracteres fuera del alfabeto y padding incorrecto (Go 1.17+) |

### Encoding personalizado

Creá tu propio alfabeto:

```go
enc := base64.NewEncoding("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")
// Útil para protocolos con alfabeto custom
```

| Función | Descripción |
|---------|------------|
| `NewEncoding(alphabet string) *Encoding` | Crea un encoding con alfabeto de 64 caracteres |

---

[← Volver al índice](/indice)
