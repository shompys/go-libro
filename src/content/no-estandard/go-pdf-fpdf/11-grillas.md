# Grillas (Grid)

fpdf incluye un sistema de grillas para posicionamiento relativo y gráficos.

## `NewGrid(x, y, w, h)`

Crea una nueva grilla en una región rectangular de la página.

```go
grilla := fpdf.NewGrid(10, 10, 190, 277)
```

| Parámetro | Qué define |
|-----------|------------|
| `x, y` | Esquina superior izquierda de la región de la grilla |
| `w, h` | Ancho y alto de la región |

## Posicionamiento relativo con `Pos`

Te permite trabajar con coordenadas **relativas** a la grilla (0 a 1 en lugar de mm absolutos):

```go
x, y := grilla.Pos(0.5, 0.5) // centro de la grilla
pdf.SetXY(x, y)
pdf.Cell(0, 10, "Centrado")
```

| Método | Qué hace |
|--------|----------|
| `Pos(xRel, yRel)` | Convierte coordenadas relativas (0–1) a absolutas |
| `X(dataX)` | Convierte coordenada X relativa a absoluta |
| `Y(dataY)` | Convierte coordenada Y relativa a absoluta |
| `XY(dataX, dataY)` | Igual que `Pos` |
| `XRange()` | Devuelve (xMin, xMax) de la grilla |
| `YRange()` | Devuelve (yMin, yMax) de la grilla |

## Plot (gráfico de líneas)

```go
grilla.Plot(pdf, xMin, xMax, count, func(x float64) float64 {
    return math.Sin(x) * 10
})
```

| Parámetro | Qué es |
|-----------|--------|
| `xMin, xMax` | Rango del eje X (en unidades de datos) |
| `count` | Cantidad de puntos a graficar |
| `fnc` | Función que recibe X y devuelve Y (en unidades de datos) |

## Tickmarks (marcas de ejes)

```go
grilla.TickmarksContainX(min, max)
grilla.TickmarksContainY(min, max)
grilla.TickmarksExtentX(min, div, count)
grilla.TickmarksExtentY(min, div, count)
```

## Métodos de tamaño

| Método | Qué hace |
|--------|----------|
| `Wd(dataWd)` | Ancho de la grilla en coordenadas de datos |
| `WdAbs(dataWd)` | Ancho absoluto |
| `Ht(dataHt)` | Alto de la grilla en coordenadas de datos |
| `HtAbs(dataHt)` | Alto absoluto |

---

[← Volver al índice](/no-estandard/go-pdf-fpdf)
