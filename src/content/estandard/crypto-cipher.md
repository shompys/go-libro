# crypto/cipher — Interfaces y modos de cifrado

Define interfaces estándar (`Block`, `Stream`, `AEAD`) e implementa modos de operación (GCM, CBC, CTR, OFB, CFB).

```go
import "crypto/cipher"
```

---

## Interface Block

```go
type Block interface {
    BlockSize() int
    Encrypt(dst, src []byte)
    Decrypt(dst, src []byte)
}
```

Usar junto con [crypto/aes](/crypto-aes):

```go
block, _ := aes.NewCipher(clave)
tam := block.BlockSize() // 16 bytes
```

---

## AEAD — GCM (recomendado)

Autentica y cifra en un solo paso. Resistente a manipulación.

```go
block, _ := aes.NewCipher(clave)
gcm, _ := cipher.NewGCM(block)

nonce := make([]byte, gcm.NonceSize()) // 12 bytes para GCM
rand.Read(nonce)

// Encriptar
cifrado := gcm.Seal(nonce, nonce, textoPlano, nil)

// Desencriptar
texto, err := gcm.Open(nil, nonce, cifrado[nonceSize:], nil)
```

```go
// Nonce de tamaño personalizado (poco común)
gcm, _ := cipher.NewGCMWithNonceSize(block, 8)

// Tag de tamaño personalizado
gcm, _ := cipher.NewGCMWithTagSize(block, 12)
```

| Función | Descripción |
|---------|-------------|
| `cipher.NewGCM(block)` | Crea AEAD GCM con nonce de 12 bytes y tag de 16 bytes |
| `cipher.NewGCMWithNonceSize(block, size)` | GCM con tamaño de nonce personalizado |
| `cipher.NewGCMWithTagSize(block, size)` | GCM con tamaño de tag personalizado |

| Método AEAD | Descripción |
|-------------|-------------|
| `Seal(dst, nonce, plaintext, additionalData)` | Encripta + autentica |
| `Open(dst, nonce, ciphertext, additionalData)` | Desencripta + verifica |
| `NonceSize()` | Tamaño del nonce requerido |
| `Overhead()` | Bytes extra que agrega (tag) |

---

## CBC — Cipher Block Chaining

Requiere padding manual (PKCS#7).

```go
block, _ := aes.NewCipher(clave)
iv := make([]byte, block.BlockSize())
rand.Read(iv)

// Encriptar
enc := cipher.NewCBCEncrypter(block, iv)
cifrado := make([]byte, len(planoConPadding))
enc.CryptBlocks(cifrado, planoConPadding)

// Desencriptar
dec := cipher.NewCBCDecrypter(block, iv)
texto := make([]byte, len(cifrado))
dec.CryptBlocks(texto, cifrado)
```

| Función | Descripción |
|---------|-------------|
| `cipher.NewCBCEncrypter(b Block, iv []byte)` | Modo CBC para encriptar |
| `cipher.NewCBCDecrypter(b Block, iv []byte)` | Modo CBC para desencriptar |

---

## CTR — Modo Contador

Convierte un Block cipher en Stream cipher. No requiere padding.

```go
block, _ := aes.NewCipher(clave)
iv := make([]byte, block.BlockSize())
rand.Read(iv)

stream := cipher.NewCTR(block, iv)
cifrado := make([]byte, len(textoPlano))
stream.XORKeyStream(cifrado, textoPlano)

// Desencriptar es igual: XOR de nuevo con el mismo keystream
stream2 := cipher.NewCTR(block, iv)
desencriptado := make([]byte, len(cifrado))
stream2.XORKeyStream(desencriptado, cifrado)
```

---

## Stream — Lectura/Escritura

```go
// StreamWriter
sw := &cipher.StreamWriter{S: stream, W: writer}
sw.Write(datos)

// StreamReader
sr := &cipher.StreamReader{S: stream, R: reader}
datos, _ := io.ReadAll(sr)
```

---

## CFB y OFB

```go
// CFB Encrypt
stream := cipher.NewCFBEncrypter(block, iv)
cifrado := make([]byte, len(textoPlano))
stream.XORKeyStream(cifrado, textoPlano)

// CFB Decrypt
stream := cipher.NewCFBDecrypter(block, iv)
texto := make([]byte, len(cifrado))
stream.XORKeyStream(texto, cifrado)

// OFB
stream := cipher.NewOFB(block, iv)
// mismo XOR para encriptar/desencriptar
```

| Función | Descripción |
|---------|-------------|
| `cipher.NewCFBEncrypter(b Block, iv []byte)` | Stream cipher en modo CFB |
| `cipher.NewCFBDecrypter(b Block, iv []byte)` | Descifrado CFB |
| `cipher.NewOFB(b Block, iv []byte)` | Stream cipher en modo OFB |
| `cipher.NewCTR(b Block, iv []byte)` | Stream cipher en modo CTR |

---

## Comparación de modos

| Modo | Autenticado | Padding | Paralelizable | Recomendación |
|------|-------------|---------|---------------|---------------|
| GCM | Sí | No | Sí (encriptar) | **Usar por defecto** |
| CBC | No | Sí (PKCS#7) | No | Legacy |
| CTR | No | No | Sí | Streaming de datos |
| CFB | No | No | No | Legacy |
| OFB | No | No | No | Poco usado |

---

[← Volver al índice](/indice)
