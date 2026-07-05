# crypto/md5 — Hash MD5

⚠️ MD5 es **criptográficamente roto**. No usar para seguridad. Solo útil para checksums no críticos.

```go
import "crypto/md5"
```

---

## Hash de un string

```go
data := []byte("mensaje")
hash := md5.Sum(data)
fmt.Printf("%x\n", hash)
```

`Sum` devuelve un array fijo `[16]byte`.

---

## Hash en streaming

```go
h := md5.New()
h.Write([]byte("parte 1 "))
h.Write([]byte("parte 2"))
hash := h.Sum(nil)
```

---

[← Volver al índice](/indice)
