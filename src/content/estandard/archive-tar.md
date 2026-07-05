# archive/tar — Leer y crear archivos TAR

```go
import "archive/tar"
```

El formato TAR solo empaqueta, no comprime. Para comprimir, combinar con [compress/gzip](/compress-gzip).

---

## Crear un TAR

```go
f, _ := os.Create("archivo.tar")
defer f.Close()

tw := tar.NewWriter(f)
defer tw.Close()

contenido := []byte("datos del archivo")
cabecera := &tar.Header{
    Name: "documento.txt",
    Size: int64(len(contenido)),
    Mode: 0644,
}

tw.WriteHeader(cabecera)
tw.Write(contenido)
```

| Función | Descripción |
|---------|-------------|
| `tar.NewWriter(w io.Writer)` | Crea un escritor TAR sobre `w` |
| `tw.WriteHeader(h *Header)` | Escribe la cabecera del siguiente archivo |
| `tw.Write(data []byte)` | Escribe datos del archivo |
| `tw.Close()` | Finaliza el TAR |

---

## Crear TAR + GZip

```go
f, _ := os.Create("archivo.tar.gz")
defer f.Close()

gw := gzip.NewWriter(f)
defer gw.Close()

tw := tar.NewWriter(gw)
defer tw.Close()

// ... escribir archivos como arriba
```

---

## Leer un TAR

```go
f, _ := os.Open("archivo.tar")
defer f.Close()

tr := tar.NewReader(f)

for {
    cabecera, err := tr.Next()
    if err == io.EOF {
        break
    }

    fmt.Printf("Archivo: %s (tamaño: %d)\n", cabecera.Name, cabecera.Size)

    if cabecera.Typeflag == tar.TypeDir {
        continue // es un directorio
    }

    contenido, _ := io.ReadAll(tr)
    fmt.Println(string(contenido))
}
```

| Función | Descripción |
|---------|-------------|
| `tar.NewReader(r io.Reader)` | Crea un lector TAR desde `r` |
| `tr.Next()` | Avanza al siguiente archivo, devuelve `*Header` |
| `cabecera.Name` | Nombre del archivo |
| `cabecera.Size` | Tamaño en bytes |
| `cabecera.Typeflag` | Tipo (archivo, directorio, symlink...) |
| `io.EOF` | Señal de fin del archivo TAR |

---

## Header desde FileInfo

```go
info, _ := os.Stat("archivo.txt")
cabecera, _ := tar.FileInfoHeader(info, "") // usa el nombre del archivo original
cabecera.Name = "ruta/dentro/del/tar.txt"
```

---

[← Volver al índice](/indice)
