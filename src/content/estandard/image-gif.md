# image/gif — Leer y escribir imágenes GIF (incluye animaciones)

Decodifica y codifica imágenes GIF. Soporta GIFs estáticos y animados.

```go
import "image/gif"
```

---

## Índice

- [Decode](/estandard/image-gif#decode-leer-primer-frame)
- [DecodeConfig](/estandard/image-gif#decodeconfig-metadatos-del-primer-frame)
- [DecodeAll](/estandard/image-gif#decodeall-leer-animación-completa)
- [Encode](/estandard/image-gif#encode-escribir-gif-estático)
- [EncodeAll](/estandard/image-gif#encodeall-escribir-gif-animado)
- [Estructura GIF](/estandard/image-gif#estructura-gif)
- [Opciones de codificación](/estandard/image-gif#opciones-de-codificación)

---

## Decode (leer primer frame)

Lee solo el primer frame de un GIF.

```go
f, _ := os.Open("imagen.gif")
defer f.Close()

img, err := gif.Decode(f)
// img es el primer frame (generalmente *image.Paletted)
```

| Función | Devuelve |
|---------|----------|
| `gif.Decode(r io.Reader)` | `(image.Image, error)` |

---

## DecodeConfig (metadatos del primer frame)

```go
f, _ := os.Open("imagen.gif")
defer f.Close()

config, _ := gif.DecodeConfig(f)
fmt.Println(config.Width, config.Height)
```

| Función | Devuelve |
|---------|----------|
| `gif.DecodeConfig(r io.Reader)` | `(image.Config, error)` |

---

## DecodeAll (leer animación completa)

Lee todos los frames de un GIF animado.

```go
f, _ := os.Open("animacion.gif")
defer f.Close()

anim, err := gif.DecodeAll(f)
fmt.Println("Frames:", len(anim.Image))
fmt.Println("Loop:", anim.LoopCount)
```

| Función | Devuelve |
|---------|----------|
| `gif.DecodeAll(r io.Reader)` | `(*gif.GIF, error)` |

---

## Encode (escribir GIF estático)

Codifica una sola imagen como GIF.

```go
f, _ := os.Create("salida.gif")
defer f.Close()

err := gif.Encode(f, img, nil)
```

| Función | Devuelve |
|---------|----------|
| `gif.Encode(w io.Writer, m image.Image, o *gif.Options)` | `error` |

**Nota:** El GIF usa una paleta de colores (hasta 256). Si tu imagen es RGBA, tenés que usar opciones con un `Quantizer` o convertirla a `*image.Paletted` primero.

---

## EncodeAll (escribir GIF animado)

Codifica una secuencia de frames como GIF animado.

```go
anim := &gif.GIF{
    Image:     []*image.Paletted{frame1, frame2, frame3},
    Delay:     []int{100, 100, 100}, // centésimas de segundo
    LoopCount: 0,                     // 0 = loop infinito
}

f, _ := os.Create("animacion.gif")
defer f.Close()

gif.EncodeAll(f, anim)
```

| Función | Devuelve |
|---------|----------|
| `gif.EncodeAll(w io.Writer, g *gif.GIF)` | `error` |

---

## Estructura GIF

```go
type GIF struct {
    Image           []*image.Paletted // frames
    Delay           []int             // delay por frame (en 1/100 s)
    LoopCount       int               // 0 = infinito, -1 = sin loop
    Disposal        []byte            // qué hacer con cada frame después de mostrarlo
    Config          image.Config      // ancho y alto global
    BackgroundIndex byte              // índice del color de fondo
}
```

| Campo | Significado |
|-------|-------------|
| `Image` | Slice con cada frame (deben ser `*image.Paletted`) |
| `Delay` | Tiempo de cada frame en centésimas de segundo (100 = 1s) |
| `LoopCount` | `0` = loop infinito, `-1` = no loop, `n` = repetir n veces |
| `Disposal` | `gif.DisposalNone` (0), `gif.DisposalBackground` (2), `gif.DisposalPrevious` (3) |
| `BackgroundIndex` | Índice del color de fondo en la paleta |

### Constantes Disposal

| Constante | Valor | Descripción |
|-----------|-------|-------------|
| `gif.DisposalNone` | `1` | No hacer nada (el frame se pinta sobre el anterior) |
| `gif.DisposalBackground` | `2` | Restaurar color de fondo antes del siguiente frame |
| `gif.DisposalPrevious` | `3` | Restaurar al frame anterior |

---

## Opciones de codificación

```go
type Options struct {
    NumColors int         // máx 256 colores en la paleta
    Quantizer draw.Quantizer // cuantizador de colores
    Drawer    draw.Drawer    // dibujante (para el fondo)
}
```

| Campo | Valor por defecto | Descripción |
|-------|-------------------|-------------|
| `NumColors` | `256` | Cantidad máxima de colores en la paleta |
| `Quantizer` | `nil` (usa el cuantizador por defecto) | Algoritmo para reducir colores |
| `Drawer` | `nil` (usa `draw.FloydSteinberg`) | Algoritmo de dithering |

---

[← Volver al índice](/indice)
