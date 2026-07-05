# go/build — Información de build de paquetes

Accede a metadata de paquetes Go (imports, tags, archivos).

```go
import "go/build"
```

---

## Cargar un paquete

```go
pkg, err := build.Default.Import("net/http", ".", build.FindOnly)
fmt.Println(pkg.Dir)       // directorio del paquete
fmt.Println(pkg.GoFiles)   // archivos .go
fmt.Println(pkg.Imports)   // dependencias
fmt.Println(pkg.Name)      // nombre del paquete
```

## Campos principales de `Package`

| Campo | Tipo | Qué es |
|-------|------|--------|
| `Dir` | `string` | Directorio del paquete |
| `Name` | `string` | Nombre del paquete |
| `GoFiles` | `[]string` | Archivos .go |
| `TestGoFiles` | `[]string` | Archivos *_test.go |
| `Imports` | `[]string` | Paquetes que importa |
| `TestImports` | `[]string` | Imports de los tests |
| `IsCommand` | `bool` | ¿Es `package main`? |

## Build tags

```go
ctxt := &build.Context{
    GOOS:   "linux",
    GOARCH: "amd64",
}
pkg, _ := ctxt.Import("mypackage", ".", 0)
```

---

[← Volver al índice](/indice)
