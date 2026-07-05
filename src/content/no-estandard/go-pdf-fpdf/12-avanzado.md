# Funcionalidades avanzadas

## Bookmarks (marcadores / índice PDF)

Crean un índice navegable en el panel lateral del visor PDF:

```go
pdf.Bookmark("Capítulo 1", 0, -1)
```

| Parámetro | Tipo | Qué es |
|-----------|------|--------|
| `txtStr` | `string` | Texto del marcador |
| `level` | `int` | Nivel jerárquico (0 = principal, 1 = sub, 2 = sub-sub...) |
| `y` | `float64` | Posición Y a la que salta. `-1` = posición actual |

## Links

### Link externo (URL)

```go
pdf.CellFormat(40, 10, "Google", "", 0, "L", false, 0, "https://google.com")
//                                                          link  linkStr
```

### Link interno (entre páginas)

```go
linkID := pdf.AddLink()              // crea un link destino
pdf.SetLink(linkID, 0, -1)           // lo asocia a la posición actual

pdf.CellFormat(40, 10, "Ir al destino", "", 0, "L", false, linkID, "")
```

### Link en un área rectangular

```go
pdf.Link(x, y, w, h, linkID)         // área clickeable con link interno
pdf.LinkString(x, y, w, h, url)      // área clickeable con URL externa
```

## Protección con contraseña

```go
pdf.SetProtection(actionFlag, userPass, ownerPass)
```

| Parámetro | Qué es |
|-----------|--------|
| `actionFlag` | `0` = sin restricciones. Combina `1` (prohibir imprimir), `2` (prohibir modificar), `4` (prohibir copiar), `8` (prohibir anotar) |
| `userPass` | Contraseña de usuario (para abrir) |
| `ownerPass` | Contraseña de dueño (para editar permisos) |

```go
pdf.SetProtection(1|2|4, "user123", "owner456") // proteger impresión, modificación y copia
```

## Templates

Permiten crear contenido reutilizable (como un "sello" o "membrete").

```go
// Crear template
template := pdf.CreateTemplate(func(tpl *fpdf.Tpl) {
    tpl.SetFont("Arial", "B", 12)
    tpl.Cell(0, 10, "CONFIDENCIAL")
})

// Usarlo múltiples veces
pdf.UseTemplate(template)
pdf.SetXY(100, 100)
pdf.UseTemplate(template)
```

## Capas (Layers)

Agrupan contenido que el usuario puede mostrar/ocultar en el visor PDF:

```go
layerID := pdf.AddLayer("Capa 1", true) // true = visible por defecto
pdf.BeginLayer(layerID)
// ... dibujar contenido de la capa ...
pdf.EndLayer()
```

## Transformaciones

Rotación, escala, traslación y sesgo del contenido:

```go
pdf.TransformBegin()
pdf.TransformRotate(45, 105, 148)      // rota 45° alrededor del centro de A4
pdf.Cell(40, 10, "Texto rotado")
pdf.TransformEnd()
```

| Método | Efecto |
|--------|--------|
| `TransformRotate(angle, x, y)` | Rotación |
| `TransformScale(sx, sy, x, y)` | Escala |
| `TransformTranslate(tx, ty)` | Traslación |
| `TransformSkew(ax, ay, x, y)` | Sesgo |
| `TransformMirrorHorizontal(x)` | Espejo horizontal |
| `TransformMirrorVertical(y)` | Espejo vertical |

## Modo de visualización

```go
pdf.SetDisplayMode("fullpage", "single")
```

| Parámetro zoom | Significado |
|----------------|-------------|
| `"fullpage"` | Vista de página completa |
| `"fullwidth"` | Ancho completo |
| `"real"` | Tamaño real (100%) |
| `"default"` | Configuración del visor |

| Parámetro layout | Significado |
|------------------|-------------|
| `"single"` | Una página a la vez |
| `"continuous"` | Páginas continuas |
| `"two"` | Dos páginas lado a lado |

## Barcodes

fpdf incluye soporte para código de barras (en el paquete `contrib`). Requiere importar:

```go
import "github.com/go-pdf/fpdf/contrib/barcode"
```

## Renderizar HTML básico

```go
html := pdf.HTMLBasicNew()
html.Write(5, "<b>Negrita</b> y <i>cursiva</i><br>Siguiente línea")
```

Soporta etiquetas: `<b>`, `<i>`, `<u>`, `<br>`, `<a href="...">`.

## Renderizar SVG básico

```go
svg := fpdf.SVGBasicParse(svgBytes)
pdf.SVGBasicWrite(&svg, 1.0) // escala 1:1
```

---

[← Volver al índice](/no-estandard/go-pdf-fpdf)
