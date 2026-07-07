# Instalación

## Instalación global (recomendado)

Con Go 1.24 o superior:

```bash
go install github.com/a-h/templ/cmd/templ@latest
```

Esto instala el binario `templ` en tu `$GOPATH/bin` o `$HOME/go/bin`.

## Instalación como herramienta del proyecto (Go 1.24+)

```bash
go get -tool github.com/a-h/templ/cmd/templ@latest
```

Para ejecutar templ instalado de esta forma, usá `go tool templ` en vez de `templ`.

## Binarios precompilados

Descargá la última release desde [github.com/a-h/templ/releases/latest](https://github.com/a-h/templ/releases/latest).

## Docker

```bash
docker pull ghcr.io/a-h/templ:latest
```

Para generar código:

```bash
docker run -v $(pwd):/app -w=/app ghcr.io/a-h/templ:latest generate
```

## Verificar instalación

```bash
templ version
```

## Agregar templ como dependencia del proyecto

```bash
go get github.com/a-h/templ
```

## Requisitos

- Go 1.24 o superior (para instalación como tool)
- Go 1.21 o superior (para usar la librería)
- Compatible con Linux, macOS y Windows

---

**Documentación oficial:** [templ.guide/quick-start/installation](https://templ.guide/quick-start/installation)
