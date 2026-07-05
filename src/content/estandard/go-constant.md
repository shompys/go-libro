# go/constant — Valores constantes

Representa valores constantes (enteros, floats, strings, complejos) en el sistema de tipos de Go.

```go
import "go/constant"
```

---

```go
// Crear constantes:
c := constant.MakeInt64(42)
c := constant.MakeString("hola")
c := constant.MakeFloat64(3.14)

// Operar:
c = constant.BinaryOp(c, constant.MakeInt64(1), token.ADD)

// Convertir:
i, exact := constant.Int64Val(c)
f, exact := constant.Float64Val(c)
s := constant.StringVal(c)

// Token de tipo:
kind := c.Kind()  // Int, Float, String, Complex, Unknown
```

---

[← Volver al índice](/indice)
