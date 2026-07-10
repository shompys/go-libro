# 07 — Clientes

Crear clientes MCP para conectarse a servidores y usar tools, resources y prompts.

```go
import (
    "github.com/mark3labs/mcp-go/client"
    "github.com/mark3labs/mcp-go/client/transport"
    "github.com/mark3labs/mcp-go/mcp"
)
```

---

## Índice

- [Crear clientes](/no-estandard/mark3labs-mcp-go/07-clientes#crear-clientes)
- [Inicialización](/no-estandard/mark3labs-mcp-go/07-clientes#inicializacion)
- [Listar tools](/no-estandard/mark3labs-mcp-go/07-clientes#listar-tools)
- [Llamar tools](/no-estandard/mark3labs-mcp-go/07-clientes#llamar-tools)
- [Resources](/no-estandard/mark3labs-mcp-go/07-clientes#resources)
- [Prompts](/no-estandard/mark3labs-mcp-go/07-clientes#prompts)
- [Error handling](/no-estandard/mark3labs-mcp-go/07-clientes#error-handling)

---

## Crear clientes

### STDIO

```go
c, err := client.NewStdioMCPClient(
    "go", []string{}, "run", "/path/to/server/main.go",
)
if err != nil {
    log.Fatal(err)
}
defer c.Close()
```

### StreamableHTTP

```go
httpTransport, err := transport.NewStreamableHTTP("http://localhost:8080/mcp",
    transport.WithHTTPTimeout(30*time.Second),
    transport.WithHTTPHeaders(map[string]string{
        "Authorization": "Bearer token",
    }),
)
if err != nil {
    log.Fatal(err)
}

c := client.NewClient(httpTransport)
defer c.Close()
```

### SSE

```go
c, err := client.NewSSEMCPClient("http://localhost:8080/sse",
    client.WithHeaders(map[string]string{
        "X-Custom-Header": "value",
    }),
)
if err != nil {
    log.Fatal(err)
}
defer c.Close()
```

### In-Process

```go
c := client.NewInProcessClient(server)
defer c.Close()
```

---

## Inicialización

```go
ctx := context.Background()

initRequest := mcp.InitializeRequest{}
initRequest.Params.ProtocolVersion = mcp.LATEST_PROTOCOL_VERSION
initRequest.Params.ClientInfo = mcp.Implementation{
    Name:    "Mi Cliente",
    Version: "1.0.0",
}
initRequest.Params.Capabilities = mcp.ClientCapabilities{}

serverInfo, err := c.Initialize(ctx, initRequest)
if err != nil {
    log.Fatalf("Error inicializando: %v", err)
}

fmt.Printf("Conectado a: %s v%s\n",
    serverInfo.ServerInfo.Name,
    serverInfo.ServerInfo.Version)
```

---

## Listar tools

```go
toolsResult, err := c.ListTools(ctx, mcp.ListToolsRequest{})
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Tools disponibles: %d\n", len(toolsResult.Tools))
for _, tool := range toolsResult.Tools {
    fmt.Printf("- %s: %s\n", tool.Name, tool.Description)
}
```

### Iteradores (Go 1.23+)

Para result sets grandes, usar iteradores que fetchen páginas lazy:

```go
for tool, err := range c.IterTools(ctx, mcp.ListToolsRequest{}) {
    if err != nil {
        return err
    }
    fmt.Println(tool.Name)
}
```

---

## Llamar tools

```go
callRequest := mcp.CallToolRequest{}
callRequest.Params.Name = "hello_world"
callRequest.Params.Arguments = map[string]interface{}{
    "name": "Mundo",
}

result, err := c.CallTool(ctx, callRequest)
if err != nil {
    log.Fatal(err)
}

for _, content := range result.Content {
    if textContent, ok := content.(mcp.TextContent); ok {
        fmt.Printf("Resultado: %s\n", textContent.Text)
    }
}
```

---

## Resources

### Listar

```go
resources, err := c.ListResources(ctx, mcp.ListResourcesRequest{})
if err != nil {
    log.Fatal(err)
}

for _, resource := range resources.Resources {
    fmt.Printf("- %s: %s (%s)\n", resource.URI, resource.Name, resource.MIMEType)
}
```

### Leer

```go
result, err := c.ReadResource(ctx, mcp.ReadResourceRequest{
    Params: mcp.ReadResourceRequestParams{
        URI: "docs://readme",
    },
})
if err != nil {
    log.Fatal(err)
}

for _, content := range result.Contents {
    fmt.Printf("Contenido: %s\n", content.Text)
}
```

---

## Prompts

### Listar

```go
prompts, err := c.ListPrompts(ctx, mcp.ListPromptsRequest{})
if err != nil {
    log.Fatal(err)
}

for _, prompt := range prompts.Prompts {
    fmt.Printf("- %s: %s\n", prompt.Name, prompt.Description)
}
```

### Usar

```go
result, err := c.GetPrompt(ctx, mcp.GetPromptRequest{
    Params: mcp.GetPromptRequestParams{
        Name: "code_review",
        Arguments: map[string]interface{}{
            "code":     "func main() { fmt.Println(\"hola\") }",
            "language": "go",
        },
    },
})
if err != nil {
    log.Fatal(err)
}

for _, msg := range result.Messages {
    fmt.Printf("[%s] %s\n", msg.Role, msg.Content.Text)
}
```

---

## Error handling

### Retry con backoff

```go
func callToolWithRetry(ctx context.Context, c client.Client, req mcp.CallToolRequest, maxRetries int) (*mcp.CallToolResult, error) {
    var lastErr error

    for attempt := 0; attempt <= maxRetries; attempt++ {
        result, err := c.CallTool(ctx, req)
        if err == nil {
            return result, nil
        }

        lastErr = err

        if attempt < maxRetries {
            backoff := time.Duration(1<<attempt) * time.Second
            log.Printf("Intento %d falló, reintentando en %v: %v", attempt+1, backoff, err)
            time.Sleep(backoff)
        }
    }

    return nil, fmt.Errorf("falló después de %d intentos: %w", maxRetries+1, lastErr)
}
```

### Context y timeouts

```go
ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()

result, err := c.CallTool(ctx, callRequest)
if err != nil {
    if errors.Is(err, context.DeadlineExceeded) {
        log.Println("Timeout en la llamada al tool")
    }
}
```

---

[← Capítulo anterior](/no-estandard/mark3labs-mcp-go/06-transports) | [Siguiente capítulo →](/no-estandard/mark3labs-mcp-go/08-middleware-hooks)
