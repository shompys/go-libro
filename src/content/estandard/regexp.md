# regexp — Expresiones regulares

Busca, reemplaza y extrae texto usando patrones regex (estilo RE2, mismo que Google).

```go
import "regexp"
```

---

## Compilar un patrón

```go
re := regexp.MustCompile(`\d{3}-\d{3}-\d{4}`)  // panic si falla
// o:
re, err := regexp.Compile(`\d{3}-\d{3}-\d{4}`)  // error si falla
```

Usá `MustCompile` para patrones fijos (inicialización global), `Compile` para patrones dinámicos.

---

## Buscar

| Método | Qué hace | Ejemplo |
|--------|----------|---------|
| `MatchString(s)` | ¿El string coincide? | `re.MatchString("555-123-4567")` → `true` |
| `Match(b)` | ¿Los bytes coinciden? | Igual con `[]byte` |
| `FindString(s)` | Primera coincidencia | `re.FindString("a 555-123-4567 b")` → `"555-123-4567"` |
| `FindAllString(s, n)` | Todas las coincidencias | `-1` = todas |
| `FindStringIndex(s)` | Posición [inicio, fin] | `[4, 16]` |

---

## Subgrupos (capturar partes)

```go
re := regexp.MustCompile(`(\w+)@(\w+\.\w+)`)
matches := re.FindStringSubmatch("juan@mail.com")
// ["juan@mail.com", "juan", "mail.com"]
```

| Método | Devuelve |
|--------|----------|
| `FindStringSubmatch(s)` | `[]string` con el match completo + grupos |
| `FindAllStringSubmatch(s, n)` | `[][]string` con todos los matches |

### Grupos con nombre

```go
re := regexp.MustCompile(`(?P<usuario>\w+)@(?P<dominio>\w+\.\w+)`)
match := re.FindStringSubmatch("juan@mail.com")
usuario := match[re.SubexpIndex("usuario")]   // "juan"
dominio := match[re.SubexpIndex("dominio")]   // "mail.com"
```

---

## Reemplazar

| Método | Qué hace |
|--------|----------|
| `ReplaceAllString(src, repl)` | Reemplaza todas las coincidencias por `repl` |
| `ReplaceAllStringFunc(src, fn)` | Reemplaza usando una función |
| `ReplaceAllLiteralString(src, repl)` | Reemplazo literal (sin expandir `$1`) |

```go
re := regexp.MustCompile(`\d+`)
result := re.ReplaceAllString("año 2026, mes 07", "XXXX")
// "año XXXX, mes XXXX"
```

---

## Split con regex

```go
re := regexp.MustCompile(`[,;]\s*`)
parts := re.Split("a, b; c", -1)
// ["a", "b", "c"]
```

---

## Patrones comunes

| Patrón | Significado |
|--------|-------------|
| `.` | Cualquier carácter |
| `\d` | Dígito `[0-9]` |
| `\w` | Letra, dígito o `_` `[a-zA-Z0-9_]` |
| `\s` | Espacio, tab, newline |
| `+` | 1 o más |
| `*` | 0 o más |
| `?` | 0 o 1 |
| `{n}` | Exactamente n |
| `{n,}` | n o más |
| `{n,m}` | Entre n y m |
| `^` | Inicio de línea |
| `$` | Fin de línea |
| `(...)` | Grupo de captura |
| `[abc]` | Uno de: a, b, c |
| `[^abc]` | Cualquiera menos a, b, c |
| `|` | Alternativa (OR) |

---

## regexp.QuoteMeta

Escapa caracteres especiales para que se traten como literales:

```go
literal := regexp.QuoteMeta("precio $5.99 (oferta)")
// "precio \$5\.99 \(oferta\)"
re := regexp.MustCompile(literal)
re.MatchString("precio $5.99 (oferta)")  // true
```

---

## Longest (leftmost-longest)

Por defecto `regexp` usa leftmost-first (la primera coincidencia, aunque sea más corta). `Longest()` cambia a leftmost-longest:

```go
re := regexp.MustCompile(`a+|a+b+`)
re.Longest()
re.FindString("aaaabbb")  // "aaaabbb" (la más larga)
// sin Longest: "aaaa" (la primera que coincide)
```

---

## SubexpNames y NumSubexp

```go
re := regexp.MustCompile(`(?P<usuario>\w+)@(?P<dominio>\w+\.\w+)`)
fmt.Println(re.NumSubexp())           // 2 (cantidad de grupos)
fmt.Println(re.SubexpNames())         // ["", "usuario", "dominio"]
// la posición 0 siempre es "" (el match completo)
```

---

## Expand y ExpandString

Expande un template de reemplazo usando grupos capturados, escribiendo a un `[]byte` destino:

```go
re := regexp.MustCompile(`(\w+)@(\w+\.\w+)`)
src := []byte("juan@mail.com")
matches := re.FindSubmatchIndex(src)

dst := make([]byte, 0)
dst = re.Expand(dst, []byte("usuario: $1, dominio: $2"), src, matches)
fmt.Println(string(dst))  // "usuario: juan, dominio: mail.com"
```

`ExpandString` es igual pero con strings.

---

## LiteralPrefix

Devuelve un prefijo literal que debe aparecer al inicio de cualquier coincidencia. Útil para optimizar búsquedas:

```go
re := regexp.MustCompile(`hello\w+`)
prefix, complete := re.LiteralPrefix()
// prefix = "hello", complete = false
// (si el patrón entero fuera literal, complete sería true)
```

---

## MatchReader

Evalúa si un `io.RuneReader` contiene una coincidencia:

```go
re := regexp.MustCompile(`\d+`)
r := strings.NewReader("hay 42 manzanas")
re.MatchReader(r)  // true
```

Todos los métodos de Regexp tienen variantes para `[]byte`, `string` y `io.RuneReader`.

---

[← Volver al índice](/indice)
