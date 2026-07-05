# hash/adler32 — Checksum Adler-32

Hash no criptográfico de 32 bits, rápido, usado en zlib.

```go
import "hash/adler32"
```

---

## Hash de datos

```go
h := adler32.New()
h.Write([]byte("datos"))
checksum := h.Sum32()
fmt.Printf("%x\n", checksum)
```

## Checksum de una sola vez

```go
checksum := adler32.Checksum([]byte("datos"))
```

---

[← Volver al índice](/indice)
