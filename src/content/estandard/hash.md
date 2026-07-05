# hash — Interfaces de hash

Define la interfaz `hash.Hash` que implementan todos los paquetes de hashing (sha256, md5, etc.).

```go
import "hash"
```

---

## La interfaz `hash.Hash`

```go
type Hash interface {
    io.Writer            // Write(p []byte)
    Sum(b []byte) []byte // Devuelve el hash actual
    Reset()              // Reinicia para reutilizar
    Size() int           // Tamaño del hash en bytes
    BlockSize() int      // Tamaño del bloque interno
}
```

Todas las funciones de hash de la librería estándar implementan esta interfaz: `sha256.New()`, `md5.New()`, `sha512.New()`, etc.

Esto permite escribir código genérico que funciona con cualquier algoritmo:

```go
func hashDeArchivo(path string, h hash.Hash) ([]byte, error) {
    f, _ := os.Open(path)
    defer f.Close()
    io.Copy(h, f)  // h implementa io.Writer
    return h.Sum(nil), nil
}

// Usar con SHA-256:
h := sha256.New()
hash, _ := hashDeArchivo("archivo.txt", h)
```

---

[← Volver al índice](/indice)
