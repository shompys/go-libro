# Creación y configuración del documento

## `fpdf.New()`

Crea una nueva instancia del documento PDF.

```go
pdf := fpdf.New(orientacion, unidad, tamaño, directorioFuentes)
```

| Parámetro | Tipo | Qué es | Valores comunes |
|-----------|------|--------|-----------------|
| `orientacion` | `string` | Orientación de la página | `"P"` (vertical), `"L"` (horizontal) |
| `unidad` | `string` | Unidad de medida | `"mm"`, `"cm"`, `"pt"`, `"in"` |
| `tamaño` | `string` o `SizeType` | Tamaño de hoja | `"A4"`, `"Letter"`, `"A3"`, `"A5"`, `"Legal"` |
| `directorioFuentes` | `string` | Carpeta con archivos de fuente | `""` (usa solo las built-in) |

```go
pdf := fpdf.New("P", "mm", "A4", "")
```

## `pdf.AddPage()`

Agrega una página en blanco al documento. **Sin esto no hay nada donde dibujar.**

```go
pdf.AddPage()
```

Si llamás a `AddPage()` varias veces, crea un documento multipágina.

### `pdf.AddPageFormat(orientacion, tamaño)`

Agrega una página con orientación y tamaño específicos (pueden ser distintos de los del `New()` inicial).

```go
pdf.AddPageFormat("L", fpdf.SizeType{Width: 100, Height: 80})
```

## Márgenes

| Método | Qué hace |
|--------|----------|
| `SetMargins(izquierdo, superior, derecho)` | Define los 3 márgenes a la vez |
| `SetLeftMargin(margen)` | Solo margen izquierdo |
| `SetTopMargin(margen)` | Solo margen superior |
| `SetRightMargin(margen)` | Solo margen derecho |
| `GetMargins()` | Devuelve (izq, superior, der, inferior) |

```go
pdf.SetMargins(15, 15, 15) // 15mm en cada lado
```

### Auto page break

Salto de página automático cuando el contenido llega al final:

```go
pdf.SetAutoPageBreak(auto, margenInferior)
```

| Parámetro | Tipo | Qué es |
|-----------|------|--------|
| `auto` | `bool` | `true` activa salto automático, `false` lo desactiva |
| `margenInferior` | `float64` | Distancia desde abajo donde se activa el salto |

## Metadatos del documento

Información que se incrusta en el PDF (autor, título, etc.):

| Método | Qué define | Ejemplo |
|--------|------------|---------|
| `SetAuthor(author, isUTF8)` | Autor | `pdf.SetAuthor("Jonathan", true)` |
| `SetTitle(title, isUTF8)` | Título | `pdf.SetTitle("Reporte 2026", true)` |
| `SetSubject(subject, isUTF8)` | Tema | `pdf.SetSubject("Finanzas", true)` |
| `SetCreator(creator, isUTF8)` | Software creador | `pdf.SetCreator("MiApp v1.0", true)` |
| `SetKeywords(keywords, isUTF8)` | Palabras clave | `pdf.SetKeywords("reporte, finanzas", true)` |
| `SetCreationDate(tm)` | Fecha de creación | `pdf.SetCreationDate(time.Now())` |

El parámetro `isUTF8` indica si el string ya está en UTF-8. Si es `false`, se asume codificación ISO-8859-1.

## Compresión

```go
pdf.SetCompression(true) // activa compresión (por defecto está activada)
```

---

[← Volver al índice](/no-estandard/go-pdf-fpdf)
