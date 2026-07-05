# time — Fechas, horas y duraciones

Manejo de tiempo: obtener hora actual, formatear fechas, calcular duraciones, timers.

```go
import "time"
```

---

## Índice

- [Obtener la hora actual](/estandard/time#obtener-la-hora-actual)
- [Crear una fecha específica](/estandard/time#crear-una-fecha-específica)
- [Formatear fechas](/estandard/time#formatear-fechas)
- [Parsear fechas desde string](/estandard/time#parsear-fechas-desde-string)
- [Duración](/estandard/time#duración-timeduration)
- [Formatos predefinidos (RFC3339, DateOnly...)](/estandard/time#constantes-de-formato-predefinidas)
- [Operaciones con tiempo](/estandard/time#operaciones-con-tiempo)
- [Sleep, timers y tickers](/estandard/time#sleep-y-timers)

---

## Obtener la hora actual

```go
ahora := time.Now()                 // fecha y hora local
utc := time.Now().UTC()             // en UTC

ahora.Year()        // 2026
ahora.Month()       // time.July
ahora.Day()         // 5
ahora.Hour()        // 14
ahora.Minute()      // 30
ahora.Second()      // 45
ahora.Nanosecond()  // nanosegundos
ahora.Weekday()     // time.Sunday
ahora.YearDay()     // día del año (186)
```

---

## Crear una fecha específica

```go
fecha := time.Date(2026, time.July, 5, 14, 30, 0, 0, time.UTC)
//                  año    mes          día  h  min seg ns  zona
```

| Parámetro | Tipo | Rango |
|-----------|------|-------|
| `year` | `int` | Cualquiera |
| `month` | `time.Month` | `time.January` ... `time.December` |
| `day` | `int` | 1–31 |
| `hour` | `int` | 0–23 |
| `min` | `int` | 0–59 |
| `sec` | `int` | 0–59 |
| `nsec` | `int` | 0–999999999 |
| `loc` | `*time.Location` | `time.UTC`, `time.Local`, `time.LoadLocation("America/Argentina/Buenos_Aires")` |

---

## Formatear fechas

Go **no** usa `YYYY-MM-DD` como otros lenguajes. Usa una fecha de referencia mnemotécnica:

```
Mon Jan 2 15:04:05 MST 2006
```

Traducción:

| Token | Significado | Rango |
|-------|-------------|-------|
| `2006` | Año (4 dígitos) | |
| `06` | Año (2 dígitos) | |
| `01` | Mes (2 dígitos) | 01-12 |
| `1` | Mes (sin cero) | 1-12 |
| `Jan` | Mes abreviado | Jan-Dec |
| `January` | Mes completo | January-December |
| `02` | Día (2 dígitos) | 01-31 |
| `2` | Día (sin cero) | 1-31 |
| `Monday` | Día de la semana | Monday-Sunday |
| `Mon` | Día abreviado | Mon-Sun |
| `15` | Hora 24h (2 dígitos) | 00-23 |
| `3` | Hora 12h (sin cero) | 1-12 |
| `03` | Hora 12h (2 dígitos) | 01-12 |
| `PM` | AM/PM | AM, PM |
| `04` | Minutos (2 dígitos) | 00-59 |
| `05` | Segundos (2 dígitos) | 00-59 |
| `MST` | Zona horaria | |
| `-0700` | Offset UTC | |

```go
ahora := time.Now()
ahora.Format("02/01/2006")          // "05/07/2026"
ahora.Format("2006-01-02")          // "2026-07-05"
ahora.Format("15:04:05")            // "14:30:45"
ahora.Format("02 Jan 06 15:04")     // "05 Jul 26 14:30"
ahora.Format("Monday, 2 January")   // "Sunday, 5 July"
```

### Constantes de formato predefinidas

Go provee constantes para los formatos más comunes:

| Constante | Formato | Ejemplo |
|-----------|---------|---------|
| `time.DateTime` | `"2006-01-02 15:04:05"` | `2026-07-05 14:30:00` |
| `time.DateOnly` | `"2006-01-02"` | `2026-07-05` |
| `time.TimeOnly` | `"15:04:05"` | `14:30:00` |
| `time.RFC3339` | `"2006-01-02T15:04:05Z07:00"` | `2026-07-05T14:30:00+00:00` |
| `time.RFC3339Nano` | `"2006-01-02T15:04:05.999999999Z07:00"` | Con nanosegundos |
| `time.RFC822` | `"02 Jan 06 15:04 MST"` | `05 Jul 26 14:30 UTC` |
| `time.RFC822Z` | `"02 Jan 06 15:04 -0700"` | `05 Jul 26 14:30 +0000` |
| `time.RFC850` | `"Monday, 02-Jan-06 15:04:05 MST"` | |
| `time.RFC1123` | `"Mon, 02 Jan 2006 15:04:05 MST"` | |
| `time.RFC1123Z` | `"Mon, 02 Jan 2006 15:04:05 -0700"` | |
| `time.ANSIC` | `"Mon Jan _2 15:04:05 2006"` | |
| `time.UnixDate` | `"Mon Jan _2 15:04:05 MST 2006"` | |
| `time.RubyDate` | `"Mon Jan 02 15:04:05 -0700 2006"` | |
| `time.Kitchen` | `"3:04PM"` | `2:30PM` |
| `time.Stamp` | `"Jan _2 15:04:05"` | `Jul  5 14:30:05` |
| `time.StampMilli` | `"Jan _2 15:04:05.000"` | Con milisegundos |
| `time.StampMicro` | `"Jan _2 15:04:05.000000"` | Con microsegundos |
| `time.StampNano` | `"Jan _2 15:04:05.000000000"` | Con nanosegundos |

```go
// Usar con Format:
ahora.Format(time.DateOnly)  // "2026-07-05"
ahora.Format(time.RFC3339)   // "2026-07-05T14:30:45+00:00"
```

---

## Parsear fechas desde string

```go
fecha, err := time.Parse("02/01/2006", "05/07/2026")
fecha, err := time.Parse("2006-01-02 15:04:05", "2026-07-05 14:30:00")
```

### ParseInLocation

Parsea en una zona horaria específica:

```go
loc, _ := time.LoadLocation("America/Argentina/Buenos_Aires")
fecha, err := time.ParseInLocation("02/01/2006 15:04", "05/07/2026 14:30", loc)
```

### Zonas horarias

```go
utc := time.UTC            // zona UTC
local := time.Local        // zona local del sistema
loc, _ := time.LoadLocation("America/New_York")
fixed := time.FixedZone("UTC+3", 3*60*60) // zona con offset fijo
```

Con un `*time.Location` se puede convertir entre zonas:

```go
ahora := time.Now()
enNY, _ := time.LoadLocation("America/New_York")
ahoraNY := ahora.In(enNY)
```

---

## Duración (`time.Duration`)

Representa un intervalo de tiempo. Se crea multiplicando constantes:

```go
10 * time.Second
5 * time.Minute
2 * time.Hour
500 * time.Millisecond
```

| Constante | Equivale a |
|-----------|------------|
| `time.Nanosecond` | 1ns |
| `time.Microsecond` | 1000ns |
| `time.Millisecond` | 1000μs |
| `time.Second` | 1000ms |
| `time.Minute` | 60s |
| `time.Hour` | 60m |

Parsear duración desde string:

```go
d, _ := time.ParseDuration("1h30m")
d, _ := time.ParseDuration("5s")
d, _ := time.ParseDuration("500ms")
```

### Métodos de Duration

| Método | Qué devuelve |
|--------|-------------|
| `d.Hours() float64` | Duración en horas |
| `d.Minutes() float64` | Duración en minutos |
| `d.Seconds() float64` | Duración en segundos |
| `d.Milliseconds() int64` | Duración en milisegundos |
| `d.Microseconds() int64` | Duración en microsegundos |
| `d.Nanoseconds() int64` | Duración en nanosegundos |
| `d.Round(m Duration) Duration` | Redondea al múltiplo más cercano |
| `d.Truncate(m Duration) Duration` | Trunca al múltiplo inferior |
| `d.Abs() Duration` | Valor absoluto |
| `d.String() string` | Representación legible (ej: "1h30m5s") |

```go
d := 90 * time.Minute
d.Hours()           // 1.5
d.Minutes()         // 90
d.String()           // "1h30m0s"
```

---

## Operaciones con tiempo

```go
ahora := time.Now()

manana := ahora.Add(24 * time.Hour)           // sumar
ayer := ahora.Add(-24 * time.Hour)            // restar

diferencia := manana.Sub(ahora)               // 24h0m0s

ahora.After(ayer)       // true  (¿ahora es después?)
ahora.Before(manana)    // true  (¿ahora es antes?)
manana.Equal(ahora)     // false (¿son iguales?)

// Truncar a intervalos:
ahora.Truncate(time.Hour)   // elimina minutos/segundos
```

### Atajos: Since y Until

```go
time.Since(ahora)   // equivale a time.Now().Sub(ahora)
time.Until(manana)  // equivale a manana.Sub(time.Now())
```

### Métodos de time.Time

| Método | Qué hace |
|--------|----------|
| `t.Before(u)` | ¿`t` es anterior a `u`? |
| `t.After(u)` | ¿`t` es posterior a `u`? |
| `t.Equal(u)` | ¿Son el mismo instante? |
| `t.IsZero()` | ¿Es la fecha cero (`0001-01-01`)? |
| `t.UTC()` | Convierte a UTC |
| `t.Local()` | Convierte a zona horaria local |
| `t.In(loc)` | Convierte a la zona horaria `loc` |
| `t.Date()` | Devuelve `(year, month, day)` |
| `t.Clock()` | Devuelve `(hour, min, sec)` |

---

## Sleep, timers y tickers

### Sleep (pausar la ejecución)

```go
time.Sleep(2 * time.Second)
```

### Timer (ejecutar una vez en el futuro)

```go
t := time.NewTimer(3 * time.Second)
<-t.C  // bloquea hasta que pasen 3 segundos

// También se puede detener o reiniciar:
if !t.Stop() {
    <-t.C  // drenar el canal si ya disparó
}
t.Reset(5 * time.Second) // reprogramar a 5 segundos
```

| Método | Qué hace |
|--------|----------|
| `t.Reset(d Duration)` | Reprograma el timer |
| `t.Stop() bool` | Detiene el timer. `true` si se detuvo antes de disparar |

### AfterFunc (ejecutar callback)

Ejecuta una función en una goroutine después del delay:

```go
time.AfterFunc(5*time.Second, func() {
    fmt.Println("5 segundos después")
})
// Devuelve un *Timer que podés detener con .Stop()
```

### Ticker (repetir cada intervalo)

```go
ticker := time.NewTicker(1 * time.Second)
for range ticker.C {
    fmt.Println("tick")
}
ticker.Stop()
```

### Tick (atajo, cuidado con fugas)

```go
// time.Tick nunca se puede detener. Solo usar si el ticker
// vive toda la vida del programa:
for range time.Tick(1 * time.Second) {
    fmt.Println("tick")
}
```

⚠️ Preferí `NewTicker` porque `Tick` no se puede detener y puede causar memory leaks.

### After (atajo para esperar)

```go
select {
case <-time.After(5 * time.Second):
    fmt.Println("timeout")
}
```

---

## Unix timestamp

```go
ahora.Unix()         // segundos desde 1970  → 1751722245
ahora.UnixMilli()    // milisegundos
ahora.UnixMicro()    // microsegundos
ahora.UnixNano()     // nanosegundos

// De timestamp a time.Time:
t := time.Unix(1751722245, 0)
```

---

[← Volver al índice](/indice)
