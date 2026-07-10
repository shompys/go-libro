# 05 — Prompts

Los prompts son plantillas reutilizables que estructuran conversaciones entre usuarios y LLMs. Proveen contexto, instrucciones y pueden incluir contenido dinámico.

```go
import "github.com/mark3labs/mcp-go/mcp"
```

---

## Índice

- [Definir un prompt](/no-estandard/mark3labs-mcp-go/05-prompts#definir-un-prompt)
- [Argumentos](/no-estandard/mark3labs-mcp-go/05-prompts#argumentos)
- [Handlers](/no-estandard/mark3labs-mcp-go/05-prompts#handlers)
- [Mensajes](/no-estandard/mark3labs-mcp-go/05-prompts#mensajes)
- [Resources embebidos](/no-estandard/mark3labs-mcp-go/05-prompts#resources-embebidos)

---

## Definir un prompt

```go
prompt := mcp.NewPrompt("code_review",
    mcp.WithPromptDescription("Revisar código buscando buenas prácticas e issues"),
    mcp.WithPromptArgument("code",
        mcp.Required(),
        mcp.Description("El código a revisar"),
    ),
    mcp.WithPromptArgument("language",
        mcp.Description("Lenguaje de programación"),
        mcp.Default("auto-detect"),
    ),
    mcp.WithPromptArgument("focus",
        mcp.Description("Áreas específicas a revisar"),
        mcp.Enum("security", "performance", "readability", "all"),
        mcp.Default("all"),
    ),
)

s.AddPrompt(prompt, handleCodeReview)
```

---

## Argumentos

| Opción | Descripción |
|--------|-------------|
| `Required()` | Argumento obligatorio |
| `Description("...")` | Descripción del argumento |
| `Default("valor")` | Valor por defecto |
| `Enum("a", "b", "c")` | Valores permitidos |

```go
mcp.WithPromptArgument("nivel",
    mcp.Required(),
    mcp.Description("Nivel de expertise del usuario"),
    mcp.Enum("beginner", "intermediate", "advanced"),
)
```

---

## Handlers

```go
func handleCodeReview(ctx context.Context, req mcp.GetPromptRequest) (*mcp.GetPromptResult, error) {
    args := req.Params.Arguments
    if args == nil {
        return nil, fmt.Errorf("faltan argumentos requeridos")
    }

    code, ok := args["code"].(string)
    if !ok {
        return nil, fmt.Errorf("el argumento code es requerido y debe ser string")
    }

    language := getStringArg(args, "language", "auto-detect")
    focus := getStringArg(args, "focus", "all")

    var instructions string
    switch focus {
    case "security":
        instructions = "Enfocate en vulnerabilidades de seguridad y validación de inputs."
    case "performance":
        instructions = "Enfocate en optimizaciones de performance y uso de recursos."
    case "readability":
        instructions = "Enfocate en claridad del código, naming y mantenibilidad."
    default:
        instructions = "Revisión completa: seguridad, performance, legibilidad y buenas prácticas."
    }

    return &mcp.GetPromptResult{
        Description: fmt.Sprintf("Code review para código %s", language),
        Messages: []mcp.PromptMessage{
            {
                Role: mcp.RoleUser,
                Content: mcp.NewTextContent(fmt.Sprintf(
                    "Revisá el siguiente código %s:\n\n%s\n\nInstrucciones: %s\n\n"+
                    "Proporcioná:\n1. Evaluación general\n2. Issues encontrados\n"+
                    "3. Mejoras sugeridas\n4. Recomendaciones de buenas prácticas",
                    language, code, instructions,
                )),
            },
        },
    }, nil
}

func getStringArg(args map[string]interface{}, key, defaultValue string) string {
    if val, exists := args[key]; exists {
        if str, ok := val.(string); ok {
            return str
        }
    }
    return defaultValue
}
```

---

## Mensajes

### Roles

| Rol | Uso |
|-----|-----|
| `mcp.RoleUser` | Mensaje del usuario |
| `mcp.RoleAssistant` | Respuesta del asistente |
| `"system"` | Instrucciones del sistema |

### Multi-mensaje

```go
return &mcp.GetPromptResult{
    Description: "Escenario de conversación",
    Messages: []mcp.PromptMessage{
        {
            Role: "system",
            Content: mcp.NewTextContent("Sos un asistente de soporte técnico."),
        },
        {
            Role: mcp.RoleUser,
            Content: mcp.NewTextContent("Tengo un problema con..."),
        },
        {
            Role: mcp.RoleAssistant,
            Content: mcp.NewTextContent("Hola! Estoy acá para ayudarte."),
        },
    },
}, nil
```

---

## Resources embebidos

Incluir contenido de resources dentro de prompts:

```go
func handleDocumentAnalysis(ctx context.Context, req mcp.GetPromptRequest) (*mcp.GetPromptResult, error) {
    documentURI := req.Params.Arguments["document_uri"].(string)

    // Obtener contenido del resource
    document, err := fetchResource(ctx, documentURI)
    if err != nil {
        return nil, fmt.Errorf("error obteniendo documento: %w", err)
    }

    return &mcp.GetPromptResult{
        Description: "Análisis de documento",
        Messages: []mcp.PromptMessage{
            {
                Role: mcp.RoleUser,
                Content: mcp.NewTextContent(fmt.Sprintf(
                    "Analizá el siguiente documento:\n\n"+
                    "Documento: %s\nContenido:\n---\n%s\n---\n\n"+
                    "Proporcioná un resumen y puntos clave.",
                    documentURI, document.Content,
                )),
            },
        },
    }, nil
}
```

---

[← Capítulo anterior](/no-estandard/mark3labs-mcp-go/04-resources) | [Siguiente capítulo →](/no-estandard/mark3labs-mcp-go/06-transports)
