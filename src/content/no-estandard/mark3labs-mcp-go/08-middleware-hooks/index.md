# 08 — Middleware y Hooks

Middleware para cross-cutting concerns (logging, auth, rate limiting) y hooks para lifecycle events.

```go
import "github.com/mark3labs/mcp-go/server"
```

---

## Índice

- [Middleware](/no-estandard/mark3labs-mcp-go/08-middleware-hooks#middleware)
- [Registrar middleware](/no-estandard/mark3labs-mcp-go/08-middleware-hooks#registrar-middleware)
- [Logging middleware](/no-estandard/mark3labs-mcp-go/08-middleware-hooks#logging-middleware)
- [Auth middleware](/no-estandard/mark3labs-mcp-go/08-middleware-hooks#auth-middleware)
- [Rate limiting](/no-estandard/mark3labs-mcp-go/08-middleware-hooks#rate-limiting)
- [Hooks](/no-estandard/mark3labs-mcp-go/08-middleware-hooks#hooks)
- [Tool filtering](/no-estandard/mark3labs-mcp-go/08-middleware-hooks#tool-filtering)

---

## Middleware

Un middleware es una función que envuelve un handler:

```go
type ToolHandlerFunc func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error)

type ToolHandlerMiddleware func(ToolHandlerFunc) ToolHandlerFunc
```

---

## Registrar middleware

### En runtime con `Use()`

```go
s := server.NewMCPServer("my-server", "1.0.0")

s.Use(loggingMiddleware)
s.Use(authMiddleware, rateLimitMiddleware)
```

### En construcción

```go
s := server.NewMCPServer("my-server", "1.0.0",
    server.WithToolHandlerMiddleware(loggingMiddleware),
    server.WithResourceHandlerMiddleware(resourceLogger),
    server.WithPromptHandlerMiddleware(promptLogger),
)
```

> **Orden de ejecución:** Los middlewares se ejecutan en orden de registro. El primero registrado es el wrapper más externo.

---

## Logging middleware

```go
func loggingMiddleware(next server.ToolHandlerFunc) server.ToolHandlerFunc {
    return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
        start := time.Now()
        sessionID := server.GetSessionID(ctx)

        log.Printf("Tool call started: session=%s tool=%s", sessionID, req.Params.Name)

        result, err := next(ctx, req)

        duration := time.Since(start)
        if err != nil {
            log.Printf("Tool call failed: session=%s tool=%s duration=%v error=%v",
                sessionID, req.Params.Name, duration, err)
        } else {
            log.Printf("Tool call completed: session=%s tool=%s duration=%v",
                sessionID, req.Params.Name, duration)
        }

        return result, err
    }
}
```

---

## Auth middleware

```go
type contextKey string
const userKey contextKey = "user"

func authMiddleware(next server.ToolHandlerFunc) server.ToolHandlerFunc {
    return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
        token := extractToken(ctx)
        if token == "" {
            return nil, fmt.Errorf("autenticación requerida")
        }

        user, err := validateToken(token)
        if err != nil {
            return nil, fmt.Errorf("token inválido: %w", err)
        }

        ctx = context.WithValue(ctx, userKey, user)
        return next(ctx, req)
    }
}
```

---

## Rate limiting

```go
type rateLimiter struct {
    limiters sync.Map
    rate     rate.Limit
    burst    int
}

func newRateLimiter(rps float64, burst int) *rateLimiter {
    return &rateLimiter{rate: rate.Limit(rps), burst: burst}
}

func (r *rateLimiter) middleware(next server.ToolHandlerFunc) server.ToolHandlerFunc {
    return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
        sessionID := server.GetSessionID(ctx)
        limiter, _ := r.limiters.LoadOrStore(sessionID, rate.NewLimiter(r.rate, r.burst))

        if !limiter.(*rate.Limiter).Allow() {
            return nil, fmt.Errorf("rate limit excedido")
        }

        return next(ctx, req)
    }
}

rl := newRateLimiter(10, 20)
s.Use(rl.middleware)
```

---

## Hooks

Callbacks de lifecycle para telemetría y comportamiento custom.

### Session hooks

```go
hooks := &server.Hooks{}

hooks.AddOnRegisterSession(func(ctx context.Context, session server.ClientSession) {
    log.Printf("Sesión iniciada: %s", session.ID())
    initializeUserResources(session.ID())
})

hooks.AddOnUnregisterSession(func(ctx context.Context, session server.ClientSession) {
    log.Printf("Sesión finalizada: %s", session.ID())
    cleanupUserResources(session.ID())
})
```

### Request hooks

```go
hooks.AddBeforeAny(func(ctx context.Context, id any, method mcp.MCPMethod, message any) {
    log.Printf("Request: %s", method)
})

hooks.AddOnError(func(ctx context.Context, id any, method mcp.MCPMethod, message any, err error) {
    log.Printf("Error en %s: %v", method, err)
    metrics.Increment("errors", map[string]string{"method": string(method)})
})
```

### Telemetry hooks

```go
type TelemetryHooks struct {
    metrics MetricsCollector
    logger  *log.Logger
}

func (h *TelemetryHooks) OnToolCall(sessionID, toolName string, duration time.Duration, err error) {
    h.metrics.Increment("tools.calls", map[string]string{
        "tool":    toolName,
        "session": sessionID,
    })
    h.metrics.Histogram("tools.duration", duration.Seconds())

    if err != nil {
        h.metrics.Increment("tools.errors", map[string]string{"tool": toolName})
    }
}
```

### Agregar hooks a un servidor existente

```go
hooks := s.GetHooks()
if hooks == nil {
    hooks = &server.Hooks{}
}
hooks.AddBeforeAny(func(ctx context.Context, id any, method mcp.MCPMethod, message any) {
    log.Printf("Request: %s", method)
})
```

---

## Tool filtering

Filtrar tools expuestos según contexto, permisos, etc.

```go
s := server.NewMCPServer("Server", "1.0.0",
    server.WithToolFilter(func(ctx context.Context, tools []mcp.Tool) []mcp.Tool {
        session := server.ClientSessionFromContext(ctx)
        if session == nil {
            return nil
        }

        var filtered []mcp.Tool
        for _, tool := range tools {
            if shouldExposeTool(ctx, tool) {
                filtered = append(filtered, tool)
            }
        }
        return filtered
    }),
)
```

### Por permisos

```go
func (f *PermissionFilter) FilterTools(ctx context.Context, tools []mcp.Tool) []mcp.Tool {
    sessionID := server.GetSessionID(ctx)
    session, _ := f.sessionManager.GetSession(sessionID)

    var filtered []mcp.Tool
    for _, tool := range tools {
        if f.hasPermissionForTool(session, tool.Name) {
            filtered = append(filtered, tool)
        }
    }
    return filtered
}
```

---

[← Capítulo anterior](/no-estandard/mark3labs-mcp-go/07-clientes) | [Siguiente capítulo →](/no-estandard/mark3labs-mcp-go/09-avanzado)
