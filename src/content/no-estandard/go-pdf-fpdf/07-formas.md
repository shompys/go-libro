# Formas y dibujos

Todas las formas reciben coordenadas absolutas (X, Y) y un parámetro `styleStr` que indica cómo se dibujan.

## El parámetro `styleStr`

Un string que combina letras para indicar qué hacer:

| Letra | Significado |
|-------|-------------|
| `"D"` | Dibujar solo el borde (Draw) |
| `"F"` | Rellenar (Fill) |
| `"DF"` o `"FD"` | Dibujar borde + rellenar |

**El orden de las letras no importa.** `"DF"` y `"FD"` hacen lo mismo.

## `pdf.Rect(x, y, w, h, style)`

Rectángulo.

```go
pdf.Rect(20, 30, 50, 40, "DF")
```

| Parámetro | Qué es |
|-----------|--------|
| `x` | Coordenada X de la esquina superior izquierda |
| `y` | Coordenada Y de la esquina superior izquierda |
| `w` | Ancho |
| `h` | Alto |
| `style` | `"D"`, `"F"`, `"DF"` / `"FD"` |

## `pdf.RoundedRect(x, y, w, h, r, corners, style)`

Rectángulo con esquinas redondeadas.

```go
pdf.RoundedRect(20, 30, 50, 40, 5, "1234", "DF")
```

| Parámetro | Qué es |
|-----------|--------|
| `r` | Radio del redondeo |
| `corners` | Qué esquinas redondear: `"1234"` = todas, `"1"` = solo superior-izquierda, etc. |

Las esquinas se numeran:
- `1`: superior izquierda
- `2`: superior derecha
- `3`: inferior derecha
- `4`: inferior izquierda

## `pdf.RoundedRectExt(x, y, w, h, rTL, rTR, rBR, rBL, style)`

Rectángulo con **radios distintos por esquina**.

```go
pdf.RoundedRectExt(20, 30, 50, 40, 10, 5, 5, 10, "DF")
//                    rTL  rTR  rBR  rBL
```

| Parámetro | Qué es |
|-----------|--------|
| `rTL` | Radio arriba-izquierda |
| `rTR` | Radio arriba-derecha |
| `rBR` | Radio abajo-derecha |
| `rBL` | Radio abajo-izquierda |

## `pdf.Circle(x, y, r, style)`

Círculo.

```go
pdf.Circle(50, 50, 30, "D")
```

| Parámetro | Qué es |
|-----------|--------|
| `x, y` | Centro del círculo |
| `r` | Radio |

## `pdf.Ellipse(x, y, rx, ry, degRotate, style)`

Elipse.

```go
pdf.Ellipse(50, 50, 40, 20, 0, "D")
```

| Parámetro | Qué es |
|-----------|--------|
| `x, y` | Centro |
| `rx` | Radio horizontal |
| `ry` | Radio vertical |
| `degRotate` | Rotación en grados |

## `pdf.Line(x1, y1, x2, y2)`

Línea recta entre dos puntos.

```go
pdf.Line(10, 10, 100, 100)
```

| Parámetro | Qué es |
|-----------|--------|
| `x1, y1` | Punto inicial |
| `x2, y2` | Punto final |

## `pdf.Polygon(points, style)`

Polígono con múltiples vértices.

```go
pdf.Polygon([]fpdf.PointType{
    {X: 10, Y: 10},
    {X: 50, Y: 5},
    {X: 80, Y: 30},
    {X: 40, Y: 50},
    {X: 10, Y: 40},
}, "DF")
```

## `pdf.Arc(x, y, rx, ry, degRotate, degStart, degEnd, style)`

Arco circular o elíptico.

```go
pdf.Arc(50, 50, 30, 30, 0, 0, 180, "D")
```

| Parámetro | Qué es |
|-----------|--------|
| `x, y` | Centro |
| `rx, ry` | Radios |
| `degRotate` | Rotación |
| `degStart` | Ángulo inicial (grados) |
| `degEnd` | Ángulo final (grados) |

## Grosor de línea

```go
pdf.SetLineWidth(0.5) // en la unidad del documento (mm, cm, etc.)
pdf.GetLineWidth()     // devuelve el grosor actual
```

## Estilo de terminación de línea

```go
pdf.SetLineCapStyle("round")  // "butt" (plano), "round" (redondeado), "square"
```

## Estilo de unión de líneas

```go
pdf.SetLineJoinStyle("round") // "miter", "round", "bevel"
```

---

[← Volver al índice](/no-estandard/go-pdf-fpdf)
