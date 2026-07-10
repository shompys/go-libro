# 06 — Transports

Los transports definen cómo se comunican clientes y servidores MCP. MCP-Go soporta múltiples métodos para distintos escenarios de deployment.

```go
import "github.com/mark3labs/mcp-go/server"
```

---

## Índice

- [Comparación](/no-estandard/mark3labs-mcp-go/06-transports#comparacion)
- [STDIO](/no-estandard/mark3labs-mcp-go/06-transports#stdio)
- [StreamableHTTP](/no-estandard/mark3labs-mcp-go/06-transports#streamablehttp)
- [SSE](/no-estandard/mark3labs-mcp-go/06-transports#sse)
- [In-Process](/no-estandard/mark3labs-mcp-go/06-transports#in-process)
- [Configuración avanzada](/no-estandard/mark3labs-mcp-go/06-transports#configuracion-avanzada)

---

## Comparación

| Transport | Caso de uso | Pros | Contras |
|-----------|-------------|------|---------|
| **STDIO** | CLI tools, desktop | Simple, seguro, sin red | Solo local, un cliente |
| **SSE** | Web apps, real-time | Multi-cliente, streaming, web | Overhead HTTP, streaming unidireccional |
| **StreamableHTTP** | Web services, APIs | Estándar, caching, load balancing | Sin real-time, más complejo |
| **In-Process** | Testing, embedded | Sin serialización, rápido | Solo mismo proceso |

---

## STDIO

El más común. Comunicación via stdin/stdout.

```go
s := server.NewMCPServer("CLI Tool", "1.0.0",
    server.WithToolCapabilities(true),
)

if err := server.ServeStdio(s); err != nil {
    log.Fatal(err)
}
```

**Ideal para:**
- Herramientas de línea de comandos
- Integraciones con IDEs
- Aplicaciones de escritorio
- Escenarios de un solo usuario

---

## StreamableHTTP

HTTP request/response tradicional.

```go
s := server.NewMCPServer("HTTP Server", "1.0.0")

httpServer := server.NewStreamableHTTPServer(s,
    server.WithEndpointPath("/mcp"),
    server.WithStateLess(true),
)

if err := httpServer.Start(":8080"); err != nil {
    log.Fatal(err)
}
```

### Con opciones avanzadas

```go
httpServer := server.NewStreamableHTTPServer(s,
    server.WithEndpointPath("/api/v1/mcp"),
    server.WithHeartbeatInterval(30*time.Second),
    server.WithStateLess(false),
    server.WithSessionIdleTTL(10*time.Minute),
    server.WithTLSCert("/path/to/cert.pem", "/path/to/key.pem"),
)
```

**Ideal para:**
- Microservicios
- APIs públicas
- Deployments con load balancer
- Integración con infraestructura HTTP existente

---

## SSE

Server-Sent Events para comunicación en tiempo real.

```go
s := server.NewMCPServer("SSE Server", "1.0.0")

sseServer := server.NewSSEServer(s,
    server.WithSSEEndpoint("/events"),
    server.WithMessageEndpoint("/message"),
    server.WithKeepAlive(true),
)

if err := sseServer.Start(":8080"); err != nil {
    log.Fatal(err)
}
```

### Configuración completa

```go
sseServer := server.NewSSEServer(s,
    server.WithStaticBasePath("/api/mcp"),
    server.WithKeepAliveInterval(30*time.Second),
    server.WithBaseURL("http://localhost:8080"),
    server.WithSSEEndpoint("/sse"),
    server.WithMessageEndpoint("/message"),
    server.WithSSECORS(
        server.WithCORSAllowedOrigins("https://mi-app.com"),
        server.WithCORSAllowCredentials(),
    ),
)
```

**Ideal para:**
- Aplicaciones web con actualizaciones en tiempo real
- Dashboards de monitoreo
- Herramientas colaborativas
- Interfaces browser-based

---

## In-Process

Comunicación directa sin serialización. Ideal para testing.

```go
s := server.NewMCPServer("Embedded Server", "1.0.0")

client := client.NewInProcessClient(s)
defer client.Close()
```

---

## Configuración avanzada

### Selección por entorno

```go
func main() {
    s := server.NewMCPServer("Multi-Transport", "1.0.0")

    transport := os.Getenv("MCP_TRANSPORT")
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    switch transport {
    case "sse":
        sseServer := server.NewSSEServer(s)
        sseServer.Start(":" + port)
    case "http":
        httpServer := server.NewStreamableHTTPServer(s)
        httpServer.Start(":" + port)
    default:
        server.ServeStdio(s)
    }
}
```

### CORS

```go
httpServer := server.NewStreamableHTTPServer(s,
    server.WithStreamableHTTPCORS(
        server.WithCORSAllowedOrigins("https://mi-app.com", "http://localhost:3000"),
        server.WithCORSAllowCredentials(),
        server.WithCORSMaxAge(300),
    ),
)
```

### DNS Rebinding Protection

Habilitada por defecto para servidores locales. Para deshabilitar (solo si entendés los riesgos):

```go
httpServer := server.NewStreamableHTTPServer(s,
    server.WithDisableLocalhostProtection(true),
)
```

---

[← Capítulo anterior](/no-estandard/mark3labs-mcp-go/05-prompts) | [Siguiente capítulo →](/no-estandard/mark3labs-mcp-go/07-clientes)
