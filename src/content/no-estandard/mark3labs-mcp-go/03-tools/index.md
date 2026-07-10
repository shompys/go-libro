# 03 — Tools

Las tools son funciones que los LLMs pueden invocar para realizar acciones. Son el principal mecanismo para extender las capacidades de un LLM con MCP.

```go
import "github.com/mark3labs/mcp-go/mcp"
```

---

## Índice

- [Definir un tool](/no-estandard/mark3labs-mcp-go/03-tools#definir-un-tool)
- [Tipos de parámetros](/no-estandard/mark3labs-mcp-go/03-tools#tipos-de-parametros)
- [Handlers](/no-estandard/mark3labs-mcp-go/03-tools#handlers)
- [Extracción de parámetros](/no-estandard/mark3labs-mcp-go/03-tools#extraccion-de-parametros)
- [Resultados](/no-estandard/mark3labs-mcp-go/03-tools#resultados)
- [Schema con structs](/no-estandard/mark3labs-mcp-go/03-tools#schema-con-structs)
- [Errores](/no-estandard/mark3labs-mcp-go/03-tools#errores)

---

## Definir un tool

```go
tool := mcp.NewTool("calcular",
    mcp.WithDescription("Realizar operaciones aritméticas"),
    mcp.WithString("operacion",
        mcp.Required(),
        mcp.Enum("sumar", "restar", "multiplicar", "dividir"),
        mcp.Description("La operación a realizar"),
    ),
    mcp.WithNumber("x", mcp.Required(), mcp.Description("Primer número")),
    mcp.WithNumber("y", mcp.Required(), mcp.Description("Segundo número")),
)

s.AddTool(tool, handleCalcular)
```

---

## Tipos de parámetros

| Tipo | Función | Ejemplo |
|------|---------|---------|
| String | `WithString` | `mcp.WithString("nombre", mcp.Required())` |
| Number | `WithNumber` | `mcp.WithNumber("precio", mcp.Min(0))` |
| Integer | `WithInteger` | `mcp.WithInteger("count", mcp.DefaultNumber(10))` |
| Boolean | `WithBoolean` | `mcp.WithBoolean("activo", mcp.DefaultBool(true))` |
| Array | `WithArray` | `mcp.WithArray("tags", mcp.Items(...))` |
| Object | `WithObject` | `mcp.WithObject("config", mcp.Properties(...))` |

### Constraints

```go
mcp.WithString("email",
    mcp.Required(),
    mcp.Pattern(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`),
    mcp.MinLength(5),
    mcp.MaxLength(255),
)

mcp.WithNumber("precio",
    mcp.Required(),
    mcp.Min(0),
    mcp.Max(10000),
)

mcp.WithString("prioridad",
    mcp.Required(),
    mcp.Enum("baja", "media", "alta", "critica"),
)
```

---

## Handlers

```go
func handleCalcular(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
    operacion, err := req.RequireString("operacion")
    if err != nil {
        return mcp.NewToolResultError(err.Error()), nil
    }

    x, err := req.RequireFloat("x")
    if err != nil {
        return mcp.NewToolResultError(err.Error()), nil
    }

    y, err := req.RequireFloat("y")
    if err != nil {
        return mcp.NewToolResultError(err.Error()), nil
    }

    var resultado float64
    switch operacion {
    case "sumar":
        resultado = x + y
    case "restar":
        resultado = x - y
    case "multiplicar":
        resultado = x * y
    case "dividir":
        if y == 0 {
            return mcp.NewToolResultError("división por cero"), nil
        }
        resultado = x / y
    }

    return mcp.NewToolResultText(fmt.Sprintf("%.2f", resultado)), nil
}
```

---

## Extracción de parámetros

### Required (retorna error si falta o tipo incorrecto)

```go
name, err := req.RequireString("name")
age, err := req.RequireInt("age")
price, err := req.RequireFloat("price")
enabled, err := req.RequireBool("enabled")
```

### Optional con defaults

```go
name := req.GetString("name", "default")
count := req.GetInt("count", 10)
price := req.GetFloat("price", 0.0)
enabled := req.GetBool("enabled", false)
```

### Bind a struct

```go
type Config struct {
    Timeout int    `json:"timeout"`
    Retries int    `json:"retries"`
    Debug   bool   `json:"debug"`
}

var config Config
if err := req.BindArguments(&config); err != nil {
    return mcp.NewToolResultError(err.Error()), nil
}
```

---

## Resultados

### Texto

```go
return mcp.NewToolResultText("Operación completada"), nil
```

### Error

```go
return mcp.NewToolResultError("algo salió mal"), nil
```

### Múltiples contenidos

```go
return &mcp.CallToolResult{
    Content: []mcp.Content{
        mcp.TextContent{Type: "text", Text: "Resultado:"},
        mcp.TextContent{Type: "text", Text: jsonData},
    },
}, nil
```

### Resource Links

```go
resourceLink := mcp.NewResourceLink(
    "file://documents/reporte.pdf",
    "Reporte",
    "El documento solicitado",
    "application/pdf",
)

return &mcp.CallToolResult{
    Content: []mcp.Content{
        mcp.NewTextContent("Encontré el documento:"),
        resourceLink,
    },
}, nil
```

---

## Schema con structs

En lugar de definir parámetros manualmente, usar structs con tags:

```go
type SearchRequest struct {
    Query      string   `json:"query" jsonschema:"Query de búsqueda"`
    Limit      int      `json:"limit,omitempty" jsonschema:"Máximo de resultados"`
    Categories []string `json:"categories,omitempty" jsonschema:"Filtrar por categorías"`
}

type SearchResponse struct {
    Query      string    `json:"query" jsonschema:"Query original"`
    TotalCount int       `json:"totalCount" jsonschema:"Total de resultados"`
    Products   []Product `json:"products" jsonschema:"Resultados"`
}

searchTool := mcp.NewTool("search_products",
    mcp.WithDescription("Buscar en el catálogo"),
    mcp.WithInputSchema[SearchRequest](),
    mcp.WithOutputSchema[SearchResponse](),
)

s.AddTool(searchTool, mcp.NewStructuredToolHandler(searchHandler))
```

### Handler con tipos

```go
func searchHandler(ctx context.Context, req mcp.CallToolRequest, args SearchRequest) (SearchResponse, error) {
    products := searchDatabase(args.Query, args.Categories, args.Limit)
    return SearchResponse{
        Query:      args.Query,
        TotalCount: len(products),
        Products:   products,
    }, nil
}
```

---

## Errores

### Error de tool (no crash del servidor)

```go
return mcp.NewToolResultError("mensaje de error"), nil
```

### Error del sistema (retorna Go error)

```go
return nil, fmt.Errorf("fallo del sistema: %v", err)
```

> **Importante:** Usar `NewToolResultError` para errores de validación/lógica. Retornar Go `error` solo para fallos del sistema.

---

[← Capítulo anterior](/no-estandard/mark3labs-mcp-go/02-servidor-basico) | [Siguiente capítulo →](/no-estandard/mark3labs-mcp-go/04-resources)
