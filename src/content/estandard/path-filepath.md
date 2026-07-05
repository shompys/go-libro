# path/filepath — Manipulación de rutas

Trabaja con rutas de archivos de forma portable entre sistemas operativos. `filepath` considera el separador del SO (`/` en Linux/macOS, `\` en Windows).

```go
import "path/filepath"
```

Hay también un paquete `path` que opera solo con `/` (útil para URLs), pero `filepath` es el que debés usar para archivos locales.

---

## Índice

- [Unir y dividir rutas](/estandard/path-filepath#unir-y-dividir-rutas)
- [Obtener partes de una ruta](/estandard/path-filepath#obtener-partes-de-una-ruta)
- [Limpiar y resolver rutas](/estandard/path-filepath#limpiar-y-resolver-rutas)
- [Validación y conversión](/estandard/path-filepath#validación-y-conversión)
- [Recorrer directorios](/estandard/path-filepath#recorrer-directorios-walk)
- [Glob (buscar con patrón)](/estandard/path-filepath#glob)
- [Extensiones](/estandard/path-filepath#extensiones)
- [Match (coincidencia de patrón)](/estandard/path-filepath#match)

---

## Unir y dividir rutas

| Función | Qué hace | Ejemplo |
|---------|----------|---------|
| `Join(elem...)` | Une partes con el separador del SO | `Join("a", "b", "c.txt")` → `"a/b/c.txt"` |
| `Split(path)` | Separa en dir + archivo | `Split("a/b/c.txt")` → `("a/b/", "c.txt")` |

```go
filepath.Join("docs", "2026", "reporte.pdf") // "docs/2026/reporte.pdf"
```

---

## Obtener partes de una ruta

| Función | Devuelve | Ejemplo |
|---------|----------|---------|
| `Base(path)` | Último componente (el archivo) | `Base("/a/b/c.txt")` → `"c.txt"` |
| `Dir(path)` | Directorio (todo menos el último) | `Dir("/a/b/c.txt")` → `"/a/b"` |
| `Ext(path)` | Extensión (con el punto) | `Ext("/a/b/c.txt")` → `".txt"` |
| `Abs(path)` | Ruta absoluta | `Abs("doc.txt")` → `"/home/user/doc.txt"` |

```go
filepath.Base("/home/user/docs/reporte.pdf")  // "reporte.pdf"
filepath.Dir("/home/user/docs/reporte.pdf")   // "/home/user/docs"
filepath.Ext("/home/user/docs/reporte.pdf")   // ".pdf"
```

---

## Limpiar y resolver rutas

| Función | Qué hace |
|---------|----------|
| `Clean(path)` | Limpia `..`, `.`, // duplicados |
| `Rel(base, target)` | Ruta relativa de `base` a `target` |
| `EvalSymlinks(path)` | Resuelve symlinks (solo Linux/macOS) |

```go
filepath.Clean("/a//b/../c/./d")  // "/a/c/d"
filepath.Rel("/a/b", "/a/b/c/d")  // "c/d"
```

---

## Validación y conversión

### IsAbs, IsLocal y HasPrefix

```go
filepath.IsAbs("/home/user/file.txt")     // true  (Linux/macOS)
filepath.IsAbs(`C:\Users\file.txt`)       // true  (Windows)
filepath.IsAbs("docs/reporte.pdf")        // false

filepath.IsLocal("/etc/passwd")           // false (ruta absoluta)
filepath.IsLocal("../fuera")              // false (escapa del directorio)
filepath.IsLocal("docs/reporte.pdf")      // true
filepath.IsLocal("")                      // false (vacío)

// HasPrefix — Go 1.23+. ¿`path` empieza con `prefix` como componente?
filepath.HasPrefix("/a/b/c", "/a/b")      // true
filepath.HasPrefix("/a/bc", "/a/b")       // false (bc ≠ b/)
```

| Función | Descripción |
|---------|------------|
| `IsAbs(path string) bool` | ¿Es ruta absoluta? |
| `IsLocal(path string) bool` | ¿Es una ruta local segura? (Go 1.20+) |
| `HasPrefix(path, prefix string) bool` | ¿`path` empieza con `prefix` como componente de ruta? (Go 1.23+) |

### Conversión de separadores

Convierte entre `/` y el separador nativo del SO:

```go
filepath.FromSlash("a/b/c")   // "a/b/c" en Linux, `a\b\c` en Windows
filepath.ToSlash(`a\b\c`)     // "a/b/c" en todos los SO
```

| Función | Descripción |
|---------|------------|
| `FromSlash(path string) string` | Convierte `/` al separador del SO |
| `ToSlash(path string) string` | Convierte el separador del SO a `/` |

### SplitList y VolumeName

`SplitList` divide una lista de rutas separadas por el separador de lista del SO (`:` en Linux, `;` en Windows). Útil para variables como `$PATH`:

```go
paths := filepath.SplitList("/usr/bin:/usr/local/bin:/home/user/go/bin")
// ["/usr/bin", "/usr/local/bin", "/home/user/go/bin"]
```

`VolumeName` devuelve el nombre del volumen (solo relevante en Windows — `C:`, `\\server\share`). En Linux siempre devuelve `""`:

```go
filepath.VolumeName(`C:\Users\file.txt`)  // "C:"
filepath.VolumeName("/home/user")          // ""
```

| Función | Descripción |
|---------|------------|
| `SplitList(path string) []string` | Divide lista de rutas por separador del SO |
| `VolumeName(path string) string` | Devuelve el componente de volumen (Windows) |

---

## Recorrer directorios (`Walk`)

Ejecuta una función para cada archivo y subdirectorio recursivamente:

```go
filepath.Walk("/home/user/docs", func(path string, info os.FileInfo, err error) error {
    if err != nil {
        return err
    }
    if !info.IsDir() {
        fmt.Println(path)
    }
    return nil
})
```

| Parámetro de callback | Qué es |
|-----------------------|--------|
| `path` | Ruta completa del archivo/directorio |
| `info` | `os.FileInfo` con metadata |
| `err` | Error al acceder (si hay) |

Devolvé `filepath.SkipDir` para saltar un directorio entero.

### WalkDir (Go 1.16+)

```go
filepath.WalkDir("/home/user/docs", func(path string, d fs.DirEntry, err error) error {
    if d.IsDir() { return nil }
    fmt.Println(path)
    return nil
})
```

Más rápido que `Walk` porque no lee `os.FileInfo` completo para cada entrada.

---

## Glob

Busca archivos que coincidan con un patrón:

```go
matches, _ := filepath.Glob("*.pdf")       // todos los .pdf en dir actual
matches, _ := filepath.Glob("data/*.json") // todos los .json en data/
matches, _ := filepath.Glob("**/*.go")     // todos los .go recursivo
```

| Comodín | Significado |
|---------|-------------|
| `*` | Cualquier secuencia de caracteres (excepto `/`) |
| `?` | Un solo carácter |
| `[abc]` | Un carácter del conjunto |
| `**` | Cero o más directorios (recursivo) |

---

## Extensiones

```go
ext := filepath.Ext("reporte.pdf")  // ".pdf"
sinExt := strings.TrimSuffix("reporte.pdf", ext)  // "reporte"
```

---

## Match

`Match` evalúa si un nombre individual coincide con un patrón (el mismo patrón que usa `Glob`), sin tocar el sistema de archivos:

```go
filepath.Match("*.go", "main.go")       // true, nil
filepath.Match("*.go", "main_test.go")  // true, nil
filepath.Match("data?.json", "data1.json") // true, nil
filepath.Match("data?.json", "data.json")  // false, nil
filepath.Match("[ab", "a")              // false, ErrBadPattern
```

| Función | Descripción |
|---------|------------|
| `Match(pattern, name string) (bool, error)` | ¿El nombre coincide con el patrón? |

---

[← Volver al índice](/indice)
