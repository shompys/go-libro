# net/netip

Tipos inmutables y eficientes para direcciones IP y prefijos. Disponible desde Go 1.18. Alternativa moderna a `net.IP`.

```go
import "net/netip"
```

---

## Tipo Addr

Representa una dirección IP (IPv4 o IPv6). Es un tipo valor (inmutable, comparable con `==`).

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `Is4()` | `bool` | ¿Es IPv4? |
| `Is6()` | `bool` | ¿Es IPv6? |
| `IsUnspecified()` | `bool` | ¿Es `::` o `0.0.0.0`? |
| `IsLoopback()` | `bool` | ¿Es loopback? |
| `IsMulticast()` | `bool` | ¿Es multicast? |
| `IsLinkLocalUnicast()` | `bool` | ¿Es link-local unicast? |
| `IsPrivate()` | `bool` | ¿Es dirección privada? |
| `IsGlobalUnicast()` | `bool` | ¿Es global unicast? |
| `IsInterfaceLocalMulticast()` | `bool` | ¿Es multicast de interfaz local? |
| `IsLinkLocalMulticast()` | `bool` | ¿Es multicast link-local? |
| `Unmap()` | `Addr` | Devuelve IPv4 sin el prefijo IPv4-in-IPv6 |
| `String()` | `string` | Representación canónica |
| `Next()` | `Addr` | Siguiente dirección |
| `Prev()` | `Addr` | Dirección anterior |
| `Zone()` | `string` | Zona (solo IPv6 link-local) |

### Funciones sobre Addr

```go
func AddrFrom4(addr [4]byte) Addr
func AddrFrom16(addr [16]byte) Addr
func AddrFromSlice(slice []byte) (Addr, bool)
func ParseAddr(s string) (Addr, error)
func MustParseAddr(s string) Addr
```

| Función | Descripción |
|---------|-------------|
| `AddrFrom4` | Crea `Addr` desde array de 4 bytes |
| `AddrFrom16` | Crea `Addr` desde array de 16 bytes |
| `AddrFromSlice` | Crea `Addr` desde slice de bytes |
| `ParseAddr` | Parsea una cadena como dirección IP |
| `MustParseAddr` | Igual que `ParseAddr` pero hace panic en error |

### Constantes útiles

```go
// IPv4
var IPv4Unspecified = AddrFrom4([4]byte{0, 0, 0, 0})

// IPv6
var IPv6Unspecified = AddrFrom16([16]byte{0: 0xff, 1: 0xff, 2: 0xff, ...})
var IPv6Loopback   = AddrFrom16([16]byte{15: 1})
```

---

## Tipo AddrPort

Combina una dirección IP y un puerto.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| addr | `Addr` | Dirección IP |
| port | `uint16` | Número de puerto |

```go
func AddrPortFrom(ip Addr, port uint16) AddrPort
func ParseAddrPort(s string) (AddrPort, error)
func MustParseAddrPort(s string) AddrPort
```

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `Addr()` | `Addr` | Dirección IP |
| `Port()` | `uint16` | Puerto |
| `String()` | `string` | Formato `ip:port` o `[ip]:port` para IPv6 |

---

## Tipo Prefix

Representa un prefijo CIDR (dirección IP + cantidad de bits de máscara).

```go
func PrefixFrom(ip Addr, bits int) Prefix
func ParsePrefix(s string) (Prefix, error)
func MustParsePrefix(s string) Prefix
```

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `Addr()` | `Addr` | Dirección de red del prefijo |
| `Bits()` | `int` | Bits de la máscara |
| `Contains(ip Addr)` | `bool` | ¿Contiene esta IP? |
| `Overlaps(p Prefix)` | `bool` | ¿Se solapa con otro prefijo? |
| `IsValid()` | `bool` | ¿Es un prefijo válido? |
| `Masked()` | `Prefix` | Prefijo con la parte de host enmascarada |
| `String()` | `string` | Formato CIDR (`192.168.1.0/24`) |

---

## Ejemplos

### Parsear y validar IP

```go
package main

import (
	"fmt"
	"net/netip"
)

func main() {
	ip, err := netip.ParseAddr("192.168.1.1")
	if err != nil {
		panic(err)
	}

	fmt.Println("IPv4:", ip.Is4())       // true
	fmt.Println("IPv6:", ip.Is6())       // false
	fmt.Println("Private:", ip.IsPrivate()) // true
	fmt.Println("Next:", ip.Next())      // 192.168.1.2
}
```

### Trabajar con prefijos CIDR

```go
prefix := netip.MustParsePrefix("10.0.0.0/8")

	fmt.Println(prefix.Bits())                    // 8
	fmt.Println(prefix.Addr())                    // 10.0.0.0
	fmt.Println(prefix.Contains(netip.MustParseAddr("10.1.2.3")))  // true
	fmt.Println(prefix.Contains(netip.MustParseAddr("192.168.1.1"))) // false

	// ¿Se solapan?
	p1 := netip.MustParsePrefix("192.168.0.0/16")
	p2 := netip.MustParsePrefix("192.168.1.0/24")
	fmt.Println(p1.Overlaps(p2)) // true
```

### AddrPort

```go
ap := netip.MustParseAddrPort("192.168.1.1:8080")
fmt.Println(ap.Addr()) // 192.168.1.1
fmt.Println(ap.Port()) // 8080

ap6 := netip.MustParseAddrPort("[::1]:443")
fmt.Println(ap6.String()) // [::1]:443
```

---

[← Volver al índice](/indice)
