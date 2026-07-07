# Composición de templates

## Llamar componentes

Usá `@` para renderizar un componente dentro de otro:

```templ
templ pagina() {
    <html>
        <body>
            @header("Mi Sitio")
            @contenido()
            @footer()
        </body>
    </html>
}

templ header(titulo string) {
    <header><h1>{ titulo }</h1></header>
}

templ contenido() {
    <main><p>Contenido principal</p></main>
}

templ footer() {
    <footer><p>&copy; 2025</p></footer>
}
```

## Children (hijos)

Podés pasar contenido hijo a un componente usando `{ children... }`:

```templ
templ Layout() {
    <div class="layout">
        <header>Mi App</header>
        <main>
            { children... }
        </main>
    </div>
}

templ Pagina() {
    @Layout() {
        <h1>Bienvenido</h1>
        <p>Este contenido va dentro del layout.</p>
    }
}
```

Salida:

```html
<div class="layout">
    <header>Mi App</header>
    <main>
        <h1>Bienvenido</h1>
        <p>Este contenido va dentro del layout.</p>
    </main>
</div>
```

## Componentes como parámetros

Podés pasar componentes como parámetros de tipo `templ.Component`:

```templ
templ Layout(titulo string, sidebar templ.Component, contenido templ.Component) {
    <html>
        <head><title>{ titulo }</title></head>
        <body>
            <aside>@sidebar</aside>
            <main>@contenido</main>
        </body>
    </html>
}

templ Sidebar() {
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
}

templ Home() {
    <h1>Página principal</h1>
}

templ App() {
    @Layout("Mi Sitio", Sidebar(), Home())
}
```

## Unir componentes con templ.Join

```templ
templ hello() {
    <span>hello</span>
}

templ world() {
    <span>world</span>
}

templ saludo() {
    @templ.Join(hello(), world())
}
```

Salida:

```html
<span>hello</span><span>world</span>
```

## Componentes como métodos

Los componentes pueden ser métodos de structs:

```templ
type Card struct {
    Titulo   string
    Contenido string
}

templ (c Card) Render() {
    <div class="card">
        <h2>{ c.Titulo }</h2>
        <p>{ c.Contenido }</p>
    </div>
}
```

Uso:

```go
card := Card{Titulo: "Hola", Contenido: "Mundo"}
card.Render().Render(ctx, w)
```

O dentro de otro template:

```templ
templ pagina() {
    @Card{Titulo: "Hola", Contenido: "Mundo"}.Render()
}
```

## Componentes solo código

Podés crear componentes sin archivo `.templ`, implementando la interfaz directamente:

```go
import (
    "context"
    "io"
    "github.com/a-h/templ"
)

func boton(texto string) templ.Component {
    return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
        _, err := io.WriteString(w, "<button>"+templ.EscapeString(texto)+"</button>")
        return err
    })
}
```

**Importante:** en componentes solo código, vos sos responsable de escapar el HTML. Usá `templ.EscapeString`.

## Compartir componentes entre packages

Exportá el componente capitalizando el nombre:

```templ
// en package "components"
templ Boton(texto string) {
    <button>{ texto }</button>
}
```

Importalo desde otro package:

```templ
package main

import "mi-app/components"

templ pagina() {
    @components.Boton("Click")
}
```

---

[← Volver al índice](/no-estandard/templ)
