# mime — Tipos MIME y extensiones de archivo

Mapea extensiones de archivo a tipos MIME (y viceversa). Incluye funciones para parsear y formatear cabeceras `Content-Type`.

```go
import "mime"
```

---

## Índice

- [TypeByExtension](/estandard/mime#typebyextension-extensión-→-mime)
- [ExtensionsByType](/estandard/mime#extensionsbytype-mime-→-extensiones)
- [AddExtensionType](/estandard/mime#addextensiontype-registrar-tipo)
- [ParseMediaType](/estandard/mime#parsemediatype-analizar-content-type)
- [FormatMediaType](/estandard/mime#formatmediatype-formatear-content-type)

---

## TypeByExtension (extensión → MIME)

Devuelve el tipo MIME para una extensión de archivo dada. La extensión debe incluir el punto.

```go
tipo := mime.TypeByExtension(".html")
fmt.Println(tipo) // text/html; charset=utf-8

tipo = mime.TypeByExtension(".json")
fmt.Println(tipo) // application/json

tipo = mime.TypeByExtension(".jpg")
fmt.Println(tipo) // image/jpeg

tipo = mime.TypeByExtension(".xyz")
fmt.Println(tipo) // "" (vacío si no está registrado)
```

| Función | Devuelve |
|---------|----------|
| `mime.TypeByExtension(ext string)` | `string` |

**Extensiones comunes:**

| Extensión | Tipo MIME |
|-----------|-----------|
| `.html` | `text/html; charset=utf-8` |
| `.js` | `text/javascript; charset=utf-8` |
| `.css` | `text/css; charset=utf-8` |
| `.json` | `application/json` |
| `.xml` | `application/xml` |
| `.pdf` | `application/pdf` |
| `.zip` | `application/zip` |
| `.png` | `image/png` |
| `.jpg` / `.jpeg` | `image/jpeg` |
| `.gif` | `image/gif` |
| `.svg` | `image/svg+xml` |
| `.mp3` | `audio/mpeg` |
| `.mp4` | `video/mp4` |
| `.txt` | `text/plain; charset=utf-8` |

---

## ExtensionsByType (MIME → extensiones)

Devuelve las extensiones registradas para un tipo MIME.

```go
exts, err := mime.ExtensionsByType("image/jpeg")
fmt.Println(exts) // [.jpeg .jpg .jpe]

exts, err = mime.ExtensionsByType("application/json")
fmt.Println(exts) // [.json]
```

| Función | Devuelve |
|---------|----------|
| `mime.ExtensionsByType(typ string)` | `([]string, error)` |

Devuelve error si el tipo MIME no está registrado.

---

## AddExtensionType (registrar tipo)

Registra un tipo MIME personalizado para una extensión.

```go
err := mime.AddExtensionType(".custom", "application/x-custom-format")
if err != nil {
    log.Fatal(err)
}

tipo := mime.TypeByExtension(".custom")
fmt.Println(tipo) // application/x-custom-format
```

| Función | Devuelve |
|---------|----------|
| `mime.AddExtensionType(ext, typ string)` | `error` |

**Reglas:**
- La extensión debe empezar con `.`
- El tipo debe tener el formato `tipo/subtipo`
- Si la extensión ya existe, devuelve error

---

## ParseMediaType (analizar Content-Type)

Parsea el valor de un header `Content-Type` en tipo MIME y parámetros.

```go
mediatype, params, err := mime.ParseMediaType("text/html; charset=utf-8")
fmt.Println(mediatype) // text/html
fmt.Println(params)    // map[charset:utf-8]

mediatype, params, err = mime.ParseMediaType("multipart/form-data; boundary=abc123")
fmt.Println(mediatype) // multipart/form-data
fmt.Println(params)    // map[boundary:abc123]
```

| Función | Devuelve |
|---------|----------|
| `mime.ParseMediaType(v string)` | `(mediatype string, params map[string]string, err error)` |

Los valores entre comillas se manejan correctamente:

```go
mediatype, params, _ := mime.ParseMediaType(`text/html; charset="UTF-8"`)
fmt.Println(params["charset"]) // UTF-8
```

---

## FormatMediaType (formatear Content-Type)

Construye un string de `Content-Type` a partir de un tipo MIME y parámetros.

```go
ct := mime.FormatMediaType("text/html", map[string]string{"charset": "utf-8"})
fmt.Println(ct) // text/html; charset=utf-8

ct = mime.FormatMediaType("multipart/form-data", map[string]string{"boundary": "abc123"})
fmt.Println(ct) // multipart/form-data; boundary=abc123
```

| Función | Devuelve |
|---------|----------|
| `mime.FormatMediaType(t string, param map[string]string)` | `string` |

Si el parámetro contiene caracteres especiales, `FormatMediaType` agrega comillas automáticamente.

---

[← Volver al índice](/indice)
