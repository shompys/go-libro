# image/color — Tipos y modelos de color

Define los tipos básicos de color y sus modelos de conversión. Usado por `image`, `image/draw` y cualquier paquete que manipule imágenes.

```go
import "image/color"
```

---

## Índice

- [Interfaz Color](/estandard/image-color#interfaz-color)
- [Interfaz Model y modelos predefinidos](/estandard/image-color#interfaz-model)
- [Tipos de color concretos](/estandard/image-color#tipos-de-color-concretos)
- [Paleta](/estandard/image-color#paleta)
- [Funciones auxiliares](/estandard/image-color#funciones-auxiliares)

---

## Interfaz Color

```go
type Color interface {
    RGBA() (r, g, b, a uint32)
}
```

Todo color en Go implementa esta interfaz. Devuelve valores **pre-multiplicados por alpha** en el rango `[0, 65535]` (16 bits por canal), no de 0 a 255.

```go
c := color.RGBA{255, 128, 0, 255}
r, g, b, a := c.RGBA()
// r = 65535, g = 32896, b = 0, a = 65535
// (0xFF * 0x101 = 0xFFFF = 65535)
```

---

## Interfaz Model y modelos predefinidos

```go
type Model interface {
    Convert(c Color) Color
}
```

Un `Model` convierte cualquier color a su espacio de color (ej. RGB a escala de grises).

| Modelo | Descripción |
|--------|------------|
| `color.RGBAModel` | Convierte a `RGBA` (rango 0-255, no pre-multiplicado) |
| `color.RGBA64Model` | Convierte a `RGBA64` (0-65535) |
| `color.NRGBAModel` | Convierte a `NRGBA` (no pre-multiplicado) |
| `color.NRGBA64Model` | Convierte a `NRGBA64` |
| `color.AlphaModel` | Convierte a `Alpha` (solo canal alpha) |
| `color.Alpha16Model` | Convierte a `Alpha16` |
| `color.GrayModel` | Convierte a `Gray` (escala de grises) |
| `color.Gray16Model` | Convierte a `Gray16` |
| `color.CMYKModel` | Convierte a `CMYK` |
| `color.YCbCrModel` | Convierte a `YCbCr` (JPEG, luminancia + crominancia) |
| `color.NYCbCrAModel` | Convierte a `NYCbCrA` (YCbCr con alpha) |


```go
rojo := color.RGBA{255, 0, 0, 255}
gris := color.GrayModel.Convert(rojo)
// gris = color.Gray{Y: 76}  (0.299*R + 0.587*G + 0.114*B ≈ 76)
```

---

## Tipos de color concretos

### RGBA (alfa recto, no pre-multiplicado)

El tipo más común. Canales de 8 bits (0-255):

```go
type RGBA struct {
    R, G, B, A uint8
}
```

```go
c := color.RGBA{255, 0, 0, 128} // rojo semitransparente
r, g, b, a := c.RGBA()
// r = 32896 (128*257), g = 0, b = 0, a = 32896
```

### RGBA64

Igual que `RGBA` pero con 16 bits por canal (0-65535):

```go
type RGBA64 struct {
    R, G, B, A uint16
}
```

### NRGBA (alfa recto, no pre-multiplicado)

La diferencia con RGBA es semántica: los valores R, G, B **no** están pre-multiplicados por A:

```go
type NRGBA struct {
    R, G, B, A uint8
}
```

| Tipo | Pre-multiplicado | Rango | Canales |
|------|------------------|-------|---------|
| `RGBA` | No | 0-255 | R, G, B, A |
| `RGBA64` | No | 0-65535 | R, G, B, A |
| `NRGBA` | No | 0-255 | R, G, B, A |
| `NRGBA64` | No | 0-65535 | R, G, B, A |
| `Alpha` | N/A | 0-255 | A |
| `Alpha16` | N/A | 0-65535 | A |
| `Gray` | N/A | 0-255 | Y (luminancia) |
| `Gray16` | N/A | 0-65535 | Y |
| `CMYK` | N/A | 0-255 | C, M, Y, K |

### Gray y Gray16

Escala de grises. El valor `Y` es la luminancia:

```go
type Gray struct {
    Y uint8
}
```

### Alpha y Alpha16

Solo canal alpha (máscara de opacidad):

```go
type Alpha struct {
    A uint8
}
```

### CMYK

Cyan, Magenta, Yellow, Key (negro) para impresión:

```go
type CMYK struct {
    C, M, Y, K uint8
}
```

### Transparent y Opaque (sólidos)

```go
color.Transparent // &Alpha{0}   — completamente transparente
color.Opaque      // &Alpha{255}  — completamente opaco
color.Black       // &Gray{0}
color.White       // &Gray{255}
```

---

## Paleta

Una paleta es un slice de colores:

```go
type Palette []Color
```

| Método | Descripción |
|--------|------------|
| `Convert(c Color) Color` | Devuelve el color más cercano de la paleta |
| `Index(c Color) int` | Devuelve el índice del color más cercano |

```go
paleta := color.Palette{
    color.RGBA{255, 0, 0, 255},     // rojo
    color.RGBA{0, 255, 0, 255},     // verde
    color.RGBA{0, 0, 255, 255},     // azul
}

cercano := paleta.Convert(color.RGBA{200, 20, 10, 255})
idx := paleta.Index(color.RGBA{200, 20, 10, 255})
// idx = 0, cercano = rojo
```

---

## Funciones auxiliares

`YCbCrToRGB` convierte de YCbCr (JPEG) a RGB:

```go
func YCbCrToRGB(y, cb, cr uint8) (uint8, uint8, uint8)
```

`RGBToYCbCr` convierte de RGB a YCbCr:

```go
func RGBToYCbCr(r, g, b uint8) (uint8, uint8, uint8)
```

`NRGBAToYCbCr` convierte de NRGBA a YCbCr (usado en codificación JPEG interna).

---

[← Volver al índice](/indice)
