# log/syslog — Logging al syslog del sistema

Escribe mensajes al syslog del sistema operativo (solo Unix).

```go
import "log/syslog"
```

---

```go
logger, _ := syslog.New(syslog.LOG_INFO|syslog.LOG_DAEMON, "miapp")
logger.Info("Servidor iniciado")
logger.Err("Error de conexión")
```

| Prioridad | Significado |
|-----------|-------------|
| `syslog.LOG_EMERG` | Sistema inutilizable |
| `syslog.LOG_ALERT` | Acción inmediata |
| `syslog.LOG_CRIT` | Condición crítica |
| `syslog.LOG_ERR` | Error |
| `syslog.LOG_WARNING` | Advertencia |
| `syslog.LOG_NOTICE` | Condición normal pero significativa |
| `syslog.LOG_INFO` | Informativo |
| `syslog.LOG_DEBUG` | Debug |

---

[← Volver al índice](/indice)
