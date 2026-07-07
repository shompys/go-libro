# Control de flujo (if, switch, for)

templ usa las sentencias estándar de Go para control de flujo.

## if / else

```templ
templ login(estaLogueado bool) {
    if estaLogueado {
        <div>Bienvenido de vuelta!</div>
    } else {
        <a href="/login">Iniciar sesión</a>
    }
}
```

### if con inicialización

```templ
templ estado(items []Item) {
    if count := len(items); count > 0 {
        <p>Hay { count } items</p>
    } else {
        <p>No hay items</p>
    }
}
```

## switch

```templ
templ tipoUsuario(tipo string) {
    switch tipo {
        case "admin":
            <span class="badge-red">Admin</span>
        case "editor":
            <span class="badge-blue">Editor</span>
        default:
            <span class="badge-gray">Usuario</span>
    }
}
```

## for

### Range sobre slices

```templ
templ lista(items []Item) {
    <ul>
        for _, item := range items {
            <li>{ item.Nombre }</li>
        }
    </ul>
}
```

### Range con índice

```templ
templ listaNumerada(items []string) {
    <ol>
        for i, item := range items {
            <li>{ i }: { item }</li>
        }
    </ol>
}
```

### For clásico

```templ
templ tabla() {
    <table>
        for i := 0; i < 5; i++ {
            <tr><td>Fila { i }</td></tr>
        }
    </table>
}
```

## Combinar control de flujo

```templ
templ feed(posts []Post, user User) {
    <div class="feed">
        if len(posts) == 0 {
            <p>No hay publicaciones todavía.</p>
        } else {
            for _, post := range posts {
                <article>
                    <h2>{ post.Titulo }</h2>
                    <p>{ post.Contenido }</p>
                    if post.AutorID == user.ID {
                        <a href={ fmt.Sprintf("/edit/%d", post.ID) }>Editar</a>
                    }
                </article>
            }
        }
    </div>
}
```

## Nota sobre texto que empieza con if/for/switch

Si necesitás que un texto empiece literalmente con las palabras `if`, `for` o `switch`, usá una expresión de string:

```templ
templ texto() {
    <p>Switch to Linux</p>
    <p>{ "for siempre" }</p>
    <p>{ `if llueve` }</p>
}
```

Si un texto empieza con `if`, `for` o `switch` pero no tiene `{` de apertura, templ da error de compilación.

---

[← Volver al índice](/no-estandard/templ)
