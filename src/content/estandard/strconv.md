# strconv — Conversión de Strings

Convierte strings a tipos numéricos y viceversa.

```go
import "strconv"
```

---

## Índice

- [String a número](/estandard/strconv#string-→-número-parse)
- [Número a string](/estandard/strconv#número-→-string-format)
- [String a booleano](/estandard/strconv#string-→-booleano)
- [Itoa y Atoi](/estandard/strconv#itoa-y-atoi-atajos)
- [Quote, Unquote, QuoteRune](/estandard/strconv#quote-y-unquote)
- [IsPrint, NumError](/estandard/strconv#utilitarios)
- [Append (formatear a []byte)](/estandard/strconv#append-go-119)

---

## String → Número (`Parse`)

| Función | Convierte | Ejemplo |
|---------|-----------|---------|
| `Atoi(s)` | String → int | `Atoi("42")` → `(42, nil)` |
| `ParseInt(s, base, bitSize)` | String → int64 | `ParseInt("FF", 16, 64)` → `(255, nil)` |
| `ParseFloat(s, bitSize)` | String → float | `ParseFloat("3.14", 64)` → `(3.14, nil)` |
| `ParseUint(s, base, bitSize)` | String → uint64 | `ParseUint("42", 10, 64)` → `(42, nil)` |
| `ParseBool(s)` | String → bool | `ParseBool("true")` → `(true, nil)` |

### Parámetros de `ParseInt`

| Parámetro | Significado | Valores |
|-----------|-------------|---------|
| `base` | Base numérica | `0` (autodetectar), `2`, `8`, `10`, `16` |
| `bitSize` | Tamaño del resultado | `0`, `8`, `16`, `32`, `64` |

```go
i, _ := strconv.ParseInt("1010", 2, 64)  // binario → 10
i, _ := strconv.ParseInt("FF", 16, 64)    // hexadecimal → 255
i, _ := strconv.ParseInt("42", 10, 64)    // decimal → 42
i, _ := strconv.ParseInt("0x2A", 0, 64)   // autodetecta base → 42
```

### `Atoi` (String a int)

Es el atajo más común. Equivale a `ParseInt(s, 10, 0)`:

```go
edad, err := strconv.Atoi("25")
if err != nil {
    fmt.Println("No es un número válido")
}
```

---

## Número → String (`Format`)

| Función | Convierte | Ejemplo |
|---------|-----------|---------|
| `Itoa(i)` | int → String | `Itoa(42)` → `"42"` |
| `FormatInt(i, base)` | int64 → String | `FormatInt(255, 16)` → `"ff"` |
| `FormatUint(i, base)` | uint64 → String | `FormatUint(255, 16)` → `"ff"` |
| `FormatFloat(f, fmt, prec, bitSize)` | float → String | `FormatFloat(3.14, 'f', 2, 64)` → `"3.14"` |
| `FormatBool(b)` | bool → String | `FormatBool(true)` → `"true"` |

### Parámetros de `FormatFloat`

| Parámetro | Significado | Valores |
|-----------|-------------|---------|
| `fmt` | Formato | `'f'` (decimal), `'e'` (científico), `'g'` (automático), `'b'` (binario) |
| `prec` | Cantidad de decimales | Entero positivo, o `-1` para la mínima necesaria |
| `bitSize` | Precisión del float | `32` o `64` |

```go
strconv.FormatFloat(3.14159, 'f', 2, 64)  // "3.14"
strconv.FormatFloat(3.14159, 'f', -1, 64) // "3.14159"
strconv.FormatFloat(1000.5, 'g', -1, 64)  // "1000.5"
```

### `Itoa` (Int a String)

El atajo más común:

```go
s := strconv.Itoa(42)  // "42"
```

---

## String → Booleano

```go
strconv.ParseBool("true")   // true
strconv.ParseBool("1")      // true
strconv.ParseBool("t")      // true
strconv.ParseBool("True")   // true

strconv.ParseBool("false")  // false
strconv.ParseBool("0")      // false
strconv.ParseBool("f")      // false
```

---

## Quote y Unquote

Escapan y desescapan strings (agregan/quitan comillas):

| Función | Qué hace | Ejemplo |
|---------|----------|---------|
| `Quote(s)` | Escapa y pone comillas | `Quote("Hola\nMundo")` → `"\"Hola\\nMundo\""` |
| `QuoteToASCII(s)` | Igual que `Quote` pero escapa caracteres no-ASCII | `QuoteToASCII("ñ")` → `"\u00f1"` |
| `QuoteToGraphic(s)` | Escapa solo caracteres no imprimibles | `QuoteToGraphic("Hola")` → `"Hola"` |
| `QuoteRune(r)` | Escapa un rune y pone comillas simples | `QuoteRune('ñ')` → `'ñ'` |
| `QuoteRuneToASCII(r)` | Escapa un rune a ASCII | `QuoteRuneToASCII('ñ')` → `'\u00f1'` |
| `Unquote(s)` | Saca comillas y desescapa | `Unquote("\"Hola\"")` → `"Hola"` |
| `CanBackquote(s)` | ¿Se puede representar con backticks? | `CanBackquote("Hola")` → `true` |

---

## Utilitarios

| Función | Qué hace |
|---------|----------|
| `IsPrint(r rune) bool` | ¿El rune es un carácter imprimible? |
| `NumError` | Tipo de error con detalles de la conversión fallida |

`NumError` tiene los campos `Func` (nombre de la función), `Num` (string original) y `Err` (error subyacente).

---

## Append (Go 1.19+)

Agregan la representación de un valor a un `[]byte` sin alocar memoria extra:

| Función | Qué hace |
|---------|----------|
| `AppendBool(dst []byte, b bool) []byte` | Agrega `"true"` o `"false"` |
| `AppendInt(dst []byte, i int64, base int) []byte` | Agrega entero en la base dada |
| `AppendUint(dst []byte, i uint64, base int) []byte` | Agrega entero sin signo |
| `AppendFloat(dst []byte, f float64, fmt byte, prec, bitSize int) []byte` | Agrega float formateado |
| `AppendQuote(dst []byte, s string) []byte` | Agrega string quoteado |
| `AppendQuoteRune(dst []byte, r rune) []byte` | Agrega rune quoteado |

```go
buf := make([]byte, 0, 32)
buf = strconv.AppendInt(buf, 255, 16)       // buf = []byte("ff")
buf = strconv.AppendFloat(buf, 3.14, 'f', 2, 64) // buf = []byte("ff3.14")
```
