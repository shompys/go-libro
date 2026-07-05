# archive/zip — Leer y crear archivos ZIP

```go
import "archive/zip"
```

---

## Crear un ZIP

```go
f, _ := os.Create("archivo.zip")
defer f.Close()

w := zip.NewWriter(f)
defer w.Close()

// Crear un archivo dentro del ZIP
writer, _ := w.Create("documento.txt")
writer.Write([]byte("contenido del archivo"))

// Crear un archivo con metadatos personalizados
cabecera := &zip.FileHeader{
    Name:     "datos.csv",
    Method:   zip.Deflate,
    Modified: time.Now(),
}
writer2, _ := w.CreateHeader(cabecera)
writer2.Write([]byte("col1,col2\n1,2\n"))
```

| Función | Descripción |
|---------|-------------|
| `zip.NewWriter(w io.Writer)` | Crea un nuevo escritor ZIP sobre `w` |
| `w.Create(name string)` | Agrega un archivo al ZIP, devuelve `io.Writer` |
| `w.CreateHeader(fh *FileHeader)` | Agrega un archivo con cabecera personalizada |
| `w.Close()` | Escribe el directorio central y cierra el ZIP |

---

## Leer un ZIP

```go
r, _ := zip.OpenReader("archivo.zip")
defer r.Close()

for _, f := range r.File {
    fmt.Println(f.Name)       // nombre del archivo
    fmt.Println(f.Modified)   // fecha de modificación
    fmt.Println(f.UncompressedSize64) // tamaño sin comprimir

    rc, _ := f.Open()
    contenido, _ := io.ReadAll(rc)
    rc.Close()
    fmt.Println(string(contenido))
}
```

| Función | Descripción |
|---------|-------------|
| `zip.OpenReader(name string)` | Abre un ZIP desde disco |
| `zip.NewReader(r io.ReaderAt, size int64)` | Abre un ZIP desde un Reader (ej: bytes) |
| `f.Open()` | Abre el archivo comprimido para lectura |
| `f.Name` | Nombre del archivo dentro del ZIP |

---

## Extraer archivos de un ZIP

```go
r, _ := zip.OpenReader("archivo.zip")
defer r.Close()

for _, f := range r.File {
    // Prevenir Zip Slip
    destino := filepath.Join("salida", f.Name)
    if !strings.HasPrefix(destino, filepath.Clean("salida")+string(os.PathSeparator)) {
        continue // evita path traversal
    }

    if f.FileInfo().IsDir() {
        os.MkdirAll(destino, f.Mode())
        continue
    }

    os.MkdirAll(filepath.Dir(destino), 0755)
    out, _ := os.OpenFile(destino, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
    rc, _ := f.Open()
    io.Copy(out, rc)
    out.Close()
    rc.Close()
}
```

---

## Método de compresión

```go
// En FileHeader se puede especificar:
cabecera.Method = zip.Deflate  // comprimir (por defecto)
cabecera.Method = zip.Store    // solo almacenar, sin comprimir
```

---

[← Volver al índice](/indice)
