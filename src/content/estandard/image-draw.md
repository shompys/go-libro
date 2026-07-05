# image/draw — Composición y dibujado de imágenes

Operaciones de dibujo sobre imágenes Go: copiar regiones, aplicar máscaras, fundir con alpha. Usa la interfaz `draw.Image` para imágenes mutables.

```go
import "image/draw"
```

---

## Índice

- [Interfaz draw.Image](/estandard/image-draw#interfaz-drawimage)
- [Draw (dibujar básico)](/estandard/image-draw#draw-dibujar-básico)
- [DrawMask (dibujar con máscara)](/estandard/image-draw#drawmask-dibujar-con-máscara)
- [Op (operadores de composición)](/estandard/image-draw#op-operadores-de-composición)
- [Quantizer (cuantizar colores)](/estandard/image-draw#quantizer)
- [Ejemplo práctico](/estandard/image-draw#ejemplo-práctico)

---

## Interfaz draw.Image

Para que una imagen sea "dibujable" (destino de un `Draw`), debe implementar:

```go
type Image interface {
    image.Image
    Set(x, y int, c color.Color)
}
```

Todos los tipos mutables del paquete `image` la implementan: `*image.RGBA`, `*image.NRGBA`, `*image.Gray`, `*image.Paletted`, etc.

---

## Draw (dibujar básico)

Copia el contenido de `src` en `dst` dentro del rectángulo `r`, alineando los puntos `sp` (origen en `src`) y `r.Min` (destino).

```go
func Draw(dst Image, r image.Rectangle, src image.Image, sp image.Point, op Op)
```

| Parámetro | Descripción |
|-----------|-------------|
| `dst` | Imagen destino (mutable) |
| `r` | Rectángulo en `dst` donde dibujar |
| `src` | Imagen origen |
| `sp` | Punto en `src` que se alinea con `r.Min` |
| `op` | Operador de composición (típicamente `draw.Over`) |

```go
import (
    "image"
    "image/color"
    "image/draw"
)

// Crear destino (fondo blanco 200x200)
dst := image.NewRGBA(image.Rect(0, 0, 200, 200))
draw.Draw(dst, dst.Bounds(), &image.Uniform{color.White}, image.Point{}, draw.Src)

// Dibujar un rectángulo rojo 50x50 en la posición (20, 30)
rojo := image.NewRGBA(image.Rect(0, 0, 50, 50))
draw.Draw(rojo, rojo.Bounds(), &image.Uniform{color.RGBA{255, 0, 0, 255}}, image.Point{}, draw.Src)
draw.Draw(dst, image.Rect(20, 30, 70, 80), rojo, image.Point{}, draw.Over)
```

`draw.Src` es un atajo para `draw.Over` sin alpha (reemplaza píxeles, no mezcla). Útil para rellenos o fondos sólidos.

---

## DrawMask (dibujar con máscara)

Versión completa que acepta una máscara (imagen de opacidad). Solo se dibujan los píxeles donde la máscara tiene alpha > 0.

```go
func DrawMask(dst Image, r image.Rectangle, src image.Image, sp image.Point,
              mask image.Image, mp image.Point, op Op)
```

| Parámetro extra | Descripción |
|-----------------|-------------|
| `mask` | Máscara de opacidad (nil = sin máscara) |
| `mp` | Punto en `mask` que se alinea con `r.Min` |

```go
// Máscara circular de 50x50 (alpha 255 en el círculo, 0 fuera)
mascara := image.NewAlpha(image.Rect(0, 0, 50, 50))
// ... dibujar círculo en la máscara ...

// Dibujar la fuente SOLO donde la máscara tenga alpha > 0
draw.DrawMask(dst, image.Rect(20, 30, 70, 80),
              src, image.Point{},
              mascara, image.Point{},
              draw.Over)
```

Cuando `mask` es `nil`, `DrawMask` se comporta exactamente como `Draw`.

---

## Op (operadores de composición)

| Operador | Descripción |
|----------|-------------|
| `draw.Over` | Mezcla `src` sobre `dst` usando el alpha de `src` (Porter-Duff over) |
| `draw.Src` | Reemplaza `dst` con `src` (sin mezcla) |

```go
// Over: el rojo semitransparente se mezcla con lo que haya debajo
c := color.RGBA{255, 0, 0, 128}
draw.Draw(dst, r, &image.Uniform{c}, image.Point{}, draw.Over)
// El resultado es una mezcla rojo + color de fondo

// Src: el color se copia exactamente (incluyendo alpha)
draw.Draw(dst, r, &image.Uniform{c}, image.Point{}, draw.Src)
// El destino queda con RGBA{255, 0, 0, 128}
```

**Regla general:**
- Usá `draw.Src` para rellenar fondos o cuando `src` cubre todo `r`.
- Usá `draw.Over` para composiciones (superponer imágenes, sprites, etc.).

---

## Quantizer

Interfaz para cuantizar colores (reducir una paleta):

```go
type Quantizer interface {
    Quantize(p color.Palette, m image.Image) color.Palette
}
```

Se usa con `image.Paletted`. Los paquetes `image/gif`, `image/png` lo usan internamente. Para la mayoría de usos, no necesitás llamarlo directamente.

---

## Ejemplo práctico

Componer un logo con fondo y texto:

```go
package main

import (
    "image"
    "image/color"
    "image/draw"
    "image/png"
    "os"
)

func main() {
    // Fondo blanco 400x200
    dst := image.NewRGBA(image.Rect(0, 0, 400, 200))
    draw.Draw(dst, dst.Bounds(),
        &image.Uniform{color.White}, image.Point{}, draw.Src)

    // Cargar logo
    f, _ := os.Open("logo.png")
    logo, _, _ := image.Decode(f)
    f.Close()

    // Dibujar logo centrado en el fondo
    logoRect := logo.Bounds()
    x := (400 - logoRect.Dx()) / 2
    y := (200 - logoRect.Dy()) / 2
    draw.Draw(dst,
        image.Rect(x, y, x+logoRect.Dx(), y+logoRect.Dy()),
        logo, image.Point{}, draw.Over)

    // Guardar resultado
    out, _ := os.Create("output.png")
    png.Encode(out, dst)
    out.Close()
}
```

---

## Interfaz Drawer

Define cómo dibujar sobre una imagen (con posible dithering):

```go
type Drawer interface {
    Draw(dst Image, r image.Rectangle, src image.Image, sp image.Point)
}
```

| Drawer | Descripción |
|--------|-------------|
| `draw.FloydSteinberg` | Dithering Floyd-Steinberg (usado por `image/gif`) |

---

[← Volver al índice](/indice)
