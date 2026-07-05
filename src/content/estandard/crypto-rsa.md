# crypto/rsa — Cifrado y firmas RSA

Criptografía asimétrica RSA. Para datos grandes, RSA cifra una clave simétrica y luego se usa AES.

```go
import "crypto/rsa"
```

---

## Generar clave

```go
clavePrivada, _ := rsa.GenerateKey(rand.Reader, 2048)
// clavePrivada *rsa.PrivateKey
// clavePrivada.PublicKey  → *rsa.PublicKey

// Tamaños mínimos recomendados: 2048 (2024), 3072 (2030+)
```

| Función | Descripción |
|---------|-------------|
| `rsa.GenerateKey(random io.Reader, bits int)` | Genera un par de claves RSA |
| `rsa.GenerateMultiPrimeKey(random io.Reader, nprimes, bits int)` | Clave multiprimo (más rápida, rara) |

---

## Cifrar (OAEP — recomendado)

```go
textoPlano := []byte("mensaje secreto")
cifrado, err := rsa.EncryptOAEP(
    sha256.New(),
    rand.Reader,
    &clavePrivada.PublicKey,
    textoPlano,
    nil, // label (opcional, normalmente nil)
)
```

```go
textoPlano, err := rsa.DecryptOAEP(
    sha256.New(),
    rand.Reader,
    clavePrivada,
    cifrado,
    nil, // label
)
```

| Función | Descripción |
|---------|-------------|
| `rsa.EncryptOAEP(hash hash.Hash, random io.Reader, pub *PublicKey, msg []byte, label []byte)` | Cifra con OAEP |
| `rsa.DecryptOAEP(hash hash.Hash, random io.Reader, priv *PrivateKey, ciphertext []byte, label []byte)` | Descifra con OAEP |

---

## Cifrar (PKCS#1 v1.5 — legacy)

```go
cifrado, err := rsa.EncryptPKCS1v15(rand.Reader, &clavePrivada.PublicKey, textoPlano)
textoPlano, err := rsa.DecryptPKCS1v15(rand.Reader, clavePrivada, cifrado)
```

| Función | Descripción |
|---------|-------------|
| `rsa.EncryptPKCS1v15(random io.Reader, pub *PublicKey, msg []byte)` | Cifra con PKCS#1 v1.5 |
| `rsa.DecryptPKCS1v15(random io.Reader, priv *PrivateKey, ciphertext []byte)` | Descifra PKCS#1 v1.5 |

---

## Firmar (PKCS#1 v1.5)

```go
mensaje := []byte("documento importante")
hashed := sha256.Sum256(mensaje)

firma, err := rsa.SignPKCS1v15(rand.Reader, clavePrivada, crypto.SHA256, hashed[:])
```

```go
err := rsa.VerifyPKCS1v15(&clavePrivada.PublicKey, crypto.SHA256, hashed[:], firma)
if err == nil {
    fmt.Println("Firma válida")
}
```

| Función | Descripción |
|---------|-------------|
| `rsa.SignPKCS1v15(random io.Reader, priv *PrivateKey, hash crypto.Hash, hashed []byte)` | Firma con PKCS#1 v1.5 |
| `rsa.VerifyPKCS1v15(pub *PublicKey, hash crypto.Hash, hashed []byte, sig []byte)` | Verifica firma PKCS#1 v1.5 |

---

## Firmar (PSS — recomendado)

```go
firma, err := rsa.SignPSS(rand.Reader, clavePrivada, crypto.SHA256, hashed[:], &rsa.PSSOptions{
    SaltLength: rsa.PSSSaltLengthAuto,
    Hash:       crypto.SHA256,
})
```

```go
err := rsa.VerifyPSS(&clavePrivada.PublicKey, crypto.SHA256, hashed[:], firma, &rsa.PSSOptions{
    SaltLength: rsa.PSSSaltLengthAuto,
    Hash:       crypto.SHA256,
})
```

| Función | Descripción |
|---------|-------------|
| `rsa.SignPSS(random io.Reader, priv *PrivateKey, hash crypto.Hash, digest []byte, opts *PSSOptions)` | Firma con PSS |
| `rsa.VerifyPSS(pub *PublicKey, hash crypto.Hash, digest []byte, sig []byte, opts *PSSOptions)` | Verifica firma PSS |

---

## Propiedades de la clave

```go
clavePrivada.Size() // tamaño en bytes del módulo (ej: 256 para 2048 bits)
clavePrivada.PublicKey.N // módulo (big.Int)
clavePrivada.PublicKey.E // exponente público
clavePrivada.D // exponente privado (big.Int)

// Validar clave
err := clavePrivada.Validate()
```

---

## Comparativa de métodos

| Método | Cifrado | Firma | Recomendado |
|--------|---------|-------|-------------|
| OAEP | Sí | No | Sí (cifrado) |
| PKCS#1 v1.5 | Sí | Sí | Legacy/retrocompatibilidad |
| PSS | No | Sí | Sí (firmas) |

---

[← Volver al índice](/indice)
