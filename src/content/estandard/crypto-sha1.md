# crypto/sha1 — Hash SHA-1

> SHA-1 está **roto criptográficamente** (ataque SHAttered). No usar en sistemas nuevos. Usar [crypto/sha256](/crypto-sha256) o [crypto/sha512](/crypto-sha512).

```go
import "crypto/sha1"
```

Único uso aceptable: compatibilidad con sistemas legacy o checksums no criptográficos.

---

## Hash de un string

```go
data := []byte("mensaje")
hash := sha1.Sum(data) // devuelve [20]byte
fmt.Printf("%x\n", hash)
```

| Función | Descripción |
|---------|-------------|
| `sha1.Sum(data []byte)` | Devuelve el hash SHA-1 como `[20]byte` |

---

## Hash en streaming (chunks)

```go
h := sha1.New()
h.Write([]byte("parte 1 "))
h.Write([]byte("parte 2"))
hash := h.Sum(nil) // []byte con el hash final
```

| Función | Descripción |
|---------|-------------|
| `sha1.New()` | Crea un nuevo `hash.Hash` para streaming |

---

## Tamaño del hash

```go
sha1.Size       // 20 (bytes)
sha1.BlockSize  // 64 (bytes)
```

---

[← Volver al índice](/indice)
