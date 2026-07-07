# CSS y clases

## Atributo class estático

```templ
templ boton(texto string) {
    <button class="btn btn-primary">{ texto }</button>
}
```

## Atributo class dinámico

Usá llaves para pasar variables o múltiples clases:

```templ
templ boton(texto string, clase string) {
    <button class={ "btn", clase }>{ texto }</button>
}
```

## Clases condicionales con templ.KV

`templ.KV` aplica una clase solo si el booleano es `true`:

```templ
templ boton(texto string, esPrimario bool, esGrande bool) {
    <button class={
        "btn",
        templ.KV("btn-primary", esPrimario),
        templ.KV("btn-lg", esGrande),
    }>{ texto }</button>
}
```

Si `esPrimario=true` y `esGrande=false`:

```html
<button class="btn btn-primary">Click</button>
```

## Clases con map[string]bool

```templ
templ boton(clases map[string]bool) {
    <button class={ clases }>Click</button>
}

templ uso() {
    @boton(map[string]bool{
        "btn":        true,
        "btn-primary": true,
        "btn-lg":     false,
    })
}
```

## Atributo style estático

```templ
templ caja() {
    <div style="background-color: red; padding: 10px">Contenido</div>
}
```

## Atributo style dinámico

```templ
templ caja(color string) {
    <div style={ "background-color: " + color }>Contenido</div>
}
```

### Múltiples valores de style

```templ
templ boton(s1, s2 string) {
    <button style={ s1, s2 }>Click</button>
}
```

### Style con map[string]string

```templ
func progressStyle(percent int) map[string]string {
    return map[string]string{
        "width":      fmt.Sprintf("%d%%", percent),
        "transition": "width 0.3s ease",
    }
}

templ ProgressBar(percent int) {
    <div style={ progressStyle(percent) } class="progress-bar"></div>
}
```

### Style condicional con templ.KV

```templ
templ Input(valor string, tieneError bool) {
    <input
        type="text"
        value={ valor }
        style={
            templ.KV("border-color: #ff3860", tieneError),
            templ.KV("background-color: #fff5f7", tieneError),
            "padding: 0.5em 1em;",
        }
    />
}
```

## Componentes CSS

templ permite definir CSS como componentes que generan clases únicas automáticamente:

```templ
var rojo = "#ff0000"

css botonPrimario() {
    background-color: { rojo };
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
}

templ Boton(texto string) {
    <button class={ botonPrimario() }>{ texto }</button>
}
```

Salida:

```html
<style type="text/css">
    .botonPrimario_f179 {
        background-color: #ff0000;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
    }
</style>
<button class="botonPrimario_f179">Click</button>
```

**Ventajas:**
- La clase tiene nombre único (no hay colisiones)
- El CSS se renderiza una sola vez por request
- No necesitás archivos CSS externos

### CSS con parámetros

```templ
css loading(percent int) {
    width: { fmt.Sprintf("%d%%", percent) };
}

templ barra() {
    <div class={ loading(50) }></div>
    <div class={ loading(100) }></div>
}
```

## CSS Middleware

Para evitar que los `<style>` se repitan en cada request, usá el middleware CSS:

```go
c1 := botonPrimario()
handler := templ.NewCSSMiddleware(httpRoutes, c1)
http.ListenAndServe(":8080", handler)
```

Esto sirve todas las clases CSS en `/styles/templ.css`. Incluí el link en tu HTML:

```templ
templ head() {
    <head>
        <link rel="stylesheet" href="/styles/templ.css"/>
    </head>
}
```

## Sanitización de CSS

templ sanitiza valores CSS dinámicos para prevenir inyección:

```templ
templ inseguro() {
    <div style={ "background-image: url('javascript:alert(1)')" }>
        Contenido
    </div>
}
```

Salida (sanitizada):

```html
<div style="background-image:zTemplUnsafeCSSPropertyValue;">
    Contenido
</div>
```

Para bypasear la sanitización (solo con valores de confianza):

```go
templ.SafeCSS("background-image: url(/safe.png);")
templ.SafeCSSProperty(fmt.Sprintf("rotate(%ddeg)", grados))
```

---

[← Volver al índice](/no-estandard/templ)
