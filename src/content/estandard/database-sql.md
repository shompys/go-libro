# database/sql — Bases de datos SQL

Interfaz genérica para bases de datos SQL (PostgreSQL, MySQL, SQLite, etc.). Necesitás un **driver** específico aparte.

```go
import "database/sql"
import _ "github.com/lib/pq"  // driver de PostgreSQL
```

---

## Índice

- [Abrir conexión](/estandard/database-sql#abrir-conexión)
- [Consultas SELECT](/estandard/database-sql#consultas-select)
- [INSERT, UPDATE, DELETE](/estandard/database-sql#insert,-update,-delete)
- [Prepared statements](/estandard/database-sql#prepared-statements)
- [Transacciones](/estandard/database-sql#transacciones)
- [Valores NULL](/estandard/database-sql#null-values)
- [Pool de conexiones](/estandard/database-sql#pool-de-conexiones)
- [Métodos con Contexto](/estandard/database-sql#métodos-con-contexto)
- [Estadísticas del pool](/estandard/database-sql#estadísticas-del-pool)
- [Conexión individual](/estandard/database-sql#conexión-individual-conn)
- [Transacciones con opciones](/estandard/database-sql#transacciones-con-opciones-begintx)
- [Errores comunes](/estandard/database-sql#errores-comunes)
- [Interfaces Scanner y Valuer](/estandard/database-sql#interfaces-scanner-y-valuer)
- [Connector](/estandard/database-sql#connector-driver-personalizado)
- [NamedArg](/estandard/database-sql#namedarg)
- [Más tipos Null](/estandard/database-sql#nullbool,-nullbyte,-nullint16,-nullint32)

---

## Abrir conexión

```go
db, err := sql.Open("postgres", "host=localhost user=admin dbname=miapp sslmode=disable")
if err != nil { log.Fatal(err) }
defer db.Close()

// Verificar que conecta:
err = db.Ping()
```

| Parámetro | Qué es |
|-----------|--------|
| `driverName` | Nombre del driver: `"postgres"`, `"mysql"`, `"sqlite3"` |
| `dataSourceName` | String de conexión específico del driver |

`sQL.Open()` NO conecta inmediatamente. La conexión se hace en el primer uso. Usá `Ping()` para verificar.

---

## Consultas SELECT

### Una sola fila

```go
var nombre string
var edad int
err := db.QueryRow("SELECT nombre, edad FROM usuarios WHERE id = $1", 5).Scan(&nombre, &edad)
```

### Múltiples filas

```go
rows, err := db.Query("SELECT nombre, edad FROM usuarios WHERE edad > $1", 18)
if err != nil { log.Fatal(err) }
defer rows.Close()

for rows.Next() {
    var nombre string
    var edad int
    rows.Scan(&nombre, &edad)
    fmt.Printf("%s: %d\n", nombre, edad)
}

if err = rows.Err(); err != nil {
    log.Fatal(err)
}
```

| Función | Para |
|---------|------|
| `db.QueryRow(sql, args...)` | Una sola fila (devuelve `*sql.Row`) |
| `db.Query(sql, args...)` | Múltiples filas (devuelve `*sql.Rows`) |

---

## INSERT, UPDATE, DELETE

```go
// INSERT
result, err := db.Exec("INSERT INTO usuarios (nombre, edad) VALUES ($1, $2)", "Juan", 25)

// UPDATE
result, err := db.Exec("UPDATE usuarios SET edad = $1 WHERE id = $2", 26, 5)

// DELETE
result, err := db.Exec("DELETE FROM usuarios WHERE id = $1", 5)
```

`result` tiene:

| Método | Devuelve |
|--------|----------|
| `LastInsertId()` | ID autoincrementado (no soportado en PostgreSQL, usá `RETURNING id`) |
| `RowsAffected()` | Cuántas filas fueron afectadas |

---

## Prepared statements

Para ejecutar la misma query muchas veces con distintos valores:

```go
stmt, err := db.Prepare("INSERT INTO usuarios (nombre, edad) VALUES ($1, $2)")
defer stmt.Close()

stmt.Exec("Juan", 25)
stmt.Exec("Ana", 30)
stmt.Exec("Pedro", 22)
```

Más eficiente porque la DB compila la query una sola vez.

---

## Transacciones

```go
tx, err := db.Begin()

_, err = tx.Exec("UPDATE cuentas SET saldo = saldo - 100 WHERE id = $1", 1)
if err != nil {
    tx.Rollback()
    return err
}

_, err = tx.Exec("UPDATE cuentas SET saldo = saldo + 100 WHERE id = $1", 2)
if err != nil {
    tx.Rollback()
    return err
}

tx.Commit()  // confirma todos los cambios
```

| Método | Qué hace |
|--------|----------|
| `db.Begin()` | Inicia una transacción |
| `tx.Commit()` | Confirma los cambios |
| `tx.Rollback()` | Revierte todo |

---

## Valores NULL

Usá tipos especiales para columnas que pueden ser NULL:

```go
var nombre sql.NullString
var edad sql.NullInt64

db.QueryRow("SELECT nombre, edad FROM usuarios WHERE id = 1").Scan(&nombre, &edad)

if nombre.Valid { fmt.Println(nombre.String) }
if edad.Valid   { fmt.Println(edad.Int64) }
```

| Tipo | Para |
|------|------|
| `sql.NullString` | `VARCHAR NULL` |
| `sql.NullInt64` | `INT NULL` |
| `sql.NullFloat64` | `FLOAT NULL` |
| `sql.NullBool` | `BOOL NULL` |
| `sql.NullTime` | `TIMESTAMP NULL` |

---

## Métodos con Contexto

Todas las operaciones de DB tienen variante con `context.Context`. Usalas para deadlines, cancelación y tracing:

| Método sin contexto | Método con contexto |
|---------------------|---------------------|
| `db.Query(sql, args...)` | `db.QueryContext(ctx, sql, args...)` |
| `db.QueryRow(sql, args...)` | `db.QueryRowContext(ctx, sql, args...)` |
| `db.Exec(sql, args...)` | `db.ExecContext(ctx, sql, args...)` |
| `db.Begin()` | `db.BeginTx(ctx, opts)` |
| `db.Prepare(sql)` | `db.PrepareContext(ctx, sql)` |
| `db.Ping()` | `db.PingContext(ctx)` |

```go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()

rows, err := db.QueryContext(ctx, "SELECT nombre FROM usuarios")
```

---

## Estadísticas del pool

`db.Stats()` devuelve `sql.DBStats` con métricas del pool de conexiones:

```go
stats := db.Stats()
// stats.MaxOpenConnections  — máximo configurado
// stats.OpenConnections     — actualmente abiertas
// stats.InUse               — en uso
// stats.Idle                — inactivas
// stats.WaitCount           — solicitudes que esperaron
// stats.WaitDuration        — tiempo total de espera
// stats.MaxIdleClosed       — cerradas por límite de idle
// stats.MaxIdleTimeClosed   — cerradas por idle timeout
// stats.MaxLifetimeClosed   — cerradas por vida máxima
```

---

## Conexión individual (Conn)

`db.Conn(ctx)` obtiene una conexión dedicada del pool. Debés devolverla con `Close()`:

```go
conn, err := db.Conn(ctx)
defer conn.Close()

// Todas las operaciones en esta conexión
conn.ExecContext(ctx, "SET statement_timeout = '1s'")
rows, _ := conn.QueryContext(ctx, "SELECT ...")
// ...
conn.PingContext(ctx)
```

La conexión se devuelve al pool al hacer `Close()`.

---

## Transacciones con opciones (BeginTx)

`db.BeginTx(ctx, opts)` permite iniciar una transacción con nivel de aislamiento y modo solo lectura:

```go
tx, err := db.BeginTx(ctx, &sql.TxOptions{
    Isolation: sql.LevelSerializable,
    ReadOnly:  true,
})
```

| Nivel de aislamiento | Significado |
|-----------------------|-------------|
| `sql.LevelDefault` | El del driver |
| `sql.LevelReadUncommitted` | Lectura sucia permitida |
| `sql.LevelReadCommitted` | Sin lecturas sucias |
| `sql.LevelRepeatableRead` | Sin lecturas no repetibles |
| `sql.LevelSerializable` | Mayor aislamiento |
| `sql.LevelSnapshot` | Snapshot isolation (algunos drivers) |
| `sql.LevelLinearizable` | Linearizable (algunos drivers) |

### Métodos de sql.Tx

| Método | Descripción |
|--------|-------------|
| `tx.Commit()` | Confirma la transacción |
| `tx.Rollback()` | Revierte la transacción |
| `tx.Exec(query, args...)` | Ejecuta INSERT/UPDATE/DELETE |
| `tx.ExecContext(ctx, query, args...)` | Con contexto |
| `tx.Query(query, args...)` | SELECT (múltiples filas) |
| `tx.QueryContext(ctx, query, args...)` | Con contexto |
| `tx.QueryRow(query, args...)` | SELECT (una fila) |
| `tx.QueryRowContext(ctx, query, args...)` | Con contexto |
| `tx.Prepare(query)` | Prepared statement dentro de la tx |
| `tx.PrepareContext(ctx, query)` | Con contexto |
| `tx.Stmt(stmt)` | Usa un prepared statement existente en la tx |

---

## Errores comunes

| Error | Cuándo ocurre |
|-------|--------------|
| `sql.ErrNoRows` | `QueryRow().Scan()` no encontró ninguna fila |
| `sql.ErrTxDone` | Intentás usar una transacción ya commiteada o rolleada |
| `sql.ErrConnDone` | Intentás usar una conexión ya devuelta al pool |

```go
var nombre string
err := db.QueryRow("SELECT nombre FROM usuarios WHERE id = 999").Scan(&nombre)
if err == sql.ErrNoRows {
    fmt.Println("No se encontró el usuario")
} else if err != nil {
    log.Fatal(err)
}
```

---

## Interfaces Scanner y Valuer

### Scanner (leer desde la DB)

Implementá esta interfaz para que tu tipo personalizado pueda usarse en `Scan`:

```go
type Scanner interface {
    Scan(src any) error
}
```

```go
type Estado int

const (
    Activo   Estado = 1
    Inactivo Estado = 0
)

func (e *Estado) Scan(src any) error {
    switch v := src.(type) {
    case int64:
        *e = Estado(v)
    }
    return nil
}

// Uso:
var estado Estado
db.QueryRow("SELECT estado FROM usuarios WHERE id=1").Scan(&estado)
```

### Valuer (escribir a la DB)

Implementá esta interfaz para pasar tipos personalizados como parámetros de query:

```go
type Valuer interface {
    Value() (driver.Value, error)
}
```

```go
func (e Estado) Value() (driver.Value, error) {
    return int64(e), nil
}

db.Exec("INSERT INTO usuarios (estado) VALUES ($1)", Activo)
```

---

## Connector (driver personalizado)

`sql.OpenDB(c connector)` acepta un `driver.Connector` para configuración avanzada del driver:

```go
connector, err := pq.NewConnector("host=localhost dbname=test")
db := sql.OpenDB(connector)
```

Poco usado; la mayoría de los casos `sql.Open(driverName, dsn)` es suficiente.

---

## NamedArg

Permite pasar argumentos con nombre en consultas. Requiere soporte del driver:

```go
sql.Named("nombre", "Juan")        // sql.NamedArg{Name: "nombre", Value: "Juan"}
sql.Named("edad", sql.Out{Dest: &edad}) // parámetro de salida
```

El soporte depende del driver. La mayoría usa `$1`, `$2` o `?` posicionales. `pgx` y `sqlserver` tienen soporte para named args.

---

## NullBool, NullByte, NullInt16, NullInt32

Tipos adicionales para valores nullable. Todos tienen `Valid bool` + el campo de valor:

| Tipo | Campo de valor |
|------|---------------|
| `sql.NullBool` | `Bool bool` |
| `sql.NullByte` | `Byte byte` |
| `sql.NullInt16` | `Int16 int16` |
| `sql.NullInt32` | `Int32 int32` |
| `sql.NullInt64` | `Int64 int64` |
| `sql.NullFloat64` | `Float64 float64` |
| `sql.NullString` | `String string` |
| `sql.NullTime` | `Time time.Time` |
| `sql.Null[T]` (Go 1.22+) | `V T` (genérico) |

```go
var edad sql.NullInt32
db.QueryRow("SELECT edad FROM personas WHERE id=1").Scan(&edad)
if edad.Valid {
    fmt.Println("Edad:", edad.Int32)
}
```

```go
db.SetMaxOpenConns(25)        // máx conexiones abiertas
db.SetMaxIdleConns(5)         // máx conexiones inactivas
db.SetConnMaxLifetime(5 * time.Minute)  // vida máxima de una conexión
```

---

[← Volver al índice](/indice)
