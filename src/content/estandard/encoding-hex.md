# encoding/hex — Codificación y decodificación hexadecimal

Convierte datos binarios a texto hexadecimal (base 16) y viceversa.

```go
import "encoding/hex"
```

---

## Índice

- [Codificar](/estandard/encoding-hex#codificar)
- [Decodificar](/estandard/encoding-hex#decodificar)
- [Encoder y Decoder (streaming)](/estandard/encoding-hex#encoder-y-decoder-streaming)
- [AppendEncode y AppendDecode (Go 1.20+)](/estandard/encoding-hex#appendencode-y-appenddecode)
- [Dumper (volcado con formato)](/estandard/encoding-hex#dumper)
- [Errores](/estandard/encoding-hex#errores)

---

## Codificar

```go
src := []byte("Hola, mundo")
dst := make([]byte, hex.EncodedLen(len(src)))
hex.Encode(dst, src)
// dst = []byte("486f6c612c206d756e646f")

// O directo a string:
encoded := hex.EncodeToString(src)
// "486f6c612c206d756e646f"
```

| Función | Descripción |
|---------|------------|
| `Encode(dst, src []byte) int` | Codifica `src` en `dst`, devuelve bytes escritos |
| `EncodeToString(src []byte) string` | Codifica y devuelve string directamente |
| `EncodedLen(n int) int` | Calcula longitud necesaria en `dst` (`n * 2`) |

---

## Decodificar

```go
encoded := "486f6c612c206d756e646f"
decoded, err := hex.DecodeString(encoded)
if err != nil {
    log.Fatal(err)
}
// decoded = []byte("Hola, mundo")

// O desde []byte:
src := []byte("486f6c612c206d756e646f")
dst := make([]byte, hex.DecodedLen(len(src)))
n, err := hex.Decode(dst, src)
// n = 11, dst[:n] = "Hola, mundo"
```

| Función | Descripción |
|---------|------------|
| `Decode(dst, src []byte) (int, error)` | Decodifica `src` en `dst` |
| `DecodeString(s string) ([]byte, error)` | Decodifica string a bytes |
| `DecodedLen(n int) int` | Calcula longitud máxima decodificada (`n / 2`) |

---

## Encoder y Decoder (streaming)

Para codificar/decodificar flujos grandes sin cargar todo en memoria:

```go
// Encoder: escribe bytes como hex a un io.Writer
encoder := hex.NewEncoder(os.Stdout)
encoder.Write([]byte("streaming hex"))
// Salida: "73747265616d696e6720686578"

// Decoder: lee hex de un io.Reader y devuelve bytes
decoder := hex.NewDecoder(strings.NewReader("486f6c61"))
data, _ := io.ReadAll(decoder)
// data = []byte("Hola")
```

| Constructor | Descripción |
|-------------|------------|
| `NewEncoder(w io.Writer) io.WriteCloser` | Crea un encoder que escribe a `w` |
| `NewDecoder(r io.Reader) io.Reader` | Crea un decoder que lee de `r` |

---

## Dumper

`Dumper` produce el clásico volcado hex + ASCII (como `hexdump -C`):

```go
lines := []byte("Go es rápido")
dumper := hex.Dumper(os.Stdout)
dumper.Write(lines)
dumper.Close()
// Salida:
// 00000000  47 6f 20 65 73 20 72 c3  a1 70 69 64 6f           |Go es r..pido|
```

| Función | Descripción |
|---------|------------|
| `Dumper(w io.Writer) io.WriteCloser` | Crea dumper con formato clásico |

---

## AppendEncode y AppendDecode (Go 1.20+)

Variantes más eficientes que evitan crear buffers intermedios. Agregan los datos codificados/decodificados a un slice existente:

```go
src := []byte("Hola")
dst := hex.AppendEncode(nil, src)       // dst = []byte("486f6c61")
dst = hex.AppendEncode(dst, []byte(" mundo")) // dst = []byte("486f6c61206d756e646f")

// Decodificar también:
result, err := hex.AppendDecode(nil, []byte("486f6c61"))
// result = []byte("Hola")
```

| Función | Descripción |
|---------|------------|
| `AppendEncode(dst, src []byte) []byte` | Codifica y agrega a `dst` |
| `AppendDecode(dst, src []byte) ([]byte, error)` | Decodifica y agrega a `dst` |

---

## Errores

| Error | Descripción |
|-------|------------|
| `hex.ErrLength` | Error cuando la entrada tiene longitud impar (debe ser par) |
| `hex.InvalidByteError(c byte)` | Error cuando un byte no es hexadecimal válido. Implementa `error` |

```go
_, err := hex.DecodeString("GG") // no es error, es hex válido
_, err = hex.DecodeString("XYZ") // hex.InvalidByteError('Z')

// InvalidByteError implementa error:
if e, ok := err.(hex.InvalidByteError); ok {
    fmt.Println("byte inválido:", byte(e))
}
```

---

[← Volver al índice](/indice)
