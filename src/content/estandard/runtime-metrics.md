# runtime/metrics — Métricas del runtime

Lee estadísticas del runtime en tiempo real. Go 1.16+.

```go
import "runtime/metrics"
```

---

```go
// Listar todas las métricas disponibles:
descs := metrics.All()

// Leer métricas específicas:
samples := []metrics.Sample{
    {Name: "/gc/cycles/automatic:gc-cycles"},
    {Name: "/sched/goroutines:goroutines"},
}
metrics.Read(samples)

fmt.Printf("GC cycles: %d\n", samples[0].Value.Uint64())
fmt.Printf("Goroutines: %d\n", samples[1].Value.Uint64())
```

---

[← Volver al índice](/indice)
