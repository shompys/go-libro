# crypto/rand — Números aleatorios criptográficos

Genera números aleatorios seguros (no predecibles). Para random no criptográfico, usar [math/rand](/math).

```go
import "crypto/rand"
```

---

## Índice

- [Reader — la fuente de entropía](/estandard/crypto-rand#reader-variable-global)
- [Leer bytes aleatorios (Read)](/estandard/crypto-rand#leer-bytes-aleatorios)
- [Número entero aleatorio (Int)](/estandard/crypto-rand#número-entero-aleatorio)
- [Número primo aleatorio (Prime)](/estandard/crypto-rand#número-primo-aleatorio)
- [Token aleatorio (string seguro)](/estandard/crypto-rand#token-aleatorio-string-seguro)

---

## Reader (variable global)

```go
var Reader io.Reader
```

`crypto/rand.Reader` es la fuente criptográficamente segura de aleatoriedad. En Linux usa `getrandom(2)`, en BSD usa `/dev/urandom`. Es una variable global que puede ser reemplazada (útil para testing con valores determinísticos).

```go
// Leer bytes aleatorios
buf := make([]byte, 16)
_, err := io.ReadFull(rand.Reader, buf)

// Usar con otras funciones crypto
privKey, _ := rsa.GenerateKey(rand.Reader, 2048)
```

---

## Leer bytes aleatorios

```go
var b [4]byte
n, err := rand.Read(b[:])  // llena con bytes aleatorios
```

`Read` es un wrapper de conveniencia para `io.ReadFull(rand.Reader, b)`.

---

## Número entero aleatorio (Int)

```go
import "crypto/rand"
import "math/big"

// Número aleatorio entre 0 y max-1
n, err := rand.Int(rand.Reader, big.NewInt(100))  // 0 a 99

// Número grande (ej: 2048 bits)
n, err = rand.Int(rand.Reader, new(big.Int).Lsh(big.NewInt(1), 2048))
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| rand | `io.Reader` | Fuente de aleatoriedad (usar `rand.Reader`) |
| max | `*big.Int` | Límite superior (exclusivo) |

---

## Número primo aleatorio (Prime)

```go
// Generar un primo aleatorio de 2048 bits
p, err := rand.Prime(rand.Reader, 2048)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| rand | `io.Reader` | Fuente de aleatoriedad |
| bits | `int` | Tamaño del primo en bits |

Útil para generación de claves RSA, parámetros Diffie-Hellman, etc.

---

## Token aleatorio (string seguro)

```go
import "crypto/rand"
import "encoding/hex"

func generarToken(n int) string {
    bytes := make([]byte, n)
    rand.Read(bytes)
    return hex.EncodeToString(bytes)
}

token := generarToken(32)  // string hex de 64 caracteres
```

Ideal para API keys, tokens de sesión, CSRF tokens.

```go
// Con base64 (más corto)
import "encoding/base64"

func generarTokenBase64(n int) string {
    bytes := make([]byte, n)
    rand.Read(bytes)
    return base64.RawURLEncoding.EncodeToString(bytes)
}
```

---

[← Volver al índice](/indice)
