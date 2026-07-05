# compress/zlib — Compresión en formato zlib

Wrapper DEFLATE con cabecera y checksum según RFC 1950. Por debajo usa [compress/flate](/compress-flate).

```go
import "compress/zlib"
```

---

## Comprimir

```go
var buf bytes.Buffer
w := zlib.NewWriter(&buf)
w.Write([]byte("datos a comprimir"))
w.Close() // necesario para escribir el checksum

comprimido := buf.Bytes()
```

```go
// Con nivel de compresión
w, _ := zlib.NewWriterLevel(&buf, zlib.BestCompression)
```

| Función | Descripción |
|---------|-------------|
| `zlib.NewWriter(w io.Writer)` | Crea escritor zlib (compresión por defecto) |
| `zlib.NewWriterLevel(w io.Writer, level int)` | Crea escritor con nivel específico |
| `zlib.NewWriterLevelDict(w io.Writer, level int, dict []byte)` | Con diccionario predefinido |
| `w.Write(data)` | Escribe datos comprimidos |
| `w.Close()` | Flush final + checksum |
| `w.Flush()` | Flush parcial |

---

## Descomprimir

```go
r, _ := zlib.NewReader(bytes.NewReader(comprimido))
defer r.Close()

datos, _ := io.ReadAll(r)
fmt.Println(string(datos)) // "datos a comprimir"
```

```go
// Con diccionario (si se usó al comprimir)
r, _ := zlib.NewReaderDict(bytes.NewReader(comprimido), dict)
```

| Función | Descripción |
|---------|-------------|
| `zlib.NewReader(r io.Reader)` | Crea lector que descomprime zlib |
| `zlib.NewReaderDict(r io.Reader, dict []byte)` | Con diccionario predefinido |
| `r.Close()` | Cierra el lector |

---

## Niveles de compresión

| Nivel | Constante |
|-------|-----------|
| 0 | `zlib.NoCompression` |
| 1 | `zlib.BestSpeed` |
| 6 | `zlib.DefaultCompression` |
| 9 | `zlib.BestCompression` |
| -2 | `zlib.HuffmanOnly` |

---

## Diferencia con flate y gzip

| Formato | Cabecera | Checksum | RFC |
|---------|----------|----------|-----|
| `compress/flate` | Sin cabecera | Sin checksum | 1951 |
| `compress/zlib` | 2 bytes cabecera | Adler-32 | 1950 |
| `compress/gzip` | Cabecera completa + metadatos | CRC-32 | 1952 |

---

[← Volver al índice](/indice)
