# path — Manipulación de paths URL

Operaciones sobre paths con separadores `/` (estilo URL). Para paths de sistema de archivos, usar `path/filepath`.

```go
import "path"
```

---

## Índice

- [Clean](/estandard/path#clean)
- [Split](/estandard/path#split)
- [Join](/estandard/path#join)
- [Dir y Base](/estandard/path#dir-y-base)
- [Ext](/estandard/path#ext)
- [IsAbs](/estandard/path#isabs)
- [Match](/estandard/path#match)

---

## Clean

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Clean` | `Clean(s string) string` | Normaliza el path eliminando `.` , `..` y `/` duplicados |

```go
path.Clean("/foo/bar/../baz")  // "/foo/baz"
path.Clean("/foo/./bar")        // "/foo/bar"
path.Clean("//foo///bar")       // "/foo/bar"
path.Clean("")                  // "."
```

---

## Split

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Split` | `Split(s string) (dir, file string)` | Divide en directorio y archivo |

```go
path.Split("/foo/bar/baz.txt")  // "/foo/bar/", "baz.txt"
path.Split("baz.txt")           // "", "baz.txt"
path.Split("/foo/bar/")         // "/foo/bar/", ""
```

---

## Join

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Join` | `Join(elem ...string) string` | Une elementos con `/` y limpia el resultado |

```go
path.Join("foo", "bar", "baz")    // "foo/bar/baz"
path.Join("/foo/", "/bar")        // "/foo/bar"
path.Join("foo", "", "bar")       // "foo/bar"
```

---

## Dir y Base

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Dir` | `Dir(s string) string` | Devuelve el directorio (todo menos el último elemento) |
| `Base` | `Base(s string) string` | Devuelve el último elemento del path |

```go
path.Dir("/foo/bar/baz.txt")   // "/foo/bar"
path.Base("/foo/bar/baz.txt")  // "baz.txt"
path.Dir("foo")                // "."
path.Base("")                  // "."
```

---

## Ext

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Ext` | `Ext(s string) string` | Devuelve la extensión (incluye el `.`) |

```go
path.Ext("archivo.tar.gz")  // ".gz"
path.Ext("foto.jpg")        // ".jpg"
path.Ext("README")          // ""
path.Ext(".hidden")         // ".hidden"
```

---

## IsAbs

| Función | Firma | Descripción |
|---------|-------|-------------|
| `IsAbs` | `IsAbs(s string) bool` | `true` si el path es absoluto (empieza con `/`) |

```go
path.IsAbs("/foo/bar")  // true
path.IsAbs("foo/bar")   // false
```

---

## Match

| Función | Firma | Descripción |
|---------|-------|-------------|
| `Match` | `Match(pattern, name string) (matched bool, err error)` | Verifica si `name` coincide con el patrón |

Patrones soportados:
- `*` — cualquier secuencia de caracteres excepto `/`
- `?` — un carácter cualquiera excepto `/`
- `[abc]` — uno de los caracteres entre corchetes
- `[a-z]` — rango de caracteres

```go
path.Match("*.go", "main.go")       // true, nil
path.Match("*.go", "dir/main.go")   // false, nil (* no cruza /)
path.Match("foo/?", "foo/a")        // true, nil
path.Match("foo/[a-z]", "foo/x")    // true, nil
```

> **Importante:** Usá `path` para URLs y paths con `/`. Para paths del sistema de archivos, usá `path/filepath`.

---

[← Volver al índice](/indice)
