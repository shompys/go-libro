# CLI y herramientas

## Comandos principales

```
templ generate   - Genera código Go desde archivos .templ
templ fmt        - Formatea archivos .templ
templ lsp        - Inicia el language server (para IDEs)
templ info       - Muestra información del entorno
templ version    - Muestra la versión
```

## templ generate

Genera archivos `_templ.go` a partir de archivos `.templ`:

```bash
templ generate
```

### Opciones útiles

| Opción | Descripción |
|--------|-------------|
| `-path <ruta>` | Directorio a procesar (default: `.`) |
| `-f <archivo>` | Generar solo un archivo específico |
| `--watch` | Watch mode: regenera al guardar cambios |
| `-cmd <cmd>` | Comando a ejecutar después de generar |
| `-proxy <url>` | URL del proxy para live reload |
| `-proxyport <port>` | Puerto del proxy (default: 7331) |
| `-lazy` | Solo regenera si el `.templ` es más nuevo que el `.go` |
| `-w <n>` | Workers paralelos (default: NumCPU) |

### Ejemplos

Generar todo el proyecto:
```bash
templ generate
```

Generar un solo archivo:
```bash
templ generate -f header.templ
```

Watch mode con auto-reload:
```bash
templ generate --watch -cmd "go run ." -proxy http://localhost:8080
```

Esto:
1. Watchea cambios en archivos `.templ`
2. Regenera el código Go
3. Ejecuta `go run .`
4. Proxinea el server en `http://localhost:7331` con live reload

## templ fmt

Formatea archivos `.templ`:

```bash
templ fmt .
```

Formatear desde stdin:
```bash
cat header.templ | templ fmt
```

Verificar formato en CI (falla si hay archivos sin formatear):
```bash
templ fmt -fail .
```

Si `prettier`, `prettierd` o `npx` está en el PATH, `templ fmt` también formatea el contenido de `<script>` y `<style>`.

## templ lsp

Language Server Protocol para integración con IDEs:

```bash
templ lsp
```

No se usa directamente. Lo usan las extensiones de:
- **VS Code**: extensión "templ"
- **Neovim**: configuración con nvim-lspconfig
- **JetBrains**: soporte via LSP

### Opciones del LSP

| Opción | Descripción |
|--------|-------------|
| `-goplsLog <file>` | Log de gopls a archivo |
| `-goplsRPCTrace` | Trazar RPC de gopls |
| `-gopls-remote` | Conectar a instancia remota de gopls |
| `-http <addr>` | Server HTTP de debug |
| `-log <file>` | Log del LSP a archivo |

## IDE Support

### VS Code

Instalá la extensión "templ" desde el marketplace. Proporciona:
- Autocompletado de componentes
- Detección de errores en tiempo real
- Formateo al guardar
- Navegación a definiciones

### Neovim

Configuración con `nvim-lspconfig`:

```lua
require('lspconfig').templ.setup{}
```

### GoLand / JetBrains

Soporte via LSP. Configurar en Settings > Languages & Frameworks > templ.

## Workflow de desarrollo típico

### Opción 1: Watch + Proxy (recomendado)

```bash
templ generate --watch -cmd "go run ." -proxy http://localhost:8080
```

Abrí `http://localhost:7331` en el browser. Cada vez que guardás un `.templ`, se regenera y recarga.

### Opción 2: Air + templ

Con [Air](https://github.com/air-verse/air) para hot reload de Go:

`.air.toml`:
```toml
[build]
cmd = "templ generate && go build -o ./tmp/main ."
bin = "./tmp/main"
include_ext = ["go", "templ"]
```

```bash
air
```

### Opción 3: Makefile

```makefile
dev:
	templ generate --watch -cmd "go run ." -proxy http://localhost:8080

build:
	templ generate
	go build -o app .

fmt:
	templ fmt .
	gofmt -s -w .
```

## CI/CD

Asegurate de que los archivos `.templ` estén generados y formateados:

```yaml
# GitHub Actions
- name: Check templ files are generated
  run: |
    go install github.com/a-h/templ/cmd/templ@latest
    templ generate
    git diff --exit-code

- name: Check templ formatting
  run: templ fmt -fail .
```

---

[← Volver al índice](/no-estandard/templ)
