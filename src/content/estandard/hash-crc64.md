# hash/crc64 — Checksum CRC-64

Hash no criptográfico de 64 bits. Usado para integridad de datos.

```go
import "hash/crc64"
```

---

## Tablas predefinidas

```go
tab := crc64.MakeTable(crc64.ISO)  // ISO
tab := crc64.MakeTable(crc64.ECMA)  // ECMA
```

## Hash de datos

```go
h := crc64.New(tab)
h.Write([]byte("datos"))
checksum := h.Sum64()
```

## Checksum de una sola vez

```go
checksum := crc64.Checksum([]byte("datos"), tab)
```

## Actualizar checksum existente

```go
nuevo := crc64.Update(checksumAnterior, tab, nuevosDatos)
```

---

[← Volver al índice](/indice)
