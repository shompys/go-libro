# JavaScript y scripts

## Tags script estándar

Usá `<script>` normal para incluir JavaScript:

```templ
templ pagina() {
    <script>
        function handleClick(event) {
            alert('Click detectado');
        }
    </script>
    <button onclick="handleClick(this)">Click</button>
}
```

## Importar scripts externos

```templ
templ head() {
    <head>
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
        <script src="/assets/js/app.js"></script>
    </head>
}
```

## Pasar datos de Go a JavaScript

### Con templ.JSFuncCall

Llama una función JS con datos del server:

```templ
templ Componente(data Data) {
    <button onclick={ templ.JSFuncCall("alert", data.Mensaje) }>
        Mostrar alerta
    </button>
}
```

Salida:

```html
<button onclick="alert('Hola desde Go')">Mostrar alerta</button>
```

### Con atributos HTML (estilo Alpine.js)

```templ
templ Componente(data any) {
    <div x-data={ templ.JSONString(data) }>
        Contenido
    </div>
}
```

Salida:

```html
<div x-data="{&quot;msg&quot;:&quot;Hola&quot;}">
    Contenido
</div>
```

### Con templ.JSONScript

Inyecta datos como JSON en un `<script>`:

```templ
templ pagina(data any) {
    @templ.JSONScript("mis-datos", data)
}
```

Salida:

```html
<script id="mis-datos" type="application/json">{"msg":"Hola"}</script>
```

Desde JS:

```javascript
const data = JSON.parse(document.getElementById('mis-datos').textContent);
```

### Interpolar datos Go en script tags

Dentro de strings JS, usá `{{ valor }}`:

```templ
templ pagina(msg string) {
    <script>
        const mensaje = "Mensaje: {{ msg }}";
        alert(mensaje);
    </script>
}
```

Fuera de strings, se JSON-encodea automáticamente:

```templ
templ pagina(msg string) {
    <script>
        const data = {{ msg }};
        alert(data);
    </script>
}
```

## Pasar el evento a handlers

Usá `templ.JSExpression` para pasar objetos JS como `event`:

```templ
<script>
    function clickHandler(event, mensaje) {
        alert(mensaje);
        event.preventDefault();
    }
</script>

templ boton() {
    <button onclick={
        templ.JSFuncCall("clickHandler",
            templ.JSExpression("event"),
            "Hola desde Go",
        )
    }>Click</button>
}
```

Salida:

```html
<button onclick="clickHandler(event, 'Hola desde Go')">Click</button>
```

## Script templates (legacy)

Los script templates permiten definir funciones JS con parámetros Go:

```templ
script graph(data []TimeValue) {
    const chart = LightweightCharts.createChart(document.body);
    chart.addLineSeries().setData(data);
}

templ pagina(data []TimeValue) {
    <html>
        <head>
            <script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>
        </head>
        <body onload={ graph(data) }></body>
    </html>
}
```

O renderizar el script directamente:

```templ
script log(content string) {
    console.log(content)
}

templ pagina() {
    <body>
        @log("Hola")
        @log("Mundo")
    </body>
}
```

**Nota:** Los script templates son una feature legacy. Para proyectos nuevos, preferí `<script>` tags estándar con `templ.JSFuncCall` o `templ.JSONString`.

## Renderizar un script una sola vez

Usá `templ.OnceHandle` para que un script solo se renderice una vez por request, incluso si el componente se usa múltiples veces:

```templ
var helloHandle = templ.NewOnceHandle()

templ saludo(nombre string) {
    @helloHandle.Once() {
        <script>
            function hello(name) {
                alert('Hola, ' + name + '!');
            }
        </script>
    }
    <button onclick={ templ.JSFuncCall("hello", nombre) }>
        Saludar a { nombre }
    </button>
}

templ pagina() {
    @saludo("Juan")
    @saludo("María")
}
```

El `<script>` con la función `hello` solo aparece una vez en el HTML.

---

[← Volver al índice](/no-estandard/templ)
