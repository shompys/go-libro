# 04 — Resources

Los resources exponen datos de solo lectura a los LLMs. Son como GET endpoints que proveen acceso a archivos, bases de datos, APIs u otras fuentes de datos.

```go
import "github.com/mark3labs/mcp-go/mcp"
```

---

## Índice

- [Definir un resource](/no-estandard/mark3labs-mcp-go/04-resources#definir-un-resource)
- [Resources estáticos](/no-estandard/mark3labs-mcp-go/04-resources#resources-estaticos)
- [Resources dinámicos](/no-estandard/mark3labs-mcp-go/04-resources#resources-dinamicos)
- [Tipos de contenido](/no-estandard/mark3labs-mcp-go/04-resources#tipos-de-contenido)
- [Suscripciones](/no-estandard/mark3labs-mcp-go/04-resources#suscripciones)
- [Handlers](/no-estandard/mark3labs-mcp-go/04-resources#handlers)

---

## Definir un resource

```go
resource := mcp.NewResource(
    "docs://readme",           // URI - identificador único
    "README del Proyecto",     // Nombre - legible por humanos
    mcp.WithResourceDescription("Documentación principal del proyecto"),
    mcp.WithMIMEType("text/markdown"),
)
```

### Con metadata adicional

```go
resource := mcp.NewResource(
    "file:///var/log/app.log",
    "app.log",
    mcp.WithResourceTitle("Log de la Aplicación"),
    mcp.WithMIMEType("text/plain"),
    mcp.WithResourceSize(2_048_576),  // 2 MiB
    mcp.WithResourceIcons(
        mcp.Icon{
            Src:      "https://example.com/icons/log.svg",
            MIMEType: "image/svg+xml",
        },
    ),
)
```

---

## Resources estáticos

URI fija con contenido predeterminado:

```go
s.AddResource(
    mcp.NewResource(
        "file://README.md",
        "README del Proyecto",
        mcp.WithResourceDescription("Documentación principal"),
        mcp.WithMIMEType("text/markdown"),
    ),
    handleReadmeFile,
)

func handleReadmeFile(ctx context.Context, req mcp.ReadResourceRequest) (*mcp.ReadResourceResult, error) {
    content, err := os.ReadFile("README.md")
    if err != nil {
        return nil, fmt.Errorf("error leyendo README: %w", err)
    }

    return &mcp.ReadResourceResult{
        Contents: []mcp.ResourceContent{
            {
                URI:      req.Params.URI,
                MIMEType: "text/markdown",
                Text:     string(content),
            },
        },
    }, nil
}
```

---

## Resources dinámicos

URI templates con parámetros `{param}`:

```go
s.AddResource(
    mcp.NewResource(
        "users://{user_id}",
        "Perfil de Usuario",
        mcp.WithResourceDescription("Información del usuario"),
        mcp.WithMIMEType("application/json"),
    ),
    handleUserProfile,
)

func handleUserProfile(ctx context.Context, req mcp.ReadResourceRequest) (*mcp.ReadResourceResult, error) {
    userID := extractUserID(req.Params.URI) // "users://123" -> "123"

    user, err := getUserFromDB(userID)
    if err != nil {
        return nil, fmt.Errorf("usuario no encontrado: %w", err)
    }

    jsonData, err := json.Marshal(user)
    if err != nil {
        return nil, err
    }

    return &mcp.ReadResourceResult{
        Contents: []mcp.ResourceContent{
            mcp.TextResourceContent{
                URI:      req.Params.URI,
                MIMEType: "application/json",
                Text:     string(jsonData),
            },
        },
    }, nil
}
```

---

## Tipos de contenido

### Texto

```go
return &mcp.ReadResourceResult{
    Contents: []mcp.ResourceContent{
        {
            URI:      req.Params.URI,
            MIMEType: "text/plain",
            Text:     "Contenido de texto",
        },
    },
}, nil
```

### JSON

```go
return &mcp.ReadResourceResult{
    Contents: []mcp.ResourceContent{
        mcp.TextResourceContent{
            URI:      req.Params.URI,
            MIMEType: "application/json",
            Text:     string(jsonData),
        },
    },
}, nil
```

### Binario (base64)

```go
imageData, _ := os.ReadFile("logo.png")
encoded := base64.StdEncoding.EncodeToString(imageData)

return &mcp.ReadResourceResult{
    Contents: []mcp.ResourceContent{
        {
            URI:      req.Params.URI,
            MIMEType: "image/png",
            Blob:     encoded,
        },
    },
}, nil
```

---

## Suscripciones

Los clientes pueden suscribirse a cambios de resources:

```go
s := server.NewMCPServer("Resource Server", "1.0.0",
    server.WithResourceCapabilities(true, true), // subscribe, listChanged
)
```

### Notificar cambios

```go
func notifyResourceUpdated(s *server.MCPServer, uri string) {
    s.SendNotificationToSpecificClient(
        sessionID,
        "notifications/resources/updated",
        map[string]any{"uri": uri},
    )
}
```

---

## Handlers

### Configuración

```go
func handleAppConfig(ctx context.Context, req mcp.ReadResourceRequest) (*mcp.ReadResourceResult, error) {
    config := map[string]interface{}{
        "database_url": os.Getenv("DATABASE_URL"),
        "debug_mode":   os.Getenv("DEBUG") == "true",
        "version":      "1.0.0",
    }

    configJSON, _ := json.Marshal(config)

    return &mcp.ReadResourceResult{
        Contents: []mcp.ResourceContent{
            mcp.TextResourceContent{
                URI:      req.Params.URI,
                MIMEType: "application/json",
                Text:     string(configJSON),
            },
        },
    }, nil
}
```

### Base de datos

```go
s.AddResource(
    mcp.NewResource(
        "db://{table}/{id}",
        "Registro de BD",
        mcp.WithResourceDescription("Acceder a registros por tabla e ID"),
        mcp.WithMIMEType("application/json"),
    ),
    handleDatabaseRecord,
)
```

> **Precaución:** Validar nombres de tablas para prevenir inyección SQL.

---

[← Capítulo anterior](/no-estandard/mark3labs-mcp-go/03-tools) | [Siguiente capítulo →](/no-estandard/mark3labs-mcp-go/05-prompts)
