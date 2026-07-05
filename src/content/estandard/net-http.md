# net/http — Cliente y servidor HTTP

El paquete más importante para web. Implementa cliente y servidor HTTP.

```go
import "net/http"
```

---

## Índice

- [Cliente HTTP (GET, POST, etc.)](/estandard/net-http#cliente-http)
- [Client: Get, Post, PostForm, Do, Jar, CheckRedirect](/estandard/net-http#client---métodos-y-campos)
- [Request personalizada (headers, body)](/estandard/net-http#request-personalizada)
- [Campos del tipo Request](/estandard/net-http#campos-de-request)
- [Campos del tipo Response](/estandard/net-http#campos-de-response)
- [Servidor HTTP](/estandard/net-http#servidor-http)
- [HandlerFunc y Handle](/estandard/net-http#handlerfunc-y-handle)
- [ServeTLS y ListenAndServeTLS](/estandard/net-http#servetls-y-listenandservetls)
- [Mux y rutas (ServeMux)](/estandard/net-http#mux-enrutador)
- [Middleware](/estandard/net-http#middleware)
- [Archivos estáticos (FileServer, StripPrefix)](/estandard/net-http#archivos-estáticos)
- [ServeFile, ServeContent, DetectContentType](/estandard/net-http#servir-archivos-y-contenido)
- [Redirect, Error, NotFound, StatusText](/estandard/net-http#redirecciones-y-errores)
- [Leer request](/estandard/net-http#leer-request-query,-body,-headers)
- [Escribir response](/estandard/net-http#escribir-response)
- [Tipos de status y constantes de métodos HTTP](/estandard/net-http#tipos-de-status)
- [Cookies (Cookie, SetCookie)](/estandard/net-http#cookies)
- [MaxBytesReader, TimeoutHandler, AllowQuerySemicolons](/estandard/net-http#funciones-avanzadas)
- [Transport y RoundTripper](/estandard/net-http#transport-y-roundtripper)
- [Flusher, Hijacker, Pusher](/estandard/net-http#interfaces-extra)
- [ReadRequest y ReadResponse](/estandard/net-http#readrequest-y-readresponse)

---

## Cliente HTTP

### GET simple

```go
resp, err := http.Get("https://api.ejemplo.com/datos")
if err != nil { log.Fatal(err) }
defer resp.Body.Close()

body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))
```

| Método | URL | Body |
|--------|-----|------|
| `http.Get(url)` | GET | No |
| `http.Post(url, contentType, body)` | POST | `io.Reader` |
| `http.PostForm(url, data)` | POST | `url.Values` (form) |

### Cliente con timeout

```go
client := &http.Client{
    Timeout: 10 * time.Second,
}
resp, err := client.Get("https://api.ejemplo.com/datos")
```

**El `http.DefaultClient` no tiene timeout.** Siempre creá tu propio cliente.

---

## Client: métodos y campos

```go
client := &http.Client{
    Timeout:   30 * time.Second,
    Transport: &http.Transport{...},
    Jar:       cookieJar,
    CheckRedirect: func(req *http.Request, via []*http.Request) error {
        if len(via) >= 3 {
            return http.ErrUseLastResponse // no seguir más de 3 redirecciones
        }
        return nil
    },
}
```

| Campo de `http.Client` | Qué es |
|------------------------|--------|
| `Timeout` | Timeout total de la request |
| `Transport` | Transporte HTTP (proxies, TLS, pooling) |
| `Jar` | Manejo automático de cookies (implementa `http.CookieJar`) |
| `CheckRedirect` | Política de redirecciones |

| Método | Qué hace |
|--------|----------|
| `client.Get(url)` | GET con el cliente configurado |
| `client.Post(url, contentType, body)` | POST con el cliente configurado |
| `client.PostForm(url, data)` | POST con form-urlencoded |
| `client.Do(req)` | Envía una `*http.Request` personalizada |
| `client.CloseIdleConnections()` | Cierra conexiones inactivas en el pool |

---

## Request personalizada

Para setear headers, método, body, etc:

```go
req, _ := http.NewRequest("POST", "https://api.ejemplo.com/login", bodyReader)
req.Header.Set("Content-Type", "application/json")
req.Header.Set("Authorization", "Bearer token123")

resp, err := client.Do(req)
```

### Con contexto (recomendado)

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
resp, err := client.Do(req)
```

---

## Campos de Request

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Method` | `string` | Método HTTP (GET, POST, PUT, DELETE...) |
| `URL` | `*url.URL` | URL de la request |
| `Proto` | `string` | Versión del protocolo ("HTTP/1.1") |
| `ProtoMajor` | `int` | 1 |
| `ProtoMinor` | `int` | 1 |
| `Header` | `http.Header` | Headers de la request |
| `Body` | `io.ReadCloser` | Cuerpo de la request |
| `ContentLength` | `int64` | Longitud del contenido (-1 si no se conoce) |
| `Host` | `string` | Host de la request |
| `RemoteAddr` | `string` | Dirección remota (servidor) |
| `RequestURI` | `string` | URI original (servidor) |
| `Response` | `*http.Response` | Respuesta asociada (cliente) |
| `Context()` | `context.Context` | Contexto de la request |

---

## Campos de Response

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Status` | `string` | Status completo ("200 OK") |
| `StatusCode` | `int` | Código numérico (200) |
| `Proto` | `string` | Versión del protocolo |
| `Header` | `http.Header` | Headers de la respuesta |
| `Body` | `io.ReadCloser` | Cuerpo de la respuesta |
| `ContentLength` | `int64` | Longitud del contenido |
| `Request` | `*http.Request` | Request que generó esta respuesta |
| `TLS` | `*tls.ConnectionState` | Estado TLS (si es HTTPS) |

---

## Servidor HTTP

```go
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hola, %s!", r.URL.Path[1:])
})

http.ListenAndServe(":8080", nil)
```

| Función | Qué hace |
|---------|----------|
| `HandleFunc(path, handler)` | Registra una ruta con su handler |
| `Handle(path, handler)` | Registra un `http.Handler` en una ruta |
| `ListenAndServe(addr, nil)` | Arranca el servidor en `addr` |

### Servidor con configuración

```go
server := &http.Server{
    Addr:         ":8080",
    ReadTimeout:  10 * time.Second,
    WriteTimeout: 10 * time.Second,
    IdleTimeout:  60 * time.Second,
}
server.ListenAndServe()
```

---

## HandlerFunc y Handle

```go
// http.HandlerFunc convierte una función en Handler
type HandlerFunc func(http.ResponseWriter, *http.Request)

// http.Handle registra un Handler (interfaz) en una ruta
http.Handle("/ruta", http.HandlerFunc(miHandler))

// http.HandleFunc es azúcar sintáctico
http.HandleFunc("/ruta", miHandler)
```

La diferencia: `Handle` recibe un `http.Handler` (interfaz con método `ServeHTTP`), mientras que `HandleFunc` recibe directamente una función.

---

## ServeTLS y ListenAndServeTLS

```go
// Servidor HTTPS con certificados en archivos
http.ListenAndServeTLS(":443", "cert.pem", "key.pem", nil)

// Igual pero con server configurado
server := &http.Server{Addr: ":443", Handler: mux}
server.ListenAndServeTLS("cert.pem", "key.pem")

// Con TLS configurado manualmente
http.ServeTLS(listener, handler, "cert.pem", "key.pem")
```

---

## Mux (enrutador)

### ServeMux completo

Desde Go 1.22, el mux por defecto soporta métodos HTTP y path params:

```go
mux := http.NewServeMux()
mux.HandleFunc("GET /usuarios/{id}", func(w http.ResponseWriter, r *http.Request) {
    id := r.PathValue("id") // Go 1.22+
    fmt.Fprintf(w, "Usuario: %s", id)
})

http.ListenAndServe(":8080", mux)
```

| Método de ServeMux | Qué hace |
|---------------------|----------|
| `NewServeMux()` | Crea un nuevo ServeMux |
| `mux.Handle(pattern, handler)` | Registra un Handler con el patrón |
| `mux.HandleFunc(pattern, f)` | Registra una función handler |
| `mux.Handler(r)` | Devuelve el handler para una request |
| `mux.ServeHTTP(w, r)` | Implementa http.Handler |

**Patrones (Go 1.22+):**
- `/` coincide con cualquier path
- `GET /items/` coincide solo con GET
- `/items/{id}` captura parámetro de path con `r.PathValue("id")`
- `/items/{$}` coincide solo con `/items/` exactamente

---

## Middleware

```go
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Printf("%s %s", r.Method, r.URL.Path)
        next.ServeHTTP(w, r)
    })
}

mux := http.NewServeMux()
mux.HandleFunc("/", handler)
http.ListenAndServe(":8080", loggingMiddleware(mux))
```

---

## Archivos estáticos

### FileServer

```go
// Sirve archivos del directorio ./static en /
http.Handle("/", http.FileServer(http.Dir("./static")))

// Con StripPrefix para rutas con prefijo
http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
```

### FileServerFS (Go 1.22+)

```go
// Usa fs.FS en vez de http.Dir (más portable con embed)
http.Handle("/", http.FileServerFS(staticFS))
```

| Función | Qué hace |
|---------|----------|
| `http.FileServer(root)` | Sirve archivos desde un `http.FileSystem` |
| `http.FileServerFS(fsys)` | Sirve archivos desde un `fs.FS` (Go 1.22+) |
| `http.StripPrefix(prefix, h)` | Quita el prefijo de la URL antes de pasarla al handler |

---

## Servir archivos y contenido

```go
// Servir un archivo (con soporte Range, If-Modified-Since, etc.)
http.ServeFile(w, r, "/ruta/al/archivo.pdf")

// Servir contenido con control fino (tipo, tamaño, fechas)
http.ServeContent(w, r, "archivo.pdf", modTime, contentReader)

// Detectar Content-Type desde bytes
ctype := http.DetectContentType([]byte("%PDF-1.4...")) // "application/pdf"
```

---

## Redirecciones y errores

```go
// Redirección (301, 302, 303, 307, 308)
http.Redirect(w, r, "/nueva-ruta", http.StatusMovedPermanently)

// Respuesta de error con mensaje
http.Error(w, "No autorizado", http.StatusUnauthorized)

// 404 genérico
http.NotFound(w, r)

// Texto descriptivo de un código de status
msg := http.StatusText(404) // "Not Found"
```

| Constante | Código |
|-----------|--------|
| `StatusOK` | 200 |
| `StatusMovedPermanently` | 301 |
| `StatusFound` | 302 |
| `StatusSeeOther` | 303 |
| `StatusTemporaryRedirect` | 307 |
| `StatusPermanentRedirect` | 308 |
| `StatusBadRequest` | 400 |
| `StatusUnauthorized` | 401 |
| `StatusForbidden` | 403 |
| `StatusNotFound` | 404 |
| `StatusInternalServerError` | 500 |

---

## Leer request

```go
func handler(w http.ResponseWriter, r *http.Request) {
    r.Method            // "GET", "POST", etc.
    r.URL.Path          // "/usuarios/5"
    r.URL.Query().Get("q")  // query param ?q=hola
    r.Header.Get("Authorization")  // header
    
    // Leer body:
    body, _ := io.ReadAll(r.Body)
    r.Body.Close()
}
```

---

## Escribir response

```go
func handler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)  // código de status
    w.Write([]byte(`{"ok":true}`))
}
```

---

## Tipos de status y constantes de métodos HTTP

```go
// Métodos HTTP
http.MethodGet     // "GET"
http.MethodHead    // "HEAD"
http.MethodPost    // "POST"
http.MethodPut     // "PUT"
http.MethodPatch   // "PATCH"
http.MethodDelete  // "DELETE"
http.MethodConnect // "CONNECT"
http.MethodOptions // "OPTIONS"
http.MethodTrace   // "TRACE"
```

### Status codes

```go
http.StatusOK                  // 200
http.StatusCreated             // 201
http.StatusNoContent           // 204
http.StatusBadRequest          // 400
http.StatusUnauthorized        // 401
http.StatusForbidden           // 403
http.StatusNotFound            // 404
http.StatusMethodNotAllowed    // 405
http.StatusInternalServerError // 500
http.StatusBadGateway          // 502
```

---

## Cookies

### Cookie struct

```go
type Cookie struct {
    Name       string
    Value      string
    Path       string
    Domain     string
    Expires    time.Time
    RawExpires string
    MaxAge     int           // segundos; 0 = borrar, -1 = sesión
    Secure     bool          // solo HTTPS
    HttpOnly   bool          // inaccesible desde JS
    SameSite   SameSite      // Lax, Strict, None
    Raw        string
    Unparsed   []string
}
```

### SetCookie y leer cookies

```go
// Leer cookie de una request
cookie, err := r.Cookie("session")
for _, c := range r.Cookies() {
    fmt.Println(c.Name, c.Value)
}

// Escribir cookie en la response
http.SetCookie(w, &http.Cookie{
    Name:     "session",
    Value:    "abc123",
    Path:     "/",
    HttpOnly: true,
    Secure:   true,
    MaxAge:   3600,
})
```

---

## Funciones avanzadas

### ParseHTTPVersion

```go
major, minor, ok := http.ParseHTTPVersion("HTTP/1.1")
// major=1, minor=1, ok=true
```

### MaxBytesReader

```go
// Limita el tamaño del body de la request (protege contra ataques de gran payload)
r.Body = http.MaxBytesReader(w, r.Body, 1<<20) // 1 MB máximo
```

### TimeoutHandler

```go
// Envuelve un handler con un timeout
http.Handle("/lento", http.TimeoutHandler(miHandler, 2*time.Second, "timeout!"))
```

### AllowQuerySemicolons (Go 1.17+)

```go
// Permite usar ';' como separador de query params además de '&'
mux := http.NewServeMux()
mux.AllowQuerySemicolons()
// ?q=hola;page=1  ahora funciona igual que  ?q=hola&page=1
```

---

## Transport y RoundTripper

### RoundTripper (interfaz)

```go
type RoundTripper interface {
    RoundTrip(*Request) (*Response, error)
}
```

`http.DefaultTransport` es el transporte por defecto. `http.DefaultClient` lo usa.

### Transport configurable

```go
transport := &http.Transport{
    MaxIdleConns:        100,
    MaxIdleConnsPerHost: 10,
    IdleConnTimeout:     90 * time.Second,
    TLSHandshakeTimeout: 10 * time.Second,
    DisableCompression:  false,
    Proxy:               http.ProxyFromEnvironment,
}

client := &http.Client{
    Transport: transport,
    Timeout:   30 * time.Second,
}
```

| Campo de Transport | Descripción |
|---------------------|-------------|
| `MaxIdleConns` | Máximo de conexiones idle totales |
| `MaxIdleConnsPerHost` | Máximo de conexiones idle por host |
| `IdleConnTimeout` | Tiempo máximo de una conexión inactiva |
| `TLSHandshakeTimeout` | Timeout para handshake TLS |
| `DisableCompression` | Deshabilita Content-Encoding: gzip |
| `DisableKeepAlives` | Deshabilita keep-alive |
| `Proxy` | Función que devuelve proxy por request |
| `DialContext` | Función de dial personalizada |
| `ForceAttemptHTTP2` | Intenta HTTP/2 aunque no haya TLS |

---

## Interfaces extra

### Flusher

```go
// Permite enviar datos parciales (streaming, SSE)
type Flusher interface {
    Flush()
}

flusher, ok := w.(http.Flusher)
if ok {
    flusher.Flush()
}
```

### Hijacker

```go
// Toma control de la conexión TCP subyacente (para WebSocket, etc.)
type Hijacker interface {
    Hijack() (net.Conn, *bufio.ReadWriter, error)
}
```

### Pusher (HTTP/2 server push)

```go
type Pusher interface {
    Push(target string, opts *PushOptions) error
}

if pusher, ok := w.(http.Pusher); ok {
    pusher.Push("/static/style.css", nil)
}
```

---

## ReadRequest y ReadResponse

```go
// Leer una request HTTP desde un reader (útil para proxies, tests)
req, err := http.ReadRequest(bufio.NewReader(conn))

// Leer una respuesta HTTP desde un reader
resp, err := http.ReadResponse(bufio.NewReader(conn), req)
```

---

[← Volver al índice](/indice)
