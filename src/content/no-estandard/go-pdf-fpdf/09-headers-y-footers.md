# Headers y Footers

Son funciones que se ejecutan automáticamente en cada página (al inicio y al final). Ideales para logos, número de página, fecha, etc.

## Header

Se ejecuta automáticamente cuando se crea una página nueva (con `AddPage()`).:

```go
pdf.SetHeaderFunc(func() {
    pdf.SetFont("Arial", "B", 12)
    pdf.Cell(0, 10, "Mi Empresa S.A. - Reporte")
    pdf.Ln(15) // espacio debajo del header
})
```

El header tiene su propio contexto: el cursor empieza en la posición definida por el margen superior. Lo que dibujes ahí aparece en todas las páginas.

## Footer

Se ejecuta automáticamente cuando se llega al final de la página (por `SetAutoPageBreak` o al cerrar):

```go
pdf.SetFooterFunc(func() {
    pdf.SetY(-15) // a 15mm del borde inferior
    pdf.SetFont("Arial", "I", 8)
    pdf.Cell(0, 10, fmt.Sprintf("Página %d/{nb}", pdf.PageNo()))
})
```

| Método | Cuándo se ejecuta |
|--------|-------------------|
| `SetHeaderFunc(fnc)` | Al inicio de cada página nueva |
| `SetFooterFunc(fnc)` | Al final de cada página (antes del salto) |

## Número de página

| Método | Devuelve |
|--------|----------|
| `PageNo()` | Número de página actual (`int`) |
| `PageCount()` | Total de páginas (`int`) (solo disponible si se usa `AliasNbPages`) |

Para mostrar "Página X de Y":

```go
pdf.AliasNbPages("{nb}") // registra el alias

pdf.SetFooterFunc(func() {
    pdf.SetY(-15)
    pdf.SetFont("Arial", "I", 8)
    pdf.CellFormat(0, 10, fmt.Sprintf("Página %d de {nb}", pdf.PageNo()),
        "", 0, "C", false, 0, "")
})
```

`{nb}` se reemplaza automáticamente por el número total de páginas al cerrar el documento.

---

[← Volver al índice](/no-estandard/go-pdf-fpdf)
