# net/http/fcgi — Servir aplicaciones FastCGI

```go
import "net/http/fcgi"
```

---

```go
listener, _ := net.Listen("tcp", ":9000")
fcgi.Serve(listener, http.HandlerFunc(handler))
```

---

[← Volver al índice](/indice)
