# runtime

Funciones del runtime de Go que interactúan con el planificador de gorutinas, el recolector de basura y el SO.

```go
import "runtime"
```

---

## Índice

- [Control del planificador (GOMAXPROCS, NumCPU, NumGoroutine)](/estandard/runtime#control-del-planificador)
- [NumCgoCall, GOROOT, Version](/estandard/runtime#numcgocall,-goroot,-version)
- [LockOSThread y UnlockOSThread](/estandard/runtime#lockosthread-y-unlockosthread)
- [KeepAlive](/estandard/runtime#keepalive)
- [Constantes del compilador (GOOS, GOARCH)](/estandard/runtime#constantes-del-compilador)
- [Goroutine (Goexit, Gosched)](/estandard/runtime#goroutine-goexit,-gosched)
- [Stack traces](/estandard/runtime#stack-traces-caller,-callers,-funcforpc)
- [Tipo Func](/estandard/runtime#tipo-func)
- [GC y SetFinalizer](/estandard/runtime#gc-y-setfinalizer)
- [MemStats y ReadMemStats](/estandard/runtime#memstats-y-readmemstats)
- [MemProfile](/estandard/runtime#memprofile)
- [Errores y tipo Error](/estandard/runtime#errores-y-tipo-error)
- [Ejemplos](/estandard/runtime#ejemplos)

---

## Control del planificador

### GOMAXPROCS

```go
func GOMAXPROCS(n int) int
```

Establece el número máximo de CPUs que pueden ejecutarse simultáneamente. Devuelve el valor anterior.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| n | `int` | Número máximo de CPUs a usar |

### NumCPU

```go
func NumCPU() int
```

Devuelve el número de CPUs lógicas disponibles en la máquina.

### NumGoroutine

```go
func NumGoroutine() int
```

Devuelve el número de gorutinas existentes en este momento.

---

## NumCgoCall, GOROOT, Version

### NumCgoCall

```go
func NumCgoCall() int64
```

Devuelve el número de llamadas cgo realizadas por el proceso.

### GOROOT

```go
func GOROOT() string
```

Devuelve la raíz de instalación de Go.

### Version

```go
func Version() string
```

Devuelve la versión de Go con la que se compiló el programa. Ej: `"go1.22.0"`.

```go
fmt.Println(runtime.Version()) // go1.22.0
```

---

## LockOSThread y UnlockOSThread

Vincula la goroutine actual a un hilo del SO de forma exclusiva. Útil para interactuar con bibliotecas C que requieren thread affinity (OpenGL, cgo con thread locals).

```go
func LockOSThread()
func UnlockOSThread()
```

```go
runtime.LockOSThread()
defer runtime.UnlockOSThread()
// esta goroutine siempre se ejecuta en el mismo hilo del SO
```

---

## KeepAlive

```go
func KeepAlive(x any)
```

Evita que el compilador elimine una variable o que el GC la recolecte antes de tiempo. Se usa para asegurar que un objeto "viva" al menos hasta este punto del código.

```go
f, _ := os.Open("archivo.txt")
defer f.Close()
data := make([]byte, 1024)
f.Read(data)
// ...
runtime.KeepAlive(f) // garantiza que f no sea finalizado por el GC antes de llegar acá
```

---

## Constantes del compilador

| Constante | Descripción |
|-----------|-------------|
| `GOOS` | Sistema operativo de compilación (`linux`, `darwin`, `windows`, etc.) |
| `GOARCH` | Arquitectura de compilación (`amd64`, `arm64`, `386`, etc.) |

---

## Goroutine

### Goexit

```go
func Goexit()
```

Termina la gorutina actual. Las funciones diferidas se ejecutan normalmente. No causa pánico.

### Gosched

```go
func Gosched()
```

Cede el procesador, permitiendo que otras gorutinas se ejecuten.

---

## Stack traces

### Caller

```go
func Caller(skip int) (pc uintptr, file string, line int, ok bool)
```

Obtiene información de la llamada en el stack. `skip=0` es el caller inmediato.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| skip | `int` | Niveles a subir en el stack |

| Retorno | Tipo | Descripción |
|---------|------|-------------|
| pc | `uintptr` | Program counter |
| file | `string` | Archivo fuente |
| line | `int` | Número de línea |
| ok | `bool` | `true` si se obtuvo información |

### Callers

```go
func Callers(skip int, pc []uintptr) int
```

Llena `pc` con los program counters de las llamadas en el stack.

### FuncForPC

```go
func FuncForPC(pc uintptr) *Func
```

Devuelve información de la función correspondiente a un program counter.

---

## Tipo Func

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `Name()` | `string` | Nombre completo de la función |
| `FileLine(pc uintptr)` | `(file string, line int)` | Archivo y línea para un PC dentro de la función |
| `Entry()` | `uintptr` | PC de entrada de la función |

---

## GC (Garbage Collector)

### GC

```go
func GC()
```

Ejecuta una recolección de basura inmediata. Bloquea hasta que termina.

### SetFinalizer

```go
func SetFinalizer(obj any, finalizer any)
```

Establece un finalizador para `obj`. Se ejecuta cuando `obj` se vuelve inalcanzable.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| obj | `any` | Objeto al que asociar el finalizador |
| finalizer | `any` | Función `func(obj *Type)` llamada al recolectar |

---

## MemStats

```go
type MemStats struct {
	// Estadísticas generales
	Alloc      uint64 // Bytes asignados en heap actualmente
	TotalAlloc uint64 // Bytes totales asignados (acumulado)
	Sys        uint64 // Bytes totales obtenidos del SO
	Lookups    uint64 // Número de búsquedas de punteros
	Mallocs    uint64 // Número de asignaciones de heap
	Frees      uint64 // Número de liberaciones de heap

	// Estadísticas de heap
	HeapAlloc    uint64 // Bytes asignados en heap
	HeapSys      uint64 // Bytes obtenidos del SO para heap
	HeapIdle     uint64 // Bytes en spans inactivos
	HeapInuse    uint64 // Bytes en spans en uso
	HeapReleased uint64 // Bytes devueltos al SO
	HeapObjects  uint64 // Número de objetos en heap

	// Estadísticas de stack
	StackInuse uint64 // Bytes en uso por stacks
	StackSys   uint64 // Bytes obtenidos del SO para stacks

	// Estadísticas del GC
	NextGC       uint64 // Próximo heap objetivo para GC
	LastGC       uint64 // Tiempo del último GC (nanosegundos desde epoch)
	PauseTotalNs uint64 // Pausas totales de GC
	NumGC        uint32 // Número de ciclos de GC completados
	GCCPUFraction float64 // Fracción de CPU usada por GC

	// ...
}
```

### ReadMemStats

```go
func ReadMemStats(m *MemStats)
```

Llena `m` con estadísticas actuales de memoria. **Detiene el mundo brevemente.**

---

## MemProfile

```go
func MemProfile(p []MemProfileRecord, inuseZero bool) (n int, ok bool)
```

Obtiene registros de perfil de memoria. El parámetro `inuseZero` controla si se incluyen objetos con conteo de uso cero.

---

## Errores y tipo Error

```go
type Error interface {
	error
	RuntimeError()
}
```

Interfaz para errores del runtime.

---

## Ejemplo: Información del sistema

```go
package main

import (
	"fmt"
	"runtime"
)

func main() {
	fmt.Println("GOOS:", runtime.GOOS)
	fmt.Println("GOARCH:", runtime.GOARCH)
	fmt.Println("NumCPU:", runtime.NumCPU())
	fmt.Println("GOMAXPROCS:", runtime.GOMAXPROCS(0))
	fmt.Println("NumGoroutine:", runtime.NumGoroutine())
	fmt.Println("GOROOT:", runtime.GOROOT())
	fmt.Println("Version:", runtime.Version())
}
```

---

## Ejemplo: Obtener caller

```go
pc, file, line, ok := runtime.Caller(0)
if ok {
	fn := runtime.FuncForPC(pc)
	fmt.Println("Archivo:", file)
	fmt.Println("Línea:", line)
	fmt.Println("Función:", fn.Name())
}
```

---

## Ejemplo: Estadísticas de memoria

```go
var m runtime.MemStats
runtime.ReadMemStats(&m)

fmt.Printf("Alloc = %v MiB\n", m.Alloc/1024/1024)
fmt.Printf("TotalAlloc = %v MiB\n", m.TotalAlloc/1024/1024)
fmt.Printf("HeapObjects = %v\n", m.HeapObjects)
fmt.Printf("NumGC = %v\n", m.NumGC)
fmt.Printf("NextGC = %v MiB\n", m.NextGC/1024/1024)
```

---

[← Volver al índice](/indice)
