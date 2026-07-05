# Fuentes (Fonts)

## `pdf.SetFont(family, style, size)`

Elige la fuente, estilo y tamaño para todo el texto que se escriba después.

```go
pdf.SetFont("Arial", "B", 16)
```

| Parámetro | Tipo | Qué es |
|-----------|------|--------|
| `family` | `string` | Nombre de la familia tipográfica |
| `style` | `string` | Estilo (combinable) |
| `size` | `float64` | Tamaño en puntos |

## Fuentes estándar (built-in)

Estas 5 fuentes vienen incluidas en todo visor de PDF. No necesitan archivo externo, nunca fallan:

| Nombre en fpdf | Tipografía real |
|----------------|-----------------|
| `"Arial"` | Helvética (sans-serif) |
| `"Times"` | Times New Roman (serif) |
| `"Courier"` | Courier (monoespaciada) |
| `"Symbol"` | Caracteres griegos y símbolos |
| `"ZapfDingbats"` | Dingbats / íconos decorativos |

## Estilos de fuente

| Código | Significado |
|--------|-------------|
| `""` | Normal (regular) |
| `"B"` | Negrita (Bold) |
| `"I"` | Cursiva (Italic) |
| `"BI"` | Negrita + Cursiva |
| `"U"` | Subrayado (Underline) |

Los estilos que no existen para una fuente se simulan (por ejemplo si pedís `"B"` en Times pero no tenés el archivo, fpdf aplica un efecto de negrita simulado).

## Cambiar solo el estilo o el tamaño

```go
pdf.SetFontStyle("B")    // mantiene la familia actual, cambia solo estilo
pdf.SetFontSize(14)      // mantiene la familia y estilo, cambia solo tamaño
```

## Fuentes personalizadas (TTF / OTF / Type1)

Para usar tu propia tipografía (.ttf, .otf) necesitás dos pasos:

### 1. Generar archivos de definición de fuente

Usá la herramienta `makefont` que viene con la librería, o la función `MakeFont()`:

```go
// En tu código
fpdf.MakeFont("mifuente.ttf", "cp1252.map", "font/", os.Stdout, true)
```

Esto genera dos archivos:
- `mifuente.json` — métricas de la fuente
- `mifuente.z` — fuente comprimida (embedding)

### 2. Cargar la fuente con `AddFont()`

```go
pdf.AddFont("MiFuente", "", "mifuente.json")
pdf.SetFont("MiFuente", "", 14)
```

| Método | Para qué |
|--------|----------|
| `AddFont(family, style, file)` | Carga desde archivo `.json` en disco |
| `AddFontFromBytes(family, style, jsonBytes, zBytes)` | Carga desde bytes en memoria |
| `AddFontFromReader(family, style, reader)` | Carga desde un `io.Reader` |

## Fuentes UTF-8

Para texto con caracteres especiales (acentos, eñes, chino, etc.):

```go
pdf.AddUTF8Font("MiFuente", "", "mifuente.json")
```

| Método | Para qué |
|--------|----------|
| `AddUTF8Font(family, style, file)` | Carga fuente UTF-8 desde archivo |
| `AddUTF8FontFromBytes(family, style, jsonBytes, zBytes)` | Carga fuente UTF-8 desde bytes |

La mayoría de las fuentes TrueType modernas ya son UTF-8.

## Idioma RTL (derecha a izquierda)

Para idiomas como árabe o hebreo:

```go
pdf.RTL()  // activa modo derecha-a-izquierda
// ... escribir texto en árabe ...
pdf.LTR()  // vuelve a modo izquierda-a-derecha
```

---

[← Volver al índice](/no-estandard/go-pdf-fpdf)
