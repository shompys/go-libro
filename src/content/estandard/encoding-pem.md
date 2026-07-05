# encoding/pem — Formato PEM (Privacy Enhanced Mail)

Formato de codificación en texto para claves criptográficas, certificados, CSRs, etc. Usa cabeceras `-----BEGIN ...-----` y `-----END ...-----`.

```go
import "encoding/pem"
```

---

## Índice

- [Formato PEM](/estandard/encoding-pem#formato-pem)
- [Codificar (Encode)](/estandard/encoding-pem#codificar-encode)
- [Decodificar (Decode)](/estandard/encoding-pem#decodificar-decode)
- [Ejemplo con RSA](/estandard/encoding-pem#ejemplo-con-rsa)

---

## Formato PEM

Un bloque PEM se ve así:

```
-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQC... (base64)
-----END RSA PRIVATE KEY-----
```

Representado por la struct `Block`:

```go
type Block struct {
    Type    string            // "RSA PRIVATE KEY", "CERTIFICATE", etc.
    Headers map[string]string // Cabeceras opcionales
    Bytes   []byte            // Datos decodificados (DER)
}
```

---

## Codificar (Encode)

```go
block := &pem.Block{
    Type:  "PRUEBA",
    Bytes: []byte("datos secretos"),
}

var buf bytes.Buffer
pem.Encode(&buf, block)
// Salida:
// -----BEGIN PRUEBA-----
// ZGF0b3Mgc2VjcmV0b3M=
// -----END PRUEBA-----
```

| Función | Descripción |
|---------|------------|
| `Encode(out io.Writer, b *Block) error` | Escribe un bloque PEM a `out` |

---

## Decodificar (Decode)

```go
input := []byte(`-----BEGIN PRUEBA-----
ZGF0b3Mgc2VjcmV0b3M=
-----END PRUEBA-----`)

block, rest := pem.Decode(input)
// block.Type  = "PRUEBA"
// block.Bytes = []byte("datos secretos")
// rest        = []byte (lo que sobra después del bloque)
```

| Función | Descripción |
|---------|------------|
| `Decode(data []byte) (p *Block, rest []byte)` | Decodifica el primer bloque PEM, devuelve el bloque y los bytes restantes |

> **Importante:** `Decode` solo devuelve **un** bloque. Si hay varios (ej. certificado + clave en un archivo `.pem`), llamá a `Decode` repetidamente hasta que devuelva `nil`.

```go
data := leerTodo("cert.pem")
for {
    block, data = pem.Decode(data)
    if block == nil {
        break
    }
    procesar(block)
}
```

---

## Ejemplo con RSA

Leer una clave privada RSA desde un archivo `.pem`:

```go
import (
    "crypto/rsa"
    "crypto/x509"
    "encoding/pem"
    "os"
)

func cargarClavePrivada(path string) (*rsa.PrivateKey, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, err
    }

    block, _ := pem.Decode(data)
    if block == nil {
        return nil, fmt.Errorf("no se encontró bloque PEM")
    }

    // El contenido del bloque es DER, se parsea con x509
    return x509.ParsePKCS1PrivateKey(block.Bytes)
}
```

Flujo típico con certificados:

```
Archivo .crt/.pem → pem.Decode → bloque.Bytes (DER) → x509.ParseCertificate
Archivo .key/.pem  → pem.Decode → bloque.Bytes (DER) → x509.ParsePKCS1PrivateKey
```

---

[← Volver al índice](/indice)
