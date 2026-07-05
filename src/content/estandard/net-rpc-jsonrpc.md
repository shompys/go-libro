# net/rpc/jsonrpc — RPC sobre JSON

Igual que [net/rpc](/net-rpc) pero serializa con JSON en vez de gob.

```go
import "net/rpc"
import "net/rpc/jsonrpc"
```

---

```go
// Servidor: usa jsonrpc.NewServerCodec
conn := ...
rpc.ServeCodec(jsonrpc.NewServerCodec(conn))

// Cliente:
client, _ := jsonrpc.Dial("tcp", "localhost:1234")
client.Call("Arith.Multiply", &Args{5, 3}, &reply)
```

---

[← Volver al índice](/indice)
