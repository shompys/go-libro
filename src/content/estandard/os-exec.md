# os/exec — Ejecutar comandos externos

Ejecuta programas del sistema desde Go.

```go
import "os/exec"
```

---

## Índice

- [Comando simple (Output, CombinedOutput)](/estandard/os-exec#comando-simple)
- [Comando con stdin y stderr](/estandard/os-exec#comando-con-stdin-y-stderr)
- [Run, Start y Wait](/estandard/os-exec#control-fino-con-run-y-start)
- [StdinPipe, StdoutPipe, StderrPipe](/estandard/os-exec#pipes-stdin,-stdout,-stderr)
- [Configurar el comando (Dir, Env, ExtraFiles)](/estandard/os-exec#configurar-el-comando)
- [Verificar exit status](/estandard/os-exec#verificar-exit-status)
- [CommandContext](/estandard/os-exec#commandcontext-con-cancelación)
- [Cancel y WaitDelay (Go 1.20+)](/estandard/os-exec#cmdcancel-y-cmdwaitdelay)
- [Process y ProcessState](/estandard/os-exec#cmdprocess-y-cmdprocessstate)
- [LookPath](/estandard/os-exec#lookpath)

---

## Comando simple

```go
cmd := exec.Command("ls", "-la", "/home")
out, err := cmd.Output()  // ejecuta y devuelve stdout
```

### CombinedOutput

```go
cmd := exec.Command("ls", "-la", "/noexiste")
out, err := cmd.CombinedOutput()  // stdout + stderr juntos
```

## Comando con stdin y stderr

```go
cmd := exec.Command("grep", "error")
cmd.Stdin = strings.NewReader("mensaje: error grave\nmensaje: ok")
cmd.Stderr = os.Stderr

out, _ := cmd.Output()
fmt.Println(string(out))  // mensaje: error grave
```

---

## Control fino con `Run()`, `Start()` y `Wait()`

```go
// Run: inicia y espera a que termine (bloqueante)
cmd := exec.Command("sleep", "3")
err := cmd.Run()

// Start + Wait: inicia y luego espera (no bloqueante, permite hacer cosas mientras)
cmd := exec.Command("sleep", "3")
err := cmd.Start()   // inicia el proceso y retorna inmediatamente
// ... hacer otras cosas mientras tanto ...
err = cmd.Wait()     // espera a que termine, libera recursos
```

| Método | Qué hace |
|--------|----------|
| `cmd.Run()` | Inicia el comando y espera a que termine |
| `cmd.Start()` | Inicia el comando, retorna inmediatamente |
| `cmd.Wait()` | Espera a que termine (debe llamarse después de Start) |
| `cmd.Output()` | Ejecuta y devuelve stdout |
| `cmd.CombinedOutput()` | Ejecuta y devuelve stdout + stderr juntos |

---

## Pipes (stdin, stdout, stderr)

Para interactuar con el proceso mientras se ejecuta:

```go
cmd := exec.Command("tr", "a-z", "A-Z")

stdin, _ := cmd.StdinPipe()
stdout, _ := cmd.StdoutPipe()
stderr, _ := cmd.StderrPipe()

cmd.Start()

stdin.Write([]byte("hola mundo"))
stdin.Close()

out, _ := io.ReadAll(stdout)
errOut, _ := io.ReadAll(stderr)

cmd.Wait()
fmt.Println(string(out)) // "HOLA MUNDO"
```

| Pipe | Descripción |
|------|-------------|
| `cmd.StdinPipe()` | `io.WriteCloser` para escribir al stdin del proceso |
| `cmd.StdoutPipe()` | `io.ReadCloser` para leer del stdout del proceso |
| `cmd.StderrPipe()` | `io.ReadCloser` para leer del stderr del proceso |

⚠️ Si usás `cmd.StdoutPipe()` **no** podés usar `cmd.Output()`. Son mutuamente excluyentes.

---

## Configurar el comando

| Campo | Tipo | Qué hace |
|-------|------|----------|
| `cmd.Path` | `string` | Ruta al ejecutable |
| `cmd.Args` | `[]string` | Argumentos del comando |
| `cmd.Dir` | `string` | Directorio de trabajo del comando |
| `cmd.Env` | `[]string` | Variables de entorno (si es `nil`, hereda del proceso actual) |
| `cmd.Environ()` | `[]string` | Devuelve el entorno que usará el comando (heredado + Env) |
| `cmd.Stdin` | `io.Reader` | Entrada estándar |
| `cmd.Stdout` | `io.Writer` | Salida estándar |
| `cmd.Stderr` | `io.Writer` | Salida de error |
| `cmd.ExtraFiles` | `[]*os.File` | File descriptors adicionales para el proceso hijo |
| `cmd.Cancel` | `func() error` | Función llamada al cancelar el comando (Go 1.20+) |
| `cmd.WaitDelay` | `time.Duration` | Tiempo extra de espera después de cancelar (Go 1.20+) |

---

## Verificar exit status

```go
cmd := exec.Command("false")
err := cmd.Run()
if err != nil {
    if exitErr, ok := err.(*exec.ExitError); ok {
        fmt.Println("Exit code:", exitErr.ExitCode())
    }
}
```

---

## CommandContext (con cancelación)

```go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()

cmd := exec.CommandContext(ctx, "sleep", "10")
err := cmd.Run()  // se cancela a los 2 segundos
```

---

## cmd.Cancel y cmd.WaitDelay (Go 1.20+)

Control fino sobre cómo se mata un proceso al cancelar el contexto:

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

cmd := exec.CommandContext(ctx, "mi-app")
cmd.Cancel = func() error {
    // Enviar SIGTERM en vez de SIGKILL
    return cmd.Process.Signal(syscall.SIGTERM)
}
cmd.WaitDelay = 10 * time.Second  // esperar 10s extra antes de matar
cmd.Run()
```

| Campo | Comportamiento |
|-------|---------------|
| `Cancel` | Función llamada al cancelar el contexto (default: `os.Process.Kill` → SIGKILL en Unix) |
| `WaitDelay` | Si después de cancelar el proceso sigue vivo, se espera este tiempo adicional y luego se fuerza kill |

---

## cmd.Process y cmd.ProcessState

```go
cmd := exec.Command("sleep", "30")
cmd.Start()

// Process: acceso al proceso en ejecución
fmt.Println("PID:", cmd.Process.Pid)

// Señales
cmd.Process.Signal(syscall.SIGTERM)
cmd.Process.Signal(os.Interrupt)

cmd.Wait()

// ProcessState: información después de que terminó
state := cmd.ProcessState
fmt.Println("Exit code:", state.ExitCode())    // código de salida
fmt.Println("PID:", state.Pid())               // PID
fmt.Println("¿Exitoso?", state.Success())       // true si exit code == 0
fmt.Println("Tiempo de sistema:", state.SystemTime())
fmt.Println("Tiempo de usuario:", state.UserTime())
fmt.Println(state.String())                     // descripción textual
```

---

## LookPath

Busca un ejecutable en `$PATH`:

```go
ruta, err := exec.LookPath("go")
if err != nil {
    log.Fatal("go no está instalado")
}
fmt.Println("Go encontrado en:", ruta) // /usr/local/go/bin/go
```

---

[← Volver al índice](/indice)
