# Server-side rendering (HTTP)

## Página estática con templ.Handler

La forma más simple de servir un componente:

```go
package main

import (
    "net/http"
    "github.com/a-h/templ"
)

func main() {
    http.Handle("/", templ.Handler(hello()))
    http.ListenAndServe(":8080", nil)
}
```

`hello.templ`:
```templ
package main

templ hello() {
    <div>Hola Mundo</div>
}
```

## Con datos dinámicos

Usá el método `Render` directamente en un handler:

```go
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    horaActual(r.Context(), time.Now()).Render(r.Context(), w)
})
```

`hora.templ`:
```templ
package main

import "time"

templ horaActual(t time.Time) {
    <div>La hora es: { t.Format("15:04:05") }</div>
}
```

## Con Chi router

```go
package main

import (
    "net/http"
    "time"
    "github.com/go-chi/chi/v5"
)

func main() {
    r := chi.NewRouter()

    r.Get("/", func(w http.ResponseWriter, r *http.Request) {
        pagina("Home").Render(r.Context(), w)
    })

    r.Get("/hora", func(w http.ResponseWriter, r *http.Request) {
        horaActual(time.Now()).Render(r.Context(), w)
    })

    r.Post("/items", func(w http.ResponseWriter, r *http.Request) {
        nombre := r.FormValue("nombre")
        itemCard(Item{Nombre: nombre}).Render(r.Context(), w)
    })

    http.ListenAndServe(":3000", r)
}
```

## Opciones del Handler

`templ.Handler` acepta opciones:

```go
templ.Handler(componente,
    templ.WithStatus(http.StatusNotFound),
    templ.WithContentType("text/html; charset=utf-8"),
)
```

| Opción | Qué hace |
|--------|----------|
| `templ.WithStatus(code)` | Setea el status code HTTP |
| `templ.WithContentType(ct)` | Setea el Content-Type |
| `templ.WithErrorHandler(fn)` | Handler custom para errores |

## Ejemplo: lista de tareas con HTMX

`todos.templ`:
```templ
package main

import "fmt"

type Todo struct {
    ID     int
    Texto  string
    Hecho  bool
}

templ TodoItem(t Todo) {
    <li class="flex justify-between p-2 border-b">
        <span>{ t.Texto }</span>
        <button
            hx-post={ fmt.Sprintf("/toggle/%d", t.ID) }
            hx-target="closest li"
            hx-swap="outerHTML"
        >
            if t.Hecho {
                <span>✓</span>
            } else {
                <span>○</span>
            }
        </button>
    </li>
}

templ TodoList(todos []Todo) {
    <ul id="todos">
        for _, t := range todos {
            @TodoItem(t)
        }
    </ul>
}

templ Index(todos []Todo) {
    <!DOCTYPE html>
    <html>
        <head>
            <script src="https://unpkg.com/htmx.org@2.0.4"></script>
        </head>
        <body>
            <h1>Mis Tareas</h1>
            <form
                hx-post="/add"
                hx-target="#todos"
                hx-swap="beforeend"
            >
                <input name="texto" placeholder="Nueva tarea..."/>
                <button type="submit">Agregar</button>
            </form>
            @TodoList(todos)
        </body>
    </html>
}
```

`main.go`:
```go
package main

import (
    "net/http"
    "github.com/go-chi/chi/v5"
)

var todos = []Todo{
    {1, "Aprender templ", false},
    {2, "Armar un proyecto", false},
}

var nextID = 3

func main() {
    r := chi.NewRouter()

    r.Get("/", func(w http.ResponseWriter, r *http.Request) {
        Index(todos).Render(r.Context(), w)
    })

    r.Post("/add", func(w http.ResponseWriter, r *http.Request) {
        texto := r.FormValue("texto")
        t := Todo{nextID, texto, false}
        nextID++
        todos = append(todos, t)
        TodoItem(t).Render(r.Context(), w)
    })

    r.Post("/toggle/{id}", func(w http.ResponseWriter, r *http.Request) {
        // toggle y re-renderizar solo el item
        for i, t := range todos {
            if t.ID == nextID-1 {
                todos[i].Hecho = !todos[i].Hecho
                TodoItem(todos[i]).Render(r.Context(), w)
                return
            }
        }
    })

    http.ListenAndServe(":3000", r)
}
```

## Servir archivos estáticos

```go
mux := http.NewServeMux()
mux.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("assets"))))
mux.Handle("/", templ.Handler(pagina()))
http.ListenAndServe(":8080", mux)
```

## Streaming HTTP

templ soporta streaming para respuestas progresivas:

```go
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/html")
    flusher, ok := w.(http.Flusher)

    header().Render(r.Context(), w)
    flusher.Flush()

    for _, item := range items {
        itemCard(item).Render(r.Context(), w)
        flusher.Flush()
    }

    footer().Render(r.Context(), w)
})
```

---

[← Volver al índice](/no-estandard/templ)
