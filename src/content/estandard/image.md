# image — Tipos y funciones básicas para imágenes

Define interfaces y tipos fundamentales para representar imágenes en Go. Es la base sobre la que trabajan los decodificadores/decodificadores de formato (`image/png`, `image/jpeg`, `image/gif`).

```go
import "image"
```

---

## Índice

- [Interfaz Image](/estandard/image#interfaz-image)
- [Tipos de imagen concretos](/estandard/image#tipos-de-imagen-concretos)
- [Rectangle y Point](/estandard/image#rectangle-y-point)
- [Crear imágenes manualmente](/estandard/image#crear-imágenes-manualmente)
- [SubImage (recorte)](/estandard/image#subimage-recorte)
- [Decode y RegisterFormat](/estandard/image#decode-y-registerformat)

---

## Interfaz Image

```go
type Image interface {
    ColorModel() color.Model
    Bounds() Rectangle
    At(x, y int) color.Color
}
```

Toda imagen en Go satisface esta interfaz. Para mutar píxeles, los tipos concretos exponen métodos `Set`.

---

## Tipos de imagen concretos

| Tipo | Canales | Tamaño por píxel | Uso |
|------|---------|-------------------|-----|
| `image.Alpha` | Alpha (1 canal) | 1 byte | Máscaras de opacidad |
| `image.Alpha16` | Alpha 16-bit | 2 bytes | Opacidad de alta precisión |
| `image.Gray` | Gris (1 canal) | 1 byte | Escala de grises |
| `image.Gray16` | Gris 16-bit | 2 bytes | Escala de grises HD |
| `image.RGBA` | R, G, B, A | 4 bytes | Color estándar (no pre-multiplicado) |
| `image.RGBA64` | R, G, B, A 16-bit | 8 bytes | Color HD |
| `image.NRGBA` | R, G, B, A (no pre-multiplicado) | 4 bytes | Color con alpha lineal |
| `image.NRGBA64` | NRGBA 16-bit | 8 bytes | NRGBA HD |
| `image.CMYK` | C, M, Y, K | 4 bytes | Impresión |
| `image.Paletted` | Índice a paleta | 1 byte | GIF, PNG indexado |
| `image.Uniform` | Color sólido (infinito) | — | Fondo o relleno |

Cada tipo tiene esta estructura:

```go
type RGBA struct {
    Pix    []uint8       // píxeles en orden [R G B A R G B A ...]
    Stride int           // bytes por fila (ancho * 4, puede ser más)
    Rect   image.Rectangle // dimensiones
}
```

El desplazamiento de un píxel `(x, y)` es:
```
offset := (y-rect.Min.Y)*stride + (x-rect.Min.X)*4
// Pix[offset]   = R
// Pix[offset+1] = G
// Pix[offset+2] = B
// Pix[offset+3] = A
```

---

## Rectangle y Point

```go
type Point struct {
    X, Y int
}

type Rectangle struct {
    Min, Max Point
}
```

| Constructor | Descripción |
|-------------|------------|
| `image.Pt(x, y int) Point` | Crea un `Point` |
| `image.Rect(x0, y0, x1, y1 int) Rectangle` | Crea un rectángulo de `(x0,y0)` a `(x1,y1)` |

El rectángulo contiene todos los píxeles `(x, y)` donde `Min.X <= x < Max.X` y `Min.Y <= y < Max.Y`.

```go
r := image.Rect(0, 0, 100, 100)
r.Dx()  // 100 (ancho)
r.Dy()  // 100 (alto)
r.Size() // image.Pt(100, 100)
r.Empty() // false

p := image.Pt(50, 50)
p.In(r) // true (50 < 100 y 50 < 100)
```

| Método de Rectangle | Descripción |
|---------------------|-------------|
| `Dx() int` | Ancho (`Max.X - Min.X`) |
| `Dy() int` | Alto (`Max.Y - Min.Y`) |
| `Size() Point` | Dimensiones como `Point` |
| `Empty() bool` | `true` si no contiene píxeles |
| `Canon() Rectangle` | Versión canónica (Min <= Max) |
| `In(s Rectangle) bool` | `true` si `r` está completamente dentro de `s` |
| `Union(s Rectangle) Rectangle` | Rectángulo que contiene a ambos |
| `Intersect(s Rectangle) Rectangle` | Intersección de dos rectángulos |
| `Overlaps(s Rectangle) bool` | `true` si se superponen |
| `Add(p Point) Rectangle` | Desplaza el rectángulo por `p` |
| `Sub(p Point) Rectangle` | Desplaza en dirección opuesta |
| `Inset(n int) Rectangle` | Reduce el rectángulo `n` píxeles en cada borde |

---

## Crear imágenes manualmente

```go
// Crear RGBA de 200x100
img := image.NewRGBA(image.Rect(0, 0, 200, 100))

// Colorear un píxel rojo en (10, 20)
img.Set(10, 20, color.RGBA{255, 0, 0, 255})

// Dibujar una línea horizontal roja
for x := 0; x < 200; x++ {
    img.Set(x, 50, color.RGBA{255, 0, 0, 255})
}
```

| Constructor | Descripción |
|-------------|------------|
| `NewRGBA(r Rectangle) *RGBA` | Crea imagen RGBA |
| `NewRGBA64(r Rectangle) *RGBA64` | Crea imagen RGBA64 |
| `NewNRGBA(r Rectangle) *NRGBA` | Crea imagen NRGBA |
| `NewNRGBA64(r Rectangle) *NRGBA64` | Crea imagen NRGBA64 |
| `NewGray(r Rectangle) *Gray` | Crea imagen Gray |
| `NewGray16(r Rectangle) *Gray16` | Crea imagen Gray16 |
| `NewAlpha(r Rectangle) *Alpha` | Crea imagen Alpha |
| `NewAlpha16(r Rectangle) *Alpha16` | Crea imagen Alpha16 |
| `NewCMYK(r Rectangle) *CMYK` | Crea imagen CMYK |
| `NewPaletted(r Rectangle, p color.Palette) *Paletted` | Crea imagen con paleta |

---

## SubImage (recorte)

```go
img := image.NewRGBA(image.Rect(0, 0, 200, 100))
sub := img.SubImage(image.Rect(10, 10, 50, 50)).(*image.RGBA)
// sub comparte el backing array con img
```

`SubImage` es útil para trabajar con regiones sin copiar datos.

---

## Decode y RegisterFormat

`image.Decode` decodifica una imagen de un `io.Reader`, detectando el formato automáticamente:

```go
import (
    "image"
    _ "image/jpeg"
    _ "image/png"
)

f, _ := os.Open("foto.jpg")
img, format, err := image.Decode(f)
// img = *image.YCbCr (para JPEG)
// format = "jpeg"
```

| Función | Descripción |
|---------|------------|
| `Decode(r io.Reader) (Image, string, error)` | Decodifica imagen, devuelve tipo y formato |
| `DecodeConfig(r io.Reader) (Config, string, error)` | Solo lee metadatos (ancho, alto, modelo) |
| `RegisterFormat(name, magic string, decode func(io.Reader) (Image, error), decodeConfig func(io.Reader) (Config, error))` | Registra un formato personalizado |

```go
f, _ := os.Open("foto.jpg")
conf, format, _ := image.DecodeConfig(f)
fmt.Println(conf.Width, conf.Height, format)
// 1920 1080 jpeg
```

`Config` contiene solo metadatos, no píxeles:

```go
type Config struct {
    ColorModel color.Model
    Width      int
    Height     int
}
```

---

## YCbCr y NYCbCrA

Tipos especiales para imágenes JPEG (YCbCr) y formatos con submuestreo de color:

```go
type YCbCr struct {
    Y, Cb, Cr      []uint8
    YStride        int
    CStride        int
    SubsampleRatio YCbCrSubsampleRatio
    Rect           Rectangle
}
```

| Campo | Descripción |
|-------|-------------|
| `Y` | Luminancia (brillo), un byte por píxel |
| `Cb`, `Cr` | Crominancia (color), resolución reducida según `SubsampleRatio` |
| `SubsampleRatio` | `YCbCrSubsampleRatio444` (máxima calidad), `422`, `420`, `440` (más compresión) |

`image.NewYCbCr(r, ratio)` crea una imagen YCbCr vacía.

```go
type NYCbCrA struct {
    YCbCr
    A       []uint8  // canal alpha adicional
    AStride int
}
```

`image.NewNYCbCrA(r, ratio)` crea una imagen NYCbCrA con canal alpha.

---

[← Volver al índice](/indice)
