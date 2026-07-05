# net — Redes (TCP, UDP, IP, DNS)

Operaciones de red de bajo nivel. Para HTTP, ver [net/http](/net-http).

```go
import "net"
```

---

## Índice

- [Resolver DNS](/estandard/net#resolver-dns)
- [Conexión TCP](/estandard/net#conexión-tcp-cliente)
- [Servidor TCP](/estandard/net#servidor-tcp)
- [Conexión UDP](/estandard/net#conexión-udp)
- [Servidor UDP](/estandard/net#servidor-udp)
- [Dialer y ListenConfig](/estandard/net#dialer-y-listenconfig)
- [DialTCP, DialUDP, DialUnix](/estandard/net#dial-específicos)
- [ListenTCP, ListenUDP, ListenUnix](/estandard/net#listen-específicos)
- [Pipe, FileConn, FileListener, FilePacketConn](/estandard/net#pipe-y-fileconn)
- [Direcciones, IPs, puertos](/estandard/net#direcciones-y-puertos)
- [IP, IPMask, IPv4, CIDR](/estandard/net#tipos-ip,-ipmask,-cidr)
- [TCPAddr, UDPAddr, UnixAddr](/estandard/net#tipos-de-direcciones)
- [Interfaces](/estandard/net#interfaces-de-red)
- [Resolver IP, TCP, UDP, Unix](/estandard/net#resolver-funciones)

---

## Resolver DNS

```go
ips, _ := net.LookupIP("google.com")     // []net.IP
cname, _ := net.LookupCNAME("www.github.com")
addrs, _ := net.LookupHost("google.com")  // []string
```

---

## Conexión TCP (cliente)

```go
conn, err := net.Dial("tcp", "example.com:80")
if err != nil { log.Fatal(err) }
defer conn.Close()

fmt.Fprintf(conn, "GET / HTTP/1.0\r\n\r\n")
bufio.NewScanner(conn).Scan()
```

| Función | Qué hace |
|---------|----------|
| `net.Dial(network, address)` | Conecta a una dirección |
| `net.DialTimeout(network, address, timeout)` | Conecta con timeout |

---

## Servidor TCP

```go
ln, _ := net.Listen("tcp", ":8080")
for {
    conn, _ := ln.Accept()
    go manejar(conn)
}

func manejar(conn net.Conn) {
    defer conn.Close()
    io.Copy(conn, conn) // echo server
}
```

| Método | Qué hace |
|--------|----------|
| `Listen(network, address)` | Crea un listener en un puerto |
| `Accept()` | Espera una conexión entrante |
| `Close()` | Cierra el listener o conexión |

---

## Conexión UDP

```go
conn, _ := net.Dial("udp", "example.com:1234")
conn.Write([]byte("ping"))
```

---

## Servidor UDP

```go
// Servidor UDP:
pc, _ := net.ListenPacket("udp", ":1234")
buf := make([]byte, 1024)
n, addr, _ := pc.ReadFrom(buf)
```

---

## Dialer y ListenConfig

### Dialer

Control fino sobre cómo se establecen conexiones salientes:

```go
dialer := &net.Dialer{
    Timeout:   5 * time.Second,
    Deadline:  time.Now().Add(10 * time.Second),
    LocalAddr: &net.TCPAddr{Port: 0}, // puerto local específico
    KeepAlive: 30 * time.Second,
    Control:   func(network, address string, c syscall.RawConn) error {
        // configurar opciones de socket (SO_REUSEADDR, etc.)
        return nil
    },
}

conn, err := dialer.Dial("tcp", "example.com:80")
```

| Campo de Dialer | Descripción |
|-----------------|-------------|
| `Timeout` | Timeout máximo por intento de conexión |
| `Deadline` | Deadline absoluto para la conexión |
| `LocalAddr` | Dirección local a usar |
| `KeepAlive` | Intervalo de keep-alive TCP |
| `Control` | Callback antes de la conexión (configurar socket) |
| `FallbackDelay` | Tiempo antes de probar alternativas (DualStack) |

### ListenConfig

Control fino sobre listeners:

```go
lc := &net.ListenConfig{
    Control:   func(network, address string, c syscall.RawConn) error { return nil },
    KeepAlive: 30 * time.Second,
}

ln, err := lc.Listen(context.Background(), "tcp", ":8080")
pc, err := lc.ListenPacket(context.Background(), "udp", ":1234")
```

---

## Dial específicos

Funciones tipadas que evitan el string de network y devuelven el tipo concreto:

```go
// TCP
tcpConn, err := net.DialTCP("tcp", nil, &net.TCPAddr{IP: net.IPv4(127, 0, 0, 1), Port: 8080})

// UDP
udpConn, err := net.DialUDP("udp", nil, &net.UDPAddr{IP: net.IPv4(127, 0, 0, 1), Port: 53})

// Unix (sockets locales)
unixConn, err := net.DialUnix("unix", nil, &net.UnixAddr{Name: "/tmp/mi.sock", Net: "unix"})
```

---

## Listen específicos

```go
// TCP
ln, err := net.ListenTCP("tcp", &net.TCPAddr{Port: 8080})

// UDP
pc, err := net.ListenUDP("udp", &net.UDPAddr{Port: 8080})

// Unix
ln, err := net.ListenUnix("unix", &net.UnixAddr{Name: "/tmp/mi.sock", Net: "unix"})
```

---

## Pipe y FileConn

### Pipe

Crea dos conexiones sincrónicas en memoria (útil para tests):

```go
client, server := net.Pipe()
go func() {
    client.Write([]byte("hola"))
    client.Close()
}()
io.Copy(os.Stdout, server) // "hola"
```

### FileConn, FileListener, FilePacketConn

Convierte un `*os.File` en conexión de red (para pasar descriptores entre procesos):

```go
// Desde un file descriptor
conn, err := net.FileConn(f)
ln, err := net.FileListener(f)
pc, err := net.FilePacketConn(f)
```

---

## Direcciones y puertos

```go
// Parsear direcciones
ip := net.ParseIP("192.168.1.1")      // net.IP
ip = net.ParseIP("::1")               // IPv6

// Split host y puerto
host, port, _ := net.SplitHostPort("localhost:8080") // "localhost", "8080"
hostPort := net.JoinHostPort("localhost", "8080")    // "localhost:8080"

// Interfaces de red locales
interfaces, _ := net.Interfaces()

// Direcciones de una interfaz
addrs, _ := net.InterfaceAddrs()
for _, addr := range addrs {
    fmt.Println(addr.Network(), addr.String())
}
```

---

## Tipos IP, IPMask, CIDR

### IP type y métodos

```go
type IP []byte

// Métodos:
ip.IsLoopback()              // 127.0.0.1, ::1
ip.IsPrivate()               // redes privadas
ip.IsMulticast()
ip.IsInterfaceLocalMulticast()
ip.IsLinkLocalMulticast()
ip.IsLinkLocalUnicast()
ip.IsGlobalUnicast()
ip.IsUnspecified()           // 0.0.0.0, ::
ip.DefaultMask()             // máscara por defecto
ip.To4()                     // convierte a IPv4 (nil si es IPv6)
ip.To16()                    // convierte a 16 bytes
ip.Mask(mask)                // aplica máscara
ip.Equal(other)              // compara IPs
ip.String()                  // representación textual
```

### IPv4, IPv4Mask, constantes

```go
const (
    IPv4len = 4  // longitud de IP IPv4
    IPv6len = 16 // longitud de IP IPv6
)

ip := net.IPv4(192, 168, 1, 1)                          // crea IP IPv4
mask := net.IPv4Mask(255, 255, 255, 0)                  // crea máscara IPv4
```

### IPMask

```go
type IPMask []byte

mask.Size()       // bits de máscara (ej: 24)
mask.String()     // "ffffff00"
```

### CIDR

```go
// Parsear CIDR
ip, network, err := net.ParseCIDR("192.168.1.0/24")
fmt.Println(network.IP)    // 192.168.1.0
fmt.Println(network.Mask)  // ffffff00
fmt.Println(network.Contains(net.ParseIP("192.168.1.50"))) // true
fmt.Println(network.Network()) // "ip+net"

// Crear máscara desde cantidad de bits
mask := net.CIDRMask(24, 32) // /24 para IPv4
mask = net.CIDRMask(64, 128) // /64 para IPv6
```

---

## Tipos de direcciones

### TCPAddr

```go
type TCPAddr struct {
    IP   IP
    Port int
    Zone string // zona IPv6
}

// Parsear
addr, _ := net.ResolveTCPAddr("tcp", "localhost:8080")

// Métodos
addr.Network()  // "tcp"
addr.String()   // "127.0.0.1:8080"
```

### UDPAddr

```go
type UDPAddr struct {
    IP   IP
    Port int
    Zone string
}

addr, _ := net.ResolveUDPAddr("udp", "localhost:53")
```

### UnixAddr

```go
type UnixAddr struct {
    Name string // ruta al socket
    Net  string // "unix", "unixgram", "unixpacket"
}

addr, _ := net.ResolveUnixAddr("unix", "/tmp/mi.sock")
```

---

## Resolver funciones

Además de `LookupIP` y `LookupHost`, existen versiones que devuelven tipos concretos:

```go
// Resolver direcciones (con tipo concreto)
ipAddrs, _ := net.ResolveIPAddr("ip", "google.com")
tcpAddr, _ := net.ResolveTCPAddr("tcp", "google.com:80")
udpAddr, _ := net.ResolveUDPAddr("udp", "google.com:53")
unixAddr, _ := net.ResolveUnixAddr("unix", "/tmp/mi.sock")
```

---

[← Volver al índice](/indice)
