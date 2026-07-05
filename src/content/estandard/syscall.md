# syscall — Llamadas al sistema (bajo nivel)

Interfaz directa a las syscalls del sistema operativo. **Específico de cada plataforma.** Preferí usar [os](/os), [os/exec](/os-exec) y [os/signal](/os-signal).

```go
import "syscall"
```

---

## Variables de entorno

```go
syscall.Getenv("HOME")
syscall.Setenv("KEY", "value")
syscall.Environ()  // todas las variables
```

## Archivos y descriptores

```go
fd, err := syscall.Open("/ruta/archivo", syscall.O_RDONLY, 0)
buf := make([]byte, 1024)
n, _ := syscall.Read(fd, buf)
syscall.Close(fd)
```

## Señales

```go
syscall.Kill(pid, syscall.SIGTERM)
// Señales comunes: SIGINT, SIGTERM, SIGHUP, SIGKILL, SIGUSR1
```

## Información del sistema

```go
var info syscall.Sysinfo_t
syscall.Sysinfo(&info)

var uts syscall.Utsname
syscall.Uname(&uts)
```

---

⚠️ Las APIs de `syscall` varían entre Linux, macOS y Windows. Para código portable, usá `os`, `os/exec`, `golang.org/x/sys/unix` o `golang.org/x/sys/windows`.

---

[← Volver al índice](/indice)
