# reflect — Introspección de tipos en runtime

Permite inspeccionar y manipular tipos y valores en tiempo de ejecución. **Es avanzado, use con criterio.** La mayoría nunca lo necesita.

```go
import "reflect"
```

---

## Obtener tipo y valor

```go
x := 42
t := reflect.TypeOf(x)   // reflect.Type: "int"
v := reflect.ValueOf(x)  // reflect.Value: 42

fmt.Println(t.Name())    // "int"
fmt.Println(v.Int())     // 42
```

---

## Inspeccionar structs

```go
type Persona struct {
    Nombre string
    Edad   int
}

p := Persona{"Ana", 30}
v := reflect.ValueOf(p)

for i := 0; i < v.NumField(); i++ {
    campo := v.Type().Field(i)  // reflect.StructField
    valor := v.Field(i)         // reflect.Value
    
    fmt.Printf("%s: %v\n", campo.Name, valor)
}
// Nombre: Ana
// Edad: 30
```

---

## Tags de struct

```go
campo := reflect.TypeOf(Persona{}).Field(0)
tag := campo.Tag.Get("json")  // obtiene el tag `json:"..."`
```

---

## Crear instancias por nombre

```go
t := reflect.TypeOf(Persona{})
v := reflect.New(t)         // puntero a Persona
v.Elem().Field(0).SetString("Juan")
p := v.Elem().Interface().(Persona)
```

---

## Kinds (categorías de tipos)

| Kind | Tipo |
|------|------|
| `reflect.Int`, `reflect.Int64`, ... | Enteros |
| `reflect.String` | String |
| `reflect.Bool` | Booleano |
| `reflect.Struct` | Struct |
| `reflect.Ptr` | Puntero |
| `reflect.Slice` | Slice |
| `reflect.Map` | Mapa |
| `reflect.Func` | Función |
| `reflect.Interface` | Interfaz |

```go
v := reflect.ValueOf(42)
if v.Kind() == reflect.Int {
    fmt.Println("Es un entero:", v.Int())
}
```

---

## Modificar valores (Setters)

Para modificar un valor con reflect, necesitás un puntero (addressable):

```go
x := 42
v := reflect.ValueOf(&x).Elem()  // .Elem() "desreferencia" el puntero
fmt.Println(v.CanSet())          // true (es addressable)

v.SetInt(100)                    // x = 100
v.Set(reflect.ValueOf(200))      // x = 200
```

| Método | Descripción |
|--------|-------------|
| `CanSet() bool` | ¿Puedo modificar este valor? |
| `Set(v Value)` | Asigna un `Value` |
| `SetInt(x int64)` | Asigna entero |
| `SetString(s string)` | Asigna string |
| `SetBool(b bool)` | Asigna booleano |
| `SetFloat(x float64)` | Asigna float |
| `SetPointer(x unsafe.Pointer)` | Asigna puntero |
| `SetBytes(x []byte)` | Asigna []byte |
| `SetCap(n int)` | Cambia capacidad de slice |
| `SetLen(n int)` | Cambia longitud de slice |
| `SetMapIndex(key, val Value)` | Asigna entrada de mapa |

```go
// Modificar un campo de struct
p := Persona{"Ana", 30}
v := reflect.ValueOf(&p).Elem()
v.FieldByName("Nombre").SetString("Juan")
fmt.Println(p)  // {Juan 30}
```

---

## Acceso a punteros

| Método | Descripción |
|--------|-------------|
| `Addr() Value` | Devuelve un puntero al valor (requiere CanAddr) |
| `UnsafeAddr() uintptr` | Dirección de memoria cruda (unsafe) |
| `Elem() Value` | Desreferencia un puntero o interfaz |
| `Interface() any` | Devuelve el valor subyacente como `any` |

---

## Trabajar con mapas

```go
m := map[string]int{"a": 1, "b": 2}
v := reflect.ValueOf(m)

// Iterar
for _, key := range v.MapKeys() {
    val := v.MapIndex(key)
    fmt.Printf("%v: %v\n", key, val)
}

// Iterar con iterador (Go 1.22+)
iter := v.MapRange()
for iter.Next() {
    fmt.Println(iter.Key(), iter.Value())
}

// Modificar
v.SetMapIndex(reflect.ValueOf("c"), reflect.ValueOf(3))
```

---

## Llamar funciones por reflection

```go
suma := func(a, b int) int { return a + b }
v := reflect.ValueOf(suma)

args := []reflect.Value{reflect.ValueOf(10), reflect.ValueOf(20)}
result := v.Call(args)           // [30]
fmt.Println(result[0].Int())     // 30
```

| Método | Descripción |
|--------|-------------|
| `Call(args []Value) []Value` | Llama la función con argumentos |
| `CallSlice(args []Value) []Value` | Llama función variádica |
| `NumMethod() int` | Cantidad de métodos exportados |
| `Method(i int) Value` | Método por índice |
| `MethodByName(name string) Value` | Método por nombre |

```go
p := Persona{"Ana", 30}
v := reflect.ValueOf(p)
metodo := v.MethodByName("Saludar")  // Persona.Saludar()
metodo.Call(nil)
```

---

## reflect.DeepEqual

Comparación profunda de valores arbitrarios (recursiva, segura con ciclos):

```go
a := []int{1, 2, 3}
b := []int{1, 2, 3}
reflect.DeepEqual(a, b)          // true

m1 := map[string]int{"x": 1}
m2 := map[string]int{"x": 1}
reflect.DeepEqual(m1, m2)        // true
```

Más lento que `==` pero funciona con slices, maps, structs anidados.

---

## Métodos de reflect.Type (inspección avanzada)

### Structs

| Método | Descripción |
|--------|-------------|
| `NumField() int` | Cantidad de campos |
| `Field(i int) StructField` | Campo por índice |
| `FieldByName(name string) (StructField, bool)` | Campo por nombre |
| `FieldByNameFunc(match func(string) bool) (StructField, bool)` | Campo por función |

```go
type StructField struct {
    Name      string      // nombre del campo
    PkgPath   string      // "" si exportado
    Type      Type        // tipo del campo
    Tag       StructTag   // tag del campo
    Offset    uintptr     // offset en bytes dentro del struct
    Index     []int       // índice para FieldByIndex
    Anonymous bool        // ¿es campo embebido?
}
```

### Funciones

| Método | Descripción |
|--------|-------------|
| `NumIn() int` | Cantidad de parámetros de entrada |
| `In(i int) Type` | Tipo del parámetro `i` |
| `NumOut() int` | Cantidad de valores de retorno |
| `Out(i int) Type` | Tipo del retorno `i` |
| `IsVariadic() bool` | ¿Es variádica? |

### Canales, maps, slices, arrays, punteros

| Método | Descripción |
|--------|-------------|
| `Elem() Type` | Tipo del elemento (para slice, map, chan, array, ptr) |
| `Key() Type` | Tipo de la clave (map) |
| `Len() int` | Longitud (array) |
| `ChanDir() ChanDir` | Dirección del canal (SendDir, RecvDir, BothDir) |

### Identidad

| Método | Descripción |
|--------|-------------|
| `Align() int` | Alineación en bytes |
| `FieldAlign() int` | Alineación como campo de struct |
| `Size() uintptr` | Tamaño en bytes |
| `Comparable() bool` | ¿Es comparable con `==`? |
| `Implements(u Type) bool` | ¿Implementa la interfaz `u`? |
| `AssignableTo(u Type) bool` | ¿Es asignable a tipo `u`? |
| `ConvertibleTo(u Type) bool` | ¿Es convertible a tipo `u`? |
| `Name() string` | Nombre del tipo ("" para tipos sin nombre) |
| `PkgPath() string` | Ruta del paquete ("" para tipos built-in) |
| `Kind() Kind` | Categoría (Struct, Slice, Int, etc.) |
| `String() string` | Representación del tipo |

```go
t := reflect.TypeOf(Persona{})
fmt.Println(t.Name())          // "Persona"
fmt.Println(t.PkgPath())       // "main"
fmt.Println(t.Size())          // tamaño en bytes
fmt.Println(t.Comparable())    // true
fmt.Println(t.Kind())          // Struct

// ¿Persona implementa fmt.Stringer?
stringerType := reflect.TypeOf((*fmt.Stringer)(nil)).Elem()
fmt.Println(t.Implements(stringerType))  // false
```

---

[← Volver al índice](/indice)
