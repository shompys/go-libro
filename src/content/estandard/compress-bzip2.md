# compress/bzip2 — Descomprimir BZip2

Descomprime archivos `.bz2`. **Solo lectura**, no hay writer en la librería estándar.

```go
import "compress/bzip2"
```

---

## Descomprimir

```go
f, _ := os.Open("datos.bz2")
r := bzip2.NewReader(f)
contenido, _ := io.ReadAll(r)
```

---

[← Volver al índice](/indice)
