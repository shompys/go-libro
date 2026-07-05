# mime/multipart — Leer y escribir datos multipart (formularios, uploads)

Maneja cuerpos HTTP con `Content-Type: multipart/form-data`. Muy usado para formularios con subida de archivos.

```go
import "mime/multipart"
```

---

## Índice

- [NewReader](/estandard/mime-multipart#newreader-leer-multipart)
- [NextPart y Part](/estandard/mime-multipart#nextpart-y-part)
- [ReadForm](/estandard/mime-multipart#readform-parsear-formulario-completo)
- [Form, FileHeader y File](/estandard/mime-multipart#form,-fileheader-y-file)
- [NewWriter](/estandard/mime-multipart#newwriter-escribir-multipart)
- [CreateFormField y CreateFormFile](/estandard/mime-multipart#createformfield-y-createformfile)
- [CreatePart](/estandard/mime-multipart#createpart)
- [Ejemplo completo: recibir upload](/estandard/mime-multipart#ejemplo-completo:-recibir-upload)
- [Ejemplo completo: crear multipart](/estandard/mime-multipart#ejemplo-completo:-crear-multipart-manualmente)

---

## NewReader (leer multipart)

Crea un `Reader` que parsea un cuerpo multipart. Necesita el `boundary` extraído del header `Content-Type`.

```go
import "mime"

contentType := "multipart/form-data; boundary=----WebKitFormBoundaryabc123"
_, params, _ := mime.ParseMediaType(contentType)
boundary := params["boundary"]

reader := multipart.NewReader(body, boundary)
```

| Función | Devuelve |
|---------|----------|
| `multipart.NewReader(r io.Reader, boundary string)` | `*multipart.Reader` |

---

## NextPart y Part

`NextPart()` devuelve la siguiente parte del mensaje multipart. Devuelve `io.EOF` cuando no hay más partes.

```go
for {
    part, err := reader.NextPart()
    if err == io.EOF {
        break
    }
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Nombre:", part.FormName())
    fmt.Println("Nombre de archivo:", part.FileName())

    buf := new(bytes.Buffer)
    buf.ReadFrom(part)
    fmt.Println("Contenido:", buf.String())
}
```

| Función | Devuelve |
|---------|----------|
| `r.NextPart()` | `(*Part, error)` |
| `r.NextRawPart()` | `(*Part, error)` — Go 1.23+, no decodifica `quoted-printable` |

### Part

```go
type Part struct {
    Header textproto.MIMEHeader
    // contiene métodos Reader
}
```

| Método/Campo | Descripción |
|-------------|-------------|
| `part.Header` | Headers de la parte (`Content-Disposition`, `Content-Type`, etc.) |
| `part.FormName() string` | Nombre del campo del formulario |
| `part.FileName() string` | Nombre del archivo (vacío si no es un archivo) |
| `part.Read(b []byte) (int, error)` | Implementa `io.Reader` para leer el cuerpo de la parte |

---

## ReadForm (parsear formulario completo)

Parsea todo el cuerpo multipart de una vez y carga los archivos en memoria (hasta `maxMemory`) o en disco temporal.

```go
maxMemory := int64(32 << 20) // 32 MB en memoria, el resto a disco
form, err := reader.ReadForm(maxMemory)
```

| Función | Devuelve |
|---------|----------|
| `r.ReadForm(maxMemory int64)` | `(*Form, error)` |

**Nota:** Los archivos que excedan `maxMemory` se almacenan en archivos temporales en disco.

---

## Form, FileHeader y File

```go
type Form struct {
    Value map[string][]string
    File  map[string][]*FileHeader
}
```

| Campo | Descripción |
|-------|-------------|
| `form.Value` | Campos de texto del formulario (`map[nombre]→[]valores`) |
| `form.File` | Archivos subidos (`map[nombre]→[]*FileHeader`) |

### FileHeader

```go
type FileHeader struct {
    Filename string
    Header   textproto.MIMEHeader
    Size     int64
}
```

| Campo/Método | Descripción |
|-------------|-------------|
| `fh.Filename` | Nombre original del archivo |
| `fh.Header` | Headers MIME (`Content-Type`, `Content-Disposition`) |
| `fh.Size` | Tamaño del archivo en bytes |
| `fh.Open()` | Abre el archivo, devuelve `(multipart.File, error)` |

### File interface

```go
type File interface {
    io.Reader
    io.ReaderAt
    io.Seeker
    io.Closer
}
```

### Ejemplo de acceso a un archivo subido

```go
form, _ := reader.ReadForm(32 << 20)
defer form.RemoveAll() // limpia archivos temporales

for _, fh := range form.File["documento"] {
    file, _ := fh.Open()
    defer file.Close()

    // leer o guardar el archivo
    data, _ := io.ReadAll(file)
    fmt.Printf("Archivo: %s (%d bytes)\n", fh.Filename, len(data))
}

// Campos de texto
nombres := form.Value["nombre"] // []string
```

---

## NewWriter (escribir multipart)

Crea un `Writer` para construir un cuerpo multipart. Se usa el boundary generado automáticamente.

```go
var buf bytes.Buffer
writer := multipart.NewWriter(&buf)
```

| Función | Devuelve |
|---------|----------|
| `multipart.NewWriter(w io.Writer)` | `*multipart.Writer` |

### Métodos del Writer

```go
writer.FormDataContentType() string // "multipart/form-data; boundary=..."
writer.Boundary() string            // el boundary generado
writer.SetBoundary(boundary string) error // cambia el boundary
```

| Método | Devuelve | Descripción |
|--------|----------|-------------|
| `w.FormDataContentType()` | `string` | Content-Type completo para el header HTTP |
| `w.Boundary()` | `string` | Boundary usado en el cuerpo |
| `w.SetBoundary(b string)` | `error` | Establece un boundary manualmente |
| `w.Close()` | `error` | Cierra el writer (obligatorio, escribe el boundary final) |

---

## CreateFormField y CreateFormFile

`CreateFormField` agrega un campo de texto. `CreateFormFile` agrega un campo de archivo.

```go
var buf bytes.Buffer
writer := multipart.NewWriter(&buf)

// Campo de texto
fieldWriter, _ := writer.CreateFormField("nombre")
fieldWriter.Write([]byte("Ana"))

// Campo de archivo
fileWriter, _ := writer.CreateFormFile("documento", "informe.pdf")
fileContent, _ := os.ReadFile("informe.pdf")
fileWriter.Write(fileContent)

writer.Close() // ¡no olvidar!

// buf ahora contiene el cuerpo multipart completo
```

| Método | Devuelve | Descripción |
|--------|----------|-------------|
| `w.CreateFormField(fieldname string)` | `(io.Writer, error)` | Crea un campo de texto |
| `w.CreateFormFile(fieldname, filename string)` | `(io.Writer, error)` | Crea un campo de archivo |
| `w.WriteField(fieldname, value string)` | `error` | Atajo para campos de texto simples |

---

## CreatePart

Crea una parte genérica con headers MIME personalizados. Más control que `CreateFormField`/`CreateFormFile`.

```go
headers := make(textproto.MIMEHeader)
headers.Set("Content-Disposition", `form-data; name="campo"`)
headers.Set("Content-Type", "text/plain")

part, _ := writer.CreatePart(headers)
part.Write([]byte("contenido de la parte"))
```

| Método | Devuelve |
|--------|----------|
| `w.CreatePart(header textproto.MIMEHeader)` | `(io.Writer, error)` |

---

## Ejemplo completo: recibir upload

```go
func uploadHandler(w http.ResponseWriter, r *http.Request) {
    // Limitar tamaño: 10 MB
    r.Body = http.MaxBytesReader(w, r.Body, 10<<20)

    reader, err := r.MultipartReader()
    if err != nil {
        http.Error(w, "Error al leer multipart", http.StatusBadRequest)
        return
    }

    for {
        part, err := reader.NextPart()
        if err == io.EOF {
            break
        }
        if err != nil {
            http.Error(w, "Error en parte", http.StatusInternalServerError)
            return
        }

        if part.FileName() != "" {
            // Es un archivo
            dst, _ := os.Create("/uploads/" + part.FileName())
            io.Copy(dst, part)
            dst.Close()
            fmt.Fprintf(w, "Archivo %s subido\n", part.FileName())
        } else {
            // Es un campo de texto
            buf := new(bytes.Buffer)
            buf.ReadFrom(part)
            fmt.Fprintf(w, "Campo %s: %s\n", part.FormName(), buf.String())
        }
    }
}
```

---

## Ejemplo completo: crear multipart manualmente

Útil para enviar formularios con archivos vía HTTP.

```go
func main() {
    var buf bytes.Buffer
    writer := multipart.NewWriter(&buf)

    // Campo de texto
    writer.WriteField("usuario", "ana")

    // Archivo
    fileWriter, _ := writer.CreateFormFile("foto", "perfil.png")
    fileData, _ := os.ReadFile("perfil.png")
    fileWriter.Write(fileData)

    writer.Close()

    // Enviar
    resp, _ := http.Post(
        "https://api.ejemplo.com/upload",
        writer.FormDataContentType(),
        &buf,
    )
    defer resp.Body.Close()
}
```

---

[← Volver al índice](/indice)
