# unicode/utf16 — Codificación UTF-16

> **Import:** `import "unicode/utf16"`

El paquete `utf16` implementa codificación y decodificación de secuencias UTF-16.
UTF-16 usa uno o dos `uint16` por runa (pares surrogados).

---

## Constantes y predicados

| Función / Constante | Descripción |
|---------------------|-------------|
| `IsSurrogate(r rune) bool` | ¿Es r un surrogado UTF-16 (0xD800–0xDFFF)? |

Los surrogados no son runas Unicode válidas por sí solos.

```go
fmt.Println(utf16.IsSurrogate(0xD800)) // true
fmt.Println(utf16.IsSurrogate(0x0041)) // false
fmt.Println(utf16.IsSurrogate(0xDFFF)) // true
```

---

## Codificación

| Función | Descripción |
|---------|-------------|
| `Encode(s []rune) []uint16` | Codifica un slice de runas a UTF-16 |
| `EncodeRune(r rune) (r1, r2 rune)` | Codifica una sola runa. r2 = 0 si no necesita par surrogado |
| `AppendRune(a []uint16, r rune) []uint16` | Agrega la codificación UTF-16 de r al slice |

```go
runes := []rune{'H', 'o', 'l', 'a', '😀'}
encoded := utf16.Encode(runes)
// [72 111 108 97 55357 56832] (H=0x48, 😀 = surrogate pair 0xD83D 0xDE00)
fmt.Println(encoded)

r1, r2 := utf16.EncodeRune('A')
fmt.Printf("%04X %04X\n", r1, r2) // 0041 0000 (r2 = 0, no necesita par)

r1, r2 = utf16.EncodeRune('😀')
fmt.Printf("%04X %04X\n", r1, r2) // D83D DE00 (par surrogado)

b := []uint16{}
b = utf16.AppendRune(b, 'A')
b = utf16.AppendRune(b, '世')
b = utf16.AppendRune(b, '😀')
fmt.Println(b) // [65 19990 55357 56832]
```

---

## Decodificación

| Función | Descripción |
|---------|-------------|
| `Decode(s []uint16) []rune` | Decodifica un slice UTF-16 a runas |
| `DecodeRune(r1, r2 rune) rune` | Decodifica un par de runas (r1, r2) a una runa |

```go
utf16data := []uint16{0x0048, 0x006F, 0x006C, 0x0061, 0xD83D, 0xDE00}
runes := utf16.Decode(utf16data)
fmt.Println(string(runes)) // "Hola😀"

r := utf16.DecodeRune(0xD83D, 0xDE00) // Par surrogado → 😀
fmt.Printf("%c\n", r) // 😀

r = utf16.DecodeRune(0x0041, 0) // Fuera de rango surrogado → retorna 0x0041
fmt.Printf("%c\n", r) // A
```

---

## Ejemplo completo

```go
package main

import (
    "fmt"
    "unicode/utf16"
)

func main() {
    original := []rune("¡Hola, 世界! 🎉")

    // Codificar a UTF-16
    encoded := utf16.Encode(original)
    fmt.Printf("UTF-16: %X\n", encoded)

    // Decodificar de vuelta
    decoded := utf16.Decode(encoded)
    fmt.Printf("Decodificado: %s\n", string(decoded))

    // Detectar surrogados
    for _, r := range original {
        if utf16.IsSurrogate(r) {
            fmt.Printf("%U es surrogado\n", r)
        }
    }
}
```

---

[← Volver al índice](/indice)
