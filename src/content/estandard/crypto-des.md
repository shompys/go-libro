# crypto/des — DES y TripleDES

⚠️ DES está obsoleto criptográficamente (llave de 56 bits). Usá TripleDES solo para compatibilidad.

```go
import "crypto/des"
```

---

## DES

```go
key := []byte("8bytes!!")  // exactamente 8 bytes
block, _ := des.NewCipher(key)
```

## TripleDES (3DES)

```go
key := []byte("123456789012345678901234")  // 24 bytes
block, _ := des.NewTripleDESCipher(key)
```

## Usar con cipher (GCM, CBC, etc.)

Se usa igual que AES (ver [crypto/cipher](/crypto-cipher)):

```go
block, _ := des.NewTripleDESCipher(key)
gcm, _ := cipher.NewGCM(block)
encrypted := gcm.Seal(nil, nonce, plaintext, nil)
```

---

[← Volver al índice](/indice)
