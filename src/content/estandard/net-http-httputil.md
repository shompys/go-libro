# net/http/httputil

Utilidades HTTP: proxy inverso, volcado de peticiones/respuestas, y servidor de prueba.

```go
import "net/http/httputil"
```

---

## ReverseProxy

Tipo que implementa `http.Handler` y reenvía peticiones a un servidor backend.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Director | `func(*http.Request)` | Modifica la petición antes de enviarla al backend |
| Transport | `http.RoundTripper` | Transporte usado para el proxy. `nil` usa `http.DefaultTransport` |
| FlushInterval | `time.Duration` | Intervalo de flush para respuestas streaming |
| ErrorLog | `*log.Logger` | Logger para errores. `nil` usa `log.Printf` |
| BufferPool | `BufferPool` | Pool de buffers para copia de respuesta |
| ModifyResponse | `func(*http.Response) error` | Modifica la respuesta del backend antes de devolverla |
| ErrorHandler | `func(http.ResponseWriter, *http.Request, error)` | Maneja errores del proxy |

### NewSingleHostReverseProxy

```go
func NewSingleHostReverseProxy(target *url.URL) *ReverseProxy
```

Crea un `ReverseProxy` que reenvía peticiones a un único host (`target`).

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| target | `*url.URL` | URL del backend de destino |

---

## DumpRequest / DumpResponse

### DumpRequest

```go
func DumpRequest(req *http.Request, body bool) ([]byte, error)
```

Devuelve la representación textual de una petición HTTP, similar a como se envía por cable.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| req | `*http.Request` | La petición a volcar |
| body | `bool` | Si `true`, incluye el cuerpo de la petición |

### DumpRequestOut

```go
func DumpRequestOut(req *http.Request, body bool) ([]byte, error)
```

Similar a `DumpRequest` pero incluye cabeceras que un `http.Transport` añadiría (como `User-Agent`).

### DumpResponse

```go
func DumpResponse(resp *http.Response, body bool) ([]byte, error)
```

Devuelve la representación textual de una respuesta HTTP.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| resp | `*http.Response` | La respuesta a volcar |
| body | `bool` | Si `true`, incluye el cuerpo de la respuesta |

---

## Ejemplo: Proxy inverso simple

```go
package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func main() {
	target, _ := url.Parse("http://localhost:8080")
	proxy := httputil.NewSingleHostReverseProxy(target)

	log.Fatal(http.ListenAndServe(":9090", proxy))
}
```

---

## Ejemplo: Volcado de petición

```go
req, _ := http.NewRequest("GET", "https://example.com", nil)
dump, _ := httputil.DumpRequestOut(req, false)
fmt.Println(string(dump))
// GET / HTTP/1.1
// Host: example.com
// User-Agent: Go-http-client/1.1
// Accept-Encoding: gzip
```

---

## BufferPool (interfaz)

```go
type BufferPool interface {
	Get() []byte
	Put([]byte)
}
```

Interfaz opcional para reutilizar buffers de copia en `ReverseProxy`.

---

[← Volver al índice](/indice)
