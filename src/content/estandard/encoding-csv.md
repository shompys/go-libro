# encoding/csv — Leer y escribir CSV

```go
import "encoding/csv"
```

---

## Leer CSV

```go
f, _ := os.Open("datos.csv")
r := csv.NewReader(f)

for {
    record, err := r.Read()
    if err == io.EOF { break }
    if err != nil { log.Fatal(err) }
    
    fmt.Println(record)  // []string con las columnas
    // record[0] = primera columna, record[1] = segunda, etc.
}
```

### Leer todo de una vez

```go
f, _ := os.Open("datos.csv")
r := csv.NewReader(f)
records, _ := r.ReadAll()
// records es [][]string
```

---

## Escribir CSV

```go
f, _ := os.Create("salida.csv")
w := csv.NewWriter(f)

w.Write([]string{"Nombre", "Edad", "Ciudad"})
w.Write([]string{"Juan", "25", "Buenos Aires"})
w.Write([]string{"Ana", "30", "Córdoba"})

w.Flush()  // sin esto, los datos pueden no escribirse
if err := w.Error(); err != nil {
    log.Fatal(err)
}
```

### Escribir todo de una vez

```go
records := [][]string{
    {"Nombre", "Edad"},
    {"Juan", "25"},
    {"Ana", "30"},
}
w := csv.NewWriter(f)
w.WriteAll(records) // escribe todo y hace Flush automáticamente
```

| Método del Writer | Descripción |
|-------------------|------------|
| `Write(record []string) error` | Escribe un registro |
| `WriteAll(records [][]string) error` | Escribe múltiples registros y hace Flush |
| `Flush()` | Vacía el buffer al Writer subyacente |
| `Error() error` | Devuelve el error acumulado durante escritura |

---

## Configuración del Reader

```go
r := csv.NewReader(archivo)
r.Comma = ';'            // separador (por defecto ',')
r.Comment = '#'          // ignora líneas que empiezan con #
r.LazyQuotes = true       // tolera comillas mal formadas
r.TrimLeadingSpace = true // ignora espacios iniciales
r.FieldsPerRecord = 3     // exige exactamente 3 campos por registro
r.ReuseRecord = true      // reutiliza el slice en cada Read() (más eficiente)
```

| Campo | Default | Qué hace |
|-------|---------|----------|
| `Comma` | `','` | Separador de campos |
| `Comment` | `0` | Carácter de comentario |
| `LazyQuotes` | `false` | Tolerar quotes sucias |
| `TrimLeadingSpace` | `false` | Ignorar espacios después del separador |
| `FieldsPerRecord` | `0` | `0` = usar primer línea como referencia, `-1` = variable, `N` = exactamente N campos |
| `ReuseRecord` | `false` | Si `true`, `Read()` devuelve siempre el mismo slice (ahorra alocaciones pero hay que copiar si se guarda) |

### ReuseRecord

Cuando leés millones de líneas, `ReuseRecord` evita alocar un slice nuevo para cada registro:

```go
r.ReuseRecord = true
for {
    record, err := r.Read()
    if err == io.EOF { break }
    // ¡Atención! record se sobreescribe en cada iteración.
    // Copiá los datos si los necesitás después:
    copia := make([]string, len(record))
    copy(copia, record)
    procesar(copia)
}
```

---

[← Volver al índice](/indice)
