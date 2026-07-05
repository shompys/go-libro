# io — Interfaces de Entrada/Salida

Define las interfaces fundamentales `Reader` y `Writer` que usan todos los demás paquetes de Go.

```go
import "io"
```

---

## Índice

- [Reader](/estandard/io#reader)
- [Writer](/estandard/io#writer)
- [Funciones sobre Reader](/estandard/io#funciones-sobre-reader)
- [Funciones sobre Writer](/estandard/io#funciones-sobre-writer)
- [Funciones utilitarias](/estandard/io#funciones-utilitarias)
- [NopCloser, Discard, SectionReader, OffsetWriter](/estandard/io#utilidades-y-tipos-adicionales)

---

## Reader

Interfaz que todo lo que "se puede leer" implementa:

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}
```

| Parámetro | Qué es |
|-----------|--------|
| `p` | Buffer donde se guardan los bytes leídos |
| `n` | Cantidad de bytes leídos |
| `err` | `io.EOF` cuando se terminó de leer (no es un error real, es señal de fin) |

Todo implementa `io.Reader`: archivos, conexiones de red, request bodies, strings...

```go
f, _ := os.Open("archivo.txt")
var r io.Reader = f  // un archivo es un Reader
```

## Writer

Interfaz que todo lo que "se puede escribir" implementa:

```go
type Writer interface {
    Write(p []byte) (n int, err error)
}
```

Todo implementa `io.Writer`: archivos, respuestas HTTP, `os.Stdout`, buffers...

```go
var w io.Writer = os.Stdout
w.Write([]byte("Hola"))
```

## Funciones sobre Reader

### `io.ReadAll(r)`

Lee todo el contenido de un Reader:

```go
data, err := io.ReadAll(r)
// data es []byte
```

### `io.ReadFull(r, buf)`

Lee exactamente `len(buf)` bytes (o error):

```go
buf := make([]byte, 10)
n, err := io.ReadFull(r, buf)
```

### `io.LimitReader(r, n)`

Crea un Reader que solo lee `n` bytes y después devuelve EOF:

```go
limitado := io.LimitReader(r, 100)
```

### `io.MultiReader(readers...)`

Concatena varios Readers en uno solo:

```go
r := io.MultiReader(strings.NewReader("Hola "), strings.NewReader("mundo"))
io.ReadAll(r) // "Hola mundo"
```

### `io.TeeReader(r, w)`

Lee de `r` y simultáneamente escribe los mismos bytes en `w`:

```go
var buf bytes.Buffer
tee := io.TeeReader(r, &buf)
// cuando leas de tee, también se copia a buf
```

---

## Funciones sobre Writer

### `io.WriteString(w, s)`

Escribe un string a un Writer:

```go
io.WriteString(os.Stdout, "Hola\n")
```

### `io.MultiWriter(writers...)`

Escribe a varios Writers al mismo tiempo:

```go
var buf1, buf2 bytes.Buffer
w := io.MultiWriter(&buf1, &buf2)
w.Write([]byte("Hola")) // se escribe en ambos
```

---

## Funciones utilitarias

### `io.Copy(dst, src)`

Copia todo el contenido de un Reader a un Writer. **La más usada.**

```go
bytesCopiados, err := io.Copy(dstWriter, srcReader)
```

Ejemplo típico: copiar un archivo:

```go
src, _ := os.Open("origen.txt")
dst, _ := os.Create("copia.txt")
io.Copy(dst, src)
```

### `io.CopyN(dst, src, n)`

Copia exactamente `n` bytes:

```go
n, err := io.CopyN(dst, src, 1024)
```

### `io.ReadAtLeast(r, buf, min)`

Lee al menos `min` bytes (error si no hay suficientes).

### `io.Pipe()`

Crea un pipe en memoria: lo que escribís en un lado se lee del otro. Útil para conectar goroutines.

```go
pr, pw := io.Pipe()
// pr es *io.PipeReader, pw es *io.PipeWriter
```

`PipeReader` y `PipeWriter` son los tipos concretos que implementan `io.ReadCloser` e `io.WriteCloser` respectivamente. Se usan en goroutines:

```go
pr, pw := io.Pipe()
go func() {
    defer pw.Close()
    io.WriteString(pw, "datos desde goroutine")
}()
io.ReadAll(pr) // "datos desde goroutine"
```

---

## Utilidades y tipos adicionales

### `io.NopCloser(r)`

Envuelve un Reader para convertirlo en `ReadCloser` (con `Close` que no hace nada). Útil para testing o APIs que piden `ReadCloser`:

```go
rc := io.NopCloser(strings.NewReader("hola"))
defer rc.Close()
```

### `io.Discard`

Un `Writer` que descarta todo lo escrito (como `/dev/null`):

```go
io.WriteString(io.Discard, "esto se pierde")
// Útil cuando necesitás un Writer pero no querés guardar nada
```

### `io.LimitedReader` (struct)

El struct que está detrás de `io.LimitReader`:

```go
type LimitedReader struct {
    R Reader
    N int64 // bytes restantes
}
```

### `io.SectionReader`

Lee una sección de un `io.ReaderAt`. Útil para leer rangos de un archivo:

```go
sr := io.NewSectionReader(f, 100, 50)
// Lee 50 bytes a partir del offset 100 del archivo f
```

### `io.OffsetWriter` (Go 1.20+)

Escribe en un `io.WriterAt` con un offset fijo:

```go
ow := io.NewOffsetWriter(f, 1024)
ow.Write([]byte("datos")) // escribe en la posición 1024 de f
```

---

## Interfaces relacionadas

| Interfaz | Qué agrega a Reader/Writer |
|----------|---------------------------|
| `io.ReadWriter` | `Read` + `Write` |
| `io.ReadCloser` | `Read` + `Close` |
| `io.WriteCloser` | `Write` + `Close` |
| `io.ReadWriteCloser` | Las tres |
| `io.Seeker` | `Seek(offset, whence)` para mover el cursor |
| `io.ReaderAt` | `ReadAt(buf, offset)` sin mover cursor |
| `io.WriterAt` | `WriteAt(buf, offset)` sin mover cursor |

---

## EOF

`io.EOF` es una variable que indica "fin de archivo". **No** es un error fatal, es la señal normal de que no hay más datos:

```go
buf := make([]byte, 32)
for {
    n, err := r.Read(buf)
    if err == io.EOF {
        break // fin normal
    }
    if err != nil {
        log.Fatal(err) // error real
    }
    fmt.Print(string(buf[:n]))
}
```

---

[← Volver al índice](/indice)
