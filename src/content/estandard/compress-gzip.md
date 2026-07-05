# compress/gzip — Comprimir y descomprimir GZip

```go
import "compress/gzip"
```

---

## Comprimir

```go
var buf bytes.Buffer
w := gzip.NewWriter(&buf)
w.Write([]byte("datos a comprimir"))
w.Close()  // necesario para flush final

comprimido := buf.Bytes()
```

## Descomprimir

```go
r, err := gzip.NewReader(bytes.NewReader(comprimido))
defer r.Close()

datos, _ := io.ReadAll(r)
// "datos a comprimir"
```

---

## Comprimir a archivo

```go
f, _ := os.Create("datos.gz")
w := gzip.NewWriter(f)
w.Name = "datos.txt"     // nombre del archivo original (metadato)
w.ModTime = time.Now()   // fecha (metadato)
w.Write([]byte("contenido"))
w.Close()
f.Close()
```

## Descomprimir de archivo

```go
f, _ := os.Open("datos.gz")
r, _ := gzip.NewReader(f)
defer r.Close()

contenido, _ := io.ReadAll(r)
fmt.Println(r.Name)  // "datos.txt" (nombre original)
```

---

## Niveles de compresión

```go
w, _ := gzip.NewWriterLevel(f, gzip.BestCompression)  // más lento, más chico
w, _ := gzip.NewWriterLevel(f, gzip.BestSpeed)        // más rápido, más grande
```

| Nivel | Significado |
|-------|-------------|
| `gzip.NoCompression` | Sin comprimir (0) |
| `gzip.BestSpeed` | Más rápido (1) |
| `gzip.BestCompression` | Mejor compresión (9) |
| `gzip.DefaultCompression` | Balance (-1, por defecto) |

---

[← Volver al índice](/indice)
