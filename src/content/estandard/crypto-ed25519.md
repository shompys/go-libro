# crypto/ed25519 — Ed25519 (firmas modernas)

Firma digital rápida y segura con curva Edwards25519.

```go
import "crypto/ed25519"
```

---

## Generar llave

```go
pub, priv, _ := ed25519.GenerateKey(rand.Reader)
// pub: ed25519.PublicKey (32 bytes)
// priv: ed25519.PrivateKey (64 bytes = semilla + pub)
```

## Firmar

```go
mensaje := []byte("datos a firmar")
sig := ed25519.Sign(priv, mensaje)
// sig: 64 bytes
```

## Verificar

```go
valido := ed25519.Verify(pub, mensaje, sig)
```

---

## Ventajas sobre ECDSA

| | Ed25519 | ECDSA P-256 |
|--|---------|-------------|
| Firma | 64 bytes | ~71 bytes |
| Velocidad | Más rápida | Más lenta |
| Seguridad | ~128 bits | ~128 bits |
| Aleatoriedad | No necesita aleatoriedad (determinística) | Necesita |

---

[← Volver al índice](/indice)
