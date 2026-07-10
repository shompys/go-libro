# 01 — Introducción a MCP-Go

El Model Context Protocol (MCP) es un estándar abierto que permite conexiones seguras entre aplicaciones de IA (LLMs) y fuentes de datos o herramientas externas. MCP-Go es la implementación en Go que permite construir servidores y clientes MCP con mínimo boilerplate.

```go
import (
    "github.com/mark3labs/mcp-go/mcp"
    "github.com/mark3labs/mcp-go/server"
    "github.com/mark3labs/mcp-go/client"
)
```

---

## Índice

- [Qué es MCP](/no-estandard/mark3labs-mcp-go/01-introduccion#que-es-mcp)
- [Instalación](/no-estandard/mark3labs-mcp-go/01-introduccion#instalacion)
- [Conceptos clave](/no-estandard/mark3labs-mcp-go/01-introduccion#conceptos-clave)
- [Tu primer servidor](/no-estandard/mark3labs-mcp-go/01-introduccion#tu-primer-servidor)
- [Ejecutar el servidor](/no-estandard/mark3labs-mcp-go/01-introduccion#ejecutar-el-servidor)

---

## Qué es MCP

MCP define cuatro conceptos fundamentales:

| Concepto | Analogía | Descripción |
|----------|----------|-------------|
| **Tools** | POST endpoints | Funciones que los LLMs pueden invocar para realizar acciones |
| **Resources** | GET endpoints | Datos de solo lectura que los LLMs pueden acceder |
| **Prompts** | Templates | Plantillas reutilizables para estructurar conversaciones |
| **Transports** | Protocolos | Métodos de comunicación (STDIO, HTTP, SSE, In-Process) |

---

## Instalación

```bash
go get github.com/mark3labs/mcp-go
```

---

## Conceptos clave

### Tools

Las tools son funciones que los LLMs pueden llamar:

```go
tool := mcp.NewTool("calcular",
    mcp.WithDescription("Realizar operaciones aritméticas"),
    mcp.WithString("operacion",
        mcp.Required(),
        mcp.Enum("sumar", "restar", "multiplicar", "dividir"),
    ),
    mcp.WithNumber("x", mcp.Required()),
    mcp.WithNumber("y", mcp.Required()),
)
```

### Resources

Los resources exponen datos de solo lectura:

```go
resource := mcp.NewResource(
    "docs://readme",
    "README del Proyecto",
    mcp.WithResourceDescription("Documentación principal del proyecto"),
    mcp.WithMIMEType("text/markdown"),
)
```

### Transports

| Transport | Caso de uso | Ventajas | Desventajas |
|-----------|-------------|----------|-------------|
| **STDIO** | CLI tools, desktop apps | Simple, seguro, sin red | Solo local, un cliente |
| **SSE** | Web apps, real-time | Multi-cliente, streaming | Overhead HTTP |
| **StreamableHTTP** | Web services, APIs | Estándar, caching, load balancing | Sin real-time |
| **In-Process** | Testing, embedded | Sin serialización, rápido | Mismo proceso |

---

## Tu primer servidor

```go
package main

import (
    "context"
    "fmt"

    "github.com/mark3labs/mcp-go/mcp"
    "github.com/mark3labs/mcp-go/server"
)

func main() {
    // Crear servidor MCP
    s := server.NewMCPServer(
        "Demo",
        "1.0.0",
        server.WithToolCapabilities(false),
    )

    // Definir tool
    tool := mcp.NewTool("hello_world",
        mcp.WithDescription("Saludar a alguien"),
        mcp.WithString("name",
            mcp.Required(),
            mcp.Description("Nombre de la persona a saludar"),
        ),
    )

    // Agregar handler
    s.AddTool(tool, helloHandler)

    // Iniciar servidor STDIO
    if err := server.ServeStdio(s); err != nil {
        fmt.Printf("Error del servidor: %v\n", err)
    }
}

func helloHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
    name, err := request.RequireString("name")
    if err != nil {
        return mcp.NewToolResultError(err.Error()), nil
    }

    return mcp.NewToolResultText(fmt.Sprintf("Hola, %s!", name)), nil
}
```

---

## Ejecutar el servidor

```bash
go run main.go
```

El servidor queda escuchando via STDIO, listo para aceptar conexiones de clientes MCP.

### Probar con MCP Inspector

```bash
npm install -g @modelcontextprotocol/inspector
mcp-inspector go run main.go
```

### Configurar en Claude Desktop

Editar el archivo de configuración de Claude:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "hello-world": {
      "command": "go",
      "args": ["run", "/path/to/your/main.go"]
    }
  }
}
```

---

[← Volver al índice](/no-estandard/mark3labs-mcp-go)
