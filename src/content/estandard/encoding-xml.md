# encoding/xml — Codificar y decodificar XML

```go
import "encoding/xml"
```

Misma lógica que [encoding/json](/encoding-json) pero con tags `xml:`.

---

## Índice

- [Struct a XML](/estandard/encoding-xml#struct-→-xml)
- [XML a struct](/estandard/encoding-xml#xml-→-struct)
- [MarshalIndent (XML indentado)](/estandard/encoding-xml#marshalindent)
- [Tags comunes](/estandard/encoding-xml#tags-comunes)
- [Encoder y Decoder](/estandard/encoding-xml#encoder-y-decoder-streaming)
- [Tipos XML (StartElement, CharData, etc.)](/estandard/encoding-xml#tipos-xml)

---

## Struct → XML

```go
type Persona struct {
    XMLName xml.Name `xml:"persona"`
    Nombre  string   `xml:"nombre"`
    Edad    int      `xml:"edad"`
}

p := Persona{Nombre: "Ana", Edad: 30}
bytes, _ := xml.Marshal(p)
// <persona><nombre>Ana</nombre><edad>30</edad></persona>
```

---

## XML → Struct

```go
data := []byte(`<persona><nombre>Ana</nombre><edad>30</edad></persona>`)
var p Persona
xml.Unmarshal(data, &p)
```

---

## MarshalIndent (XML indentado)

Igual que `Marshal` pero con indentación legible:

```go
type Persona struct {
    XMLName xml.Name `xml:"persona"`
    Nombre  string   `xml:"nombre"`
    Edad    int      `xml:"edad"`
}

p := Persona{Nombre: "Ana", Edad: 30}
bytes, _ := xml.MarshalIndent(p, "", "  ")
fmt.Println(string(bytes))
// <persona>
//   <nombre>Ana</nombre>
//   <edad>30</edad>
// </persona>
```

| Función | Descripción |
|---------|------------|
| `MarshalIndent(v any, prefix, indent string) ([]byte, error)` | Como `Marshal` pero con prefijo e indentación |

---

## Tags comunes

| Tag | Efecto |
|-----|--------|
| `xml:"nombre"` | Renombra el elemento XML |
| `xml:",attr"` | Mapea a atributo XML (no elemento) |
| `xml:",innerxml"` | Contenido XML crudo |
| `xml:",chardata"` | Texto del elemento |
| `xml:"-"` | Ignorar campo |

```go
type Articulo struct {
    Titulo string `xml:"titulo,attr"`  // <articulo titulo="...">
    Texto  string `xml:",chardata"`    // <articulo>ESTE TEXTO</articulo>
}
```

---

## Encoder y Decoder (streaming)

### Encoder

Escribe XML a un `io.Writer`:

```go
p := Persona{Nombre: "Ana", Edad: 30}
enc := xml.NewEncoder(os.Stdout)
enc.Indent("", "  ") // activar indentación
enc.Encode(p)
```

| Función / Método | Descripción |
|------------------|------------|
| `NewEncoder(w io.Writer) *Encoder` | Crea un encoder que escribe a `w` |
| `Encode(v any) error` | Serializa y escribe un valor XML |
| `EncodeElement(v any, start StartElement) error` | Codifica un elemento con tag explícito |
| `EncodeToken(t Token) error` | Escribe un token XML individual |
| `Flush() error` | Vacía el buffer |
| `Indent(prefix, indent string)` | Activa indentación automática |

### Decoder

Lee XML de un `io.Reader`:

```go
reader := strings.NewReader(`<persona><nombre>Ana</nombre></persona>`)
dec := xml.NewDecoder(reader)

var p Persona
dec.Decode(&p)

// O lectura token por token:
for {
    tok, err := dec.Token()
    if err == io.EOF { break }
    switch t := tok.(type) {
    case xml.StartElement:
        fmt.Println("inicio:", t.Name.Local)
    case xml.EndElement:
        fmt.Println("fin:", t.Name.Local)
    case xml.CharData:
        fmt.Println("texto:", string(t))
    }
}
```

| Función / Método | Descripción |
|------------------|------------|
| `NewDecoder(r io.Reader) *Decoder` | Crea un decoder que lee de `r` |
| `Decode(v any) error` | Lee y decodifica el siguiente elemento XML |
| `DecodeElement(v any, start *StartElement) error` | Decodifica desde un `StartElement` específico |
| `Token() (Token, error)` | Lee el siguiente token (bajo nivel) |
| `RawToken() (Token, error)` | Como `Token()` pero sin verificar well-formedness |
| `Skip() error` | Salta el elemento actual (incluyendo hijos) |
| `InputOffset() int64` | Offset de bytes consumidos del Reader |
| `InputPos() (int, int)` | Línea y columna actuales del Reader |

---

## Tipos XML

Tipos que representan los distintos tokens en un documento XML:

```go
// xml.Name: nombre de elemento o atributo
type Name struct {
    Space string // namespace (ej. "http://www.w3.org/1999/xhtml")
    Local string // nombre local (ej. "div")
}

// xml.Attr: par clave-valor de un atributo
type Attr struct {
    Name  Name
    Value string
}
```

| Tipo | Descripción |
|------|------------|
| `xml.Name` | Nombre cualificado de elemento/atributo (espacio + local) |
| `xml.Attr` | Atributo XML (nombre + valor) |
| `xml.StartElement` | Token de apertura de elemento. Contiene `Name` y `Attr []Attr` |
| `xml.EndElement` | Token de cierre de elemento. Contiene `Name` |
| `xml.CharData` | Contenido textual (`[]byte`) |
| `xml.Comment` | Comentario (`[]byte` entre `<!--` y `-->`) |
| `xml.ProcInst` | Instrucción de procesamiento (`Target` + `Inst []byte`) |
| `xml.Directive` | Directiva (`[]byte` entre `<!` y `>`, ej. `<!DOCTYPE>`) |

### StartElement y EndElement

```go
// <persona edad="30">
//   <nombre>Ana</nombre>
// </persona>

dec := xml.NewDecoder(reader)
tok, _ := dec.Token()
start := tok.(xml.StartElement)
fmt.Println(start.Name.Local)       // "persona"
for _, attr := range start.Attr {
    fmt.Println(attr.Name.Local, attr.Value) // edad 30
}

tok, _ = dec.Token()
start2 := tok.(xml.StartElement)
fmt.Println(start2.Name.Local)      // "nombre"

tok, _ = dec.Token()
texto := tok.(xml.CharData)
fmt.Println(string(texto))          // "Ana"

tok, _ = dec.Token()
fin := tok.(xml.EndElement)
fmt.Println(fin.Name.Local)         // "nombre"

tok, _ = dec.Token()
fin2 := tok.(xml.EndElement)
fmt.Println(fin2.Name.Local)        // "persona"
```

---

[← Volver al índice](/indice)
