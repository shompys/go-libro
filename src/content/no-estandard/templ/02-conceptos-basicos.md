# Conceptos básicos

## ¿Qué es templ?

templ es un lenguaje de templates que compila archivos `.templ` a código Go. Cada componente se convierte en una función que devuelve `templ.Component`.

## Flujo de trabajo

```
archivo.templ → templ generate → archivo_templ.go → go build → binario
```

1. Escribís componentes en archivos `.templ`
2. Ejecutás `templ generate` para compilar a Go
3. Usás los componentes generados como funciones Go normales
4. Compilás y ejecutás con `go run` o `go build`

## Estructura de un archivo .templ

Los archivos `.templ` empiezan con un package y opcionalmente imports, igual que Go:

```templ
package main

import "fmt"
import "time"
```

Fuera de los componentes, el código es Go normal:

```templ
package main

var greeting = "Bienvenido!"

func formatPrice(price float64) string {
    return fmt.Sprintf("$%.2f", price)
}

templ header(name string) {
    <header>
        <h1>{ name }</h1>
        <p>{ greeting }</p>
    </header>
}
```

## Componentes

Un componente es una función que devuelve HTML. Se define con la palabra clave `templ`:

```templ
templ Hello(name string) {
    <div>Hola, { name }</div>
}
```

Esto se compila a:

```go
func Hello(name string) templ.Component {
    // código generado
}
```

## La interfaz templ.Component

```go
type Component interface {
    Render(ctx context.Context, w io.Writer) error
}
```

Todo componente implementa esta interfaz. El método `Render` escribe el HTML en un `io.Writer`.

## Visibilidad (público vs privado)

templ sigue las reglas de Go:

| Nombre | Visibilidad |
|--------|-------------|
| `templ Hello()` | Público (exportado) — otros packages pueden usarlo |
| `templ hello()` | Privado — solo el package actual |

## Generar código

```bash
templ generate
```

Esto busca todos los archivos `.templ` en el directorio actual y subdirectorios, y genera archivos `_templ.go` correspondientes.

Para generar un solo archivo:

```bash
templ generate -f header.templ
```

Para watching de cambios en desarrollo:

```bash
templ generate --watch
```

## Ejemplo completo mínimo

`hello.templ`:
```templ
package main

templ Hello(name string) {
    <div>Hola, { name }</div>
}
```

`main.go`:
```go
package main

import (
    "context"
    "os"
)

func main() {
    Hello("Mundo").Render(context.Background(), os.Stdout)
}
```

Ejecutar:

```bash
templ generate
go run .
```

Salida:

```html
<div>Hola, Mundo</div>
```

---

[← Volver al índice](/no-estandard/templ)
