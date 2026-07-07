# Elementos y atributos

## Elementos HTML

Los elementos HTML se escriben directamente en los componentes:

```templ
templ button(text string) {
    <button class="btn">{ text }</button>
}
```

### Los tags deben cerrarse

A diferencia de HTML, templ requiere que todos los elementos estén cerrados:

```templ
templ ejemplo() {
    <div>Contenido</div>
    <img src="foto.png"/>
    <br/>
    <hr/>
}
```

templ sabe qué elementos son "void" (como `<img>`, `<br>`, `<hr>`) y omite el `/` de cierre en el HTML generado:

```html
<div>Contenido</div>
<img src="foto.png">
<br>
<hr>
```

## Atributos constantes

Los atributos con valores estáticos usan comillas dobles:

```templ
templ parrafo() {
    <p data-testid="mi-parrafo" class="texto">Contenido</p>
}
```

## Atributos con expresiones

Los atributos dinámicos usan llaves `{}`:

```templ
templ link(url string, label string) {
    <a href={ url }>{ label }</a>
}
```

También se pueden usar llamadas a funciones:

```templ
templ componente() {
    <p data-testid={ getTestID(true) }>Texto</p>
}

func getTestID(isTrue bool) string {
    if isTrue {
        return "test-123"
    }
    return "test-456"
}
```

## Atributos booleanos

Los atributos booleanos (como `disabled`, `checked`, `required`) se indican con `?`:

```templ
templ input(disabled bool) {
    <input type="text" disabled?={ disabled }/>
}
```

Si `disabled` es `true`:
```html
<input type="text" disabled>
```

Si `disabled` es `false`:
```html
<input type="text">
```

## Atributos condicionales

Usá `if` dentro de un elemento para agregar atributos condicionalmente:

```templ
templ componente() {
    <hr style="padding: 10px"
        if true {
            class="activo"
        }
    />
}
```

## Spread de atributos

Podés pasar un mapa de atributos dinámicamente con `{ attrs... }`:

```templ
templ componente(attrs templ.Attributes) {
    <p { attrs... }>Texto</p>
}

templ uso() {
    @componente(templ.Attributes{
        "data-testid": "parrafo",
        "class":       "destacado",
    })
}
```

Salida:

```html
<p data-testid="parrafo" class="destacado">Texto</p>
```

El tipo `templ.Attributes` es `map[string]any` y soporta:

| Tipo del valor | Comportamiento |
|----------------|----------------|
| `string` | Atributo normal: `name="value"` |
| `bool` | Atributo booleano: `name` (si true) |
| `templ.KeyValue[string, bool]` | Atributo condicional con valor |
| `templ.KeyValue[bool, bool]` | Atributo booleano condicional |

## Atributos URL

Los atributos que esperan URL (`href`, `src`, `action`) sanitizan automáticamente el valor:

```templ
templ link(p Persona) {
    <a href={ p.URL }>{ p.Nombre }</a>
}
```

Si la URL contiene un protocolo peligroso como `javascript:`, templ la reemplaza con `about:invalid#TemplFailedSanitizationURL`.

Para marcar una URL como segura:

```go
templ.SafeURL(miURL)
```

Para atributos no estándar que contienen URLs (como `hx-get` de HTMX):

```templ
templ componente(id string) {
    <div hx-get={ templ.URL(fmt.Sprintf("/items/%s", id)) }>
        Item
    </div>
}
```

## Claves de atributos dinámicas

Podés generar el nombre del atributo dinámicamente:

```templ
templ parrafo(testID string) {
    <p { "data-" + testID }="parrafo">Texto</p>
}
```

Salida:

```html
<p data-testid="parrafo">Texto</p>
```

---

[← Volver al índice](/no-estandard/templ)
