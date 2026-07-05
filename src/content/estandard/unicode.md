# unicode — Clasificación y Transformación de Caracteres Unicode

> **Import:** `import "unicode"`

El paquete `unicode` proporciona funciones para clasificar y transformar runas Unicode.
Define tablas de rangos (`RangeTable`) para scripts y categorías.

---

## Funciones de clasificación

Todas aceptan `rune` y retornan `bool`.

| Función | Descripción |
|---------|-------------|
| `IsDigit(r rune) bool` | Dígito decimal (Nd) |
| `IsLetter(r rune) bool` | Letra (categoría L) |
| `IsLower(r rune) bool` | Minúscula (Ll) |
| `IsUpper(r rune) bool` | Mayúscula (Lu) |
| `IsSpace(r rune) bool` | Espacio en blanco (Z, más `\t\n\r`) |
| `IsNumber(r rune) bool` | Cualquier dígito o número (N) |
| `IsPunct(r rune) bool` | Puntuación (P) |
| `IsSymbol(r rune) bool` | Símbolo (S) |
| `IsMark(r rune) bool` | Marca (M) |
| `IsControl(r rune) bool` | Carácter de control (Cc) |
| `IsGraphic(r rune) bool` | Visible (letras, números, puntuación, símbolos, espacios) |
| `IsPrint(r rune) bool` | Imprimible (Graphic menos espacio) |
| `IsTitle(r rune) bool` | Título (Lt) |

```go
fmt.Println(unicode.IsDigit('5'))   // true
fmt.Println(unicode.IsLetter('ñ'))  // true
fmt.Println(unicode.IsSpace('\t'))  // true
fmt.Println(unicode.IsUpper('Å'))   // true
fmt.Println(unicode.IsPunct('!'))   // true
fmt.Println(unicode.IsNumber('½'))  // true
```

---

## Funciones de caso

| Función | Descripción |
|---------|-------------|
| `ToLower(r rune) rune` | Convierte a minúscula |
| `ToUpper(r rune) rune` | Convierte a mayúscula |
| `ToTitle(r rune) rune` | Convierte a título (tipo oración) |
| `To(uppercase bool, r rune) rune` | Si upperCase es true → ToUpper, sino → ToLower |
| `SimpleFold(r rune) rune` | Retorna un case equivalente para case-insensitive comparison |
| `IsOneOf(tables []*RangeTable, r rune) bool` | ¿Está r en alguna de las tablas? |

```go
fmt.Println(string(unicode.ToUpper('a')))  // "A"
fmt.Println(string(unicode.ToLower('Ñ')))  // "ñ"
fmt.Println(string(unicode.SimpleFold('A'))) // "a"
fmt.Println(string(unicode.SimpleFold('a'))) // "A"
fmt.Println(string(unicode.SimpleFold('ß'))) // "ss"
```

---

## Categoría

| Función | Descripción |
|---------|-------------|
| `In(r rune, ranges ...*RangeTable) bool` | ¿Está r en al menos uno de los rangos? |
| `Is(rangeTab *RangeTable, r rune) bool` | ¿Está r en la tabla de rangos? |

```go
fmt.Println(unicode.In('A', unicode.Latin, unicode.Greek)) // true
fmt.Println(unicode.In('Ω', unicode.Latin, unicode.Greek)) // true
```

---

## Tablas de rangos predefinidas

### Por categoría Unicode

| Variable | Categoría |
|----------|-----------|
| `Letter` | L (todas las letras) |
| `Lower` | Ll |
| `Upper` | Lu |
| `Title` | Lt |
| `Mark` | M |
| `Number` | N |
| `Punct` | P |
| `Space` | Z |
| `Symbol` | S |
| `Digit` | Nd |
| `Graphic` | L + M + N + P + S + Zs |
| `Print` | Graphic + Zs menos Space |

### Por script

| Variable | Script |
|----------|--------|
| `Arabic` | Árabe |
| `Armenian` | Armenio |
| `Bengali` | Bengalí |
| `Bopomofo` | Bopomofo |
| `Braille` | Braille |
| `Cyrillic` | Cirílico |
| `Devanagari` | Devanagari |
| `Ethiopic` | Etíope |
| `Georgian` | Georgiano |
| `Greek` | Griego |
| `Gujarati` | Gujarati |
| `Gurmukhi` | Gurmukhi |
| `Hangul` | Hangul |
| `Han` | Han (CJK) |
| `Hebrew` | Hebreo |
| `Hiragana` | Hiragana |
| `Kannada` | Kannada |
| `Katakana` | Katakana |
| `Khmer` | Khmer (Camboyano) |
| `Latin` | Latino |
| `Malayalam` | Malayalam |
| `Mongolian` | Mongol |
| `Oriya` | Oriya |
| `Runic` | Rúnico |
| `Sinhala` | Sinhala |
| `Syriac` | Siríaco |
| `Tamil` | Tamil |
| `Telugu` | Telugu |
| `Thaana` | Thaana |
| `Thai` | Tailandés |
| `Tibetan` | Tibetano |

### Por propiedad común

| Variable | Propiedad |
|----------|-----------|
| `ASCII_Hex_Digit` | `[0-9A-Fa-f]` |
| `Bidi_Control` | Caracteres de control bidireccional |
| `Dash` | Guiones |
| `Deprecated` | Obsoletos |
| `Diacritic` | Diacríticos |
| `Extender` | Caracteres extensores |
| `Hex_Digit` | Dígitos hexadecimales |
| `Hyphen` | Guiones adicionales |
| `IDS_Binary_Operator` | Operadores binarios para identificadores |
| `IDS_Trinary_Operator` | Operadores ternarios para identificadores |
| `Ideographic` | Ideográficos CJK |
| `Join_Control` | Caracteres de control de unión |
| `Logical_Order_Exception` | Excepciones de orden lógico |
| `Noncharacter_Code_Point` | No-caracteres |
| `Other_Alphabetic` | Otras letras |
| `Other_Default_Ignorable_Code_Point` | Ignorables por defecto |
| `Other_Grapheme_Extend` | Otros extensores de grafemas |
| `Other_ID_Start` | Inicios de identificador adicionales |
| `Other_Lowercase` | Otras minúsculas |
| `Other_Math` | Otros matemáticos |
| `Other_Uppercase` | Otras mayúsculas |
| `Pattern_Syntax` | Sintaxis de patrones |
| `Pattern_White_Space` | Espacios de patrones |
| `Prepended_Concatenation_Mark` | Marcas de concatenación pre-anexadas |
| `Quotation_Mark` | Comillas |
| `Radical` | Radicales CJK |
| `Regional_Indicator` | Indicadores regionales (banderas) |
| `Sentence_Terminal` | Terminales de oración |
| `Soft_Dotted` | Con punto suave (i, j, etc.) |
| `Terminal_Punctuation` | Puntuación terminal |
| `Unified_Ideograph` | Ideogramas unificados CJK |
| `Variation_Selector` | Selectores de variación |
| `White_Space` | Espacios blancos |

```go
// Verificar si una runa pertenece a un script
fmt.Println(unicode.Is(unicode.Cyrillic, 'Я')) // true
fmt.Println(unicode.Is(unicode.Greek, 'Ω'))    // true
fmt.Println(unicode.Is(unicode.Latin, 'A'))    // true
fmt.Println(unicode.Is(unicode.Hiragana, 'あ')) // true

// Verificar si es un dígito hexadecimal
fmt.Println(unicode.Is(unicode.Hex_Digit, 'F')) // true
fmt.Println(unicode.Is(unicode.Hex_Digit, 'G')) // false
```

---

## Case Range (Rangos de caso)

| Variable | Descripción |
|----------|-------------|
| `UpperLower` | Pares de mayúscula/minúscula donde SimpleFold == ToLower |
| `CaseRanges` | Todos los rangos para case mapping (Title, Upper, Lower, Fold) |

```go
// UpperLower contiene pares como {'A','a'}, {'B','b'}, ...
for i, r := range unicode.UpperLower {
    fmt.Printf("%c ↔ %c\n", r.Lo, r.Hi)
}
```

---

### Rangos personalizados

```go
custom := &unicode.RangeTable{
    R16: []unicode.Range16{
        {Lo: 0x0041, Hi: 0x005a, Stride: 1}, // A-Z
        {Lo: 0x0061, Hi: 0x007a, Stride: 1}, // a-z
    },
}
fmt.Println(unicode.Is(custom, 'X')) // true
fmt.Println(unicode.Is(custom, '5')) // false
```

---

## Constantes principales

| Constante | Valor | Descripción |
|-----------|-------|-------------|
| `MaxRune` | `\U0010FFFF` | Máximo punto de código Unicode válido |
| `MaxASCII` | `\u007F` | Máximo carácter ASCII |
| `MaxLatin1` | `\u00FF` | Máximo carácter Latin-1 (ISO 8859-1) |
| `ReplacementChar` | `\uFFFD` | Carácter de reemplazo para runas inválidas |
| `UpperLower` | `[]CaseRange` | Pares de mayúscula/minúscula simples |
| `CaseRanges` | `[]CaseRange` | Todos los rangos de mapeo de caso |
| `FoldNames` | `map[string]*RangeTable` | Nombres para SimpleFold |
| `FoldCategory` | `map[string]*RangeTable` | Categorías para SimpleFold |
| `FoldScript` | `map[string]*RangeTable` | Scripts para SimpleFold |

---

## RangeTable

Estructura que define un conjunto de runas:

```go
type RangeTable struct {
    R16         []Range16   // rangos de 16 bits
    R32         []Range32   // rangos de 32 bits
    LatinOffset int         // cuántas entradas de R16 son Latin-1
}
```

```go
type Range16 struct {
    Lo     uint16
    Hi     uint16
    Stride uint16  // 1 = todas las runas en [Lo, Hi]
}
```

```go
type Range32 struct {
    Lo     uint32
    Hi     uint32
    Stride uint32
}
```

## CaseRange

Define el mapeo de caso para un rango de runas:

```go
type CaseRange struct {
    Lo    uint32
    Hi    uint32
    Delta d // ver struct interno
}
```

Usado internamente por `ToLower`, `ToUpper`, `ToTitle` y `SimpleFold`.

```go
// Ejemplo: convertir usando UpperLower (todas las runas A-Z, a-z)
for _, cr := range unicode.UpperLower {
    for r := cr.Lo; r <= cr.Lo; r++ {
        fmt.Printf("Lower(%c) = %c\n", r, unicode.ToLower(r))
    }
}
```

## SpecialCase

Representa mapeos de caso específicos de un idioma (ej. turco):

```go
type SpecialCase []CaseRange
```

| Variable | Idioma |
|----------|--------|
| `TurkishCase` | Turco (İ → i, I → ı) |
| `AzeriCase` | Azerí |

```go
t := unicode.TurkishCase
fmt.Println(string(t.ToLower('İ'))) // "i" (con punto, no "ı")
fmt.Println(string(t.ToUpper('i'))) // "İ" (con punto)
```

---

[← Volver al índice](/indice)
