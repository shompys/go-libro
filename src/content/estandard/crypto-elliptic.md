# crypto/elliptic — Curvas elípticas

Define curvas para usar con ECDSA (ver [crypto/ecdsa](/crypto-ecdsa)). Interfaz de bajo nivel.

```go
import "crypto/elliptic"
```

---

## Curvas disponibles

```go
elliptic.P256()          // P-256 (recomendada)
elliptic.P384()          // P-384
elliptic.P521()          // P-521
```

## Operaciones de curva (bajo nivel)

```go
curve := elliptic.P256()
x, y := curve.ScalarBaseMult(privateKeyBytes)
x2, y2 := curve.ScalarMult(publicX, publicY, privateKeyBytes)
```

---

[← Volver al índice](/indice)
