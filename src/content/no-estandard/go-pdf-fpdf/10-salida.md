# Guardar y cerrar el PDF

## `pdf.OutputFileAndClose(fileStr)`

Guarda el PDF a un archivo en disco y cierra el documento. **El más común.**

```go
err := pdf.OutputFileAndClose("documento.pdf")
if err != nil {
    log.Fatal(err)
}
```

## `pdf.Output(w)`

Escribe el PDF a un `io.Writer`. Útil para enviarlo directamente a HTTP, bytes.Buffer, etc.

```go
var buf bytes.Buffer
err := pdf.Output(&buf)
// buf.Bytes() contiene el PDF
```

## `pdf.OutputAndClose(w)`

Igual que `Output()` pero además cierra el documento (libera recursos).

```go
err := pdf.OutputAndClose(&buf)
```

## `pdf.Close()`

Cierra el documento y libera recursos. No es necesario si usás `OutputFileAndClose` o `OutputAndClose`.

## Manejo de errores

fpdf usa un esquema interno de errores: si algo falla, guarda el error y las llamadas siguientes no hacen nada. Podés consultar si hubo error con:

| Método | Qué hace |
|--------|----------|
| `Ok()` | Devuelve `true` si no hay errores |
| `Err()` | Devuelve `false` si hay error |
| `Error()` | Devuelve el error (o `nil`) |
| `ClearError()` | Limpia el estado de error |

```go
if !pdf.Ok() {
    log.Fatal(pdf.Error())
}
```

También podés inyectar errores desde tu aplicación:

```go
pdf.SetError(errors.New("algo falló"))
pdf.SetErrorf("falló la página %d", numPagina)
```

---

[← Volver al índice](/no-estandard/go-pdf-fpdf)
