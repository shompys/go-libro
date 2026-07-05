# crypto/hmac — Hash-based Message Authentication Code

Autenticación de mensajes con clave secreta usando funciones hash (RFC 2104). Garantiza integridad y autenticidad.

```go
import "crypto/hmac"
```

---

## Índice

- [Generar HMAC](/estandard/crypto-hmac#generar-hmac)
- [Verificar HMAC (Equal)](/estandard/crypto-hmac#verificar-hmac-comparación-segura)
- [Funciones hash compatibles](/estandard/crypto-hmac#funciones-hash-compatibles)
- [Ejemplo: autenticar un mensaje](/estandard/crypto-hmac#ejemplo:-autenticar-un-mensaje)

---

## Generar HMAC

```go
clave := []byte("secreto-compartido")
mensaje := []byte("datos importantes")

mac := hmac.New(sha256.New, clave)
mac.Write(mensaje)
firma := mac.Sum(nil) // []byte con el HMAC

fmt.Printf("%x\n", firma)
```

| Función | Descripción |
|---------|-------------|
| `hmac.New(h func() hash.Hash, key []byte)` | Crea un HMAC con la función hash `h` |
| `mac.Write(data)` | Agrega datos al HMAC |
| `mac.Sum(b []byte)` | Devuelve el HMAC final (añadido a `b`) |

### También disponible como `hmac.Equal` (ver abajo).

---

## Verificar HMAC (comparación segura)

```go
// NO usar == para comparar HMACs (timing attack)
esValido := hmac.Equal(firmaRecibida, firmaEsperada)
```

| Función | Descripción |
|---------|-------------|
| `hmac.Equal(mac1, mac2 []byte) bool` | Comparación en tiempo constante (anti timing attacks) |

**Por qué `hmac.Equal`**: Un atacante puede medir el tiempo que tarda `==` en comparar byte por byte y deducir el HMAC correcto. `hmac.Equal` tarda lo mismo sin importar cuántos bytes coincidan.

---

## Funciones hash compatibles

Cualquier función que implemente `hash.Hash` puede usarse:

```go
hmac.New(sha256.New, clave)   // HMAC-SHA256 (recomendado)
hmac.New(sha1.New, clave)     // HMAC-SHA1 (obsoleto)
hmac.New(sha512.New, clave)   // HMAC-SHA512
hmac.New(md5.New, clave)      // HMAC-MD5 (no recomendado)
```

---

## Ejemplo: autenticar un mensaje

```go
func firmar(mensaje, clave []byte) []byte {
    mac := hmac.New(sha256.New, clave)
    mac.Write(mensaje)
    return mac.Sum(nil)
}

func verificar(mensaje, firma, clave []byte) bool {
    esperada := firmar(mensaje, clave)
    return hmac.Equal(firma, esperada)
}
```

---

[← Volver al índice](/indice)
