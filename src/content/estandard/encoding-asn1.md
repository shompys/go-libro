# encoding/asn1 — Codificación ASN.1 (Abstract Syntax Notation One)

Codificación binaria estructurada usada en criptografía (X.509, PKCS), SNMP, LDAP y protocolos de telecomunicaciones. Go lo usa internamente en `crypto/x509`.

```go
import "encoding/asn1"
```

---

## Índice

- [Introducción](/estandard/encoding-asn1#introducción)
- [Marshal](/estandard/encoding-asn1#marshal)
- [Unmarshal](/estandard/encoding-asn1#unmarshal)
- [Tags de struct](/estandard/encoding-asn1#tags-de-struct)
- [Tipos ASN.1 comunes](/estandard/encoding-asn1#tipos-asn1-comunes)
- [NullRawValue vs RawValue](/estandard/encoding-asn1#nullrawvalue-vs-rawvalue)
- [Clases de tag](/estandard/encoding-asn1#clases-de-tag)
- [Errores](/estandard/encoding-asn1#errores)

---

## Introducción

ASN.1 es un estándar ITU-T (X.680) para describir estructuras de datos independientes de la máquina. La codificación más usada es **DER** (Distinguished Encoding Rules), que es un subconjunto de BER.

> Para la mayoría de usuarios, es preferible usar `crypto/x509` o [encoding/pem](/encoding-pem) directamente. Este paquete es de bajo nivel.

---

## Marshal

Convierte un valor Go a DER (binario ASN.1):

```go
type Estructura struct {
    ID    int
    Nombre string `asn1:"utf8"`
}

e := Estructura{ID: 42, Nombre: "Hola"}
data, err := asn1.Marshal(e)
// data contiene la representación DER
```

| Función | Descripción |
|---------|------------|
| `Marshal(val any) ([]byte, error)` | Codifica `val` a DER |
| `MarshalWithParams(val any, params string) ([]byte, error)` | Codifica con parámetros adicionales |

---

## Unmarshal

Decodifica datos DER en un valor Go:

```go
var e Estructura
rest, err := asn1.Unmarshal(data, &e)
if err != nil {
    log.Fatal(err)
}
// rest = datos sobrantes (en DER puede haber varios elementos)
```

| Función | Descripción |
|---------|------------|
| `Unmarshal(b []byte, val any) (rest []byte, err error)` | Decodifica DER en `val` |
| `UnmarshalWithParams(b []byte, val any, params string) (rest []byte, err error)` | Decodifica con parámetros |

---

## Tags de struct

Usá el tag `asn1` para controlar la codificación:

| Tag | Efecto |
|-----|--------|
| `asn1:"optional"` | El campo puede omitirse (usar con punteros) |
| `asn1:"explicit,tag:N"` | Tag explícito con número `N` |
| `asn1:"implicit,tag:N"` | Tag implícito |
| `asn1:"utf8"` | Codifica como UTF8String en vez de PrintableString |
| `asn1:"ia5"` | Codifica como IA5String |
| `asn1:"numeric"` | Codifica como NumericString |
| `asn1:"printable"` | Codifica como PrintableString |
| `asn1:"set"` | Codifica slice como SET en vez de SEQUENCE |
| `asn1:"application,tag:N"` | Tag de clase application |
| `asn1:"tag:N"` | Tag de clase context-specific |
| `asn1:"omitempty"` | Omite campos con valor zero |

```go
type Certificado struct {
    Version    int `asn1:"optional,explicit,tag:0"`
    Serial     int
    Emisor     string `asn1:"utf8"`
    Opcional   *int  `asn1:"optional"`
}
```

---

## Tipos ASN.1 comunes

| Tipo Go | Tag ASN.1 por defecto |
|---------|----------------------|
| `int`, `int64` | INTEGER |
| `*big.Int` | INTEGER |
| `string` | PrintableString |
| `[]byte` | OCTET STRING |
| `bool` | BOOLEAN |
| `time.Time` | UTCTime o GeneralizedTime (según el año) |
| `asn1.BitString` | BIT STRING |
| `asn1.ObjectIdentifier` | OBJECT IDENTIFIER |
| `asn1.Enumerated` | ENUMERATED |
| `asn1.Flag` (bool) | BOOLEAN |
| `asn1.RawValue` | Valor ASN.1 sin procesar |
| `asn1.RawContent` (`[]byte`) | Contenido DER crudo del struct |
| `asn1.NullRawValue` | `RawValue` que representa un valor NULL ASN.1 |
| `any` (interface{}) | Se infiere del valor real |

```go
// ObjectIdentifier
oid := asn1.ObjectIdentifier{2, 5, 4, 3} // commonName
data, _ := asn1.Marshal(oid)

// BitString
bs := asn1.BitString{Bytes: []byte{0x80}, BitLength: 1}
// El primer bit es 1, los demás 0
```

---

## NullRawValue vs RawValue

`RawValue` permite incrustar contenido ASN.1 ya codificado sin parsearlo:

```go
type Envoltorio struct {
    Algoritmo asn1.ObjectIdentifier
    Contenido asn1.RawValue
}
// Contenido se almacena como []byte crudo
```

`NullRawValue` es un `RawValue` predefinido que representa ASN.1 NULL:

```go
type CampoConNull struct {
    ID      int
    Opcional asn1.RawValue `asn1:"optional,tag:0"`
}
// Si Opcional no está presente, se completa con asn1.NullRawValue
```

---

## Clases de tag

ASN.1 define cuatro clases de tag. Go las expone como constantes:

| Constante | Valor | Significado |
|-----------|-------|-------------|
| `asn1.ClassUniversal` | 0 | Tags universales (INTEGER, BOOLEAN, etc.) |
| `asn1.ClassApplication` | 1 | Tags de aplicación |
| `asn1.ClassContextSpecific` | 2 | Tags de contexto (común en X.509) |
| `asn1.ClassPrivate` | 3 | Tags privados |

### Tags universales comunes

| Constante | Tag | Tipo ASN.1 |
|-----------|-----|------------|
| `asn1.TagBoolean` | 1 | BOOLEAN |
| `asn1.TagInteger` | 2 | INTEGER |
| `asn1.TagBitString` | 3 | BIT STRING |
| `asn1.TagOctetString` | 4 | OCTET STRING |
| `asn1.TagNull` | 5 | NULL |
| `asn1.TagOID` | 6 | OBJECT IDENTIFIER |
| `asn1.TagEnum` | 10 | ENUMERATED |
| `asn1.TagUTF8String` | 12 | UTF8String |
| `asn1.TagSequence` | 16 | SEQUENCE / SEQUENCE OF |
| `asn1.TagSet` | 17 | SET / SET OF |
| `asn1.TagPrintableString` | 19 | PrintableString |
| `asn1.TagIA5String` | 22 | IA5String |
| `asn1.TagUTCTime` | 23 | UTCTime |
| `asn1.TagGeneralizedTime` | 24 | GeneralizedTime |

Se usan con tags explícitos/implicitos y `RawValue`:

```go
rv := asn1.RawValue{
    Class: asn1.ClassContextSpecific,
    Tag:   2,
    Bytes: []byte{0x13, 0x02, 0x48, 0x69}, // PrintableString "Hi"
}
```

---

## Errores

| Tipo de error | Descripción |
|---------------|------------|
| `asn1.StructuralError` | Error estructural (longitud incorrecta, tag inesperado). Contiene campo `Msg string` |
| `asn1.SyntaxError` | Error de sintaxis en los datos ASN.1. Contiene campo `Msg string` |

```go
_, err := asn1.Unmarshal(data, &destino)
if err != nil {
    if se, ok := err.(asn1.StructuralError); ok {
        fmt.Println("Error estructural:", se.Msg)
    }
    if sy, ok := err.(asn1.SyntaxError); ok {
        fmt.Println("Error de sintaxis:", sy.Msg)
    }
}
```

---

[← Volver al índice](/indice)
