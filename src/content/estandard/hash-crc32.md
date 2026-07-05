# hash/crc32 — Checksum CRC-32

> **Import:** `import "hash/crc32"`

El paquete `crc32` implementa el checksum de redundancia cíclica CRC-32 de 32 bits.

---

## Polinomios predefinidos

| Tabla | Polinomio | Uso común |
|-------|-----------|-----------|
| `IEEE` | 0x04C11DB7 | Ethernet, PNG, gzip, zlib |
| `Castagnoli` | 0x1EDC6F41 | iSCSI, ext4, SCTP, Btrfs |
| `Koopman` | 0x741B8CD7 | Análisis de CRC |

---

## Constructores

| Función | Descripción |
|---------|-------------|
| `MakeTable(poly uint32) *Table` | Crea una tabla CRC para el polinomio dado |
| `New(tab *Table) hash.Hash32` | Nuevo hash CRC-32 usando la tabla |
| `NewIEEE() hash.Hash32` | Nuevo hash usando la tabla IEEE |

```go
ieee := crc32.NewIEEE()
ieee.Write([]byte("hello"))
fmt.Println(ieee.Sum32())

// Tabla personalizada
tab := crc32.MakeTable(0x04C11DB7)
h := crc32.New(tab)
h.Write([]byte("hello"))
fmt.Println(h.Sum32())
```

---

## Checksum directo

| Función | Descripción |
|---------|-------------|
| `Checksum(data []byte, tab *Table) uint32` | Calcula el CRC-32 de data |
| `ChecksumIEEE(data []byte) uint32` | Calcula el CRC-32 IEEE de data |
| `Update(crc uint32, tab *Table, p []byte) uint32` | Continúa un CRC a partir de un valor existente |

```go
data := []byte("hello world")
c := crc32.ChecksumIEEE(data)
fmt.Printf("CRC32 IEEE: 0x%X\n", c)

// Continuar un CRC en partes
var crc uint32
crc = crc32.Update(crc, crc32.IEEETable, []byte("hello "))
crc = crc32.Update(crc, crc32.IEEETable, []byte("world"))
fmt.Printf("CRC actualizado: 0x%X\n", crc)
```

---

## Ejemplo: comparar polinomios

```go
package main

import (
    "fmt"
    "hash/crc32"
)

func main() {
    data := []byte("The quick brown fox jumps over the lazy dog")

    ieee := crc32.Checksum(data, crc32.IEEETable)
    fmt.Printf("IEEE:       0x%08X\n", ieee)

    casta := crc32.Checksum(data, crc32.MakeTable(crc32.Castagnoli))
    fmt.Printf("Castagnoli: 0x%08X\n", casta)

    koop := crc32.Checksum(data, crc32.MakeTable(crc32.Koopman))
    fmt.Printf("Koopman:    0x%08X\n", koop)
}
```

---

## Ejemplo: CRC con streaming

```go
package main

import (
    "fmt"
    "hash/crc32"
    "io"
    "strings"
)

func main() {
    h := crc32.NewIEEE()
    r := strings.NewReader("contenido del archivo...")
    io.Copy(h, r)
    fmt.Printf("CRC32: %d\n", h.Sum32())
}
```

---

## Implementación hardware

El paquete usa automáticamente instrucciones de hardware (SSE 4.2 en x86,
CRC32 en ARMv8) cuando están disponibles, cayendo a implementación software
si el polinomio no es soportado por hardware.

---

[← Volver al índice](/indice)
