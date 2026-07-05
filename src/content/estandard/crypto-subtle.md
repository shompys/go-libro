# crypto/subtle — Operaciones de tiempo constante

Previene **timing attacks** haciendo que las operaciones tarden lo mismo sin importar los datos.

```go
import "crypto/subtle"
```

---

## Comparación segura

```go
if subtle.ConstantTimeCompare(a, b) == 1 {
    // iguales
}
```

Comparación en tiempo constante. Evita que un atacante adivine contenido midiendo cuánto tarda el servidor en responder.

| Función | Devuelve |
|---------|----------|
| `ConstantTimeCompare(a, b)` | `1` si iguales, `0` si no |
| `ConstantTimeSelect(v, x, y)` | `x` si v==1, `y` si v==0 |
| `ConstantTimeByteEq(x, y)` | `0xFF` si iguales, `0` si no |
| `ConstantTimeEq(x, y)` | `1` si iguales, `0` si no |
| `ConstantTimeCopy(v, dst, src)` | Copia de a `len` bytes si v==1 |
| `ConstantTimeLessOrEq(x, y)` | `1` si x <= y, `0` si no |

---

[← Volver al índice](/indice)
