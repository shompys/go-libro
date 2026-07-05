# unicode/utf8 — Codificación UTF-8

> **Import:** `import "unicode/utf8"`

El paquete `utf8` implementa funciones para trabajar con texto codificado en UTF-8.
UTF-8 es la codificación estándar de Go para strings.

---

## Constantes

| Constante | Valor | Descripción |
|-----------|-------|-------------|
| `RuneError` | `\uFFFD` | Runa usada para bytes inválidos |
| `RuneSelf` | `0x80` | Límite: runas < 128 son ASCII (ocupan 1 byte) |
| `MaxRune` | `\U0010FFFF` | Máximo punto de código Unicode válido |
| `UTFMax` | 4 | Máximo número de bytes por runa UTF-8 |

---

## Validación

| Función | Descripción |
|---------|-------------|
| `Valid(p []byte) bool` | ¿Es p un slice UTF-8 completo y válido? |
| `ValidString(s string) bool` | ¿Es s un string UTF-8 completo y válido? |
| `ValidRune(r rune) bool` | ¿Es r una runa Unicode válida (y no sustituta)? |
| `FullRune(p []byte) bool` | ¿Empieza p con una runa UTF-8 completa? |
| `FullRuneInString(s string) bool` | Igual para strings |

```go
fmt.Println(utf8.ValidString("hola"))        // true
fmt.Println(utf8.ValidString("café"))         // true
fmt.Println(utf8.Valid([]byte{0xff, 0xfe}))  // false
fmt.Println(utf8.ValidRune('A'))             // true
fmt.Println(utf8.ValidRune(0x110000))        // false (mayor a MaxRune)
fmt.Println(utf8.FullRune([]byte{0xc0}))     // false (byte de inicio incompleto)
fmt.Println(utf8.FullRune([]byte{0xc0, 0x80})) // true
```

---

## Conteo

| Función | Descripción |
|---------|-------------|
| `RuneCount(p []byte) int` | Cantidad de runas en p (bytes inválidos cuentan como 1) |
| `RuneCountInString(s string) int` | Cantidad de runas en el string |

```go
s := "こんにちは" // 5 runas
fmt.Println(len(s))                     // 15 bytes
fmt.Println(utf8.RuneCountInString(s))  // 5 runas

b := []byte(s)
fmt.Println(utf8.RuneCount(b))          // 5
```

---

## Codificación

| Función | Descripción |
|---------|-------------|
| `EncodeRune(p []byte, r rune) int` | Codifica r en UTF-8 en p; retorna bytes escritos |
| `AppendRune(p []byte, r rune) []byte` | Agrega r codificada en UTF-8 a p |
| `RuneLen(r rune) int` | Cantidad de bytes necesarios para codificar r |

```go
buf := make([]byte, 4)
n := utf8.EncodeRune(buf, '€') // n = 3
fmt.Println(buf[:n])            // [226 130 172]

b := []byte("hola ")
b = utf8.AppendRune(b, '世')
b = utf8.AppendRune(b, '界')
fmt.Println(string(b)) // "hola 世界"

fmt.Println(utf8.RuneLen('A'))  // 1
fmt.Println(utf8.RuneLen('ñ'))  // 2
fmt.Println(utf8.RuneLen('世')) // 3
fmt.Println(utf8.RuneLen('\U0010FFFF')) // 4
```

---

## Decodificación

| Función | Descripción |
|---------|-------------|
| `DecodeRune(p []byte) (r rune, size int)` | Decodifica la primera runa en p |
| `DecodeRuneInString(s string) (r rune, size int)` | Igual para strings |
| `DecodeLastRune(p []byte) (r rune, size int)` | Decodifica la última runa en p |
| `DecodeLastRuneInString(s string) (r rune, size int)` | Igual para strings |

```go
s := "Hola, 世界"
r, size := utf8.DecodeRuneInString(s)
fmt.Printf("%c (%d bytes)\n", r, size) // "H (1 byte)"

// Avanzar por el string
for len(s) > 0 {
    r, size = utf8.DecodeRuneInString(s)
    fmt.Printf("%c ", r)
    s = s[size:]
}
// H o l a ,   世 界

last, _ := utf8.DecodeLastRuneInString("café")
fmt.Printf("%c\n", last) // "é"
```

---

## Iteración con range (nativo)

En Go, el `range` sobre un string itera por runas automáticamente:

```go
s := "日本語"
for i, r := range s {
    fmt.Printf("byte %d: %c (U+%04X)\n", i, r, r)
}
// byte 0: 日 (U+65E5)
// byte 3: 本 (U+672C)
// byte 6: 語 (U+8A9E)
```

---

## Ejemplo: validar y contar

```go
package main

import (
    "fmt"
    "unicode/utf8"
)

func main() {
    texts := []string{"hello", "café", "世界", string([]byte{0xFF, 0xFE})}
    for _, t := range texts {
        valid := utf8.ValidString(t)
        count := utf8.RuneCountInString(t)
        fmt.Printf("%q: válido=%v, runas=%d\n", t, valid, count)
    }
}
```

---

[← Volver al índice](/indice)
