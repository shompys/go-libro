# errors — Manejo de errores

Paquete para crear, envolver e inspeccionar errores.

```go
import "errors"
```

No confundir con `fmt.Errorf` de [fmt](/fmt), que también crea errores.

---

## Índice

- [Crear errores](/estandard/errors#crear-errores)
- [Unir errores](/estandard/errors#unir-errores)
- [Verificar tipo de error](/estandard/errors#verificar-tipo-de-error-is-y-as)

---

## Crear errores

### `errors.New()`

```go
err := errors.New("archivo no encontrado")
```

Devuelve un `error` con el mensaje dado. **El valor centinela más común.**

```go
var ErrNotFound = errors.New("not found")  // convención: prefijo Err
```

### `fmt.Errorf()`

Del paquete [fmt](/fmt), permite formato:

```go
err := fmt.Errorf("archivo %s no encontrado en %s", nombre, ruta)
```

### Envolver errores (`%w`)

Con `fmt.Errorf` y el verbo `%w` podés **envolver** un error para agregar contexto sin perder el original:

```go
func leerArchivo(path string) error {
    _, err := os.ReadFile(path)
    if err != nil {
        return fmt.Errorf("error leyendo %s: %w", path, err)
    }
    return nil
}
```

| Verbo | Qué hace |
|-------|----------|
| `%w` | Envuelve el error (el original es accesible con `errors.Is` / `errors.As`) |
| `%v` | Solo imprime el mensaje (pierde la cadena de wrapping) |

⚠️ Solo podés usar **un** `%w` por llamada a `Errorf`.

### `errors.Join()`

Go 1.20+. Combina múltiples errores en uno solo:

```go
err := errors.Join(err1, err2, err3)
```

---

## Verificar tipo de error

### `errors.Is()`

Verifica si un error **es** (o envuelve a) otro error:

```go
_, err := os.Open("noexiste.txt")
if errors.Is(err, os.ErrNotExist) {
    fmt.Println("El archivo no existe")
}
```

Recorre la cadena de wrapping automáticamente.

### `errors.As()`

Verifica si un error **es de cierto tipo** y lo extrae:

```go
var pathErr *fs.PathError
if errors.As(err, &pathErr) {
    fmt.Println("Error en la ruta:", pathErr.Path)
}
```

| Función | Pregunta que responde |
|---------|----------------------|
| `errors.Is()` | ¿Este error es igual a este otro (o lo envuelve)? |
| `errors.As()` | ¿Este error es de este tipo? Dame la instancia |

---

## `errors.Unwrap()`

Extrae el error envuelto (si tiene). No se usa mucho directamente; preferí `Is` y `As`.

```go
if unwrapped := errors.Unwrap(err); unwrapped != nil {
    fmt.Println("Error original:", unwrapped)
}
```

---

[← Volver al índice](/indice)
