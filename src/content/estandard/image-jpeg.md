# image/jpeg — Leer y escribir imágenes JPEG

Decodifica y codifica imágenes en formato JPEG. Soporta control de calidad para la codificación.

```go
import "image/jpeg"
```

---

## Índice

- [Decode](/estandard/image-jpeg#decode-leer-jpeg)
- [DecodeConfig](/estandard/image-jpeg#decodeconfig-solo-metadatos)
- [Encode](/estandard/image-jpeg#encode-escribir-jpeg)
- [Opciones de calidad](/estandard/image-jpeg#opciones-de-calidad-options)
- [Ejemplo completo](/estandard/image-jpeg#ejemplo-completo)

---

## Decode (leer JPEG)

Lee una imagen JPEG desde un `io.Reader`.

```go
f, _ := os.Open("foto.jpg")
defer f.Close()

img, err := jpeg.Decode(f)
// img suele ser *image.YCbCr
```

| Función | Devuelve |
|---------|----------|
| `jpeg.Decode(r io.Reader)` | `(image.Image, error)` |

El tipo concreto de `img` para JPEG es generalmente `*image.YCbCr`.

---

## DecodeConfig (solo metadatos)

Obtiene dimensiones y modelo de color sin decodificar los píxeles.

```go
f, _ := os.Open("foto.jpg")
defer f.Close()

config, _ := jpeg.DecodeConfig(f)
fmt.Println(config.Width, config.Height)
```

| Función | Devuelve |
|---------|----------|
| `jpeg.DecodeConfig(r io.Reader)` | `(image.Config, error)` |

---

## Encode (escribir JPEG)

Escribe una imagen en formato JPEG.

```go
f, _ := os.Create("salida.jpg")
defer f.Close()

err := jpeg.Encode(f, img, nil) // calidad por defecto (75)
```

| Función | Devuelve |
|---------|----------|
| `jpeg.Encode(w io.Writer, m image.Image, o *jpeg.Options)` | `error` |

Si `o` es `nil`, se usa `jpeg.DefaultQuality` (75).

---

## Opciones de calidad

```go
opts := &jpeg.Options{Quality: 90}

f, _ := os.Create("alta_calidad.jpg")
defer f.Close()

jpeg.Encode(f, img, opts)
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Options.Quality` | `int` | Calidad de 1 a 100 (inclusive). Mayor = mejor calidad, más tamaño |

| Constante | Valor |
|-----------|-------|
| `jpeg.DefaultQuality` | `75` |

**Calidades comunes:**

| Valor | Resultado |
|-------|-----------|
| `1` | Máxima compresión, peor calidad |
| `50` | Muy comprimido, artefactos visibles |
| `75` | Default, buen equilibrio |
| `90` | Alta calidad |
| `100` | Máxima calidad, mayor tamaño |

---

## Ejemplo completo

Abrir un PNG, guardarlo como JPEG:

```go
f, _ := os.Open("entrada.png")
img, _ := png.Decode(f)
f.Close()

out, _ := os.Create("salida.jpg")
defer out.Close()

jpeg.Encode(out, img, &jpeg.Options{Quality: 85})
```

---

[← Volver al índice](/indice)
