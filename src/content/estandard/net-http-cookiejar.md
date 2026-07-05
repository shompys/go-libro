# net/http/cookiejar

Implementación de un almacén de cookies HTTP compatible con la RFC 6265 para uso con `http.Client`.

```go
import "net/http/cookiejar"
```

---

## Interfaz Jar

`Jar` es la interfaz que debe implementar un gestor de cookies. `http.Client` la usa para almacenar y enviar cookies.

| Método | Firma | Descripción |
|--------|-------|-------------|
| SetCookies | `SetCookies(u *url.URL, cookies []*http.Cookie)` | Guarda las cookies recibidas de una URL |
| Cookies | `Cookies(u *url.URL) []*http.Cookie` | Devuelve las cookies que deben enviarse a una URL |

---

## Tipo Jar (implementación concreta)

El paquete exporta un tipo `Jar` que implementa la interfaz homónima.

### New

```go
func New(o *Options) (*Jar, error)
```

Crea un nuevo `*Jar` con las opciones especificadas.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| o | `*Options` | Política de almacenamiento (puede ser `nil` para usar la predeterminada) |

| Retorno | Tipo | Descripción |
|---------|------|-------------|
| jar | `*Jar` | El almacén de cookies creado |
| err | `error` | Error si las opciones son inválidas |

---

## Tipo Options

| Campo | Tipo | Descripción |
|-------|------|-------------|
| PublicSuffixList | `PublicSuffixList` | Define qué dominios son sufijos públicos (p.ej., `co.uk`). `nil` usa la lista pública real. |

---

## Tipo PublicSuffixList

Interfaz para definir sufijos públicos. El paquete no incluye implementación propia; normalmente se usa con `golang.org/x/net/publicsuffix`.

| Método | Descripción |
|--------|-------------|
| `PublicSuffix(domain string) string` | Devuelve el sufijo público del dominio |
| `String() string` | Representación en texto |

---

## Ejemplo de uso

```go
package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/cookiejar"
)

func main() {
	jar, err := cookiejar.New(nil)
	if err != nil {
		log.Fatal(err)
	}

	client := &http.Client{
		Jar: jar,
	}

	resp, err := client.Get("https://example.com")
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	fmt.Println("Cookies guardadas:", jar.Cookies(resp.Request.URL))
}
```

---

## Ejemplo con sufijo público personalizado

```go
jar, err := cookiejar.New(&cookiejar.Options{
	PublicSuffixList: myList,
})
```

---

[← Volver al índice](/indice)
