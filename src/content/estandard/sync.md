# sync — Concurrencia y sincronización

Herramientas para coordinar goroutines: mutex, wait groups, ejecución única.

```go
import "sync"
```

---

## Índice

- [Mutex](/estandard/sync#mutex-exclusión-mutua)
- [RWMutex](/estandard/sync#rwmutex-lectura/escritura)
- [WaitGroup](/estandard/sync#waitgroup-esperar-goroutines)
- [Once](/estandard/sync#once-ejecutar-una-sola-vez)
- [Cond (NewCond, Wait, Signal, Broadcast)](/estandard/sync#cond-variable-de-condición)
- [Pool](/estandard/sync#pool-reutilizar-objetos)
- [Map](/estandard/sync#map-mapa-concurrente)

---

## Mutex (`sync.Mutex`)

Protege una sección crítica para que solo una goroutine acceda a la vez:

```go
var (
    contador int
    mu       sync.Mutex
)

func incrementar() {
    mu.Lock()
    contador++       // sección crítica
    mu.Unlock()
}
```

| Método | Qué hace |
|--------|----------|
| `Lock()` | Bloquea el mutex (espera si otra goroutine lo tiene) |
| `Unlock()` | Libera el mutex |
| `TryLock()` | Intenta bloquear; si no puede, devuelve `false` (Go 1.18+) |

⚠️ Siempre llamá `Unlock()` con `defer` para no olvidarlo:

```go
mu.Lock()
defer mu.Unlock()
contador++
```

---

## RWMutex (`sync.RWMutex`)

Permite múltiples lecturas simultáneas, pero bloquea la escritura:

```go
var (
    cache   map[string]string
    rwMu    sync.RWMutex
)

func leerCache(clave string) string {
    rwMu.RLock()         // permite múltiples lecturas
    defer rwMu.RUnlock()
    return cache[clave]
}

func escribirCache(clave, valor string) {
    rwMu.Lock()          // bloquea todo (lectura y escritura)
    defer rwMu.Unlock()
    cache[clave] = valor
}
```

| Método | Qué hace |
|--------|----------|
| `Lock()` | Bloquea para escritura (exclusivo) |
| `Unlock()` | Libera el bloqueo de escritura |
| `RLock()` | Bloquea para lectura (compartido) |
| `RUnlock()` | Libera el bloqueo de lectura |
| `TryLock()` | Intenta bloquear escritura sin esperar (Go 1.18+) |
| `TryRLock()` | Intenta bloquear lectura sin esperar (Go 1.18+) |

---

## WaitGroup (`sync.WaitGroup`)

Espera a que un grupo de goroutines termine:

```go
var wg sync.WaitGroup

for i := 0; i < 5; i++ {
    wg.Add(1)                 // "voy a lanzar una goroutine"
    go func(id int) {
        defer wg.Done()       // "terminé"
        fmt.Println("Tarea", id)
    }(i)
}

wg.Wait()  // bloquea hasta que todas llamen a Done()
fmt.Println("Todas terminaron")
```

| Método | Qué hace |
|--------|----------|
| `Add(n)` | Agrega `n` goroutines al contador |
| `Done()` | Resta 1 del contador |
| `Wait()` | Bloquea hasta que el contador llegue a 0 |
| `Go(f func())` | `wg.Add(1)` + `go func() { defer wg.Done(); f() }` (Go 1.22+) |

### WaitGroup.Go (Go 1.22+)

```go
var wg sync.WaitGroup

wg.Go(func() {
    fmt.Println("Tarea 1")
})

wg.Go(func() {
    fmt.Println("Tarea 2")
})

wg.Wait() // espera a ambas
```

Equivalente a `wg.Add(1); go func() { defer wg.Done(); f() }()` pero más conciso y seguro.

---

## Once (`sync.Once`)

Ejecuta una función **una sola vez**, sin importar cuántas goroutines la llamen. Ideal para inicialización:

```go
var (
    once   sync.Once
    config *Config
)

func GetConfig() *Config {
    once.Do(func() {
        config = cargarConfig()  // solo se ejecuta una vez
    })
    return config
}
```

---

## Cond (`sync.Cond`)

Variable de condición: permite que goroutines esperen o sean notificadas de eventos. Similar a `pthread_cond_t`.

```go
var (
    mu      sync.Mutex
    cond    = sync.NewCond(&mu)
    listo   bool
)

// Goroutine que espera
go func() {
    mu.Lock()
    for !listo {
        cond.Wait()  // libera el lock, espera señal, vuelve a lockear
    }
    fmt.Println("¡Listo!")
    mu.Unlock()
}()

// Goroutine que notifica
mu.Lock()
listo = true
mu.Unlock()
cond.Signal()  // despierta 1 goroutine (o Broadcast para todas)
```

| Función / Método | Qué hace |
|-------------------|----------|
| `sync.NewCond(&mu)` | Crea un Cond asociado a un Locker |
| `cond.Wait()` | Bloquea hasta recibir señal (libera y readquiere el lock) |
| `cond.Signal()` | Despierta una goroutine bloqueada en Wait |
| `cond.Broadcast()` | Despierta todas las goroutines bloqueadas en Wait |

⚠️ `Wait()` debe llamarse dentro de un `for` que verifique la condición, para evitar *spurious wakeups*.

---

## Pool (`sync.Pool`)

Reutiliza objetos en vez de crearlos de nuevo. Reduce carga del garbage collector:

```go
var bufPool = sync.Pool{
    New: func() any {
        return new(bytes.Buffer)
    },
}

func procesar(data []byte) {
    buf := bufPool.Get().(*bytes.Buffer)
    defer bufPool.Put(buf)
    
    buf.Reset()
    buf.Write(data)
    // ...
}
```

| Método | Qué hace |
|--------|----------|
| `Get()` | Obtiene un objeto del pool (o crea uno nuevo) |
| `Put(x)` | Devuelve un objeto al pool |

---

## Map (`sync.Map`)

Mapa seguro para concurrencia. Solo usarlo en casos específicos (la mayoría de las veces `map` + `Mutex` es mejor):

```go
var sm sync.Map

sm.Store("clave", "valor")
valor, ok := sm.Load("clave")
sm.Delete("clave")
```

| Método | Qué hace |
|--------|----------|
| `Store(k, v)` | Guarda |
| `Load(k)` | Lee (devuelve valor, ok) |
| `LoadOrStore(k, v)` | Lee o guarda si no existe |
| `LoadAndDelete(k)` | Lee y elimina atómicamente (devuelve valor, ok, estaba presente) |
| `Delete(k)` | Elimina |
| `Range(fn)` | Itera sobre todos los pares |
| `CompareAndSwap(k, old, new)` | Guarda `new` solo si el valor actual es `old` (Go 1.20+) |
| `CompareAndDelete(k, old)` | Elimina solo si el valor actual es `old` (Go 1.20+) |
| `Clear()` | Elimina todas las entradas (Go 1.23+) |
| `Swap(k, v)` | Guarda y devuelve el valor anterior (Go 1.20+) |

### Range

```go
sm.Range(func(key, value any) bool {
    fmt.Printf("%v: %v\n", key, value)
    return true // false para detener la iteración
})
```

### CompareAndSwap y CompareAndDelete

```go
// Solo actualiza si coincide (atómico)
swapped := sm.CompareAndSwap("clave", "valor_viejo", "valor_nuevo")

// Solo borra si coincide (atómico)
deleted := sm.CompareAndDelete("clave", "valor_actual")
```

---

[← Volver al índice](/indice)
