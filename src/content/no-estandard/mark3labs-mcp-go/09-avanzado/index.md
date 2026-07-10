# 09 — Avanzado

Features avanzadas: typed tools, session management, sampling, notificaciones y configuración de producción.

```go
import (
    "github.com/mark3labs/mcp-go/mcp"
    "github.com/mark3labs/mcp-go/server"
)
```

---

## Índice

- [Typed Tools](/no-estandard/mark3labs-mcp-go/09-avanzado#typed-tools)
- [Session Management](/no-estandard/mark3labs-mcp-go/09-avanzado#session-management)
- [Session Tools](/no-estandard/mark3labs-mcp-go/09-avanzado#session-tools)
- [Notificaciones](/no-estandard/mark3labs-mcp-go/09-avanzado#notificaciones)
- [Sampling](/no-estandard/mark3labs-mcp-go/09-avanzado#sampling)
- [Producción](/no-estandard/mark3labs-mcp-go/09-avanzado#produccion)

---

## Typed Tools

Type safety en compile-time con validación automática de parámetros.

```go
type CalculateInput struct {
    Operation string  `json:"operation" validate:"required,oneof=add subtract multiply divide"`
    X         float64 `json:"x" validate:"required"`
    Y         float64 `json:"y" validate:"required"`
}

type CalculateOutput struct {
    Result    float64 `json:"result"`
    Operation string  `json:"operation"`
}

tool := mcp.NewTool("calculate",
    mcp.WithDescription("Operaciones aritméticas"),
    mcp.WithInputSchema[CalculateInput](),
    mcp.WithOutputSchema[CalculateOutput](),
)

s.AddTool(tool, mcp.NewStructuredToolHandler(handleCalculateTyped))

func handleCalculateTyped(ctx context.Context, req mcp.CallToolRequest, input CalculateInput) (CalculateOutput, error) {
    var result float64
    switch input.Operation {
    case "add":
        result = input.X + input.Y
    case "subtract":
        result = input.X - input.Y
    case "multiply":
        result = input.X * input.Y
    case "divide":
        if input.Y == 0 {
            return CalculateOutput{}, fmt.Errorf("división por cero")
        }
        result = input.X / input.Y
    }
    return CalculateOutput{Result: result, Operation: input.Operation}, nil
}
```

### Validación de output schema

```go
s := server.NewMCPServer("Server", "1.0.0",
    server.WithOutputSchemaValidation(), // rechaza resultados que no matchean el schema
)
```

---

## Session Management

Estado por sesión con múltiples clientes concurrentes.

```go
type SessionState struct {
    UserID      string
    Permissions []string
    Settings    map[string]interface{}
    StartTime   time.Time
}

type SessionManager struct {
    sessions map[string]*SessionState
    mutex    sync.RWMutex
}

func NewSessionManager() *SessionManager {
    return &SessionManager{
        sessions: make(map[string]*SessionState),
    }
}

func (sm *SessionManager) CreateSession(sessionID, userID string, permissions []string) {
    sm.mutex.Lock()
    defer sm.mutex.Unlock()
    sm.sessions[sessionID] = &SessionState{
        UserID:      userID,
        Permissions: permissions,
        Settings:    make(map[string]interface{}),
        StartTime:   time.Now(),
    }
}

func (sm *SessionManager) GetSession(sessionID string) (*SessionState, bool) {
    sm.mutex.RLock()
    defer sm.mutex.RUnlock()
    session, exists := sm.sessions[sessionID]
    return session, exists
}
```

### Session-aware tools

```go
hooks := &server.Hooks{}
hooks.AddOnRegisterSession(func(ctx context.Context, session server.ClientSession) {
    sessionManager.CreateSession(session.ID(), "anonymous", []string{"read"})
})
hooks.AddOnUnregisterSession(func(ctx context.Context, session server.ClientSession) {
    sessionManager.RemoveSession(session.ID())
})

s := server.NewMCPServer("Session Server", "1.0.0",
    server.WithHooks(hooks),
)
```

---

## Session Tools

Tools específicos por sesión (override global tools).

```go
// Agregar tool a una sesión específica
err := s.AddSessionTool(sessionID, tool, handler)

// Agregar múltiples tools
err = s.AddSessionTools(sessionID,
    server.ServerTool{Tool: tool1, Handler: handler1},
    server.ServerTool{Tool: tool2, Handler: handler2},
)

// Eliminar session tools
err = s.DeleteSessionTools(sessionID, "tool_name")
```

---

## Notificaciones

Enviar mensajes server-to-client en tiempo real.

```go
func handleLongRunningTool(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
    srv := server.ServerFromContext(ctx)

    for i := 0; i < 100; i++ {
        time.Sleep(100 * time.Millisecond)

        srv.SendNotificationToAllClients("progress", map[string]interface{}{
            "progress": i + 1,
            "total":    100,
            "message":  fmt.Sprintf("Procesando paso %d/100", i+1),
        })
    }

    return mcp.NewToolResultText("Operación completada"), nil
}
```

### A un cliente específico

```go
srv.SendNotificationToClient(ctx, "custom_event", map[string]interface{}{
    "message":   "Update en tiempo real",
    "timestamp": time.Now().Unix(),
})
```

---

## Sampling

Feature avanzada: el servidor solicita completaciones LLM al cliente.

```go
mcpServer.EnableSampling()

mcpServer.AddTool(mcp.Tool{
    Name:        "ask_llm",
    Description: "Preguntar algo al LLM",
    InputSchema: mcp.ToolInputSchema{
        Type: "object",
        Properties: map[string]any{
            "question": map[string]any{"type": "string"},
        },
        Required: []string{"question"},
    },
}, func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
    question, _ := req.RequireString("question")

    samplingRequest := mcp.CreateMessageRequest{
        CreateMessageParams: mcp.CreateMessageParams{
            Messages: []mcp.SamplingMessage{
                {
                    Role:    mcp.RoleUser,
                    Content: mcp.TextContent{Type: "text", Text: question},
                },
            },
            MaxTokens: 1000,
        },
    }

    result, err := mcpServer.RequestSampling(ctx, samplingRequest)
    if err != nil {
        return mcp.NewToolResultError(fmt.Sprintf("Sampling falló: %v", err)), nil
    }

    return mcp.NewToolResultText(result.Content.Text), nil
})
```

> **Importante:** Sampling requiere un cliente que implemente `SamplingHandler` y debe incluir aprobación humana.

---

## Producción

### Servidor completo

```go
func main() {
    logger := log.New(os.Stdout, "[MCP] ", log.LstdFlags)
    sessionManager := NewSessionManager()

    loggingMW := NewLoggingMiddleware(logger)
    rateLimitMW := NewRateLimitMiddleware(10.0, 20)

    telemetryHooks := NewTelemetryHooks(metrics, logger)

    s := server.NewMCPServer("Production Server", "1.0.0",
        server.WithToolCapabilities(true),
        server.WithResourceCapabilities(false, true),
        server.WithPromptCapabilities(true),
        server.WithRecovery(),
        server.WithHooks(telemetryHooks),
        server.WithToolHandlerMiddleware(loggingMW.ToolMiddleware),
        server.WithToolFilter(NewPermissionFilter(sessionManager)),
    )

    addProductionTools(s)
    addProductionResources(s)

    startWithGracefulShutdown(s)
}

func startWithGracefulShutdown(s *server.MCPServer) {
    sigChan := make(chan os.Signal, 1)
    signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

    go func() {
        if err := server.ServeStdio(s); err != nil {
            log.Printf("Server error: %v", err)
        }
    }()

    <-sigChan
    log.Println("Shutting down...")

    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := s.Shutdown(ctx); err != nil {
        log.Printf("Shutdown error: %v", err)
    }
    log.Println("Server stopped")
}
```

### Content types adicionales

```go
// Audio
audioResult := &mcp.CallToolResult{
    Content: []mcp.Content{
        mcp.AudioContent{
            Type:     "audio",
            Data:     base64EncodedAudio,
            MIMEType: "audio/wav",
        },
    },
}

// Resource Link
result := &mcp.CallToolResult{
    Content: []mcp.Content{
        mcp.ResourceLink{
            Type:        "resource_link",
            URI:         "files://reports/q4.pdf",
            Name:        "Reporte Q4",
            Description: "Resumen financiero trimestral",
            MIMEType:    "application/pdf",
        },
    },
}
```

---

[← Capítulo anterior](/no-estandard/mark3labs-mcp-go/08-middleware-hooks) | [Volver al índice](/no-estandard/mark3labs-mcp-go)
