# compress/flate — Compresión DEFLATE

Implementa el algoritmo DEFLATE (RFC 1951). Es la base de gzip y zlib.

```go
import "compress/flate"
```

---

## Comprimir

```go
var buf bytes.Buffer
w, _ := flate.NewWriter(&buf, flate.BestCompression)
w.Write([]byte("datos a comprimir"))
w.Close() // necesario para flush final

comprimido := buf.Bytes()
```

| Función | Descripción |
|---------|-------------|
| `flate.NewWriter(w io.Writer, level int)` | Crea un escritor con compresión DEFLATE |
| `flate.NewWriterDict(w io.Writer, level int, dict []byte)` | Comprime usando un diccionario predefinido |
| `w.Write(data)` | Escribe datos comprimidos |
| `w.Close()` | Flush final y cierre |
| `w.Flush()` | Flush parcial |

---

## Descomprimir

```go
r := flate.NewReader(bytes.NewReader(comprimido))
defer r.Close()

datos, _ := io.ReadAll(r)
fmt.Println(string(datos)) // "datos a comprimir"
```

| Función | Descripción |
|---------|-------------|
| `flate.NewReader(r io.Reader)` | Crea un lector que descomprime DEFLATE |
| `flate.NewReaderDict(r io.Reader, dict []byte)` | Descomprime con diccionario predefinido |
| `r.Close()` | Cierra el lector |

---

## Niveles de compresión

```go
flate.NewWriter(w, flate.NoCompression)      // 0 — sin comprimir
flate.NewWriter(w, flate.BestSpeed)           // 1 — más rápido
flate.NewWriter(w, flate.DefaultCompression)  // 6 — balance
flate.NewWriter(w, flate.BestCompression)     // 9 — más chico, más lento
flate.NewWriter(w, flate.HuffmanOnly)         // -2 — solo Huffman
```

| Nivel | Constante | Descripción |
|-------|-----------|-------------|
| 0 | `flate.NoCompression` | Sin comprimir |
| 1 | `flate.BestSpeed` | Más rápido |
| 6 | `flate.DefaultCompression` | Balance velocidad/compresión |
| 9 | `flate.BestCompression` | Mejor compresión (más lento) |
| -2 | `flate.HuffmanOnly` | Solo codificación Huffman |

También se pueden usar valores enteros del 0 al 9.

---

[← Volver al índice](/indice)
