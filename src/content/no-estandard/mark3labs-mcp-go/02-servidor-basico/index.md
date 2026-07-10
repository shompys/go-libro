# 02 — Servidor Básico

Crear y configurar un servidor MCP con MCP-Go. Opciones de servidor, capacidades, metadata y lifecycle.

```go
import "github.com/mark3labs/mcp-go/server"
```

---

## Índice

- [Crear servidor](/no-estandard/mark3labs-mcp-go/02-servidor-basico#crear-servidor)
- [Opciones de servidor](/no-estandard/mark3labs-mcp-go/02-servidor-basico#opciones-de-servidor)
- [Capacidades](/no-estandard/mark3labs-mcp-go/02-servidor-basico#capacidades)
- [Metadata](/no-estandard/mark3labs-mcp-go/02-servidor-basico#metadata)
- [Iniciar servidor](/no-estandard/mark3labs-mcp-go/02-servidor-basico#iniciar-servidor)
- [Lifecycle](/no-estandard/mark3labs-mcp-go/02-servidor-basico#lifecycle)
- [Error handling](/no-estandard/mark3labs-mcp-go/02-servidor-basico#error-handling)

---

## Crear servidor

```go
s := server.NewMCPServer(
    "Mi Servidor MCP",  // Nombre
    "1.0.0",            // Versión
)
```

---

## Opciones de servidor

```go
s := server.NewMCPServer(
    "Advanced Server",
    "2.0.0",
    server.WithToolCapabilities(true),              // Habilitar tools
    server.WithResourceCapabilities(true, true),    // Habilitar resources (subscribe, listChanged)
    server.WithPromptCapabilities(true),            // Habilitar prompts
    server.WithRecovery(),                          // Panic recovery automático
    server.WithHooks(myHooks),                      // Lifecycle hooks
    server.WithInstructions("Un servidor increíble"),
)
```

---

## Capacidades

Las capacidades le dicen al cliente qué features soporta el servidor:

| Capacidad | Opción | Descripción |
|-----------|--------|-------------|
| Tools | `WithToolCapabilities(true)` | Ejecutar function calls desde LLMs |
| Resources | `WithResourceCapabilities(subscribe, listChanged)` | Proveer datos a LLMs |
| Prompts | `WithPromptCapabilities(true)` | Proveer prompt templates |
| Tasks | (ver Task-Augmented Tools) | Tools asíncronos de larga duración |
| Completions | (ver Completions) | Auto-completado de argumentos |
| Elicitation | (ver Elicitation) | Solicitar input del usuario |
| Roots | `WithRoots()` | Solicitar directorios raíz del cliente |

```go
s := server.NewMCPServer(
    "Full-Featured Server",
    "1.0.0",
    server.WithToolCapabilities(true),
    server.WithResourceCapabilities(true, true),
    server.WithPromptCapabilities(true),
)
```

---

## Metadata

### Implementation Metadata

```go
s := server.NewMCPServer(
    "My Server",
    "1.0.0",
    server.WithTitle("Mi Servidor"),
    server.WithDescription("Un servidor que hace cosas increíbles"),
    server.WithWebsiteURL("https://example.com"),
    server.WithIcons(
        mcp.Icon{
            Src:      "https://example.com/icon.png",
            MIMEType: "image/png",
            Sizes:    []string{"48x48"},
        },
    ),
)
```

### Experimental Capabilities

```go
s := server.NewMCPServer("My Server", "1.0.0",
    server.WithExperimental(map[string]any{
        "claude/channel": map[string]any{
            "supported": true,
        },
    }),
)
```

---

## Iniciar servidor

### STDIO (más común)

```go
if err := server.ServeStdio(s); err != nil {
    log.Fatal(err)
}
```

### StreamableHTTP

```go
httpServer := server.NewStreamableHTTPServer(s)
if err := httpServer.Start(":8080"); err != nil {
    log.Fatal(err)
}
```

### SSE (Server-Sent Events)

```go
sseServer := server.NewSSEServer(s)
if err := sseServer.Start(":8080"); err != nil {
    log.Fatal(err)
}
```

### Configuración por entorno

```go
func main() {
    s := server.NewMCPServer("Configurable Server", "1.0.0")

    transport := os.Getenv("MCP_TRANSPORT")
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    switch transport {
    case "http":
        httpServer := server.NewStreamableHTTPServer(s)
        httpServer.Start(":" + port)
    case "sse":
        sseServer := server.NewSSEServer(s)
        sseServer.Start(":" + port)
    default:
        server.ServeStdio(s)
    }
}
```

---

## Lifecycle

### Hooks de sesión

```go
hooks := &server.Hooks{}

hooks.AddOnRegisterSession(func(ctx context.Context, session server.ClientSession) {
    log.Printf("Cliente %s conectado", session.ID())
})

hooks.AddOnUnregisterSession(func(ctx context.Context, session server.ClientSession) {
    log.Printf("Cliente %s desconectado", session.ID())
})

hooks.AddBeforeAny(func(ctx context.Context, id any, method mcp.MCPMethod, message any) {
    log.Printf("Procesando request: %s", method)
})

hooks.AddOnError(func(ctx context.Context, id any, method mcp.MCPMethod, message any, err error) {
    log.Printf("Error en %s: %v", method, err)
})

s := server.NewMCPServer("Lifecycle Server", "1.0.0",
    server.WithHooks(hooks),
)
```

### Graceful shutdown

```go
c := make(chan os.Signal, 1)
signal.Notify(c, os.Interrupt, syscall.SIGTERM)

go func() {
    <-c
    log.Println("Shutting down server...")
    s.Shutdown()
}()

server.ServeStdio(s)
```

---

## Error handling

```go
s := server.NewMCPServer("Error-Safe Server", "1.0.0",
    server.WithRecovery(), // Panic recovery
)

if err := server.ServeStdio(s); err != nil {
    if errors.Is(err, server.ErrServerClosed) {
        log.Println("Server closed gracefully")
    } else {
        log.Fatalf("Server error: %v", err)
    }
}
```

---

[← Capítulo anterior](/no-estandard/mark3labs-mcp-go/01-introduccion) | [Siguiente capítulo →](/no-estandard/mark3labs-mcp-go/03-tools)
