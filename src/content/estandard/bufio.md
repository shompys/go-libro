# bufio — Entrada/Salida con buffer

Agrega buffering a `io.Reader` y `io.Writer`. Acelera la lectura/escritura porque reduce la cantidad de llamadas al sistema leyendo/escribiendo de a bloques.

```go
import "bufio"
```

---

## Índice

- [Reader](/estandard/bufio#reader-lectura-con-buffer)
- [Scanner](/estandard/bufio#scanner-leer-línea-por-línea)
- [Splitter personalizado](/estandard/bufio#splitter-personalizado)
- [Buffer del Scanner](/estandard/bufio#buffer-del-scanner)
- [Constantes](/estandard/bufio#constantes)
- [Writer](/estandard/bufio#writer-escritura-con-buffer)

---

## Reader (lectura con buffer)

Envuelve un `io.Reader` y le agrega buffer:

```go
f, _ := os.Open("archivo.txt")
r := bufio.NewReader(f)

linea, _ := r.ReadString('\n')  // lee hasta el salto de línea
```

| Método | Devuelve |
|--------|----------|
| `ReadString(delim)` | String hasta encontrar el delimitador (`'\n'`) |
| `ReadBytes(delim)` | `[]byte` hasta encontrar el delimitador |
| `ReadLine()` | Una línea (sin `\n`). **Deprecado**, usá Scanner |
| `Read(p)` | Lee bytes (implementa `io.Reader`) |
| `ReadRune()` | Lee un solo rune (con su tamaño en bytes) |
| `Peek(n)` | Mira los próximos `n` bytes sin consumirlos |
| `ReadSlice(delim)` | Como `ReadBytes` pero devuelve referencia interna (más rápido, no copia) |
| `UnreadRune()` | "Devuelve" el último rune leído |
| `UnreadByte()` | "Devuelve" el último byte leído |
| `Reset(r io.Reader)` | Reinicia el Reader con un nuevo `io.Reader` subyacente |
| `Buffered() int` | Cantidad de bytes disponibles en el buffer interno |
| `Size() int` | Tamaño del buffer subyacente |

```go
f, _ := os.Open("config.txt")
r := bufio.NewReader(f)

for {
    linea, err := r.ReadString('\n')
    if err == io.EOF {
        break
    }
    fmt.Print(linea)
}
```

---

## Scanner (leer línea por línea)

**La forma más simple y recomendada** de leer línea por línea:

```go
f, _ := os.Open("archivo.txt")
scanner := bufio.NewScanner(f)

for scanner.Scan() {
    linea := scanner.Text()
    fmt.Println(linea)
}

if err := scanner.Err(); err != nil {
    log.Fatal(err)
}
```

| Método | Qué hace |
|--------|----------|
| `Scan()` | Avanza a la siguiente línea. Devuelve `false` al terminar |
| `Text()` | Devuelve la línea actual como string |
| `Bytes()` | Devuelve la línea actual como `[]byte` |
| `Err()` | Devuelve el error (si hubo) al terminar |

### Dividir por palabras o bytes

Por defecto, `Scanner` lee línea por línea. Podés cambiar el splitter con `Scanner.Split`:

```go
scanner.Split(bufio.ScanWords)  // token por token (palabras)
scanner.Split(bufio.ScanRunes)  // rune por rune
scanner.Split(bufio.ScanBytes)  // byte por byte
```

### Splitter personalizado

`Scanner.Split(fn)` acepta una función con firma `func(data []byte, atEOF bool) (advance int, token []byte, err error)`:

```go
scanner.Split(func(data []byte, atEOF bool) (advance int, token []byte, err error) {
    for i := 0; i < len(data); i++ {
        if data[i] == ' ' {
            return i + 1, data[:i], nil
        }
    }
    if atEOF && len(data) > 0 {
        return len(data), data, nil
    }
    return 0, nil, nil // necesita más datos
})
```

### Buffer del Scanner

Por defecto el token máximo es `MaxScanTokenSize` (64 KB). Para tokens más grandes, usá `Scanner.Buffer`:

```go
scanner := bufio.NewScanner(f)
buf := make([]byte, 0, 1*1024*1024) // 1 MB inicial
scanner.Buffer(buf, 10*1024*1024)   // máximo 10 MB
```

| Método | Descripción |
|--------|-------------|
| `Split(fn SplitFunc)` | Define la función de corte de tokens |
| `Buffer(buf []byte, max int)` | Define el buffer interno del scanner. `max` es el tamaño máximo de token |

### Constantes

| Constante | Valor | Descripción |
|-----------|-------|-------------|
| `MaxScanTokenSize` | `64 * 1024` (64 KB) | Tamaño máximo de token por defecto |

---

## Writer (escritura con buffer)

Envuelve un `io.Writer` y acumula escrituras antes de enviarlas. Hay que hacer `Flush()` para vaciar el buffer:

```go
f, _ := os.Create("salida.txt")
w := bufio.NewWriter(f)

w.WriteString("Hola ")
w.WriteString("mundo")
w.Flush()  // sin esto, los datos pueden no escribirse
```

| Método | Qué hace |
|--------|----------|
| `WriteString(s)` | Escribe un string |
| `Write(p)` | Escribe bytes (implementa `io.Writer`) |
| `WriteByte(b)` | Escribe un byte |
| `WriteRune(r)` | Escribe un rune |
| `Flush()` | Vacía el buffer (fuerza escritura) |
| `Available()` | Cuántos bytes quedan disponibles en el buffer |
| `Buffered()` | Cuántos bytes hay acumulados sin escribir |

---

[← Volver al índice](/indice)
