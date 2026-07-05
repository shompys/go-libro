# log — Logging

Paquete para registrar mensajes con timestamp. Es simple y viene con Go.

```go
import "log"
```

Para logging más avanzado (niveles, estructurado, JSON), hay librerías de terceros como `zerolog` o `slog` (estándar desde Go 1.21).

---

## Índice

- [Funciones básicas](/estandard/log#funciones-básicas)
- [Logger personalizado](/estandard/log#logger-personalizado)
- [Flags de formato](/estandard/log#flags-de-formato)
- [Logger: Output, Writer, Default](/estandard/log#logger-métodos-del-tipo)
- [Integración con slog](/estandard/log#integración-con-slog-go-121)

---

## Funciones básicas

Todas imprimen con timestamp automático:

```go
log.Print("Mensaje normal")
log.Println("Con salto de línea")
log.Printf("Usuario %s conectado", nombre)

log.Fatal("Error fatal")    // imprime + os.Exit(1)
log.Fatalf("Error: %v", err)

log.Panic("Panic!")          // imprime + panic()
```

| Función | Imprime | Después de imprimir |
|---------|---------|---------------------|
| `Print` / `Println` / `Printf` | Sí | Nada (sigue) |
| `Fatal` / `Fatalln` / `Fatalf` | Sí | `os.Exit(1)` |
| `Panic` / `Panicln` / `Panicf` | Sí | `panic()` |

## Logger personalizado

Crear loggers que escriben a distintos destinos:

```go
var (
    Info  = log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime)
    Error = log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
)

Info.Println("Servidor iniciado")
Error.Println("No se pudo conectar")
```

| Parámetro de `log.New` | Qué es |
|------------------------|--------|
| `out` | `io.Writer` de destino |
| `prefix` | Prefijo antes de cada línea |
| `flag` | Qué información incluir (ver abajo) |

## Flags de formato

Controlan qué metadatos se agregan automáticamente:

| Flag | Qué muestra | Ejemplo |
|------|-------------|---------|
| `log.Ldate` | Fecha | `2026/07/05` |
| `log.Ltime` | Hora | `14:30:45` |
| `log.Lmicroseconds` | Hora con microsegundos | `14:30:45.123456` |
| `log.Llongfile` | Archivo completo | `/home/user/main.go:24:` |
| `log.Lshortfile` | Solo nombre de archivo | `main.go:24:` |
| `log.LUTC` | Fecha/hora en UTC | |
| `log.Lmsgprefix` | Prefijo antes del mensaje (no al principio) | |
| `log.LstdFlags` | `Ldate | Ltime` (por defecto) | `2026/07/05 14:30:45` |

Los flags se combinan con `|`:

```go
log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
```

### Cambiar el logger por defecto

```go
log.SetPrefix("APP: ")
log.SetFlags(log.LstdFlags)
log.SetOutput(archivo) // en vez de stderr
```

### Obtener configuración actual

```go
log.Prefix()      // devuelve el prefijo actual
log.Flags()       // devuelve los flags actuales
log.Writer()      // devuelve el io.Writer de salida
```

### Logger por defecto y Output

```go
log.Default()  // devuelve el logger estándar (para slog, etc.)

// Output escribe un mensaje con calldepth personalizado:
log.Output(2, "mensaje desde helper")
// calldepth 2 = un nivel más arriba en el stack
```

| Función | Qué hace |
|---------|----------|
| `log.Default() *Logger` | Devuelve el logger estándar |
| `log.Writer() io.Writer` | Devuelve el Writer de salida del logger estándar |
| `log.Prefix() string` | Devuelve el prefijo del logger estándar |
| `log.Flags() int` | Devuelve los flags del logger estándar |
| `l.Output(calldepth int, s string)` | Escribe con nivel de call stack personalizado |

### Integración con slog (Go 1.21+)

El paquete `log` puede usarse como backend de `log/slog`:

```go
import "log/slog"

logger := slog.NewLogLogger(slog.Default().Handler(), slog.LevelInfo)
// Ahora logger es un *log.Logger que usa slog
```

Para más información sobre logging estructurado, ver [log/slog](/log-slog).

---

## Logger (métodos del tipo)

Métodos disponibles en cualquier `*log.Logger`:

| Método | Qué hace |
|--------|----------|
| `l.Output(calldepth int, s string) error` | Escribe un mensaje controlando el nivel del stack |
| `l.Writer() io.Writer` | Devuelve el Writer subyacente |
| `l.Prefix() string` | Devuelve el prefijo |
| `l.SetPrefix(prefix string)` | Cambia el prefijo |
| `l.Flags() int` | Devuelve los flags |
| `l.SetFlags(flag int)` | Cambia los flags |

---

[← Volver al índice](/indice)
