# crypto/ecdsa — ECDSA (firmas elípticas)

Firma y verificación con curvas elípticas.

```go
import "crypto/ecdsa"
import "crypto/elliptic"
import "crypto/rand"
```

---

## Generar llave

```go
key, _ := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
// key = *ecdsa.PrivateKey (contiene PublicKey)
```

| Curva | Bits | Recomendada |
|-------|------|-------------|
| `elliptic.P256()` | 256 | **Sí** |
| `elliptic.P384()` | 384 | Sí |
| `elliptic.P521()` | 521 | Sí |

## Firmar

```go
hash := sha256.Sum256([]byte("mensaje"))
sig, _ := ecdsa.SignASN1(rand.Reader, key, hash[:])
```

## Verificar

```go
valid := ecdsa.VerifyASN1(&key.PublicKey, hash[:], sig)
```

---

[← Volver al índice](/indice)
