# Conceptos básicos

## Unidades de medida

Al crear el PDF elegís la unidad con la que trabajarás en todo el documento:

| String | Significado | Equivalencia |
|--------|-------------|--------------|
| `"mm"` | Milímetros | 1mm = 0.1cm |
| `"cm"` | Centímetros | 1cm = 10mm |
| `"pt"` | Puntos tipográficos | 1pt ≈ 0.35mm |
| `"in"` | Pulgadas | 1in = 25.4mm |

Todos los números que uses después (posiciones, anchos, altos) se interpretan en esa unidad.

## Tamaños de página predefinidos

| String | Medida (mm) |
|--------|-------------|
| `"A3"` | 297 × 420 |
| `"A4"` | 210 × 297 |
| `"A5"` | 148 × 210 |
| `"Letter"` | 215.9 × 279.4 |
| `"Legal"` | 215.9 × 355.6 |

También podés pasar un `SizeType` personalizado con `{Width: 100, Height: 150}`.

## Sistema de coordenadas

La esquina **superior izquierda** de la hoja es el punto `(0, 0)`.

```
(0,0) ────────── X aumenta →
  │
  │
  Y
aumenta
  ↓
```

- **X**: distancia desde el borde izquierdo (crece hacia la derecha)
- **Y**: distancia desde el borde superior (crece hacia abajo)

En una hoja A4 en milímetros:
- X va de 0 a 210
- Y va de 0 a 297

## Orientación de página

| String | Significado |
|--------|-------------|
| `"P"` | Portrait (vertical) |
| `"L"` | Landscape (horizontal) |

## El cursor invisible

Existe un cursor interno que recuerda la posición actual de "escritura". No es visible, pero determina dónde se dibuja el próximo texto.

| Método | Qué hace |
|--------|----------|
| `SetXY(x, y)` | Mueve el cursor a coordenadas absolutas |
| `SetX(x)` | Cambia solo la coordenada X del cursor |
| `SetY(y)` | Cambia solo la coordenada Y del cursor |
| `GetX()` | Devuelve la X actual del cursor |
| `GetY()` | Devuelve la Y actual del cursor |
| `GetXY()` | Devuelve (X, Y) actual del cursor |

## Funciones con coordenadas vs funciones con cursor

Hay dos tipos de funciones:

**Grupo 1 — Dibujan en posición fija (reciben X, Y explícitas, NO usan el cursor):**

- `Rect(x, y, w, h, style)`
- `Line(x1, y1, x2, y2)`
- `Circle(x, y, r, style)`
- `Image(name, x, y, w, h, ...)`
- `Text(x, y, txt)`

**Grupo 2 — Escriben donde está el cursor (NO reciben X, Y, SÍ mueven el cursor):**

- `Cell(w, h, txt)`
- `CellFormat(w, h, txt, ...)`
- `MultiCell(w, h, txt, ...)`
- `Write(h, txt)`

---

[← Volver al índice](/no-estandard/go-pdf-fpdf)
