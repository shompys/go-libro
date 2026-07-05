# context — Contextos, deadlines y cancelación

Propaga deadlines, señales de cancelación y valores a través de goroutines.

```go
import "context"
```

---

## Índice

- [Contexto base](/estandard/context#contexto-base)
- [Timeout y deadline](/estandard/context#timeout-y-deadline)
- [Cancelación manual](/estandard/context#cancelación-manual)
- [Cancelación con causa (Go 1.20+)](/estandard/context#cancelación-con-causa)
- [WithoutCancel (Go 1.21+)](/estandard/context#withoutcancel)
- [AfterFunc (Go 1.21+)](/estandard/context#afterfunc)
- [Valores en contexto](/estandard/context#valores-en-contexto)
- [Ejemplo: HTTP client con timeout](/estandard/context#ejemplo:-http-client-con-timeout)

---

## Contexto base

```go
ctx := context.Background()   // contexto raíz (vacío, sin deadline)
ctx := context.TODO()         // placeholder ("ya lo definiré después")
```

`Background()` es el que usás en `main()` o al inicio de una request. `TODO()` es para cuando no sabés todavía qué contexto usar.

---

## Timeout y deadline

### WithTimeout

Cancela automáticamente después de un tiempo:

```go
ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
defer cancel()  // siempre llamar cancel para liberar recursos

select {
case <-ctx.Done():
    fmt.Println("Timeout:", ctx.Err())  // context.DeadlineExceeded
case resultado := <-trabajoLento(ctx):
    fmt.Println("Resultado:", resultado)
}
```

### WithTimeoutCause (Go 1.20+)

```go
ctx, cancel := context.WithTimeoutCause(
    context.Background(),
    3*time.Second,
    fmt.Errorf("la API tardó demasiado"),
)
defer cancel()

<-ctx.Done()
fmt.Println(context.Cause(ctx)) // "la API tardó demasiado"
```

### WithDeadline

Cancela a una hora específica:

```go
deadline := time.Now().Add(5 * time.Second)
ctx, cancel := context.WithDeadline(context.Background(), deadline)
defer cancel()
```

### WithDeadlineCause (Go 1.20+)

```go
ctx, cancel := context.WithDeadlineCause(
    context.Background(),
    time.Now().Add(5*time.Second),
    fmt.Errorf("deadline programado alcanzado"),
)
```

---

## Cancelación manual

```go
ctx, cancel := context.WithCancel(context.Background())

go func() {
    // ...
    cancel()  // manualmente cancelo
}()

<-ctx.Done()  // bloquea hasta que cancelen
```

| Función | Cuándo se cancela |
|---------|-------------------|
| `WithCancel()` | Manualmente con `cancel()` |
| `WithTimeout()` | Después de X tiempo |
| `WithDeadline()` | A una hora exacta |
| `WithCancelCause()` | Manualmente con `cancel(cause)` (Go 1.20+) |
| `WithTimeoutCause()` | Después de X tiempo con causa (Go 1.20+) |
| `WithDeadlineCause()` | A una hora exacta con causa (Go 1.20+) |

---

## Cancelación con causa (Go 1.20+)

Permite adjuntar un error descriptivo a la cancelación:

```go
ctx, cancel := context.WithCancelCause(context.Background())

go func() {
    // Algo salió mal
    cancel(fmt.Errorf("conexión a BD perdida"))
}()

<-ctx.Done()
fmt.Println(ctx.Err())       // context.Canceled
fmt.Println(context.Cause(ctx)) // "conexión a BD perdida"
```

| Función | Qué hace |
|---------|----------|
| `context.Cause(ctx)` | Devuelve la causa de cancelación (error), o `nil` si no se canceló / no tiene causa |

---

## WithoutCancel (Go 1.21+)

Crea un contexto que **no se cancela** cuando el padre se cancela, pero **hereda sus valores**:

```go
ctxPadre, cancel := context.WithCancel(context.Background())
cancel() // el padre se cancela

ctxHijo := context.WithoutCancel(ctxPadre)
// ctxPadre.Done() está cerrado, pero:
// ctxHijo.Done() NO está cerrado
// ctxHijo.Value("clave") todavía funciona (hereda valores)
```

Útil cuando necesitás que una operación sobreviva a la cancelación del padre (ej: rollback en BD, logging después de timeout).

---

## AfterFunc (Go 1.21+)

Ejecuta una función **automáticamente** cuando el contexto se cancela o expira. Similar a `defer` pero basado en contexto:

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

stop := context.AfterFunc(ctx, func() {
    fmt.Println("Contexto cancelado, limpiando recursos...")
    conn.Close()
})

// Si la operación termina antes, podemos cancelar la cleanup:
defer stop()
```

| Valor de retorno | Qué hace |
|-------------------|----------|
| `stop()` | Si se llama antes de que el contexto se cancele, la función NO se ejecuta. Devuelve `true` si evitó la ejecución, `false` si ya se ejecutó. |

---

## Valores en contexto

Pasar datos (tracing ID, usuario, etc.) entre goroutines:

```go
type ctxKey string  // siempre usá un type propio, nunca string desnudo

ctx := context.WithValue(context.Background(), ctxKey("usuario"), "admin")

usuario := ctx.Value(ctxKey("usuario")).(string)  // "admin"
```

⚠️ **No uses context para pasar datos de negocio.** Solo para metadata transversal (request ID, logger, etc.).

---

## Ejemplo: HTTP client con timeout

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

req, _ := http.NewRequestWithContext(ctx, "GET", "https://api.lenta.com", nil)
resp, err := http.DefaultClient.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()
```

Esto es obligatorio si usás un `http.Client` con timeout. Con `NewRequestWithContext` la request hereda el timeout del contexto.

---

## Métodos del contexto

| Método | Devuelve | Cuándo |
|--------|----------|--------|
| `Done()` | `<-chan struct{}` | Canal que se cierra al cancelar |
| `Err()` | `error` | `nil` si no cancelado, `Canceled` o `DeadlineExceeded` |
| `Deadline()` | `(time.Time, bool)` | Cuándo se cancela automáticamente |
| `Value(key)` | `any` | Valor asociado a esa key |

---

[← Volver al índice](/indice)
