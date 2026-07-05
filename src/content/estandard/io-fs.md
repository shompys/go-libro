# io/fs — Interfaz de sistema de archivos (Go 1.16+)

Abstracción de sistema de archivos de solo lectura. Es la base de `embed`, `os.DirFS` y permite testear código que lee archivos sin tocar el disco.

```go
import "io/fs"
```

---

## Índice

- [Interfaz FS](/estandard/io-fs#interfaz-fs)
- [Interfaz File](/estandard/io-fs#interfaz-file)
- [Interfaces derivadas (ReadFileFS, ReadDirFS, StatFS, GlobFS, SubFS)](/estandard/io-fs#interfaces-derivadas)
- [Abrir y leer archivos](/estandard/io-fs#abrir-y-leer-archivos)
- [Leer directorios](/estandard/io-fs#leer-directorios)
- [Stat y FileInfo](/estandard/io-fs#stat-y-fileinfo)
- [Sub — sistema de archivos anidado](/estandard/io-fs#sub-—-sistema-de-archivos-anidado)
- [WalkDir](/estandard/io-fs#walkdir)
- [Glob](/estandard/io-fs#glob)
- [ValidPath](/estandard/io-fs#validpath)
- [Utilidades para DirEntry y FileInfo](/estandard/io-fs#utilidades-para-direntry-y-fileinfo)
- [Crear un FS desde el disco real](/estandard/io-fs#crear-un-fs-desde-el-disco-real)
- [FS de prueba con testing/fstest](/estandard/io-fs#fs-de-prueba-con-testing/fstest)

---

## Interfaz FS

```go
type FS interface {
    Open(name string) (File, error)
}
```

Todo sistema de archivos en Go implementa esta interfaz. `name` usa `/` como separador (incluso en Windows).

| Implementaciones comunes | Paquete |
|--------------------------|---------|
| `os.DirFS(dir)` | `os` |
| `embed.FS` | `embed` |
| `fstest.MapFS` | `testing/fstest` |

---

## Interfaz File

Devuelta por `FS.Open`:

```go
type File interface {
    Stat() (FileInfo, error)
    Read([]byte) (int, error)
    Close() error
}
```

Para directorios, además implementa `ReadDirFile`:

```go
type ReadDirFile interface {
    File
    ReadDir(n int) ([]DirEntry, error)
}
```

---

## Interfaces derivadas

Go define interfaces adicionales que un `fs.FS` puede implementar para exponer más capacidades. Las funciones top-level del paquete (`ReadFile`, `ReadDir`, `Stat`, `Glob`, `Sub`) verifican si el FS implementa la interfaz correspondiente para usar la implementación nativa, cayendo a un fallback genérico si no.

```go
type ReadFileFS interface {
    FS
    ReadFile(name string) ([]byte, error)
}

type ReadDirFS interface {
    FS
    ReadDir(name string) ([]DirEntry, error)
}

type StatFS interface {
    FS
    Stat(name string) (FileInfo, error)
}

type GlobFS interface {
    FS
    Glob(pattern string) ([]string, error)
}

type SubFS interface {
    FS
    Sub(dir string) (FS, error) // devuelve un FS enraizado en dir
}
```

| Interfaz | Método extra | Función top-level que la usa |
|----------|-------------|------------------------------|
| `ReadFileFS` | `ReadFile(name)` | `fs.ReadFile` |
| `ReadDirFS` | `ReadDir(name)` | `fs.ReadDir` |
| `StatFS` | `Stat(name)` | `fs.Stat` |
| `GlobFS` | `Glob(pattern)` | `fs.Glob` |
| `SubFS` | `Sub(dir)` | `fs.Sub` |

---

```go
var fSys fs.FS = os.DirFS(".")

f, err := fSys.Open("README.md")
if err != nil {
    log.Fatal(err)
}
defer f.Close()

data, err := io.ReadAll(f)
```

| Función | Descripción |
|---------|------------|
| `ReadFile(fsys FS, name string) ([]byte, error)` | Lee todo el archivo de una vez |

```go
data, err := fs.ReadFile(fSys, "README.md")
```

---

## Leer directorios

```go
entries, err := fs.ReadDir(fSys, ".")
for _, entry := range entries {
    fmt.Println(entry.Name(), entry.IsDir())
}
```

| Función | Descripción |
|---------|------------|
| `ReadDir(fsys FS, name string) ([]DirEntry, error)` | Lee un directorio, devuelve entradas ordenadas |

`DirEntry` es una interfaz ligera:

```go
type DirEntry interface {
    Name() string               // nombre base
    IsDir() bool                // es directorio?
    Type() FileMode             // tipo de archivo
    Info() (FileInfo, error)    // FileInfo completo
}
```

---

## Stat y FileInfo

```go
info, err := fs.Stat(fSys, "main.go")
if err != nil {
    log.Fatal(err)
}
fmt.Println("Nombre:", info.Name())
fmt.Println("Tamaño:", info.Size())
fmt.Println("Modo:", info.Mode())
fmt.Println("Es dir:", info.IsDir())
```

| Función | Descripción |
|---------|------------|
| `Stat(fsys FS, name string) (FileInfo, error)` | Obtiene FileInfo sin abrir el archivo |

`FileInfo` es una interfaz:

```go
type FileInfo interface {
    Name() string       // nombre base
    Size() int64        // tamaño en bytes
    Mode() FileMode     // permisos y tipo
    ModTime() time.Time // fecha de última modificación
    IsDir() bool        // es directorio?
    Sys() any           // datos del SO subyacente
}
```

`FileMode` define los bits de tipo y permiso:

| Constante | Significado |
|-----------|-------------|
| `ModeDir` | Directorio |
| `ModeSymlink` | Enlace simbólico |
| `ModeNamedPipe` | Pipe |
| `ModeSocket` | Socket |
| `ModeDevice` | Dispositivo |
| `ModeCharDevice` | Dispositivo de caracteres |
| `ModeIrregular` | No es archivo regular |

---

## Sub — sistema de archivos anidado

`fs.Sub` crea un nuevo `fs.FS` enraizado en un subdirectorio. Las rutas relativas al nuevo FS empiezan desde ese directorio:

```go
fSys := os.DirFS("/home/usuario/proyecto")

subFS, err := fs.Sub(fSys, "static")
if err != nil {
    log.Fatal(err)
}

// Ahora "style.css" apunta a "/home/usuario/proyecto/static/style.css"
data, _ := fs.ReadFile(subFS, "style.css")
```

Si el FS subyacente implementa `SubFS`, usa su método `Sub` (más eficiente). Si no, crea un wrapper que valida que las rutas no escapen del subdirectorio.

| Función | Descripción |
|---------|------------|
| `Sub(fsys FS, dir string) (FS, error)` | Crea un FS enraizado en `dir` |

---

## WalkDir

Recorre recursivamente un sistema de archivos (Go 1.16+):

```go
err := fs.WalkDir(fSys, ".", func(path string, d fs.DirEntry, err error) error {
    if err != nil {
        return err // error al acceder
    }
    fmt.Println(path)
    if d.IsDir() && d.Name() == ".git" {
        return fs.SkipDir // saltar este directorio
    }
    return nil
})
```

| Función | Descripción |
|---------|------------|
| `WalkDir(fsys FS, root string, fn WalkDirFunc) error` | Recorre `root` recursivamente |

La función callback `WalkDirFunc` recibe:

| Parámetro | Tipo | Contenido |
|-----------|------|-----------|
| `path` | `string` | Ruta completa relativa a `root` |
| `d` | `fs.DirEntry` | Entrada del directorio |
| `err` | `error` | Error al acceder (si hubo) |

La callback puede devolver:
- `nil` para continuar.
- `fs.SkipDir` para saltar un directorio completo.
- `fs.SkipAll` (Go 1.20+) para detener el recorrido.
- Cualquier `error` para abortar.

---

## Glob

Busca archivos por patrón (como `filepath.Glob` pero sobre un `fs.FS`):

```go
matches, err := fs.Glob(fSys, "*.go")
// ["main.go", "util.go", ...]
```

| Función | Descripción |
|---------|------------|
| `Glob(fsys FS, pattern string) ([]string, error)` | Busca archivos que coincidan con el patrón |

Patrones soportados:
- `*` — cualquier secuencia de caracteres (excepto `/`)
- `?` — un carácter cualquiera
- `[abc]` — un carácter del conjunto
- `[a-z]` — rango
- `**` — cualquier número de directorios intermedios (como `a/**/b`)

---

## ValidPath

Valida que una ruta sea segura (sin `..`, limpia, lexicográficamente correcta):

```go
fs.ValidPath("foo/bar")       // true
fs.ValidPath("../passwd")     // false
fs.ValidPath("/etc/passwd")   // false (no debe ser absoluta)
fs.ValidPath(".")             // false
```

| Función | Descripción |
|---------|------------|
| `ValidPath(name string) bool` | `true` si la ruta es válida para `fs.FS` |

---

## Utilidades para DirEntry y FileInfo

Funciones de conveniencia para convertir y formatear:

```go
// Convertir FileInfo a DirEntry (Go 1.17+)
info, _ := os.Stat("main.go")
entry := fs.FileInfoToDirEntry(info)

// Formatear para depuración
fmt.Println(fs.FormatDirEntry(entry))
// "-rw-r--r-- 1024 main.go"

fmt.Println(fs.FormatFileInfo(info))
// "-rw-r--r-- 1024 2026-07-05 12:00:00 main.go"
```

| Función | Descripción |
|---------|------------|
| `FileInfoToDirEntry(info FileInfo) DirEntry` | Convierte `FileInfo` a `DirEntry` (Go 1.17+) |
| `FormatDirEntry(dir DirEntry) string` | Representación formateada de un `DirEntry` (Go 1.23+) |
| `FormatFileInfo(info FileInfo) string` | Representación formateada de un `FileInfo` (Go 1.23+) |

---

## Crear un FS desde el disco real

```go
fSys := os.DirFS("/home/usuario/proyecto")
data, _ := fs.ReadFile(fSys, "go.mod")
```

`os.DirFS` envuelve un directorio del disco como `fs.FS`. Las rutas son relativas a ese directorio y no pueden escapar con `..`.

---

## FS de prueba con testing/fstest

`fstest.MapFS` permite crear un sistema de archivos en memoria para tests:

```go
import "testing/fstest"

func TestLeerConfig(t *testing.T) {
    fSys := fstest.MapFS{
        "config.json":  {Data: []byte(`{"debug": true}`)},
        "data/input.txt": {Data: []byte("contenido")},
    }

    data, err := fs.ReadFile(fSys, "config.json")
    // no toca el disco
}
```

---

[← Volver al índice](/indice)
