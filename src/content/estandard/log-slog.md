# log/slog — Logging estructurado (Go 1.21+)

Provee logging estructurado con niveles (Debug, Info, Warn, Error), atributos clave-valor, y salida en texto o JSON.

```go
import "log/slog"
```

---

## Índice

- [Logging con el logger por defecto](/estandard/log-slog#logging-con-el-logger-por-defecto)
- [Niveles de log](/estandard/log-slog#niveles-de-log-level)
- [Atributos clave-valor](/estandard/log-slog#atributos-attr)
- [Logger personalizado](/estandard/log-slog#logger-personalizado)
- [Handler interface](/estandard/log-slog#handler-interface)
- [TextHandler (formato texto)](/estandard/log-slog#texthandler)
- [JSONHandler (formato JSON)](/estandard/log-slog#jsonhandler)
- [HandlerOptions (configuración)](/estandard/log-slog#handleroptions)
- [With](/estandard/log-slog#with-agregar-atributos-fijos)
- [Group](/estandard/log-slog#group-agrupar-atributos)
- [LogValuer](/estandard/log-slog#logvaluer-valores-personalizados)
- [Logger con contexto](/estandard/log-slog#logger-con-contexto)
- [LevelVar](/estandard/log-slog#levelvar-nivel-dinámico)
- [Source](/estandard/log-slog#source-origen-del-log)
- [Convertir slog a log estándar](/estandard/log-slog#convertir-slog-a-log-estándar)

---

## Logging con el logger por defecto

Las funciones del paquete usan un logger global que escribe a `os.Stderr` en formato texto con nivel `Info`.

```go
slog.Info("Servidor iniciado")
slog.Debug("Mensaje de depuración") // no aparece por defecto
slog.Warn("Precaución: memoria baja")
slog.Error("Fallo de conexión", "puerto", 8080)
```

| Función | Nivel | Salida |
|---------|-------|--------|
| `slog.Debug(msg, args...)` | `-4` | Mensajes de depuración |
| `slog.Info(msg, args...)` | `0` | Información general |
| `slog.Warn(msg, args...)` | `4` | Advertencias |
| `slog.Error(msg, args...)` | `8` | Errores |
| `slog.Log(ctx, level, msg, args...)` | variable | Nivel explícito |
| `slog.LogAttrs(ctx, level, msg, ...Attr)` | variable | Usando `Attr` en vez de `args...` |

---

## Niveles de log (Level)

```go
slog.LevelDebug // -4
slog.LevelInfo  // 0
slog.LevelWarn  // 4
slog.LevelError // 8
```

| Constante | Valor entero | Cuándo usarlo |
|-----------|-------------|---------------|
| `slog.LevelDebug` | `-4` | Detalles finos de depuración |
| `slog.LevelInfo` | `0` | Operaciones normales (default) |
| `slog.LevelWarn` | `4` | Situaciones que pueden causar problemas |
| `slog.LevelError` | `8` | Errores que requieren atención |

---

## Atributos (Attr)

Los atributos son pares clave-valor tipados que acompañan cada mensaje de log.

### Funciones helper para crear atributos

```go
slog.String("usuario", "ana")
slog.Int("edad", 30)
slog.Int64("id", 123456789)
slog.Uint64("bytes", 1024)
slog.Float64("precio", 9.99)
slog.Bool("activo", true)
slog.Time("fecha", time.Now())
slog.Duration("latencia", 150*time.Millisecond)
slog.Any("valor", cualquierTipo) // usa reflection
slog.Group("db", slog.String("host", "localhost"), slog.Int("puerto", 5432))
```

| Función | Retorna | Uso |
|---------|---------|-----|
| `slog.String(k, v)` | `slog.Attr` | Valor string |
| `slog.Int(k, v)` | `slog.Attr` | Valor int |
| `slog.Int64(k, v)` | `slog.Attr` | Valor int64 |
| `slog.Uint64(k, v)` | `slog.Attr` | Valor uint64 |
| `slog.Float64(k, v)` | `slog.Attr` | Valor float64 |
| `slog.Bool(k, v)` | `slog.Attr` | Valor bool |
| `slog.Time(k, v)` | `slog.Attr` | Valor time.Time |
| `slog.Duration(k, v)` | `slog.Attr` | Valor time.Duration |
| `slog.Any(k, v)` | `slog.Attr` | Cualquier tipo (usa reflection) |
| `slog.Group(k, attrs...)` | `slog.Attr` | Agrupa atributos anidados |

### Uso en mensajes

```go
slog.Info("Usuario logueado",
    "nombre", "ana",
    "edad", 30,
    "activo", true,
)
// INFO Usuario logueado nombre=ana edad=30 activo=true
```

**IMPORTANTE:** Los argumentos van de a pares `(clave, valor)`. Si la cantidad es impar, el último valor se ignora con una advertencia.

### Usando LogAttrs (más eficiente)

```go
slog.LogAttrs(context.Background(), slog.LevelInfo, "Usuario logueado",
    slog.String("nombre", "ana"),
    slog.Int("edad", 30),
    slog.Bool("activo", true),
)
```

`LogAttrs` es más eficiente que pasar pares `(clave, valor)` porque evita reflection y allocations.

---

## Logger personalizado

Se crea con `slog.New(handler)`.

```go
logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
logger.Info("Mensaje con logger personalizado", "app", "mi-app")
slog.SetDefault(logger) // Reemplaza el logger global
```

| Función | Devuelve | Descripción |
|---------|----------|-------------|
| `slog.New(h Handler)` | `*slog.Logger` | Crea un logger con un handler específico |
| `slog.SetDefault(l *slog.Logger)` | — | Establece el logger global |
| `slog.Default()` | `*slog.Logger` | Devuelve el logger global actual |

### Métodos de Logger

```go
logger.Debug(msg, args...)
logger.Info(msg, args...)
logger.Warn(msg, args...)
logger.Error(msg, args...)
logger.Log(ctx, level, msg, args...)
logger.LogAttrs(ctx, level, msg, ...Attr)
logger.Enabled(ctx, level) bool
logger.Handler() slog.Handler
logger.With(args...)
logger.WithGroup(name string)
```

---

## Handler interface

```go
type Handler interface {
    Enabled(context.Context, Level) bool
    Handle(context.Context, Record) error
    WithAttrs(attrs []Attr) Handler
    WithGroup(name string) Handler
}
```

| Método | Propósito |
|--------|-----------|
| `Enabled(ctx, level)` | Decide si un nivel debe loguearse |
| `Handle(ctx, record)` | Procesa y emite el registro de log |
| `WithAttrs(attrs)` | Devuelve un handler con atributos predefinidos |
| `WithGroup(name)` | Devuelve un handler con un grupo anidado |

No es necesario implementar `Handler` manualmente; usá `TextHandler` o `JSONHandler`.

---

## TextHandler

Escribe logs en formato `clave=valor` legible por humanos.

```go
handler := slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{
    Level: slog.LevelDebug,
})
logger := slog.New(handler)
logger.Info("Servidor listo", "puerto", 8080)
```

Salida:

```
time=2026-07-05T15:04:05.000-03:00 level=INFO msg="Servidor listo" puerto=8080
```

| Función | Devuelve |
|---------|----------|
| `slog.NewTextHandler(w io.Writer, opts *slog.HandlerOptions)` | `*slog.TextHandler` |

---

## JSONHandler

Escribe logs en formato JSON. Ideal para sistemas de agregación de logs.

```go
handler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level:     slog.LevelInfo,
    AddSource: true,
})
logger := slog.New(handler)
logger.Info("Servidor listo", "puerto", 8080)
```

Salida:

```json
{"time":"2026-07-05T15:04:05.000-03:00","level":"INFO","source":"main.go:42","msg":"Servidor listo","puerto":8080}
```

| Función | Devuelve |
|---------|----------|
| `slog.NewJSONHandler(w io.Writer, opts *slog.HandlerOptions)` | `*slog.JSONHandler` |

---

## HandlerOptions

```go
type HandlerOptions struct {
    AddSource   bool
    Level       Leveler
    ReplaceAttr func(groups []string, a Attr) Attr
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `AddSource` | `bool` | Si es `true`, agrega el archivo y línea de donde se llamó al log |
| `Level` | `slog.Leveler` | Nivel mínimo de log a procesar |
| `ReplaceAttr` | `func([]string, Attr) Attr` | Función para modificar o eliminar atributos antes de escribir |

### Ejemplo con ReplaceAttr

```go
handler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
        if a.Key == slog.TimeKey {
            return slog.Attr{} // elimina el campo time
        }
        if a.Key == "password" {
            return slog.String("password", "[REDACTADO]")
        }
        return a
    },
})
```

| Key predefinida | Valor |
|-----------------|-------|
| `slog.TimeKey` | `"time"` |
| `slog.LevelKey` | `"level"` |
| `slog.MessageKey` | `"msg"` |
| `slog.SourceKey` | `"source"` |

---

## With (agregar atributos fijos)

Agrega atributos que se incluyen en todos los mensajes de ese logger.

```go
logger := slog.Default().With(
    "servicio", "api",
    "version", "1.2.3",
)

logger.Info("Iniciando") // incluye servicio=api version=1.2.3
logger.Error("Timeout", "endpoint", "/users")
```

| Método | Descripción |
|--------|-------------|
| `logger.With(args...any) *Logger` | Devuelve un nuevo logger con atributos fijos agregados |

También existe `logger.WithAttrs(attrs []slog.Attr) *Logger` (más eficiente).

---

## Group (agrupar atributos)

Anida atributos bajo una clave. En JSONHandler produce objetos anidados.

```go
logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

logger.Info("Conexión",
    slog.Group("db",
        slog.String("host", "localhost"),
        slog.Int("puerto", 5432),
    ),
    slog.String("usuario", "admin"),
)
```

Salida JSON:

```json
{"time":"...","level":"INFO","msg":"Conexión","db":{"host":"localhost","puerto":5432},"usuario":"admin"}
```

| Método | Descripción |
|--------|-------------|
| `logger.WithGroup(name string) *Logger` | Devuelve un logger donde todos los atributos posteriores van dentro del grupo |

---

## LogValuer (valores personalizados)

Interfaz para controlar cómo se serializa un valor.

```go
type LogValuer interface {
    LogValue() slog.Value
}
```

### Ejemplo: ocultar datos sensibles

```go
type Token string

func (t Token) LogValue() slog.Value {
    if len(t) > 4 {
        return slog.StringValue(string(t)[:4] + "...")
    }
    return slog.StringValue("***")
}

token := Token("abcdef123456")
slog.Info("Autenticación", "token", token)
// token=abcd...
```

---

## Logger con contexto

Pasar contexto permite a los handlers extraer información adicional (como trace IDs).

```go
ctx := context.Background() // en producción usarías request context

slog.InfoContext(ctx, "Mensaje con contexto")
slog.DebugContext(ctx, "Debug con contexto")
slog.WarnContext(ctx, "Warn con contexto")
slog.ErrorContext(ctx, "Error con contexto")
```

| Función | Descripción |
|---------|-------------|
| `slog.InfoContext(ctx, msg, args...)` | Info con contexto |
| `slog.DebugContext(ctx, msg, args...)` | Debug con contexto |
| `slog.WarnContext(ctx, msg, args...)` | Warn con contexto |
| `slog.ErrorContext(ctx, msg, args...)` | Error con contexto |
| `slog.Log(ctx, level, msg, args...)` | Log genérico con contexto |

---

## LevelVar (nivel dinámico)

Permite cambiar el nivel de log en tiempo de ejecución, sin reiniciar el proceso.

```go
level := new(slog.LevelVar)
level.Set(slog.LevelInfo)

handler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level: level,
})
logger := slog.New(handler)
slog.SetDefault(logger)

// Más tarde, en otro lugar del código:
level.Set(slog.LevelDebug) // ahora aparecen los Debug también
```

| Método | Descripción |
|--------|-------------|
| `lvlVar.Set(l Level)` | Cambia el nivel actual |
| `lvlVar.Level() Level` | Devuelve el nivel actual |

Implementa la interfaz `slog.Leveler`, por eso se puede pasar directamente en `HandlerOptions.Level`.

---

## Source (origen del log)

Cuando `AddSource: true`, el handler agrega la ubicación de la llamada.

```go
handler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
    AddSource: true,
})
```

Salida:

```
time=... level=INFO source=/home/user/app/main.go:42 msg="Hola"
```

| Constante | Uso |
|-----------|-----|
| `slog.SourceKey` = `"source"` | Clave usada para el atributo de origen |

El tipo `slog.Source` tiene campos `Function`, `File` y `Line`.

---

## Convertir slog a log estándar

`log/slog` puede crear un `*log.Logger` estándar compatible.

```go
logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
stdLogger := slog.NewLogLogger(logger.Handler(), slog.LevelError)
stdLogger.Println("Esto se loguea como ERROR")
```

| Función | Devuelve |
|---------|----------|
| `slog.NewLogLogger(h Handler, level Level)` | `*log.Logger` |

Útil cuando una librería de terceros espera un `*log.Logger` estándar, pero querés que los mensajes pasen por `slog`.

---

[← Volver al índice](/indice)
