# net/http/cgi — Servir aplicaciones CGI

Ejecuta aplicaciones bajo la interfaz CGI (obsoleto).

```go
import "net/http/cgi"
```

---

```go
// Servir un binario como CGI:
cgi.Serve(http.HandlerFunc(handler))

// Ejecutar un handler como request CGI independiente:
handler := cgi.Handler{
    Path: "/usr/bin/php",
    Dir:  "/var/www",
}
http.ListenAndServe(":8080", handler)
```

---

[← Volver al índice](/indice)
