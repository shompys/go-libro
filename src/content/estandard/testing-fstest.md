# testing/fstest

Utilidades para probar implementaciones de `fs.FS` en tests.

```go
import "testing/fstest"
```

---

## TestFS

```go
func TestFS(fsys fs.FS, expected ...string)
```

Prueba que una implementación de `fs.FS` se comporte correctamente. Verifica que `Open`, `ReadDir`, `ReadFile`, `Stat`, `Glob`, y manejo de errores funcionen según la especificación de la interfaz. Solo reporta fallos; no hace `panic`.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| fsys | `fs.FS` | El sistema de archivos a probar |
| expected | `...string` | Lista de rutas esperadas dentro de `fsys` |

`TestFS` debe llamarse desde una función de test (usa `testing.T` internamente). Si el `fs.FS` no contiene los archivos esperados, o produce resultados incorrectos para alguna operación, reporta el error con `t.Error`.

---

## Tipo MapFS

```go
type MapFS map[string]*MapFile
```

Implementación simple de `fs.FS` basada en un mapa en memoria. Útil para tests.

### Métodos

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `Open(name string)` | `(fs.File, error)` | Abre un archivo del mapa |
| `ReadDir(name string)` | `([]fs.DirEntry, error)` | Lee un directorio del mapa |
| `ReadFile(name string)` | `([]byte, error)` | Lee el contenido completo de un archivo |
| `Stat(name string)` | `(fs.FileInfo, error)` | Información de un archivo |
| `Glob(pattern string)` | `([]string, error)` | Coincidencia de patrones glob |
| `Sub(dir string)` | `(fs.FS, error)` | Devuelve un subárbol enraizado en `dir` |

### ModTime

```go
var ModTime time.Time
```

Modification time usado por defecto por los archivos del `MapFS`. Por defecto es el momento en que se crea el `MapFS`.

---

## Tipo MapFile

```go
type MapFile struct {
	Data    []byte
	Mode    fs.FileMode
	ModTime time.Time
	Sys     any
}
```

Representa un archivo en un `MapFS`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Data | `[]byte` | Contenido del archivo |
| Mode | `fs.FileMode` | Modo y permisos del archivo |
| ModTime | `time.Time` | Tiempo de modificación |
| Sys | `any` | Información específica del sistema |

---

## Ejemplo: TestFS con MapFS

```go
package myfs_test

import (
	"testing"
	"testing/fstest"
)

func TestMyFS(t *testing.T) {
	fsys := fstest.MapFS{
		"hello.txt": &fstest.MapFile{
			Data: []byte("hello, world"),
		},
		"subdir/bye.txt": &fstest.MapFile{
			Data: []byte("goodbye"),
		},
	}

	fstest.TestFS(fsys, "hello.txt", "subdir/bye.txt")
}
```

---

## Ejemplo: MapFS como mock

```go
package main

import (
	"fmt"
	"io"
	"io/fs"
	"testing/fstest"
)

func main() {
	mfs := fstest.MapFS{
		"config.yaml": &fstest.MapFile{
			Data: []byte("port: 8080\n"),
		},
	}

	f, _ := mfs.Open("config.yaml")
	data, _ := io.ReadAll(f)
	fmt.Println(string(data)) // port: 8080
}
```

---

## Ejemplo: MapFS con directorios implícitos

```go
mfs := fstest.MapFS{
	"dir/file.txt": &fstest.MapFile{Data: []byte("contenido")},
}

// Los directorios intermedios se crean automáticamente
entries, _ := fs.ReadDir(mfs, "dir")
fmt.Println(entries[0].Name()) // file.txt
```

---

[← Volver al índice](/indice)
