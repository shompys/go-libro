# net/textproto

Soporte genérico para protocolos basados en texto con cabeceras estilo MIME. Usado internamente por `net/http` y `net/smtp`.

```go
import "net/textproto"
```

---

## Tipo Reader

Lee peticiones/respuestas de texto línea a línea desde un `io.Reader`.

```go
func NewReader(r *bufio.Reader) *Reader
```

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `ReadLine()` | `(string, error)` | Lee una línea (sin `\r\n`) |
| `ReadContinuedLine()` | `(string, error)` | Lee línea con continuación (`\r\n` + espacio/TAB) |
| `ReadCodeLine(expectCode int)` | `(code int, message string, err error)` | Lee línea de código numérico |
| `ReadDotLines()` | `([]string, error)` | Lee hasta línea con punto solo |
| `ReadDotBytes()` | `([]byte, error)` | Lee bytes hasta línea con punto solo |
| `ReadMIMEHeader()` | `(MIMEHeader, error)` | Lee bloque de cabeceras MIME |
| `ReadResponse(expectCode int)` | `(code int, message string, err error)` | Lee respuesta completa de varias líneas |
| `R` | `*bufio.Reader` | Reader subyacente |
| `Dot` | `*dotReader` | Estado interno del dot-reader |
| `UpcomingHeaderNewlines()` | `int` | Devuelve `\r\n` pendientes antes del siguiente header |

---

## Tipo Writer

Escribe peticiones/respuestas de texto línea a línea a un `io.Writer`.

```go
func NewWriter(w *bufio.Writer) *Writer
```

| Método | Descripción |
|--------|-------------|
| `PrintfLine(format string, args ...any) error` | Escribe línea con formato + `\r\n` |
| `DotWriter() io.WriteCloser` | Writer que codifica en formato dot |
| `W` | `*bufio.Writer` subyacente |

---

## Tipo Conn

Combina `Reader` y `Writer` sobre una conexión de red.

```go
func NewConn(conn io.ReadWriteCloser) *Conn
```

```go
func Dial(network, addr string) (*Conn, error)
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Reader | `Reader` | Lector de la conexión |
| Writer | `Writer` | Escritor de la conexión |

| Método | Descripción |
|--------|-------------|
| `Close() error` | Cierra la conexión |
| `Cmd(format string, args ...any) (id uint, err error)` | Envía comando y devuelve ID |

---

## Tipo Pipeline

Envía comandos en pipeline (sin esperar respuestas entre comandos).

```go
func (c *Conn) Pipeline() *Pipeline
```

| Método | Descripción |
|--------|-------------|
| `EndResponse(id uint) (uint, error)` | Espera respuesta para el ID de comando |
| `EndRequest(id uint) error` | Finaliza petición para el ID |
| `StartRequest(id uint) error` | Inicia petición para el ID |
| `StartResponse(id uint) (uint, error)` | Inicia respuesta para el ID |

---

## Tipo MIMEHeader

Representa cabeceras MIME como `map[string][]string`.

```go
type MIMEHeader map[string][]string
```

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `Add(key, value string)` | - | Añade valor a la cabecera |
| `Del(key string)` | - | Elimina una cabecera |
| `Get(key string)` | `string` | Primer valor de la cabecera |
| `Set(key, value string)` | - | Reemplaza todos los valores de la cabecera |
| `Values(key string)` | `[]string` | Todos los valores de la cabecera |

### CanonicalMIMEHeaderKey

```go
func CanonicalMIMEHeaderKey(s string) string
```

Convierte una clave a formato canónico (primera letra y letras tras guión en mayúscula). Ej: `"content-type"` → `"Content-Type"`.

---

## TrimString / TrimBytes

```go
func TrimString(s string) string
func TrimBytes(b []byte) []byte
```

Eliminan espacios iniciales y finales de cada línea.

---

## Ejemplo: Leer cabeceras MIME

```go
package main

import (
	"bufio"
	"fmt"
	"net/textproto"
	"strings"
)

func main() {
	input := "Content-Type: text/plain\r\n" +
		"X-Custom: valor1\r\n" +
		"X-Custom: valor2\r\n" +
		"\r\n" +
		"cuerpo...\r\n"

	reader := textproto.NewReader(bufio.NewReader(strings.NewReader(input)))
	header, err := reader.ReadMIMEHeader()
	if err != nil {
		panic(err)
	}

	fmt.Println("Content-Type:", header.Get("Content-Type"))
	fmt.Println("X-Custom values:", header.Values("X-Custom"))
}
```

---

## Ejemplo: Escribir en formato dot

```go
var buf bytes.Buffer
w := textproto.NewWriter(bufio.NewWriter(&buf))

dotWriter := w.DotWriter()
dotWriter.Write([]byte("línea 1\n.línea con punto escapada\nlínea 3\n"))
dotWriter.Close()
w.W.Flush()

fmt.Println(buf.String())
// línea 1
// ..línea con punto escapada
// línea 3
```

---

## Ejemplo: Dial y comandos

```go
conn, err := textproto.Dial("tcp", "example.com:119")
if err != nil {
	log.Fatal(err)
}
defer conn.Close()

_, msg, err := conn.ReadResponse(200)
if err != nil {
	log.Fatal(err)
}
fmt.Println("Respuesta del servidor:", msg)

id, err := conn.Cmd("GROUP misc.test")
if err != nil {
	log.Fatal(err)
}
conn.StartResponse(id)
conn.EndResponse(id)
```

---

[← Volver al índice](/indice)
