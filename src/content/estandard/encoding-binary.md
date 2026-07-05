# encoding/binary — Codificar y decodificar datos binarios

Convierte entre valores de Go y su representación binaria en formato little-endian o big-endian. Ideal para protocolos de red, archivos binarios y serialización.

```go
import "encoding/binary"
```

---

## Índice

- [Orden de bytes (ByteOrder)](/estandard/encoding-binary#orden-de-bytes-byteorder)
- [Leer y escribir valores individuales](/estandard/encoding-binary#leer-y-escribir-valores-individuales)
- [Read y Write (streaming)](/estandard/encoding-binary#read-y-write-streaming)
- [NativeEndian (Go 1.21+)](/estandard/encoding-binary#nativeendian)
- [Encode y Decode (Go 1.18+)](/estandard/encoding-binary#encode-y-decode)
- [Append (Go 1.19+)](/estandard/encoding-binary#append)
- [Tamaños de tipos](/estandard/encoding-binary#tamaños-de-tipos)
- [Uvarint y Varint](/estandard/encoding-binary#uvarint-y-varint)

---

## Orden de bytes (ByteOrder)

| Constante | Descripción |
|-----------|------------|
| `binary.BigEndian` | Orden de bytes big-endian (red, más significativo primero) |
| `binary.LittleEndian` | Orden de bytes little-endian (x86, menos significativo primero) |

Ambos implementan la interfaz `ByteOrder`:

| Método | Devuelve |
|--------|----------|
| `PutUint16([]byte, uint16)` | Escribe uint16 en buffer |
| `PutUint32([]byte, uint32)` | Escribe uint32 en buffer |
| `PutUint64([]byte, uint64)` | Escribe uint64 en buffer |
| `Uint16([]byte) uint16` | Lee uint16 de buffer |
| `Uint32([]byte) uint32` | Lee uint32 de buffer |
| `Uint64([]byte) uint64` | Lee uint64 de buffer |
| `PutUvarint([]byte, uint64) int` | Escribe uint64 de longitud variable |
| `Uvarint([]byte) (uint64, int)` | Lee uint64 de longitud variable |

---

## Leer y escribir valores individuales

El método más simple para números sueltos:

```go
import (
    "bytes"
    "encoding/binary"
)

// Escribir
buf := new(bytes.Buffer)
var pi float64 = 3.14159
err := binary.Write(buf, binary.LittleEndian, pi)
// buf ahora contiene los 8 bytes de pi

// Leer
var leido float64
err = binary.Read(buf, binary.LittleEndian, &leido)
// leido = 3.14159
```

```go
// Escribir un uint32 en big-endian
buf := make([]byte, 4)
binary.BigEndian.PutUint32(buf, 1024)
// buf = [0x00, 0x00, 0x04, 0x00]

// Leer de vuelta
valor := binary.BigEndian.Uint32(buf)
// valor = 1024
```

---

## Read y Write (streaming)

Leen/escriben estructuras enteras desde/hacia `io.Reader`/`io.Writer`:

```go
type Mensaje struct {
    ID    uint32
    Flags uint16
    Valor float64
}

mensaje := Mensaje{ID: 42, Flags: 7, Valor: 3.14}

buf := new(bytes.Buffer)
binary.Write(buf, binary.BigEndian, mensaje)

var recibido Mensaje
binary.Read(buf, binary.BigEndian, &recibido)
```

| Función | Firma |
|---------|-------|
| `Write(w io.Writer, order ByteOrder, data any) error` | Escribe `data` en binario |
| `Read(r io.Reader, order ByteOrder, data any) error` | Lee datos binarios en `data` |

> **Importante:** Los campos de la struct deben tener tamaño fijo (nada de slices, strings ni maps). Usa `[N]byte` para strings de largo fijo.

---

## NativeEndian

`NativeEndian` es la endianness nativa del procesador. En la práctica, siempre es `LittleEndian` (todas las arquitecturas modernas: x86, ARM, RISC-V):

```go
import "encoding/binary"

var orden binary.ByteOrder = binary.NativeEndian
// En x86/ARM es lo mismo que binary.LittleEndian
buf := make([]byte, 4)
orden.PutUint32(buf, 42)
```

| Constante | Descripción |
|-----------|------------|
| `NativeEndian` | Endianness nativa de la máquina (Go 1.21+) |

---

## Encode y Decode

`Encode` y `Decode` son variantes sin streams (Go 1.18+). No requieren `io.Reader`/`io.Writer`:

```go
// Encode: serializa datos a []byte
buf := make([]byte, 4)
binary.LittleEndian.Encode(buf, binary.LittleEndian, uint32(42))
// también con structs:
type Punto struct{ X, Y float64 }
buf := make([]byte, binary.Size(Punto{}))
binary.LittleEndian.Encode(buf, binary.LittleEndian, Punto{1.5, 2.5})

// Decode: deserializa desde []byte
var p Punto
binary.LittleEndian.Decode(buf, binary.LittleEndian, &p)
```

A diferencia de `Read`/`Write`, `Encode`/`Decode` trabajan directamente con `[]byte`, no con streams. El segundo parámetro es el `ByteOrder` (redundante en la forma `binary.LittleEndian.Encode(...)`, pero necesario por la interfaz).

| Función | Firma |
|---------|-------|
| `Encode(buf []byte, order ByteOrder, data any) (int, error)` | Codifica a `[]byte` |
| `Decode(buf []byte, order ByteOrder, data any) (int, error)` | Decodifica de `[]byte` |

> `AppendByteOrder` extiende `ByteOrder` con `AppendUint16`, `AppendUint32`, `AppendUint64`.

---

## Append

`binary.Append` agrega representaciones binarias a un slice existente (Go 1.19+). Evita crear buffers intermedios:

```go
var buf []byte

// Agregar valores individuales
buf = binary.Append(buf, binary.BigEndian, uint32(42))
buf = binary.Append(buf, binary.BigEndian, uint16(7))
buf = binary.Append(buf, binary.BigEndian, float64(3.14))

// Agregar structs completas
type Header struct {
    ID    uint32
    Flags uint16
}
buf = binary.Append(buf, binary.BigEndian, Header{1, 5})
```

| Función | Firma |
|---------|-------|
| `Append(buf, order ByteOrder, data any) ([]byte, error)` | Codifica `data` y lo agrega a `buf` |

### AppendByteOrder (Go 1.19+)

Interfaz que extiende `ByteOrder` con métodos `Append*`:

```go
type AppendByteOrder interface {
    ByteOrder
    AppendUint16([]byte, uint16) []byte
    AppendUint32([]byte, uint32) []byte
    AppendUint64([]byte, uint64) []byte
    String() string
}
```

`BigEndian` y `LittleEndian` implementan `AppendByteOrder`.

```go
var buf []byte
buf = binary.BigEndian.AppendUint16(buf, 300)
buf = binary.BigEndian.AppendUint32(buf, 100000)
// buf contiene los bytes en big-endian
```

| Método de AppendByteOrder | Descripción |
|--------------------------|-------------|
| `AppendUint16(buf []byte, v uint16) []byte` | Agrega uint16 en orden big/little endian |
| `AppendUint32(buf []byte, v uint32) []byte` | Agrega uint32 |
| `AppendUint64(buf []byte, v uint64) []byte` | Agrega uint64 |

---

## Tamaños de tipos

| Constante | Valor |
|-----------|-------|
| `Size(v any) int` | Devuelve el tamaño en bytes de `v` |

```go
binary.Size(int32(0))  // 4
binary.Size(uint64(0)) // 8
binary.Size(float32(0)) // 4
```

---

## Uvarint y Varint

Codificación de longitud variable (como protobuf varints). Útil para ahorrar espacio en números pequeños:

```go
buf := make([]byte, binary.MaxVarintLen64)
n := binary.PutUvarint(buf, 150)
// n = 2, buf[:n] = [0x96, 0x01]

valor, _ := binary.Uvarint(buf[:n])
// valor = 150
```

| Función | Descripción |
|---------|------------|
| `PutUvarint(buf []byte, x uint64) int` | Codifica uint64 en buffer, devuelve bytes escritos |
| `PutVarint(buf []byte, x int64) int` | Codifica int64 (zig-zag) en buffer |
| `Uvarint(buf []byte) (uint64, int)` | Decodifica uint64 de buffer |
| `Varint(buf []byte) (int64, int)` | Decodifica int64 de buffer |
| `MaxVarintLen16` | 3 |
| `MaxVarintLen32` | 5 |
| `MaxVarintLen64` | 10 |

---

[← Volver al índice](/indice)
