# crypto/x509 — Certificados X.509

Parseo y generación de certificados X.509, listas de revocación (CRL) y claves.

```go
import "crypto/x509"
```

---

## Índice

- [Parsear certificado (PEM)](/estandard/crypto-x509#parsear-certificado-pem)
- [Campos del tipo Certificate](/estandard/crypto-x509#campos-de-certificate)
- [Parsear clave privada (PEM)](/estandard/crypto-x509#parsear-clave-privada-pem)
- [Parsear clave pública (PEM)](/estandard/crypto-x509#parsear-clave-pública-pem)
- [Marshal claves](/estandard/crypto-x509#marshal-claves)
- [Crear certificado](/estandard/crypto-x509#crear-certificado)
- [Verificar certificado (Verify)](/estandard/crypto-x509#verificar-certificado)
- [VerifyOptions - campos completos](/estandard/crypto-x509#verifyoptions)
- [CertPool (pool de confianza)](/estandard/crypto-x509#certpool-pool-de-confianza)
- [Parsear CRL / RevocationList](/estandard/crypto-x509#parsear-crl)
- [Crear lista de revocación (CreateRevocationList)](/estandard/crypto-x509#crear-crl)
- [Tipos de error](/estandard/crypto-x509#tipos-de-error)
- [Constantes](/estandard/crypto-x509#constantes:-keyusage,-extkeyusage,-signaturealgorithm)
- [IsEncryptedPEMBlock / DecryptPEMBlock (obsoleto)](/estandard/crypto-x509#isencryptedpemblock-/-decryptpemblock)

---

## Parsear certificado (PEM)

```go
certPEM, _ := os.ReadFile("cert.pem")
block, _ := pem.Decode(certPEM)

cert, err := x509.ParseCertificate(block.Bytes)
fmt.Println(cert.Subject.CommonName) // CN
fmt.Println(cert.DNSNames)           // SANs
fmt.Println(cert.NotBefore)          // válido desde
fmt.Println(cert.NotAfter)           // válido hasta
fmt.Println(cert.IsCA)               // ¿es CA?
```

| Función | Descripción |
|---------|-------------|
| `x509.ParseCertificate(der []byte)` | Parsea un certificado en formato DER |
| `x509.ParseCertificates(der []byte)` | Parsea múltiples certificados (cadena) |

---

## Campos de Certificate

```go
type Certificate struct {
    Raw                     []byte
    RawTBSCertificate       []byte
    RawSubjectPublicKeyInfo []byte
    RawSubject              []byte
    RawIssuer               []byte

    Signature          []byte
    SignatureAlgorithm SignatureAlgorithm

    PublicKeyAlgorithm PublicKeyAlgorithm
    PublicKey          any

    Version             int
    SerialNumber        *big.Int
    Issuer              pkix.Name
    Subject             pkix.Name
    NotBefore, NotAfter time.Time
    KeyUsage            KeyUsage

    Extensions []pkix.Extension

    ExtKeyUsage           []ExtKeyUsage
    UnknownExtKeyUsage    []asn1.ObjectIdentifier

    BasicConstraintsValid bool
    IsCA                  bool
    MaxPathLen            int
    MaxPathLenZero        bool

    SubjectKeyId   []byte
    AuthorityKeyId []byte

    OCSPServer            []string
    IssuingCertificateURL []string

    DNSNames              []string
    EmailAddresses        []string
    IPAddresses           []net.IP
    URIs                  []*url.URL

    PermittedDNSDomainsCritical bool
    PermittedDNSDomains         []string
    ExcludedDNSDomains          []string
    PermittedIPRanges           []*net.IPNet
    ExcludedIPRanges            []*net.IPNet
    PermittedEmailAddresses     []string
    ExcludedEmailAddresses      []string
    PermittedURIDomains         []string
    ExcludedURIDomains          []string

    CRLDistributionPoints []string

    PolicyIdentifiers []asn1.ObjectIdentifier

    InhibitAnyPolicy                     int
    InhibitAnyPolicyZero                 bool
    InhibitPolicyMapping                 int
    InhibitPolicyMappingZero             bool
    RequireExplicitPolicy                int
    RequireExplicitPolicyZero            bool

    NameConstraintsCritical              bool

    UnhandledCriticalExtensions []asn1.ObjectIdentifier

    // Go 1.18+
    Policies []OID
}
```

---

## Parsear clave privada (PEM)

```go
keyPEM, _ := os.ReadFile("key.pem")
block, _ := pem.Decode(keyPEM)

// Clave PKCS#8 (recomendado)
key, err := x509.ParsePKCS8PrivateKey(block.Bytes)

// Clave PKCS#1 (RSA tradicional)
key, err := x509.ParsePKCS1PrivateKey(block.Bytes)

// Clave EC
key, err := x509.ParseECPrivateKey(block.Bytes)
```

---

## Parsear clave pública

```go
pubKeyDER, _ := os.ReadFile("pubkey.der")
pubKey, err := x509.ParsePKIXPublicKey(pubKeyDER)

switch pub := pubKey.(type) {
case *rsa.PublicKey:
    fmt.Println("RSA, tamaño:", pub.Size())
case *ecdsa.PublicKey:
    fmt.Println("ECDSA")
case ed25519.PublicKey:
    fmt.Println("Ed25519")
}
```

---

## Marshal claves

```go
// PKCS#8 (privada)
privDER, _ := x509.MarshalPKCS8PrivateKey(privKey)

// PKCS#1 (RSA tradicional)
privDER, _ := x509.MarshalPKCS1PrivateKey(privKey)

// EC
privDER, _ := x509.MarshalECPrivateKey(privKey)

// PKIX/SPKI (pública)
pubDER, _ := x509.MarshalPKIXPublicKey(&privKey.PublicKey)

// PEM blocks
pemBlockPriv := &pem.Block{Type: "PRIVATE KEY", Bytes: privDER}
pemBlockPub  := &pem.Block{Type: "PUBLIC KEY", Bytes: pubDER}
```

---

## Crear certificado

```go
template := &x509.Certificate{
    SerialNumber: big.NewInt(1),
    Subject: pkix.Name{
        CommonName:   "example.com",
        Organization: []string{"Mi Org"},
    },
    DNSNames:              []string{"example.com", "www.example.com"},
    NotBefore:             time.Now(),
    NotAfter:              time.Now().Add(365 * 24 * time.Hour),
    KeyUsage:              x509.KeyUsageDigitalSignature | x509.KeyUsageKeyEncipherment,
    ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
    BasicConstraintsValid: true,
    IsCA:                  false,
}

privKey, _ := rsa.GenerateKey(rand.Reader, 2048)
certDER, err := x509.CreateCertificate(rand.Reader, template, template, &privKey.PublicKey, privKey)
// template = certificado a crear
// parent   = certificado firmante (template mismo si es autofirmado)
```

| Función | Descripción |
|---------|-------------|
| `x509.CreateCertificate(rand, template, parent, pub, priv)` | Crea certificado DER |

---

## Verificar certificado

```go
opts := x509.VerifyOptions{
    DNSName:       "example.com",
    Intermediates: intermediatesPool,
    Roots:         rootsPool,
    CurrentTime:   time.Now(),
    KeyUsages:     []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
}

chains, err := cert.Verify(opts)
if err != nil {
    log.Fatal(err)
}

for i, chain := range chains {
    for j, c := range chain {
        fmt.Printf("Cadena %d, Cert %d: %s\n", i, j, c.Subject.CommonName)
    }
}
```

---

## VerifyOptions

```go
type VerifyOptions struct {
    DNSName       string           // nombre a verificar (SAN / CN)
    Intermediates *CertPool        // pool de CAs intermedias
    Roots         *CertPool        // pool de CAs raíz de confianza (nil = sistema)
    CurrentTime   time.Time        // momento de verificación (nil = ahora)
    KeyUsages     []ExtKeyUsage    // usos de clave requeridos
    MaxConstraintComparisons int   // límite de comparaciones de constraints (Go 1.10+)
}
```

---

## CertPool (pool de confianza)

```go
pool := x509.NewCertPool()
pool.AddCert(cert)

// Cargar certificados del sistema
pool, _ := x509.SystemCertPool()

// Verificar un certificado
opts := x509.VerifyOptions{
    DNSName: "example.com",
    Roots:   pool,
}
chains, err := cert.Verify(opts)
```

| Función | Descripción |
|---------|-------------|
| `x509.NewCertPool()` | Crea un pool de certificados vacío |
| `pool.AddCert(cert)` | Agrega un certificado al pool |
| `pool.AppendCertsFromPEM(pemBytes)` | Agrega certificados desde PEM |
| `pool.Subjects()` | Devuelve los DN de los certificados en el pool (obsoleto) |
| `x509.SystemCertPool()` | Pool de certificados raíz del sistema operativo |
| `cert.Verify(opts)` | Verifica la cadena de confianza del certificado |

---

## Parsear CRL (lista de revocación)

```go
crlPEM, _ := os.ReadFile("crl.pem")
block, _ := pem.Decode(crlPEM)

// CRL tradicional (obsoleto desde Go 1.15)
crl, err := x509.ParseCRL(block.Bytes)

// RevocationList (Go 1.15+, recomendado): usa ParseRevocationList en su lugar
rl, err := x509.ParseRevocationList(block.Bytes)
fmt.Println(rl.Issuer.CommonName)
fmt.Println(rl.ThisUpdate)
fmt.Println(rl.NextUpdate)
for _, entry := range rl.RevokedCertificateEntries {
    fmt.Println(entry.SerialNumber, entry.RevocationTime)
}
```

---

## Crear CRL (RevocationList)

```go
rl := &x509.RevocationList{
    Number:     big.NewInt(1),
    ThisUpdate: time.Now(),
    NextUpdate: time.Now().Add(30 * 24 * time.Hour),
    RevokedCertificateEntries: []x509.RevocationListEntry{
        {
            SerialNumber:   big.NewInt(42),
            RevocationTime: time.Now(),
        },
    },
}

crlDER, err := x509.CreateRevocationList(rand.Reader, rl, caCert, caKey)
```

---

## Tipos de error

| Tipo de error | Descripción |
|---------------|-------------|
| `CertificateInvalidError` | Certificado no válido (expirado, no es CA, etc.) |
| `HostnameError` | El hostname no coincide con el certificado |
| `UnknownAuthorityError` | Autoridad certificadora no reconocida |
| `ConstraintViolationError` | Violación de constraints (name constraints, etc.) |
| `SystemRootsError` | Error al cargar las raíces del sistema |
| `InsecureAlgorithmError` | Algoritmo rechazado por política de seguridad |

```go
// Detectar tipo de error
if err != nil {
    switch e := err.(type) {
    case x509.HostnameError:
        fmt.Println("Hostname no coincide:", e.Error())
    case x509.UnknownAuthorityError:
        fmt.Println("CA no reconocida")
    case x509.CertificateInvalidError:
        fmt.Println("Certificado inválido:", e.Reason)
    }
}
```

---

## Constantes: KeyUsage, ExtKeyUsage, SignatureAlgorithm

### KeyUsage

```go
const (
    KeyUsageDigitalSignature  KeyUsage = 1 << iota // 1
    KeyUsageContentCommitment                       // 2
    KeyUsageKeyEncipherment                         // 4
    KeyUsageDataEncipherment                        // 8
    KeyUsageKeyAgreement                            // 16
    KeyUsageCertSign                                // 32
    KeyUsageCRLSign                                 // 64
    KeyUsageEncipherOnly                            // 128
    KeyUsageDecipherOnly                            // 256
)
```

### ExtKeyUsage

```go
const (
    ExtKeyUsageAny                            ExtKeyUsage = iota
    ExtKeyUsageServerAuth                                  // 1
    ExtKeyUsageClientAuth                                  // 2
    ExtKeyUsageCodeSigning                                 // 3
    ExtKeyUsageEmailProtection                             // 4
    ExtKeyUsageIPSECEndSystem                              // 5
    ExtKeyUsageIPSECTunnel                                 // 6
    ExtKeyUsageIPSECUser                                   // 7
    ExtKeyUsageTimeStamping                                // 8
    ExtKeyUsageOCSPSigning                                 // 9
    ExtKeyUsageMicrosoftServerGatedCrypto                  // 10
    ExtKeyUsageNetscapeServerGatedCrypto                   // 11
    ExtKeyUsageMicrosoftCommercialCodeSigning              // 12
    ExtKeyUsageMicrosoftKernelCodeSigning                  // 13
)
```

### PublicKeyAlgorithm

```go
const (
    UnknownPublicKeyAlgorithm PublicKeyAlgorithm = iota
    RSA
    DSA       // solo soportado para verificación
    ECDSA
    Ed25519
)
```

### SignatureAlgorithm

```go
const (
    UnknownSignatureAlgorithm SignatureAlgorithm = iota
    MD2WithRSA
    MD5WithRSA
    SHA1WithRSA
    SHA256WithRSA
    SHA384WithRSA
    SHA512WithRSA
    DSAWithSHA1
    DSAWithSHA256
    ECDSAWithSHA1
    ECDSAWithSHA256
    ECDSAWithSHA384
    ECDSAWithSHA512
    SHA256WithRSAPSS
    SHA384WithRSAPSS
    SHA512WithRSAPSS
    PureEd25519
)
```

---

## IsEncryptedPEMBlock / DecryptPEMBlock (obsoleto)

```go
import "encoding/pem"

// Verificar si un bloque PEM está encriptado
b, _ := pem.Decode(pemData)
isEncrypted := x509.IsEncryptedPEMBlock(b)

// Desencriptar
derBytes, err := x509.DecryptPEMBlock(b, password)
```

⚠️ **Obsoleto desde Go 1.16.** Solo soporta PEM encriptado con algoritmo legacy. Para claves modernas (PKCS#8 encriptado), usar `x509.ParsePKCS8PrivateKey` con una clave desencriptada manualmente.

---

[← Volver al índice](/indice)
