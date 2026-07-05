# text/template — Templates de texto

Genera texto dinámico a partir de plantillas con placeholders.

```go
import "text/template"
```

Para templates HTML (con protección XSS), ver [html/template](/html-template).

---

## Índice

- [Template simple](/estandard/text-template#template-simple)
- [Campos de struct](/estandard/text-template#acceder-a-campos-de-struct)
- [Condicionales](/estandard/text-template#condicionales-if)
- [Bucles](/estandard/text-template#bucles-range)
- [Funciones y pipelines](/estandard/text-template#funciones-y-pipelines)
- [Funciones personalizadas](/estandard/text-template#funciones-personalizadas-funcmap)
- [Templates desde archivo](/estandard/text-template#templates-desde-archivo)
- [Templates compuestos](/estandard/text-template#templates-compuestos-define-y-template)
- [Acciones avanzadas](/estandard/text-template#acciones-avanzadas)

---

## Template simple

```go
tmpl, _ := template.New("saludo").Parse("Hola, {{.}}!")

tmpl.Execute(os.Stdout, "Juan")  // Hola, Juan!
```

| Método | Qué hace |
|--------|----------|
| `template.New(nombre).Parse(texto)` | Crea y compila un template |
| `tmpl.Execute(w, data)` | Ejecuta y escribe output a un `io.Writer` |

`{{.}}` = el dato que pasaste (se llama "dot").

---

## Acceder a campos de struct

```go
type Persona struct { Nombre string; Edad int }

tmpl, _ := template.New("ficha").Parse("{{.Nombre}} tiene {{.Edad}} años")
tmpl.Execute(os.Stdout, Persona{"Ana", 30})  // Ana tiene 30 años
```

## Mapas

```go
datos := map[string]string{"nombre": "Juan", "rol": "admin"}
tmpl.Execute(os.Stdout, datos)
// Template: {{.nombre}} es {{.rol}}  →  Juan es admin
```

---

## Condicionales

```
{{if .Activo}}Usuario activo{{else}}Usuario inactivo{{end}}
```

```go
tmpl, _ := template.New("estado").Parse("El usuario está {{if .Activo}}activo{{else}}inactivo{{end}}")
tmpl.Execute(os.Stdout, struct{ Activo bool }{true})
// El usuario está activo
```

---

## Bucles

```
{{range .Items}}
  - {{.}}  <-- "." es el elemento actual del slice
{{end}}
```

```go
tmpl, _ := template.New("lista").Parse("Elementos:\n{{range .}}- {{.}}\n{{end}}")
tmpl.Execute(os.Stdout, []string{"A", "B", "C"})

// Salida:
// Elementos:
// - A
// - B
// - C
```

---

## Funciones y pipelines

Las pipelines encadenan operaciones con `|`:

```
{{.Nombre | printf "Hola, %s!"}}
{{.Precio | printf "$%.2f"}}
```

### Funciones predefinidas

| Función | Qué hace | Ejemplo |
|---------|----------|---------|
| `printf` | Formatea | `{{printf "%s-%d" .Nombre .Edad}}` |
| `len` | Longitud | `{{len .Items}}` |
| `index` | Acceder por índice | `{{index . 0}}` |
| `and`, `or`, `not` | Lógica | `{{and .A .B}}` |
| `call` | Llama a una función | `{{call .Fn}}` |

---

## Funciones personalizadas (FuncMap)

Agregá tus propias funciones al template:

```go
funcMap := template.FuncMap{
    "mayuscula": strings.ToUpper,
    "suma":      func(a, b int) int { return a + b },
    "fecha":     func() string { return time.Now().Format("02/01/2006") },
}

tmpl := template.New("demo").Funcs(funcMap)
tmpl.Parse("{{.Nombre | mayuscula}} tiene {{suma 2 3}} items. Hoy: {{fecha}}")
tmpl.Execute(os.Stdout, struct{ Nombre string }{"juan"})
// JUAN tiene 5 items. Hoy: 05/07/2026
```

> **Importante:** `Funcs` debe llamarse **antes** de `Parse`.

### template.Option

Configura opciones del template con cadenas de formato `"missingkey=zero"`:

```go
tmpl := template.New("demo").Option("missingkey=error")
// Opciones:
// "missingkey=default" — valor cero para claves faltantes (default)
// "missingkey=zero"     — valor cero (más explícito)
// "missingkey=error"    — panic si una clave no existe
```

---

## Templates desde archivo

### template.Must

Envuelve la compilación y hace panic si hay error. Ideal para variables globales:

```go
var tmpl = template.Must(template.ParseFiles("reporte.tmpl"))
```

### template.ParseFiles

```go
tmpl, err := template.ParseFiles("header.tmpl", "footer.tmpl", "pagina.tmpl")
tmpl.Execute(os.Stdout, datos)  // ejecuta el primero ("header.tmpl")
```

### template.ParseGlob

Carga todos los templates que coincidan con el patrón glob:

```go
tmpl, err := template.ParseGlob("templates/*.tmpl")
tmpl.ExecuteTemplate(os.Stdout, "pagina", datos)  // ejecuta uno específico
```

### template.ParseFS (Go 1.16+)

Carga templates desde un sistema de archivos embebido:

```go
//go:embed templates/*.tmpl
var templateFS embed.FS

tmpl := template.Must(template.ParseFS(templateFS, "templates/*.tmpl"))
```

---

## Templates compuestos (Define y Template)

### ExecuteTemplate

Ejecuta un template específico por nombre:

```go
tmpl.ExecuteTemplate(w, "nombre", data)
```

### Define y Template

Definí múltiples templates en un mismo archivo:

```
{{define "header"}}<header>{{.Titulo}}</header>{{end}}
{{define "footer"}}<footer>© 2026</footer>{{end}}
{{define "pagina"}}
    {{template "header" .}}
    <main>{{.Contenido}}</main>
    {{template "footer" .}}
{{end}}
```

```go
tmpl := template.Must(template.ParseFiles("layout.tmpl"))
tmpl.ExecuteTemplate(os.Stdout, "pagina", datos)
```

### Block

Define un template que puede ser sobrescrito (similar a slots):

```
{{block "contenido" .}}Contenido por defecto{{end}}
```

Si el template `"contenido"` fue definido en otro archivo, se usa ese. Si no, se usa el contenido por defecto dentro del `block`.

---

## Acciones avanzadas

### Comparaciones: eq, ne, lt, le, gt, ge

```
{{if eq .Rol "admin"}}Administrador{{end}}
{{if ne .Status "activo"}}Inactivo{{end}}
{{if lt .Edad 18}}Menor de edad{{end}}
{{if ge .Puntaje 100}}Excelente{{end}}
```

| Acción | Significado |
|--------|-------------|
| `eq arg1 arg2` | `arg1 == arg2` |
| `ne arg1 arg2` | `arg1 != arg2` |
| `lt arg1 arg2` | `arg1 < arg2` |
| `le arg1 arg2` | `arg1 <= arg2` |
| `gt arg1 arg2` | `arg1 > arg2` |
| `ge arg1 arg2` | `arg1 >= arg2` |

### nil

```
{{if .Opcional}}Tiene valor{{else}}Es nil{{end}}
```

### Variables

Declará variables con `$`:

```
{{$nombre := .Nombre}}
{{range .Items}}
    {{$nombre}} compró {{.}}
{{end}}
```

### Comentarios

```
{{/* esto es un comentario, no aparece en la salida */}}
```

### Recorte de espacios en blanco

Usá `{{-` y `-}}` para eliminar espacios:

```
{{- range .Items -}}
  {{.}}
{{- end -}}
```

Sin `-`: se imprimen los saltos de línea y espacios entre actions.
Con `-`: se elimina el espacio en blanco a la izquierda (`{{-`) o derecha (`-}}`).

### with

Cambia el contexto (el "dot") dentro de un bloque:

```
{{with .Direccion}}
    {{.Calle}} {{.Numero}}, {{.Ciudad}}
{{else}}
    Sin dirección registrada
{{end}}
```

Dentro de `with`, `.` es `.Direccion` (no el struct original).

### Funciones predefinidas adicionales

| Función | Qué hace |
|---------|----------|
| `html` | Escapa para HTML (alias de `html/template` en `text/template`) |
| `js` | Escapa para JavaScript |
| `urlquery` | Escapa para query string |
| `slice x y z` | Equivale a `x[y:z]` |
| `print` | `fmt.Sprint` |

---

[← Volver al índice](/indice)
