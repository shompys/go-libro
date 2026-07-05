# debug/buildinfo — Información de Compilación

> **Import:** `import "debug/buildinfo"`

El paquete `buildinfo` permite leer información de compilación incrustada en binarios Go.
**Disponible desde Go 1.18.** Lee la metadata de módulos, dependencias y configuración
de compilación que se incluye con `go build`.

---

## BuildInfo

| Tipo | Descripción |
|------|-------------|
| `BuildInfo` | Struct con metadata de compilación (alias de `runtime/debug.BuildInfo`) |

### Estructura BuildInfo

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `GoVersion` | string | Versión de Go usada para compilar |
| `Path` | string | Path del módulo principal |
| `Main` | Module | Módulo principal |
| `Deps` | []*Module | Dependencias del módulo |
| `Settings` | []BuildSetting | Configuración de compilación |

### Module

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Path` | string | Path del módulo |
| `Version` | string | Versión del módulo |
| `Sum` | string | Checksum del módulo |
| `Replace` | *Module | Reemplazo de módulo (si existe) |

### BuildSetting

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Key` | string | Clave de configuración |
| `Value` | string | Valor de configuración |

---

## Funciones

| Función | Descripción |
|---------|-------------|
| `Read(r io.ReaderAt) (*BuildInfo, io.Reader, error)` | Lee BuildInfo de un binario Go (desde `io.ReaderAt`) |
| `ReadFile(name string) (*BuildInfo, io.Reader, error)` | Lee BuildInfo de un archivo binario Go en disco |

Ambas funciones retornan:
1. `*BuildInfo` — la información de compilación
2. `io.Reader` — el contenido del binario (lector posicionado al inicio)
3. `error`

```go
info, _, err := buildinfo.ReadFile("/ruta/al/binario")
if err != nil {
    log.Fatal(err)
}
fmt.Println(info.GoVersion)
fmt.Println(info.Path)
```

---

## Ejemplo: leer info de compilación de un binario

```go
package main

import (
    "debug/buildinfo"
    "fmt"
    "log"
    "os"
)

func main() {
    if len(os.Args) < 2 {
        fmt.Fprintf(os.Stderr, "Uso: %s <binario>\n", os.Args[0])
        os.Exit(1)
    }

    info, _, err := buildinfo.ReadFile(os.Args[1])
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Go Version: %s\n", info.GoVersion)
    fmt.Printf("Path:       %s\n", info.Path)
    fmt.Printf("Main:       %s@%s\n", info.Main.Path, info.Main.Version)

    fmt.Println("\nDependencias:")
    for _, dep := range info.Deps {
        fmt.Printf("  %s@%s", dep.Path, dep.Version)
        if dep.Replace != nil {
            fmt.Printf(" => %s@%s", dep.Replace.Path, dep.Replace.Version)
        }
        fmt.Println()
    }

    fmt.Println("\nConfiguración:")
    for _, s := range info.Settings {
        fmt.Printf("  %s = %s\n", s.Key, s.Value)
    }
}
```

---

## Ejemplo: configuraciones típicas

Las claves `Settings` más comunes:

| Key | Descripción | Ejemplo |
|-----|-------------|---------|
| `-compiler` | Compilador usado | `gc` |
| `-race` | Race detector habilitado | `true`, `false` |
| `-msan` | Memory sanitizer | `true`, `false` |
| `-asan` | Address sanitizer | `true`, `false` |
| `-trimpath` | Trim path habilitado | `true`, `false` |
| `CGO_ENABLED` | CGo habilitado | `1`, `0` |
| `GOARCH` | Arquitectura objetivo | `amd64`, `arm64` |
| `GOOS` | Sistema operativo objetivo | `linux`, `darwin`, `windows` |
| `GOAMD64` | Nivel microarquitectura | `v1`, `v2`, `v3`, `v4` |
| `vcs` | Sistema de control de versiones | `git` |
| `vcs.revision` | Hash del commit | `abc123def...` |
| `vcs.time` | Timestamp del commit | `2024-01-15T10:30:00Z` |
| `vcs.modified` | Si había cambios sin commit | `true`, `false` |

---

## Ejemplo: inspeccionar VCS info

```go
info, _, _ := buildinfo.ReadFile("miprograma")
for _, s := range info.Settings {
    switch s.Key {
    case "vcs":
        fmt.Printf("VCS: %s\n", s.Value)
    case "vcs.revision":
        fmt.Printf("Revision: %s\n", s.Value)
    case "vcs.time":
        fmt.Printf("Timestamp: %s\n", s.Value)
    case "vcs.modified":
        fmt.Printf("Modificado: %s\n", s.Value)
    }
}
```

---

## Nota sobre binarios no-Go

Si el binario no fue compilado con Go, `Read` y `ReadFile` retornan un error.
Solo funcionan con ejecutables producidos por `go build`.

---

[← Volver al índice](/indice)
