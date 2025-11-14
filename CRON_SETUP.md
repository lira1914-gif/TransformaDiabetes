# Configuración de Cron Jobs para TransformaDiabetes

Este documento explica cómo configurar los trabajos automatizados (cron jobs) necesarios para que TransformaDiabetes funcione correctamente en producción.

## 📋 Trabajos Cron Requeridos

### 1. Expiración de Trials (Diario)
**Endpoint:** `POST https://transformadiabetes.online/api/cron/expire-trials`

**Frecuencia:** Una vez al día (recomendado: 12:00 AM hora de México)

**Función:** Marca automáticamente como expirados los trials que cumplieron 7 días

**Cron Expression:** `0 0 * * *` (Medianoche diaria)

---

### 2. Envío de Emails Automáticos (Diario)
**Endpoint:** `POST https://transformadiabetes.online/api/cron/send-trial-emails`

**Frecuencia:** Una vez al día (recomendado: 9:00 AM hora de México)

**Función:** Envía emails de días 2-10 automáticamente, independiente de las visitas del usuario

**Cron Expression:** `0 9 * * *` (9 AM diaria)

---

### 3. Email Semanal Post-Trial (Semanal)
**Endpoint:** `POST https://transformadiabetes.online/api/send-weekly-post-trial-emails`

**Frecuencia:** Una vez a la semana (recomendado: Lunes 10:00 AM)

**Función:** Envía recordatorios semanales a usuarios que terminaron su trial pero no se suscribieron

**Cron Expression:** `0 10 * * 1` (Lunes a las 10 AM)

---

## 🚀 Opción 1: Configurar en cron-job.org (Recomendado)

### Paso 1: Crear cuenta
1. Ve a https://cron-job.org
2. Crea una cuenta gratuita
3. Confirma tu email

### Paso 2: Agregar el Job de Expiración de Trials
1. Click en "Create cronjob"
2. **Title:** TransformaDiabetes - Expire Trials
3. **URL:** `https://transformadiabetes.online/api/cron/expire-trials`
4. **Schedule:**
   - Type: Every day
   - Execution time: 00:00 (Midnight)
   - Timezone: America/Mexico_City
5. **Request method:** POST
6. Click "Create"

### Paso 3: Agregar el Job de Emails Automáticos
1. Click en "Create cronjob"
2. **Title:** TransformaDiabetes - Send Trial Emails
3. **URL:** `https://transformadiabetes.online/api/cron/send-trial-emails`
4. **Schedule:**
   - Type: Every day
   - Execution time: 09:00 (9 AM)
   - Timezone: America/Mexico_City
5. **Request method:** POST
6. Click "Create"

### Paso 4: Agregar el Job Semanal Post-Trial
1. Click en "Create cronjob"
2. **Title:** TransformaDiabetes - Weekly Post Trial
3. **URL:** `https://transformadiabetes.online/api/send-weekly-post-trial-emails`
4. **Schedule:**
   - Type: Every week
   - Day: Monday
   - Execution time: 10:00 (10 AM)
   - Timezone: America/Mexico_City
5. **Request method:** POST
6. Click "Create"

---

## 🔧 Opción 2: Vercel Cron Jobs

Si migras a Vercel, puedes usar Vercel Cron (requiere plan Pro):

### Crear archivo `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/cron/expire-trials",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/send-trial-emails",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/send-weekly-post-trial-emails",
      "schedule": "0 10 * * 1"
    }
  ]
}
```

**Nota:** Vercel Cron está limitado a 1 cron job en plan Hobby (gratis). Necesitas plan Pro para múltiples cron jobs.

---

## 🧪 Probar los Endpoints Manualmente

### Usando cURL:
```bash
# Expirar trials
curl -X POST https://transformadiabetes.online/api/cron/expire-trials

# Enviar emails automáticos
curl -X POST https://transformadiabetes.online/api/cron/send-trial-emails

# Email semanal post-trial
curl -X POST https://transformadiabetes.online/api/send-weekly-post-trial-emails
```

### Respuesta Esperada:
```json
{
  "success": true,
  "message": "Proceso completado: X emails enviados, Y errores",
  "stats": {
    "totalProcessed": 38,
    "emailsSent": 26,
    "errors": 0
  }
}
```

---

## 📊 Monitoreo

### Notificaciones al Admin
Todos los cron jobs envían un email a `lira1914@gmail.com` con:
- Fecha y hora de ejecución
- Número de usuarios procesados
- Detalles de emails enviados
- Errores (si hubo alguno)

### Logs
Los logs de cada ejecución quedan en la consola del servidor y puedes revisarlos en:
- Replit: Pestaña "Logs"
- Vercel: Dashboard → Logs

---

## ⚠️ Notas Importantes

### Rate Limits de Resend
- Límite: 2 emails por segundo
- Si hay muchos usuarios en un mismo día de trial, algunos emails pueden fallar temporalmente
- Los emails fallidos se reintentarán en la siguiente ejecución diaria

### Zona Horaria
- Todos los cron jobs usan **America/Mexico_City** como zona horaria
- Asegúrate de configurar esto en cron-job.org

### Seguridad
- Los endpoints cron son públicos pero no aceptan parámetros peligrosos
- Cada endpoint valida datos antes de procesar
- Considera agregar un secret token en el futuro para mayor seguridad

---

## ✅ Verificación

Después de configurar los cron jobs:

1. **Espera 24 horas** para la primera ejecución
2. **Revisa tu email** (lira1914@gmail.com) para confirmaciones
3. **Verifica en la base de datos** que los trials se están expirando
4. **Monitorea los logs** en cron-job.org para asegurar ejecución exitosa

---

## 🆘 Solución de Problemas

### Los emails no se envían
- Verifica que RESEND_API_KEY esté configurado
- Revisa los logs del servidor para errores
- Confirma que el dominio esté verificado en Resend

### Los trials no expiran
- Verifica que el cron job se esté ejecutando
- Revisa la tabla `users` en la base de datos
- Confirma que `trialStartDate` esté poblado correctamente

### Errores 500 en los endpoints
- Revisa los logs del servidor
- Verifica las variables de entorno
- Confirma que la base de datos esté accesible

---

**Fecha de creación:** 14 de noviembre, 2024  
**Mantenido por:** Replit Agent
