# crypto/sha512 — Hash SHA-512 y variantes

Incluye SHA-512, SHA-384, SHA-512/224 y SHA-512/256.

```go
import "crypto/sha512"
```

---

## SHA-512

```go
data := []byte("mensaje")
hash := sha512.Sum512(data) // [64]byte

h := sha512.New()
h.Write(data)
hashBytes := h.Sum(nil) // []byte
```

| Función | Tamaño del hash |
|---------|-----------------|
| `sha512.Sum512(data)` | 64 bytes |
| `sha512.New()` | 64 bytes (streaming) |

---

## SHA-384

```go
hash := sha512.Sum384(data) // [48]byte

h := sha512.New384()
h.Write(data)
hashBytes := h.Sum(nil)
```

| Función | Tamaño del hash |
|---------|-----------------|
| `sha512.Sum384(data)` | 48 bytes |
| `sha512.New384()` | 48 bytes (streaming) |

---

## SHA-512/224 y SHA-512/256

Variantes truncadas (FIPS 180-4). Disponibles desde Go 1.12.

```go
hash224 := sha512.Sum512_224(data) // [28]byte
hash256 := sha512.Sum512_256(data) // [32]byte

h224 := sha512.New512_224()
h256 := sha512.New512_256()
```

| Función | Tamaño del hash |
|---------|-----------------|
| `sha512.Sum512_224(data)` | 28 bytes |
| `sha512.New512_224()` | 28 bytes (streaming) |
| `sha512.Sum512_256(data)` | 32 bytes |
| `sha512.New512_256()` | 32 bytes (streaming) |

---

## Tabla comparativa

| Variante | Tamaño | Bits de seguridad | Uso recomendado |
|----------|--------|-------------------|-----------------|
| SHA-512/224 | 28 bytes | 112 | Truncado, menos común |
| SHA-512/256 | 32 bytes | 128 | Igual que SHA-256 pero usa aritmética 64-bit |
| SHA-384 | 48 bytes | 192 | Balance seguridad/velocidad |
| SHA-512 | 64 bytes | 256 | Máxima seguridad |

> SHA-384 y SHA-512/256 son resistentes a length-extension attacks sin necesidad de HMAC.

---

[← Volver al índice](/indice)
