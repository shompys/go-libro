# Colores

fpdf usa el modelo **RGB** (rojo, verde, azul). Cada componente va de 0 a 255.

```
(0, 0, 0)       → Negro
(255, 255, 255) → Blanco
(255, 0, 0)     → Rojo puro
(0, 255, 0)     → Verde puro
(0, 0, 255)     → Azul puro
(128, 128, 128) → Gris medio
(100, 200, 100) → Verde clarito
```

Si tenés un color en hexadecimal (`#FF5733`), lo convertís así:

```
FF = 255
57 = 87
33 = 51

→ (255, 87, 51)
```

## Color de relleno (`SetFillColor`)

Pinta el interior de las formas (rectángulos, celdas con `fill: true`, círculos).

```go
pdf.SetFillColor(r, g, b)
```

| Parámetro | Rango | Qué es |
|-----------|-------|--------|
| `r` | 0–255 | Intensidad de rojo |
| `g` | 0–255 | Intensidad de verde |
| `b` | 0–255 | Intensidad de azul |

## Color de trazo / borde (`SetDrawColor`)

Color de líneas y bordes.

```go
pdf.SetDrawColor(r, g, b)
```

## Color de texto (`SetTextColor`)

Color de la letra.

```go
pdf.SetTextColor(r, g, b)
```

## Getters

| Método | Qué devuelve |
|--------|--------------|
| `GetFillColor()` | (R, G, B) del relleno actual |
| `GetDrawColor()` | (R, G, B) del trazo actual |
| `GetTextColor()` | (R, G, B) del texto actual |

## Transparencia (`SetAlpha`)

A diferencia de lo que dije antes, **fpdf SÍ soporta transparencia real** a través de `SetAlpha()`:

```go
pdf.SetAlpha(alpha, blendMode)
```

| Parámetro | Tipo | Qué es | Valores |
|-----------|------|--------|---------|
| `alpha` | `float64` | Opacidad | `0` (transparente) a `1` (opaco) |
| `blendMode` | `string` | Modo de mezcla | `"Normal"`, `"Multiply"`, `"Screen"`, `"Overlay"`, `"Darken"`, `"Lighten"`, `"ColorDodge"`, `"ColorBurn"`, `"HardLight"`, `"SoftLight"`, `"Difference"`, `"Exclusion"`, `"Hue"`, `"Saturation"`, `"Color"`, `"Luminosity"` |

```go
pdf.SetAlpha(0.5, "Normal")  // 50% de opacidad
pdf.Rect(20, 20, 50, 50, "FD")
```

## Gradientes

### Gradiente lineal

```go
pdf.LinearGradient(x, y, w, h, r1, g1, b1, r2, g2, b2, x1, y1, x2, y2)
```

| Parámetro | Qué es |
|-----------|--------|
| `x, y` | Posición del rectángulo |
| `w, h` | Dimensiones del rectángulo |
| `r1, g1, b1` | Color inicial |
| `r2, g2, b2` | Color final |
| `x1, y1` | Punto de inicio del gradiente |
| `x2, y2` | Punto de fin del gradiente |

```go
// Gradiente de arriba hacia abajo (rojo a azul)
pdf.LinearGradient(20, 20, 60, 60, 255, 0, 0, 0, 0, 255, 0, 0, 0, 1)
```

### Gradiente radial

```go
pdf.RadialGradient(x, y, w, h, r1, g1, b1, r2, g2, b2, x1, y1, x2, y2, radio)
```

Funciona igual que el lineal pero con un radio para el centro del gradiente.

---

[← Volver al índice](/no-estandard/go-pdf-fpdf)
