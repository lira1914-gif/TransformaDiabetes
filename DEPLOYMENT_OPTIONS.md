# Opciones de Deployment para TransformaDiabetes

Tu aplicación usa Express.js como servidor monolítico con Vite para el frontend. Esto funciona mejor en plataformas que soportan servidores Node.js tradicionales.

---

## ⚠️ Importante: Vercel NO es ideal para esta app

**Vercel está optimizado para:**
- Funciones serverless individuales
- Next.js / frameworks serverless-first
- Apps totalmente estáticas

**Tu app necesita:**
- Servidor Express persistente
- WebSockets (chat)
- Cron jobs automatizados
- Sesiones server-side

**Resultado:** Vercel requeriría reescribir toda la arquitectura.

---

## ✅ Opciones Recomendadas

### Opción 1: Railway (⭐ MÁS RECOMENDADA)

**Por qué es mejor:**
- Soporta servidores Node.js tradicionales
- Deploy automático desde GitHub
- Variables de entorno fáciles
- Cron jobs nativos
- $5-10/mes

**Pasos de migración:**

1. **Crear cuenta en Railway**
   - Ve a https://railway.app
   - Sign up con GitHub

2. **Crear proyecto**
   - Click "New Project" → "Deploy from GitHub repo"
   - Selecciona tu repo
   - Railway detecta automáticamente Node.js

3. **Configuración automática**
   - Railway usa `npm run build` y `npm start`
   - Todo funciona sin modificaciones

4. **Agregar variables de entorno**
   - En Railway Dashboard → Variables
   - Agrega todas tus secrets de Replit

5. **Configurar cron jobs**
   - Railway soporta cron nativamente
   - Agrega en railway.json:
   ```json
   {
     "cron": {
       "expire-trials": {
         "schedule": "0 6 * * *",
         "command": "curl -X POST http://localhost:$PORT/api/cron/expire-trials"
       },
       "send-emails": {
         "schedule": "0 15 * * *",
         "command": "curl -X POST http://localhost:$PORT/api/cron/send-trial-emails"
       }
     }
   }
   ```

6. **Listo**
   - Railway te da una URL: `https://tu-app.railway.app`
   - Actualiza Stripe webhooks
   - Todo funciona igual que en Replit

---

### Opción 2: Render

**Por qué funciona bien:**
- Soporta Node.js nativo
- Cron jobs integrados
- Deploy desde GitHub
- Plan gratuito disponible

**Pasos:**

1. **Crear cuenta:** https://render.com
2. **New Web Service** → Conecta GitHub
3. **Configuración:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Add Environment Variables (todas tus secrets)

4. **Cron Jobs:**
   - Render → Cron Jobs → New Cron Job
   - Agrega los 3 endpoints con sus horarios

**Precio:** Gratis (con limitaciones) o $7/mes

---

### Opción 3: DigitalOcean App Platform

**Por qué funciona:**
- Node.js nativo
- Escalable
- Muy estable

**Pasos:**
1. Crear cuenta en https://www.digitalocean.com
2. Apps → Create App → GitHub
3. Configurar build/start commands
4. Agregar variables de entorno
5. Usar cron-job.org para cron jobs

**Precio:** $5-12/mes

---

### Opción 4: Heroku

**Por qué funciona:**
- Clásico para Node.js
- Muy maduro
- Muchos addons

**Pasos:**
1. Crear cuenta en https://heroku.com
2. Crear app desde GitHub
3. Configurar buildpack Node.js
4. Agregar variables de entorno
5. Usar Heroku Scheduler para cron jobs

**Precio:** $5-7/mes (plan Eco)

---

## 📊 Comparación de Opciones

| Característica | Railway | Render | DigitalOcean | Heroku | Vercel |
|----------------|---------|--------|--------------|--------|--------|
| Setup | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ❌ |
| Node.js Express | ✅ Nativo | ✅ Nativo | ✅ Nativo | ✅ Nativo | ⚠️ Serverless |
| Cron Jobs | ✅ Nativo | ✅ Nativo | ⚠️ Externo | ✅ Scheduler | ⚠️ Plan Pro |
| WebSockets | ✅ | ✅ | ✅ | ✅ | ❌ |
| Precio/mes | $5-10 | $7-25 | $5-12 | $5-7 | Gratis-$20 |
| Deploy | Auto | Auto | Auto | Auto | Auto |
| Recomendación | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ |

---

## 🚀 Guía Rápida: Railway (20 minutos)

### 1. Preparar código en GitHub
```bash
# Si no lo has hecho:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU-USUARIO/transformadiabetes.git
git push -u origin main
```

### 2. Deploy en Railway

1. Ve a https://railway.app
2. Click "Start a New Project"
3. "Deploy from GitHub repo" → Selecciona tu repo
4. Railway detecta Node.js automáticamente
5. Click "Deploy Now"

### 3. Agregar Variables de Entorno

En Railway Dashboard → tu proyecto → Variables:

```
DATABASE_URL=postgresql://...
PGHOST=...
PGDATABASE=neondb
PGUSER=...
PGPASSWORD=...
PGPORT=5432
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
RESEND_API_KEY=re_...
OPENAI_API_KEY=sk-proj-...
SESSION_SECRET=[random-32-chars]
NODE_ENV=production
```

### 4. Configurar Dominio (Opcional)

1. Railway → Settings → Domains
2. Agrega `transformadiabetes.online`
3. Configura DNS según instrucciones

### 5. Actualizar Stripe Webhooks

1. Stripe Dashboard → Webhooks
2. Actualiza URL: `https://transformadiabetes.railway.app/api/stripe-webhook`
3. Copia nuevo signing secret
4. Actualiza `STRIPE_WEBHOOK_SECRET` en Railway

### 6. Configurar Cron Jobs

**Opción A: Railway Cron (Nativo)**

Crea `railway.json` en la raíz:

```json
{
  "cron": {
    "expire-trials": {
      "schedule": "0 6 * * *",
      "command": "curl -X POST https://transformadiabetes.railway.app/api/cron/expire-trials"
    },
    "send-emails": {
      "schedule": "0 15 * * *",
      "command": "curl -X POST https://transformadiabetes.railway.app/api/cron/send-trial-emails"
    },
    "weekly-emails": {
      "schedule": "0 16 * * 1",
      "command": "curl -X POST https://transformadiabetes.railway.app/api/send-weekly-post-trial-emails"
    }
  }
}
```

**Opción B: cron-job.org (Ya configurado)**

Simplemente actualiza las URLs en cron-job.org:
- De: `https://transformadiabetes.online/api/...`
- A: `https://transformadiabetes.railway.app/api/...`

### 7. Verificar

1. Visita tu app: `https://transformadiabetes.railway.app`
2. Prueba registro de usuario
3. Prueba pago con Stripe
4. Verifica que lleguen emails
5. Ejecuta manualmente los cron endpoints

---

## ✅ Checklist de Migración

- [ ] Código en GitHub
- [ ] Proyecto creado en Railway/Render
- [ ] Variables de entorno configuradas
- [ ] Primer deployment exitoso
- [ ] Stripe webhooks actualizados
- [ ] Cron jobs configurados
- [ ] Dominio configurado (opcional)
- [ ] Testing completo
- [ ] Monitoreo por 48 horas

---

## ❓ FAQ

**¿Por qué no Vercel?**
Vercel está diseñado para apps serverless. Tu app usa Express monolítico con WebSockets y sesiones, lo cual requiere refactorizar todo el backend.

**¿Cuál es la opción más barata?**
- Render (plan gratuito con limitaciones)
- Railway ($5/mes)
- Heroku ($5/mes)

**¿Cuál es la más fácil?**
Railway - Deploy en literalmente 2 clicks.

**¿Puedo seguir usando cron-job.org?**
¡Sí! Funciona con cualquier plataforma. Solo actualiza las URLs.

**¿Qué pasa con la base de datos?**
Neon (tu base de datos actual) funciona con todas estas plataformas. Solo copia las mismas variables de entorno.

---

**Recomendación final:** Usa Railway. Es la opción más simple, funciona perfectamente con tu stack actual, y no requiere modificaciones de código.

---

**Fecha:** 14 de noviembre, 2024
