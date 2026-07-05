# strings — Manipulación de Strings

Paquete para buscar, reemplazar, dividir, unir y transformar strings.

```go
import "strings"
```

---

## Índice

- [Buscar y contener](/estandard/strings#buscar-y-contener)
- [Igualdad y comparación](/estandard/strings#igualdad-y-comparación)
- [Mayúsculas y minúsculas](/estandard/strings#mayúsculas-y-minúsculas)
- [Reemplazar](/estandard/strings#reemplazar)
- [Dividir y unir](/estandard/strings#dividir-y-unir)
- [Prefijos y sufijos](/estandard/strings#prefijos-y-sufijos)
- [Espacios y recorte](/estandard/strings#espacios-y-recorte)
- [Repetir y contar](/estandard/strings#repoetir-y-contar)
- [Builder](/estandard/strings#builder-construir-strings-eficiente)
- [Cut, CutPrefix, CutSuffix](/estandard/strings#extraer-substrings-cut)
- [Clone, Repeat](/estandard/strings#clonar-y-repetir)
- [FieldsFunc](/estandard/strings#fieldsfunc)
- [Replacer](/estandard/strings#replacer-reemplazar-múltiples-substrings)
- [Reader](/estandard/strings#reader-leer-string-como-ioreader)

---

## Buscar y contener

| Función | Qué hace | Ejemplo |
|---------|----------|---------|
| `Contains(s, sub)` | ¿`sub` está en `s`? | `Contains("Hola", "ol")` → `true` |
| `ContainsAny(s, chars)` | ¿Algún char de `chars` está en `s`? | `ContainsAny("Hola", "aei")` → `true` |
| `ContainsRune(s, r)` | ¿El rune `r` está en `s`? | `ContainsRune("Hola", 'o')` → `true` |
| `HasPrefix(s, prefix)` | ¿Empieza con `prefix`? | `HasPrefix("Go.pdf", "Go")` → `true` |
| `HasSuffix(s, suffix)` | ¿Termina con `suffix`? | `HasSuffix("Go.pdf", ".pdf")` → `true` |
| `Index(s, sub)` | Posición de `sub` en `s` | `Index("Hola", "la")` → `2` |
| `IndexAny(s, chars)` | Primera posición de cualquier char | `IndexAny("Hola", "aeiou")` → `1` |
| `IndexByte(s, c byte)` | Posición del byte `c` | `IndexByte("Hola", 'o')` → `1` |
| `LastIndex(s, sub)` | Última posición | `LastIndex("ababa", "ba")` → `3` |
| `LastIndexAny(s, chars)` | Última posición de cualquier char | `LastIndexAny("Hola", "aeiou")` → `3` |
| `LastIndexByte(s, c byte)` | Última posición del byte `c` | `LastIndexByte("Hola", 'a')` → `3` |
| `Count(s, sub)` | Cuántas veces aparece `sub` | `Count("banana", "na")` → `2` |

---

## Igualdad y comparación

| Función | Qué hace |
|---------|----------|
| `EqualFold(s, t)` | Compara ignorando mayúsculas/minúsculas | 
| `Compare(a, b)` | `-1` si a < b, `0` si igual, `1` si a > b |

```go
strings.EqualFold("Go", "go")  // true
```

---

## Mayúsculas y minúsculas

| Función | Qué hace | Ejemplo |
|---------|----------|---------|
| `ToLower(s)` | A minúscula | `ToLower("HOLA")` → `"hola"` |
| `ToUpper(s)` | A mayúscula | `ToUpper("hola")` → `"HOLA"` |
| `ToTitle(s)` | Capitaliza cada palabra | `ToTitle("hola mundo")` → `"HOLA MUNDO"` |

---

## Reemplazar

| Función | Qué hace | Ejemplo |
|---------|----------|---------|
| `Replace(s, old, new, n)` | Reemplaza `old` por `new`, `n` veces (`-1` = todas) | `Replace("banana", "na", "ga", 1)` → `"bagana"` |
| `ReplaceAll(s, old, new)` | Reemplaza todas las ocurrencias | `ReplaceAll("banana", "na", "ga")` → `"bagaga"` |
| `Map(fn, s)` | Aplica función a cada rune | — |

---

## Dividir y unir

| Función | Qué hace | Ejemplo |
|---------|----------|---------|
| `Split(s, sep)` | Divide por separador | `Split("a,b,c", ",")` → `["a","b","c"]` |
| `SplitN(s, sep, n)` | Divide en `n` partes máximo | `SplitN("a,b,c", ",", 2)` → `["a","b,c"]` |
| `SplitAfter(s, sep)` | Divide **conservando** el separador | `SplitAfter("a,b", ",")` → `["a,","b"]` |
| `Fields(s)` | Divide por espacios | `Fields("a  b\tc")` → `["a","b","c"]` |
| `Join(elems, sep)` | Une slice con separador | `Join([]string{"a","b"}, ",")` → `"a,b"` |

---

## Espacios y recorte

| Función | Qué hace | Ejemplo |
|---------|----------|---------|
| `Trim(s, cutset)` | Recorta caracteres de los extremos | `Trim("!!!Hola!!!", "!")` → `"Hola"` |
| `TrimSpace(s)` | Recorta espacios, tabs, saltos de línea | `TrimSpace("  Hola  ")` → `"Hola"` |
| `TrimLeft(s, cutset)` | Solo izquierda | |
| `TrimRight(s, cutset)` | Solo derecha | |
| `TrimPrefix(s, prefix)` | Quita prefijo si existe | `TrimPrefix("src/main.go", "src/")` → `"main.go"` |
| `TrimSuffix(s, suffix)` | Quita sufijo si existe | `TrimSuffix("main.go", ".go")` → `"main"` |

---

## Constructor eficiente: `strings.Builder`

Para concatenar muchos strings en un loop, usá `Builder` en vez de `+=`. Es mucho más rápido porque no crea strings intermedios:

```go
var sb strings.Builder
sb.WriteString("Nombre: ")
sb.WriteString("Juan")
sb.WriteByte(' ')
fmt.Fprintf(&sb, "Edad: %d", 25)

resultado := sb.String() // "Nombre: Juan Edad: 25"
```

| Método | Qué hace |
|--------|----------|
| `WriteString(s)` | Agrega un string |
| `WriteByte(b)` | Agrega un byte |
| `WriteRune(r)` | Agrega un rune | 
| `Len()` | Longitud actual |
| `String()` | Devuelve el string construido |
| `Reset()` | Vacía el builder |
| `Grow(n)` | Reserva espacio para `n` bytes |

---

## Extraer substrings (Cut)

Go 1.18+. Divide un string en la primera ocurrencia de un separador:

```go
antes, despues, encontrado := strings.Cut("nombre=valor", "=")
// antes="nombre", despues="valor", encontrado=true

prefix, rest, ok := strings.CutPrefix("src/main.go", "src/")
// prefix="", rest="main.go", ok=true

rest, ok := strings.CutSuffix("main.go", ".go")
// rest="main", ok=true
```

| Función | Qué hace |
|---------|----------|
| `Cut(s, sep)` | Divide `s` en `sep`. Devuelve `(antes, después, encontrado)` |
| `CutPrefix(s, prefix)` | Quita `prefix` del inicio. Devuelve `(resto, ok)` |
| `CutSuffix(s, suffix)` | Quita `suffix` del final. Devuelve `(resto, ok)` |

---

## Clonar y repetir

```go
original := "hola"
copia := strings.Clone(original) // copia eficiente (Go 1.18+)

repetido := strings.Repeat("Go! ", 3) // "Go! Go! Go! "
```

| Función | Qué hace |
|---------|----------|
| `Clone(s) string` | Crea una copia del string |
| `Repeat(s string, count int) string` | Repite el string `count` veces |

---

## FieldsFunc

Divide un string usando una función personalizada:

```go
// Dividir por comas:
partes := strings.FieldsFunc("a,b,c", func(r rune) bool {
    return r == ','
})
// ["a", "b", "c"]
```

---

## Replacer (reemplazar múltiples substrings)

El tipo `strings.Replacer` reemplaza múltiples pares de strings de manera eficiente:

```go
r := strings.NewReplacer("a", "A", "b", "B", ".", "")
resultado := r.Replace("a.b") // "AB"
```

| Método de Replacer | Qué hace |
|--------------------|----------|
| `Replace(s string) string` | Aplica todos los reemplazos |
| `WriteString(w io.Writer, s string) (int, error)` | Escribe el resultado a un Writer |

---

## Reader (leer string como io.Reader)

Convierte un string en un `io.Reader`:

```go
r := strings.NewReader("Hola mundo")
buf := make([]byte, 4)
r.Read(buf) // buf = "Hola"

// Métodos disponibles:
r.Len()     // bytes restantes
r.Size()    // tamaño original
r.Reset("nuevo string") // reinicia con otro string
r.Seek(0, io.SeekStart) // volver al inicio
```

| Función | Qué devuelve |
|---------|-------------|
| `NewReader(s string) *Reader` | Crea un `io.Reader` desde un string |

El tipo `*strings.Reader` implementa `io.Reader`, `io.ReaderAt`, `io.Seeker`, `io.WriterTo`, `io.ByteScanner` y `io.RuneScanner`.
