# crypto/ecdh — ECDH (intercambio de llaves)

Intercambio de llaves Diffie-Hellman con curvas elípticas. Go 1.20+.

```go
import "crypto/ecdh"
```

---

## Generar llave

```go
priv, _ := ecdh.P256().GenerateKey(rand.Reader)
pub := priv.PublicKey()
```

| Curva | Método |
|-------|--------|
| P-256 | `ecdh.P256()` |
| P-384 | `ecdh.P384()` |
| P-521 | `ecdh.P521()` |
| X25519 | `ecdh.X25519()` |

## Intercambio de llaves

```go
// Alice:
alicePriv, _ := ecdh.P256().GenerateKey(rand.Reader)
alicePub := alicePriv.PublicKey()

// Bob:
bobPriv, _ := ecdh.P256().GenerateKey(rand.Reader)
bobPub := bobPriv.PublicKey()

// Alice deriva secreto de Bob:
secretoAlice, _ := alicePriv.ECDH(bobPub)

// Bob deriva secreto de Alice:
secretoBob, _ := bobPriv.ECDH(alicePub)
// secretoAlice == secretoBob
```

---

[← Volver al índice](/indice)
