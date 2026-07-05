# crypto/aes — Cifrado AES (Advanced Encryption Standard)

Implementa el cifrado de bloque AES (FIPS 197). Para usarlo en modos reales (GCM, CBC) combinarlo con [crypto/cipher](/crypto-cipher).

```go
import "crypto/aes"
```

---

## Crear cipher AES

```go
clave := []byte("clave-de-16bytes") // 16 bytes = AES-128
block, err := aes.NewCipher(clave)

// Tamaños de clave válidos:
// 16 bytes → AES-128
// 24 bytes → AES-192
// 32 bytes → AES-256
```

| Función | Descripción |
|---------|-------------|
| `aes.NewCipher(key []byte)` | Crea un `cipher.Block` AES con la clave dada |

---

## Encriptar con AES-GCM (recomendado)

```go
block, _ := aes.NewCipher(clave)
aesGCM, _ := cipher.NewGCM(block)

nonce := make([]byte, aesGCM.NonceSize())
rand.Read(nonce) // nonce debe ser único por clave

textoPlano := []byte("mensaje secreto")
cifrado := aesGCM.Seal(nonce, nonce, textoPlano, nil)
// cifrado = nonce || ciphertext || tag
```

---

## Desencriptar con AES-GCM

```go
nonceSize := aesGCM.NonceSize()
nonce, ciphertext := cifrado[:nonceSize], cifrado[nonceSize:]

textoPlano, err := aesGCM.Open(nil, nonce, ciphertext, nil)
// err != nil si el texto fue manipulado
```

---

## Encriptar con AES-CBC

```go
block, _ := aes.NewCipher(clave)
iv := make([]byte, aes.BlockSize) // 16 bytes
rand.Read(iv)

textoPlano := []byte("mensaje de prueba")
// PKCS#7 padding manual si el texto no es múltiplo del bloque
textoPlano = padPKCS7(textoPlano, aes.BlockSize)

modo := cipher.NewCBCEncrypter(block, iv)
cifrado := make([]byte, len(textoPlano))
modo.CryptBlocks(cifrado, textoPlano)
// cifrado = datos encriptados, iv debe guardarse aparte
```

---

## Constantes

```go
aes.BlockSize // 16 (tamaño del bloque AES en bytes, siempre 128 bits)
```

---

## Tamaños de clave

| Algoritmo | Bytes de clave | Funciones de ronda |
|-----------|---------------|--------------------|
| AES-128 | 16 | 10 |
| AES-192 | 24 | 12 |
| AES-256 | 32 | 14 |

---

[← Volver al índice](/indice)
