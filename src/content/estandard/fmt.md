# fmt — Formateo e impresión

Paquete de la librería estándar para imprimir en consola, formatear strings y escanear input.

```go
import "fmt"
```

---

## Índice

- [Imprimir en consola](/estandard/fmt#imprimir-en-consola)
- [Formatear strings](/estandard/fmt#formatear-strings-sprintf)
- [Escaneo de input](/estandard/fmt#escaneo-de-input-scanf)
- [Verbos de formato](/estandard/fmt#verbos-de-formato-%s,-%d,-%v)
- [Append](/estandard/fmt#append-formatear-a-[]byte)
- [Manejo de errores con Errorf](/estandard/fmt#manejo-de-errores-con-errorf)

---

## Imprimir en consola

### `Print`, `Println`, `Printf`

| Función | Qué hace | Agrega salto de línea |
|---------|----------|-----------------------|
| `fmt.Print(args...)` | Imprime los argumentos uno al lado del otro | No |
| `fmt.Println(args...)` | Imprime con espacios entre argumentos | Sí |
| `fmt.Printf(formato, args...)` | Imprime con formato (como C) | No |

```go
fmt.Print("Hola", "mundo")   // Holamundo
fmt.Println("Hola", "mundo") // Hola mundo
fmt.Printf("Nombre: %s, Edad: %d", "Juan", 25) // Nombre: Juan, Edad: 25
```

### `Sprint`, `Sprintln`, `Sprintf`

| Función | Qué hace |
|---------|----------|
| `fmt.Sprint(args...)` | Devuelve string en vez de imprimir |
| `fmt.Sprintln(args...)` | Ídem con salto de línea |
| `fmt.Sprintf(formato, args...)` | Formatea y devuelve string |

```go
mensaje := fmt.Sprintf("Página %d de %d", 3, 10)
// mensaje = "Página 3 de 10"
```

### `Fprint`, `Fprintln`, `Fprintf`

Escriben a un `io.Writer` (archivo, conexión, buffer) en vez de a consola:

```go
fmt.Fprint(os.Stderr, "Error crítico")
fmt.Fprintf(archivo, "Registro: %s\n", entrada)
```

---

## Verbos de formato

Son las letras que van después del `%` en `Printf` / `Sprintf`.

### Verbos generales

| Verbo | Qué imprime |
|-------|-------------|
| `%v` | Valor en formato por defecto |
| `%+v` | Valor con nombres de campos (structs) |
| `%#v` | Representación Go del valor |
| `%T` | Tipo de la variable |
| `%%` | Un signo `%` literal |

```go
type User struct { Name string; Age int }
u := User{"Ana", 30}

fmt.Printf("%v\n", u)   // {Ana 30}
fmt.Printf("%+v\n", u)  // {Name:Ana Age:30}
fmt.Printf("%#v\n", u)  // main.User{Name:"Ana", Age:30}
fmt.Printf("%T\n", u)   // main.User
```

### Verbos para tipos específicos

| Verbo | Tipo | Ejemplo |
|-------|------|---------|
| `%d` | Entero (decimal) | `fmt.Printf("%d", 42)` → `42` |
| `%b` | Entero (binario) | `fmt.Printf("%b", 42)` → `101010` |
| `%o` | Entero (octal) | `fmt.Printf("%o", 42)` → `52` |
| `%x` | Entero (hex minúsculas) | `fmt.Printf("%x", 255)` → `ff` |
| `%X` | Entero (hex mayúsculas) | `fmt.Printf("%X", 255)` → `FF` |
| `%f` | Float (decimal) | `fmt.Printf("%f", 3.14)` → `3.140000` |
| `%.2f` | Float (2 decimales) | `fmt.Printf("%.2f", 3.14159)` → `3.14` |
| `%e` | Float (notación científica e minúscula) | `fmt.Printf("%e", 3.14)` → `3.140000e+00` |
| `%E` | Float (notación científica E mayúscula) | `fmt.Printf("%E", 3.14)` → `3.140000E+00` |
| `%g` | Float (formato automático %e o %f) | `fmt.Printf("%g", 3.14)` → `3.14` |
| `%G` | Float (formato automático %E o %f) | `fmt.Printf("%G", 3.14)` → `3.14` |
| `%s` | String | `fmt.Printf("%s", "Hola")` → `Hola` |
| `%q` | String con comillas | `fmt.Printf("%q", "Hola")` → `"Hola"` |
| `%c` | Rune (carácter Unicode) | `fmt.Printf("%c", 'A')` → `A` |
| `%U` | Unicode (U+0041) | `fmt.Printf("%U", 'A')` → `U+0041` |
| `%t` | Booleano | `fmt.Printf("%t", true)` → `true` |
| `%p` | Puntero (dirección) | `fmt.Printf("%p", ptr)` → `0x...` |

### Ancho y padding

| Formato | Efecto |
|---------|--------|
| `%5d` | Entero con ancho mínimo 5 (alineado derecha) |
| `%-5d` | Entero con ancho mínimo 5 (alineado izquierda) |
| `%05d` | Entero relleno con ceros (ancho 5) |
| `%10s` | String con ancho mínimo 10 |

```go
fmt.Printf("|%5d|", 42)    // |   42|
fmt.Printf("|%-5d|", 42)   // |42   |
fmt.Printf("|%05d|", 42)   // |00042|
```

---

## Escaneo de input

Leer datos desde consola o strings:

| Función | Lee desde |
|---------|-----------|
| `fmt.Scan(args...)` | Stdin (teclado) |
| `fmt.Scanf(formato, args...)` | Stdin con formato |
| `fmt.Sscan(str, args...)` | String |
| `fmt.Sscanf(str, formato, args...)` | String con formato |
| `fmt.Fscan(reader, args...)` | `io.Reader` |
| `fmt.Fscanf(reader, formato, args...)` | `io.Reader` con formato |
| `fmt.Scanln(args...)` | Stdin, se detiene con salto de línea |
| `fmt.Sscanln(str, args...)` | String, se detiene con salto de línea |
| `fmt.Fscanln(reader, args...)` | `io.Reader`, se detiene con salto de línea |

Las variantes `*ln` funcionan igual que `Scan`, `Sscan` y `Fscan` pero requieren un salto de línea para terminar.

```go
var nombre string
var edad int
fmt.Print("Ingresá nombre y edad: ")
fmt.Scanf("%s %d", &nombre, &edad)

// O desde un string:
var x, y int
fmt.Sscanf("10,20", "%d,%d", &x, &y)

// Con Scanln:
var a, b int
fmt.Scanln(&a, &b)
```

---

---

## Append (Go 1.19+)

Agrega texto formateado a un `[]byte` en vez de crear strings. Útil para evitar alocaciones:

| Función | Qué hace |
|---------|----------|
| `fmt.Append(b []byte, args...) []byte` | Concatena con formato por defecto |
| `fmt.Appendf(b []byte, formato string, args...) []byte` | Concatena con formato |
| `fmt.Appendln(b []byte, args...) []byte` | Concatena con espacios y salto de línea |

```go
buf := []byte("Inicio: ")
buf = fmt.Appendf(buf, "valor=%d, nombre=%s", 42, "Juan")
fmt.Println(string(buf)) // "Inicio: valor=42, nombre=Juan"
```

---

## Manejo de errores con `Errorf`

Crea un error con mensaje formateado:

```go
err := fmt.Errorf("archivo %s no encontrado en %s", nombre, ruta)
```

Devuelve un `error`, igual que `errors.New()` pero con formato.

---

[← Volver al índice](/indice)
