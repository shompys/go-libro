# text/tabwriter — Escritor de Columnas Alineadas

> **Import:** `import "text/tabwriter"`

El paquete `text/tabwriter` implementa un `io.Writer` que traduce texto delimitado por tabs en columnas alineadas con tamaño elástico. Similar al comando Unix `pr -e -t` y al entorno `tabbing` de TeX.

---

## Creación

| Función | Descripción |
|---------|-------------|
| `NewWriter(output io.Writer, minwidth, tabwidth, padding int, padchar byte, flags uint) *Writer` | Crea un nuevo escritor tabulado |

**Parámetros de NewWriter:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| output | io.Writer | Destino de la salida formateada |
| minwidth | int | Ancho mínimo de columna (sin padding) |
| tabwidth | int | Ancho de tabulación (típicamente 8 o 4) |
| padding | int | Espacios extra de relleno a la derecha de cada celda |
| padchar | byte | Caracter de relleno ASCII (normalmente ' ') |
| flags | uint | Flags de formato (ver tabla abajo) |

```go
w := tabwriter.NewWriter(os.Stdout, 0, 8, 1, ' ', 0)
```

---

## Métodos

| Método | Descripción |
|--------|-------------|
| `Init(output io.Writer, minwidth, tabwidth, padding int, padchar byte, flags uint) *Writer` | Reinicializa el Writer con un nuevo destino |
| `Write(buf []byte) (n int, err error)` | Escribe datos (las tabs delimitan celdas) |
| `Flush() error` | Vacía el buffer y escribe la salida formateada |

```go
w := new(tabwriter.Writer)
w.Init(os.Stdout, 0, 8, 1, ' ', 0)
w.Write([]byte("a\tb\tc\nd\te\tf\n"))
w.Flush()
```

---

## Flags de formato

| Flag | Descripción |
|------|-------------|
| `Debug` | Dibuja líneas verticales entre columnas (útil para depuración) |
| `StripEscape` | Ignora caracteres de escape (texto entre `\xff` y `\xff` no afecta alineación) |
| `AlignRight` | Alinea a la derecha en lugar de a la izquierda |
| `DiscardEmptyColumns` | Descarta columnas vacías |
| `TabIndent` | Usa tabs independientes para indentación (no alineación) |
| `FilterHTML` | Trata etiquetas HTML como texto de escape |

**Ejemplo con flags:**
```go
flags := tabwriter.Debug | tabwriter.AlignRight
w.Init(os.Stdout, 0, 8, 2, ' ', flags)
```

---

## Funcionamiento de las columnas

Una línea se divide en celdas delimitadas por tabs (`\t`). Las celdas en la misma posición de columna en filas consecutivas forman una columna lógica. El ancho de cada columna se calcula como el ancho máximo de sus celdas.

- `\n` marca fin de línea y dispara el alineamiento
- Celdas vacías (tab consecutivos) heredan formato de la celda anterior
- Celdas más largas que el ancho de columna pueden forzar el reajuste

```go
w := tabwriter.NewWriter(os.Stdout, 0, 4, 2, ' ', 0)
fmt.Fprintf(w, "Nombre\tEdad\tCiudad\n")
fmt.Fprintf(w, "Ana\t28\tMadrid\n")
fmt.Fprintf(w, "Juan Carlos\t35\tBuenos Aires\n")
fmt.Fprintf(w, "María\t22\tLima\n")
w.Flush()
```

Salida:
```
Nombre       Edad  Ciudad
Ana          28    Madrid
Juan Carlos  35    Buenos Aires
María        22    Lima
```

---

## StripEscape

El flag `StripEscape` permite incluir caracteres de formato que no contribuyen al ancho visible. El texto entre dos bytes `\xff` se ignora para el cálculo de columnas pero se emite en la salida.

```go
w.Init(os.Stdout, 0, 8, 1, ' ', tabwriter.StripEscape)
// El texto \xff\033[1m\xff aparece en negrita pero no afecta alineación
w.Write([]byte("\xff\x1b[1m\xffNombre\tEdad\n"))
w.Write([]byte("\xff\x1b[1m\xffAna\t28\n"))
w.Flush()
```

---

## HTML (FilterHTML)

El flag `FilterHTML` trata etiquetas HTML y entidades como texto de escape, permitiendo dar formato sin romper columnas.

```go
w.Init(os.Stdout, 0, 8, 1, ' ', tabwriter.FilterHTML)
w.Write([]byte("<b>Nombre</b>\t<b>Edad</b>\n"))
w.Write([]byte("<i>Ana</i>\t28\n"))
w.Flush()
```

---

[← Volver al índice](/indice)
