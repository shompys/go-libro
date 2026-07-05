# Librerías de Go

Documentación completa en español de las librerías estándar y de terceros.

---

# 📦 Librería Estándar

> Paquetes que vienen incluidos con Go. No necesitás instalar nada.

---

## Básicos (imprescindibles)

| Paquete | Qué hace |
|---------|----------|
| [fmt](/estandard/fmt) | Imprimir, formatear y escanear texto |
| [os](/estandard/os) | Sistema operativo: archivos, directorios, procesos, señales |
| [io](/estandard/io) | Interfaces de entrada/salida (`Reader`, `Writer`) |
| [strings](/estandard/strings) | Manipulación de strings |
| [strconv](/estandard/strconv) | Conversión entre strings y tipos numéricos |
| [time](/estandard/time) | Fechas, horas, timers, tickers |
| [errors](/estandard/errors) | Creación y manejo de errores |
| [log](/estandard/log) | Logging simple |
| [math](/estandard/math) | Funciones matemáticas básicas |
| [math/rand](/estandard/math-rand) | Números pseudoaleatorios |
| [math/big](/estandard/math-big) | Números de precisión arbitraria |
| [math/bits](/estandard/math-bits) | Manipulación de bits |
| [math/cmplx](/estandard/math-cmplx) | Números complejos |

---

## I/O y Datos

| Paquete | Qué hace |
|---------|----------|
| [bufio](/estandard/bufio) | I/O con buffer |
| [bytes](/estandard/bytes) | Operaciones con slices de bytes |
| [path/filepath](/estandard/path-filepath) | Manipulación de rutas de archivos |
| [io/fs](/estandard/io-fs) | Interfaz de sistema de archivos (Go 1.16+) |
| [embed](/estandard/embed) | Incrustar archivos en el binario |
| [encoding/json](/estandard/encoding-json) | Codificar/decodificar JSON |
| [encoding/csv](/estandard/encoding-csv) | Leer y escribir CSV |
| [encoding/xml](/estandard/encoding-xml) | Codificar/decodificar XML |
| [encoding/gob](/estandard/encoding-gob) | Serialización binaria de Go |
| [encoding/base64](/encoding-base64) | Codificar/decodificar Base64 |
| [encoding/base32](/encoding-base32) | Codificar/decodificar Base32 |
| [encoding/hex](/estandard/encoding-hex) | Codificar/decodificar hexadecimal |
| [encoding/ascii85](/encoding-ascii85) | Codificar/decodificar ASCII85 |
| [encoding/binary](/estandard/encoding-binary) | Codificar/decodificar binario (endianness) |
| [encoding/pem](/estandard/encoding-pem) | Formato PEM (certificados) |
| [encoding/asn1](/encoding-asn1) | ASN.1 (usado por X.509) |

---

## Compresión

| Paquete | Qué hace |
|---------|----------|
| [compress/gzip](/estandard/compress-gzip) | Comprimir/descomprimir GZip |
| [compress/zlib](/estandard/compress-zlib) | Formato zlib |
| [compress/flate](/estandard/compress-flate) | DEFLATE |
| [compress/lzw](/estandard/compress-lzw) | Lempel-Ziv-Welch |
| [compress/bzip2](/compress-bzip2) | BZip2 (solo lectura) |

## Archivos

| Paquete | Qué hace |
|---------|----------|
| [compress/gzip](/estandard/compress-gzip) | Comprimir/descomprimir GZip |
| [compress/zlib](/estandard/compress-zlib) | Formato zlib |
| [compress/flate](/estandard/compress-flate) | DEFLATE |
| [compress/lzw](/estandard/compress-lzw) | Lempel-Ziv-Welch |
| [compress/bzip2](/compress-bzip2) | BZip2 (solo lectura) |
| [archive/zip](/estandard/archive-zip) | Crear y leer ZIPs |
| [archive/tar](/estandard/archive-tar) | Crear y leer TARs |

---

## Red y HTTP

| Paquete | Qué hace |
|---------|----------|
| [net/http](/estandard/net-http) | Cliente y servidor HTTP |
| [net/http/httptest](/estandard/net-http-httptest) | Testear handlers HTTP |
| [net/http/httputil](/estandard/net-http-httputil) | Reverse proxy, dump de requests |
| [net/http/pprof](/estandard/net-http-pprof) | Profiling por HTTP |
| [net/http/cookiejar](/estandard/net-http-cookiejar) | Manejo de cookies |
| [net/http/httptrace](/estandard/net-http-httptrace) | Trazabilidad de requests |
| [net/http/cgi](/estandard/net-http-cgi) | CGI |
| [net/http/fcgi](/estandard/net-http-fcgi) | FastCGI |
| [net](/estandard/net) | Redes: TCP, UDP, IP, DNS |
| [net/url](/estandard/net-url) | Parsear y construir URLs |
| [net/netip](/estandard/net-netip) | Tipos de IP modernos (Go 1.18+) |
| [net/mail](/estandard/net-mail) | Parsear emails |
| [net/smtp](/estandard/net-smtp) | Enviar emails (SMTP) |
| [net/textproto](/estandard/net-textproto) | Protocolos de texto MIME |
| [net/rpc](/estandard/net-rpc) | RPC binario Go-to-Go |
| [net/rpc/jsonrpc](/estandard/net-rpc-jsonrpc) | RPC sobre JSON |

---

## Concurrencia

| Paquete | Qué hace |
|---------|----------|
| [sync](/estandard/sync) | Mutex, WaitGroup, Once, Pool, Map |
| [context](/estandard/context) | Contexto con deadlines, cancelación, valores |
| [sync/atomic](/estandard/sync-atomic) | Operaciones atómicas |

---

## CLI y Sistema

| Paquete | Qué hace |
|---------|----------|
| [flag](/estandard/flag) | Parseo de argumentos de línea de comandos |
| [os/exec](/estandard/os-exec) | Ejecutar comandos externos |
| [os/signal](/estandard/os-signal) | Manejo de señales del SO |
| [os/user](/estandard/os-user) | Información de usuarios del SO |
| [runtime](/estandard/runtime) | Información del runtime |
| [runtime/debug](/estandard/runtime-debug) | Control del garbage collector y stack |
| [runtime/pprof](/estandard/runtime-pprof) | CPU y memory profiling |

---

## Estructuras de Datos

| Paquete | Qué hace |
|---------|----------|
| [sort](/estandard/sort) | Ordenar slices |
| [slices](/estandard/slices) | Funciones genéricas para slices (Go 1.21+) |
| [container/list](/estandard/container-list) | Lista doblemente enlazada |
| [container/heap](/estandard/container-heap) | Heap (montículo) |
| [container/ring](/estandard/container-ring) | Lista circular |

---

## Texto y Unicode

| Paquete | Qué hace |
|---------|----------|
| [text/template](/estandard/text-template) | Templates de texto |
| [html/template](/estandard/html-template) | Templates HTML (escaping automático) |
| [text/tabwriter](/estandard/text-tabwriter) | Columnas alineadas (tabwriter) |
| [text/scanner](/estandard/text-scanner) | Tokenizador de texto |
| [regexp](/estandard/regexp) | Expresiones regulares |
| [unicode](/estandard/unicode) | Clasificación de caracteres |
| [unicode/utf8](/unicode-utf8) | Operaciones con UTF-8 |
| [unicode/utf16](/unicode-utf16) | Codificar/decodificar UTF-16 |
| [reflect](/estandard/reflect) | Introspección de tipos en runtime |

---

## Criptografía

### Hashes y Checksums
| Paquete | Tipo |
|---------|------|
| [crypto/sha256](/crypto-sha256) | SHA-256 |
| [crypto/sha512](/crypto-sha512) | SHA-512, SHA-384 |
| [crypto/sha1](/crypto-sha1) | SHA-1 (obsoleto) |
| [crypto/md5](/crypto-md5) | MD5 (roto) |
| [crypto/hmac](/estandard/crypto-hmac) | HMAC |
| [hash/fnv](/estandard/hash-fnv) | FNV (no criptográfico) |
| [hash/crc32](/hash-crc32) | CRC-32 |
| [hash/crc64](/hash-crc64) | CRC-64 |
| [hash/adler32](/hash-adler32) | Adler-32 |
| [hash/maphash](/estandard/hash-maphash) | Hash para mapas |
| [hash](/estandard/hash) | Interfaces de hash |

### Cifrado
| Paquete | Tipo |
|---------|------|
| [crypto/aes](/estandard/crypto-aes) | Cifrado AES |
| [crypto/des](/estandard/crypto-des) | DES / TripleDES |
| [crypto/rc4](/crypto-rc4) | RC4 (roto) |
| [crypto/cipher](/estandard/crypto-cipher) | Interfaces de cifrado (GCM, CBC) |
| [crypto/rsa](/estandard/crypto-rsa) | RSA |
| [crypto/tls](/estandard/crypto-tls) | TLS (cliente y servidor) |

### Firmas, claves y curvas
| Paquete | Tipo |
|---------|------|
| [crypto/ecdsa](/estandard/crypto-ecdsa) | ECDSA (firmas elípticas) |
| [crypto/ed25519](/crypto-ed25519) | Ed25519 (firmas modernas) |
| [crypto/ecdh](/estandard/crypto-ecdh) | ECDH (intercambio de llaves) |
| [crypto/elliptic](/estandard/crypto-elliptic) | Curvas elípticas |
| [crypto/dsa](/estandard/crypto-dsa) | DSA (obsoleto) |
| [crypto/x509](/crypto-x509) | Certificados X.509 |
| [crypto/rand](/estandard/crypto-rand) | Aleatoriedad criptográfica |
| [crypto/subtle](/estandard/crypto-subtle) | Operaciones de tiempo constante |

---

## Bases de Datos

| Paquete | Qué hace |
|---------|----------|
| [database/sql](/estandard/database-sql) | Interfaz genérica de bases de datos SQL |

---

## Testing y Análisis

| Paquete | Qué hace |
|---------|----------|
| [testing](/estandard/testing) | Framework de tests unitarios |
| [testing/fstest](/estandard/testing-fstest) | Testear fs.FS |
| [testing/iotest](/estandard/testing-iotest) | Testear io.Reader/Writer |
| [debug/buildinfo](/estandard/debug-buildinfo) | Leer info de build del binario |
| [expvar](/estandard/expvar) | Métricas expuestas por HTTP |

---

## Imágenes

| Paquete | Qué hace |
|---------|----------|
| [image](/estandard/image) | Tipos de imagen (RGBA, Gray, etc.) |
| [image/color](/estandard/image-color) | Modelos de color |
| [image/draw](/estandard/image-draw) | Dibujar y componer imágenes |
| [image/png](/estandard/image-png) | Codificar/decodificar PNG |
| [image/jpeg](/estandard/image-jpeg) | Codificar/decodificar JPEG |
| [image/gif](/estandard/image-gif) | Codificar/decodificar GIF |

---

## HTTP, MIME y Logging

| Paquete | Qué hace |
|---------|----------|
| [mime](/estandard/mime) | Tipos MIME |
| [mime/multipart](/estandard/mime-multipart) | Formularios multipart |
| [mime/quotedprintable](/estandard/mime-quotedprintable) | Quoted-Printable encoding |
| [log/slog](/estandard/log-slog) | Log estructurado (Go 1.21+) |
| [log/syslog](/estandard/log-syslog) | Syslog (Unix) |

---

## Herramientas de Análisis de Código (go/*)

| Paquete | Qué hace |
|---------|----------|
| [go/ast](/estandard/go-ast) | Árbol de sintaxis abstracta |
| [go/parser](/estandard/go-parser) | Parser de código Go |
| [go/types](/estandard/go-types) | Type checker de Go |
| [go/build](/estandard/go-build) | Metadata de paquetes |
| [go/build/constraint](/estandard/go-build-constraint) | Build constraints |
| [go/format](/estandard/go-format) | Formatear código Go |
| [go/token](/estandard/go-token) | Archivos y posiciones |
| [go/scanner](/estandard/go-scanner) | Scanner léxico |
| [go/printer](/estandard/go-printer) | Impresor de AST |
| [go/doc](/estandard/go-doc) | Extraer documentación |
| [go/constant](/estandard/go-constant) | Valores constantes |
| [go/importer](/estandard/go-importer) | Importador de paquetes |
| [go/version](/estandard/go-version) | Versión de Go |

---

## Misceláneos

| Paquete | Qué hace |
|---------|----------|
| [regexp/syntax](/estandard/regexp-syntax) | Parseo de sintaxis regex |
| [index/suffixarray](/estandard/index-suffixarray) | Búsqueda de substrings |
| [plugin](/estandard/plugin) | Plugins dinámicos .so |
| [testing/quick](/estandard/testing-quick) | Testing basado en propiedades |
| [runtime/trace](/estandard/runtime-trace) | Tracing de ejecución |
| [runtime/metrics](/estandard/runtime-metrics) | Métricas del runtime |

---

## Bajo Nivel

| Paquete | Qué hace |
|---------|----------|
| [unsafe](/estandard/unsafe) | Operaciones de bajo nivel (punteros, memoria) |
| [syscall](/estandard/syscall) | Llamadas al sistema (platform-specific) |

---

**Total: 139 paquetes documentados**  
**Fuente oficial:** [pkg.go.dev/std](https://pkg.go.dev/std)

---

# 📦 Librerías No Estándar

Librerías de terceros documentadas.

| Librería | Qué hace |
|----------|----------|
| [go-pdf/fpdf](/no-estandard/go-pdf-fpdf) | Generación de documentos PDF |

---

[← Volver al índice general](/indice)
