# Checklist de Variables de Entorno para Railway

Usa esta lista para verificar que tienes todas las variables de entorno necesarias antes de migrar a Railway.

---

## 📋 Variables de Entorno Requeridas

### Base de Datos (Neon PostgreSQL)

```bash
DATABASE_URL=postgresql://usuario:password@host.neon.tech/dbname?sslmode=require
PGHOST=ep-xxxxx.neon.tech
PGDATABASE=neondb
PGUSER=tu_usuario
PGPASSWORD=tu_password
PGPORT=5432
```

**Dónde encontrarlas en Replit:**
- Secrets → busca cada variable individualmente

**Cómo obtenerlas si no las tienes:**
1. Ve a https://console.neon.tech
2. Selecciona tu proyecto
3. Ve a "Connection Details"
4. Copia la cadena de conexión completa

---

### Stripe (Producción)

```bash
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID=price_xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
```

**Dónde encontrarlas:**
- Secrets en Replit
- O en https://dashboard.stripe.com/apikeys

**⚠️ Importante:** El `STRIPE_WEBHOOK_SECRET` cambiará cuando actualices el webhook en Stripe para apuntar a Railway. Lo actualizarás después del deployment.

---

### Stripe (Testing)

```bash
TESTING_STRIPE_SECRET_KEY=sk_test_xxxxx
TESTING_VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

**Dónde encontrarlas:**
- Secrets en Replit
- O en https://dashboard.stripe.com/test/apikeys

---

### Resend (Email)

```bash
RESEND_API_KEY=re_xxxxx
```

**Dónde encontrarla:**
- Secrets en Replit
- O en https://resend.com/api-keys

---

### OpenAI

```bash
OPENAI_API_KEY=sk-proj-xxxxx
```

**Dónde encontrarla:**
- Secrets en Replit
- O en https://platform.openai.com/api-keys

---

### Sesión

```bash
SESSION_SECRET=tu_secret_random_32_caracteres
```

**Dónde encontrarla:**
- Secrets en Replit

**Si no la tienes o quieres generar una nueva:**
```bash
# Desde terminal, genera un string random:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Entorno

```bash
NODE_ENV=production
```

**Valor fijo:** Siempre usa `production` en Railway.

---

## 🔍 Verificación

Marca cada variable que ya tienes copiada:

### Base de Datos
- [ ] DATABASE_URL
- [ ] PGHOST
- [ ] PGDATABASE
- [ ] PGUSER
- [ ] PGPASSWORD
- [ ] PGPORT

### Stripe Producción
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET (actualizarás después)
- [ ] STRIPE_PRICE_ID
- [ ] VITE_STRIPE_PUBLIC_KEY

### Stripe Testing
- [ ] TESTING_STRIPE_SECRET_KEY
- [ ] TESTING_VITE_STRIPE_PUBLIC_KEY

### Otros Servicios
- [ ] RESEND_API_KEY
- [ ] OPENAI_API_KEY
- [ ] SESSION_SECRET
- [ ] NODE_ENV

**Total:** 17 variables

---

## 📝 Formato para Railway

Railway acepta variables en formato "Raw Editor". Copia este template y reemplaza los valores:

```bash
DATABASE_URL=postgresql://usuario:password@host.neon.tech/dbname?sslmode=require
PGHOST=ep-xxxxx.neon.tech
PGDATABASE=neondb
PGUSER=tu_usuario
PGPASSWORD=tu_password
PGPORT=5432
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID=price_xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
TESTING_STRIPE_SECRET_KEY=sk_test_xxxxx
TESTING_VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
RESEND_API_KEY=re_xxxxx
OPENAI_API_KEY=sk-proj-xxxxx
SESSION_SECRET=tu_secret_random_32_caracteres
NODE_ENV=production
```

---

## ⚠️ Seguridad

**NUNCA:**
- ❌ Compartas estas variables públicamente
- ❌ Las commits a GitHub
- ❌ Las incluyas en screenshots

**SIEMPRE:**
- ✅ Usa el Secrets/Environment Variables UI de las plataformas
- ✅ Genera nuevos secrets si sospechas que fueron expuestos
- ✅ Usa diferentes keys para testing y producción

---

## 🔄 Actualización de STRIPE_WEBHOOK_SECRET

**Importante:** Después de crear el proyecto en Railway:

1. Railway te dará una URL: `https://tu-app.railway.app`
2. Ve a Stripe Dashboard → Webhooks
3. Actualiza el endpoint a tu nueva URL de Railway
4. Stripe generará un nuevo signing secret (`whsec_xxx`)
5. Copia ese nuevo secret
6. En Railway → Variables → Actualiza `STRIPE_WEBHOOK_SECRET`

---

**Listo para copiar:** Una vez que tengas todas las variables marcadas, puedes continuar con la migración a Railway.
