# plugin — Plugins dinámicos

Carga código compilado como `.so` en runtime. **Solo Linux/FreeBSD/macOS.**

```go
import "plugin"
```

---

```go
p, err := plugin.Open("milib.so")
sym, _ := p.Lookup("MiFuncion")

fn := sym.(func(int) string)
result := fn(42)
```

---

**Limitación importante:** `plugin` solo funciona en Linux, FreeBSD y macOS. No en Windows. El plugin debe compilarse con exactamente la misma versión de Go y las mismas dependencias.

---

[← Volver al índice](/indice)
