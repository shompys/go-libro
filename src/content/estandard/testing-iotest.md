# testing/iotest

Utilidades para probar código que usa `io.Reader` y `io.Writer`, incluyendo lectores con fallas inyectadas y lectores con comportamiento especial.

```go
import "testing/iotest"
```

---

## ErrReader (Go 1.24+)

```go
func ErrReader(err error) io.Reader
```

Devuelve un `io.Reader` que siempre falla con el error especificado (incluso en la primera lectura).

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| err | `error` | Error a devolver en cada `Read` |

---

## OneByteReader

```go
func OneByteReader(r io.Reader) io.Reader
```

Envuelve un `io.Reader` para que cada llamada a `Read` devuelva como máximo 1 byte. Útil para probar que el código manejado por el usuario no asume lecturas grandes.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| r | `io.Reader` | Reader a envolver |

---

## TimeoutReader

```go
func TimeoutReader(r io.Reader) io.Reader
```

Devuelve un `io.Reader` que produce un error de timeout (`os.ErrDeadlineExceeded`) en la **segunda** llamada a `Read`, sin importar si se leyeron datos. La primera lectura no produce error. Útil para probar manejo de timeouts.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| r | `io.Reader` | Reader subyacente |

---

## HalfReader

```go
func HalfReader(r io.Reader) io.Reader
```

Envuelve un `io.Reader` para que cada llamada a `Read` devuelva como máximo la mitad de los bytes solicitados (redondeado hacia arriba). Ej: si se piden 10 bytes, devuelve máximo 5.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| r | `io.Reader` | Reader a envolver |

---

## DataErrReader

```go
func DataErrReader(r io.Reader) io.Reader
```

Modifica la forma en que `r` devuelve errores. El último bloque de datos se devuelve junto con `io.EOF` (o el error final) en la misma llamada a `Read`, en lugar de en llamadas separadas.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| r | `io.Reader` | Reader a envolver |

---

## NewReadLogger / NewWriteLogger

### NewReadLogger

```go
func NewReadLogger(prefix string, r io.Reader) io.Reader
```

Envuelve un `io.Reader` para que registre cada operación de lectura con `log.Printf`. El `prefix` se añade antes de cada mensaje.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| prefix | `string` | Prefijo para los mensajes de log |
| r | `io.Reader` | Reader a envolver |

### NewWriteLogger

```go
func NewWriteLogger(prefix string, w io.Writer) io.Writer
```

Envuelve un `io.Writer` para que registre cada operación de escritura con `log.Printf`.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| prefix | `string` | Prefijo para los mensajes de log |
| w | `io.Writer` | Writer a envolver |

---

## TestReader

```go
func TestReader(r io.Reader, content []byte) error
```

Verifica que al leer desde `r` se obtenga exactamente `content`. Si la lectura produce datos diferentes, más datos, genera `io.EOF` incorrectamente, etc., devuelve un error descriptivo.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| r | `io.Reader` | Reader a verificar |
| content | `[]byte` | Contenido esperado |

| Retorno | Descripción |
|---------|-------------|
| `error` | `nil` si la lectura es correcta, error descriptivo en caso contrario |

---

## TruncateWriter

```go
func TruncateWriter(w io.Writer, n int64) io.Writer
```

Devuelve un `io.Writer` que acepta escrituras pero descarta todos los bytes después de los primeros `n`.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| w | `io.Writer` | Writer subyacente |
| n | `int64` | Número máximo de bytes a conservar |

---

## Ejemplo: ErrReader para probar manejo de errores

```go
package main

import (
	"fmt"
	"io"
	"testing/iotest"
)

func main() {
	r := iotest.ErrReader(fmt.Errorf("fallo simulado"))

	buf := make([]byte, 10)
	_, err := r.Read(buf)
	fmt.Println(err) // fallo simulado
}
```

---

## Ejemplo: TestReader en un test

```go
package mypkg_test

import (
	"strings"
	"testing"
	"testing/iotest"
)

func TestMyReader(t *testing.T) {
	r := strings.NewReader("hola mundo")
	err := iotest.TestReader(r, []byte("hola mundo"))
	if err != nil {
		t.Fatal(err)
	}
}
```

---

## Ejemplo: Combinar wrappers

```go
// Reader que nunca devuelve más de 1 byte y además loguea
r := strings.NewReader("datos de prueba")
r = iotest.OneByteReader(r)
r = iotest.NewReadLogger("lectura: ", r)

buf := make([]byte, 1024)
n, _ := r.Read(buf)
fmt.Println(string(buf[:n]))
// Salida log:
// lectura: Read(1024) => (1, <nil>)
// luego:
// lectura: Read(1024) => (1, <nil>) ... etc.
```

---

## Ejemplo: Probar timeout

```go
r := strings.NewReader("abcdefghijklmnop")
r = iotest.TimeoutReader(r)

buf := make([]byte, 10)
n1, err1 := r.Read(buf) // primera lectura: ok, n1=10, err1=nil
n2, err2 := r.Read(buf) // segunda lectura: err2=os.ErrDeadlineExceeded
```

---

[← Volver al índice](/indice)
