# net/http/httptest — Testear handlers HTTP

Crea requests y responses falsas para testear handlers sin levantar un servidor real.

```go
import "net/http/httptest"
```

---

## Probar un handler

```go
func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hola, %s!", r.URL.Query().Get("nombre"))
}

func TestHandler(t *testing.T) {
    req := httptest.NewRequest("GET", "/saludar?nombre=Juan", nil)
    w := httptest.NewRecorder()

    handler(w, req)

    resp := w.Result()
    body, _ := io.ReadAll(resp.Body)

    if resp.StatusCode != 200 {
        t.Errorf("esperado 200, obtenido %d", resp.StatusCode)
    }
    if string(body) != "Hola, Juan!" {
        t.Errorf("esperado 'Hola, Juan!', obtenido '%s'", body)
    }
}
```

---

## Probar un servidor completo

```go
func TestServidor(t *testing.T) {
    // Crear servidor real en puerto aleatorio
    srv := httptest.NewServer(http.HandlerFunc(handler))
    defer srv.Close()

    resp, _ := http.Get(srv.URL + "/saludar?nombre=Ana")
    body, _ := io.ReadAll(resp.Body)
    resp.Body.Close()

    // Assert sobre body...
}
```

---

## ResponseRecorder

| Método | Qué hace |
|--------|----------|
| `w.Result()` | Devuelve `*http.Response` generada |
| `w.Code` | Código de status |
| `w.Body` | `*bytes.Buffer` con el body |
| `w.Header()` | Headers de respuesta |
| `w.Write(b)` | Escribe al body |
| `w.WriteHeader(code)` | Setea el código de status |

---

[← Volver al índice](/indice)
