# Métodos de texto

## `pdf.Cell(w, h, txt)`

Escribe una celda de texto rectangular. Es el método más básico.

```go
pdf.Cell(40, 10, "Hola mundo")
```

| Parámetro | Tipo | Qué hace |
|-----------|------|----------|
| `w` | `float64` | Ancho de la celda. Si es `0`, se extiende hasta el margen derecho |
| `h` | `float64` | Alto de la celda |
| `txt` | `string` | El texto a escribir |

- Si el texto es más largo que el ancho, se corta (no se ve lo que sobra).
- Mueve el cursor a la derecha de la celda (para encadenar varias celdas).

## `pdf.CellFormat(w, h, txt, border, ln, align, fill, link, linkStr)`

Igual que `Cell()` pero con control total.

```go
pdf.CellFormat(80, 10, "Total: $150", "1", 1, "R", false, 0, "")
```

| Parámetro | Tipo | Qué hace | Valores |
|-----------|------|----------|---------|
| `w` | `float64` | Ancho de la celda | Número en la unidad elegida |
| `h` | `float64` | Alto de la celda | Número en la unidad elegida |
| `txt` | `string` | Texto a escribir | Cualquier string |
| `border` | `string` | Qué bordes dibujar | `""` (ninguno), `"1"` (todos), `"L"`, `"T"`, `"R"`, `"B"` (combinables) |
| `ln` | `int` | Qué hace el cursor después de escribir | Ver tabla abajo |
| `align` | `string` | Alineación horizontal del texto | `"L"` (izq), `"C"` (centro), `"R"` (der) |
| `fill` | `bool` | Pinta el fondo de la celda | `true`, `false` |
| `link` | `int` | ID de link interno | `0` si no hay link |
| `linkStr` | `string` | URL de link externo | `""` si no hay link |

### Valores de `ln` (salto de línea)

| `ln` | Comportamiento del cursor después de escribir |
|------|-----------------------------------------------|
| `0` | Queda a la derecha de la celda |
| `1` | Salta al inicio de la línea siguiente |
| `2` | Queda debajo de la celda (misma X) |

## `pdf.MultiCell(w, h, txt, border, align, fill)`

Celda con **texto multilínea**. Si el texto es más largo que `w`, hace salto de línea automático.

```go
pdf.MultiCell(100, 5, "Texto muy largo que se parte automáticamente en varias líneas...", "1", "L", false)
```

| Parámetro | Tipo | Qué hace |
|-----------|------|----------|
| `w` | `float64` | Ancho de la celda |
| `h` | `float64` | Alto de **cada línea** (no de toda la celda) |
| `txt` | `string` | Texto a escribir |
| `border` | `string` | Bordes (igual que `CellFormat`) |
| `align` | `string` | Alineación: `"L"`, `"C"`, `"R"`, `"J"` (justificado) |
| `fill` | `bool` | Fondo pintado |

Después de `MultiCell`, el cursor queda al inicio de la línea siguiente.

## `pdf.Write(h, txt)`

Escribe texto con **salto de línea automático**. Ideal para párrafos largos.

```go
pdf.Write(5, "Este es un párrafo largo que se va ajustando solo al ancho disponible...")
```

| Parámetro | Tipo | Qué hace |
|-----------|------|----------|
| `h` | `float64` | Alto de cada línea |
| `txt` | `string` | Texto a escribir |

Se ajusta automáticamente al espacio entre los márgenes izquierdo y derecho.

## `pdf.Text(x, y, txt)`

Imprime texto en una **posición absoluta** (no usa el cursor).

```go
pdf.Text(50, 100, "Texto en coordenadas fijas")
```

| Parámetro | Qué es |
|-----------|--------|
| `x` | Coordenada X del inicio del texto |
| `y` | Coordenada Y de la línea base del texto |
| `txt` | String a escribir |

## `pdf.WriteAligned(width, lineHeight, text, align)`

Escribe texto con alineación controlada y salto de línea.

```go
pdf.WriteAligned(0, 5, "Párrafo justificado...", "J")
```

| Parámetro | Tipo | Qué hace |
|-----------|------|----------|
| `width` | `float64` | Ancho. Si es `0`, usa el espacio hasta el margen |
| `lineHeight` | `float64` | Alto de cada línea |
| `text` | `string` | Texto |
| `align` | `string` | `"L"`, `"C"`, `"R"`, `"J"` (justificado) |

## `pdf.SplitLines(txt, w)`

Divide un texto en líneas según un ancho dado. **No lo escribe**, solo devuelve el slice de líneas. Útil para calcular cuánto espacio va a ocupar un texto antes de escribirlo.

```go
lines := pdf.SplitLines("Texto largo...", 80)
cantidad := len(lines)
```

## `pdf.GetStringWidth(s)`

Devuelve el ancho que ocuparía un string con la fuente actual. Muy útil para centrar texto.

```go
ancho := pdf.GetStringWidth("Hola")
// centrar: x = (anchoPagina - ancho) / 2
```

## `pdf.Ln(h)`

Salto de línea manual (como un Enter). Mueve el cursor al margen izquierdo de la línea de abajo.

```go
pdf.Ln(10) // baja 10mm y va al margen izquierdo
```

## `pdf.Cellf(w, h, format, args...)`

Igual que `Cell` pero con formato `fmt.Sprintf`.

```go
pdf.Cellf(40, 10, "Total: $%.2f", 150.50)
```

---

[← Volver al índice](/no-estandard/go-pdf-fpdf)
