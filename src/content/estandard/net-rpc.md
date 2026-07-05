# net/rpc — RPC (Remote Procedure Call)

RPC binario de Go (Go-to-Go). Usa el paquete `encoding/gob`.

```go
import "net/rpc"
```

---

## Servicio (servidor)

```go
type Arith struct{}

type Args struct{ A, B int }

func (a *Arith) Multiply(args *Args, reply *int) error {
    *reply = args.A * args.B
    return nil
}

arith := new(Arith)
rpc.Register(arith)

listener, _ := net.Listen("tcp", ":1234")
for {
    conn, _ := listener.Accept()
    go rpc.ServeConn(conn)
}
```

## Cliente

```go
client, _ := rpc.Dial("tcp", "localhost:1234")

var reply int
client.Call("Arith.Multiply", &Args{5, 3}, &reply)
fmt.Println(reply)  // 15
```

---

[← Volver al índice](/indice)
