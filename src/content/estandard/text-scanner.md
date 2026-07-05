# text/scanner — Tokenizador para Texto UTF-8

> **Import:** `import "text/scanner"`

El paquete `text/scanner` proporciona un escáner que tokeniza texto UTF-8.
Similar a `go/scanner` pero para texto general. Itera sobre caracteres, comentarios estilo Go, strings, números, etc.

---

## Scanner — Creación y configuración

| Función / Campo | Descripción |
|-----------------|-------------|
| `Scanner` | Struct que representa el escáner |
| `Init(file *token.File, src []byte, err ErrorHandler, mode Mode)` | Inicializa el escáner |
| `Mode` | Conjunto de flags que controlan el comportamiento |

**Campos públicos del Scanner:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ErrorCount` | int | Cantidad de errores encontrados (solo lectura) |
| `Whitespace` | uint64 | Conjunto de caracteres considerados espacio (por defecto `1<<'\t' | 1<<'\n' | 1<<'\r' | 1<<' '`) |
| `IsIdentRune` | func(ch rune, i int) bool | Predicado para runas que inician identificador |
| `Error` | func(s *Scanner, msg string) | Manejador de errores |
| `Position` | token.Position | Última posición de token escaneado |

---

## Modos (Mode)

| Constante | Descripción |
|-----------|-------------|
| `ScanIdents` | Escanea identificadores |
| `ScanInts` | Escanea literales enteros |
| `ScanFloats` | Escanea literales de punto flotante |
| `ScanChars` | Escanea caracteres entre comillas (`'a'`) |
| `ScanStrings` | Escanea strings (`"hola"`) |
| `ScanRawStrings` | Escanea raw strings (`` `raw` ``) |
| `ScanComments` | Escanea comentarios `//` y `/* */` |
| `ScanFloats` | Escanea floats |
| `SkipComments` | Omite comentarios |

**Modos compuestos útiles:**
```go
// Solo identificadores
mode := scanner.ScanIdents

// Identificadores, números, strings y comentarios
mode := scanner.ScanIdents | scanner.ScanFloats | scanner.ScanStrings | scanner.ScanComments

// Todos los tokens estándar
mode := scanner.ScanIdents | scanner.ScanInts | scanner.ScanFloats | 
        scanner.ScanChars | scanner.ScanStrings | scanner.ScanRawStrings |
        scanner.ScanComments | scanner.SkipComments
```

---

## Métodos del Scanner

| Método | Descripción |
|--------|-------------|
| `Scan() rune` | Avanza y retorna el siguiente token. Retorna `EOF` al finalizar |
| `Pos() token.Pos` | Posición (offset) del último token escaneado |
| `Peek() rune` | Siguiente carácter sin avanzar. `EOF` si es el final |
| `TokenText() string` | Texto del último token escaneado |

---

## Tokens

Cada llamada a `Scan()` retorna el *tipo* del token como runa. Los tipos predefinidos:

| Token | Significado |
|-------|-------------|
| `EOF` | Fin de entrada (−1) |
| `Ident` (−2) | Identificador |
| `Int` (−3) | Entero |
| `Float` (−4) | Punto flotante |
| `Char` (−5) | Carácter literal |
| `String` (−6) | String literal |
| `RawString` (−7) | String raw |
| `Comment` (−8) | Comentario |

Los demás runas retornadas son el carácter literal encontrado (operadores, delimitadores, etc.).

---

## Posiciones con token.File

El escáner usa `go/token` para rastrear posiciones.

```go
var s scanner.Scanner
fset := token.NewFileSet()
file := fset.AddFile("input.txt", fset.Base(), len(src))
s.Init(file, src, nil, scanner.ScanIdents)
```

Para obtener la posición (`token.Position`) del último token:
```go
pos := s.Pos()
position := file.Position(pos)
fmt.Println(position.Line, position.Column)
```

Si no se usa `token.File`, se pasa `nil` a `Init` y `Pos()` retorna el offset de byte.

---

## Ejemplo básico

```go
package main

import (
    "fmt"
    "strings"
    "text/scanner"
)

func main() {
    const src = "hola mundo 123 \"un string\" // comentario"
    var s scanner.Scanner
    s.Init(strings.NewReader(src))
    s.Mode = scanner.ScanIdents | scanner.ScanInts |
             scanner.ScanStrings | scanner.ScanComments

    for tok := s.Scan(); tok != scanner.EOF; tok = s.Scan() {
        fmt.Printf("%s: %s\n", scanner.TokenString(tok), s.TokenText())
    }
}
```

Salida:
```
Ident: "hola"
Ident: "mundo"
Int: "123"
String: "\"un string\""
Comment: "// comentario"
```

---

## Ejemplo con posiciones

```go
package main

import (
    "fmt"
    "go/token"
    "strings"
    "text/scanner"
)

func main() {
    const src = "x := 42\ny := 100\n"
    var s scanner.Scanner
    fset := token.NewFileSet()
    file := fset.AddFile("code.go", fset.Base(), len(src))

    s.Init(file, []byte(src), nil, scanner.ScanIdents|scanner.ScanInts)

    for tok := s.Scan(); tok != scanner.EOF; tok = s.Scan() {
        pos := file.Position(s.Pos())
        fmt.Printf("%s\t%q\t(línea %d, col %d)\n",
            scanner.TokenString(tok), s.TokenText(), pos.Line, pos.Column)
    }
}
```

Salida:
```
Ident   "x"     (línea 1, col 1)
:       ":"     (línea 1, col 3)
=       "="     (línea 1, col 5)
Int     "42"    (línea 1, col 7)
;       "\n"    (línea 1, col 9)
Ident   "y"     (línea 2, col 1)
:       ":"     (línea 2, col 3)
=       "="     (línea 2, col 5)
Int     "100"   (línea 2, col 7)
;       "\n"    (línea 2, col 10)
```

---

## Funciones auxiliares

| Función | Descripción |
|---------|-------------|
| `TokenString(tok rune) string` | Retorna el nombre del token como string legible |

---

[← Volver al índice](/indice)
