# os/signal — Manejo de señales del SO

Captura señales del sistema operativo (Ctrl+C, SIGTERM, etc.) para hacer un apagado limpio.

```go
import "os/signal"
```

---

## Índice

- [Capturar Ctrl+C](/estandard/os-signal#capturar-ctrl+c-sigint)
- [Capturar múltiples señales](/estandard/os-signal#capturar-múltiples-señales)
- [NotifyContext (Go 1.16+)](/estandard/os-signal#notifycontext)
- [Patrón: graceful shutdown](/estandard/os-signal#patrón-típico:-graceful-shutdown)
- [Ignore, Ignored, Reset, Stop](/estandard/os-signal#ignore,-ignored,-reset,-stop)
- [Señales comunes](/estandard/os-signal#señales-comunes)

---

## Capturar Ctrl+C (SIGINT)

```go
sigCh := make(chan os.Signal, 1)
signal.Notify(sigCh, os.Interrupt)

fmt.Println("Presioná Ctrl+C para salir...")
<-sigCh
fmt.Println("\nApagando...")
```

| Función | Qué hace |
|---------|----------|
| `signal.Notify(ch, sig...)` | Envía las señales indicadas al canal `ch` |

---

## Capturar múltiples señales

```go
sigCh := make(chan os.Signal, 1)
signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)

select {
case sig := <-sigCh:
    log.Printf("Señal recibida: %v", sig)
    // apagar servidor, cerrar DB, etc.
}
```

---

## NotifyContext (Go 1.16+)

La forma más moderna y recomendada: devuelve un `context.Context` que se cancela al recibir una señal:

```go
ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
defer stop()

<-ctx.Done()         // bloquea hasta recibir señal
log.Println("Señal recibida:", ctx.Err())
```

| Función | Qué hace |
|---------|----------|
| `signal.NotifyContext(parent, sig...)` | Crea un contexto que se cancela al recibir las señales |
| `stop()` | Detiene la escucha de señales (debe llamarse con defer) |

### Ejemplo con servidor HTTP

```go
ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
defer stop()

server := &http.Server{Addr: ":8080"}

go func() {
    <-ctx.Done()
    shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    server.Shutdown(shutdownCtx)
}()

server.ListenAndServe()
```

---

## Patrón típico: graceful shutdown

```go
func main() {
    sigCh := make(chan os.Signal, 1)
    signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)

    server := &http.Server{Addr: ":8080"}

    go func() {
        <-sigCh
        fmt.Println("Apagando servidor...")
        ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
        defer cancel()
        server.Shutdown(ctx)
    }()

    server.ListenAndServe()
}
```

---

## Ignore, Ignored, Reset, Stop

```go
// Ignore: ignora una señal (no se entrega al proceso)
signal.Ignore(os.Interrupt)

// Ignored: verifica si una señal está siendo ignorada
if signal.Ignored(os.Interrupt) {
    fmt.Println("SIGINT está ignorada")
}

// Notify con canal nil desactiva la notificación y restaura el comportamiento por defecto
signal.Reset(os.Interrupt)

// Stop: deja de enviar señales al canal (no restaura comportamiento)
signal.Stop(sigCh)
```

| Función | Qué hace |
|---------|----------|
| `signal.Ignore(sig...)` | Ignora las señales especificadas |
| `signal.Ignored(sig)` | ¿Está siendo ignorada esta señal? |
| `signal.Reset(sig...)` | Restaura el comportamiento por defecto de las señales |
| `signal.Stop(ch)` | Deja de enviar señales al canal (no cierra el canal) |

---

## Señales comunes (requiere `syscall`)

```go
import "syscall"
```

| Señal | Significado |
|-------|-------------|
| `os.Interrupt` | Ctrl+C |
| `syscall.SIGTERM` | kill (por defecto) |
| `syscall.SIGHUP` | Terminal cerrada |
| `syscall.SIGQUIT` | Ctrl+\ |

---

[← Volver al índice](/indice)
