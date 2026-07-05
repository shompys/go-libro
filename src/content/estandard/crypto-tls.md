# crypto/tls — TLS (Transport Layer Security)

Implementa TLS 1.2 y 1.3. Para HTTPS, usar [net/http](/net-http) (usa crypto/tls internamente).

```go
import "crypto/tls"
```

---

## Índice

- [Servidor TLS](/estandard/crypto-tls#servidor-tls)
- [Cliente TLS](/estandard/crypto-tls#cliente-tls)
- [Configuración (tls.Config)](/estandard/crypto-tls#configuración-tlsconfig)
- [GetCertificate, GetConfigForClient](/estandard/crypto-tls#config-avanzada:-getcertificate,-getconfigforclient)
- [VerifyPeerCertificate, KeyLogWriter](/estandard/crypto-tls#config-avanzada:-verifypeercertificate,-keylogwriter)
- [Generar certificado autofirmado (pruebas)](/estandard/crypto-tls#generar-certificado-autofirmado)
- [Obtener información de la conexión (ConnectionState)](/estandard/crypto-tls#obtener-información-de-la-conexión)
- [Tipo Conn y sus métodos](/estandard/crypto-tls#tipo-conn)
- [Session resumption (reanudación de sesión)](/estandard/crypto-tls#session-resumption-reanudación)
- [QUIC (Go 1.21+)](/estandard/crypto-tls#quic)
- [Funciones utilitarias (VersionName, CipherSuiteName)](/estandard/crypto-tls#funciones-utilitarias)

---

## Servidor TLS

```go
cert, _ := tls.LoadX509KeyPair("cert.pem", "key.pem")

config := &tls.Config{
    Certificates: []tls.Certificate{cert},
    MinVersion:   tls.VersionTLS12,
}

listener, _ := tls.Listen("tcp", ":8443", config)
defer listener.Close()

for {
    conn, _ := listener.Accept()
    go manejar(conn)
}
```

| Función | Descripción |
|---------|-------------|
| `tls.LoadX509KeyPair(certFile, keyFile string)` | Carga certificado y clave desde archivos |
| `tls.X509KeyPair(certPEM, keyPEM []byte)` | Carga desde bytes (PEM) |
| `tls.Listen(network, addr string, config *Config)` | Crea listener TLS |
| `tls.NewListener(inner net.Listener, config *Config)` | Envuelve un listener existente en TLS |

---

## Cliente TLS

```go
config := &tls.Config{
    InsecureSkipVerify: false, // true solo para pruebas
    ServerName:         "example.com",
}

conn, err := tls.Dial("tcp", "example.com:443", config)
if err != nil {
    log.Fatal(err)
}
defer conn.Close()

conn.Write([]byte("GET / HTTP/1.0\r\nHost: example.com\r\n\r\n"))
resp, _ := io.ReadAll(conn)
```

| Función | Descripción |
|---------|-------------|
| `tls.Dial(network, addr string, config *Config)` | Conecta a servidor TLS |
| `tls.DialWithDialer(dialer *net.Dialer, network, addr string, config *Config)` | Dial con timeout/config de red |

---

## Configuración (tls.Config)

```go
config := &tls.Config{
    MinVersion: tls.VersionTLS12,         // mínimo TLS 1.2
    MaxVersion: tls.VersionTLS13,         // máximo TLS 1.3
    Certificates: []tls.Certificate{cert},
    ServerName: "example.com",            // para cliente (SNI)
    InsecureSkipVerify: false,            // verificar certificado del servidor
    RootCAs: rootCAPool,                  // CAs de confianza personalizadas
    ClientAuth: tls.RequireAndVerifyClientCert, // pedir certificado al cliente
    ClientCAs: clientCAPool,              // CAs para verificar clientes
    CurvePreferences: []tls.CurveID{tls.X25519, tls.CurveP256},
    SessionTicketsDisabled: false,        // deshabilitar session tickets
}
```

| Campo | Descripción |
|-------|-------------|
| `MinVersion` | Versión mínima de TLS a aceptar |
| `MaxVersion` | Versión máxima de TLS |
| `Certificates` | Certificados del servidor |
| `ServerName` | Nombre del servidor para SNI y verificación |
| `InsecureSkipVerify` | `true` = no verifica certificado (solo pruebas) |
| `RootCAs` | Pool de certificados raíz de confianza |
| `ClientAuth` | Tipo de autenticación de cliente (NoClientCert, RequestClientCert, RequireAnyClientCert, VerifyClientCertIfGiven, RequireAndVerifyClientCert) |
| `ClientCAs` | CAs aceptadas para certificados de cliente |
| `CurvePreferences` | Curvas elípticas preferidas |
| `SessionTicketsDisabled` | Deshabilitar session tickets TLS |

---

## Config avanzada: GetCertificate, GetConfigForClient

### GetCertificate

Permite seleccionar el certificado dinámicamente según el SNI (Server Name Indication):

```go
config := &tls.Config{
    GetCertificate: func(info *tls.ClientHelloInfo) (*tls.Certificate, error) {
        // info.ServerName contiene el SNI solicitado
        cert, err := tls.LoadX509KeyPair(
            fmt.Sprintf("/certs/%s.pem", info.ServerName),
            fmt.Sprintf("/keys/%s.pem", info.ServerName),
        )
        return &cert, err
    },
}
```

### GetConfigForClient

Permite seleccionar toda la configuración TLS según el ClientHello:

```go
config := &tls.Config{
    GetConfigForClient: func(info *tls.ClientHelloInfo) (*tls.Config, error) {
        // Configuración custom según el cliente
        return serverConfig, nil
    },
}
```

---

## Config avanzada: VerifyPeerCertificate, KeyLogWriter

### VerifyPeerCertificate

Callback para verificación adicional de certificados del peer:

```go
config := &tls.Config{
    VerifyPeerCertificate: func(rawCerts [][]byte, chains [][]*x509.Certificate) error {
        // rawCerts: certificados en DER
        // chains: cadenas verificadas
        cert := chains[0][0]
        if cert.Subject.CommonName != "permitido.ejemplo.com" {
            return fmt.Errorf("CN no permitido: %s", cert.Subject.CommonName)
        }
        return nil
    },
}
```

### KeyLogWriter

Para debuggear tráfico TLS con Wireshark. Escribe los secretos TLS (NSS Key Log format):

```go
f, _ := os.Create("sslkeys.log")
config := &tls.Config{
    KeyLogWriter: f, // solo para debug; NUNCA en producción
}
```

---

## Generar certificado autofirmado (pruebas)

```go
// Generar con openssl:
// openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
```

---

## Obtener información de la conexión

```go
tlsConn := conn.(*tls.Conn)
estado := tlsConn.ConnectionState()

fmt.Println(estado.Version)              // versión TLS negociada
fmt.Println(estado.CipherSuite)          // cipher suite usado
fmt.Println(estado.ServerName)           // SNI
fmt.Println(estado.PeerCertificates)     // certificados del peer
fmt.Println(estado.NegotiatedProtocol)   // ALPN negociado
fmt.Println(estado.DidResume)            // ¿se reanudó sesión?
fmt.Println(estado.HandshakeComplete)    // ¿handshake completado?
```

### ConnectionState campos completos

```go
type ConnectionState struct {
    Version                     uint16                // versión TLS
    HandshakeComplete           bool                  // handshake terminado
    DidResume                   bool                  // ¿reanudación de sesión?
    CipherSuite                 uint16                // cipher suite
    NegotiatedProtocol          string                // protocolo ALPN negociado
    NegotiatedProtocolIsMutual  bool                  // ALPN mutuo
    ServerName                  string                // SNI
    PeerCertificates            []*x509.Certificate   // certificados del peer
    VerifiedChains              [][]*x509.Certificate // cadenas verificadas
    SignedCertificateTimestamps [][]byte              // SCTs
    OCSPResponse                []byte                // respuesta OCSP stapled
    TLSUnique                   []byte                // tls-unique channel binding
}
```

---

## Tipo Conn

```go
type Conn struct {
    // contiene campos no exportados
}
```

Métodos principales:

| Método | Descripción |
|--------|-------------|
| `Read(b []byte) (int, error)` | Lee datos del túnel TLS |
| `Write(b []byte) (int, error)` | Escribe datos al túnel TLS |
| `Close() error` | Cierra la conexión TLS (envía alerta close_notify) |
| `CloseWrite() error` | Cierra solo el lado de escritura (Go 1.20+) |
| `SetDeadline(t time.Time) error` | Deadline para lectura y escritura |
| `SetReadDeadline(t time.Time) error` | Deadline para lectura |
| `SetWriteDeadline(t time.Time) error` | Deadline para escritura |
| `LocalAddr() net.Addr` | Dirección local |
| `RemoteAddr() net.Addr` | Dirección remota |
| `ConnectionState() ConnectionState` | Estado de la conexión TLS |
| `Handshake() error` | Fuerza el handshake TLS |
| `HandshakeContext(ctx context.Context) error` | Handshake con contexto cancelable |
| `VerifyHostname(host string) error` | Verifica el hostname contra el certificado |
| `NetConn() net.Conn` | Devuelve la conexión de red subyacente (Go 1.18+) |

---

## Session resumption (reanudación de sesión)

### ClientSessionCache

Permite cachear sesiones TLS del lado cliente para reanudar en futuras conexiones:

```go
config := &tls.Config{
    ClientSessionCache: tls.NewLRUClientSessionCache(64), // cache para 64 sesiones
}
```

### ClientSessionState

Representa una sesión reanudable del lado cliente:

```go
type ClientSessionState struct {
    // contiene campos no exportados
}

func (cs *ClientSessionState) ResumptionState() ([]byte, error)
func NewResumptionState(state []byte) (*ClientSessionState, error)
```

### SessionTicketKey

Clave para encriptar los session tickets del lado servidor:

```go
type SessionTicketKey [32]byte

// Configurar claves (deben rotarse regularmente)
config := &tls.Config{
    SessionTicketKey: key,
}
```

---

## QUIC (Go 1.21+)

Configuración TLS para conexiones QUIC (HTTP/3):

```go
config := &tls.Config{...}

quicConfig := &tls.QUICConfig{
    TLSConfig: config,
}

// Niveles de encriptación QUIC
tls.QUICEncryptionLevelInitial
tls.QUICEncryptionLevelHandshake
tls.QUICEncryptionLevelApplication
tls.QUICEncryptionLevelEarly
```

---

## Funciones utilitarias

```go
// Nombre legible de versión TLS
name := tls.VersionName(tls.VersionTLS13) // "TLS 1.3"

// Nombre legible de cipher suite
name := tls.CipherSuiteName(tls.TLS_AES_256_GCM_SHA384) // "TLS_AES_256_GCM_SHA384"
```

### Constantes de versión

| Constante | Valor |
|-----------|-------|
| `tls.VersionTLS10` | 0x0301 |
| `tls.VersionTLS11` | 0x0302 |
| `tls.VersionTLS12` | 0x0303 |
| `tls.VersionTLS13` | 0x0304 |

---

[← Volver al índice](/indice)
