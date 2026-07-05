# runtime/pprof

API programática para profiling del runtime de Go. A diferencia de `net/http/pprof`, este paquete escribe perfiles a escritores (archivos, buffers) sin necesidad de servidor HTTP.

```go
import "runtime/pprof"
```

---

## Perfil de CPU

### StartCPUProfile

```go
func StartCPUProfile(w io.Writer) error
```

Inicia un perfil de CPU y escribe los datos a `w`. Solo puede haber un perfil de CPU activo a la vez.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| w | `io.Writer` | Destino de los datos del perfil |

### StopCPUProfile

```go
func StopCPUProfile()
```

Detiene el perfil de CPU actual. Bloquea hasta que todos los datos se hayan escrito.

---

## Perfil de heap

### WriteHeapProfile

```go
func WriteHeapProfile(w io.Writer) error
```

Escribe un perfil del heap (asignaciones de memoria) a `w`.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| w | `io.Writer` | Destino de los datos del perfil de heap |

---

## Lookup y Profiles

### Lookup

```go
func Lookup(name string) *Profile
```

Busca un perfil por nombre. Devuelve `nil` si no existe.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| name | `string` | Nombre del perfil |

### Profiles

```go
func Profiles() []*Profile
```

Devuelve todos los perfiles disponibles.

---

## Tipo Profile

Representa un perfil de runtime.

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `Name() string` | `string` | Nombre del perfil |
| `Count() int` | `int` | Número de muestras |
| `WriteTo(w io.Writer, debug int) error` | `error` | Escribe el perfil en formato pprof |

El parámetro `debug` de `WriteTo`:
- `0`: formato binario pprof (compatible con `go tool pprof`)
- `1`: texto legible (con comentarios)
- `2`: igual que 1 pero incluyendo direcciones

---

## Nombres de perfiles predefinidos

| Nombre | Descripción |
|--------|-------------|
| `"goroutine"` | Perfil de todas las gorutinas con sus stacks |
| `"heap"` | Perfil de asignaciones de memoria |
| `"threadcreate"` | Perfil de creación de hilos del SO |
| `"block"` | Perfil de bloqueos en primitivas de sincronización |
| `"mutex"` | Perfil de contención de mutex |
| `"allocs"` | Perfil de todas las asignaciones (no solo las vivas) |

---

## Constantes de bloqueo

| Ruta de bloqueo | Descripción |
|-----------------|-------------|
| `runtime.BlockProfileRate` | Frecuencia de muestreo para perfil de bloqueos (en nanosegundos). `0` deshabilita. |
| `runtime.MutexProfileFraction` | Fracción de contención de mutex a muestrear. `0` deshabilita. |

---

## Ejemplo: Perfil de CPU a archivo

```go
package main

import (
	"log"
	"os"
	"runtime/pprof"
)

func main() {
	f, err := os.Create("cpu.prof")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	if err := pprof.StartCPUProfile(f); err != nil {
		log.Fatal(err)
	}
	defer pprof.StopCPUProfile()

	// ... código a perfilar ...
	heavyWork()
}

func heavyWork() {
	sum := 0
	for i := 0; i < 10_000_000; i++ {
		sum += i
	}
}
```

---

## Ejemplo: Perfil de heap

```go
package main

import (
	"log"
	"os"
	"runtime/pprof"
)

func main() {
	// ... código que asigna memoria ...

	f, err := os.Create("heap.prof")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	if err := pprof.WriteHeapProfile(f); err != nil {
		log.Fatal(err)
	}
}
```

---

## Ejemplo: Usar Lookup para inspeccionar gorutinas

```go
package main

import (
	"fmt"
	"os"
	"runtime/pprof"
)

func main() {
	prof := pprof.Lookup("goroutine")
	if prof == nil {
		fmt.Println("Perfil no encontrado")
		return
	}

	fmt.Printf("Gorutinas activas: %d\n", prof.Count())

	err := prof.WriteTo(os.Stdout, 1) // debug=1 para texto legible
	if err != nil {
		panic(err)
	}
}
```

---

## Ejemplo: Escribir todos los perfiles disponibles

```go
for _, prof := range pprof.Profiles() {
	fmt.Println("Perfil:", prof.Name(), "- Muestras:", prof.Count())
}
```

---

## Uso con go tool pprof

```bash
# Analizar perfil de CPU
go tool pprof cpu.prof

# Analizar perfil de heap
go tool pprof heap.prof

# Comparar dos perfiles
go tool pprof -base cpu_before.prof cpu_after.prof
```

---

[← Volver al índice](/indice)
