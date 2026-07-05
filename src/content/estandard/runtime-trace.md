# runtime/trace — Tracing de ejecución

Captura y analiza la ejecución completa del programa Go.

```go
import "runtime/trace"
```

---

```go
f, _ := os.Create("trace.out")
trace.Start(f)
defer trace.Stop()

// ... ejecutar tu programa ...
```

Luego analizar con:

```bash
go tool trace trace.out
```

---

[← Volver al índice](/indice)
