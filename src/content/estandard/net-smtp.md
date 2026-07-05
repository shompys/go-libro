# net/smtp

Cliente SMTP para envío de correo electrónico según RFC 5321.

```go
import "net/smtp"
```

---

## SendMail

```go
func SendMail(addr string, a Auth, from string, to []string, msg []byte) error
```

Envía un correo electrónico. Conecta al servidor SMTP, autentica (si `a` no es `nil`), establece remitente y destinatarios, y envía el mensaje.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| addr | `string` | Dirección del servidor SMTP (`host:port`) |
| a | `Auth` | Mecanismo de autenticación (puede ser `nil`) |
| from | `string` | Dirección del remitente |
| to | `[]string` | Lista de destinatarios |
| msg | `[]byte` | Mensaje completo en formato RFC 822 (cabeceras + cuerpo) |

| Retorno | Descripción |
|---------|-------------|
| `error` | `nil` si se envió correctamente |

---

## PlainAuth

```go
func PlainAuth(identity, username, password, host string) Auth
```

Implementa autenticación PLAIN (RFC 4616). Solo debe usarse sobre conexiones TLS.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| identity | `string` | Identidad (usualmente `""`) |
| username | `string` | Nombre de usuario |
| password | `string` | Contraseña |
| host | `string` | Host del servidor SMTP |

---

## Interfaz Auth

```go
type Auth interface {
	Start(server *ServerInfo) (proto string, toServer []byte, err error)
	Next(fromServer []byte, more bool) (toServer []byte, err error)
}
```

Interfaz para mecanismos de autenticación SMTP.

---

## Tipo Client

Representa una conexión cliente a un servidor SMTP. Permite más control que `SendMail`.

### Funciones sobre Client

| Función | Firma | Descripción |
|---------|-------|-------------|
| Dial | `Dial(addr string) (*Client, error)` | Conecta al servidor SMTP |
| NewClient | `NewClient(conn net.Conn, host string) (*Client, error)` | Crea cliente sobre conexión existente |

### Métodos de Client

| Método | Descripción |
|--------|-------------|
| `Hello(localName string) error` | Envía HELO/EHLO |
| `StartTLS(config *tls.Config) error` | Inicia sesión TLS |
| `Auth(a Auth) error` | Autentica con el servidor |
| `Mail(from string) error` | Establece el remitente |
| `Rcpt(to string) error` | Añade un destinatario |
| `Data() (io.WriteCloser, error)` | Envía el cuerpo del mensaje |
| `Quit() error` | Cierra la sesión |
| `Close() error` | Cierra la conexión |
| `Extension(ext string) (bool, string)` | ¿Soporta el servidor esta extensión? |
| `Reset() error` | Reinicia la sesión |
| `Noop() error` | Mantiene viva la sesión |
| `TLSConnectionState() (tls.ConnectionState, bool)` | Estado TLS de la conexión |

---

## Tipo ServerInfo

```go
type ServerInfo struct {
	Name string   // Nombre del servidor
	TLS  bool     // ¿Usa TLS?
	Auth []string // Mecanismos de autenticación soportados
}
```

---

## Ejemplo: Enviar un correo

```go
package main

import (
	"log"
	"net/smtp"
)

func main() {
	auth := smtp.PlainAuth("", "user@gmail.com", "password", "smtp.gmail.com")

	msg := []byte("From: sender@example.com\r\n" +
		"To: recipient@example.com\r\n" +
		"Subject: Asunto de prueba\r\n" +
		"\r\n" +
		"Este es el cuerpo del mensaje.\r\n")

	err := smtp.SendMail("smtp.gmail.com:587", auth,
		"sender@example.com",
		[]string{"recipient@example.com"},
		msg)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Correo enviado exitosamente")
}
```

---

## Ejemplo: Cliente con control fino

```go
conn, err := net.Dial("tcp", "smtp.example.com:25")
if err != nil {
	log.Fatal(err)
}

client, err := smtp.NewClient(conn, "smtp.example.com")
if err != nil {
	log.Fatal(err)
}
defer client.Close()

client.Hello("localhost")
client.StartTLS(nil)
client.Auth(smtp.PlainAuth("", "user", "pass", "smtp.example.com"))
client.Mail("sender@example.com")
client.Rcpt("recipient@example.com")

w, _ := client.Data()
w.Write([]byte("Subject: Hola\r\n\r\nCuerpo\r\n"))
w.Close()

client.Quit()
```

---

[← Volver al índice](/indice)
