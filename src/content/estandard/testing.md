# testing — Tests unitarios

Framework de testing incluido en Go. Los tests se escriben en archivos `*_test.go` y se ejecutan con `go test`.

```go
import "testing"
```

---

## Índice

- [Estructura de un test](/estandard/testing#estructura-de-un-test)
- [Assertions básicas](/estandard/testing#assertions-básicas)
- [Sub-tests](/estandard/testing#sub-tests)
- [Table-driven tests](/estandard/testing#table-driven-tests)
- [Helper](/estandard/testing#helper-marcar-funciones-auxiliares)
- [Cleanup](/estandard/testing#cleanup-limpieza)
- [TempDir](/estandard/testing#tempdir-directorio-temporal)
- [Setenv](/estandard/testing#setenv)
- [Parallel](/estandard/testing#parallel-tests-paralelos)
- [Benchmarks](/estandard/testing#benchmarks)
- [Banderas de testing](/estandard/testing#bandera--short-y--v)
- [TestMain](/estandard/testing#testmain-setup/teardown)

---

## Estructura de un test

```go
// archivo: calculadora_test.go
package main

import "testing"

func TestSumar(t *testing.T) {
    resultado := Sumar(2, 3)
    esperado := 5

    if resultado != esperado {
        t.Errorf("Sumar(2,3) = %d; esperado %d", resultado, esperado)
    }
}
```

| Convención | Regla |
|------------|-------|
| Archivo | `*_test.go` |
| Función | `Test` + nombre (ej: `TestSumar`) |
| Parámetro | `t *testing.T` |

Ejecutar:

```bash
go test                    # todos los tests del paquete
go test -v                 # verbose
go test -run TestSumar     # un test específico
go test ./...              # todos los paquetes
```

---

## Assertions básicas

| Método | Qué hace |
|--------|----------|
| `t.Error(args...)` | Reporta error pero continúa |
| `t.Errorf(format, args...)` | Error con formato |
| `t.Fatal(args...)` | Reporta error y frena el test |
| `t.Fatalf(format, args...)` | Fatal con formato |
| `t.Log(args...)` | Log (solo visible con `-v`) |
| `t.Skip(args...)` | Saltea el test |

---

## Sub-tests

Agrupan tests relacionados y permiten ejecutarlos por separado:

```go
func TestOperaciones(t *testing.T) {
    t.Run("suma", func(t *testing.T) {
        if Sumar(2, 3) != 5 {
            t.Fatal("falló suma")
        }
    })
    t.Run("resta", func(t *testing.T) {
        if Restar(5, 3) != 2 {
            t.Fatal("falló resta")
        }
    })
}
```

Ejecutar un sub-test:

```bash
go test -run TestOperaciones/suma
```

---

## Table-driven tests

El patrón más común en Go: definir casos de prueba en una tabla:

```go
func TestSumar(t *testing.T) {
    casos := []struct {
        nombre   string
        a, b     int
        esperado int
    }{
        {"positivos", 2, 3, 5},
        {"cero", 0, 5, 5},
        {"negativos", -2, -3, -5},
    }

    for _, c := range casos {
        t.Run(c.nombre, func(t *testing.T) {
            if res := Sumar(c.a, c.b); res != c.esperado {
                t.Errorf("Sumar(%d,%d) = %d; esperado %d", c.a, c.b, res, c.esperado)
            }
        })
    }
}
```

---

## Helper (marcar funciones auxiliares)

`t.Helper()` marca una función como auxiliar. Al fallar, el error muestra al llamador, no la función helper:

```go
func assertEqual(t *testing.T, got, want int) {
    t.Helper()  // este file+line se omite en errores
    if got != want {
        t.Errorf("got %d, want %d", got, want)
    }
}

func TestSuma(t *testing.T) {
    assertEqual(t, Sumar(2, 3), 5)
    // error reportará TestSuma, no assertEqual
}
```

---

## Cleanup (limpieza)

`t.Cleanup(f)` registra funciones que se ejecutan al finalizar el test (o sub-test), incluso si falla. Similar a `defer` pero con scope del test:

```go
func TestArchivo(t *testing.T) {
    f, err := os.CreateTemp("", "test")
    if err != nil { t.Fatal(err) }
    
    t.Cleanup(func() {
        f.Close()
        os.Remove(f.Name())
    })
    
    // el archivo se borra siempre, incluso si el test falla
}
```

---

## TempDir (directorio temporal)

Crea un directorio temporal que se elimina automáticamente al finalizar el test:

```go
func TestConArchivos(t *testing.T) {
    dir := t.TempDir()  // creado y limpiado automáticamente
    // usar dir...
}
```

---

## Setenv

Establece una variable de entorno para la duración del test. La restaura al valor original al terminar:

```go
func TestConEnv(t *testing.T) {
    t.Setenv("DB_HOST", "localhost")
    // DB_HOST="localhost" solo durante este test
}
```

---

## Parallel (tests paralelos)

`t.Parallel()` permite que un test se ejecute en paralelo con otros tests marcados:

```go
func TestA(t *testing.T) { t.Parallel(); /* ... */ }
func TestB(t *testing.T) { t.Parallel(); /* ... */ }
func TestC(t *testing.T) { t.Parallel(); /* ... */ }
// A, B, C se ejecutan concurrentemente
```

No uses `t.Setenv` con `t.Parallel` en el mismo test. Para tests paralelos con sub-tests, usá `t.Parallel()` dentro del `t.Run()`.

---

## Benchmarks

Miden rendimiento de funciones:

```go
func BenchmarkSumar(b *testing.B) {
    for i := 0; i < b.N; i++ {  // Go ajusta b.N automáticamente
        Sumar(2, 3)
    }
}
```

Ejecutar:

```bash
go test -bench=.       # todos los benchmarks
go test -bench=Sumar   # específico
go test -bench=. -benchtime=10s  # ejecutar por 10 segundos en vez de 1s
go test -bench=. -count=5         # repetir 5 veces
```

### Métodos de testing.B

| Método | Descripción |
|--------|-------------|
| `b.N` | Cantidad de iteraciones (Go la ajusta) |
| `b.ResetTimer()` | Reinicia el timer (útil tras setup costoso) |
| `b.StopTimer()` / `b.StartTimer()` | Pausa/reanuda el timer |
| `b.ReportAllocs()` | Reporta allocaciones de memoria |
| `b.Run(name, fn)` | Sub-benchmarks |
| `b.RunParallel(fn)` | Benchmark en paralelo con GOMAXPROCS |

```go
func BenchmarkCostoso(b *testing.B) {
    data := prepararDatos()  // setup lento
    b.ResetTimer()            // no medir el setup

    for i := 0; i < b.N; i++ {
        Procesar(data)
    }
}
```

---

## Banderas de testing

Variables globales de `testing` para consultar el modo de ejecución:

| Bandera | Tipo | Descripción |
|---------|------|-------------|
| `testing.Short()` | `func bool` | `true` si se pasó `-short` (para saltar tests largos) |
| `testing.Verbose()` | `func bool` | `true` si se pasó `-v` |
| `testing.Coverage()` | `func float64` | Porcentaje de cobertura (0.0 a 100.0) cuando se usó `-cover` |
| `testing.CoverMode()` | `func string` | Modo de cobertura: `"set"`, `"count"`, `"atomic"` |

```go
func TestPesado(t *testing.T) {
    if testing.Short() {
        t.Skip("Saltando test pesado en modo -short")
    }
    // ...
}
```

### testing.Benchmark

Ejecuta un benchmark programáticamente (no desde `go test`):

```go
func BenchmarkSumar(b *testing.B) { /* ... */ }

func main() {
    result := testing.Benchmark(BenchmarkSumar)
    fmt.Println(result.N, result.T, result.Bytes, result.MemAllocs)
}
```

### testing.MainStart

Punto de entrada personalizado para tests cuando necesitás flags propios antes de `go test`:

```go
func TestMain(m *testing.M) {
    // testing.MainStart se usa en código generado por 'go test', no manualmente.
    // Para setup/teardown, usá TestMain con m.Run().
}
```

---

## TestMain (setup y teardown global)

Para inicializar recursos antes de todos los tests:

```go
func TestMain(m *testing.M) {
    // Setup (antes de los tests)
    
    code := m.Run()  // ejecuta todos los tests

    // Teardown (después de los tests)
    
    os.Exit(code)
}
```

---

[← Volver al índice](/indice)
