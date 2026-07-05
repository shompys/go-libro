# runtime/debug

Funciones de depuración y control del runtime: stack traces, control del GC, y gestión de memoria del SO.

```go
import "runtime/debug"
```

---

## Índice

- [Stack traces (Stack, PrintStack)](/estandard/runtime-debug#stack-traces)
- [GC (SetGCPercent, FreeOSMemory, ReadGCStats)](/estandard/runtime-debug#gc-garbage-collector)
- [SetMemoryLimit (Go 1.19+)](/estandard/runtime-debug#setmemorylimit)
- [BuildInfo (ReadBuildInfo)](/estandard/runtime-debug#buildinfo)
- [Funciones de control (SetMaxStack, SetMaxThreads, etc.)](/estandard/runtime-debug#funciones-de-control)
- [Funciones de memoria (WriteHeapDump)](/estandard/runtime-debug#funciones-de-memoria)
- [Ejemplos](/estandard/runtime-debug#ejemplos)

---

## Stack traces

### Stack

```go
func Stack() []byte
```

Devuelve un stack trace formateado de la gorutina actual. Útil para logs de depuración.

| Retorno | Descripción |
|---------|-------------|
| `[]byte` | Stack trace completo de la gorutina actual |

### PrintStack

```go
func PrintStack()
```

Imprime en `os.Stderr` el stack trace de la gorutina actual. Equivalente a `os.Stderr.Write(debug.Stack())`.

---

## GC (Garbage Collector)

### SetGCPercent

```go
func SetGCPercent(percent int) int
```

Establece el porcentaje de crecimiento del heap que dispara el GC. El valor predeterminado es 100 (GC cuando el heap crece al doble del tamaño vivo tras el último GC). Valores negativos deshabilitan el GC automático. Devuelve el valor anterior.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| percent | `int` | Nuevo porcentaje. `-1` deshabilita GC automático. |

### FreeOSMemory

```go
func FreeOSMemory()
```

Fuerza una recolección de basura y luego intenta devolver memoria al sistema operativo.

### SetMemoryLimit (Go 1.19+)

```go
func SetMemoryLimit(limit int64) int64
```

Establece un límite suave de memoria total para el runtime. Cuando el heap se acerca al límite, el GC se vuelve más agresivo para mantenerse por debajo. Devuelve el límite anterior.

```go
// Limitar el programa a 512 MiB de memoria total
prevLimit := debug.SetMemoryLimit(512 * 1024 * 1024)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| limit | `int64` | Límite en bytes. `-1` o `math.MaxInt64` lo deshabilita. |

⚠️ A diferencia de `SetMaxStack`, este límite es para todo el programa (todas las goroutines combinadas). El GOGC y el límite de memoria se complementan: el GC se dispara cuando cualquiera de los dos se alcanza primero.

---

## ReadGCStats

```go
func ReadGCStats(stats *GCStats)
```

Llena `stats` con estadísticas del recolector de basura.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| stats | `*GCStats` | Estructura a llenar con estadísticas |

### Tipo GCStats

```go
type GCStats struct {
	LastGC         time.Time         // Momento del último GC
	NumGC          int64             // Número de GCs completados
	PauseTotal     time.Duration     // Tiempo total de pausas
	Pause          []time.Duration   // Historial de pausas (circular)
	PauseEnd       []time.Time       // Momentos de fin de pausa (circular)
	PauseQuantiles []time.Duration   // Cuantiles de pausa
}
```

---

## BuildInfo

### ReadBuildInfo

```go
func ReadBuildInfo() (info *BuildInfo, ok bool)
```

Devuelve información de compilación incrustada en el binario. `ok` es `false` si no está disponible.

### Tipo BuildInfo

```go
type BuildInfo struct {
	GoVersion string         // Versión de Go usada
	Path      string         // Ruta del módulo principal
	Main      Module         // Módulo principal
	Deps      []*Module      // Dependencias
	Settings  []BuildSetting // Configuración de compilación (flags, etc.)
}
```

### Tipo Module

```go
type Module struct {
	Path    string  // Ruta del módulo
	Version string  // Versión del módulo
	Sum     string  // Checksum
	Replace *Module // Reemplazo (si existe)
}
```

---

## Funciones de control

### SetMaxStack

```go
func SetMaxStack(bytes int) int
```

Establece el tamaño máximo de stack por gorutina. Devuelve el valor anterior.

### SetMaxThreads

```go
func SetMaxThreads(threads int) int
```

Establece el máximo de hilos del SO que puede crear el runtime. Devuelve el anterior.

### SetPanicOnFault

```go
func SetPanicOnFault(enabled bool) bool
```

Controla si accesos a memoria inválida causan panic (en vez de crash). Devuelve el valor anterior.

### SetTraceback

```go
func SetTraceback(level string)
```

Controla la cantidad de detalle en stack traces de panic.

---

## Funciones de memoria

### WriteHeapDump

```go
func WriteHeapDump(fd uintptr)
```

Escribe un volcado completo del heap en el descriptor de archivo dado.

---

## Ejemplo: Stack trace en recuperación de panic

```go
package main

import (
	"fmt"
	"runtime/debug"
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recuperado de panic:", r)
			fmt.Println("Stack trace:")
			fmt.Println(string(debug.Stack()))
		}
	}()

	panic("algo salió mal")
}
```

---

## Ejemplo: Control de GC

```go
package main

import (
	"fmt"
	"runtime"
	"runtime/debug"
)

func main() {
	prev := debug.SetGCPercent(50)
	fmt.Println("GC% anterior:", prev)

	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	fmt.Println("Heap antes de GC:", m.HeapAlloc)

	runtime.GC()
	debug.FreeOSMemory()

	runtime.ReadMemStats(&m)
	fmt.Println("Heap después de FreeOSMemory:", m.HeapAlloc)
}
```

---

## Ejemplo: BuildInfo

```go
info, ok := debug.ReadBuildInfo()
if ok {
	fmt.Println("Go version:", info.GoVersion)
	fmt.Println("Module:", info.Main.Path, info.Main.Version)
	for _, dep := range info.Deps {
		fmt.Println("  Dep:", dep.Path, dep.Version)
	}
}
```

---

## Ejemplo: GCStats

```go
var stats debug.GCStats
debug.ReadGCStats(&stats)

fmt.Println("Last GC:", stats.LastGC)
fmt.Println("Num GC:", stats.NumGC)
fmt.Println("Pause total:", stats.PauseTotal)
```

---

[← Volver al índice](/indice)
