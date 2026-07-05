# encoding/gob — Serialización binaria de Go (GOB)

Formato de serialización binario propio de Go. Diseñado para ser eficiente y fácil de usar entre procesos Go. Similar a `encoding/json` pero binario y más rápido.

```go
import "encoding/gob"
```

---

## Índice

- [Concepto](/estandard/encoding-gob#concepto)
- [Codificar (Encoder)](/estandard/encoding-gob#codificar-encoder)
- [Decodificar (Decoder)](/estandard/encoding-gob#decodificar-decoder)
- [Registrar tipos (Register)](/estandard/encoding-gob#registrar-tipos-register)
- [GobEncoder y GobDecoder (serialización personalizada)](/estandard/encoding-gob#gobencoder-y-gobdecoder)
- [Ejemplo completo](/estandard/encoding-gob#ejemplo-completo)
- [Envío por red (streaming)](/estandard/encoding-gob#envío-por-red-streaming)

---

## Concepto

GOB serializa automáticamente structs, slices, arrays, maps, y punteros. No requiere tags ni esquemas. El encoder y decoder negocian la estructura al enviar el primer valor de cada tipo.

**Lo que GOB no es:**
- No está pensado para interoperar con otros lenguajes (usa Protocol Buffers o JSON para eso).
- No guarda indentación; es binario, no legible por humanos.

---

## Codificar (Encoder)

`Encoder` escribe valores GOB a un `io.Writer`. **Llama a `Encode` una vez por cada valor.**

```go
type Persona struct {
    Nombre string
    Edad   int
}

buf := new(bytes.Buffer)
enc := gob.NewEncoder(buf)

p := Persona{"Ana", 30}
err := enc.Encode(p)
// buf ahora contiene la representación gob de p
```

| Método | Descripción |
|--------|------------|
| `NewEncoder(w io.Writer) *Encoder` | Crea un encoder que escribe a `w` |
| `Encode(e any) error` | Serializa y envía un valor |
| `EncodeValue(v reflect.Value) error` | Envía un `reflect.Value` |

---

## Decodificar (Decoder)

`Decoder` lee valores GOB de un `io.Reader` y los reconstruye:

```go
buf := bytes.NewBuffer(datosGOB)
dec := gob.NewDecoder(buf)

var p Persona
err := dec.Decode(&p)
// p = {Nombre: "Ana", Edad: 30}
```

| Método | Descripción |
|--------|------------|
| `NewDecoder(r io.Reader) *Decoder` | Crea un decoder que lee de `r` |
| `Decode(e any) error` | Lee y deserializa el siguiente valor |
| `DecodeValue(v reflect.Value) error` | Lee en un `reflect.Value` |

---

## Registrar tipos (Register)

Cuando usas interfaces, GOB necesita saber el tipo concreto antes de decodificar. Usa `Register`:

```go
type Animal interface {
    Hablar() string
}

type Perro struct{ Nombre string }
func (p Perro) Hablar() string { return "Guau" }

func init() {
    gob.Register(Perro{})
}
```

| Función | Descripción |
|---------|------------|
| `Register(value any)` | Registra un tipo concreto para usar con interfaces |
| `RegisterName(name string, value any)` | Registra con nombre explícito |

**¿Cuándo registrar?** Solo cuando el valor viaja dentro de un `interface{}` (campo de struct, elemento de slice/map, etc.). Si el tipo es concreto en todo momento, no hace falta.

---

## GobEncoder y GobDecoder

Interfaces para controlar cómo se serializa un tipo (análogo a `json.Marshaler`/`json.Unmarshaler`):

```go
type GobEncoder interface {
    GobEncode() ([]byte, error)
}

type GobDecoder interface {
    GobDecode([]byte) error
}
```

```go
type FechaHora time.Time

func (f FechaHora) GobEncode() ([]byte, error) {
    // Serialización personalizada
    return json.Marshal(time.Time(f))
}

func (f *FechaHora) GobDecode(data []byte) error {
    var t time.Time
    if err := json.Unmarshal(data, &t); err != nil {
        return err
    }
    *f = FechaHora(t)
    return nil
}
```

| Interfaz | Método | Descripción |
|----------|--------|------------|
| `GobEncoder` | `GobEncode() ([]byte, error)` | El tipo controla su propia codificación |
| `GobDecoder` | `GobDecode([]byte) error` | El tipo controla su propia decodificación |

Si un tipo implementa `GobEncoder`, gob usa `GobEncode()` en vez de reflection. Si no implementa `GobEncoder` pero sí `encoding.BinaryMarshaler`, usa ese como fallback (y `BinaryUnmarshaler` para decodificar).

> **No implementa `GobEncoder` y `GobDecoder` para structs simples.** Solo cuando necesites lógica especial (ej. encriptar campos, compatibilidad hacia atrás, o tipos externos como `time.Time`).

---

## Ejemplo completo

```go
package main

import (
    "bytes"
    "encoding/gob"
    "fmt"
)

type Usuario struct {
    ID    int
    Login string
    Roles []string
}

func main() {
    // Codificar
    original := Usuario{ID: 1, Login: "juan", Roles: []string{"admin", "user"}}

    var buf bytes.Buffer
    enc := gob.NewEncoder(&buf)
    enc.Encode(original)

    // Decodificar
    var copia Usuario
    dec := gob.NewDecoder(&buf)
    dec.Decode(&copia)

    fmt.Printf("%+v\n", copia)
    // {ID:1 Login:juan Roles:[admin user]}
}
```

---

## Envío por red (streaming)

GOB fue diseñado para streams: podés enviar múltiples valores por la misma conexión sin delimitadores especiales:

```go
// Lado servidor (escribe varios valores)
conn, _ := net.Dial("tcp", "localhost:8080")
enc := gob.NewEncoder(conn)
enc.Encode(mensaje1)
enc.Encode(mensaje2)

// Lado cliente (lee todos)
dec := gob.NewDecoder(conn)
for {
    var m Mensaje
    err := dec.Decode(&m)
    if err == io.EOF {
        break
    }
    // procesar m
}
```

---

[← Volver al índice](/indice)
