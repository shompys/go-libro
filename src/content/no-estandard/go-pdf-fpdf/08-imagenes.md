# Imágenes

## `pdf.Image(imageName, x, y, w, h, flow, tp, link, linkStr)`

Inserta una imagen en el PDF.

```go
pdf.Image("logo.png", 10, 10, 40, 0, false, "", 0, "")
```

| Parámetro | Tipo | Qué es |
|-----------|------|--------|
| `imageName` | `string` | Ruta al archivo de imagen |
| `x` | `float64` | Coordenada X de la esquina superior izquierda |
| `y` | `float64` | Coordenada Y |
| `w` | `float64` | Ancho de la imagen. Si es `0`, se calcula automáticamente |
| `h` | `float64` | Alto de la imagen. Si es `0`, se calcula automáticamente |
| `flow` | `bool` | Si es `true`, ajusta el cursor después de insertar |
| `tp` | `string` | Tipo de imagen: `""` (autodetectar), `"JPG"`, `"PNG"`, `"GIF"` |
| `link` | `int` | ID de link interno (`0` = ninguno) |
| `linkStr` | `string` | URL externa (`""` = ninguna) |

**Tip:** si ponés `w=0` y `h=0`, la imagen se inserta a su tamaño original.

**Tip:** si ponés `w=40` y `h=0`, la altura se calcula proporcionalmente para mantener la relación de aspecto.

## `pdf.ImageOptions(imageName, x, y, w, h, flow, options, link, linkStr)`

Igual que `Image()` pero con opciones avanzadas.

```go
pdf.ImageOptions("logo.png", 10, 10, 40, 0, false, fpdf.ImageOptions{
    ImageType: "PNG",
    ReadDpi:   false,
}, 0, "")
```

El tipo `ImageOptions` tiene estos campos:

| Campo | Tipo | Qué hace |
|-------|------|----------|
| `ImageType` | `string` | Fuerza el tipo: `"JPG"`, `"PNG"`, `"GIF"` |
| `ReadDpi` | `bool` | Si usa el DPI de la imagen o el del documento |

## Formatos soportados

| Formato | Soportado |
|---------|-----------|
| JPEG / JPG | Sí |
| PNG | Sí |
| GIF | Sí (solo primer frame) |
| TIFF | Sí |
| SVG | Sí (básico, solo paths) |

## Registrar imagen en memoria

Para usar una imagen desde bytes (sin guardarla en disco):

```go
pdf.RegisterImageReader("logo", "PNG", bytes.NewReader(imageBytes))
// ... después:
pdf.Image("logo", 10, 10, 40, 0, false, "", 0, "")
```

| Método | Para qué |
|--------|----------|
| `RegisterImageReader(name, type, reader)` | Registra desde `io.Reader` |
| `RegisterImageOptionsReader(name, options, reader)` | Ídem con opciones |
| `RegisterImage(file, type)` | Registra desde archivo (precarga) |

## Obtener info de una imagen

```go
info := pdf.GetImageInfo("logo.png")
info.Width()   // ancho en puntos
info.Height()  // alto en puntos
```

---

[← Volver al índice](/no-estandard/go-pdf-fpdf)
