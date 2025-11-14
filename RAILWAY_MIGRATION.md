# Guía de Migración a Railway - TransformaDiabetes

Esta guía te llevará paso a paso para migrar tu aplicación de Replit a Railway en aproximadamente 30 minutos.

---

## ✅ Por qué Railway es la mejor opción

- **Deploy en 2 clicks** - Conecta GitHub y listo
- **Cero cambios de código** - Todo funciona como en Replit
- **Cron jobs nativos** - O puedes seguir usando cron-job.org
- **Variables de entorno fáciles** - UI simple
- **$5-10/mes** - Precio competitivo
- **Deploy automático** - Cada push a GitHub actualiza la app

---

## 📋 Requisitos Previos

- [ ] Cuenta de GitHub (gratis)
- [ ] Tarjeta de crédito (para Railway, aunque el primer mes puede ser gratis)
- [ ] Acceso a tus variables de entorno actuales de Replit

**Tiempo estimado:** 30 minutos

---

## Paso 1: Preparar Repositorio en GitHub (10 minutos)

### 1.1 Crear repositorio en GitHub

1. Ve a https://github.com/new
2. **Repository name:** `transformadiabetes`
3. **Visibility:** Private (recomendado para tu app de producción)
4. **NO** marcar ninguna opción de inicialización
5. Click "Create repository"

### 1.2 Subir código a GitHub

Desde la terminal de Replit (Shell):

```bash
# Inicializar git si no está inicializado
git init

# Crear .gitignore
cat > .gitignore << 'EOF'
node_modules
dist
.env
.env.local
*.log
.DS_Store
.replit
replit.nix
tmp
.cache
EOF

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Migration to Railway"

# Agregar remote de GitHub (REEMPLAZA con tu URL)
git remote add origin https://github.com/TU-USUARIO/transformadiabetes.git

# Cambiar a rama main
git branch -M main

# Push a GitHub
git push -u origin main
```

**⚠️ Importante:** Reemplaza `TU-USUARIO` con tu username de GitHub.

**Verificación:** Ve a tu repositorio en GitHub y confirma que ves todos los archivos.

---

## Paso 2: Crear Proyecto en Railway (5 minutos)

### 2.1 Crear cuenta

1. Ve a https://railway.app
2. Click "Login" → "Login with GitHub"
3. Autoriza Railway a acceder a GitHub
4. Agrega tu tarjeta de crédito (Railway ofrece $5 de crédito gratis)

### 2.2 Crear nuevo proyecto

1. En el dashboard de Railway, click "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Si es tu primera vez, Railway pedirá permisos adicionales:
   - Click "Configure GitHub App"
   - Selecciona tu repositorio `transformadiabetes`
   - Guarda configuración
4. De vuelta en Railway, selecciona `transformadiabetes`
5. Railway detectará automáticamente que es Node.js

### 2.3 Configuración automática

Railway automáticamente:
- ✅ Detecta `package.json`
- ✅ Ejecuta `npm install`
- ✅ Ejecuta `npm run build`
- ✅ Inicia con `npm start`

**No necesitas configurar nada más.** Railway usa tu `railway.json` para configuración adicional.

---

## Paso 3: Configurar Variables de Entorno (10 minutos)

### 3.1 Acceder a variables de entorno en Railway

1. En tu proyecto de Railway, ve a la pestaña **"Variables"**
2. Click en "Raw Editor" (más fácil para copiar/pegar)

### 3.2 Copiar variables de Replit

Desde Replit, ve a Secrets (el ícono de candado) y copia TODAS estas variables:

```bash
# Base de Datos (Neon PostgreSQL)
DATABASE_URL=postgresql://usuario:password@host.neon.tech/dbname?sslmode=require
PGHOST=ep-xxx.neon.tech
PGDATABASE=neondb
PGUSER=tu_usuario
PGPASSWORD=tu_password
PGPORT=5432

# Stripe (Producción)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID=price_xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx

# Stripe (Testing)
TESTING_STRIPE_SECRET_KEY=sk_test_xxxxx
TESTING_VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx

# Resend (Email)
RESEND_API_KEY=re_xxxxx

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxx

# Sesión
SESSION_SECRET=tu_secret_random_32_caracteres

# Entorno
NODE_ENV=production
```

### 3.3 Pegar en Railway

1. Pega todas las variables en el "Raw Editor"
2. Click "Update Variables"
3. Railway reiniciará automáticamente el deployment

**⚠️ Importante:** Asegúrate de incluir TODAS las variables. Si falta alguna, la app no funcionará.

---

## Paso 4: Obtener URL de Railway (2 minutos)

### 4.1 Generar dominio público

1. En tu proyecto de Railway, ve a la pestaña "Settings"
2. Scroll hasta "Domains"
3. Click "Generate Domain"
4. Railway te dará una URL como: `https://transformadiabetes-production-xxxx.up.railway.app`

**Guarda esta URL** - la necesitarás para Stripe y cron jobs.

### 4.2 (Opcional) Configurar dominio personalizado

Si quieres usar `transformadiabetes.online`:

1. En Railway → Settings → Domains
2. Click "Custom Domain"
3. Ingresa: `transformadiabetes.online`
4. Railway te dará instrucciones DNS:
   - Tipo: CNAME
   - Name: @
   - Value: [valor que Railway te dé]
5. Ve a tu proveedor DNS (Namecheap) y agrega el record
6. Espera 5-30 minutos para propagación

---

## Paso 5: Actualizar Stripe Webhooks (3 minutos)

### 5.1 Actualizar webhook endpoint

1. Ve a https://dashboard.stripe.com/webhooks
2. Busca tu webhook actual (probablemente apunta a Replit)
3. Click en el webhook → "..." → "Update details"
4. **Endpoint URL:** Actualiza a:
   ```
   https://transformadiabetes-production-xxxx.up.railway.app/api/stripe-webhook
   ```
   (O tu dominio personalizado si lo configuraste)
5. Verifica que estos eventos estén seleccionados:
   - ✅ `checkout.session.completed`
   - ✅ `invoice.payment_succeeded`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
6. Click "Update endpoint"

### 5.2 Actualizar signing secret

1. En Stripe, copia el nuevo "Signing secret" (empieza con `whsec_`)
2. En Railway → Variables
3. Actualiza `STRIPE_WEBHOOK_SECRET` con el nuevo valor
4. Click "Update Variables"

**Verificación:** Envía un test event desde Stripe para confirmar que funciona.

---

## Paso 6: Configurar Cron Jobs (5 minutos)

Tienes 2 opciones:

### Opción A: Seguir usando cron-job.org (Recomendado - Ya lo tienes)

**Ventaja:** Ya lo tienes configurado, solo actualiza URLs.

1. Ve a https://cron-job.org
2. Login con tu cuenta
3. Para cada cron job, click "Edit":

**Job 1: Expire Trials**
- **URL anterior:** `https://transformadiabetes.online/api/cron/expire-trials`
- **URL nueva:** `https://transformadiabetes-production-xxxx.up.railway.app/api/cron/expire-trials`

**Job 2: Send Trial Emails**
- **URL anterior:** `https://transformadiabetes.online/api/cron/send-trial-emails`
- **URL nueva:** `https://transformadiabetes-production-xxxx.up.railway.app/api/cron/send-trial-emails`

**Job 3: Weekly Post-Trial**
- **URL anterior:** `https://transformadiabetes.online/api/send-weekly-post-trial-emails`
- **URL nueva:** `https://transformadiabetes-production-xxxx.up.railway.app/api/send-weekly-post-trial-emails`

4. Guarda cada uno
5. ¡Listo! Tus cron jobs seguirán funcionando igual

### Opción B: Railway Cron (Nativo)

**Ventaja:** Todo en una plataforma.

Railway soporta cron jobs nativamente, pero requiere un plugin adicional:

1. En Railway, click "New" → "Plugin"
2. Busca "Cron" (actualmente en beta)
3. Configura los 3 jobs con sus horarios

**⚠️ Nota:** Esta funcionalidad está en beta. Es más confiable seguir usando cron-job.org.

---

## Paso 7: Verificación Final (5 minutos)

### 7.1 Verificar que la app está funcionando

1. Visita tu URL de Railway: `https://transformadiabetes-production-xxxx.up.railway.app`
2. **Deberías ver:** La landing page de TransformaDiabetes
3. **Si ves error 404 o 502:** Espera 2-3 minutos más (Railway está deployando)

### 7.2 Verificar logs

1. En Railway → tu proyecto → "Deployments"
2. Click en el deployment más reciente
3. Ve los logs en tiempo real
4. **Busca:** "Server running on port..." (confirma que inició correctamente)

### 7.3 Testing completo

**Test 1: Registro de usuario**
1. Completa el cuestionario de intake
2. Verifica que recibes el email de bienvenida
3. Verifica que recibes el informe funcional

**Test 2: Stripe**
1. Inicia sesión con un usuario trial
2. Intenta suscribirte
3. Completa el pago
4. Verifica que el webhook se recibe (revisa logs de Stripe)

**Test 3: Chat**
1. Accede al chat "Marvin Lira IA"
2. Envía un mensaje de prueba
3. Verifica que obtienes respuesta

**Test 4: Cron Jobs**
Ejecuta manualmente cada endpoint:

```bash
# Desde tu terminal
curl -X POST https://transformadiabetes-production-xxxx.up.railway.app/api/cron/expire-trials

curl -X POST https://transformadiabetes-production-xxxx.up.railway.app/api/cron/send-trial-emails

curl -X POST https://transformadiabetes-production-xxxx.up.railway.app/api/send-weekly-post-trial-emails
```

**Deberías recibir:** Emails de confirmación en `lira1914@gmail.com` con el resumen de cada job.

---

## Paso 8: Migrar el Tráfico (Opcional)

Si quieres usar tu dominio personalizado `transformadiabetes.online`:

### 8.1 Configurar DNS

En Namecheap (o tu proveedor DNS):

1. Advanced DNS → Add New Record
2. **Type:** CNAME
3. **Host:** @ (para dominio raíz) o www
4. **Value:** [el valor que Railway te dio]
5. **TTL:** Automatic
6. Save

### 8.2 Actualizar Stripe (de nuevo)

Una vez que el dominio esté activo (espera 30 minutos):

1. Stripe → Webhooks → Update endpoint
2. **Nueva URL:** `https://transformadiabetes.online/api/stripe-webhook`
3. Actualiza `STRIPE_WEBHOOK_SECRET` en Railway si cambia

### 8.3 Actualizar cron-job.org

Actualiza las 3 URLs de los cron jobs:
- De: `https://transformadiabetes-production-xxxx.up.railway.app/api/...`
- A: `https://transformadiabetes.online/api/...`

---

## 🎉 ¡Migración Completa!

Tu app ahora está corriendo en Railway. Aquí está lo que tienes:

✅ **App desplegada** - URL pública funcionando  
✅ **Variables de entorno** - Todas configuradas  
✅ **Base de datos** - Neon PostgreSQL conectada  
✅ **Stripe** - Webhooks funcionando  
✅ **Emails** - Resend configurado  
✅ **Cron jobs** - Automatizados  
✅ **Deploy automático** - Cada push a GitHub actualiza la app  

---

## 🔧 Comandos Útiles

### Ver logs en tiempo real
```bash
# Opción 1: Desde Railway Dashboard
# Settings → Deployments → Click en deployment → Ver logs

# Opción 2: Railway CLI (opcional)
npm i -g @railway/cli
railway login
railway logs
```

### Hacer cambios y actualizar
```bash
# Desde tu máquina local
git add .
git commit -m "Descripción del cambio"
git push

# Railway automáticamente:
# 1. Detecta el push
# 2. Hace build
# 3. Deploya la nueva versión
```

### Rollback a versión anterior
1. Railway → Deployments
2. Encuentra el deployment anterior que funcionaba
3. Click "Redeploy"

---

## 📊 Monitoreo y Mantenimiento

### Logs
- **Railway Dashboard:** Ver logs en tiempo real
- **Emails:** Recibirás notificaciones en `lira1914@gmail.com` cuando los cron jobs se ejecuten

### Métricas
Railway te muestra:
- CPU usage
- Memory usage
- Network traffic
- Request count

### Alertas
Configura alertas en Railway → Settings → Notifications

---

## 💰 Costos

Railway usa un modelo de pago por uso:

**Plan gratuito (Hobby):**
- $5 de crédito gratis al mes
- Suficiente para apps pequeñas

**Plan Pro ($20/mes):**
- Uso ilimitado (pagas por recursos)
- Mejor para producción

**Estimado para TransformaDiabetes:**
- Con tráfico bajo-medio: $5-10/mes
- Con tráfico alto: $10-20/mes

**Consejo:** Empieza con el plan gratuito y actualiza si lo necesitas.

---

## ❓ Troubleshooting

### Error: "Application failed to respond"
**Causa:** La app no está escuchando en el puerto correcto  
**Solución:** Railway automáticamente asigna el puerto via variable `PORT`. Verifica que tu código use:
```javascript
const port = process.env.PORT || 5000;
```
(Tu código ya lo hace correctamente)

### Error: "Database connection failed"
**Causa:** Variables de entorno incorrectas  
**Solución:**
1. Verifica que `DATABASE_URL` esté correctamente configurada
2. Asegúrate de incluir `?sslmode=require` al final
3. Verifica que Neon permite conexiones desde Railway

### Cron jobs no se ejecutan
**Causa:** URLs incorrectas en cron-job.org  
**Solución:**
1. Verifica que las URLs apunten a Railway (no a Replit)
2. Ejecuta manualmente con `curl` para verificar
3. Revisa logs de cron-job.org

### Stripe webhooks fallan
**Causa:** Signing secret incorrecto  
**Solución:**
1. Stripe Dashboard → Webhooks → Copia el signing secret
2. Railway → Variables → Actualiza `STRIPE_WEBHOOK_SECRET`
3. Envía test event desde Stripe

### Deploy falla
**Causa:** Error en build o dependencias  
**Solución:**
1. Revisa logs en Railway → Deployments
2. Verifica que `package.json` tenga los scripts correctos
3. Asegúrate de que `node_modules` NO esté en el repo

---

## 📞 Soporte

**Railway Discord:** https://discord.gg/railway  
**Railway Docs:** https://docs.railway.app  
**Railway Status:** https://status.railway.app

---

## ✅ Checklist Final

Antes de considerar la migración completa:

- [ ] Código en GitHub
- [ ] Proyecto creado en Railway
- [ ] Todas las variables de entorno configuradas
- [ ] Primer deployment exitoso (URL funciona)
- [ ] Stripe webhooks actualizados y probados
- [ ] Cron jobs actualizados en cron-job.org
- [ ] Testing completo (registro, pago, chat, emails)
- [ ] Logs muestran que todo funciona
- [ ] (Opcional) Dominio personalizado configurado
- [ ] Monitoreando por 48 horas

---

## 🚀 Próximos Pasos

1. **Monitorea durante 48 horas**
   - Revisa logs diariamente
   - Confirma que cron jobs se ejecutan
   - Verifica emails de confirmación

2. **Optimiza si es necesario**
   - Ajusta recursos en Railway si ves problemas de performance
   - Configura alertas

3. **Desactiva Replit (opcional)**
   - Una vez confirmado que Railway funciona perfectamente
   - Descarga backup del código
   - Cancela suscripción de Replit

---

**¡Felicidades!** Has migrado exitosamente TransformaDiabetes a Railway.

Tu app ahora tiene:
- ✅ Deploy automático
- ✅ Escalabilidad
- ✅ Monitoreo en tiempo real
- ✅ Backup automático via Git
- ✅ Cero downtime deployments

---

**Fecha de creación:** 14 de noviembre, 2024  
**Última actualización:** 14 de noviembre, 2024  
**Versión:** 1.0
