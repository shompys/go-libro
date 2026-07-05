# os/user

Acceso a información de usuarios y grupos del sistema operativo.

```go
import "os/user"
```

---

## Tipo User

Representa una cuenta de usuario del sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Uid | `string` | ID numérico del usuario (UID) |
| Gid | `string` | ID numérico del grupo primario (GID) |
| Username | `string` | Nombre de usuario |
| Name | `string` | Nombre completo del usuario |
| HomeDir | `string` | Directorio home del usuario |

---

## Current

```go
func Current() (*User, error)
```

Devuelve el usuario que ejecuta el proceso actual.

| Retorno | Descripción |
|---------|-------------|
| `*User` | Información del usuario actual |
| `error` | Error al obtener la información |

---

## Lookup

```go
func Lookup(username string) (*User, error)
```

Busca un usuario por su nombre de usuario.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| username | `string` | Nombre de usuario a buscar |

---

## LookupId

```go
func LookupId(uid string) (*User, error)
```

Busca un usuario por su ID numérico (UID).

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| uid | `string` | UID a buscar (como cadena) |

---

## Tipo Group

Representa un grupo del sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Gid | `string` | ID numérico del grupo (GID) |
| Name | `string` | Nombre del grupo |

---

## LookupGroup

```go
func LookupGroup(name string) (*Group, error)
```

Busca un grupo por su nombre.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| name | `string` | Nombre del grupo a buscar |

---

## LookupGroupId

```go
func LookupGroupId(gid string) (*Group, error)
```

Busca un grupo por su ID numérico (GID).

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| gid | `string` | GID a buscar (como cadena) |

---

## GroupIds (Go 1.7+)

```go
func (u *User) GroupIds() ([]string, error)
```

Devuelve los IDs de todos los grupos a los que pertenece el usuario.

---

## Tipo UnknownUserError

Error devuelto cuando un usuario no existe.

```go
type UnknownUserError string
func (e UnknownUserError) Error() string
```

## Tipo UnknownUserIdError

Error devuelto cuando un UID no existe.

```go
type UnknownUserIdError int
func (e UnknownUserIdError) Error() string
```

## Tipo UnknownGroupError

```go
type UnknownGroupError string
func (e UnknownGroupError) Error() string
```

## Tipo UnknownGroupIdError

```go
type UnknownGroupIdError string
func (e UnknownGroupIdError) Error() string
```

---

## Ejemplo: Usuario actual

```go
package main

import (
	"fmt"
	"log"
	"os/user"
)

func main() {
	u, err := user.Current()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("UID:", u.Uid)
	fmt.Println("GID:", u.Gid)
	fmt.Println("Username:", u.Username)
	fmt.Println("Name:", u.Name)
	fmt.Println("HomeDir:", u.HomeDir)

	groups, _ := u.GroupIds()
	fmt.Println("Grupos:", groups)
}
```

---

## Ejemplo: Buscar un usuario por ID

```go
u, err := user.LookupId("1000")
if err != nil {
	if _, ok := err.(user.UnknownUserIdError); ok {
		fmt.Println("Usuario no encontrado")
	}
	return
}
fmt.Println(u.Username, u.HomeDir)
```

---

## Ejemplo: Buscar un grupo

```go
g, err := user.LookupGroup("sudo")
if err != nil {
	log.Fatal(err)
}
fmt.Println("GID:", g.Gid)
fmt.Println("Name:", g.Name)
```

---

[← Volver al índice](/indice)
