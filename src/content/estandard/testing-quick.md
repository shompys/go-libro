# testing/quick — Testing basado en propiedades

Genera valores aleatorios y prueba que ciertas propiedades se cumplan.

```go
import "testing/quick"
```

---

```go
func TestPropiedad(t *testing.T) {
    // Probar que doble(x) >= x para todo x >= 0
    f := func(x uint) bool {
        return x*2 >= x
    }
    if err := quick.Check(f, nil); err != nil {
        t.Error(err)
    }
}
```

---

[← Volver al índice](/indice)
