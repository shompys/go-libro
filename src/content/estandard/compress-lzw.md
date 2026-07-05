# compress/lzw — Compresión Lempel-Ziv-Welch

Compresión/descompresión LZW (usada en GIF, PDF, TIFF).

```go
import "compress/lzw"
```

---

## Comprimir

```go
var buf bytes.Buffer
w := lzw.NewWriter(&buf, lzw.LSB, 8)
w.Write([]byte("datos"))
w.Close()
```

| Parámetro de `NewWriter` | Valores |
|--------------------------|---------|
| Orden de bits | `lzw.LSB` (Least Significant Bit) o `lzw.MSB` (Most Significant) |
| Ancho literal | `8` (común para texto/bits) |

## Descomprimir

```go
r := lzw.NewReader(bytes.NewReader(compressedBuf), lzw.LSB, 8)
datos, _ := io.ReadAll(r)
```

---

[← Volver al índice](/indice)
