# bytes — Manipulación de slices de bytes

El equivalente de [strings](/strings) pero para `[]byte`. Misma API, distintos tipos.

```go
import "bytes"
```

---

## Índice

- [Comparar y buscar](/estandard/bytes#comparar-y-buscar)
- [Dividir y unir](/estandard/bytes#dividir-y-unir)
- [Cortar (Cut)](/estandard/bytes#cortar-cut)
- [Prefijos, sufijos y recorte](/estandard/bytes#prefijos,-sufijos-y-recorte)
- [Mayúsculas, minúsculas y título](/estandard/bytes#mayúsculas,-minúsculas-y-título)
- [Reemplazar y transformar](/estandard/bytes#reemplazar-y-transformar)
- [Clone y Repeat](/estandard/bytes#clone-y-repeat)
- [Reader (bytes.Reader)](/estandard/bytes#reader-bytesreader)
- [Buffer (crear []byte eficiente)](/estandard/bytes#buffer-el-constructor)

---

## Comparar y buscar

| Función | Equivalente en `strings` |
|---------|--------------------------|
| `Contains(b, sub)` | `strings.Contains` |
| `ContainsAny(b, chars)` | `strings.ContainsAny` |
| `ContainsRune(b, r)` | `strings.ContainsRune` — ¿contiene el rune `r`? |
| `HasPrefix(b, prefix)` | `strings.HasPrefix` |
| `HasSuffix(b, suffix)` | `strings.HasSuffix` |
| `Index(b, sub)` | `strings.Index` |
| `IndexAny(b, chars)` | `strings.IndexAny` — índice de cualquiera de `chars` |
| `IndexByte(b, c)` | `strings.IndexByte` — índice del byte `c` (más rápido) |
| `IndexFunc(b, f)` | `strings.IndexFunc` — índice del primer byte que cumple `f` |
| `LastIndex(b, sub)` | `strings.LastIndex` — última ocurrencia |
| `LastIndexAny(b, chars)` | `strings.LastIndexAny` |
| `LastIndexByte(b, c)` | `strings.LastIndexByte` |
| `LastIndexFunc(b, f)` | `strings.LastIndexFunc` |
| `Count(b, sub)` | `strings.Count` |
| `Equal(a, b)` | `==` en strings |
| `EqualFold(a, b)` | `strings.EqualFold` |

```go
bytes.Contains([]byte("Hola mundo"), []byte("mundo")) // true
bytes.Equal([]byte("go"), []byte("Go"))                // false
```

## Dividir y unir

| Función | Equivalente |
|---------|------------|
| `Split(b, sep)` | `strings.Split` |
| `SplitN(b, sep, n)` | `strings.SplitN` |
| `SplitAfter(b, sep)` | `strings.SplitAfter` |
| `SplitAfterN(b, sep, n)` | `strings.SplitAfterN` |
| `Fields(b)` | `strings.Fields` |
| `FieldsFunc(b, f)` | `strings.FieldsFunc` — divide según función `f` |
| `Join(slices, sep)` | `strings.Join` |

Misma semántica que `strings`, pero entran y salen `[]byte`.

## Cortar (Cut)

Funciones introducidas en Go 1.18 para dividir un slice con separadores de forma más eficiente que `Split`:

```go
// Cut: divide en el primer separador encontrado
antes, despues, encontrado := bytes.Cut([]byte("clave=valor"), []byte("="))
// antes="clave", despues="valor", encontrado=true

// CutPrefix: quita prefijo si existe
resto, ok := bytes.CutPrefix([]byte("prefijo_texto"), []byte("prefijo_"))
// resto="texto", ok=true

// CutSuffix: quita sufijo si existe
resto, ok := bytes.CutSuffix([]byte("archivo.go"), []byte(".go"))
// resto="archivo", ok=true
```

| Función | Firma | Descripción |
|---------|-------|------------|
| `Cut(b, sep)` | `(before, after []byte, found bool)` | Corta en la primera ocurrencia de `sep` |
| `CutPrefix(b, prefix)` | `([]byte, bool)` | Quita `prefix` del inicio si existe |
| `CutSuffix(b, suffix)` | `([]byte, bool)` | Quita `suffix` del final si existe |

---

## Prefijos, sufijos y recorte

| Función | Equivalente |
|---------|------------|
| `TrimSpace(b)` | `strings.TrimSpace` |
| `Trim(b, cutset)` | `strings.Trim` |
| `TrimLeft(b, cutset)` | `strings.TrimLeft` |
| `TrimRight(b, cutset)` | `strings.TrimRight` |
| `TrimPrefix(b, prefix)` | `strings.TrimPrefix` |
| `TrimSuffix(b, suffix)` | `strings.TrimSuffix` |
| `TrimFunc(b, f)` | Recorta caracteres que cumplen `f(rune) bool` de ambos lados |
| `TrimLeftFunc(b, f)` | Recorta del inicio según `f` |
| `TrimRightFunc(b, f)` | Recorta del final según `f` |

```go
// Recortar todos los dígitos de ambos extremos
sinDigitos := bytes.TrimFunc([]byte("123abc456"), func(r rune) bool {
    return r >= '0' && r <= '9'
})
// sinDigitos = "abc"
```

## Mayúsculas, minúsculas y título

| Función | Equivalente |
|---------|------------|
| `ToLower(b)` | `strings.ToLower` |
| `ToUpper(b)` | `strings.ToUpper` |
| `ToTitle(b)` | `strings.ToTitle` — convierte a título (Title Case) |
| `Title(b)` | **Deprecado.** Usa `golang.org/x/text/cases` en su lugar |
| `ToValidUTF8(b, replacement)` | Reemplaza bytes UTF-8 inválidos con `replacement` |

## Reemplazar y transformar

| Función | Equivalente |
|---------|------------|
| `Replace(b, old, new, n)` | `strings.Replace` |
| `ReplaceAll(b, old, new)` | `strings.ReplaceAll` |
| `Map(mapping func(rune) rune, b)` | Aplica `mapping` a cada rune |
| `Repeat(b, count)` | Repite `b` `count` veces |
| `Runes(b)` | Convierte a `[]rune` (como `[]rune(string(b))`) |

```go
// Map: convertir cada rune a mayúscula
grito := bytes.Map(unicode.ToUpper, []byte("hola"))
// grito = []byte("HOLA")

// Repeat
eco := bytes.Repeat([]byte("na"), 3)
// eco = []byte("nanana")

// Runes
runes := bytes.Runes([]byte("Go"))
// runes = []rune{'G', 'o'}
```

## Clone

Copia un slice de bytes. A diferencia de `append([]byte{}, b...)`, no copia la capacidad sobrante:

```go
original := []byte("hola")
copia := bytes.Clone(original)
original[0] = 'H'
// copia sigue siendo "hola" — son independientes
```

| Función | Descripción |
|---------|------------|
| `Clone(b []byte) []byte` | Crea una copia independiente con capacidad exacta (Go 1.20+) |

---

## Reader (`bytes.Reader`)

Implementa `io.Reader`, `io.ReaderAt`, `io.WriterTo`, `io.Seeker`, `io.ByteScanner` y `io.RuneScanner` sobre un `[]byte` inmutable. Útil para tests y para tratar slices como streams:

```go
r := bytes.NewReader([]byte("Hola mundo"))

buf := make([]byte, 4)
r.Read(buf) // buf = "Hola"

r.Seek(5, io.SeekStart)
b, _ := r.ReadByte() // b = 'm'

// Tamaño y posición
fmt.Println(r.Len())  // bytes disponibles (sin leer)
fmt.Println(r.Size()) // tamaño total del slice original
```

| Constructor | Descripción |
|-------------|------------|
| `NewReader(b []byte) *Reader` | Crea un Reader sobre `b` (no copia el slice) |

| Método | Descripción |
|--------|------------|
| `Len() int` | Bytes sin leer |
| `Size() int64` | Tamaño total original |
| `Reset(b []byte)` | Reinicia con un nuevo slice |
| `Read(p []byte)` | Implementa `io.Reader` |
| `ReadAt(p []byte, off int64)` | Implementa `io.ReaderAt` |
| `ReadByte()` | Implementa `io.ByteReader` |
| `UnreadByte()` | Implementa `io.ByteScanner` |
| `ReadRune()` | Implementa `io.RuneReader` |
| `UnreadRune()` | Implementa `io.RuneScanner` |
| `Seek(offset int64, whence int)` | Implementa `io.Seeker` |
| `WriteTo(w io.Writer)` | Implementa `io.WriterTo` |

---

## Buffer

El `bytes.Buffer` es un buffer de bytes que crece dinámicamente. **Implementa `io.Reader` y `io.Writer`.** Es la forma más eficiente de construir `[]byte`:

```go
// Tres formas de crear un Buffer:
var buf bytes.Buffer                    // buffer vacío
buf2 := bytes.NewBuffer([]byte("inicio"))     // desde un slice existente
buf3 := bytes.NewBufferString("inicio")       // desde un string
```

| Constructor | Descripción |
|-------------|------------|
| `NewBuffer(buf []byte) *Buffer` | Crea un Buffer a partir de un slice (toma propiedad) |
| `NewBufferString(s string) *Buffer` | Crea un Buffer a partir de un string |

```go
var buf bytes.Buffer

buf.WriteString("Hola ")
buf.Write([]byte("mundo"))
fmt.Fprintf(&buf, " %d", 2026)

resultado := buf.Bytes()   // []byte
str := buf.String()        // string
```

| Método | Qué hace |
|--------|----------|
| `Write(p)` | Escribe bytes |
| `WriteString(s)` | Escribe string |
| `WriteByte(b)` | Escribe un byte |
| `WriteRune(r)` | Escribe un rune |
| `Read(p)` | Lee bytes (consumiéndolos del buffer) |
| `Bytes()` | Devuelve todo el contenido como `[]byte` |
| `String()` | Devuelve todo como string |
| `Len()` | Tamaño actual |
| `Reset()` | Vacía el buffer |
| `Grow(n)` | Reserva espacio |
| `Next(n)` | Devuelve los próximos `n` bytes y avanza el cursor |

---

[← Volver al índice](/indice)
