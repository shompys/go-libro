# net/mail

Procesamiento de mensajes de correo electrónico (RFC 5322) y parsing de direcciones.

```go
import "net/mail"
```

---

## ReadMessage

```go
func ReadMessage(r io.Reader) (*Message, error)
```

Lee un mensaje de correo desde `r` (formato RFC 5322). Devuelve el mensaje parseado.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| r | `io.Reader` | Fuente del mensaje (headers + cuerpo separados por línea vacía) |

| Retorno | Tipo | Descripción |
|---------|------|-------------|
| msg | `*Message` | Mensaje parseado |
| err | `error` | Error de parsing |

---

## Tipo Message

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Header | `Header` | Cabeceras del mensaje |
| Body | `io.Reader` | Cuerpo del mensaje |

---

## Tipo Header

`map[string][]string` con métodos específicos para cabeceras de correo.

| Método | Descripción |
|--------|-------------|
| `AddressList(key string) ([]*Address, error)` | Parsea una cabecera como lista de direcciones |
| `Date() (time.Time, error)` | Parsea la cabecera `Date` |
| `MsgIDList(key string) ([]string, error)` | Parsea una cabecera como lista de Message-IDs |
| `Get(key string) string` | Obtiene el primer valor de una cabecera |

---

## Tipo Address

Representa una dirección de correo electrónico.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Name | `string` | Nombre mostrado (puede ser vacío) |
| Address | `string` | Dirección de correo (ej: `user@example.com`) |

```go
func (a *Address) String() string
```

---

## ParseAddress / ParseAddressList

### ParseAddress

```go
func ParseAddress(address string) (*Address, error)
```

Parsea una única dirección de correo.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| address | `string` | Cadena con una dirección (ej: `"John Doe" <john@example.com>`) |

### ParseAddressList

```go
func ParseAddressList(list string) ([]*Address, error)
```

Parsea una lista de direcciones separadas por comas.

---

## Ejemplo: Leer un mensaje

```go
package main

import (
	"fmt"
	"log"
	"net/mail"
	"strings"
)

func main() {
	raw := "From: John <john@example.com>\r\n" +
		"To: Jane <jane@example.com>\r\n" +
		"Subject: Hola\r\n" +
		"\r\n" +
		"Cuerpo del mensaje.\r\n"

	msg, err := mail.ReadMessage(strings.NewReader(raw))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Subject:", msg.Header.Get("Subject"))

	from, _ := msg.Header.AddressList("From")
	for _, addr := range from {
		fmt.Println("Name:", addr.Name)
		fmt.Println("Address:", addr.Address)
	}
}
```

---

## Ejemplo: Parsear direcciones individuales

```go
addr, err := mail.ParseAddress(`"Juan Pérez" <juan@correo.com>`)
if err != nil {
	log.Fatal(err)
}
fmt.Println(addr.Name)    // Juan Pérez
fmt.Println(addr.Address) // juan@correo.com
```

---

[← Volver al índice](/indice)
