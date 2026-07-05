# expvar — Publicación de métricas y variables de la aplicación

Expone variables (métricas, contadores, strings, mapas) vía HTTP en formato JSON. Muy útil para monitoreo y debugging en producción.

```go
import "expvar"
```

---

## Índice

- [Handler HTTP](/estandard/expvar#handler-http)
- [NewInt](/estandard/expvar#newint-contador-entero)
- [NewFloat](/estandard/expvar#newfloat-valor-decimal)
- [NewString](/estandard/expvar#newstring-cadena-de-texto)
- [NewMap](/estandard/expvar#newmap-mapa-de-métricas)
- [Métodos de Int](/estandard/expvar#métodos-de-int)
- [Métodos de Float](/estandard/expvar#métodos-de-float)
- [String y Map en detalle](/estandard/expvar#string-y-map-en-detalle)
- [Publish](/estandard/expvar#publish-publicar-métricas-personalizadas)
- [Get y Do](/estandard/expvar#get-y-do-inspeccionar-métricas)
- [Métricas del runtime por defecto](/estandard/expvar#métricas-del-runtime-por-defecto)
- [Crear un tipo Var propio](/estandard/expvar#crear-un-tipo-var-propio)
- [Ejemplo completo](/estandard/expvar#ejemplo-completo:-servidor-con-métricas)

---

## Handler HTTP

El paquete expone un `http.Handler` que devuelve todas las métricas registradas en formato JSON.

```go
http.Handle("/debug/vars", expvar.Handler())
http.ListenAndServe(":8080", nil)
```

Accediendo a `http://localhost:8080/debug/vars` obtenés:

```json
{
  "cmdline": ["/tmp/app"],
  "memstats": { ... },
  "contador_requests": 1432,
  ...
}
```

| Función | Devuelve |
|---------|----------|
| `expvar.Handler()` | `http.Handler` |

---

## NewInt (contador entero)

Crea y publica una variable `int64` atómica.

```go
contador := expvar.NewInt("requests")
contador.Add(1)
```

| Función | Devuelve |
|---------|----------|
| `expvar.NewInt(name string)` | `*expvar.Int` |

---

## NewFloat (valor decimal)

Crea y publica una variable `float64` atómica.

```go
latencia := expvar.NewFloat("latencia_promedio")
latencia.Set(142.5)
latencia.Add(0.2)
```

| Función | Devuelve |
|---------|----------|
| `expvar.NewFloat(name string)` | `*expvar.Float` |

---

## NewString (cadena de texto)

Crea y publica una variable string.

```go
version := expvar.NewString("version")
version.Set("1.2.3")
```

| Función | Devuelve |
|---------|----------|
| `expvar.NewString(name string)` | `*expvar.String` |

---

## NewMap (mapa de métricas)

Crea y publica un mapa de variables. Similar a `map[string]Var`.

```go
metrica := expvar.NewMap("http_requests")
metrica.Add("200", 1)
metrica.Add("404", 1)
metrica.AddJSON("slowest", "GET /users")
```

| Función | Devuelve |
|---------|----------|
| `expvar.NewMap(name string)` | `*expvar.Map` |

---

## Métodos de Int

```go
c := expvar.NewInt("contador")
c.Add(5)      // suma 5
c.Set(100)    // establece a 100
c.Value()     // devuelve int64 (ej: 100)
c.String()    // devuelve string (ej: "100")
```

| Método | Descripción |
|--------|-------------|
| `i.Add(delta int64)` | Suma `delta` al valor actual |
| `i.Set(value int64)` | Establece el valor |
| `i.Value() int64` | Devuelve el valor |
| `i.String() string` | Devuelve string del valor |

---

## Métodos de Float

```go
f := expvar.NewFloat("temperatura")
f.Set(36.5)
f.Add(0.1)
f.Value()  // float64
f.String() // "36.6"
```

| Método | Descripción |
|--------|-------------|
| `f.Add(delta float64)` | Suma `delta` al valor |
| `f.Set(value float64)` | Establece el valor |
| `f.Value() float64` | Devuelve el valor |
| `f.String() string` | Devuelve string del valor |

---

## String y Map en detalle

### String

```go
s := expvar.NewString("estado")
s.Set("running")
s.Value()  // "running"
s.String() // "\"running\""  (incluye comillas JSON)
```

### Map

```go
m := expvar.NewMap("metricas")

// Agregar valores
m.Add("ok", 1)
m.Add("error", 1)
m.AddFloat("latencia", 150.5)
m.AddJSON("objeto", `{"tipo": "complex"}`)

// Leer valores
val := m.Get("ok") // *expvar.Int
```

| Método de Map | Descripción |
|--------------|-------------|
| `m.Add(key string, delta int64)` | Suma `delta` a la clave (crea un `*expvar.Int` si no existe) |
| `m.AddFloat(key string, delta float64)` | Suma `delta` a la clave (crea un `*expvar.Float` si no existe) |
| `m.AddJSON(key string, json string)` | Asigna un valor JSON arbitrario a la clave |
| `m.Get(key string) Var` | Obtiene la variable de una clave |
| `m.Set(key string, v Var)` | Asigna una variable a una clave |
| `m.Delete(key string)` | Elimina una clave del mapa |
| `m.Do(f func(kv KeyValue))` | Itera sobre todas las entradas |
| `m.Init() *Map` | Inicializa el mapa (lo limpia) |

---

## Publish (publicar métricas personalizadas)

Publica cualquier tipo que implemente la interfaz `Var`.

```go
expvar.Publish("uptime", new(UptimeVar))
```

| Función | Descripción |
|---------|-------------|
| `expvar.Publish(name string, v Var)` | Publica una variable con un nombre dado |

**Nota:** Si el nombre ya existe, `Publish` hace `panic`. Cada variable se publica una sola vez (generalmente en `init()` o al arrancar).

---

## Get y Do (inspeccionar métricas)

Permiten acceder programáticamente a las métricas registradas.

```go
// Obtener una variable específica
v := expvar.Get("requests")
if v != nil {
    fmt.Println(v.String())
}

// Iterar sobre todas las variables
expvar.Do(func(kv expvar.KeyValue) {
    fmt.Printf("%s: %s\n", kv.Key, kv.Value.String())
})
```

| Función | Devuelve | Descripción |
|---------|----------|-------------|
| `expvar.Get(name string)` | `expvar.Var` | Devuelve la variable registrada, o `nil` |
| `expvar.Do(f func(KeyValue))` | — | Itera sobre todas las variables publicadas |

```go
type KeyValue struct {
    Key   string
    Value Var
}
```

---

## Métricas del runtime (por defecto)

Al importar `expvar`, se publican automáticamente dos variables:

| Variable | Contenido |
|----------|-----------|
| `cmdline` | Slice con los argumentos de línea de comandos |
| `memstats` | Estadísticas de memoria (`runtime.MemStats` en JSON) |

Aparecen siempre en `/debug/vars`, incluso si no publicaste nada manualmente.

---

## Crear un tipo Var propio

```go
type Var interface {
    String() string
}
```

### Ejemplo: uptime del servidor

```go
type UptimeVar struct {
    inicio time.Time
}

func (u *UptimeVar) String() string {
    return fmt.Sprintf("%q", time.Since(u.inicio).String())
}

// En init():
func init() {
    expvar.Publish("uptime", &UptimeVar{inicio: time.Now()})
}
```

### Ejemplo: contador con mensaje

```go
type MensajeContador struct {
    msg string
    n   int64
    mu  sync.Mutex
}

func (c *MensajeContador) String() string {
    c.mu.Lock()
    defer c.mu.Unlock()
    return fmt.Sprintf(`{"msg":%q,"count":%d}`, c.msg, c.n)
}

func (c *MensajeContador) Incrementar() {
    c.mu.Lock()
    c.n++
    c.mu.Unlock()
}
```

---

## Ejemplo completo: servidor con métricas

```go
package main

import (
    "expvar"
    "net/http"
    "time"
)

var (
    requests    = expvar.NewInt("requests")
    errors404   = expvar.NewInt("errors_404")
    lastRequest = expvar.NewString("last_request")
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        requests.Add(1)
        lastRequest.Set(time.Now().Format(time.RFC3339))

        if r.URL.Path != "/" {
            errors404.Add(1)
            http.NotFound(w, r)
            return
        }
        w.Write([]byte("OK"))
    })

    http.Handle("/debug/vars", expvar.Handler())
    http.ListenAndServe(":8080", nil)
}
```

Salida de `GET /debug/vars`:

```json
{
  "cmdline": ["/tmp/app"],
  "memstats": { ... },
  "requests": 42,
  "errors_404": 3,
  "last_request": "\"2026-07-05T15:30:00-03:00\""
}
```

---

[← Volver al índice](/indice)
