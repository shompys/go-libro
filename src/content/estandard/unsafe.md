# unsafe — Operaciones No Seguras

> **Import:** `import "unsafe"`

El paquete `unsafe` contiene operaciones que eluden el sistema de tipos de Go.
**Los programas que usan `unsafe` no son portables y pueden romperse entre versiones de Go.**

---

## ⚠️ Advertencia

El uso de `unsafe`:
- Es no portable
- No está protegido por la garantía de compatibilidad de Go 1
- Puede violar la seguridad de memoria si se usa incorrectamente
- Solo debe usarse cuando no hay alternativa segura (interop con C, optimizaciones extremas)

---

## Tipos

### Pointer

| Tipo | Descripción |
|------|-------------|
| `Pointer` | Puntero genérico. Equivalente a `void*` de C. Puede convertirse hacia y desde `uintptr` y cualquier tipo `*T` |

```go
var x int = 42
p := unsafe.Pointer(&x)       // *int → Pointer
up := uintptr(p)              // Pointer → uintptr
p = unsafe.Pointer(up)        // uintptr → Pointer
px := (*float64)(p)           // Pointer → *float64 (REINTERPRETACIÓN)
```

**Reglas de conversión de Pointer (según spec Go):**

1. `*T1` → `Pointer` → `*T2` (si T1 y T2 tienen mismo tamaño)
2. `Pointer` → `uintptr` (para aritmética, pero el resultado debe usarse inmediatamente)
3. `Pointer` → `uintptr` → aritmética → `Pointer` (offset dentro de struct o array)
4. `Pointer` → `uintptr` → `syscall.Syscall` (paso a syscalls)
5. Conversión de `reflect.Value.Pointer` o `UnsafeAddr` a `Pointer`

---

## Funciones

### Sizeof

| Función | Descripción |
|---------|-------------|
| `Sizeof(x ArbitraryType) uintptr` | Tamaño en bytes de x (sin incluir datos referenciados) |

```go
fmt.Println(unsafe.Sizeof(int(0)))    // 8 (en 64-bit)
fmt.Println(unsafe.Sizeof(int32(0)))  // 4
fmt.Println(unsafe.Sizeof(byte(0)))   // 1
fmt.Println(unsafe.Sizeof(""))        // 16 (cabecera del string)
fmt.Println(unsafe.Sizeof([]int{}))   // 24 (cabecera del slice)
```

### Offsetof

| Función | Descripción |
|---------|-------------|
| `Offsetof(x ArbitraryType) uintptr` | Offset en bytes de un campo dentro de un struct |

```go
type S struct {
    A byte  // offset 0
    B int64 // offset 8 (alineación)
    C byte  // offset 16
}
fmt.Println(unsafe.Offsetof(S{}.B)) // 8
```

### Alignof

| Función | Descripción |
|---------|-------------|
| `Alignof(x ArbitraryType) uintptr` | Alineación requerida por el tipo (1, 2, 4, 8) |

```go
fmt.Println(unsafe.Alignof(int32(0))) // 4
fmt.Println(unsafe.Alignof(int64(0))) // 8
```

---

## Funciones de String y Slice (Go 1.17+ / 1.20+)

| Función | Versión | Descripción |
|---------|---------|-------------|
| `Slice(ptr *ArbitraryType, len IntegerType) []ArbitraryType` | 1.17 | Crea un slice desde puntero y longitud |
| `SliceData(slice []ArbitraryType) *ArbitraryType` | 1.20 | Retorna puntero al array subyacente del slice |
| `String(ptr *byte, len IntegerType) string` | 1.20 | Crea un string desde puntero y longitud |
| `StringData(str string) *byte` | 1.20 | Retorna puntero a los bytes subyacentes del string |

```go
// Crear un slice desde memoria cruda
buf := [10]byte{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
s := unsafe.Slice(&buf[0], 5) // []byte{0, 1, 2, 3, 4}
fmt.Println(s)

// Obtener puntero al array del slice
p := unsafe.SliceData(s) // *byte apuntando a buf[0]
fmt.Println(*p)          // 0

// Crear un string desde bytes (sin copia)
str := unsafe.String(&buf[0], 5) // " esto es binario"
fmt.Printf("%q\n", str)

// Obtener puntero a datos del string
sp := unsafe.StringData("hello")
fmt.Println(string(*sp)) // "h"
```

---

## Ejemplo: acceso a campos de struct contiguos

```go
type Header struct {
    Flag    byte   // offset 0
    Version uint16 // offset 2 (por alineación)
    Size    uint32 // offset 4
}

func main() {
    // Simular un buffer de bytes
    data := []byte{0x01, 0x00, 0x02, 0x00, 0x10, 0x00, 0x00, 0x00}

    h := (*Header)(unsafe.Pointer(&data[0]))
    fmt.Printf("Flag: %d\n", h.Flag)       // 1
    fmt.Printf("Version: %d\n", h.Version) // 2 (little-endian: 0x0002)
    fmt.Printf("Size: %d\n", h.Size)       // 16
}
```

**Nota:** El ejemplo anterior depende del endianness de la máquina y del layout de memoria.

---

## Ejemplo: suma de offset para acceso a campo

```go
type Persona struct {
    Nombre string
    Edad   int
}

func main() {
    p := Persona{"Ana", 30}
    // Obtener puntero al campo Edad a partir de la dirección de la struct
    pBase := unsafe.Pointer(&p)
    edadPtr := (*int)(unsafe.Pointer(uintptr(pBase) + unsafe.Offsetof(p.Edad)))
    fmt.Println(*edadPtr) // 30
    *edadPtr = 31
    fmt.Println(p.Edad)   // 31
}
```

---

[← Volver al índice](/indice)
