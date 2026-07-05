# net/url — Parsear y construir URLs

```go
import "net/url"
```

---

## Índice

- [Parsear una URL](/estandard/net-url#parsear-una-url)
- [Campos del tipo URL](/estandard/net-url#campos-del-tipo-url)
- [Query params](/estandard/net-url#query-params)
- [Values: Add, Set, Del, Has, Get, Encode](/estandard/net-url#values---métodos-completos)
- [Construir URL desde cero](/estandard/net-url#construir-url-desde-cero)
- [Query params para POST form](/estandard/net-url#query-params-para-post-form)
- [Escape y Unescape de URLs](/estandard/net-url#escape-y-unescape)
- [ParseRequestURI](/estandard/net-url#parserequesturi)
- [User y UserPassword](/estandard/net-url#user-y-userpassword)

---

## Parsear una URL

```go
u, _ := url.Parse("https://juan:secreto@example.com:8080/ruta?q=hola&page=1#seccion")
```

| Campo | Valor parseado |
|-------|----------------|
| `u.Scheme` | `"https"` |
| `u.User` | `"juan:secreto"` |
| `u.Host` | `"example.com:8080"` |
| `u.Path` | `"/ruta"` |
| `u.RawQuery` | `"q=hola&page=1"` |
| `u.Fragment` | `"seccion"` |
| `u.String()` | URL completa reconstruida |

---

## Campos del tipo URL

```go
type URL struct {
    Scheme      string      // "http", "https", "ftp", etc.
    Opaque      string      // datos opacos codificados (esquemas sin //)
    User        *Userinfo   // información de usuario y contraseña
    Host        string      // host o host:port
    Path        string      // ruta (empieza con / si no está en RawPath)
    RawPath     string      // ruta codificada (opcional)
    OmitHost    bool        // omitir host en String() (Go 1.19+)
    ForceQuery  bool        // forzar ? aunque RawQuery esté vacío
    RawQuery    string      // query string codificada (sin ?)
    Fragment    string      // fragmento (sin #)
    RawFragment string      // fragmento codificado (opcional)
}
```

| Método | Descripción |
|--------|-------------|
| `u.String()` | Reconstruye la URL completa |
| `u.Query()` | Parsea RawQuery en `url.Values` |
| `u.RequestURI()` | Devuelve path + query (para HTTP requests) |
| `u.Hostname()` | Solo el hostname (sin puerto) |
| `u.Port()` | Solo el puerto |
| `u.EscapedPath()` | Path codificado |
| `u.IsAbs()` | ¿Es URL absoluta? |
| `u.Parse(ref string)` | Resuelve una referencia relativa a partir de u |
| `u.ResolveReference(ref *URL)` | Resuelve referencia contra URL base |
| `u.MarshalBinary()` | Serializa a binario |
| `u.UnmarshalBinary(text []byte)` | Deserializa de binario |

---

## Query params

```go
u, _ := url.Parse("https://example.com/search?q=golang&page=2")

q := u.Query()           // url.Values (map[string][]string)
q.Get("q")               // "golang"
q.Get("page")            // "2"
q.Add("lang", "es")      // agrega parámetro
u.RawQuery = q.Encode()  // reconstruye la query string

fmt.Println(u.String())  // https://example.com/search?q=golang&page=2&lang=es
```

---

## Values - métodos completos

```go
v := url.Values{
    "q":    {"golang"},
    "page": {"2"},
}

v.Get("q")          // "golang" (primer valor, "" si no existe)
v.Set("page", "1")  // reemplaza todos los valores de "page" con ["1"]
v.Add("lang", "es") // agrega "es" a "lang" (sin borrar existentes)
v.Del("q")          // elimina la key "q"
v.Has("page")       // true (¿existe la key?)

encoded := v.Encode() // "lang=es&page=1" (ordenado alfabéticamente)
```

---

## Construir URL desde cero

```go
u := &url.URL{
    Scheme: "https",
    Host:   "example.com",
    Path:   "/api/usuarios",
}
q := u.Query()
q.Set("page", "1")
u.RawQuery = q.Encode()

fmt.Println(u.String())  // https://example.com/api/usuarios?page=1
```

---

## Query params para POST form

```go
form := url.Values{
    "nombre": {"Juan"},
    "edad":   {"25"},
}
resp, _ := http.PostForm("https://example.com/crear", form)
```

---

## Escape y Unescape

```go
// Escapar componentes de URL
escaped := url.PathEscape("archivo con espacios.pdf")  // "archivo%20con%20espacios.pdf"
unescaped, _ := url.PathUnescape("archivo%20con%20espacios.pdf")

// Escapar query params (diferente: espacio = +)
escaped := url.QueryEscape("hola mundo")   // "hola+mundo"
unescaped, _ := url.QueryUnescape("hola+mundo")
```

| Función | Dónde se usa |
|---------|-------------|
| `url.PathEscape(s)` / `url.PathUnescape(s)` | Componentes de path |
| `url.QueryEscape(s)` / `url.QueryUnescape(s)` | Keys y valores de query string |

---

## ParseRequestURI

Parsea una URI de request HTTP (sin esquema ni host):

```go
u, err := url.ParseRequestURI("/api/usuarios?id=5")
// u.Path = "/api/usuarios"
// u.RawQuery = "id=5"
```

Diferencia con `Parse`: `ParseRequestURI` espera un path, no una URL completa. Más estricto y rápido para servidores HTTP.

---

## User y UserPassword

```go
// Crear Userinfo (para auth en URLs)
u := &url.URL{
    Scheme: "https",
    Host:   "example.com",
    User:   url.User("juan"),                    // solo usuario
}

u.User = url.UserPassword("juan", "secreto")    // usuario y contraseña

fmt.Println(u.User.Username())   // "juan"
password, ok := u.User.Password() // "secreto", true
fmt.Println(u.String())          // https://juan:secreto@example.com
```

---

[← Volver al índice](/indice)
