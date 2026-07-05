# net/http/httptrace — Trazabilidad HTTP

Hookea en eventos del ciclo de vida de una request HTTP.

```go
import "net/http/httptrace"
```

---

```go
trace := &httptrace.ClientTrace{
    GotConn: func(info httptrace.GotConnInfo) {
        fmt.Printf("Reutilizada: %v, tiempo: %v\n", info.Reused, info.WasIdle)
    },
    DNSDone: func(info httptrace.DNSDoneInfo) {
        fmt.Printf("DNS: %v → %v\n", info.Coalesced, info.Addrs)
    },
    GotFirstResponseByte: func() {
        fmt.Println("TTFB alcanzado!")
    },
}

ctx := httptrace.WithClientTrace(context.Background(), trace)
req, _ := http.NewRequestWithContext(ctx, "GET", "https://example.com", nil)
client.Do(req)
```

---

[← Volver al índice](/indice)
