# image/png — Leer y escribir imágenes PNG

Decodifica (lee) y codifica (escribe) imágenes en formato PNG. Soporta PNGs con canal alpha (transparencia).

```go
import "image/png"
```

---

## Índice

- [Decode](/estandard/image-png#decode-leer-png)
- [DecodeConfig](/estandard/image-png#decodeconfig-solo-metadatos)
- [Encode](/estandard/image-png#encode-escribir-png)
- [Encoder con nivel de compresión](/estandard/image-png#encoder-con-nivel-de-compresión)
- [Niveles de compresión](/estandard/image-png#niveles-de-compresión)

---

## Decode (leer PNG)

Lee una imagen PNG desde un `io.Reader` y devuelve un `image.Image`.

```go
f, _ := os.Open("imagen.png")
defer f.Close()

img, err := png.Decode(f)
if err != nil {
    log.Fatal(err)
}
// img es un image.Image (generalmente *image.NRGBA o *image.RGBA)
```

| Función | Devuelve |
|---------|----------|
| `png.Decode(r io.Reader)` | `(image.Image, error)` |

**Nota:** Si el PNG tiene transparencia, el tipo concreto suele ser `*image.NRGBA`. Si no tiene, `*image.RGBA`.

---

## DecodeConfig (solo metadatos)

Obtiene ancho, alto y modelo de color sin decodificar los píxeles. Más rápido y consume menos memoria.

```go
f, _ := os.Open("imagen.png")
defer f.Close()

config, err := png.DecodeConfig(f)
fmt.Println(config.Width, config.Height) // 1920 1080
```

| Función | Devuelve |
|---------|----------|
| `png.DecodeConfig(r io.Reader)` | `(image.Config, error)` |

---

## Encode (escribir PNG)

Escribe una imagen en formato PNG a un `io.Writer`.

```go
f, _ := os.Create("salida.png")
defer f.Close()

err := png.Encode(f, img)
```

| Función | Devuelve |
|---------|----------|
| `png.Encode(w io.Writer, m image.Image)` | `error` |

El `image.Image` puede ser cualquier tipo de imagen de Go: `*image.RGBA`, `*image.NRGBA`, `*image.Gray`, etc.

---

## Encoder con nivel de compresión

El `png.Encoder` permite controlar el nivel de compresión.

```go
var enc png.Encoder
enc.CompressionLevel = png.BestCompression

f, _ := os.Create("comprimido.png")
defer f.Close()

err := enc.Encode(f, img)
```

| Campo del Encoder | Tipo | Descripción |
|-------------------|------|-------------|
| `CompressionLevel` | `png.CompressionLevel` | Nivel de compresión zlib |

---

## Niveles de compresión

```go
png.DefaultCompression // valor por defecto (-1)
png.NoCompression      // sin comprimir (0)
png.BestSpeed          // velocidad máxima (1)
png.BestCompression    // máxima compresión (9)
```

| Constante | Valor | Significado |
|-----------|-------|-------------|
| `png.DefaultCompression` | `-1` | Compresión por defecto |
| `png.NoCompression` | `0` | Sin compresión |
| `png.BestSpeed` | `1` | Velocidad máxima, menor compresión |
| `png.BestCompression` | `9` | Máxima compresión, más lento |

---

[← Volver al índice](/indice)
