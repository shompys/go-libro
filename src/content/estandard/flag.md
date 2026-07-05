# flag — Flags de línea de comandos

Parseo de argumentos de línea de comandos estilo `--nombre valor` y `-n valor`.

```go
import "flag"
```

---

## Índice

- [Definir flags](/estandard/flag#definir-flags)
- [Parsear y usar](/estandard/flag#parsear-y-usar)
- [Flags booleanos](/estandard/flag#flags-booleanos-sin-valor)
- [Argumentos posicionales](/estandard/flag#argumentos-posicionales)
- [Visit, VisitAll, Lookup, NFlag, Parsed](/estandard/flag#funciones-de-inspección)
- [Set y Lookup](/estandard/flag#flagset-y-flaglookup)
- [Func (Go 1.16+) y TextVar (Go 1.19+)](/estandard/flag#flagfunc-y-flagtextvar)
- [FlagSet propio (subcomandos)](/estandard/flag#newflagset)
- [ExitOnError, ContinueOnError, PanicOnError](/estandard/flag#modos-de-error)
- [flag.CommandLine](/estandard/flag#commandline)

---

## Definir flags

Se definen **antes** de `flag.Parse()`, normalmente en `init()` o al principio de `main()`:

```go
var (
    nombre  = flag.String("nombre", "Mundo", "Nombre a saludar")
    edad    = flag.Int("edad", 0, "Edad de la persona")
    activo  = flag.Bool("activo", false, "¿Está activo?")
    timeout = flag.Duration("timeout", 5*time.Second, "Timeout de conexión")
)
```

| Función | Tipo del flag | Default |
|---------|---------------|---------|
| `flag.String(n, d, help)` | `*string` | `d` |
| `flag.Int(n, d, help)` | `*int` | `d` |
| `flag.Bool(n, d, help)` | `*bool` | `d` |
| `flag.Duration(n, d, help)` | `*time.Duration` | `d` |
| `flag.Float64(n, d, help)` | `*float64` | `d` |

Devuelven **punteros**. Con `flag.Parse()` se llenan automáticamente.

---

## Parsear y usar

```go
func main() {
    flag.Parse()
    
    fmt.Printf("Hola, %s!\n", *nombre)
    fmt.Printf("Edad: %d\n", *edad)
}
```

Uso desde terminal:

```bash
./app --nombre Juan --edad 25
# Hola, Juan!
# Edad: 25

./app -nombre Juan -edad 25
# igual con un guión

./app --help
# imprime automáticamente la ayuda con las descripciones
```

---

## Flags booleanos

Los flags `-bool` no necesitan `=valor`, con pasarlos ya es `true`:

```bash
./app --activo      # *activo = true
./app --activo=true # igual
./app               # *activo = false (default)
```

---

## Argumentos posicionales

Todo lo que no es un flag queda en `flag.Args()`:

```bash
./app --nombre Juan archivo1.txt archivo2.txt
```

```go
flag.Parse()

fmt.Println(flag.Args())   // [archivo1.txt, archivo2.txt]
fmt.Println(flag.Arg(0))   // archivo1.txt
fmt.Println(flag.NArg())   // 2 (cantidad)
fmt.Println(flag.NFlag())  // 1 (cantidad de flags seteados)
```

---

## Funciones de inspección

### Visit y VisitAll

```go
// Visit: itera solo sobre flags que fueron seteados por el usuario
flag.Visit(func(f *flag.Flag) {
    fmt.Printf("Flag set: %s = %v\n", f.Name, f.Value)
})

// VisitAll: itera sobre TODOS los flags (incluyendo los no seteados)
flag.VisitAll(func(f *flag.Flag) {
    fmt.Printf("Flag: %s, Default: %v, Usage: %s\n", f.Name, f.DefValue, f.Usage)
})
```

### NFlag, Parsed

```go
flag.NFlag()  // cantidad de flags seteados por el usuario
flag.Parsed() // true si ya se llamó a Parse()
```

---

## flag.Set y flag.Lookup

```go
// Lookup: busca un flag por nombre
f := flag.Lookup("nombre")
if f != nil {
    fmt.Println(f.Value.String())
}

// Set: cambia el valor de un flag programáticamente
flag.Set("nombre", "Pedro") // debe hacerse antes o después de Parse
```

---

## flag.Func y flag.TextVar

### Func (Go 1.16+)

Define un flag con lógica de parseo personalizada:

```go
var lista []string

flag.Func("items", "Lista de items separados por coma", func(s string) error {
    lista = strings.Split(s, ",")
    return nil
})

// ./app --items a,b,c
// lista = ["a", "b", "c"]
```

### TextVar (Go 1.19+)

Define un flag que implementa `encoding.TextUnmarshaler`:

```go
var ip net.IP
flag.TextVar(&ip, "ip", net.IPv4(127, 0, 0, 1), "Dirección IP")
flag.Parse()
// ./app --ip 10.0.0.1
```

---

## NewFlagSet (subcomandos)

```go
// FlagSet personalizado para subcomandos
servirCmd := flag.NewFlagSet("servir", flag.ExitOnError)
puerto := servirCmd.Int("puerto", 8080, "Puerto del servidor")

listarCmd := flag.NewFlagSet("listar", flag.ExitOnError)
formato := listarCmd.String("formato", "text", "Formato de salida")

switch os.Args[1] {
case "servir":
    servirCmd.Parse(os.Args[2:])
    fmt.Println("Servidor en puerto:", *puerto)
case "listar":
    listarCmd.Parse(os.Args[2:])
    fmt.Println("Formato:", *formato)
}
```

### flag.CommandLine

`flag.CommandLine` es el FlagSet por defecto que usan `flag.String()`, `flag.Parse()`, etc.:

```go
flag.CommandLine.SetOutput(os.Stderr) // cambiar salida de errores
flag.CommandLine.Usage = func() {     // personalizar mensaje de ayuda
    fmt.Println("Uso: ./app [flags] archivo...")
    flag.PrintDefaults()
}
```

---

## Modos de error

Controlan qué hace `Parse` ante un error:

| Modo | Comportamiento |
|------|---------------|
| `flag.ExitOnError` | `os.Exit(2)` (default de `flag.CommandLine`) |
| `flag.ContinueOnError` | Devuelve un error (no sale del programa) |
| `flag.PanicOnError` | Panic |

```go
// FlagSet con ContinueOnError
fs := flag.NewFlagSet("test", flag.ContinueOnError)
err := fs.Parse([]string{"--invalido"})
if err != nil {
    fmt.Println("Error parseando:", err)
}
```

---

[← Volver al índice](/indice)
