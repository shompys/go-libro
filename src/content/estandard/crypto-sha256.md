# crypto/sha256 — Hash SHA-256

Genera hashes criptográficos SHA-256.

```go
import "crypto/sha256"
```

Para números aleatorios criptográficos, ver [crypto/rand](/crypto-rand).

---

## Hash de un string

```go
data := []byte("mensaje secreto")
hash := sha256.Sum256(data)
fmt.Printf("%x\n", hash)  // salida en hexadecimal
```

`Sum256` devuelve un array fijo `[32]byte`.

---

## Hash de datos en chunks (streaming)

```go
h := sha256.New()
h.Write([]byte("parte 1 "))
h.Write([]byte("parte 2"))
hash := h.Sum(nil)  // []byte con el hash final
```

Útil para archivos grandes o datos que llegan de a poco.

---

## Formas de mostrar el hash

```go
fmt.Printf("%x\n", hash)        // 1a2b3c...
fmt.Printf("%X\n", hash)        // 1A2B3C... (mayúsculas)
encoded := hex.EncodeToString(hash)  // string hexadecimal
```

---

[← Volver al índice](/indice)
