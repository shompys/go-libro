# html/template — Templates HTML seguros

Igual que [text/template](/text-template) pero con **escaping automático** contra XSS. Siempre usá este para HTML.

```go
import "html/template"
```

---

## Diferencia clave con text/template

`html/template` escapa automáticamente los datos según el contexto (HTML, JavaScript, CSS, URL):

```go
tmpl, _ := template.New("ejemplo").Parse("<h1>{{.}}</h1>")

// text/template:
tmpl.Execute(os.Stdout, "<script>alert('xss')</script>")
// → <h1><script>alert('xss')</script></h1>  (PELIGROSO)

// html/template:
tmpl.Execute(os.Stdout, "<script>alert('xss')</script>")
// → <h1>&lt;script&gt;alert('xss')&lt;/script&gt;</h1>  (SEGURO)
```

---

## La misma API

`html/template` expone exactamente los mismos métodos que `text/template`. Todo lo que aprendiste en [text/template](/text-template) aplica:

- `{{.Campo}}` → acceder a campos
- `{{if .Cond}}...{{end}}` → condicionales
- `{{range .Slice}}...{{end}}` → bucles
- `Parse()`, `Execute()`, `ParseFiles()`

La única diferencia es que el contenido se escapa automáticamente según dónde esté en el HTML.

---

## Funciones de escape

A veces querés marcar contenido como "seguro" o escapar manualmente:

| Función | Descripción |
|---------|-------------|
| `template.HTMLEscaper(args...) string` | Escapa para contexto HTML |
| `template.JSEscaper(args...) string` | Escapa para contexto JavaScript |
| `template.URLQueryEscaper(args...) string` | Escapa para query string de URL |

```go
safeHTML := template.HTMLEscaper("<script>alert('xss')</script>")
// &lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;
```

---

## Conversiones de tipo

`html/template` define tipos para marcar contenido como "confiable" (no se escapa):

| Tipo | Uso |
|------|-----|
| `template.HTML` | Contenido HTML seguro |
| `template.JS` | JavaScript seguro |
| `template.CSS` | CSS seguro |
| `template.URL` | URL segura |
| `template.HTMLAttr` | Atributo HTML seguro |
| `template.Srcset` | Atributo srcset seguro |

```go
type Pagina struct {
    Titulo   string
    Contenido template.HTML  // no se escapa, es HTML ya seguro
}
tmpl.Execute(w, Pagina{"Hola", template.HTML("<b>negrita</b>")})
// Renderiza: <b>negrita</b> (sin escapar)
```

> **Peligro:** Solo usá estos tipos con contenido que vos generaste sanitizado. Nunca con input de usuario.

---

## template.Must, ParseGlob, ParseFS

```go
var tmpl = template.Must(template.ParseFiles("pagina.html")) // panic si error

tmpl, err := template.ParseGlob("templates/*.html") // carga todos
tmpl, err := template.ParseFS(embedFS, "*.html")    // desde fs.FS
```

---

## template.FuncMap y Clone

`FuncMap` funciona igual que en `text/template`:

```go
funcMap := template.FuncMap{
    "fecha": func() string { return time.Now().Format("02/01/2006") },
}
tmpl := template.New("pagina").Funcs(funcMap)
```

`Clone` crea una copia de un template ya compilado:

```go
copia, err := tmpl.Clone()
```

Útil cuando necesitás la misma base con distintas funciones o configuraciones.

---

## Ejemplo completo: servidor web

```go
var tmpl = template.Must(template.ParseFiles("pagina.html"))

func handler(w http.ResponseWriter, r *http.Request) {
    data := struct {
        Titulo  string
        Mensaje string
    }{"Mi página", "<b>negrita</b>"}
    
    tmpl.Execute(w, data)
}

http.HandleFunc("/", handler)
http.ListenAndServe(":8080", nil)
```

```html
<!-- pagina.html -->
<!DOCTYPE html>
<html>
<head><title>{{.Titulo}}</title></head>
<body><p>{{.Mensaje}}</p></body>
</html>
```

El `{{.Mensaje}}` se renderiza como `&lt;b&gt;negrita&lt;/b&gt;`, mostrando literalmente las etiquetas.

---

[← Volver al índice](/indice)
