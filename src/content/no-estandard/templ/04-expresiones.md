# Expresiones y datos

## Interpolación de texto

Las expresiones se escriben entre llaves `{}` y se escapan automáticamente para prevenir XSS:

```templ
templ saludo(nombre string) {
    <div>Hola, { nombre }</div>
}
```

## Tipos soportados

| Tipo | Ejemplo |
|------|---------|
| `string` | `{ nombre }` |
| `int`, `uint`, `float64`, etc. | `{ edad }` |
| `bool` | `{ activo }` |
| Tipos derivados (`type Age int`) | `{ age }` |

## Literales

Podés usar literales de Go directamente:

```templ
templ componente() {
    <div>{ "texto literal" }</div>
    <div>{ `raw string` }</div>
    <div>Número: { 42 }</div>
}
```

## Variables

Cualquier variable en scope puede usarse:

```templ
templ greet(prefix string, p Persona) {
    <div>{ prefix } { p.Nombre }{ exclamation }</div>
    <div>Cumple { p.Edad } años!</div>
}
```

```go
type Persona struct {
    Nombre string
    Edad   int
}

const exclamation = "!"
```

## Campos de structs

```templ
templ tarjeta(p Persona) {
    <div class="card">
        <h2>{ p.Nombre }</h2>
        <p>Edad: { p.Edad }</p>
    </div>
}
```

## Funciones

Se pueden usar funciones que retornan un valor:

```templ
import "strings"

templ componente() {
    <div>{ strings.ToUpper("hola") }</div>
}
```

También funciones que retornan `(valor, error)`:

```templ
templ componente() {
    <div>{ getConfig() }</div>
}

func getConfig() (string, error) {
    return "valor", nil
}
```

Si la función retorna un error, `Render` devuelve el error.

## Escaping automático

templ escapa automáticamente todo el contenido para prevenir XSS:

```templ
templ ejemplo() {
    <div>{ `<script>alert('xss')</script>` }</div>
}
```

Salida:

```html
<div>&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;</div>
```

## Formateo con fmt

Para formatear valores, usá `fmt.Sprintf`:

```templ
import "fmt"

templ precio(valor float64) {
    <span>{ fmt.Sprintf("$%.2f", valor) }</span>
}
```

## Renderizar HTML crudo (sin escaping)

Si necesitás renderizar HTML sin escapar (por ejemplo, contenido de un CMS):

```templ
import "github.com/a-h/templ"

templ contenido(htmlCrudo string) {
    @templ.Raw(htmlCrudo)
}
```

**Cuidado:** esto es inseguro si el contenido viene del usuario. Solo usalo con contenido de confianza.

---

[← Volver al índice](/no-estandard/templ)
