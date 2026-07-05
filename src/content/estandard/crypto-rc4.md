# crypto/rc4 — RC4 (stream cipher)

⚠️ RC4 está **criptográficamente roto**. Solo para compatibilidad.

```go
import "crypto/rc4"
```

---

```go
key := []byte("clave")
c, _ := rc4.NewCipher(key)

encrypted := make([]byte, len(plaintext))
c.XORKeyStream(encrypted, plaintext)
```

---

[← Volver al índice](/indice)
