# os — Sistema Operativo

Interactúa con el sistema operativo: archivos, directorios, variables de entorno, procesos, señales.

```go
import "os"
```

Para I/O más avanzada (lectura con buffer, escaneo), ver [bufio](/bufio).

---

## Índice

- [Archivos (abrir, crear, leer, escribir, cerrar)](/estandard/os#archivos)
- [Variables de entorno](/estandard/os#variables-de-entorno)
- [Argumentos de línea de comandos](/estandard/os#argumentos-de-línea-de-comandos)
- [Directorios (crear, leer, eliminar)](/estandard/os#directorios)
- [Utilidades de ruta](/estandard/os#utilidades-de-ruta)
- [Salir del programa](/estandard/os#salir-del-programa)
- [Stdin, Stdout, Stderr](/estandard/os#stdin,-stdout,-stderr)
- [Señales y procesos](/estandard/os#señales-y-procesos)

---

## Archivos

### Abrir un archivo

```go
f, err := os.Open("archivo.txt")
if err != nil {
    log.Fatal(err)
}
defer f.Close()
```

| Función | Modo | Crea si no existe |
|---------|------|-------------------|
| `os.Open(path)` | Solo lectura | No |
| `os.Create(path)` | Lectura y escritura | Sí (trunca si existe) |
| `os.OpenFile(path, flag, perm)` | Según los flags | Según el flag |

### Flags de `OpenFile`

| Flag | Significado |
|------|-------------|
| `os.O_RDONLY` | Solo lectura |
| `os.O_WRONLY` | Solo escritura |
| `os.O_RDWR` | Lectura y escritura |
| `os.O_APPEND` | Escribir al final (append) |
| `os.O_CREATE` | Crear si no existe |
| `os.O_TRUNC` | Truncar a tamaño 0 si existe |
| `os.O_EXCL` | Fallar si el archivo ya existe (con `O_CREATE`) |

```go
f, err := os.OpenFile("log.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
```

### Permisos (último parámetro de OpenFile)

| Formato | Significado |
|---------|-------------|
| `0644` | rw-r--r-- (dueño lee/escribe, otros leen) |
| `0755` | rwxr-xr-x (dueño todo, otros leen/ejecutan) |
| `0600` | rw------- (solo dueño lee/escribe) |

Se usa notación octal de Unix.

### Leer

```go
data, err := os.ReadFile("archivo.txt")  // Go 1.16+: lee todo el archivo

// Manualmente:
buf := make([]byte, 1024)
n, err := f.Read(buf)
```

| Función | Qué hace |
|---------|----------|
| `os.ReadFile(path)` | Lee todo el archivo y devuelve `[]byte` |
| `f.Read(buf)` | Lee hasta `len(buf)` bytes |
| `f.ReadAt(buf, offset)` | Lee desde una posición específica |

### Escribir

```go
err := os.WriteFile("archivo.txt", []byte("Hola"), 0644) // Go 1.16+

// Manualmente:
n, err := f.Write([]byte("Hola"))
n, err := f.WriteString("Hola")
```

| Función | Qué hace |
|---------|----------|
| `os.WriteFile(path, data, perm)` | Escribe todo de una vez |
| `f.Write(data)` | Escribe bytes |
| `f.WriteString(s)` | Escribe string |

### Cerrar

```go
defer f.Close()  // asegura que se cierre al salir de la función
```

### Info del archivo

```go
info, err := f.Stat()
// o: info, err := os.Stat("archivo.txt")

info.Name()  // nombre del archivo
info.Size()  // tamaño en bytes
info.Mode()  // permisos
info.ModTime() // fecha de modificación
info.IsDir() // true si es directorio
```

### Eliminar y renombrar

```go
os.Remove("archivo.txt")     // elimina archivo o dir vacío
os.RemoveAll("directorio/")  // elimina dir con todo su contenido
os.Rename("viejo.txt", "nuevo.txt")
```

### ¿El archivo existe?

```go
_, err := os.Stat("archivo.txt")
if os.IsNotExist(err) {
    fmt.Println("No existe")
}
```

---

## Variables de entorno

```go
os.Setenv("MODO", "produccion")   // setear
valor := os.Getenv("MODO")        // leer (vacío si no existe)
valor, ok := os.LookupEnv("MODO") // leer con chequeo de existencia

// Todas las variables:
for _, env := range os.Environ() {
    fmt.Println(env)
}
```

---

## Argumentos de línea de comandos

```go
// os.Args[0] = nombre del ejecutable
// os.Args[1:] = argumentos

fmt.Println(os.Args)         // slice con todo
fmt.Println(os.Args[1])      // primer argumento
```

Para parseo avanzado con flags (`--nombre valor`), ver [flag](/flag).

---

## Directorios

```go
os.Mkdir("carpeta", 0755)          // crea un directorio
os.MkdirAll("a/b/c", 0755)         // crea directorios anidados

entries, _ := os.ReadDir(".")      // lee contenido (Go 1.16+)
for _, entry := range entries {
    fmt.Println(entry.Name(), entry.IsDir())
}

wd, _ := os.Getwd()                // directorio actual
os.Chdir("/otro/directorio")       // cambiar directorio actual
```

---

## Stdin, Stdout, Stderr

```go
os.Stdin   // entrada estándar (teclado)
os.Stdout  // salida estándar (pantalla)
os.Stderr  // salida de error estándar
```

```go
fmt.Fprintln(os.Stderr, "Error: algo salió mal")
```

---

## Salir del programa

```go
os.Exit(0)   // termina exitosamente (código 0)
os.Exit(1)   // termina con error (código 1)
```

`os.Exit` no ejecuta `defer`. Si necesitás deferred, usá `return` en `main()` o llamá a `os.Exit` desde otro lado.

---

## Utilidades de ruta

### Directorios especiales del sistema

```go
tmp := os.TempDir()                  // directorio temporal del SO
home, _ := os.UserHomeDir()          // ~/home/usuario
cache, _ := os.UserCacheDir()        // directorio de caché
config, _ := os.UserConfigDir()      // directorio de configuración
```

| Función | Qué devuelve |
|---------|-------------|
| `os.TempDir()` | Directorio temporal (ej: `/tmp`) |
| `os.UserHomeDir()` | Home del usuario (ej: `/home/usuario`) |
| `os.UserCacheDir()` | Directorio de caché del usuario |
| `os.UserConfigDir()` | Directorio de configuración del usuario |

### Expandir variables de entorno en strings

```go
expanded := os.ExpandEnv("Ruta: $HOME/config")
// "Ruta: /home/usuario/config"

// Con función personalizada:
mapper := func(varName string) string {
    if varName == "APP" { return "miApp" }
    return ""
}
result := os.Expand("$APP/config.yaml", mapper)
// "miApp/config.yaml"
```

| Función | Qué hace |
|---------|----------|
| `os.ExpandEnv(s string) string` | Reemplaza `${VAR}` y `$VAR` con valores de entorno |
| `os.Expand(s string, fn func(string) string) string` | Reemplaza variables con función personalizada |

### Enlaces simbólicos y físicos

```go
os.Symlink("target.txt", "enlace.txt") // crea enlace simbólico
os.Link("original.txt", "enlace.txt")  // crea hard link
```

### Truncar archivo

```go
os.Truncate("archivo.txt", 100) // reduce o agranda el archivo a 100 bytes
```

---

## Información del sistema

```go
nombre, _ := os.Hostname()          // nombre de la máquina
pid := os.Getpid()                   // ID del proceso actual
ppid := os.Getppid()                 // ID del proceso padre
uid := os.Getuid()                   // ID del usuario (Unix)
gid := os.Getgid()                   // ID del grupo (Unix)
```

| Función | Qué devuelve |
|---------|-------------|
| `os.Hostname()` | Nombre del host |
| `os.Getpid()` | PID del proceso actual |
| `os.Getppid()` | PID del proceso padre |
| `os.Getuid()` | UID del usuario (Unix) |
| `os.Getgid()` | GID del grupo (Unix) |

---

## Pipe

Crea un pipe en memoria para comunicación entre goroutines:

```go
r, w, err := os.Pipe()
// r: *os.File para leer
// w: *os.File para escribir
```

---

## Métodos avanzados de File

### Seek (mover el cursor)

```go
f.Seek(0, io.SeekStart)     // ir al principio
f.Seek(10, io.SeekStart)    // ir a byte 10
f.Seek(0, io.SeekEnd)       // ir al final
f.Seek(-5, io.SeekCurrent)  // retroceder 5 bytes
```

| Constante | Significado |
|-----------|-------------|
| `io.SeekStart` | Desde el inicio |
| `io.SeekCurrent` | Desde la posición actual |
| `io.SeekEnd` | Desde el final |

### WriteAt y ReadFrom

```go
f.WriteAt([]byte("hola"), 100)  // escribe en la posición 100 sin mover cursor
n, _ := f.ReadFrom(otroReader)  // lee todo de otroReader y lo escribe en f
```

| Método | Qué hace |
|--------|----------|
| `f.Seek(offset, whence)` | Mueve el cursor a la posición indicada |
| `f.WriteAt(data, offset)` | Escribe en posición específica sin mover cursor |
| `f.ReadFrom(r io.Reader)` | Lee todo de `r` y escribe en `f` |

---

## Verificar tipo de error del SO

Permiten consultar la naturaleza de un error del sistema:

```go
if os.IsNotExist(err) {
    fmt.Println("No existe")
}
if os.IsPermission(err) {
    fmt.Println("Permiso denegado")
}
if os.IsTimeout(err) {
    fmt.Println("Timeout")
}
if os.IsExist(err) {
    fmt.Println("Ya existe")
}
```

| Función | Verifica si el error... |
|---------|----------------------|
| `os.IsNotExist(err)` | Indica que no existe |
| `os.IsPermission(err)` | Es por falta de permisos |
| `os.IsTimeout(err)` | Es por timeout |
| `os.IsExist(err)` | Indica que ya existe |

### SyscallError

```go
err := os.NewSyscallError("open", syscall.ENOENT)
fmt.Println(err) // "open: no such file or directory"
```

---

## Señales y procesos

### Encontrar proceso

```go
proc, err := os.FindProcess(1234) // por PID
```

### Iniciar proceso (bajo nivel)

```go
procAttr := &os.ProcAttr{
    Files: []*os.File{os.Stdin, os.Stdout, os.Stderr},
}
proc, err := os.StartProcess("/bin/ls", []string{"ls", "-l"}, procAttr)
```

### Enviar señales

```go
proc.Signal(os.Interrupt)  // enviar SIGINT
proc.Signal(os.Kill)       // enviar SIGKILL
```

| Método | Qué hace |
|--------|----------|
| `os.FindProcess(pid)` | Obtiene proceso por PID |
| `os.StartProcess(name, args, attr)` | Inicia un nuevo proceso |
| `proc.Signal(sig)` | Envía una señal al proceso |
| `proc.Kill()` | Mata el proceso |
| `proc.Wait()` | Espera a que el proceso termine |
| `proc.Release()` | Libera recursos asociados al proceso |

Señales comunes: `os.Interrupt` (SIGINT, Ctrl+C), `os.Kill` (SIGKILL). Para más señales ver [os/signal](/os-signal).

---
