# embed — Incrustar archivos en el binario

Incluye archivos y directorios dentro del binario compilado. Disponible desde Go 1.16.

```go
import "embed"
```

**No se importa explícitamente** en el código (solo se usa con `//go:embed`). Si tu linter se queja, agregá `_ "embed"`.

---

## Incrustar un archivo

```go
import _ "embed"

//go:embed config.json
var configData []byte    // como bytes

//go:embed plantilla.html
var plantilla string     // como string
```

---

## Incrustar múltiples archivos

```go
//go:embed *.html
var templates embed.FS   // sistema de archivos virtual

tmpl, _ := template.ParseFS(templates, "pagina.html")
```

---

## Incrustar un directorio entero

```go
//go:embed static/*
var staticFiles embed.FS

// Servir archivos estáticos:
http.Handle("/static/", http.FileServer(http.FS(staticFiles)))
```

**Cuidado:** `*` no incluye subdirectorios. Para incluir todo recursivamente usá `all:`:

```go
//go:embed all:migrations
var migrations embed.FS
```

---

## Leer desde embed.FS

```go
//go:embed data
var dataFS embed.FS

// Abrir un archivo (devuelve fs.File, compatible con io/fs)
f, err := dataFS.Open("data/archivo.txt")
if err != nil {
    log.Fatal(err)
}
defer f.Close()
contenido, _ := io.ReadAll(f)

// Leer archivo completo de una vez
contenido, _ = dataFS.ReadFile("data/archivo.txt")

// Listar contenidos de un directorio
entries, _ := dataFS.ReadDir("data")
for _, e := range entries {
    fmt.Println(e.Name(), e.IsDir())
}
```

| Método | Descripción |
|--------|------------|
| `Open(name string) (fs.File, error)` | Abre un archivo para lectura (implementa `fs.FS`) |
| `ReadFile(name string) ([]byte, error)` | Lee el archivo completo (implementa `fs.ReadFileFS`) |
| `ReadDir(name string) ([]fs.DirEntry, error)` | Lista entradas de un directorio (implementa `fs.ReadDirFS`) |

`embed.FS` implementa `fs.ReadFileFS` y `fs.ReadDirFS`, por lo que `fs.ReadFile(fs, name)` y `fs.ReadDir(fs, name)` usan la implementación nativa del embed en vez del fallback genérico.

---

[← Volver al índice](/indice)
