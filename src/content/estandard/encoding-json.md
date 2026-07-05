# encoding/json — Codificar y decodificar JSON

Convierte entre structs de Go y JSON (y viceversa). Usa **reflection** internamente.

```go
import "encoding/json"
```

---

## Índice

- [Struct a JSON](/estandard/encoding-json#struct-→-json-marshal)
- [JSON a struct](/estandard/encoding-json#json-→-struct-unmarshal)
- [JSON bonito con indentación](/estandard/encoding-json#json-bonito-marshalindent)
- [Tags de struct (renombrar, omitir, omitempty)](/estandard/encoding-json#tags-de-struct)
- [Encoder y Decoder](/estandard/encoding-json#encoder-y-decoder-streaming)
- [Validar, compactar y escapar](/estandard/encoding-json#validar,-compactar-y-escapar)
- [json.Number y json.Delim](/estandard/encoding-json#jsonnumber-y-jsondelim)
- [RawMessage (JSON crudo)](/estandard/encoding-json#rawmessage)

---

## Struct → JSON (`Marshal`)

```go
type Persona struct {
    Nombre string
    Edad   int
}

p := Persona{"Ana", 30}
bytes, err := json.Marshal(p)
// bytes = `{"Nombre":"Ana","Edad":30}`
```

| Función | Devuelve |
|---------|----------|
| `json.Marshal(v)` | `([]byte, error)` |

**Regla:** Solo los campos exportados (mayúscula inicial) se incluyen en el JSON.

---

## JSON → Struct (`Unmarshal`)

```go
data := []byte(`{"Nombre":"Ana","Edad":30}`)
var p Persona
err := json.Unmarshal(data, &p)
// p.Nombre = "Ana", p.Edad = 30
```

| Función | Qué hace |
|---------|----------|
| `json.Unmarshal(data, &v)` | Decodifica JSON en `v` |

---

## JSON bonito (`MarshalIndent`)

Agrega indentación y saltos de línea:

```go
bytes, _ := json.MarshalIndent(p, "", "  ")
fmt.Println(string(bytes))
```

Salida:

```json
{
  "Nombre": "Ana",
  "Edad": 30
}
```

| Parámetro | Significado |
|-----------|-------------|
| `prefix` | Prefijo de cada línea (normalmente `""`) |
| `indent` | Indentación (`"  "`, `"\t"`) |

---

## Tags de struct

Controlan cómo se serializa cada campo:

```go
type Persona struct {
    Nombre  string `json:"name"`         // renombra a "name"
    Edad    int    `json:"edad,omitempty"` // omite si es zero value
    Clave   string `json:"-"`            // ignora este campo
    Privado string `json:",omitempty"`   // usa nombre del campo, omite si vacío
}
```

| Tag | Efecto |
|-----|--------|
| `json:"nombre"` | Usa "nombre" en vez del nombre del campo |
| `json:",omitempty"` | Omite el campo si es zero value (`0`, `""`, `nil`, `false`) |
| `json:"-"` | Ignora completamente el campo (no se lee ni escribe) |
| `json:"nombre,string"` | Serializa el número como string en JSON |

---

## Encoder y Decoder

Para trabajar con streams (`io.Writer` / `io.Reader`) en vez de cargar todo en memoria:

### Encoder (escribir JSON a un Writer)

```go
p := Persona{"Ana", 30}
encoder := json.NewEncoder(os.Stdout)
encoder.Encode(p) // escribe el JSON a stdout
```

| Método | Descripción |
|--------|------------|
| `NewEncoder(w io.Writer) *Encoder` | Crea un encoder que escribe a `w` |
| `Encode(v any) error` | Serializa `v` y lo escribe al stream |
| `SetIndent(prefix, indent string)` | Agrega indentación (como `MarshalIndent`) |
| `SetEscapeHTML(on bool)` | Si `true` (default), escapa `&`, `<`, `>` en strings |

```go
enc := json.NewEncoder(os.Stdout)
enc.SetIndent("", "  ")        // JSON indentado
enc.SetEscapeHTML(false)       // no escapar HTML
enc.Encode(p)
```

### Decoder (leer JSON de un Reader)

```go
var p Persona
decoder := json.NewDecoder(resp.Body) // respuesta HTTP
decoder.Decode(&p)
```

| Método | Descripción |
|--------|------------|
| `NewDecoder(r io.Reader) *Decoder` | Crea un decoder que lee de `r` |
| `Decode(v any) error` | Lee y decodifica el siguiente valor JSON |
| `DisallowUnknownFields()` | Rechaza campos que no están en la struct destino |
| `UseNumber()` | Decodifica números como `json.Number` (string) en vez de `float64` |
| `Token() (Token, error)` | Lee un solo token JSON (ideal para streaming manual) |

```go
decoder := json.NewDecoder(reader)
decoder.DisallowUnknownFields() // rechazar campos desconocidos
decoder.UseNumber()             // preservar precisión de números grandes

// Lectura token por token
for {
    t, err := decoder.Token()
    if err == io.EOF { break }
    fmt.Printf("%T: %v\n", t, t)
}
```

`Token()` devuelve uno de: `json.Delim` (`{`, `[`, `}`, `]`), `bool`, `float64`, `json.Number`, `string`, o `nil`.

| Ventaja | Encoder/Decoder | Marshal/Unmarshal |
|---------|-----------------|-------------------|
| Streaming (no carga todo en memoria) | Sí | No |
| Más simple | No | Sí |

---

## Validar, compactar y escapar

Funciones utilitarias que transforman JSON sin necesidad de structs:

```go
// Valid: verifica si un []byte es JSON válido (sin decodificar)
if !json.Valid([]byte(`{"nombre": "Ana"}`)) {
    log.Fatal("JSON inválido")
}

// Compact: elimina espacios en blanco (sin indentación)
compacto := new(bytes.Buffer)
json.Compact(compacto, []byte(`{ "nombre" : "Ana" }`))
// compacto = `{"nombre":"Ana"}`

// HTMLEscape: escapa < > & para embeber JSON en HTML
seguro := new(bytes.Buffer)
json.HTMLEscape(seguro, []byte(`{"mensaje": "<script>alert(1)</script>"}`))
// seguro = {"mensaje":"\u003cscript\u003ealert(1)\u003c/script\u003e"}

// Indent: agrega indentación a JSON ya serializado
bonito := new(bytes.Buffer)
json.Indent(bonito, []byte(`{"nombre":"Ana","edad":30}`), "", "  ")
fmt.Println(bonito.String())
// {
//   "nombre": "Ana",
//   "edad": 30
// }
```

| Función | Descripción |
|---------|------------|
| `Valid(data []byte) bool` | ¿Es JSON válido? (rápido, no aloca) |
| `Compact(dst *bytes.Buffer, src []byte) error` | Compacta JSON eliminando espacios |
| `HTMLEscape(dst *bytes.Buffer, src []byte)` | Escapa caracteres HTML en cadenas JSON |
| `Indent(dst *bytes.Buffer, src []byte, prefix, indent string) error` | Indenta JSON existente |

---

## json.Number y json.Delim

### Number

`json.Number` es un `string` que representa un número JSON. Evita pérdida de precisión al decodificar números grandes. Se usa combinado con `Decoder.UseNumber()`:

```go
decoder := json.NewDecoder(reader)
decoder.UseNumber()

var datos map[string]any
decoder.Decode(&datos)

n := datos["precio"].(json.Number)
// Convertir al tipo deseado:
f, _ := n.Float64()  // float64
i, _ := n.Int64()    // int64
s := n.String()      // string original "999999999999999999"
```

| Tipo | Descripción |
|------|------------|
| `json.Number` | `type Number string` — preserva la representación textual del número |

### Delim

`json.Delim` es un `rune` que representa delimitadores JSON (`{`, `}`, `[`, `]`). Aparece al usar `Decoder.Token()`:

```go
decoder := json.NewDecoder(reader)
t, _ := decoder.Token()
d := t.(json.Delim)
fmt.Println(d.String()) // "{" o "[" o "}" o "]"
```

| Tipo | Descripción |
|------|------------|
| `json.Delim` | `type Delim rune` — delimitador de estructura JSON |

---

## `json.RawMessage`

Permite mantener parte del JSON sin decodificar:

```go
type Mensaje struct {
    Tipo    string          `json:"tipo"`
    Payload json.RawMessage `json:"payload"` // sin decodificar
}

// Decodificar después según el tipo:
switch m.Tipo {
case "login":
    var login LoginPayload
    json.Unmarshal(m.Payload, &login)
case "mensaje":
    var msg MensajePayload
    json.Unmarshal(m.Payload, &msg)
}
```

---

[← Volver al índice](/indice)
