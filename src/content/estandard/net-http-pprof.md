# net/http/pprof

Expone datos de profiling del runtime a través de HTTP. Registra automáticamente rutas en `http.DefaultServeMux` al importarse con side-effect.

```go
import _ "net/http/pprof"
```

---

## Cómo habilitarlo

La forma más simple es importar el paquete por sus efectos secundarios e iniciar un servidor HTTP:

```go
package main

import (
	"log"
	"net/http"
	_ "net/http/pprof"
)

func main() {
	go func() {
		log.Println(http.ListenAndServe("localhost:6060", nil))
	}()

	// ... lógica de la aplicación ...
	select {}
}
```

---

## Rutas registradas automáticamente

| Ruta | Descripción |
|------|-------------|
| `/debug/pprof/` | Página índice con listado de perfiles disponibles |
| `/debug/pprof/cmdline` | Línea de comandos del proceso |
| `/debug/pprof/profile` | Perfil de CPU (30s por defecto) |
| `/debug/pprof/symbol` | Símbolos para traducción de direcciones |
| `/debug/pprof/trace` | Traza de ejecución |
| `/debug/pprof/heap` | Perfil de heap (memoria) |
| `/debug/pprof/goroutine` | Goroutines activas |
| `/debug/pprof/threadcreate` | Creación de hilos del SO |
| `/debug/pprof/block` | Bloqueos de primitivas de sincronización |
| `/debug/pprof/mutex` | Contención de mutex |

---

## Funciones

### Index

```go
func Index(w http.ResponseWriter, r *http.Request)
```

Genera la página índice de perfiles.

### Cmdline

```go
func Cmdline(w http.ResponseWriter, r *http.Request)
```

Responde con la línea de comandos del proceso.

### Profile

```go
func Profile(w http.ResponseWriter, r *http.Request)
```

Inicia un perfil de CPU de 30 segundos y responde con datos en formato pprof. Acepta `?seconds=N` como parámetro de consulta.

### Symbol

```go
func Symbol(w http.ResponseWriter, r *http.Request)
```

Traduce direcciones de programa a nombres de función.

### Trace

```go
func Trace(w http.ResponseWriter, r *http.Request)
```

Responde con la traza de ejecución. Acepta `?seconds=N` (por defecto 1s).

---

## Ejemplo con ServeMux personalizado

```go
package main

import (
	"net/http"
	"net/http/pprof"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/debug/pprof/", pprof.Index)
	mux.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
	mux.HandleFunc("/debug/pprof/profile", pprof.Profile)
	mux.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
	mux.HandleFunc("/debug/pprof/trace", pprof.Trace)

	http.ListenAndServe(":6060", mux)
}
```

---

## Uso con go tool pprof

```bash
# Perfil de CPU de 30 segundos
go tool pprof http://localhost:6060/debug/pprof/profile

# Perfil de heap
go tool pprof http://localhost:6060/debug/pprof/heap
```

---

[← Volver al índice](/indice)
